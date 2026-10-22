// Reusable binomial-tree calculator (lessons 18+). Self-contained: injects its own CSS, uses the
// colour tokens from assets/style.css. No KaTeX needed inside the widget.
//
// Usage:
//   <div class="bintree" data-s="40" data-k="42" data-r="5" data-t="0.5" data-n="2"
//        data-sigma="20" data-type="call" data-style="european"></div>
//   <script src="../assets/binomial-tree.js"></script>
//
// Optional attributes:
//   data-mode="ud" with data-up="10" data-down="8"   (moves in % per step; u = 1 + up/100, d = 1 − down/100)
//   data-mode="sigma" (default) uses u = e^{σ√Δt}, d = 1/u
//   data-style="american" checks early exercise at every node (exercise nodes are highlighted)
//   data-maxn="5"  maximum number of steps on the slider (default 5)
// r and σ are in % per annum; T in years. Each node shows S (bold), option value f, and Δ (non-final nodes).

(function () {
  const CSS = `
.bintree { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.bintree .bt-controls { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .45rem 1rem; }
.bintree label { display: flex; flex-direction: column; gap: .15rem; color: var(--muted); }
.bintree input, .bintree select { font: inherit; font-size: .85rem; padding: .3rem .45rem; border: 1px solid var(--rule); border-radius: 5px; background: var(--bg); color: var(--fg); min-height: 32px; width: 100%; }
.bintree .bt-params { margin-top: .8rem; font-variant-numeric: tabular-nums; display: flex; flex-wrap: wrap; gap: .3rem 1.2rem; }
.bintree .bt-params b { color: var(--fg); }
.bintree .bt-result { margin-top: .4rem; font-size: .95rem; }
.bintree .bt-result b { color: var(--accent); }
.bintree svg { display: block; width: 100%; height: auto; margin-top: .6rem; }
.bintree .bt-edge { stroke: var(--rule); stroke-width: 1.5; }
.bintree .bt-dot { fill: var(--accent); }
.bintree .bt-dot.ex { fill: var(--trap); }
.bintree .bt-s { fill: var(--fg); font: 600 12px Inter, system-ui, sans-serif; }
.bintree .bt-f { fill: var(--accent); font: 500 12px Inter, system-ui, sans-serif; }
.bintree .bt-d { fill: var(--muted); font: 400 10.5px Inter, system-ui, sans-serif; }
.bintree .bt-ex { fill: var(--trap); font: 600 10.5px Inter, system-ui, sans-serif; }
.bintree .bt-axis { fill: var(--muted); font: 400 10.5px Inter, system-ui, sans-serif; }
.bintree .bt-note { color: var(--muted); margin-top: .4rem; }
.bintree .bt-warn { color: var(--bad); margin-top: .4rem; }
.bintree .hide { display: none; }
@media (max-width: 640px) { .bintree .bt-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;
  function injectCSS() {
    if (document.getElementById('bintree-css')) return;
    const st = document.createElement('style'); st.id = 'bintree-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  // Pure calculator, exposed as window.BinomialTree.price(opts) for reuse.
  function price(o) {
    const n = o.n, dt = o.T / n;
    let u, d;
    if (o.mode === 'ud') { u = 1 + o.up / 100; d = 1 - o.down / 100; }
    else { u = Math.exp((o.sigma / 100) * Math.sqrt(dt)); d = 1 / u; }
    const r = o.r / 100, growth = Math.exp(r * dt), disc = 1 / growth;
    const p = (growth - d) / (u - d);
    const pay = o.type === 'put' ? (s) => Math.max(o.K - s, 0) : (s) => Math.max(s - o.K, 0);
    const S = [], f = [], ex = [], D = [];
    for (let i = 0; i <= n; i++) { S[i] = []; for (let j = 0; j <= i; j++) S[i][j] = o.S * Math.pow(u, i - j) * Math.pow(d, j); }
    f[n] = S[n].map(pay); ex[n] = S[n].map((s) => pay(s) > 0);
    for (let i = n - 1; i >= 0; i--) {
      f[i] = []; ex[i] = []; D[i] = [];
      for (let j = 0; j <= i; j++) {
        const cont = disc * (p * f[i + 1][j] + (1 - p) * f[i + 1][j + 1]);
        const intr = pay(S[i][j]);
        const early = o.style === 'american' && intr > cont + 1e-12;
        f[i][j] = early ? intr : cont; ex[i][j] = early;
        D[i][j] = (f[i + 1][j] - f[i + 1][j + 1]) / (S[i + 1][j] - S[i + 1][j + 1]);
      }
    }
    return { dt, u, d, p, disc, S, f, ex, D, value: f[0][0], ok: p > 0 && p < 1 };
  }

  const f2 = (x) => x.toFixed(2), f4 = (x) => x.toFixed(4);

  function draw(svgHost, res, o) {
    const n = o.n, colW = 150, rowH = 32, padX = 70, padY = 34;
    const W = padX * 2 + colW * n, H = padY * 2 + rowH * 2 * n + 20;
    const x = (i) => padX + i * colW, y = (i, j) => padY + 10 + rowH * (n - i + 2 * j);
    let s = `<svg viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W * 1.15)}px;margin-left:auto;margin-right:auto" role="img" aria-label="Binomial tree">`;
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      s += `<line class="bt-edge" x1="${x(i)}" y1="${y(i, j)}" x2="${x(i + 1)}" y2="${y(i + 1, j)}"/>`;
      s += `<line class="bt-edge" x1="${x(i)}" y1="${y(i, j)}" x2="${x(i + 1)}" y2="${y(i + 1, j + 1)}"/>`;
    }
    for (let i = 0; i <= n; i++) {
      s += `<text class="bt-axis" x="${x(i)}" y="${H - 6}" text-anchor="middle">t = ${(i * res.dt).toFixed(3).replace(/\.?0+$/, '')}</text>`;
      for (let j = 0; j <= i; j++) {
        const cx = x(i), cy = y(i, j);
        const earlyHere = i < n && res.ex[i][j];
        s += `<circle class="bt-dot${earlyHere ? ' ex' : ''}" cx="${cx}" cy="${cy}" r="3.5"/>`;
        s += `<text class="bt-s" x="${cx}" y="${cy - 8}" text-anchor="middle">S ${f2(res.S[i][j])}</text>`;
        s += `<text class="bt-f" x="${cx}" y="${cy + 16}" text-anchor="middle">f ${f4(res.f[i][j])}</text>`;
        if (i < n) s += `<text class="${earlyHere ? 'bt-ex' : 'bt-d'}" x="${cx}" y="${cy + 28}" text-anchor="middle">${earlyHere ? 'exercise early' : 'Δ ' + f4(res.D[i][j])}</text>`;
      }
    }
    s += '</svg>';
    svgHost.innerHTML = s;
  }

  function build(el) {
    const ds = el.dataset;
    const o = {
      S: +(ds.s ?? 40), K: +(ds.k ?? 42), r: +(ds.r ?? 5), T: +(ds.t ?? 0.5), n: +(ds.n ?? 2),
      sigma: +(ds.sigma ?? 20), up: +(ds.up ?? 10), down: +(ds.down ?? 8),
      mode: ds.mode || 'sigma', type: ds.type || 'call', style: ds.style || 'european',
    };
    const maxn = +(ds.maxn ?? 5);
    el.innerHTML = `
<div class="bt-controls">
  <label>Option<select data-k="type"><option value="call">Call</option><option value="put">Put</option></select></label>
  <label>Exercise<select data-k="style"><option value="european">European</option><option value="american">American</option></select></label>
  <label>Moves from<select data-k="mode"><option value="sigma">volatility σ</option><option value="ud">given up/down %</option></select></label>
  <label>Steps n<input type="number" data-k="n" min="1" max="${maxn}" step="1"></label>
  <label>Stock S₀<input type="number" data-k="S" step="any"></label>
  <label>Strike K<input type="number" data-k="K" step="any"></label>
  <label>Rate r (% p.a., cont.)<input type="number" data-k="r" step="any"></label>
  <label>Life T (years)<input type="number" data-k="T" step="any" min="0.01"></label>
  <label class="m-sigma">Volatility σ (% p.a.)<input type="number" data-k="sigma" step="any" min="0"></label>
  <label class="m-ud">Up move per step (%)<input type="number" data-k="up" step="any"></label>
  <label class="m-ud">Down move per step (%)<input type="number" data-k="down" step="any"></label>
</div>
<div class="bt-params"></div>
<div class="bt-result"></div>
<div class="bt-svg"></div>
<div class="bt-warn"></div>
<div class="bt-note">Bold: stock price. Orange: option value f (payoff at the last column). Grey: Δ = (f<sub>u</sub> − f<sub>d</sub>)/(S<sub>u</sub> − S<sub>d</sub>), shares to hold per option written at that node.</div>`;
    const inputs = el.querySelectorAll('[data-k]');
    inputs.forEach((inp) => { inp.value = o[inp.dataset.k]; });
    const params = el.querySelector('.bt-params'), result = el.querySelector('.bt-result'),
      host = el.querySelector('.bt-svg'), warn = el.querySelector('.bt-warn');
    function upd() {
      inputs.forEach((inp) => {
        const k = inp.dataset.k;
        o[k] = inp.tagName === 'SELECT' ? inp.value : +inp.value;
      });
      o.n = Math.max(1, Math.min(maxn, Math.round(o.n || 1)));
      el.querySelectorAll('.m-sigma').forEach((l) => l.classList.toggle('hide', o.mode !== 'sigma'));
      el.querySelectorAll('.m-ud').forEach((l) => l.classList.toggle('hide', o.mode !== 'ud'));
      if (!(o.T > 0) || !(o.S > 0)) { warn.textContent = 'Need S₀ > 0 and T > 0.'; return; }
      const res = price(o);
      params.innerHTML = `<span>Δt = <b>${f4(res.dt)}</b></span><span>u = <b>${f4(res.u)}</b></span><span>d = <b>${f4(res.d)}</b></span>` +
        `<span>e<sup>rΔt</sup> = <b>${f4(1 / res.disc)}</b></span><span>p = <b>${f4(res.p)}</b></span><span>1 − p = <b>${f4(1 - res.p)}</b></span>`;
      result.innerHTML = `${o.style === 'american' ? 'American' : 'European'} ${o.type} value today: <b>${f4(res.value)}</b> (≈ ${f2(res.value)})`;
      warn.textContent = res.ok ? '' : 'p is outside (0, 1): need d < e^(rΔt) < u, or the tree allows arbitrage.';
      draw(host, res, o);
    }
    inputs.forEach((inp) => inp.addEventListener('input', upd));
    upd();
  }

  window.BinomialTree = { price };
  function init() { injectCSS(); document.querySelectorAll('.bintree').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
