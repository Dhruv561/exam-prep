// Swap valuation table (self-contained; first used in Lesson 42).
//
// Usage: <div class="svt" data-notional="40" data-fixed="4.5" data-times="0.5,1,1.5" data-zeros="3.9,4.1,4.3"
//             data-first="4.0" data-units="$m"></div>
//        <script src="../assets/swap-valuation-table.js"></script>
// Values a swap as a portfolio of FRAs (Lecture 10 method): floating CF = L x SOFR x 0.5 (first SOFR known = data-first,
// % semiannual), later SOFR forwards from the zero curve (continuous zeros, %), converted to semiannual; net CF
// discounted at the zero rate. Toggle which side you are on. Edit any zero rate. Plain-text labels (no KaTeX).

(function () {
  const CSS = `
.svt { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.svt table { font-size: .8rem; margin: .5rem 0; font-variant-numeric: tabular-nums; }
.svt td, .svt th { text-align: right; } .svt td:first-child, .svt th:first-child { text-align: left; }
.svt input[type=number] { font: inherit; width: 4.4rem; padding: .2rem .35rem; border: 1px solid var(--rule); border-radius: 4px; background: var(--bg); color: var(--fg); }
.svt .sv-top { display: flex; gap: 1.2rem; flex-wrap: wrap; align-items: center; }
.svt .sv-tot { font-size: .95rem; margin-top: .4rem; }
.svt .sv-n { color: var(--muted); margin-top: .4rem; }
`;
  function build(el) {
    if (!document.getElementById('svt-css')) { const st = document.createElement('style'); st.id = 'svt-css'; st.textContent = CSS; document.head.appendChild(st); }
    const d = el.dataset, L = +d.notional, K = +d.fixed / 100, T = d.times.split(',').map(Number), Z0 = d.zeros.split(',').map(Number);
    const first = +d.first / 100, u = d.units || '$m';
    el.innerHTML = '<div class="sv-top"><label>You: <select><option value="1">pay fixed, receive floating</option><option value="-1">receive fixed, pay floating</option></select></label>' +
      `<span>Notional ${L}${u === '$m' ? 'm' : ''} · fixed ${(K * 100).toFixed(2)}% semiannual · payments every 6 months</span></div>` +
      '<div class="tablewrap"><table></table></div><div class="sv-tot"></div><div class="sv-n"></div>';
    const tbl = el.querySelector('table'), tot = el.querySelector('.sv-tot'), sel = el.querySelector('select'), note = el.querySelector('.sv-n');
    function upd() {
      const side = +sel.value, Z = Z0.slice();
      el.querySelectorAll('input').forEach((i) => { Z[+i.dataset.i] = +i.value; });
      let rows = '<tr><th>Time t</th><th>Zero R (%)</th><th>Disc. factor</th><th>SOFR (s.a. %)</th><th>Floating CF</th><th>Fixed CF</th><th>Net (you)</th><th>PV</th></tr>', total = 0;
      T.forEach((t, i) => {
        const df = Math.exp(-Z[i] / 100 * t);
        let rate;
        if (i === 0) rate = first;
        else { const fc = (Z[i] * t - Z[i - 1] * T[i - 1]) / (t - T[i - 1]) / 100; rate = (Math.exp(fc * 0.5) - 1) / 0.5; }
        const fl = L * rate * 0.5, fx = L * K * 0.5, net = side * (fl - fx), pv = net * df; total += pv;
        rows += `<tr><td>${t}</td><td><input type="number" step="0.05" data-i="${i}" value="${Z[i]}" aria-label="Zero rate at ${t}"></td><td>${df.toFixed(4)}</td><td>${(rate * 100).toFixed(3)}</td><td>${fl.toFixed(4)}</td><td>${fx.toFixed(4)}</td><td>${net.toFixed(4)}</td><td>${pv.toFixed(4)}</td></tr>`;
      });
      tbl.innerHTML = rows;
      tot.innerHTML = `Swap value to you: <b>${total.toFixed(4)}</b> ${u}`;
      note.textContent = total > 0 ? 'Positive: the swap is an asset to you (and a liability to the other side). Credit risk applies to you.' : total < 0 ? 'Negative: the swap is a liability to you. The other side carries the credit risk.' : 'Zero: a fair swap.';
      tbl.querySelectorAll('input').forEach((i) => i.addEventListener('change', upd));
    }
    sel.addEventListener('change', upd); upd();
  }
  const go = () => document.querySelectorAll('.svt').forEach(build);
  document.addEventListener('DOMContentLoaded', go);
  if (document.readyState !== 'loading') go();
})();
