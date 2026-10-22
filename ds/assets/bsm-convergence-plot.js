// BSM convergence plot (lesson 25). Self-contained: injects its own CSS, uses colour tokens from assets/style.css.
// Plots the CRR binomial value (u = e^{σ√Δt}, d = 1/u, p = (e^{rΔt} − d)/(u − d)) of a European option against the
// number of steps N, with the exact Black-Scholes-Merton value as a horizontal line. No KaTeX needed.
//
// Usage:
//   <div class="bsmconv" data-s="10" data-k="10" data-r="6" data-sigma="40" data-t="2" data-type="call" data-maxn="60"></div>
//   <script src="../assets/bsm-convergence-plot.js"></script>
// r and σ in % per annum, T in years. data-maxn up to 300. Also exposes window.BSMConv.{tree, bsm}.

(function () {
  const CSS = `
.bsmconv { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.bsmconv .bc-controls { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: .45rem .8rem; }
.bsmconv label { display: flex; flex-direction: column; gap: .15rem; color: var(--muted); }
.bsmconv input, .bsmconv select { font: inherit; font-size: .85rem; padding: .3rem .45rem; border: 1px solid var(--rule); border-radius: 5px; background: var(--bg); color: var(--fg); min-height: 32px; width: 100%; }
.bsmconv .bc-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: .45rem 1.2rem; margin-top: .6rem; align-items: end; }
.bsmconv input[type=range] { padding: 0; accent-color: var(--accent); }
.bsmconv svg { display: block; width: 100%; height: auto; margin-top: .6rem; }
.bsmconv .bc-axis { stroke: var(--rule); stroke-width: 1; }
.bsmconv .bc-grid { stroke: var(--rule); stroke-width: .6; stroke-dasharray: 2 3; }
.bsmconv .bc-line { stroke: var(--muted); stroke-width: 1; fill: none; }
.bsmconv .bc-bsm { stroke: var(--ok); stroke-width: 2; }
.bsmconv .bc-odd { fill: var(--trap); }
.bsmconv .bc-even { fill: var(--accent); }
.bsmconv .bc-sel { fill: none; stroke: var(--fg); stroke-width: 1.5; }
.bsmconv .bc-t { fill: var(--muted); font: 400 10.5px Inter, system-ui, sans-serif; }
.bsmconv .bc-tg { fill: var(--ok); font: 600 11px Inter, system-ui, sans-serif; }
.bsmconv .bc-read { margin-top: .5rem; font-variant-numeric: tabular-nums; font-size: .9rem; }
.bsmconv .bc-read b { color: var(--accent); }
.bsmconv .bc-key { color: var(--muted); margin-top: .3rem; }
.bsmconv .bc-warn { color: var(--bad); }
`;
  function injectCSS() {
    if (document.getElementById('bsmconv-css')) return;
    const st = document.createElement('style'); st.id = 'bsmconv-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function erf(x) { // Numerical Recipes erfc Chebyshev, |error| < 1.2e-7
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const ans = 1 - t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? ans : -ans;
  }
  const N = (x) => 0.5 * (1 + erf(x / Math.SQRT2));

  function bsm(o) {
    const r = o.r / 100, s = o.sigma / 100;
    const d1 = (Math.log(o.S / o.K) + (r + s * s / 2) * o.T) / (s * Math.sqrt(o.T)), d2 = d1 - s * Math.sqrt(o.T);
    const disc = o.K * Math.exp(-r * o.T);
    return o.type === 'put' ? disc * N(-d2) - o.S * N(-d1) : o.S * N(d1) - disc * N(d2);
  }
  function tree(o, n) {
    const r = o.r / 100, s = o.sigma / 100, dt = o.T / n;
    const u = Math.exp(s * Math.sqrt(dt)), d = 1 / u, p = (Math.exp(r * dt) - d) / (u - d), disc = Math.exp(-r * dt);
    const pay = o.type === 'put' ? (x) => Math.max(o.K - x, 0) : (x) => Math.max(x - o.K, 0);
    let f = [];
    for (let j = 0; j <= n; j++) f[j] = pay(o.S * Math.pow(u, j) * Math.pow(d, n - j));
    for (let i = n - 1; i >= 0; i--) { const g = []; for (let j = 0; j <= i; j++) g[j] = disc * (p * f[j + 1] + (1 - p) * f[j]); f = g; }
    return { value: f[0], u, d, p };
  }

  function mount(root) {
    injectCSS();
    const a = root.dataset;
    const init = { S: a.s || 10, K: a.k || 10, r: a.r || 6, sigma: a.sigma || 40, T: a.t || 2, type: a.type || 'call', maxn: a.maxn || 60 };
    root.innerHTML = `
<div class="bc-controls">
  <label>S₀<input data-f="S" type="number" step="any" value="${init.S}"></label>
  <label>K<input data-f="K" type="number" step="any" value="${init.K}"></label>
  <label>r (% p.a.)<input data-f="r" type="number" step="any" value="${init.r}"></label>
  <label>σ (% p.a.)<input data-f="sigma" type="number" step="any" value="${init.sigma}"></label>
  <label>T (years)<input data-f="T" type="number" step="any" value="${init.T}"></label>
  <label>Option<select data-f="type"><option value="call">call</option><option value="put">put</option></select></label>
</div>
<div class="bc-row2">
  <label>Steps N shown: <span data-o="nmax"></span><input data-f="maxn" type="range" min="5" max="300" step="1" value="${init.maxn}"></label>
  <label>Selected N: <span data-o="nsel"></span><input data-f="nsel" type="range" min="1" max="${init.maxn}" step="1" value="${Math.min(10, init.maxn)}"></label>
</div>
<svg viewBox="0 0 640 300" role="img" aria-label="Binomial value against number of steps with the BSM value as a horizontal line"></svg>
<div class="bc-read" data-o="read"></div>
<div class="bc-key">Orange dots: odd N. Red dots: even N. Green line: exact BSM value (calculator N, no table rounding; exam table answers differ by a cent or two). Black ring: the selected N.</div>`;
    root.querySelector('[data-f="type"]').value = init.type;
    const svg = root.querySelector('svg');
    const get = (f) => root.querySelector(`[data-f="${f}"]`);
    const out = (f) => root.querySelector(`[data-o="${f}"]`);

    function draw() {
      const o = { S: +get('S').value, K: +get('K').value, r: +get('r').value, sigma: +get('sigma').value, T: +get('T').value, type: get('type').value };
      const maxn = Math.max(5, Math.min(300, Math.round(+get('maxn').value)));
      const nsRange = get('nsel'); nsRange.max = maxn;
      const nsel = Math.min(maxn, Math.round(+nsRange.value));
      out('nmax').textContent = maxn; out('nsel').textContent = nsel;
      if (!(o.S > 0 && o.K > 0 && o.sigma > 0 && o.T > 0)) { out('read').innerHTML = '<span class="bc-warn">Need S, K, σ, T all positive.</span>'; svg.innerHTML = ''; return; }
      const vals = []; let bad = false;
      for (let n = 1; n <= maxn; n++) { const t = tree(o, n); if (!(t.p >= 0 && t.p <= 1)) bad = true; vals.push(t.value); }
      const B = bsm(o);
      let lo = Math.min(B, ...vals), hi = Math.max(B, ...vals);
      // zoom: after the first few steps the interesting range is around BSM; keep all dots in view
      const pad = (hi - lo) * 0.08 || 0.1; lo -= pad; hi += pad;
      const W = 640, H = 300, L = 52, R = 12, Tp = 14, Bt = 30;
      const X = (n) => L + (n - 1) / Math.max(1, maxn - 1) * (W - L - R);
      const Y = (v) => H - Bt - (v - lo) / (hi - lo) * (H - Bt - Tp);
      let s = '';
      for (let i = 0; i <= 4; i++) {
        const v = lo + (hi - lo) * i / 4, y = Y(v);
        s += `<line class="bc-grid" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="bc-t" x="${L - 6}" y="${y + 3}" text-anchor="end">${v.toFixed(2)}</text>`;
      }
      const step = maxn <= 30 ? 5 : maxn <= 80 ? 10 : maxn <= 160 ? 20 : 50;
      s += `<line class="bc-axis" x1="${L}" x2="${W - R}" y1="${H - Bt}" y2="${H - Bt}"/>`;
      for (let n = 1; n <= maxn; n++) if (n === 1 || n % step === 0) s += `<text class="bc-t" x="${X(n)}" y="${H - Bt + 14}" text-anchor="middle">${n}</text>`;
      s += `<text class="bc-t" x="${(L + W - R) / 2}" y="${H - 4}" text-anchor="middle">number of steps N</text>`;
      s += `<line class="bc-bsm" x1="${L}" x2="${W - R}" y1="${Y(B)}" y2="${Y(B)}"/><text class="bc-tg" x="${W - R}" y="${Y(B) - 5}" text-anchor="end">BSM ${B.toFixed(4)}</text>`;
      s += `<polyline class="bc-line" points="${vals.map((v, i) => X(i + 1) + ',' + Y(v)).join(' ')}"/>`;
      const rad = maxn > 120 ? 1.6 : maxn > 60 ? 2.4 : 3.4;
      vals.forEach((v, i) => { s += `<circle class="${(i + 1) % 2 ? 'bc-odd' : 'bc-even'}" cx="${X(i + 1)}" cy="${Y(v)}" r="${rad}"/>`; });
      s += `<circle class="bc-sel" cx="${X(nsel)}" cy="${Y(vals[nsel - 1])}" r="${rad + 3}"/>`;
      svg.innerHTML = s;
      const t = tree(o, nsel), v = vals[nsel - 1];
      out('read').innerHTML = `N = <b>${nsel}</b>: u = ${t.u.toFixed(4)}, d = ${t.d.toFixed(4)}, p = ${t.p.toFixed(4)}. Tree value <b>${v.toFixed(4)}</b>, BSM ${B.toFixed(4)}, tree − BSM = <b>${(v - B >= 0 ? '+' : '') + (v - B).toFixed(4)}</b> (${nsel % 2 ? 'odd' : 'even'} N)` +
        (bad ? '<br><span class="bc-warn">For small N, p falls outside 0 to 1 here (r too large for σ and Δt): the tree is invalid.</span>' : '');
    }
    root.querySelectorAll('input,select').forEach((el) => el.addEventListener('input', draw));
    draw();
  }

  function init() { document.querySelectorAll('.bsmconv').forEach(mount); }
  window.BSMConv = { tree: (o, n) => tree(o, n).value, bsm };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
