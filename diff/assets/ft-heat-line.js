// Animated profiles u(x, t) on the whole line (window [-L, L], no boundary dots): play / pause +
// time slider. For comparing heat (spreads, smooths corners), wave (splits, keeps corners) and
// advection (shifts) solutions from the same initial condition. Also exports erf().
//
// Usage (after this script has loaded):
//   <div id="h1"></div>
//   <script>
//   const box = (x) => (Math.abs(x) < 1 ? 1 : 0);
//   FtLine.mount(document.getElementById('h1'), {
//     curves: [
//       { u: (x, t) => 0.5 * (FtLine.erf((x + 1) / Math.sqrt(4 * t)) - FtLine.erf((x - 1) / Math.sqrt(4 * t))), label: 'heat' },
//       { u: (x, t) => 0.5 * (box(x - t) + box(x + t)), label: 'wave', dashed: true },
//     ],
//     L: 6,                 // window [-L, L]
//     tMax: 4,              // slider range [0, tMax]; animation loops
//     speed: 0.5,           // simulated time per real second (default tMax / 8)
//     y: [-0.1, 1.1],       // plot window
//     xTicks: [-4, 0, 4],   // optional tick positions (default -L, 0, L)
//     ghost: true,          // optional: faint t = 0 curve (default true)
//   });
//   </script>
// Curves are evaluated at t = 1e-6 instead of t = 0, so heat formulas with sqrt(t) are safe.

(function () {
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  // Abramowitz & Stegun 7.1.26, |error| < 1.5e-7
  function erf(z) {
    const s = z < 0 ? -1 : 1; z = Math.abs(z);
    const q = 1 / (1 + 0.3275911 * z);
    const p = q * (0.254829592 + q * (-0.284496736 + q * (1.421413741 + q * (-1.453152027 + q * 1.061405429))));
    return s * (1 - p * Math.exp(-z * z));
  }

  let styled = false;
  function injectStyle() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.fl { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.fl canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; }
.fl-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; margin-top: .4rem; }
.fl-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.fl-key i.d { background: none !important; border-top: 2px dashed; height: 0; }
.fl-ctl { width: 100%; max-width: 380px; margin-top: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; display: flex; gap: .6rem; align-items: center; }
.fl-ctl input { flex: 1; accent-color: var(--accent); }
.fl-ctl button { font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 999px; padding: .3rem .9rem; cursor: pointer; }
.fl-ctl span { min-width: 4.5em; text-align: right; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('fl');
    const L = cfg.L, tMax = cfg.tMax, y = cfg.y;
    const speed = cfg.speed || tMax / 8;
    const ghost = cfg.ghost !== false;
    const ticks = cfg.xTicks || [-L, 0, L];

    const canvas = document.createElement('canvas'); el.appendChild(canvas);
    const key = document.createElement('div'); key.className = 'fl-key'; el.appendChild(key);
    const ctl = document.createElement('div'); ctl.className = 'fl-ctl';
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Play';
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = 1000; slider.value = 0;
    slider.setAttribute('aria-label', 'time');
    const read = document.createElement('span');
    ctl.append(btn, slider, read); el.appendChild(ctl);

    const W = Math.min(640, (el.clientWidth || 640)), H = Math.round(W * 0.42);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { l: 12, r: 12, t: 12, b: 24 };
    const X = (x) => pad.l + ((x + L) / (2 * L)) * (W - pad.l - pad.r);
    const Y = (v) => pad.t + (y[1] - v) / (y[1] - y[0]) * (H - pad.t - pad.b);
    const palette = () => [cssVar('--accent', '#8a2b0e'), cssVar('--ok', '#1f6f43'), cssVar('--trap', '#8a5a00')];

    let t = 0, playing = false, last = 0;
    key.innerHTML = cfg.curves.map((c, i) =>
      `<i class="${c.dashed ? 'd' : ''}" style="${c.dashed ? 'border-color' : 'background'}:${c.color || palette()[i % 3]}"></i>${c.label || ''}`
    ).join('') + (ghost ? `<i style="background:${cssVar('--rule', '#ccc')}"></i>t = 0` : '');

    function curve(u, tt, color, width, dashed) {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.setLineDash(dashed ? [6, 4] : []);
      const N = 600, te = Math.max(tt, 1e-6);
      for (let i = 0; i <= N; i++) {
        const x = -L + (i / N) * 2 * L, v = Math.max(y[0] - 1, Math.min(y[1] + 1, u(x, te)));
        i ? ctx.lineTo(X(x), Y(v)) : ctx.moveTo(X(x), Y(v));
      }
      ctx.stroke(); ctx.setLineDash([]);
    }

    function draw() {
      const muted = cssVar('--muted', '#777'), rule = cssVar('--rule', '#ddd');
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = rule; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(-L), Y(0)); ctx.lineTo(X(L), Y(0)); ctx.stroke();
      ctx.fillStyle = muted; ctx.font = '11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      ticks.forEach((v) => {
        ctx.fillText(String(v).replace('-', '−'), X(v), H - 8);
        ctx.beginPath(); ctx.moveTo(X(v), Y(0) - 3); ctx.lineTo(X(v), Y(0) + 3); ctx.stroke();
      });
      const pal = palette();
      if (ghost) cfg.curves.forEach((c) => curve(c.u, 0, rule, 2, false));
      cfg.curves.forEach((c, i) => curve(c.u, t, c.color || pal[i % 3], 2.2, c.dashed));
      read.textContent = 't = ' + t.toFixed(2);
    }

    function step(now) {
      if (!playing) return;
      const dt = last ? (now - last) / 1000 : 0; last = now;
      t += dt * speed; if (t > tMax) t -= tMax;
      slider.value = Math.round((t / tMax) * 1000);
      draw(); requestAnimationFrame(step);
    }
    btn.addEventListener('click', () => {
      playing = !playing; btn.textContent = playing ? 'Pause' : 'Play';
      if (playing) { last = 0; requestAnimationFrame(step); }
    });
    slider.addEventListener('input', () => { t = (slider.value / 1000) * tMax; draw(); });
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', draw);
    }
    draw();
  }

  window.FtLine = { mount, erf };
})();
