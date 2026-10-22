// BSM / Black's-model calculator (self-contained; first used in Lesson 27).
//
// Usage: <div class="bbc" data-mode="futures" data-s="78" data-k="80" data-sigma="0.30"
//             data-r="0.04" data-t="0.25" data-q="0"></div>
//        <script src="../assets/bsm-blacks-calculator.js"></script>
// data-mode: "futures" (S field is the futures price F0, Black's model),
//            "yield" (stock/index with dividend yield q, or currency with q = r_f; q = 0 is plain BSM).
// Shows d1, d2 (to 2 dp, table style), N(.) from the rounded d, the price from tables and from
// unrounded d, and the put-call parity check. Styles use the lesson CSS variables.

(function () {
  const CSS = `
.bbc { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.bbc .bc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .45rem 1rem; }
.bbc label { display: flex; flex-direction: column; gap: .15rem; }
.bbc input[type=range] { width: 100%; accent-color: var(--accent); }
.bbc select { font: inherit; padding: .25rem; background: var(--bg); color: var(--fg); border: 1px solid var(--rule); border-radius: 4px; }
.bbc .bo { margin-top: .8rem; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .3rem 1rem; font-variant-numeric: tabular-nums; }
.bbc .bo b { font-size: .95rem; }
.bbc .bn { color: var(--muted); margin-top: .5rem; }
`;
  function injectCSS() {
    if (document.getElementById('bbc-css')) return;
    const s = document.createElement('style'); s.id = 'bbc-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function erf(x) { // Abramowitz-Stegun 7.1.26 is too coarse; use a series/continued fraction hybrid
    const sign = x < 0 ? -1 : 1; x = Math.abs(x);
    if (x < 3) { let sum = x, term = x; for (let n = 1; n < 80; n++) { term *= -x * x / n; sum += term / (2 * n + 1); } return sign * 2 / Math.sqrt(Math.PI) * sum; }
    let f = 0; for (let k = 60; k >= 1; k--) f = k / 2 / (x + f);
    return sign * (1 - Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + f));
  }
  const Nf = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
  const r2 = (x) => Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100;
  const r4 = (x) => Math.round(x * 1e4 + 1e-7) / 1e4;
  const f4 = (x) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(4);
  const f2 = (x) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2);

  function compute(o) {
    // Effective spot S* (what replaces S0) and forward-style d1.
    const adj = o.mode === 'futures' ? o.S * Math.exp(-o.r * o.T) : o.S * Math.exp(-o.q * o.T);
    const drift = o.mode === 'futures' ? 0 : o.r - o.q;
    const sd = o.sigma * Math.sqrt(o.T);
    const d1 = (Math.log(o.S / o.K) + (drift + o.sigma * o.sigma / 2) * o.T) / sd, d2 = d1 - sd;
    const disc = Math.exp(-o.r * o.T);
    const price = (a, b) => ({
      c: adj * Nf(a) - o.K * disc * Nf(b),
      p: o.K * disc * Nf(-b) - adj * Nf(-a),
    });
    const ex = price(d1, d2);
    const D1 = r2(d1), D2 = r2(d2);
    const tb = {
      c: adj * r4(Nf(D1)) - o.K * disc * r4(Nf(D2)),
      p: o.K * disc * r4(Nf(-D2)) - adj * r4(Nf(-D1)),
    };
    return { adj, d1, d2, D1, D2, ex, tb, disc, N: [r4(Nf(D1)), r4(Nf(D2)), r4(Nf(-D1)), r4(Nf(-D2))] };
  }

  function build(el) {
    const mode = el.dataset.mode === 'yield' ? 'yield' : 'futures';
    const num = (k, d) => (el.dataset[k] !== undefined ? parseFloat(el.dataset[k]) : d);
    const sName = mode === 'futures' ? 'Futures price F₀' : 'Spot S₀';
    const defs = { S: num('s', 78), K: num('k', 80), sigma: num('sigma', 0.3), r: num('r', 0.04), T: num('t', 0.25), q: num('q', 0) };
    const fields = [
      ['S', sName, 0.5 * defs.S, 1.5 * defs.S, defs.S < 20 ? 0.01 : 0.5],
      ['K', 'Strike K', 0.5 * defs.K, 1.5 * defs.K, defs.K < 20 ? 0.01 : 0.5],
      ['sigma', 'Volatility σ', 0.05, 0.8, 0.01],
      ['r', 'Rate r', 0, 0.15, 0.005],
      ['T', 'Time T (years)', 0.05, 2, 0.05],
    ];
    if (mode === 'yield') fields.push(['q', 'Yield q (or foreign rate r_f)', 0, 0.12, 0.005]);
    el.innerHTML = '<div class="bc">' + fields.map(([id, lab, mn, mx, st]) =>
      `<label>${lab}: <b data-v="${id}"></b><input type="range" data-id="${id}" min="${mn}" max="${mx}" step="${st}" value="${defs[id]}"></label>`).join('') +
      '</div><div class="bo"></div><div class="bn"></div>';
    const vals = Object.assign({}, defs, { mode });
    const out = el.querySelector('.bo'), note = el.querySelector('.bn');
    function draw() {
      el.querySelectorAll('input[data-id]').forEach((inp) => { vals[inp.dataset.id] = parseFloat(inp.value); });
      el.querySelectorAll('[data-v]').forEach((b) => {
        const id = b.dataset.v, v = vals[id];
        b.textContent = (id === 'sigma' || id === 'r' || id === 'q') ? (v * 100).toFixed(1) + '%' : v.toFixed(id === 'T' ? 2 : 2);
      });
      const R = compute(vals);
      const cells = [
        ['Replaces S₀', f4(R.adj)],
        ['d₁ / d₂', f4(R.d1) + ' / ' + f4(R.d2)],
        ['2 dp for tables', f2(R.D1) + ' / ' + f2(R.D2)],
        ['N(d₁), N(d₂)', R.N[0].toFixed(4) + ', ' + R.N[1].toFixed(4)],
        ['N(−d₁), N(−d₂)', R.N[2].toFixed(4) + ', ' + R.N[3].toFixed(4)],
        ['Discount e^{−rT}', R.disc.toFixed(4)],
        ['Call (tables)', f4(R.tb.c)],
        ['Put (tables)', f4(R.tb.p)],
        ['c − p (tables)', f4(R.tb.c - R.tb.p)],
        ['Call (unrounded d)', f4(R.ex.c)],
        ['Put (unrounded d)', f4(R.ex.p)],
        ['Parity gap c − p', f4(R.ex.c - R.ex.p)],
      ];
      out.innerHTML = cells.map(([k, v]) => `<div>${k}: <b>${v}</b></div>`).join('');
      const par = mode === 'futures' ? vals.S * Math.exp(-vals.r * vals.T) - vals.K * R.disc : R.adj - vals.K * R.disc;
      note.textContent = 'Exact parity gap should equal ' + f4(par) + (mode === 'futures' ? ' = e^{−rT}(F₀ − K).' : ' = S₀e^{−qT} − Ke^{−rT}.') + ' Tables can shift the answer by a few cents; the exam expects the formula-sheet table (pp.5-6): d2 = unrounded d1 - sigma*sqrt(T), both to 2 dp, N to 4 dp.';
    }
    el.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw));
    draw();
  }

  injectCSS();
  function init() { document.querySelectorAll('.bbc').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
