# Notes

## Preferences / rules
- **Short on time: assign a trimmed homework set** (about 3 parts per question, chosen for exam relevance), not "all of (a)–(g)". List the rest as optional.
- **Always open lessons/reference HTML inside VS Code's integrated browser**, never an external browser. Setup: `.vscode/settings.json` sets `workbench.browser.openLocalhostLinks: true`; serve the workspace with `python3 -m http.server 8765 --bind 127.0.0.1 --directory <workspace>` (start it if `lsof -iTCP:8765` shows nothing), then run `code --open-url http://localhost:8765/lessons/<file>.html` and also print that link so the user can Cmd+click it in the VS Code terminal. (Mechanism set up 12 Oct; confirm with user whether `code --open-url` worked and record here.)
- **Past exams are OFF-LIMITS for practice** (`exams/` folder: 2017, 2018, 2022, 2024 papers + sample mid-sem test). User wants to sit them cold. Never reproduce or lightly reword an exam question in a lesson. Adapting the *pattern* (a trick, a case, a question type) with genuinely different equations is fine and wanted.
- Problem booklet (`problem-booklet/`) and tutorials (`tutes/`, with solutions) are official practice: assign them as homework by number rather than copying them into lessons.
- Lecture-note exercises are EASIER than the exam: every lesson's practice should go a notch above the notes.
- User started from scratch on 12 Oct 2026; exam 5 Nov 2026.
- **Exam frequency page: `reference/topic1-exam-frequency.html`** (14 Oct): Topic 1 marks by technique × paper, plus question forms. 2022/2024 part splits are estimates. Recent papers shift to systems; reduction of order is on all 4.
- **Living method map: `reference/ode-method-map.html`** (created 13 Oct at user's request). After every lesson that teaches or refines a solving method, update its DATA block: add/extend the entry in `METHODS` (use, form, steps, cases, traps), wire it into `TREE`, turn a `future: true` stub into a full entry when its topic is reached, bump `META` and add a `LOG` line. User wants it to show *when* to use each method plus every case (repeated, complex, resonance…) as hover/click chips.
- Before /teach ran, a terminal version of Lesson 1 was given with Q1–Q5; Lesson 0001 replaces it.

## Exam format (from past papers; confirm for 2026 on Canvas)
- 3 h writing, no calculator, 6–7 questions, 100–120 marks.
- 2024: NO handwritten notes sheet; a formulae sheet is provided (Laplace table, limits, series tests, Fourier series/transform formulae, trig/hyperbolic identities). It has nothing for Topic 1, so integrating factor, reduction of order, Wronskian, Abel and eigen-methods must be memorised.
- 2017/2018/2022 allowed one handwritten A4 sheet.
- Sample mid-sem solutions (studocu) contain an error in Q1's matching: don't trust that key blindly.

## Topic 1 question patterns seen in exams (patterns only, for designing practice)
- Reduction of order is near-certain: given v, OR first find v by trialling t^n / (t+a)^b / e^{λt}; often inhomogeneous with log or exponential forcing; then apply ICs.
- Euler-type t²y''+aty'+by=0: distinct roots, repeated root → log t, complex → cos/sin(log t).
- Wronskian: prove linear independence; Abel's identity to deduce a property of the 2nd solution; Wronskian → ODE for a missing solution (3rd order).
- Existence/uniqueness: "largest interval on which a unique solution is guaranteed": divide by leading coefficient, find discontinuities, pick the interval containing t0.
- Systems: convert to vector form; diagonalisation with constant/exponential forcing + IVP; system ↔ single 2nd-order ODE.
- Parameter-dependent matrix: eigenvalues as functions of α, then type + stability for every case.
- Detailed phase portrait: straight-line orbits + direction, ≥4 other orbits, asymptotics t→±∞, slopes where orbits cross axes, loci of max/min in x and y (nullclines), orbits with y/x constant, choosing an IC so the orbit → origin.
- Short answer (2018 only): matrix exponential of a 2×2; prove general = complementary + particular.

## Plan for Topic 1 lessons (follows lectures 1–6)
All 6 drafted on 12 Oct at the user's request ("draft up all 6"). The user works through them at their own pace; adjust later lessons if learning records show gaps. Next after Topic 1: a mixed Topic 1 review set (new questions), then Topic 2.
0. Assumed knowledge refresher (Calc 2 + linear algebra: integration, product rule, complex numbers, const-coeff 2nd order, independence, eigen, diagonalisation, limits) ← 0000 (drafted 12 Oct at user's request; homework = Booklet 0 trimmed + Week 1 tute)
1. Classify ODEs, IVPs, integrating factor, interval of validity ← 0001
2. Complementary + particular solutions; reduction of order (incl. finding v by trial) ← 0002
3. Linear independence, Wronskian, Abel's identity, Euler equations (log and cos(log t) cases) ← 0003 (drafted 12 Oct)
4. Higher-order ODE → 1st-order system and back; eigenvalue method; complex eigenvalues ← 0004 (drafted 12 Oct)
5. Phase portraits: type/stability classification (with parameters), nullclines, axis-crossing slopes, asymptotics ← 0005 (drafted 12 Oct; uses assets/phase.js)
6. Inhomogeneous systems by diagonalisation; matrix exponential ← 0006 (drafted 12 Oct)
7. Particular solutions: decision list (machine = reduction of order vs shortcut = predict shape / undetermined coeffs, incl. Euler + resonance) ← 0007 (added 13 Oct after user said they "really suck at finding the particular solution", esp. Lesson 3 challenge (c)). Course itself only teaches reduction of order + diagonalisation for y_p; shortcut is presented as optional/check.

## Topic 2 question patterns seen in exams (patterns only)
- A power-series question on every paper (~15% of marks). Polynomial-coefficient ODE with a quadratic leading coefficient, "use power series about x = 0": one or both solutions often terminate. Follow-ups: interval of convergence; largest interval with a guaranteed unique solution for ICs at x0 ≠ 0.
- Singular at 0 (t y'' + … ): show a coefficient is forced, unique formal solution with c0 = 1 in sum form, radius, intervals of uniform convergence, "genuine?" by quoting lectures, then Wronskian → log singularity of y2 OR y2 = t^a Σ d_j t^j with a, d1, d2 found from the Wronskian equation.
- Weierstrass test on a non-power trig/exponential series.

## Plan for Topic 2 lessons (lectures 7–9), all drafted 14 Oct by subagents at user's request
8. Taylor series, standard series, radius of convergence ← 0008
9. 5-step series method, index shifts, closed-form recurrences (constant coeff + simple variable) ← 0009
10. Polynomial coefficients: terminating solutions, radius from singular points, three-term recurrences, Airy-type ← 0010 (most exam-heavy)
11. Singular point at 0: one series solution, Wronskian → log or t^a second solution, light Frobenius ← 0011
12. Uniform convergence, Weierstrass test, formal vs genuine ← 0012
Reference: reference/topic2-cheatsheet.html; method map `series` entry unlocked.
New assets (14 Oct): `assets/series-drill.js` (random index-shift drill, `<div class="series-drill" data-rounds="10">`), `assets/series-plot.js` (`SeriesPlot.mount`: partial sums vs limit with max-error marker; reuse for Fourier partial sums). Full written solutions: worked/0010-, 0011-challenge-full-solution.html. Lesson 10 cites Trench (LibreTexts) for the radius ≥ distance-to-singularity theorem (not in lecture notes). Paul's Series Solutions Ex. 4 = a past-exam ODE; lesson tells user to skip it.
