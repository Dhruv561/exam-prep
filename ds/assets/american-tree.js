// American/European binomial tree widget (self-contained; uses the CSS variables from style.css).
//
// Usage:
//   <div class="amtree" data-s="50" data-k="52" data-r="0.05" data-dt="1" data-n="2"
//        data-u="1.2" data-d="0.8" data-type="put" data-controls="1"></div>
//   Optional: data-sigma="0.3" (then u = e^{σ√Δt}, d = 1/u, and u/d inputs are ignored),
//             data-controls="0" (static diagram, no inputs).
// Each node shows the stock price, the option value, and for earlier nodes "hold h · ex x".
// Nodes where an American holder exercises are highlighted.

(function () {
  const css = `
.amtree { border: 1px solid var(--rule); border-radius: 8px; padding: .9rem 1rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.amtree .at-controls { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .4rem .8rem; margin-bottom: .7rem; }
.amtree label { display: flex; flex-direction: column; color: var(--muted); }
.amtree input, .amtree select { font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 4px; padding: .25rem .35rem; min-height: 32px; }
.amtree input:disabled { opacity: .45; }
.amtree svg { width: 100%; height: auto; display: block; }
.amtree .at-sum { margin-top: .6rem; display: flex; flex-wrap: wrap; gap: .3rem 1.4rem; font-variant-numeric: tabular-nums; }
.amtree .at-sum b { color: var(--fg); }
.amtree .at-key { color: var(--muted); margin-top: .4rem; }
@media (max-width: 640px) { .amtree .at-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
`;
  function addStyle() {
    if (document.getElementById('amtree-style')) return;
    const st = document.createElement('style'); st.id = 'amtree-style'; st.textContent = css;
    document.head.appendChild(st);
  }

  function solve(o) {
    let u = o.u, d = o.d;
    if (o.useSigma) { u = Math.exp(o.sigma * Math.sqrt(o.dt)); d = 1 / u; }
    const a = Math.exp(o.r * o.dt), p = (a - d) / (u - d), disc = 1 / a;
    const pay = o.type === 'put' ? (s) => Math.max(o.K - s, 0) : (s) => Math.max(s - o.K, 0);
    const S = [], V = { am: [], eu: [] }, H = [], X = [];
    for (let i = 0; i <= o.n; i++) { S.push([]); for (let j = 0; j <= i; j++) S[i].push(o.S * Math.pow(u, j) * Math.pow(d, i - j)); }
    V.am[o.n] = S[o.n].map(pay); V.eu[o.n] = S[o.n].map(pay);
    for (let i = o.n - 1; i >= 0; i--) {
      V.am[i] = []; V.eu[i] = []; H[i] = []; X[i] = [];
      for (let j = 0; j <= i; j++) {
        const h = disc * (p * V.am[i + 1][j + 1] + (1 - p) * V.am[i + 1][j]);
        const e = pay(S[i][j]);
        H[i].push(h); X[i].push(e > h + 1e-12);
        V.am[i].push(Math.max(h, e));
        V.eu[i].push(disc * (p * V.eu[i + 1][j + 1] + (1 - p) * V.eu[i + 1][j]));
      }
    }
    return { u, d, p, S, V, H, X, pay };
  }

  function draw(box, o, res) {
    const n = o.n, colW = 150, rowH = 34, padX = 60, padY = 30;
    const W = padX * 2 + colW * n, Ht = padY * 2 + rowH * 2 * n + 20;
    const am = o.style !== 'european';
    const V = am ? res.V.am : res.V.eu;
    const pos = (i, j) => [padX + i * colW, padY + 10 + rowH * (n - (2 * j - i))];
    let s = `<svg viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Binomial tree">`;
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      const [x, y] = pos(i, j);
      [[i + 1, j + 1], [i + 1, j]].forEach(([a, b]) => { const [x2, y2] = pos(a, b); s += `<line x1="${x + 28}" y1="${y}" x2="${x2 - 28}" y2="${y2}" stroke="var(--rule)" stroke-width="1.5"/>`; });
    }
    for (let i = 0; i <= n; i++) for (let j = 0; j <= i; j++) {
      const [x, y] = pos(i, j);
      const ex = am && i < n && res.X[i][j];
      const fill = ex ? 'var(--trap-bg)' : 'var(--card)', stroke = ex ? 'var(--trap)' : 'var(--rule)';
      s += `<rect x="${x - 30}" y="${y - 24}" width="60" height="40" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="${ex ? 2 : 1}"/>`;
      s += `<text x="${x}" y="${y - 8}" text-anchor="middle" font-size="12" fill="var(--muted)">${res.S[i][j].toFixed(2)}</text>`;
      s += `<text x="${x}" y="${y + 9}" text-anchor="middle" font-size="14" font-weight="600" fill="${ex ? 'var(--trap)' : 'var(--fg)'}">${V[i][j].toFixed(4)}</text>`;
      if (i < n) {
        const h = am ? res.H[i][j] : V[i][j];
        const label = am ? `hold ${h.toFixed(2)} · ex ${res.pay(res.S[i][j]).toFixed(2)}` : '';
        if (label) s += `<text x="${x}" y="${y + 30}" text-anchor="middle" font-size="10.5" fill="${ex ? 'var(--trap)' : 'var(--muted)'}">${label}${ex ? ' ✓ex' : ''}</text>`;
      }
    }
    s += '</svg>';
    box.innerHTML = s;
  }

  function mount(el) {
    const D = el.dataset, ctl = D.controls !== '0';
    const o = {
      S: +D.s || 50, K: +D.k || 52, r: D.r !== undefined ? +D.r : 0.05, dt: +D.dt || 1, n: +D.n || 2,
      u: +D.u || 1.2, d: +D.d || 0.8, sigma: +D.sigma || 0.3, useSigma: D.sigma !== undefined,
      type: D.type || 'put', style: D.style || 'american',
    };
    let controls = null;
    if (ctl) {
      controls = document.createElement('div'); controls.className = 'at-controls';
      const f = (k, lab, v, step) => `<label>${lab}<input data-k="${k}" type="number" step="${step}" value="${v}"></label>`;
      controls.innerHTML =
        `<label>Option<select data-k="type"><option value="put">Put</option><option value="call">Call</option></select></label>` +
        `<label>Style<select data-k="style"><option value="american">American</option><option value="european">European</option></select></label>` +
        `<label>u, d from<select data-k="mode"><option value="ud">given u, d</option><option value="sig">σ: u = e^(σ√Δt)</option></select></label>` +
        `<label>Steps n<select data-k="n">${[1, 2, 3, 4].map((k) => `<option${k === o.n ? ' selected' : ''}>${k}</option>`).join('')}</select></label>` +
        f('S', 'S₀', o.S, 1) + f('K', 'K', o.K, 1) + f('r', 'r (cont.)', o.r, 0.01) + f('dt', 'Δt (years)', o.dt, 0.05) +
        f('u', 'u', o.u, 0.01) + f('d', 'd', o.d, 0.01) + f('sigma', 'σ', o.sigma, 0.05);
      el.appendChild(controls);
      controls.querySelector('[data-k=type]').value = o.type;
      controls.querySelector('[data-k=style]').value = o.style;
      controls.querySelector('[data-k=mode]').value = o.useSigma ? 'sig' : 'ud';
    }
    const box = document.createElement('div'); el.appendChild(box);
    const sum = document.createElement('div'); sum.className = 'at-sum'; el.appendChild(sum);
    const key = document.createElement('div'); key.className = 'at-key';
    key.textContent = 'Each node: stock price (top), option value (bold), and "hold · ex" = continuation value vs exercise value. Highlighted = an American holder exercises there.';
    el.appendChild(key);

    function read() {
      if (!controls) return;
      controls.querySelectorAll('[data-k]').forEach((inp) => {
        const k = inp.dataset.k, v = inp.value;
        if (k === 'type' || k === 'style') o[k] = v;
        else if (k === 'mode') o.useSigma = v === 'sig';
        else if (k === 'n') o.n = +v;
        else if (v !== '' && !isNaN(+v)) o[k] = +v;
      });
      controls.querySelector('[data-k=u]').disabled = o.useSigma;
      controls.querySelector('[data-k=d]').disabled = o.useSigma;
      controls.querySelector('[data-k=sigma]').disabled = !o.useSigma;
    }
    function update() {
      read();
      const res = solve(o);
      draw(box, o, res);
      const bad = !(res.p > 0 && res.p < 1);
      const am = res.V.am[0][0], eu = res.V.eu[0][0];
      const exList = [];
      res.X.forEach((row, i) => row.forEach((x, j) => { if (x) exList.push(`t=${i}, S=${res.S[i][j].toFixed(2)}`); }));
      sum.innerHTML = bad
        ? `<span style="color:var(--bad)">p = ${res.p.toFixed(4)} is outside (0, 1): need d &lt; e^(rΔt) &lt; u.</span>`
        : `<span>u = <b>${res.u.toFixed(4)}</b></span><span>d = <b>${res.d.toFixed(4)}</b></span><span>p = <b>${res.p.toFixed(4)}</b></span>` +
          `<span>American = <b>${am.toFixed(4)}</b></span><span>European = <b>${eu.toFixed(4)}</b></span>` +
          `<span>Early-exercise premium = <b>${(am - eu).toFixed(4)}</b></span>` +
          `<span>Exercise nodes: <b>${exList.length ? exList.join('; ') : 'none'}</b></span>`;
    }
    if (controls) { controls.addEventListener('input', update); controls.addEventListener('change', update); }
    update();
  }

  document.addEventListener('DOMContentLoaded', () => { addStyle(); document.querySelectorAll('.amtree').forEach(mount); });
})();
