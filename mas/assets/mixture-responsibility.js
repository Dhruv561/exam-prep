// Two-component mixture explorer: weighted component densities on top, responsibility γ₁(x) below.
// Reuses the .phase / .phase-controls / .phase-info styles from style.css.
//
//   <div class="mixresp" data-mode="normal" data-pi1="0.6" data-mu1="20" data-s1="4" data-mu2="32" data-s2="5" data-x="27"></div>
//     Normal components N(μ_k, σ_k²) (sliders take the SD σ_k).
//   <div class="mixresp" data-mode="poisson" data-pi1="0.8" data-l1="0.4" data-l2="2.5" data-x="2"></div>
//     Poisson components; bars at integer x.
//
// Readout: π₁f₁(x), π₂f₂(x), γ₁ = π₁f₁/(π₁f₁+π₂f₂), and the cluster chosen by the γ₁ > 0.5 rule.

(function () {
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'; }
  const dnorm = (x, m, s) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
  const lfact = (k) => { let s = 0; for (let i = 2; i <= k; i++) s += Math.log(i); return s; };
  const dpois = (k, l) => Math.exp(k * Math.log(l) - l - lfact(k));

  const MODES = {
    normal: {
      params: [['pi1', 'π₁', 0.05, 0.95], ['mu1', 'μ₁', 0, 50], ['s1', 'σ₁ (sd)', 0.5, 12], ['mu2', 'μ₂', 0, 50], ['s2', 'σ₂ (sd)', 0.5, 12], ['x', 'x', 0, 50]],
      f1: (x, s) => dnorm(x, s.mu1, s.s1), f2: (x, s) => dnorm(x, s.mu2, s.s2),
      range: (s) => [Math.min(s.mu1 - 3.5 * s.s1, s.mu2 - 3.5 * s.s2, s.x), Math.max(s.mu1 + 3.5 * s.s1, s.mu2 + 3.5 * s.s2, s.x)],
      discrete: false,
    },
    poisson: {
      params: [['pi1', 'π₁', 0.05, 0.95], ['l1', 'λ₁', 0.1, 15], ['l2', 'λ₂', 0.1, 15], ['x', 'x', 0, 25, 1]],
      f1: (x, s) => dpois(x, s.l1), f2: (x, s) => dpois(x, s.l2),
      range: (s) => [0, Math.max(6, Math.ceil(Math.max(s.l1, s.l2) + 4 * Math.sqrt(Math.max(s.l1, s.l2))), s.x)],
      discrete: true,
    },
  };

  function setup(el) {
    const d = el.dataset, mode = MODES[d.mode || 'normal'];
    const state = {};
    mode.params.forEach(([k, , lo]) => { state[k] = d[k] !== undefined ? +d[k] : lo; });

    el.classList.add('phase');
    const W = 440, H = 300, pad = { l: 30, r: 10, t: 10, b: 24 }, split = 190;
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.aspectRatio = `${W} / ${H}`;
    canvas.style.cursor = 'default';
    const info = document.createElement('div'); info.className = 'phase-info';
    const controls = document.createElement('div'); controls.className = 'phase-controls';
    el.append(canvas, info, controls);

    mode.params.forEach(([key, label, lo, hi, step]) => {
      const lab = document.createElement('label');
      const span = document.createElement('span');
      const inp = document.createElement('input');
      inp.type = 'range'; inp.min = lo; inp.max = hi; inp.step = step || (hi - lo) / 200; inp.value = state[key];
      inp.setAttribute('aria-label', label);
      const show = () => { span.textContent = `${label} = ${step ? state[key] : (+state[key]).toFixed(2)}`; };
      inp.addEventListener('input', () => { state[key] = +inp.value; show(); draw(); });
      show(); lab.append(span, inp); controls.append(lab);
    });

    function draw() {
      const s = state, pi2 = 1 - s.pi1;
      const [lo, hi] = mode.range(s);
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const fg = css('--fg'), muted = css('--muted'), rule = css('--rule'), accent = css('--accent'), ok = css('--ok');
      const X = (x) => pad.l + (x - lo) / (hi - lo) * (W - pad.l - pad.r);
      const a = (x) => s.pi1 * mode.f1(x, s), b = (x) => pi2 * mode.f2(x, s);
      const gam = (x) => { const u = a(x), v = b(x); return u + v > 0 ? u / (u + v) : NaN; };
      const xs = mode.discrete ? Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
        : Array.from({ length: 301 }, (_, i) => lo + i * (hi - lo) / 300);
      const ymax = Math.max(...xs.map((x) => a(x) + b(x))) * 1.1 || 1;
      const Y = (y) => pad.t + (1 - y / ymax) * (split - pad.t - 14);
      const G0 = split + 6, G1 = H - pad.b;
      const YG = (p) => G1 - p * (G1 - G0);

      g.font = '11px Inter, system-ui, sans-serif';
      g.strokeStyle = rule; g.lineWidth = 1;
      g.beginPath(); g.moveTo(pad.l, Y(0)); g.lineTo(W - pad.r, Y(0)); g.stroke();
      g.beginPath(); g.moveTo(pad.l, YG(0)); g.lineTo(W - pad.r, YG(0)); g.moveTo(pad.l, YG(1)); g.lineTo(W - pad.r, YG(1)); g.stroke();
      g.setLineDash([3, 3]); g.beginPath(); g.moveTo(pad.l, YG(0.5)); g.lineTo(W - pad.r, YG(0.5)); g.stroke(); g.setLineDash([]);
      g.fillStyle = muted;
      g.fillText('1', 14, YG(1) + 4); g.fillText('0.5', 6, YG(0.5) + 4); g.fillText('0', 14, YG(0) + 4);
      g.fillText('γ₁(x)', W - pad.r - 40, YG(0.5) - 6);
      for (let i = 0; i <= 4; i++) { const x = lo + i * (hi - lo) / 4; g.fillText((+x.toFixed(1)).toString(), X(x) - 8, H - 6); }

      if (mode.discrete) {
        const w = Math.max(2, (W - pad.l - pad.r) / (hi - lo + 1) * 0.36);
        xs.forEach((x) => {
          g.fillStyle = accent; g.fillRect(X(x) - w, Y(a(x)), w, Y(0) - Y(a(x)));
          g.fillStyle = ok; g.fillRect(X(x), Y(b(x)), w, Y(0) - Y(b(x)));
        });
      } else {
        [[a, accent, []], [b, ok, []], [(x) => a(x) + b(x), muted, [5, 4]]].forEach(([f, col, dash]) => {
          g.strokeStyle = col; g.lineWidth = dash.length ? 1.3 : 2; g.setLineDash(dash); g.beginPath();
          xs.forEach((x, i) => (i ? g.lineTo(X(x), Y(f(x))) : g.moveTo(X(x), Y(f(x)))));
          g.stroke(); g.setLineDash([]);
        });
      }
      g.fillStyle = accent; g.fillText('π₁f₁', W - pad.r - 90, pad.t + 12);
      g.fillStyle = ok; g.fillText('π₂f₂', W - pad.r - 50, pad.t + 12);
      if (!mode.discrete) { g.fillStyle = muted; g.fillText('mixture', W - pad.r - 90, pad.t + 26); }

      g.strokeStyle = fg; g.lineWidth = 1.8;
      if (mode.discrete) {
        xs.forEach((x) => { const p = gam(x); if (!isNaN(p)) { g.beginPath(); g.arc(X(x), YG(p), 2.5, 0, 2 * Math.PI); g.fillStyle = fg; g.fill(); } });
      } else {
        g.beginPath(); let started = false;
        xs.forEach((x) => { const p = gam(x); if (isNaN(p)) return; started ? g.lineTo(X(x), YG(p)) : g.moveTo(X(x), YG(p)); started = true; });
        g.stroke();
      }

      const xv = s.x, p = gam(xv);
      g.strokeStyle = fg; g.lineWidth = 1; g.setLineDash([2, 3]);
      g.beginPath(); g.moveTo(X(xv), pad.t); g.lineTo(X(xv), G1); g.stroke(); g.setLineDash([]);
      if (!isNaN(p)) { g.beginPath(); g.arc(X(xv), YG(p), 4.5, 0, 2 * Math.PI); g.fillStyle = accent; g.fill(); }

      const A = a(xv), B = b(xv);
      const fmt = (v) => (v === 0 ? '0' : v < 1e-4 ? v.toExponential(2) : v.toFixed(4));
      info.innerHTML = `x = ${mode.discrete ? xv : xv.toFixed(2)}: &nbsp;π₁f₁ = ${fmt(A)}, &nbsp;π₂f₂ = ${fmt(B)} &nbsp;·&nbsp; γ₁ = <b>${isNaN(p) ? '–' : p.toFixed(2)}</b>`
        + `<br><span class="phase-key">rule γ₁ &gt; 0.5 ⇒ assign to component <b>${p > 0.5 ? 1 : 2}</b> · mixing weight alone would say ${s.pi1 >= 0.5 ? 1 : 2}</span>`;
    }
    draw();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.mixresp').forEach(setup));
})();
