// Zero-rate to forward-rate explorer (self-contained; first used in Lesson 39).
//
// Usage: <div class="zfe" data-zeros="1:3.0,2:4.0,3:4.6,4:5.0,5:5.3"></div>
//        <script src="../assets/zero-forward-explorer.js"></script>
// data-zeros = maturity(years):zero rate (% p.a., continuous). Edit any zero rate; the forward rate for each year
// R_F = (R2 T2 - R1 T1)/(T2 - T1) and the 1-year-to-T forwards are recomputed, with a small chart of both curves.
// Plain-text labels (no KaTeX).

(function () {
  const CSS = `
.zfe { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; font-family: Inter, system-ui, sans-serif; font-size: .82rem; }
.zfe table { font-size: .82rem; margin: .2rem 0 .6rem; font-variant-numeric: tabular-nums; }
.zfe input { font: inherit; width: 4.5rem; padding: .25rem .4rem; border: 1px solid var(--rule); border-radius: 4px; background: var(--bg); color: var(--fg); }
.zfe svg { width: 100%; height: auto; }
.zfe svg text { font-family: Inter, system-ui, sans-serif; font-size: 10px; fill: var(--muted); }
.zfe .zn { color: var(--muted); margin-top: .3rem; }
`;
  function build(el) {
    if (!document.getElementById('zfe-css')) { const st = document.createElement('style'); st.id = 'zfe-css'; st.textContent = CSS; document.head.appendChild(st); }
    const pts = el.dataset.zeros.split(',').map((x) => x.split(':').map(Number));
    const T = pts.map((p) => p[0]), R = pts.map((p) => p[1]);
    el.innerHTML = '<div class="tablewrap"><table><tr><th>Maturity T (years)</th>' + T.map((t) => `<th>${t}</th>`).join('') + '</tr>' +
      '<tr><td>Zero rate R (% p.a.)</td>' + R.map((r, i) => `<td><input data-i="${i}" type="number" step="0.05" value="${r}" aria-label="Zero rate for ${T[i]} years"></td>`).join('') + '</tr>' +
      '<tr><td>Forward rate for the period ending at T (% p.a.)</td>' + T.map((t, i) => `<td data-f="${i}"></td>`).join('') + '</tr></table></div>' +
      '<svg viewBox="0 0 520 200" role="img" aria-label="Zero curve and forward curve"></svg><div class="zn"></div>';
    const svg = el.querySelector('svg'), note = el.querySelector('.zn');
    function upd() {
      const r = Array.from(el.querySelectorAll('input')).map((i) => +i.value);
      const f = r.map((x, i) => (i === 0 ? x : (x * T[i] - r[i - 1] * T[i - 1]) / (T[i] - T[i - 1])));
      el.querySelectorAll('[data-f]').forEach((c, i) => { c.textContent = i === 0 ? r[0].toFixed(2) + ' (= zero rate)' : f[i].toFixed(2); });
      const all = r.concat(f), lo = Math.floor(Math.min(...all) - 0.5), hi = Math.ceil(Math.max(...all) + 0.5);
      const x = (t) => 40 + (t - 0) / (T[T.length - 1] + 0.3) * 460, y = (v) => 170 - (v - lo) / (hi - lo) * 150;
      let g = '';
      for (let v = lo; v <= hi; v++) g += `<line x1="40" x2="500" y1="${y(v)}" y2="${y(v)}" stroke="var(--rule)"/><text x="6" y="${y(v) + 3}">${v}%</text>`;
      T.forEach((t) => { g += `<text x="${x(t) - 3}" y="190">${t}</text>`; });
      const path = (a, col, dash) => `<polyline fill="none" stroke="${col}" stroke-width="2" ${dash ? 'stroke-dasharray="5 3"' : ''} points="${a.map((v, i) => x(T[i]) + ',' + y(v)).join(' ')}"/>` + a.map((v, i) => `<circle cx="${x(T[i])}" cy="${y(v)}" r="3" fill="${col}"/>`).join('');
      svg.innerHTML = g + path(r, 'var(--accent)', false) + path(f, 'var(--ok)', true) +
        `<text x="340" y="14" style="fill:var(--accent)">solid: zero rate</text><text x="420" y="14" style="fill:var(--ok)">dashed: forward</text>`;
      const up = r[r.length - 1] > r[0];
      note.textContent = up ? 'Zero curve slopes up, so each forward rate sits above the zero rate for the same maturity.' : 'Zero curve slopes down, so each forward rate sits below the zero rate.';
    }
    el.addEventListener('input', upd); upd();
  }
  const go = () => document.querySelectorAll('.zfe').forEach(build);
  document.addEventListener('DOMContentLoaded', go);
  if (document.readyState !== 'loading') go();
})();
