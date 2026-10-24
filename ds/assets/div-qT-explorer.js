// Yield / parity explorer (self-contained; first used in Lesson 29).
// Usage: <div class="dqe" data-s="480" data-k="470" data-r="0.05" data-q="0.03" data-t="0.5" data-c="20" data-label="q"></div>
//        <script src="../assets/div-qT-explorer.js"></script>
// Shows S0 e^{-qT}, K e^{-rT}, the call and put lower bounds, the forward F0, and the put implied by parity
// from the call premium you enter. data-label="rf" relabels q as the foreign rate (currency options).
(function () {
  const CSS = `
.dqe { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.dqe .dc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .45rem 1rem; }
.dqe label { display: flex; flex-direction: column; gap: .15rem; }
.dqe input[type=range] { width: 100%; accent-color: var(--accent); }
.dqe .do { margin-top: .8rem; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .3rem 1rem; font-variant-numeric: tabular-nums; }
.dqe .do b { font-size: .95rem; }
.dqe .dn { color: var(--muted); margin-top: .5rem; }
`;
  function init(el) {
    if (!document.getElementById('dqe-css')) { const s = document.createElement('style'); s.id = 'dqe-css'; s.textContent = CSS; document.head.appendChild(s); }
    const d = el.dataset, rf = d.label === 'rf';
    const defs = [
      ['s', rf ? 'Spot S0 (domestic per foreign)' : 'Index level S0', +d.s, rf ? 0.5 : 100, rf ? 1.5 : 1000, rf ? 0.01 : 5, rf ? 4 : 0],
      ['k', 'Strike K', +d.k, rf ? 0.5 : 100, rf ? 1.5 : 1000, rf ? 0.01 : 5, rf ? 4 : 0],
      ['r', 'Domestic rate r (%)', +d.r * 100, 0, 10, 0.25, 2],
      ['q', rf ? 'Foreign rate r_f (%)' : 'Dividend yield q (%)', +d.q * 100, 0, 10, 0.25, 2],
      ['t', 'Time T (years)', +d.t, 0.1, 3, 0.05, 2],
      ['c', 'Call premium c (per unit)', +d.c, 0, rf ? 0.2 : 200, rf ? 0.001 : 0.5, rf ? 4 : 2],
    ];
    el.innerHTML = '<div class="dc">' + defs.map(([id, lab, v, mn, mx, st]) =>
      `<label>${lab}: <b data-v="${id}"></b><input type="range" data-i="${id}" min="${mn}" max="${mx}" step="${st}" value="${v}"></label>`).join('') +
      '</div><div class="do"></div><div class="dn"></div>';
    const out = el.querySelector('.do'), note = el.querySelector('.dn');
    const dp = rf ? 4 : 2;
    function upd() {
      const g = (id) => +el.querySelector(`[data-i=${id}]`).value;
      const S = g('s'), K = g('k'), r = g('r') / 100, q = g('q') / 100, T = g('t'), c = g('c');
      defs.forEach(([id, , , , , , p]) => { el.querySelector(`[data-v=${id}]`).textContent = g(id).toFixed(p); });
      const A = S * Math.exp(-q * T), B = K * Math.exp(-r * T), F = S * Math.exp((r - q) * T);
      const p = c + B - A, clb = Math.max(A - B, 0), plb = Math.max(B - A, 0);
      const f = (x) => x.toFixed(dp);
      out.innerHTML = `<div>S0e<sup>−qT</sup><br><b>${f(A)}</b></div><div>Ke<sup>−rT</sup><br><b>${f(B)}</b></div><div>Forward F0<br><b>${f(F)}</b></div>` +
        `<div>Call bound<br><b>${f(clb)}</b></div><div>Put bound<br><b>${f(plb)}</b></div><div>Put from parity<br><b>${f(p)}</b></div>`;
      const msgs = [];
      msgs.push(c < A - B ? 'Call premium is BELOW its lower bound: arbitrage.' : 'Call premium respects its lower bound.');
      msgs.push(p < plb ? 'Implied put is below its bound: this call premium is too low to be consistent.' : (Math.abs(K - F) < (rf ? 0.0005 : 0.5) ? 'K ≈ F0, so c ≈ p.' : (K < F ? 'K below F0, so c > p.' : 'K above F0, so p > c.')));
      note.textContent = msgs.join(' ');
    }
    el.addEventListener('input', upd); upd();
  }
  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.dqe').forEach(init));
  if (document.readyState !== 'loading') document.querySelectorAll('.dqe').forEach(init);
})();
