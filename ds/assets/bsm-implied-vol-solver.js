// Implied-volatility solver stepper (BSM, non-dividend stock). Bisection or linear interpolation, step by step.
//
// Markup:
//   <div class="ivsolver" data-s="48" data-k="50" data-r="4" data-t="0.25" data-type="call"
//        data-price="2.00" data-lo="20" data-hi="40" data-method="bisection"></div>
//   data-r, data-lo, data-hi are in percent. data-method: bisection | interpolation.
// Press "Step" to do one iteration, "Run 8" for eight, "Reset" to restart. The table shows the bracket,
// the trial vol, the BSM price at that vol and whether it is too high or too low versus the market price.
// Needs assets/style.css for colour variables. Injects its own small stylesheet once. Plain text only (no KaTeX).

(function () {
  const CSS = `
.ivsolver { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .85rem; }
.ivsolver .iv-controls { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .5rem 1rem; }
.ivsolver label { display: flex; flex-direction: column; color: var(--muted); font-size: .75rem; }
.ivsolver input, .ivsolver select { font: inherit; font-size: .88rem; padding: .3rem .4rem; border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); color: var(--fg); width: 100%; }
.ivsolver .iv-btns { display: flex; gap: .5rem; margin: .8rem 0 .4rem; flex-wrap: wrap; }
.ivsolver .iv-btns button { font: 500 .85rem Inter, system-ui, sans-serif; padding: .4rem .9rem; border-radius: 6px; border: 1px solid var(--rule); background: var(--card); color: var(--fg); cursor: pointer; }
.ivsolver .iv-btns button:hover { border-color: var(--accent); }
.ivsolver table { font-variant-numeric: tabular-nums; font-size: .82rem; margin: .4rem 0; }
.ivsolver td.hi { color: var(--bad); } .ivsolver td.lo { color: var(--ok); }
.ivsolver .iv-note { color: var(--muted); font-size: .8rem; }
.ivsolver .iv-warn { margin-top: .5rem; padding: .5rem .8rem; border-radius: 6px; background: var(--trap-bg); border-left: 4px solid var(--trap); display: none; }
`;
  function injectCSS() {
    if (document.getElementById('ivsolver-css')) return;
    const s = document.createElement('style'); s.id = 'ivsolver-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  // Standard normal cdf (Abramowitz & Stegun 26.2.17, error < 1e-7).
  function N(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014327 * Math.exp(-x * x / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  }
  function bsm(S, K, r, T, sig, type) {
    const sd = sig * Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + sig * sig / 2) * T) / sd, d2 = d1 - sd;
    return type === 'call' ? S * N(d1) - K * Math.exp(-r * T) * N(d2) : K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
  }
  const pct = (x) => (x * 100).toFixed(2) + '%';

  function build(root) {
    const ds = root.dataset;
    const cfg = {
      s: ds.s || 48, k: ds.k || 50, r: ds.r || 4, t: ds.t || 0.25, price: ds.price || 2.0,
      lo: ds.lo || 20, hi: ds.hi || 40, type: ds.type || 'call', method: ds.method || 'bisection',
    };
    const fields = [
      ['s', 'Stock S0', 'number'], ['k', 'Strike K', 'number'], ['r', 'Rate r (% p.a.)', 'number'], ['t', 'Time T (years)', 'number'],
      ['price', 'Market option price', 'number'], ['lo', 'Low vol (%)', 'number'], ['hi', 'High vol (%)', 'number'],
    ];
    const controls = document.createElement('div'); controls.className = 'iv-controls';
    const inputs = {};
    fields.forEach(([key, label]) => {
      const l = document.createElement('label'); l.append(label);
      const i = document.createElement('input'); i.type = 'number'; i.step = 'any'; i.value = cfg[key];
      i.addEventListener('input', reset); inputs[key] = i; l.append(i); controls.append(l);
    });
    const mk = (key, label, opts) => {
      const l = document.createElement('label'); l.append(label);
      const sel = document.createElement('select');
      opts.forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; if (v === cfg[key]) o.selected = true; sel.append(o); });
      sel.addEventListener('change', reset); inputs[key] = sel; l.append(sel); controls.append(l);
    };
    mk('type', 'Option', [['call', 'Call'], ['put', 'Put']]);
    mk('method', 'Method', [['bisection', 'Bisection (midpoint)'], ['interpolation', 'Linear interpolation']]);

    const btns = document.createElement('div'); btns.className = 'iv-btns';
    const mkBtn = (txt, fn) => { const b = document.createElement('button'); b.textContent = txt; b.addEventListener('click', fn); btns.append(b); };
    const out = document.createElement('div');
    const warn = document.createElement('div'); warn.className = 'iv-warn';
    root.append(controls, btns, out, warn);

    let rows = [], lo, hi, params;
    function read() {
      const g = (k) => parseFloat(inputs[k].value);
      return { S: g('s'), K: g('k'), r: g('r') / 100, T: g('t'), c: g('price'), lo: g('lo') / 100, hi: g('hi') / 100, type: inputs.type.value, method: inputs.method.value };
    }
    function reset() { rows = []; params = read(); lo = params.lo; hi = params.hi; render(); }
    function step() {
      const p = params;
      if (!(p.S > 0 && p.K > 0 && p.T > 0 && p.lo > 0 && p.hi > p.lo && p.c > 0)) return;
      const clo = bsm(p.S, p.K, p.r, p.T, lo, p.type), chi = bsm(p.S, p.K, p.r, p.T, hi, p.type);
      if (rows.length === 0 && (p.c < clo || p.c > chi)) { render(true); return; }
      let trial;
      if (p.method === 'bisection') trial = (lo + hi) / 2;
      else trial = lo + (p.c - clo) / (chi - clo) * (hi - lo);
      const v = bsm(p.S, p.K, p.r, p.T, trial, p.type);
      rows.push({ lo, hi, clo, chi, trial, v, high: v > p.c });
      if (v > p.c) hi = trial; else lo = trial;
      render();
    }
    function render(bad) {
      warn.style.display = bad ? 'block' : 'none';
      if (bad) warn.textContent = 'The market price is outside the prices at your low and high vols: widen the bracket (the price must lie between the two BSM values).';
      const p = params;
      let h = '<table><tr><th>#</th><th>Low vol</th><th>High vol</th><th>Trial vol</th><th>BSM price at trial (exact N)</th><th>vs market ' + (isFinite(p.c) ? p.c.toFixed(2) : '') + '</th></tr>';
      rows.forEach((r, i) => {
        h += `<tr><td>${i + 1}</td><td>${pct(r.lo)}</td><td>${pct(r.hi)}</td><td>${pct(r.trial)}</td><td>${r.v.toFixed(4)}</td>` +
          `<td class="${r.high ? 'hi' : 'lo'}">${r.high ? 'too high: vol too high, lower the top' : 'too low: vol too low, raise the bottom'}</td></tr>`;
      });
      h += '</table>';
      let exact = '';
      if (p.c > 0 && p.S > 0 && p.K > 0 && p.T > 0) {
        let a = 1e-4, b = 5;
        for (let i = 0; i < 100; i++) { const m = (a + b) / 2; if (bsm(p.S, p.K, p.r, p.T, m, p.type) > p.c) b = m; else a = m; }
        const lb = bsm(p.S, p.K, p.r, p.T, 1e-4, p.type);
        exact = p.c > lb ? 'Exact implied vol (fine bisection): <b>' + pct((a + b) / 2) + '</b>.' : 'Market price is at or below the zero-vol value: no positive implied vol.';
      }
      out.innerHTML = h + '<div class="iv-note">Prices use exact normal probabilities, not the 4 dp exam table. Price rises with vol, so "too high" means the trial vol is above the implied vol. ' + exact + '</div>';
    }
    mkBtn('Step', step);
    mkBtn('Run 8', () => { for (let i = 0; i < 8; i++) step(); });
    mkBtn('Reset', reset);
    reset();
  }
  function init() { injectCSS(); document.querySelectorAll('.ivsolver').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
