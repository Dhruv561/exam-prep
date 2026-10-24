// Prior × likelihood → posterior plotter for two conjugate pairs.
// Reuses the .phase / .phase-controls / .phase-info styles from style.css.
//
//   <div class="conjplot" data-mode="normal" data-m0="50" data-s0="2" data-sigma="3" data-n="5" data-xbar="53.2"></div>
//     Normal mean, known variance: prior N(m0, s0²), data N(μ, σ²), posterior N(B/A, 1/A).
//   <div class="conjplot" data-mode="poisson" data-a="2" data-b="1" data-n="4" data-sum="20"></div>
//     Poisson rate: prior Gamma(a, rate b), posterior Gamma(a + Σy, b + n).
//
// The likelihood curve is rescaled to integrate to 1 so the three shapes are comparable.

(function () {
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'; }
  function lgamma(z) { // Lanczos, g = 7
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
      12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
    z -= 1; let x = c[0];
    for (let i = 1; i < 9; i++) x += c[i] / (z + i);
    const t = z + 7.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  const dnorm = (x, m, v) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
  const dgamma = (x, a, b) => (x <= 0 ? 0 : Math.exp(a * Math.log(b) - lgamma(a) + (a - 1) * Math.log(x) - b * x));

  const MODES = {
    normal: {
      params: [['m0', 'prior mean m₀', 30, 70], ['s0', 'prior sd', 0.3, 10], ['sigma', 'data sd σ', 0.5, 10], ['n', 'n', 1, 50, 1], ['xbar', 'x̄', 30, 70]],
      calc(s) {
        const k0 = 1 / s.s0 ** 2, nt = s.n / s.sigma ** 2, A = k0 + nt, B = k0 * s.m0 + nt * s.xbar;
        const pv = 1 / A, pm = B / A, lv = s.sigma ** 2 / s.n;
        const lo = Math.min(s.m0 - 3.5 * s.s0, s.xbar - 3.5 * Math.sqrt(lv)), hi = Math.max(s.m0 + 3.5 * s.s0, s.xbar + 3.5 * Math.sqrt(lv));
        return {
          lo, hi,
          prior: (x) => dnorm(x, s.m0, s.s0 ** 2), lik: (x) => dnorm(x, s.xbar, lv), post: (x) => dnorm(x, pm, pv),
          text: `precision: ${k0.toFixed(3)} (prior) + ${nt.toFixed(3)} (n/σ²) = <b>${A.toFixed(3)}</b> &nbsp;·&nbsp; posterior N(${pm.toFixed(2)}, ${pv.toFixed(3)})`
            + `<br><span class="phase-key">weight on x̄ = ${(nt / A).toFixed(2)}, on m₀ = ${(k0 / A).toFixed(2)}</span>`,
        };
      },
    },
    poisson: {
      params: [['a', 'prior shape a', 0.5, 20], ['b', 'prior rate b', 0.1, 10], ['n', 'n', 1, 40, 1], ['sum', 'Σy', 0, 120, 1]],
      calc(s) {
        const pa = s.a + s.sum, pb = s.b + s.n;
        const means = [s.a / s.b, (s.sum + 1) / s.n, pa / pb];
        const hi = Math.max(...means.map((m, i) => m + 4 * Math.sqrt(m / [s.b, s.n, pb][i]))) ;
        return {
          lo: 0, hi: Math.max(hi, 1),
          prior: (x) => dgamma(x, s.a, s.b), lik: (x) => dgamma(x, s.sum + 1, s.n), post: (x) => dgamma(x, pa, pb),
          text: `posterior Gamma(a + Σy, b + n) = Gamma(<b>${(+pa.toFixed(2))}</b>, <b>${(+pb.toFixed(2))}</b>) &nbsp;·&nbsp; mean ${(pa / pb).toFixed(2)}`
            + `<br><span class="phase-key">prior mean ${(s.a / s.b).toFixed(2)} · data mean ȳ = ${(s.sum / s.n).toFixed(2)}</span>`,
        };
      },
    },
  };

  function setup(el) {
    const d = el.dataset, mode = MODES[d.mode || 'normal'];
    const state = {};
    mode.params.forEach(([k, , lo]) => { state[k] = d[k] !== undefined ? +d[k] : lo; });

    el.classList.add('phase');
    const W = 440, H = 240, pad = { l: 10, r: 10, t: 10, b: 30 };
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
      inp.type = 'range'; inp.min = lo; inp.max = hi; inp.step = step || (hi - lo) / 400; inp.value = state[key];
      inp.setAttribute('aria-label', label);
      const show = () => { span.textContent = `${label} = ${step ? state[key] : (+state[key]).toFixed(2)}`; };
      inp.addEventListener('input', () => { state[key] = +inp.value; show(); draw(); });
      show(); lab.append(span, inp); controls.append(lab);
    });

    function draw() {
      const r = mode.calc(state);
      const g = canvas.getContext('2d');
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      const fg = css('--fg'), muted = css('--muted'), rule = css('--rule'), accent = css('--accent'), trap = css('--trap');
      const N = 300, xs = Array.from({ length: N + 1 }, (_, i) => r.lo + i * (r.hi - r.lo) / N);
      const curves = [[r.prior, muted, [5, 4], 'prior'], [r.lik, trap, [2, 3], 'likelihood (scaled)'], [r.post, accent, [], 'posterior']];
      const ymax = Math.max(...curves.flatMap(([f]) => xs.map(f))) * 1.08 || 1;
      const X = (x) => pad.l + (x - r.lo) / (r.hi - r.lo) * (W - pad.l - pad.r);
      const Y = (y) => pad.t + (1 - y / ymax) * (H - pad.t - pad.b);
      g.strokeStyle = rule; g.lineWidth = 1; g.beginPath(); g.moveTo(X(r.lo), Y(0)); g.lineTo(X(r.hi), Y(0)); g.stroke();
      g.font = '11px Inter, system-ui, sans-serif'; g.fillStyle = muted;
      for (let i = 0; i <= 4; i++) { const x = r.lo + i * (r.hi - r.lo) / 4; g.fillText((+x.toFixed(1)).toString(), X(x) - 8, H - 10); }
      curves.forEach(([f, col, dash, name], j) => {
        g.strokeStyle = col; g.lineWidth = j === 2 ? 2.2 : 1.5; g.setLineDash(dash); g.beginPath();
        xs.forEach((x, i) => (i ? g.lineTo(X(x), Y(f(x))) : g.moveTo(X(x), Y(f(x)))));
        g.stroke(); g.setLineDash([]);
        g.fillStyle = col; g.fillText(name, W - pad.r - 120, pad.t + 12 + 14 * j);
      });
      g.fillStyle = fg;
      info.innerHTML = r.text;
    }
    draw();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.conjplot').forEach(setup));
})();
