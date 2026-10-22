// BSM limits explorer (self-contained; first used in Lesson 23).
//
// Usage: <div class="bsml" data-k="50" data-r="5" data-sigma="30" data-t="1"></div>
//        <script src="../assets/bsm-limits-explorer.js"></script>
// Plots European call and put values against the stock price S (strike K fixed) next to
// their lower bounds S - K e^{-rT} and K e^{-rT} - S. Sliders move S, sigma, T and r;
// the read-out shows c, p, N(d1), N(d2) and how far each price sits above its bound.
// Rates and volatilities in data-* are in percent. Main read-out uses unrounded d (software values); the last row
// applies the exam table rule (d2 = unrounded d1 - sigma*sqrt(T), both rounded to 2dp, N to 4dp, formula sheet pp.5-6).

(function () {
  const CSS = `
.bsml { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.bsml .bc { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .45rem 1.2rem; }
.bsml label { display: flex; flex-direction: column; gap: .15rem; }
.bsml input[type=range] { width: 100%; accent-color: var(--accent); }
.bsml .bo { margin-top: .8rem; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .3rem 1rem; font-variant-numeric: tabular-nums; }
.bsml .bo b { font-size: .95rem; }
.bsml svg { width: 100%; height: auto; margin-top: .6rem; }
.bsml svg text { font-family: Inter, system-ui, sans-serif; font-size: 11px; fill: var(--muted); }
.bsml .bn { color: var(--muted); margin-top: .4rem; }
`;
  function injectCSS() {
    if (document.getElementById('bsml-css')) return;
    const s = document.createElement('style'); s.id = 'bsml-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  function N(x) { // standard normal CDF via a high-accuracy erfc approximation
    const z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.5 * z);
    const y = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? 1 - 0.5 * y : 0.5 * y;
  }
  function bs(S, K, T, s, r) {
    if (S <= 0) return { c: 0, p: K * Math.exp(-r * T), n1: 0, n2: 0, tc: 0, tp: K * Math.exp(-r * T) };
    const sq = s * Math.sqrt(T), d1 = (Math.log(S / K) + (r + s * s / 2) * T) / sq, d2 = d1 - sq, kd = K * Math.exp(-r * T);
    const t = (x) => Math.round(N(Math.round(x * 100) / 100) * 1e4) / 1e4, t1 = t(d1), t2 = t(d2);
    return { c: S * N(d1) - kd * N(d2), p: kd * N(-d2) - S * N(-d1), n1: N(d1), n2: N(d2),
      tc: S * t1 - kd * t2, tp: kd * (1 - t2) - S * (1 - t1) };
  }

  function init(root) {
    const K = +root.dataset.k || 50;
    const def = { sigma: (+root.dataset.sigma || 30) / 100, T: +root.dataset.t || 1, r: (+root.dataset.r || 5) / 100 };
    root.innerHTML = `
<div class="bc">
  <label>Stock price S: <b class="vS"></b><input type="range" class="iS" min="0" max="${2.6 * K}" step="0.5" value="${K}"></label>
  <label>Volatility &sigma;: <b class="vs"></b><input type="range" class="is" min="5" max="80" step="1" value="${def.sigma * 100}"></label>
  <label>Time T (years): <b class="vT"></b><input type="range" class="iT" min="0.1" max="5" step="0.1" value="${def.T}"></label>
  <label>Rate r: <b class="vr"></b><input type="range" class="ir" min="0" max="12" step="0.25" value="${def.r * 100}"></label>
</div>
<div class="bo">
  <div>Call c (unrounded d): <b class="oc"></b></div><div>Put p (unrounded d): <b class="op"></b></div><div>Strike K: <b>${K}</b> (PV: <b class="oK"></b>)</div>
  <div>N(d1): <b class="n1"></b></div><div>N(d2): <b class="n2"></b></div><div></div>
  <div>Table method c: <b class="tc"></b></div><div>Table method p: <b class="tp"></b></div><div>(d to 2dp, N to 4dp)</div>
  <div>c &minus; (S &minus; Ke<sup>&minus;rT</sup>): <b class="gc"></b></div><div>p &minus; (Ke<sup>&minus;rT</sup> &minus; S): <b class="gp"></b></div><div></div>
</div>
<svg viewBox="0 0 640 300" role="img" aria-label="Call and put values against stock price with their lower bounds"></svg>
<div class="bn">Solid: BSM call (accent) and put (dark). Dashed: lower bounds S &minus; Ke<sup>&minus;rT</sup> and Ke<sup>&minus;rT</sup> &minus; S. Predict first: drag S to the far right, then the far left. Which gap closes? Then raise &sigma; and T and watch the gaps open.</div>`;
    const q = (c) => root.querySelector(c);
    const svg = q('svg');
    function upd() {
      const S = +q('.iS').value, s = +q('.is').value / 100, T = +q('.iT').value, r = +q('.ir').value / 100;
      q('.vS').textContent = S.toFixed(1); q('.vs').textContent = (s * 100).toFixed(0) + '%';
      q('.vT').textContent = T.toFixed(1); q('.vr').textContent = (r * 100).toFixed(2) + '%';
      const kd = K * Math.exp(-r * T), o = bs(S, K, T, s, r);
      q('.oc').textContent = o.c.toFixed(4); q('.op').textContent = o.p.toFixed(4); q('.oK').textContent = kd.toFixed(2);
      q('.tc').textContent = o.tc.toFixed(2); q('.tp').textContent = o.tp.toFixed(2); q('.n1').textContent = o.n1.toFixed(4); q('.n2').textContent = o.n2.toFixed(4);
      q('.gc').textContent = (o.c - Math.max(S - kd, 0)).toFixed(4); q('.gp').textContent = (o.p - Math.max(kd - S, 0)).toFixed(4);
      const W = 640, H = 300, L = 40, R = 14, Tp = 12, B = 30, Smax = 2.6 * K, Ymax = 1.6 * K;
      const X = (v) => L + (v / Smax) * (W - L - R), Y = (v) => H - B - (Math.max(-0.1 * K, Math.min(v, Ymax)) / Ymax) * (H - B - Tp) - 0;
      const pts = (f) => { let d = ''; for (let i = 0; i <= 130; i++) { const v = (i / 130) * Smax; d += (i ? 'L' : 'M') + X(v).toFixed(1) + ',' + Y(f(v)).toFixed(1); } return d; };
      let g = `<line x1="${L}" y1="${Y(0)}" x2="${W - R}" y2="${Y(0)}" stroke="var(--rule)"/><line x1="${L}" y1="${Tp}" x2="${L}" y2="${H - B}" stroke="var(--rule)"/>`;
      g += `<line x1="${X(K)}" y1="${Tp}" x2="${X(K)}" y2="${H - B}" stroke="var(--rule)" stroke-dasharray="2 4"/><text x="${X(K) + 3}" y="${Tp + 10}">K</text>`;
      g += `<path d="${pts((v) => v - kd)}" fill="none" stroke="var(--muted)" stroke-dasharray="5 4"/>`;
      g += `<path d="${pts((v) => kd - v)}" fill="none" stroke="var(--muted)" stroke-dasharray="5 4"/>`;
      g += `<path d="${pts((v) => bs(v, K, T, s, r).p)}" fill="none" stroke="var(--fg)" stroke-width="2"/>`;
      g += `<path d="${pts((v) => bs(v, K, T, s, r).c)}" fill="none" stroke="var(--accent)" stroke-width="2"/>`;
      g += `<line x1="${X(S)}" y1="${Tp}" x2="${X(S)}" y2="${H - B}" stroke="var(--accent)" stroke-opacity=".35"/>`;
      g += `<circle cx="${X(S)}" cy="${Y(o.c)}" r="4" fill="var(--accent)"/><circle cx="${X(S)}" cy="${Y(o.p)}" r="4" fill="var(--fg)"/>`;
      g += `<text x="${W - R - 4}" y="${H - 8}" text-anchor="end">stock price S &rarr;</text><text x="${L + 4}" y="${Tp + 10}">value</text>`;
      svg.innerHTML = g;
    }
    root.querySelectorAll('input').forEach((i) => i.addEventListener('input', upd));
    upd();
  }
  function start() { injectCSS(); document.querySelectorAll('.bsml').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
