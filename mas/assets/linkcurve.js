// Link-function explorer: plots p = g^{-1}(β0 + β1·x) with sliders for β0, β1 and a link selector.
// Reuses the .phase / .phase-controls / .phase-info styles from style.css.
//
//   <div class="linkcurve" data-b0="-2" data-b1="0.08" data-xmin="0" data-xmax="60"
//        data-b0range="-6,6" data-b1range="-0.3,0.3" data-xlabel="hours"
//        data-points='[[10,9,40],[20,16,40]]'></div>
//
// data-points (optional) is a list of [x, y, m]; each is drawn at y/m.
// Shows where p = 1/2 and the slope dp/dx there (β1/4 for the logit).

(function () {
  function erf(x) { // Abramowitz–Stegun 7.1.26, |error| < 1.5e-7
    const s = Math.sign(x); x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  }
  const LINKS = {
    logit:   { inv: (e) => 1 / (1 + Math.exp(-e)), mid: 0, dmid: 1 / 4, name: 'logit' },
    probit:  { inv: (e) => 0.5 * (1 + erf(e / Math.SQRT2)), mid: 0, dmid: 1 / Math.sqrt(2 * Math.PI), name: 'probit' },
    cloglog: { inv: (e) => 1 - Math.exp(-Math.exp(e)), mid: Math.log(Math.log(2)), dmid: Math.log(2) / 2, name: 'cloglog' },
  };

  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'; }

  function setup(el) {
    const d = el.dataset;
    const xmin = +(d.xmin ?? -5), xmax = +(d.xmax ?? 5);
    const [b0lo, b0hi] = (d.b0range || '-6,6').split(',').map(Number);
    const [b1lo, b1hi] = (d.b1range || '-2,2').split(',').map(Number);
    const pts = d.points ? JSON.parse(d.points) : [];
    const state = { b0: +(d.b0 ?? 0), b1: +(d.b1 ?? 1), link: d.link || 'logit' };

    el.classList.add('phase');
    const W = 440, H = 260, pad = { l: 38, r: 10, t: 10, b: 30 };
    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr; canvas.height = H * dpr; canvas.style.width = W + 'px'; canvas.style.aspectRatio = `${W} / ${H}`;
    canvas.style.cursor = 'default';
    const info = document.createElement('div'); info.className = 'phase-info';
    const controls = document.createElement('div'); controls.className = 'phase-controls';
    el.append(canvas, info, controls);

    function slider(label, key, lo, hi) {
      const lab = document.createElement('label');
      const span = document.createElement('span');
      const inp = document.createElement('input');
      inp.type = 'range'; inp.min = lo; inp.max = hi; inp.step = (hi - lo) / 400; inp.value = state[key];
      inp.setAttribute('aria-label', label);
      const show = () => { span.textContent = `${label} = ${(+state[key]).toFixed(Math.abs(hi) < 1 ? 3 : 2)}`; };
      inp.addEventListener('input', () => { state[key] = +inp.value; show(); draw(); });
      show(); lab.append(span, inp); controls.append(lab);
    }
    slider('β₀', 'b0', b0lo, b0hi);
    slider('β₁', 'b1', b1lo, b1hi);
    const lab = document.createElement('label');
    const sel = document.createElement('select');
    sel.setAttribute('aria-label', 'Link');
    Object.keys(LINKS).forEach((k) => { const o = document.createElement('option'); o.value = k; o.textContent = k; sel.append(o); });
    sel.value = state.link;
    sel.style.cssText = 'font: inherit; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 4px; padding: .2rem';
    sel.addEventListener('change', () => { state.link = sel.value; draw(); });
    const ls = document.createElement('span'); ls.textContent = 'link';
    lab.append(ls, sel); controls.append(lab);

    const X = (x) => pad.l + (x - xmin) / (xmax - xmin) * (W - pad.l - pad.r);
    const Y = (p) => pad.t + (1 - p) * (H - pad.t - pad.b);

    function draw() {
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const fg = css('--fg'), muted = css('--muted'), rule = css('--rule'), accent = css('--accent');
      g.font = '11px Inter, system-ui, sans-serif'; g.fillStyle = muted; g.strokeStyle = rule; g.lineWidth = 1;
      [0, 0.5, 1].forEach((p) => {
        g.beginPath(); g.moveTo(X(xmin), Y(p)); g.lineTo(X(xmax), Y(p)); g.stroke();
        g.fillText(p.toString(), 8, Y(p) + 4);
      });
      for (let i = 0; i <= 4; i++) {
        const x = xmin + i * (xmax - xmin) / 4;
        g.fillText((+x.toFixed(2)).toString(), X(x) - 8, H - 10);
      }
      if (d.xlabel) g.fillText(d.xlabel, W - pad.r - g.measureText(d.xlabel).width, Y(0) - 6);

      const L = LINKS[state.link];
      g.strokeStyle = accent; g.lineWidth = 2; g.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = xmin + i * (xmax - xmin) / 200;
        const p = L.inv(state.b0 + state.b1 * x);
        i ? g.lineTo(X(x), Y(p)) : g.moveTo(X(x), Y(p));
      }
      g.stroke();

      g.fillStyle = fg;
      pts.forEach(([x, y, m]) => { g.beginPath(); g.arc(X(x), Y(y / m), 3.5, 0, 2 * Math.PI); g.fill(); });

      if (state.b1 !== 0) {
        const xm = (L.mid - state.b0) / state.b1;
        const slope = state.b1 * L.dmid;
        info.innerHTML = `${L.name}: p = ½ at x = ${xm.toFixed(2)} &nbsp;·&nbsp; slope there dp/dx = ${slope.toFixed(4)}`
          + `<br><span class="phase-key">dots = observed proportions y/m</span>`;
        if (xm >= xmin && xm <= xmax) {
          g.setLineDash([4, 4]); g.strokeStyle = muted; g.lineWidth = 1;
          g.beginPath(); g.moveTo(X(xm), Y(0)); g.lineTo(X(xm), Y(0.5)); g.stroke(); g.setLineDash([]);
        }
      } else {
        info.textContent = `${L.name}: β₁ = 0, so p is flat at ${L.inv(state.b0).toFixed(3)}`;
      }
    }
    draw();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.linkcurve').forEach(setup));
})();
