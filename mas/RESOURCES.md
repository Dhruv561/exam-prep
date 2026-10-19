# Modern Applied Statistics (MAST30027) Resources

## Knowledge

- Lecture slides: `lectures/*.pdf` and `annotated-slides/*.pdf` (UniMelb, Sem 2 2026)
  Defines the course's notation and scope, so it's the top authority. The annotated versions have the lecturer's handwritten working. Use for: definitions and the course's notation (e.g. I(θ) is the information of the whole sample).
- Extra notes: `extra-notes/` (e.g. `observed_information_binomial_regression-1.pdf`, `Challenger.pdf`, EM/GMM derivations, MH/Gibbs examples)
  Worked derivations at exam level. Use for: step-by-step derivation style.
- Tutorials: `tutes/2026_MAST30027_weekN_questions.qmd` + `_sol.html` (weeks 2–11)
  Official practice. Week 2 = binomial regression in R.
- Faraway, *Extending the Linear Model with R* (2nd ed., 2016): local PDF `books/Faraway (2016) Extending the linear model with R.pdf` ([book site](https://julianfaraway.github.io/faraway/ELM/))
  The course textbook behind the `faraway` datasets and the extra note on quasi-likelihood. **PDF page = printed page + 16** (link with `#page=`). Uses I(θ) for the whole sample, matching the course. Use for: Ch 2 (binary: §2.3 deviance/LRT/Wald and Hauck–Donner, §2.5 AIC, §2.6 fit), Ch 3 (grouped binomial, Pearson X², overdispersion, quasi-binomial), §4.2 links, Ch 5 (Poisson, dispersed Poisson, rate models, negative binomial), Ch 8 (GLM definition, IWLS fitting, tests, diagnostics), §9.4 quasi-likelihood, App. A (likelihood theory). Not covered: EM, Bayesian/MCMC, VI.
  Exercises are R data analyses and are fine to assign directly, **except those on datasets past exams use: pima (Ch2 Ex2), gala (worked example in §5.1), dicentric (§5.3), ships, dvisits, wavesolder (Ch5 exercises).** For Ch 5, warn the user that the worked examples themselves use exam datasets.
  Checked page refs (printed pages): §4.2 links and §4.3 prospective/retrospective sampling pp. 68–74 (logit p* = log(π₁/π₀) + logit p on p. 73); Ch2 Ex4 `nodal` (PDF p. 64); §5.3 rate models p. 89; §8.1 GLM definition pp. 151–154; §8.2 IWLS fitting pp. 154–156; §8.4 diagnostics pp. 159–167 (numbers from Bliss; plots from `gala`, so read for method only); Ch 8 exercises p. 171 (Ex 4–5 use gala, skip them); §9.1 gamma GLM pp. 175–180; §9.2 inverse Gaussian p. 181.
- `extra-notes/Bliss-1.pdf`: the lecturer's hand-coded IWLS loop on the Bliss data (lesson 6). The diagnostics in Faraway §8.4 use the same data.
- `annotated-slides/GLM 2 Deviance and diagnostics annotated.pdf`, pp. 30–43: the lecturer's handwritten intuition for leverage and studentising (lesson 8). Note that `extra-notes/Diagnostics_additional-1.pdf` is about MCMC output, not GLMs.
- Datasets used in lessons (all allowed): `orings`, `esoph`, `infert`, `nodal`, `discoveries`, `cornnit`, `MASS::Insurance` (Poisson rate model with `offset(log(Holders))`, lesson 7), `cns` (Faraway §7.4 p. 136; rate model with offset log(births), lesson 9), `trees`, `beetle`, `rats` (Ch 9 Ex 2, assigned in lesson 9). Topic 3: `MASS::quine` (lessons 10, 12), simulated quadrats/potholes/sedative/lead/wards/fire-brigade/frog-egg data, Crowder's Orobanche `oro` (12), `warpbreaks` (12 challenge), `MASS::epil` (13 challenge); homework `salmonella`, `africa`, `seeds`, `MASS::Traffic`, `leafblotch`.
- Topic 3 (overdispersion/quasi-likelihood): `lectures/Overdispersion_Quasilikelihood_LMS-1.pdf` (15 slides; PDF page = slide number), `annotated-slides/Overdispersion_Quasilikelihood_annotated.pdf`, `extra-notes/Trout egg survival_ overdispersion and quasilikelihood.pdf` (lecturer's QMD demo on `troutegg`: GOF test, residual check, φ̂, SE rescaling, F by hand, `anova(..., dispersion=phihat, test="F")`), `extra-notes/Faraway - Quasi-likelihood-1.pdf` (Faraway §7.4/9.4 excerpt, mammalsleep quasi-binomial). Tute wk 6 Q1 uses `dicentric` (past-exam dataset): skip.
- [MIT OCW 18.650 Statistics for Applications (Fall 2016), Lecture 3: Maximum Likelihood Estimation](https://ocw.mit.edu/courses/18-650-statistics-for-applications-fall-2016/resources/lecture-3-maximum-likelihood-estimation/)
  Rigorous but readable slides on MLE, Fisher information and asymptotic normality. Use for: a second explanation of Lesson 1.
- [CMU 36-700 lecture 12 (Balakrishnan): asymptotics of the MLE](https://www.stat.cmu.edu/~siva/teaching/700/lec12.pdf)
  Short notes covering asymptotic normality, observed vs expected information, and Wald intervals. Use for: why plugging in θ̂ is OK.

- Past exams: `exams/` and `exams/official exams/`. **Reserved for the user to sit timed: patterns only.**

## Wisdom (Communities)

- Ed Discussion (MAST30027, via Canvas)
  Classmates and tutors. Use for: "is this examinable?", format of the 2026 exam, checking derivations.
- Tutorials / consultation hours
  Use for: feedback on handwritten derivations.
- [Cross Validated (stats.stackexchange.com)](https://stats.stackexchange.com/)
  Moderated statistics Q&A. Use for: conceptual questions (observed vs Fisher information, overdispersion, EM intuition).

## Gaps
- Official worked solutions for 2021 and 2022 aren't in the folder (only 2017, 2018, 2020 scans), and studocu keys are unverified.
