# Lesson pass notes

Pass through all 28 lessons in `mas/lessons/`, to add shortcut formulas, an R output guide and red topic borders.

## Layout

- 11 red topics: Prerequisites, Likelihood & Binomial Regression, GLMs, Overdispersion & Quasi-Likelihood, Reading R Output, Mixtures & EM, Bayes, Simulation, MCMC, Variational Inference, Exam Checks.
- Column rules and the page frame are red. Each topic opens with a red bar, which also closes the topic above. Thin black rules separate boxes inside a topic.
- Body text went from 5.85pt to 5.35pt. Line spacing went from 6.58pt to 5.9pt. Formulas may now break across lines.
- The free block at the bottom of page 2 is gone: all columns are full. Boxes were reordered so each sits under its topic.

## Added

- **Reading R Output (new topic):** `summary(glm)` line by line, recovering hidden numbers, both forms of `anova`, `drop1`, `step`, a table of which test goes with which family, and every degrees-of-freedom case.
- **Likelihood and binomial:** redo $I$ after a reparametrisation, Wald null not 0, LR region test, $x_0^TVx_0$ with two predictors, OR between two levels, case-control, links, sparse data.
- **GLMs:** $y=0$ deviance terms, nested numeric vs factor, geometric, NegBin, proportion and mean-of-$k$ forms, one IWLS step by hand, other weights, canonical link facts, offset check, intercept-only, turning point, leverage by hand, classify outlier, leverage, influence.
- **Overdispersion:** where it comes from, converting $z$, $t$, $\Delta D$, other $v$, why Pearson, predictions.
- **EM:** fast $P_{i1}$ forms, $\pm\mu$ shortcut, zero-inflated, mixture moments, cutoffs, choosing $K$, more R bugs, classification table.
- **Bayes and simulation:** shrinkage weight, $\sigma^2$ vs $1/\tau$ trap, improper prior results, BUGS precision, predictive shortcuts, $N$ for a target s.e., $k$ too small.
- **MCMC and VI:** MH ledger, closed-form proposal ratios, symmetry test, more Gibbs conditionals, using draws, ESS relations, two-source CAVI.

## Cut to fit two pages

Cut lines are lower value than what replaced them, but they are gone from the sheet. Ask to restore any of them.

- First-year CI table (kept the rule, the correct wording and the link to tests). Hypothesis test and estimator boxes shortened.
- MH "why it works" line, which is Markov theory and out of scope.
- Worked derivations for Gibbs $\mu$, CAVI $\tau$ and MH.
- ELBO formulas for Normal-Gamma and the bivariate case.
- Conjugate exponential family line, bivariate prior CAVI line, discrete $\mu\in\{0,1\}$ line (the finite-support rule still covers it).
- Probit information, Poisson deviance derivation.
- Bivariate Normal pdf (kept the conditional), several $\chi^2$ cutoffs, some R lines repeated elsewhere.
- Rejection "why it works" sentence (kept the output pdf derivation).

## Checked

44 numeric checks passed on the new formulas: proposal ratios, $P_{i1}$ forms, cutoffs, mixture moments, Cook and jack-knife forms, $x_0^TVx_0$, IWLS weights, NegBin and geometric $b$, ESS relations, Gibbs lag-1 $=\rho^2$. They were run in a throwaway script, so rerun them if the formulas change.
