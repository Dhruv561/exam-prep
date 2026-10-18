// Even / odd / plain periodic extension of a function given on (0, L), drawn over several
// periods, with an optional Fourier partial-sum overlay (N slider).
//
// Usage (after this script has loaded):
//   <div id="e1"></div>
//   <script>
//   FourierExt.mount(document.getElementById('e1'), {
//     f: (x) => 2 - x,              // the function on (0, L)
//     L: 2,                         // half-period; extension has period 2L
//     modes: ['even', 'odd'],       // buttons offered ('even', 'odd', 'periodic' = f given on (-L, L])
//     mode: 'odd',                  // starting mode
//     periods: 3,                   // drawn on [-periods*L, periods*L]
//     y: [-2.4, 2.4],               // plot window
//     xTicks: [{ v: 2, label: '2' }], // optional; default = multiples of L
//     series: {                     // optional partial sums S_N per mode
//       even: { a0: 2, a: (n) => ... },     // a0 as in a0/2 + Σ a_n cos(nπx/L)
//       odd:  { b: (n) => ... },
//     },
//     N: { max: 40, value: 5 },
//   });
//   </script>

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
.fx { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.fx canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; touch-action: pan-y; }
.fx-bar { display: flex; flex-wrap: wrap; gap: .4rem; justify-content: center; margin-bottom: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.fx-bar button { font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 999px; padding: .3rem .9rem; cursor: pointer; min-height: 32px; }
.fx-bar button[aria-pressed="true"] { background: var(--accent); color: var(--bg); border-color: var(--accent); }
.fx-read { font-family: Inter, system-ui, sans-serif; font-size: .85rem; margin-top: .5rem; text-align: center; }
.fx-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; }
.fx-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.fx-ctl { width: 100%; max-width: 320px; margin-top: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; display: flex; flex-direction: column; }
.fx-ctl input { width: 100%; accent-color: var(--accent); min-height: 28px; }`;
    document.head.appendChild(s);
  }

  const NOTE = {
    even: 'Even extension: mirror in the y-axis. Cosine series only (b<sub>n</sub> = 0).',
    odd: 'Odd extension: rotate 180° about the origin. Sine series only (a<sub>n</sub> = 0).',
    periodic: 'Plain periodic extension: copy the (−L, L] piece every 2L.',
  };

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('fx');
    el.innerHTML = '';
    const L = cfg.L, P = cfg.periods || 3;
    const modes = cfg.modes || ['even', 'odd'];
    const st = { mode: cfg.mode || modes[0], N: cfg.N ? cfg.N.value : 5 };

    const bar = document.createElement('div'); bar.className = 'fx-bar';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    const read = document.createElement('div'); read.className = 'fx-read';
    const key = document.createElement('div'); key.className = 'fx-key';
    const ctl = document.createElement('label'); ctl.className = 'fx-ctl';
    el.append(bar, canvas, read, key);

    const btns = {};
    if (modes.length > 1) modes.forEach((m) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = m[0].toUpperCase() + m.slice(1) + ' extension';
      b.addEventListener('click', () => { st.mode = m; draw(); });
      btns[m] = b; bar.appendChild(b);
    });

    if (cfg.series) {
      const span = document.createElement('span');
      const inp = document.createElement('input');
      inp.type = 'range'; inp.min = 0; inp.max = (cfg.N && cfg.N.max) || 40; inp.step = 1; inp.value = st.N;
      const set = () => { span.textContent = `Partial sum up to n = ${inp.value} (0 hides it)`; };
      set();
      inp.addEventListener('input', () => { st.N = +inp.value; set(); draw(); });
      ctl.append(span, inp); el.appendChild(ctl);
    }

    // Extension F(x)
    function F(x) {
      const t = x - 2 * L * Math.round(x / (2 * L)); // in [-L, L]
      if (st.mode === 'periodic') return cfg.f(t);
      if (t > 0) return cfg.f(t);
      if (t < 0) return st.mode === 'even' ? cfg.f(-t) : -cfg.f(-t);
      return st.mode === 'even' ? cfg.f(1e-9) : 0;
    }
    function S(x) {
      const c = cfg.series && cfg.series[st.mode];
      if (!c) return NaN;
      const k = Math.PI / L;
      let s = (c.a0 || 0) / 2;
      for (let n = 1; n <= st.N; n++) {
        if (c.a) s += c.a(n) * Math.cos(n * k * x);
        if (c.b) s += c.b(n) * Math.sin(n * k * x);
      }
      return s;
    }

    function draw() {
      Object.keys(btns).forEach((m) => btns[m].setAttribute('aria-pressed', m === st.mode ? 'true' : 'false'));
      const C = {
        fg: cssVar('--fg', '#1d1d1b'), muted: cssVar('--muted', '#6b6b66'), rule: cssVar('--rule', '#e4e2d6'),
        accent: cssVar('--accent', '#8a2b0e'), ok: cssVar('--ok', '#1f6f43'), card: cssVar('--card', '#f7f5ea'),
      };
      const showS = cfg.series && cfg.series[st.mode] && st.N > 0;
      key.innerHTML = `<i style="background:${C.accent}"></i>given f on (0, L)<i style="background:${C.fg}"></i>extension F(x)` +
        (showS ? `<i style="background:${C.ok}"></i>partial sum` : '');
      read.innerHTML = NOTE[st.mode];
      canvas.setAttribute('aria-label', `${st.mode} periodic extension over ${P} periods`);

      const W = Math.min(el.parentElement ? el.parentElement.clientWidth : 600, 640) || 600;
      const H = Math.round(W * 0.42);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      const x0 = -P * L, x1 = P * L, [y0, y1] = cfg.y;
      const padL = 30, padR = 10, padT = 10, padB = 22;
      const X = (t) => padL + (t - x0) / (x1 - x0) * (W - padL - padR);
      const Y = (v) => padT + (y1 - v) / (y1 - y0) * (H - padT - padB);

      // one-period band (-L, L]
      g.fillStyle = C.card;
      g.fillRect(X(-L), padT, X(L) - X(-L), H - padT - padB);

      // axes + ticks
      g.strokeStyle = C.muted; g.fillStyle = C.muted; g.lineWidth = 1;
      g.font = '11px Inter, system-ui, sans-serif';
      g.beginPath(); g.moveTo(padL, Y(0)); g.lineTo(W - padR, Y(0)); g.stroke();
      g.beginPath(); g.moveTo(X(0), padT); g.lineTo(X(0), H - padB); g.stroke();
      g.textAlign = 'center'; g.textBaseline = 'top';
      const ticks = cfg.xTicks || (() => { const a = []; for (let k = -P; k <= P; k++) if (k) a.push({ v: k * L, label: fmt(k * L) }); return a; })();
      ticks.forEach(({ v, label }) => {
        g.fillText(label, X(v), H - padB + 4);
        g.beginPath(); g.moveTo(X(v), Y(0) - 3); g.lineTo(X(v), Y(0) + 3); g.stroke();
      });
      g.textAlign = 'right'; g.textBaseline = 'middle';
      (cfg.yTicks || [y1 * 0.8, y0 * 0.8].map((v) => +v.toPrecision(2))).forEach((v) => {
        if (v < y0 || v > y1 || Math.abs(v) < 1e-9) return;
        g.fillText(fmt(v), padL - 4, Y(v));
        g.beginPath(); g.moveTo(X(0) - 3, Y(v)); g.lineTo(X(0) + 3, Y(v)); g.stroke();
      });

      g.save();
      g.beginPath(); g.rect(padL, padT, W - padL - padR, H - padT - padB); g.clip();
      const M = Math.max(600, 2 * W);
      function curve(fn, colour, width, a, b, breaks) {
        g.strokeStyle = colour; g.lineWidth = width; g.beginPath();
        let pen = false, prev = null;
        for (let i = 0; i <= M; i++) {
          const t = a + (b - a) * i / M, v = fn(t);
          if (!isFinite(v)) { pen = false; prev = null; continue; }
          const jump = breaks && prev !== null && Math.abs(v - prev) > (y1 - y0) * 0.06;
          if (!pen || jump) { g.moveTo(X(t), Y(v)); pen = true; } else g.lineTo(X(t), Y(v));
          prev = v;
        }
        g.stroke();
      }
      curve(F, C.fg, 1.8, x0, x1, true);
      curve(F, C.accent, 3.2, 1e-6, L - 1e-6, true);
      if (showS) curve(S, C.ok, 1.6, x0, x1, false);
      g.restore();
    }

    draw();
    window.addEventListener('resize', draw);
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', draw);
    return { redraw: draw, setMode: (m) => { st.mode = m; draw(); } };
  }

  window.FourierExt = { mount };
})();
