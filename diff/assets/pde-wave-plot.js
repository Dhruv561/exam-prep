// Animated 1D profiles u(x, t) on [0, L]: play / pause + time slider. Several curves can share
// one axis (e.g. wave vs heat from the same initial condition).
//
// Usage (after this script has loaded):
//   <div id="w1"></div>
//   <script>
//   PdeWave.mount(document.getElementById('w1'), {
//     curves: [                                   // each u(x, t) is your truncated series
//       { u: (x, t) => Math.cos(Math.PI*t) * Math.sin(Math.PI*x), label: 'wave' },
//       { u: (x, t) => Math.exp(-t) * Math.sin(Math.PI*x), label: 'heat', dashed: true },
//     ],
//     L: 1,                 // domain [0, L]
//     tMax: 2,              // slider range [0, tMax]; animation loops
//     speed: 0.5,           // simulated time per real second (default tMax / 8)
//     y: [-1.2, 1.2],       // plot window
//     xTicks: [{ v: 0.5, label: '1/2' }],  // optional (default: 0 and L)
//     ghost: true,          // optional: keep the t = 0 curve as a faint guide (default true)
//   });
//   </script>

(function () {
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  function fmt(x) {
    let s = x.toFixed(2);
    return s.replace('-', '−');
  }

  let styled = false;
  function injectStyle() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.pw { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.pw canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; touch-action: pan-y; }
.pw-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; margin-top: .4rem; }
.pw-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.pw-key i.d { background: none !important; border-top: 2px dashed; height: 0; }
.pw-ctl { width: 100%; max-width: 360px; margin-top: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; display: flex; gap: .6rem; align-items: center; }
.pw-ctl input { flex: 1; accent-color: var(--accent); min-height: 28px; }
.pw-ctl button { font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 999px; padding: .3rem .9rem; cursor: pointer; min-height: 32px; }
.pw-ctl span { min-width: 4.5em; text-align: right; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('pw');
    const L = cfg.L, tMax = cfg.tMax, y = cfg.y;
    const speed = cfg.speed || tMax / 8;
    const ghost = cfg.ghost !== false;
    const xTicks = cfg.xTicks || [{ v: 0, label: '0' }, { v: L, label: String(L) }];

    const canvas = document.createElement('canvas');
    el.appendChild(canvas);
    const key = document.createElement('div'); key.className = 'pw-key'; el.appendChild(key);
    const ctl = document.createElement('div'); ctl.className = 'pw-ctl';
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'Play';
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = 1000; slider.value = 0;
    slider.setAttribute('aria-label', 'time');
    const read = document.createElement('span');
    ctl.append(btn, slider, read); el.appendChild(ctl);

    const W = Math.min(640, (el.clientWidth || 640)), H = Math.round(W * 0.45);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { l: 28, r: 12, t: 12, b: 24 };
    const X = (x) => pad.l + (x / L) * (W - pad.l - pad.r);
    const Y = (v) => pad.t + (y[1] - v) / (y[1] - y[0]) * (H - pad.t - pad.b);

    let t = 0, playing = false, last = 0;
    const palette = () => [cssVar('--accent', '#8a2b0e'), cssVar('--ok', '#1f6f43'), cssVar('--trap', '#8a5a00')];

    key.innerHTML = cfg.curves.map((c, i) =>
      `<i class="${c.dashed ? 'd' : ''}" style="${c.dashed ? 'border-color' : 'background'}:${c.color || palette()[i % 3]}"></i>${c.label || ''}`
    ).join('') + (ghost ? `<i style="background:${cssVar('--rule', '#ccc')}"></i>t = 0` : '');

    function curve(u, tt, color, width, dashed) {
      ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width;
      ctx.setLineDash(dashed ? [6, 4] : []);
      const N = 400;
      for (let i = 0; i <= N; i++) {
        const x = (i / N) * L, v = Math.max(y[0] - 1, Math.min(y[1] + 1, u(x, tt)));
        i ? ctx.lineTo(X(x), Y(v)) : ctx.moveTo(X(x), Y(v));
      }
      ctx.stroke(); ctx.setLineDash([]);
    }

    function draw() {
      const fg = cssVar('--fg', '#111'), muted = cssVar('--muted', '#777'), rule = cssVar('--rule', '#ddd');
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = rule; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(L), Y(0)); ctx.stroke();
      ctx.fillStyle = muted; ctx.font = '11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      xTicks.forEach((tk) => {
        ctx.fillText(tk.label, X(tk.v), H - 8);
        ctx.beginPath(); ctx.moveTo(X(tk.v), Y(0) - 3); ctx.lineTo(X(tk.v), Y(0) + 3); ctx.stroke();
      });
      ctx.fillStyle = fg;
      [0, L].forEach((x) => { ctx.beginPath(); ctx.arc(X(x), Y(0), 3, 0, 2 * Math.PI); ctx.fill(); });
      const pal = palette();
      if (ghost) cfg.curves.forEach((c) => curve(c.u, 0, rule, 2, false));
      cfg.curves.forEach((c, i) => curve(c.u, t, c.color || pal[i % 3], 2.2, c.dashed));
      read.textContent = 't = ' + fmt(t);
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

  window.PdeWave = { mount };
})();
