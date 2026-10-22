// BSM price explorer (self-contained; first used in Lesson 24).
//
// Usage: <div class="bsmx" data-s="52" data-k="50" data-r="0.06" data-sigma="0.25" data-t="0.5"
//             data-tunit="years" data-sliders="on"></div>
//        <script src="../assets/bsm-price-explorer.js"></script>
// Every .bsmx becomes: inputs S, K, r, sigma, T -> shown working (ln(S/K), d1, d2, d rounded to 2dp,
// N(.) read "from the table" to 4dp, Ke^{-rT}, c, p) for the TABLE method (d2 from unrounded d1, then d to 2dp, N to 4dp, no interpolation, as the
// formula-sheet tables) next to the EXACT unrounded answer, plus a parity check, sanity checks and a small
// c/p-versus-S chart. data-r and data-sigma are decimals (0.06 = 6%); the boxes show percent.
// data-tunit="years" | "months" sets the unit shown for T (data-t is always in years).
// data-sliders="off" hides the sliders. Styles use the lesson CSS variables. Plain-text output (no KaTeX).

(function () {
  const CSS = `
.bsmx { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.bsmx .bc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .5rem 1rem; }
.bsmx label { display: flex; flex-direction: column; gap: .15rem; }
.bsmx .bi { display: flex; gap: .4rem; align-items: center; }
.bsmx input[type=number] { font: inherit; width: 100%; min-width: 0; padding: .3rem .4rem; background: var(--bg); color: var(--fg); border: 1px solid var(--rule); border-radius: 4px; }
.bsmx input[type=range] { width: 100%; accent-color: var(--accent); }
.bsmx select { font: inherit; padding: .25rem; background: var(--bg); color: var(--fg); border: 1px solid var(--rule); border-radius: 4px; }
.bsmx table { font-size: .82rem; margin: .8rem 0 .4rem; font-variant-numeric: tabular-nums; }
.bsmx td, .bsmx th { padding: .25rem .5rem; }
.bsmx td.num, .bsmx th.num { text-align: right; white-space: nowrap; }
.bsmx tr.res td { font-weight: 600; border-bottom: 2px solid var(--rule); }
.bsmx .bchk { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .2rem 1rem; margin-top: .4rem; }
.bsmx .ok { color: var(--ok); } .bsmx .bad { color: var(--bad); font-weight: 600; }
.bsmx svg { width: 100%; height: auto; margin-top: .6rem; }
.bsmx svg text { font-family: Inter, system-ui, sans-serif; font-variant-numeric: tabular-nums; }
.bsmx .bn { color: var(--muted); margin-top: .4rem; }
`;
  function injectCSS() {
    if (document.getElementById('bsmx-css')) return;
    const s = document.createElement('style'); s.id = 'bsmx-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  // Standard normal cdf: Phi(x) = 1/2 + phi(x)(x + x^3/3 + x^5/15 + ...), symmetric about 0.
  function N(x) {
    const a = Math.abs(x);
    if (a > 8.5) return x > 0 ? 1 : 0;
    let term = a, sum = a;
    for (let n = 1; n < 400; n++) { term *= a * a / (2 * n + 1); sum += term; if (term < 1e-17 * sum) break; }
    const v = 0.5 + sum * Math.exp(-a * a / 2) / Math.sqrt(2 * Math.PI);
    return x >= 0 ? v : 1 - v;
  }
  const r2 = (x) => { const v = Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100; return v === 0 ? 0 : v; };
  const r4 = (x) => Math.round(N(x) * 1e4 + 1e-9) / 1e4;
  const f = (x, k) => (Object.is(x, -0) || Math.abs(x) < 0.5 * Math.pow(10, -k) ? 0 : x).toFixed(k).replace('-', '−');

  function calc(S, K, r, s, T) {
    const sq = s * Math.sqrt(T), lnSK = Math.log(S / K), drift = (r + s * s / 2) * T;
    const d1 = (lnSK + drift) / sq, d2 = d1 - sq, pv = K * Math.exp(-r * T);
    const a = r2(d1), b = r2(d2);
    const tab = { N1: r4(a), N2: r4(b), M1: r4(-a), M2: r4(-b) };
    const c = S * tab.N1 - pv * tab.N2, p = pv * tab.M2 - S * tab.M1;
    const ce = S * N(d1) - pv * N(d2), pe = pv * N(-d2) - S * N(-d1);
    return { sq, lnSK, drift, d1, d2, pv, a, b, tab, c, p, ce, pe };
  }

  function chart(K, r, s, T, S) {
    const W = 640, H = 200, L = 40, B = 24, lo = 0.5 * K, hi = 1.5 * K;
    const pts = [];
    for (let i = 0; i <= 60; i++) { const x = lo + (hi - lo) * i / 60, o = calc(x, K, r, s, T); pts.push([x, o.ce, o.pe]); }
    const ymax = Math.max(...pts.map((q) => Math.max(q[1], q[2]))) * 1.05 || 1;
    const X = (x) => L + (x - lo) / (hi - lo) * (W - L - 10), Y = (y) => H - B - y / ymax * (H - B - 10);
    const path = (idx) => pts.map((q, i) => (i ? 'L' : 'M') + X(q[0]).toFixed(1) + ' ' + Y(q[idx]).toFixed(1)).join(' ');
    const pv = K * Math.exp(-r * T);
    const lb = 'M' + X(lo) + ' ' + Y(0) + ' L' + X(Math.min(pv, hi)) + ' ' + Y(0) + ' L' + X(hi) + ' ' + Y(hi - pv);
    const sx = Math.min(Math.max(S, lo), hi), cur = calc(sx, K, r, s, T);
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Call and put price against stock price">
<line x1="${L}" y1="${H - B}" x2="${W - 10}" y2="${H - B}" stroke="var(--rule)"/>
<path d="${lb}" fill="none" stroke="var(--muted)" stroke-dasharray="4 3"/>
<path d="${path(1)}" fill="none" stroke="var(--accent)" stroke-width="2"/>
<path d="${path(2)}" fill="none" stroke="var(--ok)" stroke-width="2"/>
<line x1="${X(sx)}" y1="10" x2="${X(sx)}" y2="${H - B}" stroke="var(--rule)" stroke-dasharray="2 3"/>
<circle cx="${X(sx)}" cy="${Y(cur.ce)}" r="4" fill="var(--accent)"/><circle cx="${X(sx)}" cy="${Y(cur.pe)}" r="4" fill="var(--ok)"/>
<text x="${L}" y="${H - 6}" font-size="11" fill="var(--muted)">S = ${f(lo, 0)}</text>
<text x="${W - 10}" y="${H - 6}" font-size="11" fill="var(--muted)" text-anchor="end">S = ${f(hi, 0)}</text>
<text x="${W - 14}" y="22" font-size="11" fill="var(--accent)" text-anchor="end">call c</text>
<text x="${W - 14}" y="36" font-size="11" fill="var(--ok)" text-anchor="end">put p</text>
<text x="${W - 14}" y="50" font-size="11" fill="var(--muted)" text-anchor="end">dashed: max(S − Ke^(−rT), 0)</text></svg>`;
  }

  function build(root) {
    const g = (k, d) => root.dataset[k] !== undefined ? root.dataset[k] : d;
    const st = { S: +g('s', 50), K: +g('k', 50), r: +g('r', 0.05), s: +g('sigma', 0.3), T: +g('t', 0.5) };
    let unit = g('tunit', 'years'); const sliders = g('sliders', 'on') !== 'off';
    const defs = [
      { k: 'S', lab: 'Stock price S0 ($)', min: 1, max: 200, step: 0.5 },
      { k: 'K', lab: 'Strike K ($)', min: 1, max: 200, step: 0.5 },
      { k: 'r', lab: 'Risk-free rate r (% pa)', min: 0, max: 15, step: 0.25, sc: 100 },
      { k: 's', lab: 'Volatility σ (% pa)', min: 1, max: 100, step: 1, sc: 100 },
      { k: 'T', lab: 'Time to expiry T', min: 0.05, max: 3, step: 0.05 },
    ];
    root.innerHTML = '<div class="bc">' + defs.map((d) => `<label>${d.lab}${d.k === 'T' ? ' <select data-unit><option value="years">in years</option><option value="months">in months</option></select>' : ''}
<span class="bi"><input type="number" data-n="${d.k}" step="any">${sliders ? '' : ''}</span>${sliders ? `<input type="range" data-r="${d.k}" min="${d.min}" max="${d.max}" step="${d.step}">` : ''}</label>`).join('') + '</div><div data-o="out"></div>';
    const sel = root.querySelector('[data-unit]'); sel.value = unit;
    const disp = (d) => d.k === 'T' ? (unit === 'months' ? st.T * 12 : st.T) : d.sc ? st[d.k] * d.sc : st[d.k];
    const tomodel = (d, v) => d.k === 'T' ? (unit === 'months' ? v / 12 : v) : d.sc ? v / d.sc : v;
    function sync(skip) {
      defs.forEach((d) => {
        const n = root.querySelector(`[data-n="${d.k}"]`), r = root.querySelector(`[data-r="${d.k}"]`);
        const v = +(+disp(d)).toFixed(4);
        if (n !== skip) n.value = v;
        if (r && r !== skip) {
          if (d.k === 'T') { r.min = unit === 'months' ? 1 : 0.05; r.max = unit === 'months' ? 36 : 3; r.step = unit === 'months' ? 1 : 0.05; }
          r.value = v;
        }
      });
    }
    function render() {
      const S = st.S, K = st.K, r = st.r, s = st.s, T = st.T;
      const o = calc(S, K, r, s, T), pvl = o.pv;
      const row = (a, b, c2, cls) => `<tr${cls ? ` class="${cls}"` : ''}><td>${a}</td><td>${b}</td><td class="num">${c2}</td></tr>`;
      const lbC = Math.max(S - pvl, 0), lbP = Math.max(pvl - S, 0);
      const chk = (ok, txt) => `<div class="${ok ? 'ok' : 'bad'}">${ok ? '✓' : '✗'} ${txt}</div>`;
      const eps = 1e-9;
      root.querySelector('[data-o=out]').innerHTML = `<table>
<tr><th>Step</th><th>Working</th><th class="num">Value</th></tr>
${row('1', 'ln(S/K) = ln(' + f(S, 2) + '/' + f(K, 2) + ')', f(o.lnSK, 4))}
${row('2', '(r + σ²/2)T = (' + f(r, 4) + ' + ' + f(s * s / 2, 4) + ') × ' + f(T, 4), f(o.drift, 4))}
${row('3', 'σ√T = ' + f(s, 4) + ' × √' + f(T, 4), f(o.sq, 4))}
${row('4', 'd1 = (step 1 + step 2) / step 3', f(o.d1, 4))}
${row('5', 'd2 = d1 − σ√T  (unrounded d1, as the formula sheet)', f(o.d2, 4))}
${row('6', 'round d1 and d2 each to 2 dp (after step 5)', f(o.a, 2) + ', ' + f(o.b, 2))}
${row('7', 'N(d1), N(d2) from formula-sheet table (pp. 5-6)', f(o.tab.N1, 4) + ', ' + f(o.tab.N2, 4))}
${row('8', 'N(−d1), N(−d2) from the x ≤ 0 table (= 1 − N)', f(o.tab.M1, 4) + ', ' + f(o.tab.M2, 4))}
${row('9', 'Ke<sup>−rT</sup> = ' + f(K, 2) + ' × e<sup>−' + f(r * T, 4) + '</sup>', f(pvl, 4))}
${row('10', 'c = S·N(d1) − Ke<sup>−rT</sup>·N(d2)  (table method)', '$' + f(o.c, 4), 'res')}
${row('11', 'p = Ke<sup>−rT</sup>·N(−d2) − S·N(−d1)  (table method)', '$' + f(o.p, 4), 'res')}
${row('12', 'Exact (unrounded d, exact N): c, p', '$' + f(o.ce, 4) + ', $' + f(o.pe, 4))}
</table>
<div class="bchk">
${chk(Math.abs(o.c - o.p - (S - pvl)) < 1e-6, 'Parity: c − p = ' + f(o.c - o.p, 4) + ' vs S − Ke<sup>−rT</sup> = ' + f(S - pvl, 4))}
${chk(o.c >= lbC - eps && o.c <= S + eps, 'Call: max(S − Ke<sup>−rT</sup>, 0) = ' + f(lbC, 4) + ' ≤ c ≤ S')}
${chk(o.p >= lbP - eps && o.p <= pvl + eps, 'Put: max(Ke<sup>−rT</sup> − S, 0) = ' + f(lbP, 4) + ' ≤ p ≤ Ke<sup>−rT</sup>')}
${chk(true, 'Moneyness of the call: ' + (S > K * 1.0001 ? 'in the money (S > K)' : S < K * 0.9999 ? 'out of the money (S < K)' : 'at the money (S = K)') + '; N(d2) = ' + f(o.tab.N2, 4) + ' is the (risk-neutral) chance the call ends in the money.')}
</div>
${chart(K, r, s, T, S)}
<div class="bn">Table method (formula sheet pp. 5-6): d2 from unrounded d1, then d1 and d2 to 2 dp, N to 4 dp, no interpolation. If rounding d moves the 2 dp answer, the exact row shows by how much. Moving a slider changes one input; watch which rows move.</div>`;
    }
    root.addEventListener('input', (e) => {
      const t = e.target;
      if (t === sel) return;
      const key = t.dataset.n || t.dataset.r; if (!key) return;
      const d = defs.find((x) => x.k === key), v = parseFloat(t.value);
      if (!isFinite(v) || v <= 0 && key !== 'r') { return; }
      st[key] = tomodel(d, v);
      if (st.T <= 0) st.T = 0.01;
      sync(t); render();
    });
    sel.addEventListener('change', () => { unit = sel.value; sync(); render(); });
    sync(); render();
  }

  function init() { injectCSS(); document.querySelectorAll('.bsmx').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
