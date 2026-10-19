# Notes

## Preferences / rules
- **Past exams are OFF-LIMITS for practice** (`exams/`, incl. `official exams/`). The user will sit them timed and cold. Never reproduce or lightly reword one (and don't reuse the exact distribution plus parametrisation of a past MLE question). DO mine them for patterns, tricks, variations and difficulty, and build fresh exam-style questions. User (12 Oct): "Exam style questions are the best and most accurate source of what my exam will look like."
- Tutorial questions (`tutes/*_questions.qmd`, with `_sol.html`) and textbook questions (Faraway, `books/`) can be used directly or assigned as homework (user, 12 Oct: "it is fair game to use textbook qs"). Exception: Faraway exercises/examples on datasets the past exams use (pima, gala, dicentric, ships, dvisits, wavesolder). See RESOURCES.md.
- **R: interpret, don't code** (user, 12 Oct). The exam is on paper: no R access and no code writing, but questions on R output/code like the past papers. Turn R exercises (tutes, Faraway) into printout versions: generate the output myself (R + scratch `faraway` lib) and embed it as `pre.rout`, then ask for by-hand interpretation and arithmetic. Only ask the user to run R if it's essential (none so far). They do have R and RStudio. Include reading short R code snippets (what does this line compute?) since exam questions show code.
- Starting from zero on 12 Oct 2026. Assumes first-year probability (pdfs, expectations, logs, derivatives). Check this in Lesson 1 and add a refresher if needed.
- Same teaching set-up as `../diff`: short Tufte-style HTML lessons, immediate-feedback quizzes, a trimmed homework set.
- **Open lessons in VS Code's integrated browser**: serve with `python3 -m http.server 8767 --bind 127.0.0.1 --directory <mas workspace>` (start it if `lsof -iTCP:8767` shows nothing), then `code --open-url http://localhost:8767/lessons/<file>.html`, and print the link too.
- `assets/quiz.js` supports numeric typed answers (`.quiz.num`).

## Course map (lecture order, from tute weeks)
- Wk 2: Binomial regression I/II: logistic model, likelihood, MLE asymptotics (observed/Fisher information, Wald CI, LRT), deviance, AIC (`BinReg_1`, `BinReg_2`, extra-notes `Challenger.pdf`, `observed_information_binomial_regression-1.pdf`)
- Wk 3–5: Exponential families, GLMs I–III (canonical link, variance function, IWLS, deviance, diagnostics) (`Exponential_families`, `GLM_1`, `GLM_2`)
- Wk 6: Overdispersion and quasi-likelihood
- Wk 6–7: Mixture models and EM (GMM derivations in lectures + extra-notes)
- Wk 8–11: Bayesian inference, Monte Carlo, rejection sampling, MCMC (MH, Gibbs), diagnostics, variational inference (CAVI)

## Exam patterns (patterns only, from 2017/2018/2020/2021/2022 papers)
- **Q1 every year (7–10 marks): one-parameter iid sample → (a) log-likelihood, (b) Fisher information, (c) MLE and its asymptotic distribution.** Distributions used so far: Pareto-type, Poisson, Normal with known mean and unknown precision, exponential (rate and 1/λ parametrisations). Twists: parametrised by precision or 1/rate; the l'' depends on the data so you need the expectation; the course's I(θ) is the information of the whole sample.
- Exponential family (8–10 marks): show the form and identify θ, φ, b, a, c; canonical link; variance function v(μ) via b''(θ) as a function of μ (gamma, Poisson, exponential).
- R-output GLM question (7–22 marks): Poisson vs quasi-Poisson; dispersion φ = Pearson X²/df; quasi SEs = Poisson SE × √φ; F-statistic = (ΔDeviance/Δdf)/φ̂ with df (Δdf, residual df of the big model); log-likelihood from AIC; deviance goodness of fit; which model to prefer and why; consequences of ignoring overdispersion (SEs too small, so p-values too small).
- EM for a 2-component normal mixture (10–12 marks), often with a twist (some observations known to come from one component, a shared mean of 0): derive Q(θ,θ⁰), then the M-step.
- Bayesian (14–17 marks): a Gibbs full conditional (recognise Normal/Gamma kernels); a numeric MH acceptance probability with an asymmetric proposal (include the proposal ratio!); a CAVI update q*(τ) in terms of E[μ], V[μ].

## Lecturer's word on the 2026 exam (Patricia Menendez Galvan, Ed #74 and #78, ~12–14 Oct 2026)
- Everything is assessable unless the slides or class say it's excluded. **Most Markov chain theory is NOT examinable** (`extra-notes/MarkovProcesses-3.pdf` is low priority; MH/Gibbs *algorithms* still are).
- Must **read and interpret R code and R output**; **never write R code** on paper.
- **All questions are exercises: no MCQ.** Show calculations *and* explanations.
- Prep advice from her: tute + lab content (code *and* theory), in-class exercises, and **her QMD demo files** (`extra-notes/*.qmd`, Challenger, Bliss, EM-updated).
- She'll release the exam's first page and the formula sheet later. When it's out, note it here and check it against the 2022 distribution list.
- How this changes lessons: each quiz needs an "explain why" part (2–3 sentences), not just a number. Include "what does this R line compute?" items (2017 had a `while` loop simulating a discrete r.v.).

## Past papers vs her comments (checked 14 Oct)
- Format matches: every paper 2016–2022 is all worked exercises, no MCQ, R output to interpret, no code writing.
- 2017/2018 (3 h, /120 and /100, 8 Qs) were set by an earlier lecturer and include off-syllabus items: log-linear models for 3-way contingency tables (2017 Q4), ordered-factor contrasts (.L/.Q). Lower weight for these.
- 2020–2022 (2 h, 50 marks, 5 Qs, online COVID format) have the same skeleton every year: MLE → GLM R output → EM → Bayes (Gibbs/MH/CAVI). 2022 put a distribution list on the front page, which is probably what her formula sheet will look like.
- Markov theory in the past papers is only "what is the stationary distribution of this MH chain?" (2018 Q7), so it fits her exclusion.
- 2016 paper: Q1 MLE on negbin(r, p) counting successes before the r-th failure; Q2 Weibull with known shape → exponential-family transform. Avoid both in exponential-family drills. (Lesson 5's challenge uses a different negative binomial parametrisation and question type.)
- Topic 2 coverage gaps in past papers (checked 14 Oct): no paper has IWLS, a gamma GLM in R output, or GLM diagnostics. The 2018 paper had a Poisson offset (rate) model.
- No past paper tests things she taught this year: MCMC diagnostics (trace plots, burn-in, autocorrelation), GLM diagnostics (residuals, leverage), and the QMD examples. Treat these as possible new material and cover them from tutes and QMDs.

## Topic 3 exam patterns (overdispersion / quasi-likelihood; patterns only, mined 19 Oct)
- Appears in every paper 2016–2022 inside the Poisson/binomial R-output question (4–22 marks). Skeleton: Poisson fit(s) → `(phi <- sum(residuals(m, type="pearson")^2/m$df.residual))` printed → same models refit `family=quasipoisson` → `anova(small, big, test="F")`.
- Recurring sub-parts: (1) "give one/two *quantitative* reasons the model may suffer overdispersion" (resid. dev ≫ df, φ̂ ≫ 1, deviance GOF p-value); (2) "difference between Poisson and quasi-Poisson in 2–3 sentences" (Var = μ vs φμ, same β̂, SEs ×√φ̂, F not χ², no likelihood so AIC NA); (3) SE allowing for overdispersion = Poisson SE × √φ̂, φ̂ printed for the right model; reverse direction too (quasi output given → Poisson SE = quasi SE ÷ √φ̂; estimate unchanged); (4) F = (ΔD/s)/φ̂ with φ̂ from the BIG model, df (s, n−p_big); sometimes the F row is hidden and must be computed, sometimes shown and must be explained; (5) which model to prefer allowing for overdispersion (F p-value vs χ² p-value disagree: χ² says keep term, F says drop); (6) consequences of ignoring overdispersion (estimates fine, SEs/p-values too small → spurious significant predictors; 4-mark stand-alone Q in 2021); (7) Poisson ℓ̂ from AIC and saturated ℓ alongside.
- Trap: two φ̂ values printed (one per model) → pick the larger model's. Rate models with offset also used.
- Rarer: "could you fit a model with [non-standard] responses using quasi-likelihood? how?" (specify link + variance function from mean/var, fit by IWLS, φ̂ from Pearson); "how would you change a Bayesian model for overdispersion?" (random effect / negative binomial). Outlier removal as an alternative cause of large deviance.
- Lecture learning goals also list: define quasi log-likelihood Q_i = ∫_y^μ (y−t)/(φv(t)) dt, compute Q, scaled quasideviance and quasideviance; quasi-binomial. Not yet seen in past papers → cover as "possible new" items.
- Past datasets to avoid: as above + troutegg is the lecture demo (fine to show, but practise on other data).

## Plan
Conventions: `BinReg_1` PDF page = slide number (slide 41 = LR confidence region). In R output, convert ordered factors (e.g. `esoph`) to unordered ones to avoid the off-syllabus .L/.Q contrasts.

1. 0001 MLE → Fisher information → asymptotic normal (the guaranteed Q1, and the machinery of Binomial Regression I) ← drafted 12 Oct
2. 0002 Binomial regression: logit/probit/cloglog, likelihood, predicting p and a Wald CI via the linear predictor η ← drafted 12 Oct (assets/linkcurve.js widget)
3. 0003 Deviance, LRT, AIC and reading `glm` output ← drafted 12 Oct (`pre.rout` style for R output). Topic 1 (binomial regression) complete
4. 0004 Topic 1 mixed review (interleaved retrieval, week 3 tute as homework) ← built 14 Oct
5. Topic 2 (exponential families & GLMs, lectures Exponential_families, GLM_intro, GLM_1, GLM_2; tutes wk 3–5) ← built 14 Oct, one subagent per lesson:
   0005 exponential families (form, b'/b'', v(μ), canonical link) · 0006 GLM likelihood + IWLS · 0007 Poisson & gamma GLMs in R output (offsets, φ̂ from Pearson, F test) · 0008 GLM diagnostics (residuals, leverage, Cook's) · 0009 Topic 2 mixed review · reference/glm-cheatsheet.html
   Week 5 tute Q2 (rate model) uses Purott & Reeder = `dicentric`, a past-exam dataset: don't assign it.
6. Topic 3 (overdispersion & quasi-likelihood; lecture Overdispersion_Quasilikelihood, troutegg notes, Faraway §7.4, tute wk 6 Q1) ← built 19 Oct, one subagent per lesson:
   0010 overdispersion: what, why, detect, consequences · 0011 quasi-likelihood theory (score, Q, quasideviance) · 0012 quasi-Poisson/binomial R output (SE ×√φ̂, F test) · 0013 Topic 3 mixed review · reference/quasi-cheatsheet.html
   Tute wk 6 Q1 uses `dicentric` (past-exam dataset): don't assign.
then EM → Bayesian/MCMC → VI
   **Before building the EM/Bayes/MCMC/VI lessons, first build a prereq-refresher lesson** (user request, 19 Oct). Cover: recognising kernels (Normal, Gamma, Beta, Poisson; integrating via normalising constants), completing the square, joint/marginal/conditional distributions, Bayes' rule (for EM responsibilities and posteriors), and iterated expectation/variance. These topics need the most background. Also **conjugate priors** (lecturer flagged it): prior × likelihood → recognisable posterior. User's MAST20005 table covers Beta–Bernoulli/Binomial, Beta–Geometric, Gamma–Poisson and Gamma–Exponential. MAS mostly needs Normal–Normal (mean, known precision) and Gamma–Normal (precision τ, known mean: Gamma(a+n/2, b+Σ(xᵢ−μ)²/2)), as in VI-2.pdf and the Gibbs past-paper Qs. Teach the derivation (drop constants, match the kernel) as well as the table.
