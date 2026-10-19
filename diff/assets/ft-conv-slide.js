// Sliding-window picture of a convolution (f*g)(s) = ∫ f(s − t) g(t) dt.
// Top panel: g(t) (fixed) and f(s − t) (flipped, slides with s); their product is shaded and the
// breakpoints (kinks/jumps you must split the integral at) are marked. Bottom panel: (f*g)(s),
// traced numerically, with a dot at the current s. A slider moves s.
//
// Usage (after this script has loaded):
//   <div id="c1"></div>
//   <script>
//   FtConvSlide.mount(document.getElementById('c1'), {
//     f: (x) => (Math.abs(x) < 1 ? 1 : 0),        // the factor that gets flipped and shifted
//     g: (x) => (Math.abs(x) < 1 ? 1 : 0),
//     t: [-4, 4],          // horizontal window, for both panels
//     y: [-0.1, 1.3],      // top-panel window
//     yc: [-0.1, 2.3],     // bottom-panel window for f*g
//     s0: 0.6,             // initial shift
//     vars: ['ξ', 'x'],    // names of integration variable and shift (default ['ξ','x'])
//     breaks: (s) => [{ v: -1, label: '−1' }, ...],   // optional: breakpoints to mark at shift s
//     labels: ['g(ξ)', 'f(x−ξ)', '(f*g)(x)'],         // optional legend text
//   });
//   </script>

(function () {
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const fmt = (x) => x.toFixed(2).replace('-', '−');

  let styled = false;
  function injectStyle() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.fcs { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.fcs canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; }
.fcs canvas + canvas { margin-top: .4rem; }
.fcs-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; margin-top: .4rem; }
.fcs-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.fcs-ctl { width: 100%; max-width: 420px; margin-top: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; display: flex; gap: .6rem; align-items: center; }
.fcs-ctl input { flex: 1; accent-color: var(--accent); min-height: 28px; }
.fcs-ctl span { min-width: 9em; text-align: right; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('fcs');
    const [t0, t1] = cfg.t, y = cfg.y, yc = cfg.yc;
    const vars = cfg.vars || ['ξ', 'x'];
    const labels = cfg.labels || [`g(${vars[0]})`, `f(${vars[1]}−${vars[0]})`, `(f*g)(${vars[1]})`];
    let s = cfg.s0 != null ? cfg.s0 : 0;

    const top = document.createElement('canvas'), bot = document.createElement('canvas');
    el.append(top, bot);
    const key = document.createElement('div'); key.className = 'fcs-key'; el.appendChild(key);
    const ctl = document.createElement('div'); ctl.className = 'fcs-ctl';
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = 1000;
    slider.value = Math.round(((s - t0) / (t1 - t0)) * 1000);
    slider.setAttribute('aria-label', 'shift ' + vars[1]);
    const read = document.createElement('span');
    ctl.append(slider, read); el.appendChild(ctl);

    const W = Math.min(640, el.clientWidth || 640), H1 = Math.round(W * 0.34), H2 = Math.round(W * 0.26);
    const dpr = window.devicePixelRatio || 1;
    function setup(c, H) {
      c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
      const ctx = c.getContext('2d'); ctx.scale(dpr, dpr); return ctx;
    }
    const c1 = setup(top, H1), c2 = setup(bot, H2);
    const pad = { l: 12, r: 12, t: 10, b: 22 };
    const X = (v) => pad.l + ((v - t0) / (t1 - t0)) * (W - pad.l - pad.r);
    const Yf = (v, H, w) => pad.t + ((w[1] - v) / (w[1] - w[0])) * (H - pad.t - pad.b);

    // numerical convolution on a grid (trapezoid), precomputed once
    const N = 400, M = 1600, conv = [];
    const span = (t1 - t0) * 1.5, lo = (t0 + t1) / 2 - span, h = (2 * span) / M;
    for (let i = 0; i <= N; i++) {
      const sv = t0 + (i / N) * (t1 - t0); let acc = 0;
      for (let j = 0; j <= M; j++) {
        const tv = lo + j * h, w = j === 0 || j === M ? 0.5 : 1;
        acc += w * cfg.f(sv - tv) * cfg.g(tv);
      }
      conv.push([sv, acc * h]);
    }
    const convAt = (sv) => {
      const i = Math.max(0, Math.min(N, Math.round(((sv - t0) / (t1 - t0)) * N)));
      return conv[i][1];
    };

    function axis(ctx, H, w) {
      ctx.strokeStyle = cssVar('--rule', '#ddd'); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(t0), Yf(0, H, w)); ctx.lineTo(X(t1), Yf(0, H, w)); ctx.stroke();
    }
    function plot(ctx, H, w, fn, color, width) {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
      const K = 800;
      for (let i = 0; i <= K; i++) {
        const tv = t0 + (i / K) * (t1 - t0);
        const v = Math.max(w[0] - 1, Math.min(w[1] + 1, fn(tv)));
        i ? ctx.lineTo(X(tv), Yf(v, H, w)) : ctx.moveTo(X(tv), Yf(v, H, w));
      }
      ctx.stroke();
    }

    function draw() {
      const acc = cssVar('--accent', '#8a2b0e'), ok = cssVar('--ok', '#1f6f43'), trap = cssVar('--trap', '#8a5a00');
      const muted = cssVar('--muted', '#777');
      // top
      c1.clearRect(0, 0, W, H1); axis(c1, H1, y);
      c1.globalAlpha = 0.25; c1.fillStyle = trap; c1.beginPath();
      const K = 800; c1.moveTo(X(t0), Yf(0, H1, y));
      for (let i = 0; i <= K; i++) {
        const tv = t0 + (i / K) * (t1 - t0);
        c1.lineTo(X(tv), Yf(Math.min(y[1], cfg.f(s - tv) * cfg.g(tv)), H1, y));
      }
      c1.lineTo(X(t1), Yf(0, H1, y)); c1.closePath(); c1.fill(); c1.globalAlpha = 1;
      plot(c1, H1, y, cfg.g, ok, 2);
      plot(c1, H1, y, (tv) => cfg.f(s - tv), acc, 2);
      c1.font = '11px Inter, system-ui, sans-serif'; c1.textAlign = 'center';
      const br = cfg.breaks ? cfg.breaks(s) : [];
      br.forEach((b) => {
        c1.strokeStyle = muted; c1.setLineDash([3, 3]); c1.beginPath();
        c1.moveTo(X(b.v), pad.t); c1.lineTo(X(b.v), H1 - pad.b); c1.stroke(); c1.setLineDash([]);
        c1.fillStyle = muted; c1.fillText(b.label, X(b.v), H1 - 7);
      });
      // bottom
      c2.clearRect(0, 0, W, H2); axis(c2, H2, yc);
      c2.beginPath(); c2.strokeStyle = cssVar('--rule', '#ccc'); c2.lineWidth = 2;
      conv.forEach(([sv, v], i) => (i ? c2.lineTo(X(sv), Yf(v, H2, yc)) : c2.moveTo(X(sv), Yf(v, H2, yc))));
      c2.stroke();
      c2.beginPath(); c2.strokeStyle = trap; c2.lineWidth = 2.2;
      conv.filter(([sv]) => sv <= s).forEach(([sv, v], i) => (i ? c2.lineTo(X(sv), Yf(v, H2, yc)) : c2.moveTo(X(sv), Yf(v, H2, yc))));
      c2.stroke();
      const cv = convAt(s);
      c2.fillStyle = trap; c2.beginPath(); c2.arc(X(s), Yf(cv, H2, yc), 4, 0, 2 * Math.PI); c2.fill();
      read.textContent = `${vars[1]} = ${fmt(s)}, ${labels[2]} = ${fmt(cv)}`;
    }

    key.innerHTML = `<i style="background:${cssVar('--ok', '#1f6f43')}"></i>${labels[0]}` +
      `<i style="background:${cssVar('--accent', '#8a2b0e')}"></i>${labels[1]}` +
      `<i style="background:${cssVar('--trap', '#8a5a00')};opacity:.6"></i>product (shaded) → ${labels[2]} (lower panel)`;

    slider.addEventListener('input', () => { s = t0 + (slider.value / 1000) * (t1 - t0); draw(); });
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', draw);
    }
    draw();
  }

  window.FtConvSlide = { mount };
})();
