// Temperature profiles u(x, t) of a 1D heat problem on [0, L]: the exam's
// "sketch at t = 0, t1, t2 and t → ∞" figure, plus a time slider.
//
// Usage (after this script has loaded):
//   <div id="p1"></div>
//   <script>
//   PDEProfiles.mount(document.getElementById('p1'), {
//     u: (x, t) => 1 + 2*x/Math.PI + 4*Math.exp(-8*t)*Math.sin(2*x), // full solution (truncate series yourself)
//     uS: (x) => 1 + 2*x/Math.PI,     // steady state (dashed); omit if none
//     L: Math.PI,                     // domain [0, L]
//     snaps: [0.02, 0.08],            // the two sketch times t1 < t2 (drawn thin)
//     tMax: 0.5,                      // slider range [0, tMax]
//     y: [-1, 5],                     // plot window
//     xTicks: [{ v: Math.PI/2, label: 'π/2' }, { v: Math.PI, label: 'π' }],   // optional
//     yTicks: [1, 2, 3],              // optional
//     probe: { x: Math.PI/2, label: 'midpoint' },  // optional readout u(probe.x, t)
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
.pp { margin: 1.4rem 0; display: flex; flex-direction: column; align-items: center; }
.pp canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; touch-action: pan-y; }
.pp-read { font-family: Inter, system-ui, sans-serif; font-size: .85rem; margin-top: .5rem; text-align: center; }
.pp-key { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-align: center; }
.pp-key i { font-style: normal; display: inline-block; width: 1.2em; height: 3px; vertical-align: middle; margin: 0 .3em 0 .8em; border-radius: 2px; }
.pp-key i.d { background: none !important; border-top: 2px dashed; height: 0; }
.pp-ctl { width: 100%; max-width: 320px; margin-top: .5rem; font-family: Inter, system-ui, sans-serif; font-size: .82rem; display: flex; flex-direction: column; }
.pp-ctl input { width: 100%; accent-color: var(--accent); min-height: 28px; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    injectStyle();
    el.classList.add('pp');
    el.innerHTML = '';
    const L = cfg.L, snaps = cfg.snaps || [], tMax = cfg.tMax || 1;
    const st = { t: snaps[0] !== undefined ? snaps[0] : tMax / 10 };

    const canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Temperature profiles u(x,t) at several times');
    const key = document.createElement('div'); key.className = 'pp-key';
    const read = document.createElement('div'); read.className = 'pp-read';
    const ctl = document.createElement('label'); ctl.className = 'pp-ctl';
    const span = document.createElement('span');
    const inp = document.createElement('input');
    inp.type = 'range'; inp.min = 0; inp.max = 1000; inp.step = 1;
    // quadratic slider: fine control near t = 0, where the action is
    inp.value = Math.round(1000 * Math.sqrt(st.t / tMax));
    ctl.append(span, inp);
    el.append(canvas, key, read, ctl);
    inp.addEventListener('input', () => { const s = +inp.value / 1000; st.t = tMax * s * s; draw(); });

    function draw() {
      const C = {
        fg: cssVar('--fg', '#1d1d1b'), muted: cssVar('--muted', '#6b6b66'), rule: cssVar('--rule', '#e4e2d6'),
        accent: cssVar('--accent', '#8a2b0e'), ok: cssVar('--ok', '#1f6f43'), trap: cssVar('--trap', '#8a5a00'),
      };
      span.textContent = `Bold curve: t = ${fmt(st.t)} (drag)`;
      key.innerHTML = `<i style="background:${C.accent}"></i>t = 0` +
        snaps.map((s, i) => `<i style="background:${C.muted}"></i>t${i + 1} = ${fmt(s)}`).join('') +
        (cfg.uS ? `<i class="d" style="border-color:${C.ok}"></i>t → ∞ (u<sub>S</sub>)` : '') +
        `<i style="background:${C.fg}"></i>slider`;
      if (cfg.probe) {
        const v = cfg.u(cfg.probe.x, st.t);
        const lim = cfg.uS ? ` → ${fmt(cfg.uS(cfg.probe.x))} as t → ∞` : '';
        read.innerHTML = `u at ${cfg.probe.label}: ${fmt(v)}${lim}`;
      }

      const W = Math.min(el.parentElement ? el.parentElement.clientWidth : 600, 560) || 560;
      const H = Math.round(W * 0.55);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      const [y0, y1] = cfg.y;
      const padL = 30, padR = 12, padT = 10, padB = 22;
      const X = (s) => padL + s / L * (W - padL - padR);
      const Y = (v) => padT + (y1 - v) / (y1 - y0) * (H - padT - padB);
      const yAx = Math.min(Math.max(0, y0), y1);

      g.strokeStyle = C.muted; g.fillStyle = C.muted; g.lineWidth = 1;
      g.font = '11px Inter, system-ui, sans-serif';
      g.beginPath(); g.moveTo(X(0), Y(yAx)); g.lineTo(X(L), Y(yAx)); g.stroke();
      g.beginPath(); g.moveTo(X(0), padT); g.lineTo(X(0), H - padB); g.stroke();
      g.textAlign = 'center'; g.textBaseline = 'top';
      (cfg.xTicks || [{ v: L / 2, label: fmt(L / 2) }, { v: L, label: fmt(L) }]).forEach(({ v, label }) => {
        g.fillText(label, X(v), Y(yAx) + 4);
        g.beginPath(); g.moveTo(X(v), Y(yAx) - 3); g.lineTo(X(v), Y(yAx) + 3); g.stroke();
      });
      g.textAlign = 'right'; g.textBaseline = 'middle';
      (cfg.yTicks || []).forEach((v) => {
        if (v < y0 || v > y1) return;
        g.fillText(fmt(v), padL - 4, Y(v));
        g.beginPath(); g.moveTo(X(0) - 3, Y(v)); g.lineTo(X(0) + 3, Y(v)); g.stroke();
      });
      if (cfg.probe) {
        g.save(); g.setLineDash([2, 3]); g.strokeStyle = C.rule;
        g.beginPath(); g.moveTo(X(cfg.probe.x), padT); g.lineTo(X(cfg.probe.x), H - padB); g.stroke(); g.restore();
      }

      g.save();
      g.beginPath(); g.rect(padL, padT, W - padL - padR, H - padT - padB); g.clip();
      const M = Math.max(300, W);
      function curve(fn, colour, width, dash) {
        g.strokeStyle = colour; g.lineWidth = width; g.setLineDash(dash || []); g.beginPath();
        for (let i = 0; i <= M; i++) {
          const s = L * (1e-4 + (1 - 2e-4) * i / M), v = fn(s);
          if (i === 0) g.moveTo(X(s), Y(v)); else g.lineTo(X(s), Y(v));
        }
        g.stroke(); g.setLineDash([]);
      }
      if (cfg.uS) curve(cfg.uS, C.ok, 2, [7, 5]);
      snaps.forEach((s) => curve((x) => cfg.u(x, s), C.muted, 1.4));
      curve((x) => cfg.u(x, 0), C.accent, 2.4);
      curve((x) => cfg.u(x, st.t), C.fg, 2.2);
      if (cfg.probe) {
        g.fillStyle = C.fg; g.beginPath();
        g.arc(X(cfg.probe.x), Y(cfg.u(cfg.probe.x, st.t)), 3.5, 0, 2 * Math.PI); g.fill();
      }
      g.restore();
    }

    draw();
    window.addEventListener('resize', draw);
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', draw);
    return { redraw: draw };
  }

  window.PDEProfiles = { mount };
})();
