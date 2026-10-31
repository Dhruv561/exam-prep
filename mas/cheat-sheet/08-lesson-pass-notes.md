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

These lines are now on page 3 of the PDF, from `sheet-p3-cuts.tex`, under the same red topics. The cuts come to about one column. Pages 1 and 2 are unchanged. Page 3 is a holding page: exam notes are one A4 sheet, double-sided, so print pages 1 and 2 only. To drop page 3, delete the marked lines at the end of `mas-cheat-sheet.tex`.

- First-year CI table (kept the rule, the correct wording and the link to tests). Hypothesis test and estimator boxes shortened.
- MH "why it works" line, which is Markov theory and out of scope.
- Worked derivations for Gibbs $\mu$, CAVI $\tau$ and MH.
- ELBO formulas for Normal-Gamma and the bivariate case.
- Conjugate exponential family line, bivariate prior CAVI line, discrete $\mu\in\{0,1\}$ line (the finite-support rule still covers it).
- Probit information, Poisson deviance derivation.
- Bivariate Normal pdf (kept the conditional), several $\chi^2$ cutoffs, some R lines repeated elsewhere.
- Rejection "why it works" sentence (kept the output pdf derivation).

## Horizontal version

`mas-cheat-sheet-horizontal.pdf` is a separate 2-page A4 landscape sheet holding everything from all three portrait pages, in 6 columns. Build it from `mas-cheat-sheet-horizontal.tex`, `horizontal-side1.tex` and `horizontal-side2.tex`. Portrait files are unchanged.

- Side 1: Prerequisites, Likelihood, GLMs, Overdispersion, R Output. Side 2: Probability Toolkit (moved out of Prerequisites), EM, Bayes, Simulation, MCMC, VI, Exam Checks.
- Landscape adds no paper, so the fit comes from smaller text: 5.1pt body and 5.6pt leading. About 25pt is free at the bottom of side 2.
- The MLE, IWLS and conjugate tables are split where a column ends, to avoid holes. Moving text can leave a hole at a split, so recheck after edits.
- The logit information matrix is written as its entries, with the same information.

Completeness audit: 1,546 items across all three pages, none missing. Correctness audit: about 1,950 items, 282 scripted formula checks and 6 R scripts.

One error fixed: the same-mean cutoff read $|x|>c$, which holds only for mean 0; it is now $|x-\mu|>c$. Also tightened: $AIC_B-AIC_A$ with $\phi$, the fitted-count checks for `cbind` binomial, the `colSums` bug gloss, "se far off" when covariances are dropped, the undefined $\tau^2$ in the cluster formula, 0/1 $D$ as logit only, the `rstudent` gloss, $n$ from null df needing an intercept, `drop1` with interactions, $\bar X\approx$ Normal, the two ESS targets, and $D_B/(n-p_B)$ as approximate.

These fixes are in the horizontal files only. The portrait sheet still has the old wording.

Left as they are: "`step`/`drop1` do not work" on quasi fits is the course wording, though R's `drop1` does run. No source was found for the two marks claims ("Marks:", "A correct unfinished ledger still scores"). The $H_{ii}>2p/n$ and Cook near 1 rules are not in the slides.

## Checked

44 numeric checks passed on the new formulas: proposal ratios, $P_{i1}$ forms, cutoffs, mixture moments, Cook and jack-knife forms, $x_0^TVx_0$, IWLS weights, NegBin and geometric $b$, ESS relations, Gibbs lag-1 $=\rho^2$. They were run in a throwaway script, so rerun them if the formulas change.
