// Delta-hedge explorer (self-contained; first used in Lesson 34).
//
// Usage: <div class="dhe" data-s="100" data-k="100" data-r="0.05" data-q="0" data-sigma="0.25" data-t="0.5"
//             data-type="call" data-pos="short" data-n="2000" data-max="25"></div>
//        <script src="../assets/delta-hedge-explorer.js"></script>
// Sets up a hedge at S0 (shares = |delta| x options, opposite sign to the option position's delta), then moves the
// stock by the slider (% of S0, immediately, no rebalancing) and reprices the option with EXACT (unrounded) BSM.
// Shows option P&L, share P&L, net, the first-order estimate (delta x move) and the leftover caused by delta
// changing (Lesson 37). data-q is the yield (index), r_f (currency) or r (futures option is not supported here).
// Plain-text labels (no KaTeX).

(function () {
  const CSS = `
.dhe { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.dhe label { display: flex; flex-direction: column; gap: .15rem; }
.dhe input[type=range] { width: 100%; accent-color: var(--accent); }
.dhe .dh-set { color: var(--muted); margin-bottom: .6rem; }
.dhe .dh-out { margin-top: .7rem; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .35rem 1rem; font-variant-numeric: tabular-nums; }
.dhe .dh-out b { font-size: .95rem; }
.dhe .neg { color: var(--bad); } .dhe .pos { color: var(--ok); }
.dhe .dh-n { color: var(--muted); margin-top: .6rem; }
`;
  function phi(x) {
    const a = Math.abs(x);
    const t = 1 / (1 + 0.2316419 * a);
    const d = Math.exp(-a * a / 2) / Math.sqrt(2 * Math.PI);
    const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  }
  function price(type, S, K, r, q, s, T) {
    const sq = s * Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r - q + s * s / 2) * T) / sq, d2 = d1 - sq;
    const ds = Math.exp(-q * T), dk = Math.exp(-r * T);
    const c = S * ds * phi(d1) - K * dk * phi(d2);
    const p = K * dk * phi(-d2) - S * ds * phi(-d1);
    const dc = ds * phi(d1);
    return type === 'call' ? { v: c, delta: dc } : { v: p, delta: dc - ds };
  }
  const money = (x) => (x < 0 ? '−$' : '$') + Math.abs(x).toLocaleString('en-US', { maximumFractionDigits: 0 });
  const cls = (x) => (Math.abs(x) < 0.5 ? '' : x < 0 ? 'neg' : 'pos');

  function build(el) {
    if (!document.getElementById('dhe-css')) { const st = document.createElement('style'); st.id = 'dhe-css'; st.textContent = CSS; document.head.appendChild(st); }
    const d = el.dataset;
    const S0 = +d.s, K = +d.k, r = +d.r, q = +(d.q || 0), s = +d.sigma, T = +d.t, n = +d.n, max = +(d.max || 25);
    const type = d.type || 'call', sign = (d.pos || 'short') === 'short' ? -1 : 1;
    const base = price(type, S0, K, r, q, s, T);
    const posDelta = sign * base.delta * n;          // option position's delta, in shares
    const shares = -posDelta;                         // hedge: opposite sign
    el.innerHTML = `<div class="dh-set">${d.pos || 'short'} ${n.toLocaleString('en-US')} ${type} options · S0 = ${S0}, K = ${K}, r = ${(r * 100).toFixed(1)}%, ` +
      `${q ? 'q = ' + (q * 100).toFixed(1) + '%, ' : ''}σ = ${(s * 100).toFixed(0)}%, T = ${T} · delta per option = <b>${base.delta.toFixed(4)}</b> · ` +
      `hedge: <b>${shares >= 0 ? 'long' : 'short'} ${Math.abs(shares).toFixed(0)}</b> shares</div>` +
      `<label>Stock moves by <b class="mv"></b> straight away (no rebalancing)<input type="range" min="${-max}" max="${max}" step="0.5" value="0"></label>` +
      '<div class="dh-out"></div><div class="dh-n"></div>';
    const inp = el.querySelector('input'), mv = el.querySelector('.mv'), out = el.querySelector('.dh-out'), note = el.querySelector('.dh-n');
    function upd() {
      const pct = +inp.value, S1 = S0 * (1 + pct / 100), dS = S1 - S0;
      mv.textContent = (pct >= 0 ? '+' : '') + pct.toFixed(1) + '% (' + (dS >= 0 ? '+' : '−') + '$' + Math.abs(dS).toFixed(2) + ')';
      const now = price(type, S1, K, r, q, s, T);
      const optPL = sign * (now.v - base.v) * n, shPL = shares * dS, net = optPL + shPL;
      const est = sign * base.delta * n * dS + shPL;   // first-order option P&L + share P&L (= 0 by construction)
      const optEst = sign * base.delta * n * dS;
      out.innerHTML =
        `<div>Option position P&amp;L<br><b class="${cls(optPL)}">${money(optPL)}</b></div>` +
        `<div>Share hedge P&amp;L<br><b class="${cls(shPL)}">${money(shPL)}</b></div>` +
        `<div>Net<br><b class="${cls(net)}">${money(net)}</b></div>` +
        `<div>Straight-line estimate of option P&amp;L (delta × move)<br><b>${money(optEst)}</b></div>` +
        `<div>New delta per option<br><b>${now.delta.toFixed(4)}</b></div>` +
        `<div>Hedge now needed<br><b>${(-sign * now.delta * n) >= 0 ? 'long' : 'short'} ${Math.abs(sign * now.delta * n).toFixed(0)}</b> shares</div>`;
      const small = Math.abs(pct) < 1.5;
      note.textContent = Math.abs(net) < 0.5 ? 'Nothing moved: hedge in place.'
        : small ? 'Small move: net is close to zero, because the option moves by about delta × move.'
        : 'Large move: delta has changed, so the straight-line estimate is off and the net is not zero. The hedge also needs rebalancing (Lesson 37).';
    }
    inp.addEventListener('input', upd); upd();
  }
  const go = () => document.querySelectorAll('.dhe').forEach(build);
  document.addEventListener('DOMContentLoaded', go);
  if (document.readyState !== 'loading') go();
})();
