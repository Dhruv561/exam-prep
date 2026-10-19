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

## Topic 3 (Laplace): lessons 0013–0020, drafted 17 Oct by subagents at user's request
13 definition/table/inverse; 14 solving IVPs; 15 Heaviside + t-shift; 16 Dirac delta; 17 convolution + general g; 18 derivations/proofs, variable-coeff, systems; 19 timed mixed set (6 Qs, 50 marks; redo Q3, Q4 cold after 3 days); 20 integral & integro-differential (added at user request). Full-solution pages in worked/00NN-*. Reference: reference/topic3-cheatsheet.html (not yet checked to fit one A4 page). Method map `laplace` unlocked.
- Formula sheet table has only 8 pairs. NOT on sheet (derive): L{H_a}, L{tf}=-F', L{∫f}=F/s, te^{at}, e^{at}sin/cos, 1/(s²+ω²)².
- Laplace tutes: week 5 (LT/ILT), week 6 (IVPs, H, δ, convolution). Booklet Q1–22.
- Patterns (only): delta/window forcing answered piecewise; continuity/jump check + sketch; two-point conditions with unknown y'(0); completing the square; trig identity first; prove L{tf}=-F' then variable-coeff ODE; convolution with general g; text → ICs interpretation.
- Rules: impulse → y continuous, y' jumps K/a. n-th order with switching forcing → y..y^(n-1) continuous. Always check y(0), y'(0) on the answer.
- sympy not installed system-wide; agents used venvs in scratchpad.

## Topic 4 (Fourier series): lessons 0021–0026, drafted 18 Oct by subagents at user's request ("similar to exam, don't go overboard on algebra")
21 coefficients, orthogonality, parity; 22 even/odd extensions, half-range, sketching, product-to-sum special n; 23 pointwise convergence, Gibbs, decay rate, uniform + M-test; 24 Parseval/average power, complex form, evaluating sums; 25 term-by-term ∫/d/dx, periodic ODEs by trial series + resonance; 26 timed mixed set (5 Qs, 50 marks). Full solutions in worked/00NN-*. Reference: reference/topic4-cheatsheet.html (fits A4 only at 6.9pt). Method map `fourier` unlocked. New asset: assets/fourier-extension-plot.js (`FourierExt.mount`, even/odd/periodic extension toggle + partial-sum slider).
- Formula sheet: only coefficient formulas + product-to-sum. MEMORISE: half-range (2/L)∫₀ᴸ, convergence theorems, Gibbs ≈9% of jump (NOT in lectures; from past exams), Parseval, complex form, term-by-term conditions.
- Lecture wording: pointwise = "Dirichlet's sufficient condition" (L17 s5). Uniform (L17 s10): f' piecewise continuous + periodic extension continuous ⇒ uniform. Average power (L19) = (1/L)∫_{-L}^{L} f² = a0²/2 + Σ(an²+bn²). Complex cn = (1/2L)∫ f e^{-inπx/L} (L18).
- Term-by-term: lectures only say uniform ⇒ integrate OK; differentiation "needs extra condition". Lesson 25 also states the stronger standard results.
- Patterns (only): parity + sketch + non-zero coeffs only; trig piece on sub-interval → product-to-sum; non-integer frequency cos(x/2); "converges to? uniform? quote lectures"; Σ1/(2m−1)² via plug-in ("calculation required"); Gibbs location + error; decay 1/n vs 1/n²; M-test proof; integrate given s(x) term-by-term + justify; combined sum via x⁴ and x² series at x=π; periodic ODE y''−ky = s(x) by trial series.
- Paul's EvenOddFunctions.aspx 404s; FourierSeries, PeriodicOrthogonal, Convergence pages load.
- Parseval tip (L24): terms look like coefficients → plug in a point; look like squared coefficients → Parseval. Booklet/tutes have no Parseval Q; L24 homework adds Parseval steps.

## Topic 5 (BVPs & PDEs): lessons 0027–0033, drafted 19 Oct by subagents at user's request ("exam style + difficulty, no algebra for its own sake")
27 BVPs, 3-case analysis, eigen-table (DD/NN/DN/ND/periodic), PDE classification; 28 1D heat SoV, homogeneous BCs, matching vs half-range, N–N mean; 29 steady + transient (inhomogeneous BCs, source → polynomial u_S, N–N constant fixed by mean) — most exam-heavy; 30 Laplace rectangle + polar (disc, wedge, annulus); 31 wave eq, normal modes, plucked string, 2D drum dispersion, heat vs wave; 32 radial J0 (disc heat/drum) + genuine solutions (M-test on t ≥ T > 0); 33 timed mixed set (5 Qs, 52 marks). Full solutions worked/00NN-*. Reference: reference/topic5-cheatsheet.html. Method map `sepvars` unlocked.
- Convention: lectures use Ṫ/(αT) = X''/X = λ, oscillatory case λ = −k². Booklet/tutes/Paul use X''+λX=0 (signs flip); polar Θ''+λΘ=0 (2022 paper). Lessons flag this.
- Nothing in T5 is on the formula sheet. "Total heat" parts marked NOT in 2025 → skipped.
- Free-end strings and unequal-flux Neumann (no steady state) are booklet-only / recognise-only.
- New assets: assets/pde-heat-plot.js (PdeHeat.mount: modal series + time slider + exam-sketch overlay), assets/pde-profiles.js (PDEProfiles.mount: u at t=0,t1,t2,∞ + probe readout), assets/pde-wave-plot.js (PdeWave.mount: animated string, multi-curve, e.g. wave vs heat).
- Patterns (only): inhomogeneous mixed BCs + IC = u_S + one eigenfunction (matching); linear source → cubic trial; sketch 0,t1,t2,∞; midpoint value as t→∞; axisymmetric drum: derive ODEs, 3 cases, which oscillates, J0 zeros, series w/o coefficients; semi-annulus Laplace with finite sine boundary data; heat vs wave on a discontinuous IC; "which series/derivatives converge uniformly".
- Render check 19 Oct: all T5 pages clean (KaTeX, links, JS, plots). Fixed in passing: raw `<x` in 0026, worked/0026, topic3-cheatsheet; style.css now keeps maths lowercase inside uppercase `th` headers (was turning s→S, k→K site-wide). User only cares about laptop/desktop width.
