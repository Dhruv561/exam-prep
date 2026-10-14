// Reusable plot for sequences / partial sums of series against their limit, showing the
// maximum error on a domain D (the quantity that must -> 0 for UNIFORM convergence).
// Usable for power series (Topic 2) and Fourier partial sums (later topics).
//
// Usage (after this script has loaded):
//   <div id="p1"></div>
//   <script>
//   SeriesPlot.mount(document.getElementById('p1'), {
//     seq:  (N, t) => t ** N,          // EITHER the N-th function of a sequence…
//     term: (n, t) => t ** n, n0: 0,   // …OR the n-th term of a series (partial sum S_N = Σ_{n=n0}^{N})
//     limit: (t) => (t < 1 ? 0 : 1),   // the (pointwise) limit W(t)
//     x: [0, 1.05], y: [-0.1, 1.15],   // plot window
//     N: { min: 1, max: 60, value: 5 },
//     D: [0, 1],                       // fixed domain D for the max error, OR
//     win: { label: 'b', min: 0.5, max: 1, step: 0.01, value: 1,
//            D: (b) => [0, b], text: (b) => `D = [0, ${b}]` },   // a slider that moves D
//     sup: (N, b) => ({ value: 1, t: 1 }),  // optional exact max error {value (Infinity ok), t}; else sampled
//     tail: (N) => 0.1,                // optional Weierstrass tail bound Σ_{n>N} a_n to display
//     dots: [{ t: 1, y: 1 }, { t: 1, y: 0, open: true }],  // optional marked points of the limit
//     xTicks: [{ v: Math.PI, label: 'π' }],  // optional custom ticks
//     labels: { seq: 'S_N(t)', limit: 'limit' },
//   });
//   </script>

(function () {
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function fmt(x) {
    if (!isFinite(x)) return '∞';
    if (x === 0) return '0';
    const a = Math.abs(x);
    let s;
    if (a >= 100) s = x.toFixed(0);
    else if (a >= 0.001) s = x.toPrecision(3);
    else s = x.toExponential(1);
    if (s.includes('.') && !s.includes('e')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('-', '−');
  }

  function niceStep(span) {
    const raw = span / 5, p = Math.pow(10, Math.floor(Math.log10(raw)));
    const m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }

  let styled = false;
  function injectStyle() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.sp { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.sp canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; touch-action: pan-y; }
.sp-read { font-family: Inter, system-ui, sans-serif; font-size: .85rem; margin-top: .5rem; text-align: center; }
.sp-read .sp-err { color: var(--bad); font-weight: 600; }
.sp-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; }
.sp-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.sp-ctl { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: .3rem 1.2rem; margin-top: .6rem; width: 100%; max-width: 460px; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.sp-ctl label { display: flex; flex-direction: column; }
.sp-ctl input { width: 100%; accent-color: var(--accent); min-height: 28px; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('sp');
    el.innerHTML = '';
    const st = { N: cfg.N.value, w: cfg.win ? cfg.win.value : null };
    const canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', cfg.aria || 'Plot of a sequence of functions and its limit, with the maximum error marked');
    const read = document.createElement('div'); read.className = 'sp-read';
    const key = document.createElement('div'); key.className = 'sp-key';
    const ctl = document.createElement('div'); ctl.className = 'sp-ctl';
    el.append(canvas, read, key, ctl);

    const labels = Object.assign({ seq: cfg.term ? 'partial sum S_N(t)' : 'W_N(t)', limit: 'limit W(t)' }, cfg.labels || {});

    function slider(text, min, max, step, value, on) {
      const lab = document.createElement('label');
      const span = document.createElement('span');
      const inp = document.createElement('input');
      inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = value;
      const set = () => { span.textContent = text(+inp.value); };
      set();
      inp.addEventListener('input', () => { on(+inp.value); set(); draw(); });
      lab.append(span, inp); ctl.appendChild(lab);
    }
    slider((v) => `N = ${v}`, cfg.N.min, cfg.N.max, 1, st.N, (v) => { st.N = v; });
    if (cfg.win) slider((v) => cfg.win.text(v), cfg.win.min, cfg.win.max, cfg.win.step, st.w, (v) => { st.w = v; });

    function S(t) {
      if (cfg.seq) return cfg.seq(st.N, t);
      let s = 0;
      for (let n = cfg.n0 || 0; n <= st.N; n++) s += cfg.term(n, t);
      return s;
    }

    function draw() {
      const C = {
        fg: cssVar('--fg', '#1d1d1b'), muted: cssVar('--muted', '#6b6b66'), rule: cssVar('--rule', '#e4e2d6'),
        accent: cssVar('--accent', '#8a2b0e'), ok: cssVar('--ok', '#1f6f43'), bad: cssVar('--bad', '#a3261b'),
        card: cssVar('--card', '#f7f5ea'), bg: cssVar('--bg', '#fffff8'),
      };
      key.innerHTML = `<i style="background:${C.ok}"></i>${labels.seq}<i style="background:${C.accent}"></i>${labels.limit}<i style="background:${C.bad}"></i>max error on D`;

      const W = Math.min(el.parentElement ? el.parentElement.clientWidth : 560, 560) || 560;
      const H = Math.round(W * 0.6);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      const [x0, x1] = cfg.x, [y0, y1] = cfg.y;
      const padL = 34, padR = 10, padT = 10, padB = 24;
      const X = (t) => padL + (t - x0) / (x1 - x0) * (W - padL - padR);
      const Y = (v) => padT + (y1 - v) / (y1 - y0) * (H - padT - padB);
      const D = cfg.win ? cfg.win.D(st.w) : (cfg.D || cfg.x);

      // domain band
      g.fillStyle = C.card;
      g.fillRect(X(D[0]), padT, X(D[1]) - X(D[0]), H - padT - padB);
      g.strokeStyle = C.rule; g.lineWidth = 1;
      [D[0], D[1]].forEach((d) => { g.beginPath(); g.moveTo(X(d), padT); g.lineTo(X(d), H - padB); g.stroke(); });

      // axes + ticks
      g.font = '11px Inter, system-ui, sans-serif'; g.fillStyle = C.muted;
      g.strokeStyle = C.muted;
      const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
      g.beginPath(); g.moveTo(padL, Y(ax)); g.lineTo(W - padR, Y(ax)); g.stroke();
      g.beginPath(); g.moveTo(X(ay), padT); g.lineTo(X(ay), H - padB); g.stroke();
      g.textAlign = 'center'; g.textBaseline = 'top';
      const xt = cfg.xTicks || (() => { const s = niceStep(x1 - x0), a = []; for (let v = Math.ceil(x0 / s) * s; v <= x1 + 1e-9; v += s) a.push({ v, label: fmt(+v.toFixed(10)) }); return a; })();
      xt.forEach(({ v, label }) => { g.fillText(label, X(v), H - padB + 4); g.beginPath(); g.moveTo(X(v), Y(ax) - 3); g.lineTo(X(v), Y(ax) + 3); g.stroke(); });
      g.textAlign = 'right'; g.textBaseline = 'middle';
      const sy = niceStep(y1 - y0);
      for (let v = Math.ceil(y0 / sy) * sy; v <= y1 + 1e-9; v += sy) { if (Math.abs(v) < 1e-9) continue; g.fillText(fmt(+v.toFixed(10)), padL - 5, Y(v)); }

      g.save();
      g.beginPath(); g.rect(padL, padT, W - padL - padR, H - padT - padB); g.clip();

      const M = Math.max(300, Math.round(W));
      function curve(f, colour, width) {
        g.strokeStyle = colour; g.lineWidth = width; g.beginPath();
        let pen = false, prev = null;
        for (let i = 0; i <= M; i++) {
          const t = x0 + (x1 - x0) * i / M, v = f(t);
          if (!isFinite(v)) { pen = false; prev = null; continue; }
          const big = prev !== null && Math.abs(v - prev) > (y1 - y0) * 0.35;
          const py = Math.max(-1e4, Math.min(1e4, Y(v)));
          if (!pen || big) { g.moveTo(X(t), py); pen = true; } else g.lineTo(X(t), py);
          prev = v;
        }
        g.stroke();
      }
      curve(cfg.limit, C.accent, 2.2);
      curve(S, C.ok, 2);
      (cfg.dots || []).forEach((d) => {
        g.beginPath(); g.arc(X(d.t), Y(d.y), 4, 0, 2 * Math.PI);
        if (d.open) { g.fillStyle = C.bg; g.fill(); g.strokeStyle = C.accent; g.lineWidth = 1.8; g.stroke(); }
        else { g.fillStyle = C.accent; g.fill(); }
      });

      // max error on D
      let best = { value: -1, t: D[0] };
      if (cfg.sup) best = cfg.sup(st.N, st.w);
      else {
        const K = 1200;
        for (let i = 0; i <= K; i++) {
          const t = D[0] + (D[1] - D[0]) * i / K, e = Math.abs(S(t) - cfg.limit(t));
          if (isFinite(e) && e > best.value) best = { value: e, t };
        }
      }
      if (best.t !== undefined && best.t !== null) {
        const a = S(best.t), b = cfg.limit(best.t);
        const ya = isFinite(a) ? Y(a) : padT, yb = isFinite(b) && isFinite(best.value) ? Y(b) : padT;
        g.strokeStyle = C.bad; g.lineWidth = 2.4;
        g.beginPath(); g.moveTo(X(best.t), ya); g.lineTo(X(best.t), yb); g.stroke();
        [ya, yb].forEach((yy) => { g.beginPath(); g.moveTo(X(best.t) - 5, yy); g.lineTo(X(best.t) + 5, yy); g.stroke(); });
      }
      g.restore();

      let txt = `N = ${st.N} · max error on D: <span class="sp-err">${fmt(best.value)}</span>`;
      if (cfg.supNote) txt += ` <span style="color:${C.muted}">${cfg.supNote(st.N, st.w, best.value)}</span>`;
      if (cfg.tail) txt += ` · Weierstrass tail bound Σ<sub>n&gt;N</sub> a<sub>n</sub> = ${fmt(cfg.tail(st.N))}`;
      read.innerHTML = txt;
    }

    draw();
    window.addEventListener('resize', draw);
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', draw);
    return { redraw: draw };
  }

  window.SeriesPlot = { mount };
})();
