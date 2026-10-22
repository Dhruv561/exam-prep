// Lognormal stock-price explorer (self-contained; first used in Lesson 22).
//
// Usage: <div class="bsmln" data-s0="50" data-mu="0.10" data-sigma="0.30" data-t="1"></div>
//        <script src="../assets/bsm-lognormal-explorer.js"></script>
// Each .bsmln shows the density of S_T when ln S_T ~ phi(ln S0 + (mu - sigma^2/2)T, sigma^2 T),
// with the median, mean and 95% band (ln S_T within 1.96 sd of its mean). The dashed grey curve
// is the starting (base) case so the shift from your changes is visible. x axis is fixed at 0 to 250.

(function () {
  const CSS = `
.bsmln { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.bsmln .bc { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .45rem 1rem; }
.bsmln label { display: flex; flex-direction: column; gap: .15rem; }
.bsmln input[type=range] { width: 100%; accent-color: var(--accent); }
.bsmln .bo { margin-top: .8rem; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .3rem 1rem; font-variant-numeric: tabular-nums; }
.bsmln .bo b { font-size: .95rem; }
.bsmln svg { width: 100%; height: auto; margin-top: .6rem; }
.bsmln svg text { font-family: Inter, system-ui, sans-serif; font-variant-numeric: tabular-nums; fill: var(--muted); font-size: 11px; }
.bsmln .bn { color: var(--muted); margin-top: .4rem; }
`;
  function injectCSS() {
    if (document.getElementById('bsmln-css')) return;
    const s = document.createElement('style'); s.id = 'bsmln-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  const XMAX = 250;

  function stats(S0, mu, sg, T) {
    const m = Math.log(S0) + (mu - sg * sg / 2) * T, v = sg * sg * T, sd = Math.sqrt(v);
    const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
    return {
      m, v, sd,
      median: Math.exp(m), mean: S0 * Math.exp(mu * T),
      lo: Math.exp(m - 1.96 * sd), hi: Math.exp(m + 1.96 * sd),
      sdS: S0 * Math.exp(mu * T) * Math.sqrt(Math.exp(v) - 1),
      pDown: Phi((Math.log(S0) - m) / sd),
    };
  }
  function erf(x) { // Abramowitz-Stegun 7.1.26 is too coarse; use series/continued fraction via high-precision approximation
    const t = 1 / (1 + 0.5 * Math.abs(x));
    const y = 1 - t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? y : -y;
  }
  function pdf(s, m, sd) {
    if (s <= 0) return 0;
    const z = (Math.log(s) - m) / sd;
    return Math.exp(-z * z / 2) / (s * sd * Math.sqrt(2 * Math.PI));
  }

  function curve(m, sd, x, y, N) {
    let d = '';
    for (let i = 0; i <= N; i++) {
      const s = XMAX * i / N;
      d += (i ? 'L' : 'M') + x(s).toFixed(1) + ',' + y(pdf(s, m, sd)).toFixed(1);
    }
    return d;
  }

  function build(root) {
    const base = {
      S0: +root.dataset.s0 || 50, mu: +root.dataset.mu || 0.1,
      sigma: +root.dataset.sigma || 0.3, T: +root.dataset.t || 1,
    };
    const baseSt = stats(base.S0, base.mu, base.sigma, base.T);
    const sl = (id, label, min, max, step, val) =>
      `<label><span>${label} = <b data-v="${id}"></b></span><input type="range" data-i="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
    root.innerHTML =
      `<div class="bc">${sl('s0', 'S₀ ($)', 20, 120, 5, base.S0)}${sl('mu', 'μ (% p.a.)', -10, 40, 1, base.mu * 100)}${sl('sigma', 'σ (% p.a.)', 10, 80, 1, base.sigma * 100)}${sl('t', 'T (years)', 0.25, 5, 0.25, base.T)}</div>` +
      `<svg viewBox="0 0 640 240" role="img" aria-label="Lognormal density of the stock price at T"></svg>` +
      `<div class="bo"></div><div class="bn"></div>`;
    const svg = root.querySelector('svg'), out = root.querySelector('.bo'), note = root.querySelector('.bn');

    function draw() {
      const g = (id) => +root.querySelector(`[data-i=${id}]`).value;
      const S0 = g('s0'), mu = g('mu') / 100, sg = g('sigma') / 100, T = g('t');
      root.querySelector('[data-v=s0]').textContent = '$' + S0;
      root.querySelector('[data-v=mu]').textContent = (mu * 100).toFixed(0) + '%';
      root.querySelector('[data-v=sigma]').textContent = (sg * 100).toFixed(0) + '%';
      root.querySelector('[data-v=t]').textContent = T;
      const st = stats(S0, mu, sg, T);
      const W = 640, H = 240, L = 30, R = 10, B = 28, Tp = 14;
      const x = (s) => L + (W - L - R) * s / XMAX;
      // y scale from the tallest of current and base curves
      let ymax = 0;
      for (let i = 1; i <= 250; i++) { const s = XMAX * i / 250; ymax = Math.max(ymax, pdf(s, st.m, st.sd), pdf(s, baseSt.m, baseSt.sd)); }
      const y = (f) => H - B - (H - B - Tp) * f / (ymax * 1.05);
      const cur = curve(st.m, st.sd, x, y, 250);
      let s = '';
      // 95% band
      const loC = Math.min(st.lo, XMAX), hiC = Math.min(st.hi, XMAX);
      let band = `M${x(loC).toFixed(1)},${y(0)}`;
      for (let i = 0; i <= 120; i++) { const sv = loC + (hiC - loC) * i / 120; band += `L${x(sv).toFixed(1)},${y(pdf(sv, st.m, st.sd)).toFixed(1)}`; }
      band += `L${x(hiC).toFixed(1)},${y(0)}Z`;
      s += `<path d="${band}" fill="var(--accent)" opacity=".16"/>`;
      s += `<path d="${curve(baseSt.m, baseSt.sd, x, y, 250)}" fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      s += `<path d="${cur}" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
      s += `<line x1="${L}" y1="${H - B}" x2="${W - R}" y2="${H - B}" stroke="var(--rule)"/>`;
      for (let t = 0; t <= XMAX; t += 50) s += `<text x="${x(t)}" y="${H - 10}" text-anchor="middle">${t}</text>`;
      // S0 marker
      s += `<line x1="${x(S0)}" y1="${Tp}" x2="${x(S0)}" y2="${H - B}" stroke="var(--muted)" stroke-width="1"/><text x="${x(S0) + 3}" y="${Tp + 8}">S₀</text>`;
      const mk = (v, label, dy, col) => v <= XMAX ? `<line x1="${x(v)}" y1="${Tp + dy - 6}" x2="${x(v)}" y2="${H - B}" stroke="${col}" stroke-width="1.5"/><text x="${x(v) + 3}" y="${Tp + dy + 4}" style="fill:${col}">${label}</text>` : '';
      s += mk(st.median, 'median', 22, 'var(--ok)');
      s += mk(st.mean, 'mean', 38, 'var(--bad)');
      svg.innerHTML = s;
      const f = (v) => v > 999 ? v.toFixed(0) : v.toFixed(2);
      out.innerHTML =
        `<div>Mean of ln S<sub>T</sub><br><b>${st.m.toFixed(4)}</b></div><div>s.d. of ln S<sub>T</sub><br><b>${st.sd.toFixed(4)}</b></div>` +
        `<div>Median S<sub>T</sub><br><b>$${f(st.median)}</b></div><div>Mean S<sub>T</sub><br><b>$${f(st.mean)}</b></div>` +
        `<div>95% low<br><b>$${f(st.lo)}</b></div><div>95% high<br><b>$${f(st.hi)}</b></div>` +
        `<div>s.d. of S<sub>T</sub><br><b>$${f(st.sdS)}</b></div><div>P(S<sub>T</sub> &lt; S₀)<br><b>${(st.pDown * 100).toFixed(1)}%</b></div>`;
      note.textContent = 'Shaded: 95% band. Dashed grey: your starting case. Axis is cut at $250' + (st.hi > XMAX ? ' (the 95% band runs past it).' : '.');
    }
    root.querySelectorAll('input').forEach((i) => i.addEventListener('input', draw));
    draw();
  }
  document.addEventListener('DOMContentLoaded', () => { injectCSS(); document.querySelectorAll('.bsmln').forEach(build); });
})();
