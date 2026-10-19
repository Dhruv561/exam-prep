// 1D heat-equation solution u(x,t) = c0 + Σ c_n e^{-α k_n² t} X_n(x) on [0, L], drawn as a
// curve with a time slider. Optional "exam sketch" button overlays u at t = 0, t1, t2 and ∞.
//
// Usage (after this script has loaded):
//   <div id="h1"></div>
//   <script>
//   PdeHeat.mount(document.getElementById('h1'), {
//     L: 2, alpha: 1,
//     // EITHER a finite list of modes …
//     terms: [{ c: 5, k: Math.PI / 2, fn: 'sin' }, { c: 1, k: 3 * Math.PI / 4, fn: 'sin' }],
//     // … OR an infinite series (summed to N terms):
//     series: { c: (n) => 4 / (n * Math.PI), k: (n) => n * Math.PI / 2, fn: 'sin', N: 200 },
//     c0: 0,                         // constant (λ0 = 0) mode, e.g. a0/2 for Neumann; default 0
//     f: (x) => 2 - x,               // optional exact IC, drawn at t = 0 instead of the series
//     tMax: 1,                       // slider range [0, tMax]; slider is quadratic (fine near t = 0)
//     t: 0.02,                       // starting time
//     snapshots: [0.05, 0.3],        // t1, t2 for the exam-sketch overlay (default tMax/20, tMax/4)
//     y: [-0.2, 2.2],                // plot window
//     xTicks: [{ v: 1, label: '1' }],// optional; default 0, L/2, L
//     yTicks: [1, 2],                // optional
//   });
//   </script>
// fn is 'sin' or 'cos'. k is the spatial wavenumber (nπ/L, (n−½)π/L, …); decay rate is α k².
// Returns { redraw, setT(t) }.

(function () {
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function fmt(x) {
    if (Math.abs(x) < 1e-9) return '0';
    let s = Math.abs(x) >= 100 ? x.toFixed(0) : x.toPrecision(3);
    if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('-', '−');
  }

  let styled = false;
  function injectStyle() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.ph { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.ph canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; touch-action: pan-y; }
.ph-bar { display: flex; flex-wrap: wrap; gap: .4rem; justify-content: center; margin-bottom: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.ph-bar button { font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 999px; padding: .3rem .9rem; cursor: pointer; min-height: 32px; }
.ph-bar button[aria-pressed="true"] { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.ph-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; margin-top: .4rem; }
.ph-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.ph-ctl { width: 100%; max-width: 340px; margin-top: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; display: flex; flex-direction: column; }
.ph-ctl input { width: 100%; accent-color: var(--accent); min-height: 28px; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('ph');
    el.innerHTML = '';
    const L = cfg.L, a = cfg.alpha == null ? 1 : cfg.alpha, c0 = cfg.c0 || 0;
    const tMax = cfg.tMax || 1;
    const snaps = cfg.snapshots || [tMax / 20, tMax / 4];
    const st = { t: cfg.t == null ? 0 : cfg.t, sketch: false };

    // Flatten modes to arrays once.
    const modes = [];
    if (cfg.terms) cfg.terms.forEach((m) => modes.push({ c: m.c, k: m.k, cos: m.fn === 'cos' }));
    if (cfg.series) {
      const s = cfg.series, N = s.N || 200;
      for (let n = 1; n <= N; n++) { const c = s.c(n); if (c) modes.push({ c, k: s.k(n), cos: s.fn === 'cos' }); }
    }
    function u(x, t) {
      if (t <= 0 && cfg.f) return cfg.f(x);
      let s = c0;
      for (const m of modes) {
        const d = Math.exp(-a * m.k * m.k * t);
        if (d < 1e-12) continue;
        s += m.c * d * (m.cos ? Math.cos(m.k * x) : Math.sin(m.k * x));
      }
      return s;
    }

    const bar = document.createElement('div'); bar.className = 'ph-bar';
    const btn = document.createElement('button'); btn.type = 'button';
    btn.textContent = 'Exam sketch: t = 0, t₁, t₂, ∞';
    btn.addEventListener('click', () => { st.sketch = !st.sketch; draw(); });
    bar.appendChild(btn);
    const canvas = document.createElement('canvas'); canvas.setAttribute('role', 'img');
    const ctl = document.createElement('label'); ctl.className = 'ph-ctl';
    const span = document.createElement('span');
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = 0; inp.max = 1000; inp.step = 1;
    inp.value = Math.round(Math.sqrt(st.t / tMax) * 1000);
    inp.addEventListener('input', () => { const s = +inp.value / 1000; st.t = tMax * s * s; draw(); });
    ctl.append(span, inp);
    const key = document.createElement('div'); key.className = 'ph-key';
    el.append(bar, canvas, ctl, key);

    function draw() {
      btn.setAttribute('aria-pressed', st.sketch ? 'true' : 'false');
      span.textContent = `Time t = ${fmt(st.t)}`;
      const C = {
        fg: cssVar('--fg', '#1d1d1b'), muted: cssVar('--muted', '#6b6b66'), rule: cssVar('--rule', '#e4e2d6'),
        accent: cssVar('--accent', '#8a2b0e'), ok: cssVar('--ok', '#1f6f43'), trap: cssVar('--trap', '#8a5a00'),
      };
      key.innerHTML = `<i style="background:${C.accent}"></i>u(x, t)<i style="background:${C.ok}"></i>steady state u(x, ∞)` +
        (st.sketch ? `<i style="background:${C.muted}"></i>t = 0, t₁ = ${fmt(snaps[0])}, t₂ = ${fmt(snaps[1])}` : '');
      canvas.setAttribute('aria-label', `Temperature profile u(x,t) on 0 to ${fmt(L)} at t = ${fmt(st.t)}`);

      const W = Math.min(el.parentElement ? el.parentElement.clientWidth : 600, 560) || 560;
      const H = Math.round(W * 0.5);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      const [y0, y1] = cfg.y;
      const padL = 34, padR = 12, padT = 10, padB = 22;
      const X = (v) => padL + v / L * (W - padL - padR);
      const Y = (v) => padT + (y1 - v) / (y1 - y0) * (H - padT - padB);

      g.strokeStyle = C.muted; g.fillStyle = C.muted; g.lineWidth = 1;
      g.font = '11px Inter, system-ui, sans-serif';
      const yAx = Math.min(Math.max(0, y0), y1);
      g.beginPath(); g.moveTo(X(0), Y(yAx)); g.lineTo(X(L), Y(yAx)); g.stroke();
      g.beginPath(); g.moveTo(X(0), padT); g.lineTo(X(0), H - padB); g.stroke();
      g.textAlign = 'center'; g.textBaseline = 'top';
      (cfg.xTicks || [{ v: L / 2, label: fmt(L / 2) }, { v: L, label: fmt(L) }]).forEach(({ v, label }) => {
        g.fillText(label, X(v), H - padB + 4);
        g.beginPath(); g.moveTo(X(v), Y(yAx) - 3); g.lineTo(X(v), Y(yAx) + 3); g.stroke();
      });
      g.fillText('x', X(L) - 6, Y(yAx) - 16);
      g.textAlign = 'right'; g.textBaseline = 'middle';
      (cfg.yTicks || [y1 * 0.8, y0 * 0.8].map((v) => +v.toPrecision(2))).forEach((v) => {
        if (v < y0 || v > y1 || Math.abs(v) < 1e-9) return;
        g.fillText(fmt(v), padL - 4, Y(v));
        g.beginPath(); g.moveTo(X(0) - 3, Y(v)); g.lineTo(X(0) + 3, Y(v)); g.stroke();
      });

      g.save();
      g.beginPath(); g.rect(padL, padT, W - padL - padR, H - padT - padB); g.clip();
      const M = Math.max(300, W);
      function curve(t, colour, width, dash) {
        g.strokeStyle = colour; g.lineWidth = width; g.setLineDash(dash || []); g.beginPath();
        let prev = null;
        for (let i = 0; i <= M; i++) {
          const xv = L * (i === 0 ? 1e-6 : i === M ? 1 - 1e-6 : i / M), v = u(xv, t);
          const jump = prev !== null && Math.abs(v - prev) > (y1 - y0) * 0.08;
          if (i === 0 || jump) g.moveTo(X(xv), Y(v)); else g.lineTo(X(xv), Y(v));
          prev = v;
        }
        g.stroke(); g.setLineDash([]);
      }
      // steady state
      g.strokeStyle = C.ok; g.lineWidth = 1.6; g.setLineDash([6, 4]);
      g.beginPath(); g.moveTo(X(0), Y(c0)); g.lineTo(X(L), Y(c0)); g.stroke(); g.setLineDash([]);
      if (st.sketch) {
        g.globalAlpha = 0.75;
        curve(0, C.muted, 1.4);
        curve(snaps[0], C.muted, 1.4, [4, 3]);
        curve(snaps[1], C.muted, 1.4, [1.5, 3]);
        g.globalAlpha = 1;
      }
      curve(st.t, C.accent, 2.8);
      g.restore();
    }

    draw();
    window.addEventListener('resize', draw);
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', draw);
    return { redraw: draw, setT: (t) => { st.t = t; inp.value = Math.round(Math.sqrt(t / tMax) * 1000); draw(); } };
  }

  window.PdeHeat = { mount };
})();
