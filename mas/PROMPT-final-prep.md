You are coordinating final exam prep for MAST30027 Modern Applied Statistics (exam 10 Nov 2026) in the workspace `/Users/dhruv/Documents/Dev/exam-prep/mas`. Run three subagents **one after another** (each depends on the previous one). Your own job is to brief them, check what they produce, and report back to me.

## Context every subagent must read first
- `MISSION.md`, `NOTES.md` (all of it, especially "Official 2026 exam logistics", the exam-pattern sections and the Topic 1–5 plan notes), `RESOURCES.md`
- `exams/official exams/formulas provided in the exam.pdf` (the formula sheet given in the exam: leave its contents off the cheat sheet) and `MAST30027_26_SM2_Coversheet.pdf`
- All lessons `lessons/0001`–`0028` and all of `reference/*.html` (the cheat sheets: likelihood, glm, quasi, em, bayes, kernels-conjugacy, probability-toolkit, glossary)
- Lecture slides in `lectures/`, `annotated-slides/`, `extra-notes/` (read PDFs with `pdftotext -layout`)
- Hard rules: past exams in `exams/` are **patterns only**. Never copy or lightly reword a past question, and never reuse its model and numbers. The exam is on paper with a Casio FX-82 and answers to 2 dp. R is read and interpreted, never written. Markov chain theory is out of scope.

## LaTeX toolchain (do this first)
No LaTeX engine is installed (checked 25 Oct). Ask me before installing anything. Suggested: `brew install tectonic`, which pulls packages on demand; MacTeX also works. Every PDF is built from a `.tex` source **in LaTeX only, no HTML-to-PDF**. Compile until there are zero errors and no `Overfull \hbox` warnings that cut off content. Then convert each page to PNG (`pdftoppm -r 80 -png`), look at every page yourself, and fix anything clipped, overlapping or unreadable. All three outputs are **A4 portrait (vertical), never landscape**. Put sources and PDFs in `final/` (create it).

## Subagent 1: cheat sheet (model: Opus 5.5)
Build `final/cheatsheet.tex` → `final/cheatsheet.pdf`: **exactly 2 A4 portrait pages** (one double-sided sheet, which is the exam's notes allowance). It must be fully comprehensive and highly organised:
- Layout: `geometry` with small margins (~8 mm), 3 columns via `multicol`, small font (~6.5–7pt via `\fontsize`) that is still readable when printed. Boxed sections (`tcolorbox`, or `mdframed` if lighter) colour-coded by topic, with dense tables (`tabularx`) and math via `amsmath`.
- Content by topic, ordered as the exam runs (MLE → binomial/GLM R output → exponential family → overdispersion/quasi → EM → Bayes/MC/MCMC/VI):
  - **Recipes**: the step list for each standard question (MLE + Fisher info + asymptotic distribution; exponential-family form → θ, φ, b, a, c, canonical link, v(μ); EM Q-function → M-step incl. twists; Gibbs conditional; MH α ledger with proposal ratio; CAVI q*; rejection-sampler M).
  - **Complete answers**: key results written out in full (conjugate updates, M-step formulas, q* updates, deviance/AIC/F formulas, SE ×√φ̂, Wald CI on η then transform).
  - **Interpretation templates**: 1–2 sentence model answers for the recurring "explain" parts (overdispersion consequences, Poisson vs quasi-Poisson, which model to prefer, vague vs informative prior, burn-in, convergence checks informal + formal, VI vs MCMC, why EM increases ℓ).
  - **R output decoder**: where each number sits in `summary(glm)`, `anova(..., test="Chisq"/"F")`, `drop1`, `predict(type="link"/"response", se.fit=TRUE)`, AIC → ℓ̂. Function-argument traps: `rnorm` takes sd, `rgamma(shape, rate)`, `dnorm(log=TRUE)`, `runif(1) < ratio`. Also how to read the lecturer's EM/MH/Gibbs code.
  - **"What to look for where"**: a lookup table from question cue → what to compute → where in the output it comes from.
  - **Traps list** and the **distribution facts not on the formula sheet** (Binomial, Beta, variances incl. Gamma, Neg-Bin, Multinomial/Dirichlet if used).
- Verify every formula against the lessons and slides. Check any numeric example in R.
- Report: page count (must be 2), anything that got cut for space, anything it couldn't verify.

## Subagent 2: full mock exam (model: Sonnet 5.5)
Build `final/mock-exam.tex` → `final/mock-exam.pdf`, A4 portrait, laid out like the real 2026 paper:
- Cover info (3 h writing + 15 min reading, **9 questions, 78 marks**, FX-82, 2 dp, one A4 double-sided sheet). A distribution page in the same style as the formula sheet (Normal(mean, var), Exponential(rate), Gamma(shape, rate), Inverse-Gamma(shape, scale), Poisson, Categorical).
- Topic mix and marks follow the patterns in NOTES.md:
  - Q1: MLE / Fisher information / asymptotic distribution
  - exponential family
  - binomial GLM R output
  - Poisson vs quasi-Poisson R output with φ̂ and an F test
  - GLM diagnostics or IWLS
  - EM for a mixture with a twist
  - a 17-mark-style Bayes question: Gibbs conditional + numeric MH α + CAVI q*
  - MC / rejection sampling + MCMC diagnostics
  - plus explain parts throughout
- Lettered parts with marks shown, and wording in the past-paper style ("Derive…", "If it is a known distribution, identify the distribution name and its parameters", "Show your work").
- All questions new: fresh models, data and numbers that are not in lessons 1–28 or past papers. Any R output must be real output generated with R (`Rscript`), typeset with `verbatim` or `listings`. Data sets must avoid the past-exam ones (pima, gala, dicentric, ships, dvisits, wavesolder).
- Every numeric answer must be FX-82-doable. Keep a private answer key (numbers only) in `final/mock-exam-key.md`, with every value computed in R.
- Questions only, no solutions in this PDF. Leave answer space after each part.
- Report: the marks table per question and topic, and anything unverified.

## Subagent 3: full worked solutions (model: Sonnet 5.5)
Only after Subagent 2 finishes. Build `final/mock-solutions.tex` → `final/mock-solutions.pdf`, A4 portrait:
- Re-derive every answer independently. Recompute in R, cross-check against `mock-exam-key.md`, and report any disagreement to me instead of quietly choosing one.
- **Every working step on its own line**: `align*`, one `=`/`\propto` per line, a short reason on the right via `\quad\text{(…)}`. Never chain working inside a paragraph.
- Show FX-82 arithmetic and round final answers to 2 dp, each in a `\boxed{}`.
- Mark-scheme layout per part: working → boxed answer → "Marks:" line saying what earns each mark → "Common errors" line. Explain parts get a model 2–3 sentence answer.
- Report: any errata found in the exam.

## Finally (you)
Open all three PDFs (`open final/*.pdf`). Add a short line to NOTES.md listing what was built and anything unverified. Summarise for me: page counts, the marks table, and the unverified items. Don't commit unless I ask. Formatting preference: be concise.
