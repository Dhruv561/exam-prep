// Fourier-transform pair viewer: f(x) on the left, f̂(k) on the right, one parameter slider `a`.
// Course convention: f̂(k) = ∫ f(x) e^{-ikx} dx. Complex f̂ is drawn as Re (solid), Im (dashed), |f̂| (faint).
// Axes stay fixed while `a` moves (by default), so the width trade-off is visible:
// narrow in x ⇔ wide in k.
//
// Usage (after this script has loaded):
//   <div id="ft1"></div>
//   <script>
//   FTPair.mount(document.getElementById('ft1'), {
//     families: ['box', 'exp', 'gauss', 'onesided'],  // buttons shown; built-in keys or custom objects (below)
//     start: 'box',            // initially selected family (key or index)
//     a: 1, aMin: 0.25, aMax: 4, // slider for the parameter a
//     xRange: [-5, 5], kRange: [-15, 15],
//     fixedScale: true,        // y-axes fixed over the whole a-range (default true)
//   });
//   </script>
//
// Built-in families (FTPair.families):
//   box      f = H_{-a} − H_a (1 on |x| < a)   f̂ = 2 sin(ak)/k = 2a sinc(ak)   (midpoint dots ½ at x = ±a)
//   exp      f = e^{-a|x|}                      f̂ = 2a/(a² + k²)
//   gauss    f = e^{-a x²}                      f̂ = √(π/a) e^{-k²/(4a)}
//   onesided f = e^{-ax} H(x)                   f̂ = 1/(a + ik)  (complex)   (midpoint dot ½ at x = 0)
//
// Custom family object:
//   { label: 'button text',
//     f: (x, a) => number,
//     F: (k, a) => number | [re, im],
//     fText: (a) => 'f(x) = …', FText: (a) => 'f̂(k) = …',   // plain-text captions
//     jumps: (a) => [{ x, y }],     // optional: draw the inverse-FT midpoint value at each jump
//     note: (a) => 'readout text' } // optional line under the plots

(function () {
  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const f2 = (v) => (Math.abs(v) < 1e-9 ? '0' : v.toFixed(2)).replace('-', '−');

  const families = {
    box: {
      label: 'box',
      f: (x, a) => (Math.abs(x) < a ? 1 : 0),
      F: (k, a) => (Math.abs(k) < 1e-9 ? 2 * a : 2 * Math.sin(a * k) / k),
      fText: (a) => `f(x) = 1 for |x| < ${f2(a)}, else 0`,
      FText: (a) => `f̂(k) = 2 sin(${f2(a)}k)/k`,
      jumps: (a) => [{ x: -a, y: 0.5 }, { x: a, y: 0.5 }],
      note: (a) => `f̂(0) = ∫f = 2a = ${f2(2 * a)}   ·   first zeros of f̂ at k = ±π/a = ±${f2(Math.PI / a)}`,
    },
    exp: {
      label: 'e^(−a|x|)',
      f: (x, a) => Math.exp(-a * Math.abs(x)),
      F: (k, a) => 2 * a / (a * a + k * k),
      fText: (a) => `f(x) = e^(−${f2(a)}|x|)`,
      FText: (a) => `f̂(k) = 2a/(a² + k²), a = ${f2(a)}`,
      note: (a) => `f̂(0) = ∫f = 2/a = ${f2(2 / a)}   ·   f̂ falls to half its peak at k = ±a = ±${f2(a)}`,
    },
    gauss: {
      label: 'Gaussian',
      f: (x, a) => Math.exp(-a * x * x),
      F: (k, a) => Math.sqrt(Math.PI / a) * Math.exp(-k * k / (4 * a)),
      fText: (a) => `f(x) = e^(−${f2(a)}x²)`,
      FText: (a) => `f̂(k) = √(π/a) e^(−k²/4a), a = ${f2(a)}`,
      note: (a) => `f̂(0) = ∫f = √(π/a) = ${f2(Math.sqrt(Math.PI / a))}   ·   x-width ∝ 1/√a, k-width ∝ √a`,
    },
    onesided: {
      label: 'e^(−ax)H(x)',
      f: (x, a) => (x > 0 ? Math.exp(-a * x) : 0),
      F: (k, a) => { const d = a * a + k * k; return [a / d, -k / d]; },
      fText: (a) => `f(x) = e^(−${f2(a)}x) for x > 0, 0 for x < 0`,
      FText: (a) => `f̂(k) = 1/(a + ik), a = ${f2(a)}`,
      jumps: () => [{ x: 0, y: 0.5 }],
      note: (a) => `f̂(0) = ∫f = 1/a = ${f2(1 / a)}   ·   complex: Re even, Im odd (f is neither even nor odd)`,
    },
  };

  let styled = false;
  function injectStyle() {
    if (styled) return; styled = true;
    const s = document.createElement('style');
    s.textContent = `
.ftp { margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.ftp-row { display: flex; gap: .8rem; justify-content: center; }
.ftp-pane { flex: 1 1 0; min-width: 0; text-align: center; }
.ftp canvas { border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); max-width: 100%; }
.ftp-cap { color: var(--muted); margin-top: .2rem; }
.ftp-cap, .ftp-note, .ftp-key { font-family: 'Times New Roman', 'STIX Two Text', serif; font-size: .95rem; }
.ftp-ctl { display: flex; flex-wrap: wrap; gap: .4rem .8rem; align-items: center; justify-content: center; margin-top: .6rem; }
.ftp-ctl button { font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 999px; padding: .25rem .8rem; cursor: pointer; min-height: 30px; }
.ftp-ctl button.on { border-color: var(--accent); color: var(--accent); font-weight: 600; }
.ftp-ctl label { display: flex; align-items: center; gap: .5rem; }
.ftp-ctl input { width: 180px; accent-color: var(--accent); }
.ftp-note { text-align: center; color: var(--muted); margin-top: .35rem; }
.ftp-key { text-align: center; color: var(--muted); margin-top: .2rem; font-size: .76rem; }`;
    document.head.appendChild(s);
  }

  function mount(el, cfg) {
    cfg = cfg || {};
    injectStyle();
    el.classList.add('ftp');
    const keys = cfg.families || ['box', 'exp', 'gauss', 'onesided'];
    const fams = keys.map((f) => (typeof f === 'string' ? families[f] : f));
    let cur = typeof cfg.start === 'number' ? cfg.start : Math.max(0, keys.indexOf(cfg.start || ''));
    const aMin = cfg.aMin ?? 0.25, aMax = cfg.aMax ?? 4;
    let a = cfg.a ?? 1;
    const xr = cfg.xRange || [-5, 5], kr = cfg.kRange || [-15, 15];
    const fixed = cfg.fixedScale !== false;

    const row = document.createElement('div'); row.className = 'ftp-row';
    const paneL = document.createElement('div'); paneL.className = 'ftp-pane';
    const paneR = document.createElement('div'); paneR.className = 'ftp-pane';
    const cL = document.createElement('canvas'), cR = document.createElement('canvas');
    const capL = document.createElement('div'), capR = document.createElement('div');
    capL.className = capR.className = 'ftp-cap';
    paneL.append(cL, capL); paneR.append(cR, capR); row.append(paneL, paneR); el.appendChild(row);
    const key = document.createElement('div'); key.className = 'ftp-key'; el.appendChild(key);

    const ctl = document.createElement('div'); ctl.className = 'ftp-ctl';
    const btns = fams.map((fm, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = fm.label;
      b.addEventListener('click', () => { cur = i; draw(); }); ctl.appendChild(b); return b;
    });
    const lab = document.createElement('label');
    const slider = document.createElement('input');
    slider.type = 'range'; slider.min = 0; slider.max = 1000; slider.setAttribute('aria-label', 'parameter a');
    const aRead = document.createElement('span');
    // log scale slider
    const toS = (v) => Math.round(1000 * Math.log(v / aMin) / Math.log(aMax / aMin));
    const fromS = (s) => aMin * Math.pow(aMax / aMin, s / 1000);
    slider.value = toS(a);
    lab.append('a', slider, aRead); ctl.appendChild(lab); el.appendChild(ctl);
    const note = document.createElement('div'); note.className = 'ftp-note'; el.appendChild(note);
    slider.addEventListener('input', () => { a = fromS(+slider.value); draw(); });

    const full = Math.min(760, el.clientWidth || 700);
    const W = Math.floor((full - 14) / 2), H = Math.round(W * 0.68);
    const dpr = window.devicePixelRatio || 1;
    const ctxs = [cL, cR].map((c) => {
      c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
      const ctx = c.getContext('2d'); ctx.scale(dpr, dpr); return ctx;
    });
    const pad = { l: 30, r: 8, t: 10, b: 22 };

    const val = (v) => (Array.isArray(v) ? v : [v, 0]);
    function range(fm, fn, r, isF) {
      const as = fixed ? [aMin, Math.sqrt(aMin * aMax), aMax, (aMin + aMax) / 2] : [a];
      let lo = 0, hi = 0;
      as.forEach((aa) => {
        for (let i = 0; i <= 300; i++) {
          const t = r[0] + (r[1] - r[0]) * i / 300;
          const [re, im] = val(fn(t, aa));
          const m = Math.hypot(re, im);
          lo = Math.min(lo, re, im); hi = Math.max(hi, re, im, isF ? m : re);
        }
      });
      const span = hi - lo || 1;
      return [lo - 0.08 * span, hi + 0.08 * span];
    }

    function plot(ctx, fn, r, yr, label, jumps) {
      const fg = cssVar('--fg', '#111'), muted = cssVar('--muted', '#777'), rule = cssVar('--rule', '#ddd');
      const acc = cssVar('--accent', '#8a2b0e'), ok = cssVar('--ok', '#1f6f43');
      const X = (x) => pad.l + (x - r[0]) / (r[1] - r[0]) * (W - pad.l - pad.r);
      const Y = (v) => pad.t + (yr[1] - v) / (yr[1] - yr[0]) * (H - pad.t - pad.b);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = rule; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, Y(0)); ctx.lineTo(W - pad.r, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), pad.t); ctx.lineTo(X(0), H - pad.b); ctx.stroke();
      ctx.fillStyle = muted; ctx.font = '11px Inter, system-ui, sans-serif'; ctx.textAlign = 'center';
      const step = niceStep((r[1] - r[0]) / 6);
      for (let t = Math.ceil(r[0] / step) * step; t <= r[1] + 1e-9; t += step) {
        if (Math.abs(t) < 1e-9) continue;
        ctx.fillText(String(+t.toFixed(2)).replace('-', '−'), X(t), H - 7);
      }
      ctx.fillText(label, W - pad.r - 6, Y(0) - 6);
      ctx.textAlign = 'right';
      const ys = niceStep((yr[1] - yr[0]) / 4);
      for (let v = Math.ceil(yr[0] / ys) * ys; v <= yr[1]; v += ys) {
        if (Math.abs(v) < 1e-9) continue;
        ctx.fillText(String(+v.toFixed(2)).replace('-', '−'), pad.l - 4, Y(v) + 4);
      }
      const N = 800, pts = [];
      for (let i = 0; i <= N; i++) { const t = r[0] + (r[1] - r[0]) * i / N; pts.push([t, val(fn(t, a))]); }
      const cplx = pts.some((p) => Math.abs(p[1][1]) > 1e-12);
      const line = (get, color, w, dash) => {
        ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []);
        pts.forEach((p, i) => { const yv = Math.max(yr[0] - 1, Math.min(yr[1] + 1, get(p[1]))); i ? ctx.lineTo(X(p[0]), Y(yv)) : ctx.moveTo(X(p[0]), Y(yv)); });
        ctx.stroke(); ctx.setLineDash([]);
      };
      if (cplx) line((v) => Math.hypot(v[0], v[1]), rule, 2.5);
      line((v) => v[0], acc, 2.2);
      if (cplx) line((v) => v[1], ok, 2, [6, 4]);
      (jumps || []).forEach((j) => {
        ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(X(j.x), Y(j.y), 3.5, 0, 2 * Math.PI); ctx.fill();
      });
      return cplx;
    }
    function niceStep(raw) {
      const p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
      return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
    }

    function draw() {
      const fm = fams[cur];
      btns.forEach((b, i) => b.classList.toggle('on', i === cur));
      aRead.textContent = '= ' + f2(a);
      plot(ctxs[0], fm.f, xr, range(fm, fm.f, xr, false), 'x', fm.jumps ? fm.jumps(a) : []);
      const cplx = plot(ctxs[1], fm.F, kr, range(fm, fm.F, kr, true), 'k');
      capL.textContent = fm.fText ? fm.fText(a) : '';
      capR.textContent = fm.FText ? fm.FText(a) : '';
      key.textContent = (fm.jumps ? '● = value F⁻¹F f returns at a jump (midpoint)   ' : '') +
        (cplx ? 'right: solid = Re f̂, dashed = Im f̂, faint = |f̂|' : '');
      note.textContent = fm.note ? fm.note(a) : '';
    }
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addEventListener) mq.addEventListener('change', draw);
    }
    draw();
    return { redraw: draw };
  }

  window.FTPair = { mount, families };
})();
