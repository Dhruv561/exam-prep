// Rapid-fire "match f to f̂" recognition drill for Fourier transforms (Topic 6).
//
// Markup:   <div class="ft-tbl-drill" data-rounds="8"></div>
// Needs:    KaTeX (katex.min.js) loaded first. Uses the colour tokens from style.css.
// Convention: f̂(k) = ∫ f(x) e^{-ikx} dx (MAST20030). Every item = one table pair + at most one shift,
// with random parameters. Distractors are the classic slips: wrong shift sign, x-shift vs k-shift,
// lost factor 2 / wrong width, wrong Gaussian scaling. All options are generated in the same format.

(function () {
  const CSS = `
  .ft-tbl-drill { border: 1px solid var(--rule); border-radius: 8px; padding: 1rem 1.2rem; margin: 1.4rem 0; }
  .ft-tbl-drill .fd-head { font-family: Inter, system-ui, sans-serif; font-size: .78rem; color: var(--muted); display: flex; justify-content: space-between; gap: .5rem; flex-wrap: wrap; margin-bottom: .6rem; }
  .ft-tbl-drill .fd-q { margin: 0 0 .7rem; }
  .ft-tbl-drill .fd-opts { display: grid; grid-template-columns: 1fr 1fr; gap: .45rem; }
  .ft-tbl-drill button { font: inherit; font-size: .95rem; text-align: left; color: var(--fg); background: var(--bg); border: 1px solid var(--rule); border-radius: 6px; padding: .55rem .8rem; cursor: pointer; min-height: 48px; overflow-x: auto; }
  .ft-tbl-drill button:hover:not([disabled]) { border-color: var(--accent); }
  .ft-tbl-drill button.right { background: var(--ok-bg); border-color: var(--ok); }
  .ft-tbl-drill button.wrong { background: var(--bad-bg); border-color: var(--bad); }
  .ft-tbl-drill button[disabled] { cursor: default; }
  .ft-tbl-drill .fd-why { margin-top: .8rem; font-size: .93rem; }
  .ft-tbl-drill .fd-why .ok { color: var(--ok); font-weight: 600; }
  .ft-tbl-drill .fd-why .no { color: var(--bad); font-weight: 600; }
  .ft-tbl-drill .fd-next { margin-top: .7rem; font-family: Inter, system-ui, sans-serif; font-size: .85rem; text-align: center; border-color: var(--accent); min-height: 0; }
  `;

  function tex(s) { return window.katex ? katex.renderToString(s, { throwOnError: false }) : s; }
  function inlineTex(str) { return str.replace(/\$([^$]+)\$/g, (_, t) => tex(t)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // e^{c i v}: c=0 → '', c=±1 → e^{±iv}
  function E(c, v) {
    if (c === 0) return '';
    const m = Math.abs(c) === 1 ? '' : Math.abs(c);
    return `e^{${c < 0 ? '-' : ''}${m}i${v}}`;
  }
  // v - s  as  "x-2" / "x+3" / "x"
  function sh(v, s) { return s === 0 ? v : s > 0 ? `${v}-${s}` : `${v}+${-s}`; }
  function co(a) { return a === 1 ? '' : String(a); }
  const SIGNED = [-3, -2, -1, 1, 2, 3];

  const T = [
    // 1. e^{-a|x-y|}: x-shift
    function () {
      const a = pick([1, 2, 3]), y = pick(SIGNED);
      return {
        dir: 'F', f: `e^{-${co(a)}|${sh('x', y)}|}`,
        correct: `\\dfrac{${2 * a}\\,${E(-y, 'k')}}{k^2+${a * a}}`,
        wrong: [`\\dfrac{${2 * a}\\,${E(y, 'k')}}{k^2+${a * a}}`, `\\dfrac{${a === 1 ? '' : a + '\\,'}${E(-y, 'k')}}{k^2+${a * a}}`, `\\dfrac{${2 * a}}{(${sh('k', y)})^2+${a * a}}`],
        why: `$e^{-${co(a)}|x|}\\leftrightarrow\\frac{${2 * a}}{${a * a}+k^2}$; shifting $x$ by $${y}$ multiplies by $${E(-y, 'k')}$ (same sign as $\\delta_{${y}}\\leftrightarrow ${E(-y, 'k')}$).`,
      };
    },
    // 2. e^{iqx}/(x^2+a^2): k-shift
    function () {
      const a = pick([2, 3]), q = pick(SIGNED);
      return {
        dir: 'F', f: `\\dfrac{${E(q, 'x')}}{x^2+${a * a}}`,
        correct: `\\dfrac{\\pi}{${a}}\\,e^{-${a}|${sh('k', q)}|}`,
        wrong: [`\\dfrac{\\pi}{${a}}\\,e^{-${a}|${sh('k', -q)}|}`, `\\dfrac{\\pi}{${a}}\\,${E(-q, 'k')}e^{-${a}|k|}`, `${a}\\pi\\,e^{-${a}|${sh('k', q)}|}`],
        why: `$\\frac1{x^2+${a * a}}\\leftrightarrow\\frac{\\pi}{${a}}e^{-${a}|k|}$; multiplying by $${E(q, 'x')}$ replaces $k$ by $${sh('k', q)}$.`,
      };
    },
    // 3. inverse of cos(ak) / sin(ak)
    function () {
      const a = pick([1, 2, 3, 4]), isCos = Math.random() < 0.5;
      const d = (s) => `\\delta(${sh('x', s)})`;
      if (isCos) return {
        dir: 'I', f: `\\cos(${co(a)}k)`,
        correct: `\\tfrac12\\big[${d(-a)}+${d(a)}\\big]`,
        wrong: [`\\tfrac12\\big[${d(-a)}-${d(a)}\\big]`, `\\tfrac{i}2\\big[${d(-a)}+${d(a)}\\big]`, `\\pi\\big[${d(-a)}+${d(a)}\\big]`],
        why: `$\\cos(${co(a)}k)=\\frac12(e^{${co(a)}ik}+e^{-${co(a)}ik})$ and $\\delta_c\\leftrightarrow e^{-ick}$, so $e^{${co(a)}ik}$ comes from $\\delta(x+${a})$.`,
      };
      return {
        dir: 'I', f: `\\sin(${co(a)}k)`,
        correct: `\\tfrac{i}2\\big[${d(a)}-${d(-a)}\\big]`,
        wrong: [`\\tfrac{i}2\\big[${d(-a)}-${d(a)}\\big]`, `\\tfrac12\\big[${d(a)}-${d(-a)}\\big]`, `\\tfrac{i}2\\big[${d(a)}+${d(-a)}\\big]`],
        why: `$\\sin(${co(a)}k)=\\frac1{2i}(e^{${co(a)}ik}-e^{-${co(a)}ik})=\\frac1{2i}\\mathcal F\\{\\delta(x+${a})-\\delta(x-${a})\\}$, and $\\frac1{2i}=-\\frac i2$.`,
      };
    },
    // 4. inverse of e^{-iyk}/(k^2+a^2): x-shift
    function () {
      const a = pick([1, 2, 3]), y = pick(SIGNED);
      const c = `\\tfrac{1}{${2 * a}}`;
      return {
        dir: 'I', f: `\\dfrac{${E(-y, 'k')}}{k^2+${a * a}}`,
        correct: `${c}\\,e^{-${co(a)}|${sh('x', y)}|}`,
        wrong: [`${c}\\,e^{-${co(a)}|${sh('x', -y)}|}`, `${c}\\,${E(-y, 'x')}e^{-${co(a)}|x|}`, `${c}\\,${E(y, 'x')}e^{-${co(a)}|x|}`],
        why: `$\\frac{1}{k^2+${a * a}}=\\frac1{${2 * a}}\\cdot\\frac{${2 * a}}{k^2+${a * a}}=\\mathcal F\\{\\frac1{${2 * a}}e^{-${co(a)}|x|}\\}$; the factor $${E(-y, 'k')}$ is an $x$-shift by $${y}$ (not a $k$-shift).`,
      };
    },
    // 5. Gaussian, optionally modulated
    function () {
      const a = pick([2, 3, 4, 5]), q = pick([0, 0, -2, -1, 1, 2]);
      const kk = q === 0 ? 'k^2' : `(${sh('k', q)})^2`;
      const r = `\\sqrt{\\pi/${a}}`;
      return {
        dir: 'F', f: `${E(q, 'x')}e^{-${a}x^2}`,
        correct: `${r}\\,e^{-${kk}/${4 * a}}`,
        wrong: [
          `\\sqrt{${a}\\pi}\\,e^{-${kk}/${4 * a}}`,
          `${r}\\,e^{-${a}${kk}/4}`,
          q === 0 ? `${r}\\,e^{-k^2/${a}}` : `${r}\\,e^{-(${sh('k', -q)})^2/${4 * a}}`,
        ],
        why: `$e^{-ax^2}\\leftrightarrow\\sqrt{\\pi/a}\\,e^{-k^2/4a}$ with $a=${a}$, so $4a=${4 * a}$.` + (q === 0 ? '' : ` Then $${E(q, 'x')}$ replaces $k$ by $${sh('k', q)}$.`),
      };
    },
    // 6. shifted box H_{y-a} - H_{y+a}
    function () {
      const a = pick([1, 2, 3]), y = pick([0, -2, -1, 1, 2]);
      const ex = y === 0 ? '' : `\\,${E(-y, 'k')}`;
      return {
        dir: 'F', f: `H_{${y - a}}(x)-H_{${y + a}}(x)`,
        correct: `\\dfrac{2\\sin(${co(a)}k)}{k}${ex}`,
        wrong: [
          `\\dfrac{2\\sin(${2 * a}k)}{k}${ex}`,
          `\\dfrac{\\sin(${co(a)}k)}{k}${ex}`,
          y === 0 ? `\\dfrac{2\\cos(${co(a)}k)}{k}` : `\\dfrac{2\\sin(${co(a)}k)}{k}\\,${E(y, 'k')}`,
        ],
        why: `A box of height 1 on $(${y - a},${y + a})$: half-width $${a}$, centre $${y}$. $H_{-${a}}-H_{${a}}\\leftrightarrow 2\\cdot${a}\\,\\mathrm{sinc}(${co(a)}k)=\\frac{2\\sin(${co(a)}k)}{k}$` + (y === 0 ? '.' : `; centre $${y}$ gives $${E(-y, 'k')}$.`),
      };
    },
    // 7. inverse of 1/((k+b)^2+a^2): complete the square, k-shift
    function () {
      const a = pick([1, 2, 3]), b = pick([-2, -1, 1, 2]);
      const c = `\\tfrac{1}{${2 * a}}`;
      return {
        dir: 'I', f: `\\dfrac{1}{k^2${b > 0 ? '+' : '-'}${2 * Math.abs(b)}k+${b * b + a * a}}`,
        correct: `${c}\\,${E(-b, 'x')}e^{-${co(a)}|x|}`,
        wrong: [`${c}\\,${E(b, 'x')}e^{-${co(a)}|x|}`, `${c}\\,e^{-${co(a)}|${sh('x', -b)}|}`, `${c}\\,e^{-${co(a)}|${sh('x', b)}|}`],
        why: `Complete the square: $(${sh('k', -b)})^2+${a * a}$ is $\\hat g(k-q)$ with $q=${-b}$, $\\hat g=\\frac1{k^2+${a * a}}\\leftrightarrow\\frac1{${2 * a}}e^{-${co(a)}|x|}$. A $k$-shift by $q$ means multiply by $e^{iqx}=${E(-b, 'x')}$.`,
      };
    },
  ];

  function setup(root) {
    const rounds = parseInt(root.dataset.rounds || '8', 10);
    let i = 0, score = 0, streak = 0, best = 0, last = -1;
    function render() {
      if (i >= rounds) {
        root.innerHTML = `<div class="fd-head"><span>Recognition drill · finished</span><span>best streak ${best}</span></div>
          <p class="fd-q"><strong>${score} / ${rounds}</strong> correct. ${score >= rounds - 1 ? 'Table + shifts are automatic.' : 'Another set: aim for ' + (rounds - 1) + '+.'}</p>`;
        const again = document.createElement('button');
        again.className = 'fd-next'; again.textContent = 'Another set of ' + rounds;
        again.addEventListener('click', () => { i = 0; score = 0; streak = 0; render(); });
        root.appendChild(again);
        return;
      }
      let t; do { t = Math.floor(Math.random() * T.length); } while (t === last); last = t;
      const it = T[t]();
      const opts = shuffle([it.correct, ...[...new Set(it.wrong)].filter((w) => w !== it.correct)]);
      const prompt = it.dir === 'F'
        ? `$f(x)=${it.f}$. Then $\\hat f(k)=$…`
        : `$\\hat f(k)=${it.f}$. Then $f(x)=\\mathcal F^{-1}\\{\\hat f\\}=$…`;
      root.innerHTML = `<div class="fd-head"><span>Recognition drill · ${i + 1} / ${rounds}</span><span>score ${score} · streak ${streak}</span></div>
        <p class="fd-q">${inlineTex(prompt)}</p><div class="fd-opts"></div><div class="fd-why" hidden></div>`;
      const box = root.querySelector('.fd-opts'), why = root.querySelector('.fd-why');
      const btns = opts.map((o) => {
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
        why.innerHTML = `<span class="${ok ? 'ok' : 'no'}">${ok ? 'Correct.' : 'Not quite.'}</span> ${inlineTex(it.why)}`;
        const next = document.createElement('button');
        next.className = 'fd-next'; next.textContent = i + 1 < rounds ? 'Next →' : 'See score';
        next.addEventListener('click', () => { i++; render(); });
        why.appendChild(document.createElement('br'));
        why.appendChild(next); next.focus();
      }));
    }
    render();
  }
  function init() {
    if (!document.getElementById('fd-style')) {
      const st = document.createElement('style'); st.id = 'fd-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    document.querySelectorAll('.ft-tbl-drill').forEach(setup);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
