// Futures-option binomial tree explorer (self-contained; first used in Lesson 21).
//
// Usage: <div class="fote" data-f0="50" data-k="50" data-sigma="0.30" data-r="0.05"
//             data-t="0.5" data-n="2" data-type="put" data-style="amer" data-under="futures"></div>
//        <script src="../assets/futures-option-tree-explorer.js"></script>
// Every .fote on the page becomes an interactive tree: u = e^{σ√Δt}, d = 1/u,
// p = (a − d)/(u − d) with a = 1 (futures) or e^{rΔt} (non-dividend stock),
// discounting at e^{−rΔt}. American nodes take max(continuation, intrinsic) and
// early-exercise nodes are highlighted. Styles use the lesson CSS variables.

(function () {
  const CSS = `
.fote { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.fote .fc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .45rem 1rem; }
.fote label { display: flex; flex-direction: column; gap: .15rem; }
.fote input[type=range] { width: 100%; accent-color: var(--accent); }
.fote select { font: inherit; padding: .25rem; background: var(--bg); color: var(--fg); border: 1px solid var(--rule); border-radius: 4px; }
.fote .fo { margin-top: .8rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .3rem 1rem; font-variant-numeric: tabular-nums; }
.fote .fo b { font-size: .95rem; }
.fote svg { width: 100%; height: auto; margin-top: .6rem; }
.fote svg text { font-family: Inter, system-ui, sans-serif; font-variant-numeric: tabular-nums; }
.fote .fn { color: var(--muted); margin-top: .4rem; }
.fote .fcmp { margin-top: .5rem; padding: .5rem .7rem; background: var(--card); border-radius: 6px; }
`;
  function injectCSS() {
    if (document.getElementById('fote-css')) return;
    const s = document.createElement('style'); s.id = 'fote-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  function price(o, under) {
    const dt = o.T / o.n, u = Math.exp(o.sigma * Math.sqrt(dt)), d = 1 / u;
    const a = under === 'futures' ? 1 : Math.exp(o.r * dt);
    const p = (a - d) / (u - d), disc = Math.exp(-o.r * dt);
    const pay = (F) => o.type === 'call' ? Math.max(F - o.K, 0) : Math.max(o.K - F, 0);
    const nodes = []; // nodes[i][j] = {F, v, ex}
    nodes[o.n] = [];
    for (let j = 0; j <= o.n; j++) { const F = o.F0 * Math.pow(u, j) * Math.pow(d, o.n - j); nodes[o.n][j] = { F, v: pay(F), ex: false }; }
    for (let i = o.n - 1; i >= 0; i--) {
      nodes[i] = [];
      for (let j = 0; j <= i; j++) {
        const F = o.F0 * Math.pow(u, j) * Math.pow(d, i - j);
        const cont = disc * (p * nodes[i + 1][j + 1].v + (1 - p) * nodes[i + 1][j].v);
        const intr = pay(F);
        const ex = o.style === 'amer' && intr > cont + 1e-12;
        nodes[i][j] = { F, v: ex ? intr : cont, ex };
      }
    }
    const delta = (nodes[1][1].v - nodes[1][0].v) / (nodes[1][1].F - nodes[1][0].F);
    return { u, d, p, dt, nodes, delta };
  }

  function draw(nodes, n) {
    const W = 640, colW = n <= 1 ? 260 : (W - 120) / n, rowH = 34, H = (2 * n + 1) * rowH + 20;
    const x = (i) => 60 + i * colW, y = (i, j) => H / 2 - (2 * j - i) * rowH;
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Binomial tree">`;
    for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
      s += `<line x1="${x(i)}" y1="${y(i, j)}" x2="${x(i + 1)}" y2="${y(i + 1, j + 1)}" stroke="var(--rule)" stroke-width="1.5"/>`;
      s += `<line x1="${x(i)}" y1="${y(i, j)}" x2="${x(i + 1)}" y2="${y(i + 1, j)}" stroke="var(--rule)" stroke-width="1.5"/>`;
    }
    for (let i = 0; i <= n; i++) for (let j = 0; j <= i; j++) {
      const nd = nodes[i][j], cx = x(i), cy = y(i, j);
      const fill = nd.ex ? 'var(--trap-bg)' : 'var(--bg)', stroke = nd.ex ? 'var(--trap)' : 'var(--rule)';
      s += `<rect x="${cx - 40}" y="${cy - 19}" width="80" height="38" rx="5" fill="${fill}" stroke="${stroke}"/>`;
      s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="12" fill="var(--muted)">${nd.F.toFixed(2)}</text>`;
      s += `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="13" font-weight="600" fill="${nd.ex ? 'var(--trap)' : 'var(--fg)'}">${nd.v.toFixed(4)}</text>`;
    }
    return s + '</svg>';
  }

  function build(root) {
    const g = (k, dflt) => root.dataset[k] !== undefined ? root.dataset[k] : dflt;
    root.innerHTML = `
<div class="fc">
  <label>Underlying<select data-k="under"><option value="futures">Futures price</option><option value="stock">Stock (no dividends)</option></select></label>
  <label>Option<select data-k="type"><option value="call">Call</option><option value="put">Put</option></select></label>
  <label>Style<select data-k="style"><option value="euro">European</option><option value="amer">American</option></select></label>
  <label>Start price <span data-v="F0"></span><input type="range" data-k="F0" min="20" max="120" step="1"></label>
  <label>Strike K <span data-v="K"></span><input type="range" data-k="K" min="20" max="120" step="1"></label>
  <label>Steps <span data-v="n"></span><input type="range" data-k="n" min="1" max="4" step="1"></label>
  <label>Volatility σ <span data-v="sigma"></span><input type="range" data-k="sigma" min="0.05" max="0.8" step="0.01"></label>
  <label>Rate r <span data-v="r"></span><input type="range" data-k="r" min="0" max="0.15" step="0.005"></label>
  <label>Life T (years) <span data-v="T"></span><input type="range" data-k="T" min="0.25" max="2" step="0.25"></label>
</div>
<div class="fo">
  <div>u = <b data-o="u"></b></div><div>d = <b data-o="d"></b></div>
  <div>p = <b data-o="p"></b></div><div>Δ at t=0 = <b data-o="delta"></b></div>
</div>
<div data-o="svg"></div>
<div class="fcmp" data-o="cmp"></div>
<div class="fn">Each node: top = underlying price, bottom = option value. Amber nodes: exercise early (American only).</div>`;
    const ctl = (k) => root.querySelector(`[data-k="${k}"]`);
    ctl('under').value = g('under', 'futures'); ctl('type').value = g('type', 'call'); ctl('style').value = g('style', 'euro');
    ctl('F0').value = g('f0', 50); ctl('K').value = g('k', 50); ctl('n').value = g('n', 2);
    ctl('sigma').value = g('sigma', 0.3); ctl('r').value = g('r', 0.05); ctl('T').value = g('t', 0.5);
    const out = (k) => root.querySelector(`[data-o="${k}"]`);
    function upd() {
      const o = { F0: +ctl('F0').value, K: +ctl('K').value, n: +ctl('n').value, sigma: +ctl('sigma').value, r: +ctl('r').value, T: +ctl('T').value, type: ctl('type').value, style: ctl('style').value };
      const under = ctl('under').value;
      root.querySelector('[data-v="F0"]').textContent = o.F0; root.querySelector('[data-v="K"]').textContent = o.K;
      root.querySelector('[data-v="n"]').textContent = o.n + ' (Δt = ' + (o.T / o.n).toFixed(4) + ')';
      root.querySelector('[data-v="sigma"]').textContent = (o.sigma * 100).toFixed(0) + '%';
      root.querySelector('[data-v="r"]').textContent = (o.r * 100).toFixed(1) + '%';
      root.querySelector('[data-v="T"]').textContent = o.T.toFixed(2);
      const res = price(o, under), other = price(o, under === 'futures' ? 'stock' : 'futures');
      out('u').textContent = res.u.toFixed(4); out('d').textContent = res.d.toFixed(4);
      out('p').textContent = res.p.toFixed(4); out('delta').textContent = res.delta.toFixed(4);
      out('svg').innerHTML = draw(res.nodes, o.n);
      const nm = under === 'futures' ? 'a non-dividend stock' : 'a futures price';
      const exCount = res.nodes.flat().filter((x) => x.ex).length;
      out('cmp').innerHTML = `Value today: <b>${res.nodes[0][0].v.toFixed(4)}</b>. Same numbers with ${nm} as the underlying: p = ${other.p.toFixed(4)}, value ${other.nodes[0][0].v.toFixed(4)}.` +
        (o.style === 'amer' ? ` Early-exercise nodes here: ${exCount}.` : '');
    }
    root.querySelectorAll('select, input').forEach((el) => el.addEventListener('input', upd));
    upd();
  }

  function init() { injectCSS(); document.querySelectorAll('.fote').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
