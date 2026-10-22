// Binomial tree widget (European call/put, 1–3 steps). Reusable across the binomial lessons.
//
// Markup:
//   <div class="bintree" data-s="40" data-u="1.25" data-d="0.8" data-r="0.06" data-t="0.5"
//        data-k="42" data-type="call" data-steps="1" data-realq="0.7"></div>
//   data-steps  1–3 (each step lasts T/steps). data-realq (optional) adds a "real-world probability"
//   slider that shows the WRONG answer (real-world expected payoff discounted at r) next to the right one.
//   data-lock="u,d" hides those sliders (comma list of s,u,d,r,t,k,type,realq).
// Needs assets/style.css for the colour variables. Injects its own small stylesheet once.

(function () {
  const CSS = `
.bintree { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .85rem; }
.bintree .bt-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .4rem 1.2rem; }
.bintree label { display: flex; flex-direction: column; }
.bintree input[type=range] { width: 100%; accent-color: var(--accent); }
.bintree .bt-type { display: flex; gap: .4rem; align-items: center; }
.bintree .bt-type button { font: inherit; font-size: .8rem; padding: .25rem .7rem; border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); color: var(--fg); cursor: pointer; }
.bintree .bt-type button.on { border-color: var(--accent); background: var(--card); font-weight: 600; }
.bintree svg { width: 100%; height: auto; display: block; margin-top: .6rem; }
.bintree svg text { fill: var(--fg); font-family: Inter, system-ui, sans-serif; }
.bintree svg .opt { fill: var(--accent); font-weight: 600; }
.bintree svg .muted { fill: var(--muted); }
.bintree svg line { stroke: var(--rule); stroke-width: 1.5; }
.bintree .bt-out { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .3rem 1.2rem; font-variant-numeric: tabular-nums; margin-top: .4rem; }
.bintree .bt-out b { font-size: .95rem; }
.bintree .bt-warn { margin-top: .6rem; padding: .5rem .8rem; border-radius: 6px; background: var(--trap-bg); border-left: 4px solid var(--trap); display: none; }
.bintree .bt-wrong { color: var(--bad); }
`;
  function injectCSS() {
    if (document.getElementById('bintree-css')) return;
    const s = document.createElement('style'); s.id = 'bintree-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  const f2 = (x) => x.toFixed(2), f4 = (x) => x.toFixed(4);

  function build(root) {
    const ds = root.dataset;
    const st = {
      s: +(ds.s || 40), u: +(ds.u || 1.25), d: +(ds.d || 0.8), r: +(ds.r || 0.06), t: +(ds.t || 0.5),
      k: +(ds.k || 42), type: ds.type || 'call', steps: Math.min(3, Math.max(1, +(ds.steps || 1))),
      realq: ds.realq !== undefined ? +ds.realq : null,
    };
    const lock = (ds.lock || '').split(',').map((x) => x.trim());
    const sliders = [
      ['s', 'Stock S₀', 10, 100, 0.5, (v) => '$' + f2(v)],
      ['u', 'Up factor u', 1.01, 1.6, 0.01, f2],
      ['d', 'Down factor d', 0.5, 1.1, 0.01, f2],
      ['r', 'Rate r (p.a.)', 0, 0.6, 0.005, (v) => (v * 100).toFixed(1) + '%'],
      ['t', 'Time T (years)', 0.05, 2, 0.05, f2],
      ['k', 'Strike K', 10, 100, 0.5, (v) => '$' + f2(v)],
    ];
    if (st.realq !== null) sliders.push(['realq', 'Real-world P(up)', 0, 1, 0.01, f2]);

    const controls = document.createElement('div'); controls.className = 'bt-controls';
    sliders.forEach(([key, label, min, max, step, fmt]) => {
      if (lock.includes(key)) return;
      const l = document.createElement('label');
      const span = document.createElement('span');
      const inp = document.createElement('input');
      Object.assign(inp, { type: 'range', min, max, step, value: st[key] });
      inp.addEventListener('input', () => { st[key] = +inp.value; draw(); });
      l.append(span, inp); controls.append(l);
      l._upd = () => { span.textContent = label + ': ' + fmt(st[key]); };
      l._upd(); controls._labels = (controls._labels || []).concat(l);
    });
    if (!lock.includes('type')) {
      const tb = document.createElement('div'); tb.className = 'bt-type';
      ['call', 'put'].forEach((ty) => {
        const b = document.createElement('button'); b.textContent = ty === 'call' ? 'Call' : 'Put';
        b.addEventListener('click', () => { st.type = ty; draw(); });
        b.dataset.ty = ty; tb.append(b);
      });
      controls.append(tb); controls._tb = tb;
    }
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    const out = document.createElement('div'); out.className = 'bt-out';
    const warn = document.createElement('div'); warn.className = 'bt-warn';
    root.append(controls, svg, out, warn);

    function el(tag, attrs, text) {
      const e = document.createElementNS(svgNS, tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (text !== undefined) e.textContent = text;
      svg.append(e); return e;
    }

    function draw() {
      (controls._labels || []).forEach((l) => l._upd());
      if (controls._tb) controls._tb.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.ty === st.type));
      const n = st.steps, dt = st.t / n, g = Math.exp(st.r * dt), disc = 1 / g;
      const p = (g - st.d) / (st.u - st.d);
      const pay = (S) => (st.type === 'call' ? Math.max(S - st.k, 0) : Math.max(st.k - S, 0));
      // stock[i][j]: step i, j up-moves
      const S = [], V = [];
      for (let i = 0; i <= n; i++) { S[i] = []; for (let j = 0; j <= i; j++) S[i][j] = st.s * Math.pow(st.u, j) * Math.pow(st.d, i - j); }
      V[n] = S[n].map(pay);
      for (let i = n - 1; i >= 0; i--) { V[i] = []; for (let j = 0; j <= i; j++) V[i][j] = disc * (p * V[i + 1][j + 1] + (1 - p) * V[i + 1][j]); }

      // draw
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const W = 560, H = 60 + 70 * n, x0 = 70, dx = (W - 150) / n, yMid = H / 2;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const pos = (i, j) => [x0 + i * dx, yMid - (2 * j - i) * (H - 50) / (2 * Math.max(n, 1)) * 0.95];
      for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
        const [xa, ya] = pos(i, j), [xu, yu] = pos(i + 1, j + 1), [xd, yd] = pos(i + 1, j);
        el('line', { x1: xa + 30, y1: ya, x2: xu - 30, y2: yu }); el('line', { x1: xa + 30, y1: ya, x2: xd - 30, y2: yd });
      }
      for (let i = 0; i <= n; i++) for (let j = 0; j <= i; j++) {
        const [x, y] = pos(i, j);
        el('text', { x, y: y - 4, 'text-anchor': 'middle', 'font-size': 13 }, f2(S[i][j]));
        el('text', { x, y: y + 13, 'text-anchor': 'middle', 'font-size': 13, class: 'opt' }, f4(V[i][j]));
      }
      el('text', { x: 4, y: 14, 'font-size': 11, class: 'muted' }, 'top: stock · bottom (accent): ' + st.type + ' value');
      if (n === 1) {
        const [xu, yu] = pos(1, 1), [xd, yd] = pos(1, 0), [xa, ya] = pos(0, 0);
        el('text', { x: (xa + xu) / 2, y: (ya + yu) / 2 - 8, 'text-anchor': 'middle', 'font-size': 11, class: 'muted' }, 'p = ' + f4(p));
        el('text', { x: (xa + xd) / 2, y: (ya + yd) / 2 + 18, 'text-anchor': 'middle', 'font-size': 11, class: 'muted' }, '1 − p = ' + f4(1 - p));
      }

      const delta = (V[1][1] - V[1][0]) / (S[1][1] - S[1][0]);
      let html = `<div>Growth per step \\(e^{r\\Delta t}\\): <b>${f4(g)}</b></div>` +
        `<div>Risk-neutral \\(p\\): <b>${f4(p)}</b></div>` +
        `<div>Option value today \\(f\\): <b>${f4(V[0][0])}</b></div>` +
        `<div>Delta at the first step \\(\\Delta\\): <b>${f4(delta)}</b></div>`;
      if (n === 1) {
        const piT = S[1][1] * delta - V[1][1];
        html += `<div>Replication: \\(\\Delta S_0 - (\\Delta S_u - f_u)e^{-rT}\\) =<b>${f4(st.s * delta - piT * disc)}</b></div>` +
          `<div>RN expected stock \\(pS_u+(1-p)S_d\\) = <b>${f2(p * S[1][1] + (1 - p) * S[1][0])}</b> \\(= S_0e^{rT}\\)</div>`;
      }
      if (st.realq !== null && n === 1) {
        const wrong = disc * (st.realq * V[1][1] + (1 - st.realq) * V[1][0]);
        html += `<div class="bt-wrong">Wrong: real-world payoff at \\(r\\) = <b>${f4(wrong)}</b></div>` +
          `<div>Real-world expected stock return: <b>${((st.realq * st.u + (1 - st.realq) * st.d - 1) * 100).toFixed(1)}%</b></div>`;
      }
      out.innerHTML = html;
      if (window.renderMathInElement) window.renderMathInElement(out, { delimiters: [{ left: '\\(', right: '\\)', display: false }], throwOnError: false });
      if (!(st.d < g && g < st.u)) {
        warn.style.display = 'block';
        warn.textContent = (g >= st.u
          ? 'e^(rΔt) ≥ u: the bond beats the stock even in the up state, so p ≥ 1. Arbitrage: short the stock and lend the proceeds.'
          : 'e^(rΔt) ≤ d: the stock beats the bond even in the down state, so p ≤ 0. Arbitrage: borrow and buy the stock.') +
          ' The "price" shown is meaningless (it can even be negative).';
      } else warn.style.display = 'none';
    }
    draw();
  }

  document.addEventListener('DOMContentLoaded', () => { injectCSS(); document.querySelectorAll('.bintree').forEach(build); });
})();
