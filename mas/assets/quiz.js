// Reusable quiz + maths rendering for every lesson.
//
// Multiple choice:
//   <div class="quiz" data-answer="b">
//     <p class="q">Question…</p>
//     <div class="opts">
//       <button class="opt" data-key="a">…</button>
//       <button class="opt" data-key="b">…</button>
//     </div>
//     <div class="why">Explanation shown after answering.</div>
//   </div>
//
// Numeric answer (typed; "$", commas and spaces are ignored):
//   <div class="quiz num" data-answer="6500" data-tol="0.5">
//     <p class="q">Question…</p>
//     <div class="numrow"><input aria-label="Your answer"><span class="unit">$</span></div>
//     <div class="why">Explanation shown after answering.</div>
//   </div>
//   data-tol is an absolute tolerance (default: 0.5% of the answer, at least 0.001).
//   Wrong answers can be retried; only a first-try hit counts toward the score.
//
//   <div class="score" data-score></div>   (optional running score)
//
// Maths: write $…$ or \(…\) inline and $$…$$ or \[…\] display; KaTeX + auto-render must be loaded first.
// Pages full of currency put <body data-money>: then a single $ is literal text and inline maths must use \(…\).

(function () {
  function renderMath() {
    if (window.renderMathInElement) {
      const delimiters = [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ];
      if (!('money' in document.body.dataset)) delimiters.push({ left: '$', right: '$', display: false });
      renderMathInElement(document.body, {
        delimiters,
        throwOnError: false,
      });
    }
  }

  function parseNum(s) {
    const t = String(s).replace(/[$,\s]/g, '').replace(/[−–]/g, '-');
    if (t === '' || isNaN(Number(t))) return null;
    return Number(t);
  }

  function setupQuizzes() {
    const quizzes = Array.from(document.querySelectorAll('.quiz'));
    const scoreEl = document.querySelector('[data-score]');
    let answered = 0, correct = 0;

    function updateScore() {
      if (!scoreEl) return;
      scoreEl.textContent = answered === quizzes.length
        ? `Done: ${correct} / ${quizzes.length} first-try correct. Redo the misses tomorrow.`
        : `${correct} / ${answered} correct so far · ${quizzes.length - answered} to go`;
    }

    function finish(quiz, ok, verdict, label) {
      verdict.textContent = label || (ok ? 'Correct.' : 'Not quite.');
      verdict.classList.add(ok || label ? 'ok' : 'no');
      quiz.classList.add('done');
      answered++; if (ok) correct++;
      updateScore();
    }

    quizzes.forEach((quiz) => {
      const answer = quiz.dataset.answer;
      const why = quiz.querySelector('.why');
      const verdict = document.createElement('div');
      verdict.className = 'verdict';
      if (why) why.prepend(verdict);

      if (quiz.classList.contains('num')) {
        const row = quiz.querySelector('.numrow');
        const input = row.querySelector('input');
        input.setAttribute('inputmode', 'decimal');
        input.setAttribute('autocomplete', 'off');
        const check = document.createElement('button'); check.textContent = 'Check';
        const reveal = document.createElement('button'); reveal.textContent = 'Show answer';
        const hint = document.createElement('span'); hint.className = 'hint';
        row.append(check, reveal, hint);
        const target = Number(answer);
        const tol = quiz.dataset.tol !== undefined
          ? Number(quiz.dataset.tol)
          : Math.max(Math.abs(target) * 0.005, 0.001);
        let tries = 0, closed = false;

        function close(ok) {
          closed = true;
          input.disabled = check.disabled = reveal.disabled = true;
          input.classList.remove('wrong'); input.classList.add(ok ? 'right' : 'wrong');
          if (!ok) hint.textContent = `Answer: ${answer}`; else hint.textContent = '';
          finish(quiz, ok && tries === 1, verdict, ok && tries > 1 ? 'Correct on a retry (not counted as first-try).' : '');
        }
        function submit() {
          if (closed) return;
          const v = parseNum(input.value);
          if (v === null) { hint.textContent = 'Type a number.'; return; }
          tries++;
          if (Math.abs(v - target) <= tol) close(true);
          else { input.classList.add('wrong'); hint.textContent = tries === 1 ? 'Not quite. Check your working and try again.' : 'Still off. Try again or reveal.'; }
        }
        check.addEventListener('click', submit);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
        input.addEventListener('input', () => input.classList.remove('wrong'));
        reveal.addEventListener('click', () => { if (!closed) { tries = Math.max(tries, 2); close(false); } });
        return;
      }

      const buttons = Array.from(quiz.querySelectorAll('button.opt'));
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const ok = btn.dataset.key === answer;
          buttons.forEach((b) => {
            b.disabled = true;
            if (b.dataset.key === answer) b.classList.add('right');
          });
          if (!ok) btn.classList.add('wrong');
          finish(quiz, ok, verdict);
        });
      });
    });
    updateScore();
  }

  document.addEventListener('DOMContentLoaded', () => { renderMath(); setupQuizzes(); });
})();
