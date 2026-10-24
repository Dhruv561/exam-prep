// Portfolio-insurance payoff explorer (self-contained; first used in Lesson 33).
//
// Usage: <div class="insx" data-s0="2500" data-p0="30000000" data-mult="50" data-strike-pct="90"
//             data-r="0.04" data-q="0.02" data-sigma="0.20" data-t="1"></div>
//        <script src="../assets/div-insurance-payoff.js"></script>
// Shows value of the portfolio at T against the index level at T: uninsured line, insured line (portfolio + puts, before
// the premium) and insured line net of premium. Slider = strike as % of today's index. Premium uses EXACT (unrounded) BSM
// with yield q, so it differs slightly from the exam's table method. Portfolio is assumed to move 1-for-1 with the index
// in % terms and dividends are ignored in the payoff (as in the lecture). Plain-text labels (no KaTeX).

(function () {
  const CSS = `
.insx { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.insx label { display: flex; flex-direction: column; gap: .15rem; }
.insx input[type=range] { width: 100%; accent-color: var(--accent); }
.insx .io { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .2rem 1rem; margin-top: .5rem; font-variant-numeric: tabular-nums; }
.insx svg { width: 100%; height: auto; margin-top: .5rem; }
.insx svg text { font-family: Inter, system-ui, sans-serif; font-size: 11px; fill: var(--muted); }
.insx .n { color: var(--muted); margin-top: .4rem; }
`;
  function phi(x) {
    const a = Math.abs(x);
    const t = 1 / (1 + 0.2316419 * a);
    const d = Math.exp(-a * a / 2) / Math.sqrt(2 * Math.PI);
    const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  }
  function put(S, K, r, q, s, T) {
    const sq = s * Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r - q + s * s / 2) * T) / sq, d2 = d1 - sq;
    return K * Math.exp(-r * T) * phi(-d2) - S * Math.exp(-q * T) * phi(-d1);
  }
  const fm = (x) => '$' + (x / 1e6).toFixed(2) + 'm';

  function build(el) {
    const S0 = +el.dataset.s0, P0 = +el.dataset.p0, m = +el.dataset.mult;
    const r = +el.dataset.r, q = +el.dataset.q, s = +el.dataset.sigma, T = +el.dataset.t;
    let pct = +(el.dataset.strikePct || 90);
    el.innerHTML = '<label>Strike as % of today\'s index: <b class="kv"></b><input type="range" min="70" max="110" step="1"></label>' +
      '<div class="io"></div><svg viewBox="0 0 520 260" role="img" aria-label="Insured portfolio value at expiry against index level at expiry"></svg>' +
      '<div class="n">Grey: no insurance. Solid: portfolio plus puts (before premium). Dashed: after paying the premium (no interest). The kink is at the strike.</div>';
    const slider = el.querySelector('input'), kv = el.querySelector('.kv'), io = el.querySelector('.io'), svg = el.querySelector('svg');
    slider.value = pct;
    function draw() {
      pct = +slider.value;
      const K = S0 * pct / 100, N = P0 / (S0 * m), prem = put(S0, K, r, q, s, T) * N * m;
      kv.textContent = pct + '% (K = ' + K.toFixed(0) + ')';
      const floor = P0 * K / S0;
      io.innerHTML = '<div>Puts needed N = ' + N.toFixed(0) + '</div><div>Floor (before premium) = ' + fm(floor) + '</div>' +
        '<div>Premium (exact BSM) = ' + fm(prem) + ' (' + (100 * prem / P0).toFixed(2) + '% of portfolio)</div><div>Floor after premium = ' + fm(floor - prem) + '</div>';
      const xmin = 0.6 * S0, xmax = 1.4 * S0, ymin = 0.55 * P0, ymax = 1.45 * P0;
      const X = (x) => 40 + (x - xmin) / (xmax - xmin) * 460, Y = (y) => 230 - (y - ymin) / (ymax - ymin) * 210;
      const val = (x) => P0 * x / S0, ins = (x) => val(x) + N * m * Math.max(K - x, 0);
      const pts = (f) => [xmin, K, xmax].map((x) => X(x).toFixed(1) + ',' + Y(f(x)).toFixed(1)).join(' ');
      let h = '<line x1="40" y1="230" x2="500" y2="230" stroke="var(--rule)"/><line x1="40" y1="20" x2="40" y2="230" stroke="var(--rule)"/>';
      h += '<polyline fill="none" stroke="var(--muted)" stroke-width="1.5" points="' + pts(val) + '"/>';
      h += '<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="' + pts(ins) + '"/>';
      h += '<polyline fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-dasharray="5 4" points="' + pts((x) => ins(x) - prem) + '"/>';
      h += '<line x1="' + X(K) + '" y1="20" x2="' + X(K) + '" y2="230" stroke="var(--rule)" stroke-dasharray="2 3"/>';
      h += '<text x="' + X(K) + '" y="248" text-anchor="middle">K ' + K.toFixed(0) + '</text>';
      h += '<text x="' + X(S0) + '" y="258" text-anchor="middle">today ' + S0 + '</text><line x1="' + X(S0) + '" y1="226" x2="' + X(S0) + '" y2="234" stroke="var(--muted)"/>';
      h += '<text x="36" y="' + (Y(floor) + 4) + '" text-anchor="end">' + (floor / 1e6).toFixed(1) + 'm</text>';
      h += '<text x="44" y="30">value at T ($m)</text><text x="500" y="226" text-anchor="end">index at T</text>';
      svg.innerHTML = h;
    }
    slider.addEventListener('input', draw);
    draw();
  }
  function init() {
    if (!document.getElementById('insx-css')) { const s = document.createElement('style'); s.id = 'insx-css'; s.textContent = CSS; document.head.appendChild(s); }
    document.querySelectorAll('.insx').forEach(build);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
