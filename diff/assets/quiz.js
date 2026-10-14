// Reusable quiz + maths rendering for every lesson.
//
// Markup:
//   <div class="quiz" data-answer="b">
//     <p class="q">Question…</p>
//     <div class="opts">
//       <button class="opt" data-key="a">…</button>
//       <button class="opt" data-key="b">…</button>
//     </div>
//     <div class="why">Explanation shown after answering.</div>
//   </div>
//   <div class="score" data-score></div>   (optional running score)
//
// Maths: write $…$ inline and $$…$$ display; KaTeX + auto-render must be loaded first.

(function () {
  function renderMath() {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    }
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

    quizzes.forEach((quiz) => {
      const answer = quiz.dataset.answer;
      const buttons = Array.from(quiz.querySelectorAll('button.opt'));
      const why = quiz.querySelector('.why');
      const verdict = document.createElement('div');
      verdict.className = 'verdict';
      if (why) why.prepend(verdict);

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const ok = btn.dataset.key === answer;
          buttons.forEach((b) => {
            b.disabled = true;
            if (b.dataset.key === answer) b.classList.add('right');
          });
          if (!ok) btn.classList.add('wrong');
          verdict.textContent = ok ? 'Correct.' : 'Not quite.';
          verdict.classList.add(ok ? 'ok' : 'no');
          quiz.classList.add('done');
          answered++; if (ok) correct++;
          updateScore();
        });
      });
    });
    updateScore();
  }

  document.addEventListener('DOMContentLoaded', () => { renderMath(); setupQuizzes(); });
})();
