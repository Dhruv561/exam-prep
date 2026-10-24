// Swap-design calculator (self-contained; first used in Lesson 41).
//
// Usage: <div class="sdc" data-mode="borrow" data-a="7,1" data-b="10,2" data-fee="0.5" data-share="50"></div>
//        <script src="../assets/swap-design-calculator.js"></script>
// data-a / data-b = fixed rate (%), floating spread over SOFR (%). Rates are borrowing costs (mode "borrow": A wants
// floating, B wants fixed) or investment returns (mode "invest": A wants fixed, B wants floating). data-fee = bank's
// take (% p.a.), data-share = A's share of the gain after the fee (%). Follows the lecture's layout: the floating leg
// passed through the bank is the SAME rate on both sides. Plain-text labels (no KaTeX).

(function () {
  const CSS = `
.sdc { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.sdc .sc { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .45rem 1rem; }
.sdc label { display: flex; flex-direction: column; gap: .15rem; }
.sdc input[type=number] { font: inherit; width: 100%; padding: .3rem .45rem; border: 1px solid var(--rule); border-radius: 4px; background: var(--bg); color: var(--fg); }
.sdc input[type=range] { width: 100%; accent-color: var(--accent); }
.sdc .so { margin-top: .8rem; display: grid; gap: .25rem; font-variant-numeric: tabular-nums; }
.sdc .so b { font-size: .92rem; }
.sdc .sn { color: var(--muted); margin-top: .5rem; }
.sdc .bad { color: var(--bad); }
`;
  const f = (x) => (Math.round(x * 1000) / 1000).toString();
  function build(el) {
    if (!document.getElementById('sdc-css')) { const st = document.createElement('style'); st.id = 'sdc-css'; st.textContent = CSS; document.head.appendChild(st); }
    const d = el.dataset, invest = d.mode === 'invest';
    const [fa, sa] = d.a.split(',').map(Number), [fb, sb] = d.b.split(',').map(Number);
    const what = invest ? 'return' : 'cost';
    el.innerHTML = '<div class="sc">' +
      `<label>A fixed ${what} (%)<input type="number" step="0.05" data-i="fa" value="${fa}"></label>` +
      `<label>A floating: SOFR + (%)<input type="number" step="0.05" data-i="sa" value="${sa}"></label>` +
      `<label>Bank fee (% p.a.)<input type="number" step="0.05" data-i="fee" value="${d.fee}"></label>` +
      `<label>B fixed ${what} (%)<input type="number" step="0.05" data-i="fb" value="${fb}"></label>` +
      `<label>B floating: SOFR + (%)<input type="number" step="0.05" data-i="sb" value="${sb}"></label>` +
      `<label>A's share of gain: <b data-v="sh"></b><input type="range" min="0" max="100" step="5" data-i="sh" value="${d.share}"></label></div>` +
      `<div class="so"></div><div class="sn">${invest ? 'A wants a fixed return, B wants a floating return.' : 'A wants floating borrowing, B wants fixed borrowing.'}</div>`;
    const out = el.querySelector('.so');
    function upd() {
      const g = (id) => +el.querySelector(`[data-i=${id}]`).value;
      const FA = g('fa'), SA = g('sa'), FB = g('fb'), SB = g('sb'), fee = g('fee'), sh = g('sh') / 100;
      el.querySelector('[data-v=sh]').textContent = (sh * 100).toFixed(0) + '% (B: ' + ((1 - sh) * 100).toFixed(0) + '%)';
      const fixedGap = FB - FA, floatGap = SB - SA, qsd = Math.abs(fixedGap - floatGap), gain = qsd - fee;
      let html = `<div>Difference in fixed: <b>${f(fixedGap)}</b> · difference in floating: <b>${f(floatGap)}</b> · QSD (difference in differences): <b>${f(qsd)}%</b></div>`;
      if (gain <= 0) { out.innerHTML = html + '<div class="bad">Bank fee swallows the whole gain: no swap is worth doing.</div>'; return; }
      const gA = sh * gain, gB = (1 - sh) * gain;
      if (!invest) {
        // A wants floating, B wants fixed. Swap only helps if A has the comparative advantage in fixed.
        if (fixedGap < floatGap) { out.innerHTML = html + '<div class="bad">A already has its comparative advantage in floating (and B in fixed): each borrows what it wants directly; the swap in this layout does not help.</div>'; return; }
        const Fa = FA + SB - SA + gA, Fb = FB - gB;
        html += `<div>Comparative advantage: <b>A in fixed</b>, <b>B in floating</b>. Gain after fee: <b>${f(gain)}%</b> (A ${f(gA)}%, B ${f(gB)}%)</div>` +
          `<div>A borrows fixed at ${f(FA)}% outside; B borrows SOFR + ${f(SB)}% outside.</div>` +
          `<div>Bank pays A fixed <b>${f(Fa)}%</b>; A pays bank SOFR + ${f(SB)}%. B pays bank fixed <b>${f(Fb)}%</b>; bank pays B SOFR + ${f(SB)}%.</div>` +
          `<div>A ends up paying <b>SOFR + ${f(SA - gA)}%</b> (was SOFR + ${f(SA)}%). B ends up paying <b>${f(FB - gB)}%</b> (was ${f(FB)}%). Bank nets <b>${f(Fb - Fa)}%</b>.</div>`;
      } else {
        // A wants fixed, B wants floating. Swap only helps if B earns relatively more on fixed (fixed gap > floating gap).
        if (fixedGap < floatGap) { out.innerHTML = html + '<div class="bad">B does not earn relatively more on fixed, so each already invests in the market it wants: each invests as it wants directly; the swap in this layout does not help.</div>'; return; }
        const Fb = FB + SA - SB - gB, Fa = FA + gA;
        html += `<div>Comparative advantage: <b>B in fixed</b>, <b>A in floating</b>. Gain after fee: <b>${f(gain)}%</b> (A ${f(gA)}%, B ${f(gB)}%)</div>` +
          `<div>B invests fixed at ${f(FB)}% outside; A invests at SOFR + ${f(SA)}% outside.</div>` +
          `<div>Bank pays A fixed <b>${f(Fa)}%</b>; A pays bank SOFR + ${f(SA)}%. B pays bank fixed <b>${f(Fb)}%</b>; bank pays B SOFR + ${f(SA)}%.</div>` +
          `<div>A ends up earning <b>${f(FA + gA)}%</b> fixed (was ${f(FA)}%). B ends up earning <b>SOFR + ${f(SB + gB)}%</b> (was SOFR + ${f(SB)}%). Bank nets <b>${f(Fb - Fa)}%</b>.</div>`;
      }
      out.innerHTML = html;
    }
    el.addEventListener('input', upd); upd();
  }
  const go = () => document.querySelectorAll('.sdc').forEach(build);
  document.addEventListener('DOMContentLoaded', go);
  if (document.readyState !== 'loading') go();
})();
