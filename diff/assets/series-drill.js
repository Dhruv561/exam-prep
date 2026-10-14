// Rapid-fire index-shift drill for power-series lessons (Topic 2).
//
// Markup:   <div class="series-drill" data-rounds="10"></div>
// Needs:    KaTeX (katex.min.js) loaded first. Uses the colour tokens from style.css.
//
// Each round shows a term a·t^p·y^(d) with y = Σ c_n t^n and asks for it as ONE sum in powers t^m.
// Options are generated so that exactly one is correct: wrong starts only ever drop real terms
// (a lower start whose extra terms vanish would also be correct, so it is never offered).

(function () {
  const CSS = `
  .series-drill { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; }
  .series-drill .sd-head { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); display: flex; justify-content: space-between; gap: .5rem; flex-wrap: wrap; margin-bottom: .6rem; }
  .series-drill .sd-q { margin: 0 0 .7rem; }
  .series-drill .sd-opts { display: grid; gap: .45rem; }
  .series-drill button { font: inherit; font-size: .95rem; text-align: left; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 6px; padding: .55rem .8rem; cursor: pointer; min-height: 44px; overflow-x: auto; }
  .series-drill button:hover:not([disabled]) { border-color: var(--accent); }
  .series-drill button.right { background: var(--ok-bg); border-color: var(--ok); }
  .series-drill button.wrong { background: var(--bad-bg); border-color: var(--bad); }
  .series-drill button[disabled] { cursor: default; }
  .series-drill .sd-why { margin-top: .8rem; font-size: .93rem; }
  .series-drill .sd-why .ok { color: var(--ok); font-weight: 600; }
  .series-drill .sd-why .no { color: var(--bad); font-weight: 600; }
  .series-drill .sd-next { margin-top: .7rem; font-family: Inter, system-ui, sans-serif; font-size: .85rem; text-align: center; border-color: var(--accent); }
  `;

  function tex(s, display) {
    return window.katex ? katex.renderToString(s, { throwOnError: false, displayMode: !!display }) : s;
  }
  function lin(v, off) { return off === 0 ? v : off > 0 ? `${v}+${off}` : `${v}-${-off}`; }
  function par(v, off) { return off === 0 ? v : `(${lin(v, off)})`; }
  // falling factor n, n(n-1) written in variable v with offset
  function fac(v, off, d) {
    if (d === 0) return '';
    if (d === 1) return par(v, off);
    return par(v, off) + par(v, off - 1);
  }
  function coef(a, F) {
    if (F === '') return a === 1 ? '' : a === -1 ? '-' : String(a);
    return a === 1 ? F : a === -1 ? '-' + F : a + F;
  }
  function sumStr(a, d, start, idx, fsh) {
    return `\\sum_{m=${start}}^{\\infty} ${coef(a, fac('m', fsh, d))}\\,c_{${lin('m', idx)}}\\,t^{m}`;
  }
  function termStr(a, p, d) {
    const tp = p === 0 ? '' : p === 1 ? 't\\,' : `t^{${p}}`;
    const y = d === 0 ? 'y' : d === 1 ? "y'" : "y''";
    const pre = a === 1 ? '' : a === -1 ? '-' : String(a);
    return pre + tp + y;
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function makeItem() {
    let d, p;
    do { d = pick([0, 1, 1, 2, 2, 2]); p = pick([0, 0, 1, 1, 2, 3]); } while (d === 0 && p === 0);
    const a = pick([1, 1, 2, -1, -2, 3, -3, 4]);
    const s = d - p;            // n = m + s
    const k = p - d;            // power is t^{n+k}
    const correct = sumStr(a, d, p, s, s);
    const cands = [
      sumStr(a, d, p, -s, -s),          // shifted the wrong way
      sumStr(a, d, p, s, 0),            // forgot to shift the n-factor
      sumStr(a, d, p + 1, s, s),        // start too high: loses a term
      sumStr(a, d, p + 2, s, s),
      sumStr(a, d, p, s + 1, s + 1),    // off by one
      sumStr(a, d, p, s - 1, s - 1),
    ];
    if (d > p) cands.push(sumStr(a, d, d, s, s)); // kept the old start: loses terms
    const wrong = shuffle([...new Set(cands)].filter((c) => c !== correct)).slice(0, 3);
    const opts = shuffle([correct, ...wrong]);

    const Fn = fac('n', 0, d);
    const tpow = k === 0 ? 't^{n}' : `t^{${lin('n', k)}}`;
    const step1 = `${termStr(a, p, d)} = \\sum_{n=${d}}^{\\infty} ${coef(a, Fn)}\\,c_n\\,${tpow}`;
    const shiftTxt = k === 0
      ? `The power is already $t^n$, so just rename $n \\to m$; the start stays at ${p}.`
      : `Set $m = ${lin('n', k)}$, i.e. replace every $n$ by $${lin('m', s)}$. The lowest term $n=${d}$ becomes $m=${p}$.`;
    return { q: termStr(a, p, d), opts, correct, step1, shiftTxt };
  }

  function inlineTex(str) { // render $...$ segments
    return str.replace(/\$([^$]+)\$/g, (_, t) => tex(t));
  }

  function setup(root) {
    const rounds = parseInt(root.dataset.rounds || '10', 10);
    let i = 0, score = 0, streak = 0, best = 0;

    function render() {
      if (i >= rounds) {
        root.innerHTML = `<div class="sd-head"><span>Shift drill · finished</span><span>best streak ${best}</span></div>
          <p class="sd-q"><strong>${score} / ${rounds}</strong> correct. ${score >= rounds - 1 ? 'Shifting is automatic now.' : 'Do another set: aim for 9+.'}</p>`;
        const again = document.createElement('button');
        again.className = 'sd-next'; again.textContent = 'Another set of ' + rounds;
        again.addEventListener('click', () => { i = 0; score = 0; streak = 0; render(); });
        root.appendChild(again);
        return;
      }
      const it = makeItem();
      root.innerHTML = `<div class="sd-head"><span>Shift drill · ${i + 1} / ${rounds}</span><span>score ${score} · streak ${streak}</span></div>
        <p class="sd-q">With ${tex('y=\\sum_{n=0}^{\\infty} c_n t^n')}, write ${tex(it.q)} as one sum in powers ${tex('t^m')}.</p>
        <div class="sd-opts"></div><div class="sd-why" hidden></div>`;
      const box = root.querySelector('.sd-opts'), why = root.querySelector('.sd-why');
      const btns = it.opts.map((o) => {
        const b = document.createElement('button');
        b.innerHTML = tex(o); b.dataset.ok = o === it.correct ? '1' : '';
        box.appendChild(b); return b;
      });
      btns.forEach((b) => b.addEventListener('click', () => {
        const ok = b.dataset.ok === '1';
        btns.forEach((x) => { x.disabled = true; if (x.dataset.ok) x.classList.add('right'); });
        if (!ok) b.classList.add('wrong');
        if (ok) { score++; streak++; best = Math.max(best, streak); } else streak = 0;
        why.hidden = false;
        why.innerHTML = `<span class="${ok ? 'ok' : 'no'}">${ok ? 'Correct.' : 'Not quite.'}</span> ${tex(it.step1)}. ${inlineTex(it.shiftTxt)}`;
        const next = document.createElement('button');
        next.className = 'sd-next'; next.textContent = i + 1 < rounds ? 'Next →' : 'See score';
        next.addEventListener('click', () => { i++; render(); });
        why.appendChild(document.createElement('br'));
        why.appendChild(next); next.focus();
      }));
    }
    render();
  }

  function init() {
    if (!document.getElementById('sd-style')) {
      const st = document.createElement('style'); st.id = 'sd-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    document.querySelectorAll('.series-drill').forEach(setup);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
