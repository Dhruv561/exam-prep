# MAS cheat sheet: independent verification report

Checked `sheet-p1.tex`, `sheet-p2.tex` and `mas-cheat-sheet.pdf`. No `.tex` or PDF edited. Rejected cheatsheets not opened.

Scripts and output: `/private/tmp/claude-501/-Users-dhruv-Documents-Dev-exam-prep/00804144-49bb-405e-873e-5b42650f6af8/scratchpad/verify/` (`v1_dist.R`, `v2_glm.R`, `v3_ef_em.R`, `v4_bayes.R`, `v5_vi_r.R`, `v6_add.R`). All numbers below come from simulated data, not past papers. No past-paper answers appear here.

| Section | Count |
|---|---|
| 1 WRONG | 3 |
| 2 MISMATCH WITH COURSE | 7 |
| 3 MISLEADING OR RISKY | 20 |
| 4 MISSING | 20 |
| 5 CUTTABLE | 14 |

Bottom line: the maths is very clean. Every MLE row, conjugate row, Gibbs conditional, EM M-step, CAVI update and exponential-family form passed. The real risks are R-output behaviour (sections 1 and 3) and gaps in recurring exam shapes (section 4, items 1 to 6).

---

## 1. WRONG

**W1. p1, col 3, "From R output".** Text: $p=n-df$, $\hat l=p-AIC/2$.

- False when $\phi$ is estimated (Gamma, Inverse Gaussian, Normal). R's AIC counts $\phi$ as a parameter.
- Correction: $\hat l=(p+1)-AIC/2$ for those families. Keep $p$ for Poisson and binomial. The sheet's "($\phi=1$ ...)" sits after $l_S$, so it does not clearly cover $\hat l$.
- Evidence: simulated Gamma fit with $p=2$ gave $p-AIC/2=-86.14$, $(p+1)-AIC/2=-85.14$, `logLik` $=-85.14$ with `df=3`. Normal fit behaved the same. Lesson 7, section 4 trap and its Poisson vs gamma table.

**W2. p1, col 3, "Nested".** Text: $D^A-D^B=-2[l_A-l_B]$.

- False unless $\phi=1$. The sheet defines $D^A$ as unscaled two boxes earlier.
- Correction: $(D^A-D^B)/\phi=-2[l_A-l_B]$.
- Evidence: direct from the sheet's own $D^A/\phi=2(l_S-l_A)$; GLMs II slides 3, 8, 9.

**W3. p1, col 4, Codes PT1.** Text: `predict(m,newdata=list(x=1),type="response")`: $\hat\mu$.

- False for a `cbind` binomial fit. R returns $\hat p$, but the sheet's $\hat\mu$ is the count mean $m\hat p$ (see its $d_i$, $z_i$ and "Fitted mean").
- Same trap: `fitted(m)` gives $\hat p$; `residuals(m,type="response")` gives $y_i/m_i-\hat p_i$, not $y_i-\hat\mu_i$.
- Correction: "$\hat\mu$ (binomial: $\hat p$, multiply by $m$)".
- Evidence: `v2_glm.R` printed $\hat p$ with $m=10$ in `newdata`, and residual equal to $y/m-\hat p$. Lesson 8 Q3; Lesson 12 section 6.

---

## 2. MISMATCH WITH COURSE

**M1. p2, col 6, rejection.** Text: Gamma$(\lambda,m)$. This copies slide 26's $\Gamma(\lambda,m)$, which is rate first. The formula sheet and the rest of your sheet are shape first. Write "Gamma(shape $m$, rate $\lambda$)". Formulas themselves are right (slides 26 to 28, numerically confirmed).

**M2. p1, col 4, quasi $F$.** Text: "`step`/`drop1` do not work". Matches slide 12, so keep it for exam answers. But in R only `step` errors. `drop1(quasi_fit,test="F")` runs, and uses $D/(n-p)$ rather than Pearson $\hat\phi$. Lesson 12 section 7.

**M3. p1, col 4, Jack-knife vs `rstudent`.** Slide 18's formula equals `rstudent` exactly only for $\phi=1$. For estimated $\phi$, R uses a leave-one-out $\hat\phi$ (Gamma test differed by up to $0.07$). Say: "`rstudent` (exact match if $\phi=1$)".

**M4. p1, col 4, quasi CI.** Text: $\hat\beta\pm t_{n-p}(.975)\,\mathrm{se}_Q$. Defensible, but Lesson 12 section 4 uses $1.96$ and accepts $t$. Your sheet only holds $t_{60}$ and the FX-82 has no $t$. Add "($1.96$ fine if no $t$ given)".

**M5. p1, col 3, Inverse Gaussian.** $g=-\frac1{2\mu^2}$ is right, but unlike Gamma there is no R note. R's `inverse.gaussian()` default link is $1/\mu^2$ (Lesson 5).

**M6. p1, col 3, binomial $v$.** Course count scale $v(\mu)=\mu(1-\mu/m)$ is right. R's `binomial()$variance` is $\mu(1-\mu)$ (Lesson 5 Q10). Worth a clause alongside W3.

**M7. p1, col 3, AIC identity.** $AIC_B-AIC_A=2s-(D_A-D_B)/\phi$ is slide 10, and exact for Poisson (checked). For Gamma it only roughly matches R, because R evaluates $\hat l$ at $\phi=D/n$ (Lesson 7 trap).

---

## 3. MISLEADING OR RISKY

Top five first. These can cost marks.

1. **p2, col 7, MH multi-part proposals.** Text: $q(c,n)=g(\tau_n|\tau_c)h(\mu_n|\tau_n)$, $q(n,c)=g(\tau_c|\tau_n)h(\mu_c|\tau_c)$. It hides that $h$ is usually also centred on the old $\mu$. Write $h(\mu_n|\mu_c,\tau_n)$ and $h(\mu_c|\mu_n,\tau_c)$. Recent papers centre the $\mu$ proposal on $\mu_c$. This is a recurring 5 to 6 mark part.
2. **p1, col 4.** Text: `drop1(m,scale=phi,test="F")`. Sits beside the dispersion-scaling lines, so reads as a Pearson-scaled quasi $F$. It is not. `scale` does not enter the printed $F$: it equals $\frac{(D_A-D_B)/s}{D_B/(n-p)}$. Checked twice (quasi-$F$ $1.142$ vs `drop1` $1.106$). The 2014 printout follows this same deviance-based formula, not Pearson. Add "$F$ here uses $D/(n-p)$, not Pearson".
3. **p1, col 4.** Text: `anova(A,B,dispersion=phi,test="F")` on binomial fits $=$ quasi $F$. The statistic matches; the printed p-value does not, because R uses $F_{s,\infty}$. Checked: Poisson $0.0416$ vs $0.0488$; binomial $0.2852$ vs $0.2947$. Add "same $F$, p uses df$_2=\infty$".
4. **p1, col 4.** Text: `test="F"` adds F. True for quasi or Gamma fits. On plain Poisson or binomial fits $F=\Delta D/s$ with $\phi=1$, which ignores overdispersion (Lesson 12 Q11; checked $F=2.2054=\Delta D$). Add "quasi fits only".
5. **p2, col 7, log form.** Text: `A<-min(1,exp(lp(new)-lp(cur)))`. Placed inside the asymmetric recipe, but it omits $q$ terms, so it is the symmetric case only. Add "+ log $q$ ratio if asymmetric".
6. **p1, col 4.** Text: `step(m)`: drop the term with AIC below `<none>`. Should be "drop the term with the lowest AIC, if below `<none>`". Several rows can be below.
7. **p2, col 6.** Text: $N\sim$ Geom$(1/k)$, $\E N=k$. Normalised $f$ only. With $f^*$: $\E N=k/\int f^*$ (Lesson 23 trap).
8. **p2, col 5.** Text: "Keep $\log x_i!$ if $Q$ itself is evaluated." Also needed for any reported incomplete log-lik value. Only dropping it when comparing runs is safe. Lesson 16 section 6.
9. **p1, col 4, Interpretation.** Text: "a cell uses $\exp$(sum of main effects + interaction)". That is the ratio to the baseline cell. A cell mean also needs the intercept.
10. **p2, col 5.** Text: "three terms below the line". Vague. Write "three terms in the denominator".
11. **p2, col 5.** Text: "Overlap makes $P_{ik}$ less decisive and starts matter more." "Starts matter more" is not in the course. Better: "overlap: flat likelihood, EM slow, may hit `max.iter`" (Lesson 20 section 5).
12. **p1, col 4.** Text: "overdispersion usually remains" and "Keep unless a recording error". Rules of thumb stated as fact. Prefix "typically".
13. **p1, col 4.** Text: "Consistent with MLE-like asymptotics". "Consistent" reads two ways. Write "$\hat\beta$ consistent, asymptotically Normal, like MLE".
14. **p1, col 4.** Text: "$H_{ii}$ measures potential influence (unusual $x$)". In a GLM it also depends on the IWLS weight, so a far-out $x$ with tiny weight has low leverage (Lesson 8 Q6).
15. **p2, col 8.** Text: "so $q$ hugs the mode and avoids tails". Over-claim. Slides say only that VI generally underestimates variance. Write "$q$ sits inside $p$".
16. **p2, col 6, predictive.** Text: $t(\nu=2a^*,a=\mu_0,b=b^*/a^*)$. Reuses $a,b$ right next to $a^*,b^*$. Write "location $\mu_0$, scale$^2$ $b^*/a^*$", and state it needs $\mu=\mu_0$ known.
17. **p1, col 1.** InvGamma variance needs $a>2$; Gamma $\E[1/X]$ needs $a>1$. Neither condition is stated.
18. **p1, col 1, CI table.** Header says $100(1-\alpha)\%$ but the $\sigma^2$ row hard-codes $c_{.975},c_{.025}$. The two-sample row assumes equal variances and $s_p$ is undefined.
19. **p1, col 3.** Text: $p=n-df$. Say residual df, and add $n=$ null df $+1$. With an offset, `newdata` must include `t`.
20. **Rendering.** Second derivatives are typed with the curly quote U+201D, so $l''$, $b''$, $f''$, $Q''$ print as `l”`, `b”`, `f”`, `Q”`. Legible at 400 dpi, but at 5.95pt it sits close to a single prime. Use `''`. 9 occurrences (8 on p1, 1 on p2).

---

## 4. MISSING

Ranked by likely exam value. Each suggested formula checked in `v6_add.R` or by derivation.

**1. One $\mu$ shared by two data sources** (Lesson 25 section 3; the sheet's "Two samples" row has separate means only). For $x_i\sim\Nor(\mu,1/\tau)$, $y_j\sim\Nor(c\mu,1/(d\tau))$:
$$A=\kappa+(n+c^2dm)\tau,\quad B=\kappa\mu_0+\tau\Big(\sum x_i+cd\sum y_j\Big)$$
$$\tau|\cdot\sim\Ga\Big(a+\tfrac{n+m}2,\ b+\tfrac12\Big[\sum(x_i-\mu)^2+d\sum(y_j-c\mu)^2\Big]\Big)$$

**2. CAVI with independent priors** (the sheet gives only the joint prior; Lesson 27 section 7). Prior $\mu\sim\Nor(m,1/\kappa)$, $\tau\sim\Ga(a,b)$:
$$q_\mu^*=\Nor\Big(\frac{\kappa m+n\bar x\,\E\tau}{\kappa+n\E\tau},\frac1{\kappa+n\E\tau}\Big),\quad q_\tau^*=\Ga\Big(a+\tfrac n2,\ b+\tfrac12\Big[\sum(x_i-\E\mu)^2+nV\mu\Big]\Big)$$
Shape is $a+\frac n2$, not $a+\frac{n+1}2$. Here $m^*$ changes every round. For $\sigma^2$ use $\E[1/\sigma^2]$, not $1/\E\sigma^2$.

**3. Exponential-family failure tests.** The box never mentions them, yet Lesson 5 says markers look for them. Add: "Support must not depend on $\theta$. Parameter must multiply $y$ itself, not $y^2$, $\log y$ or $e^y$. State all of $\theta,\phi,a(\phi),b(\theta),c(y,\phi)$."

**4. Sum-of-squares split**, for numeric MH, Gibbs and CAVI from summaries:
$$\sum(x_i-c)^2=\sum(x_i-\bar x)^2+n(\bar x-c)^2$$

**5. Monte Carlo standard errors.** iid: $s/\sqrt N$; proportion: $\sqrt{\hat p(1-\hat p)/N}$; chain: $s/\sqrt{\mathrm{ESS}}$. Posterior sd does not shrink with $N$; MC s.e. does. The sheet's "Accuracy" line has the variance only.

**6. Numeric quasi-likelihood.** Stated learning goal, not yet examined (Lesson 13 flags it as the likeliest surprise). $Q_i\le0$. Use definite integrals, not the slide 10 form:

- $v=\mu$: $\phi Q_i=y\log\frac\mu y-(\mu-y)$
- $v=\mu(m-\mu)/m$: $\phi Q_i=y\log\frac\mu y+(m-y)\log\frac{m-\mu}{m-y}$
- $v=\mu^2$: $\phi Q_i=1-\frac y\mu+\log\frac y\mu$
- $v=\mu^3$: $\phi Q_i=-\frac{(y-\mu)^2}{2y\mu^2}$
- Then $D_Q=-2\sum\phi Q_i$ and scaled $=D_Q/\hat\phi$.

**7. MH extras.** Log-scale walk: extra factor $\tau^*/\tau^c$. Independence sampler: $A=\min\{1,w(\theta')/w(\theta)\}$ with $w=\pi/q$.

**8. Hierarchical conditionals** (the sheet's "Hierarchical" line is a model only; Lesson 28 Part B):
$$\theta_j|\cdot\sim\Nor\Big(\frac{n_j\tau\bar y_j+\tau_\theta\mu}{n_j\tau+\tau_\theta},\frac1{n_j\tau+\tau_\theta}\Big),\quad\mu|\cdot\sim\Nor\Big(\frac{\kappa m+\tau_\theta\sum\theta_j}{\kappa+J\tau_\theta},\frac1{\kappa+J\tau_\theta}\Big)$$
$$\tau_\theta|\cdot\sim\Ga\Big(a+\tfrac J2,\ b+\tfrac12\sum(\theta_j-\mu)^2\Big)$$
No $y$ in the $\mu$ conditional.

**9. EM general rule and worked twists.** Rule: "the terms involving $\theta_j$ are ..." across every component and block (Lesson 19).

- Contaminated $\Nor(\mu,\sigma^2),\Nor(\mu,9\sigma^2)$: $w_i=P_{i1}+P_{i2}/9$, $\hat\mu=\sum w_ix_i/\sum w_i$, $\hat\sigma^2=\sum w_i(x_i-\hat\mu)^2/n$.
- Exp$(\lambda)$, Exp$(2\lambda)$: $\hat\lambda=n/\sum(P_{i1}+2P_{i2})x_i$.
- Exposure $t_i$: $\hat\lambda_k=\sum P_{ik}x_i/\sum P_{ik}t_i$.
- Zero-inflated: $x=0$ gives $P_{i1}=\pi^0/(\pi^0+(1-\pi^0)e^{-\lambda^0})$, and $\hat\lambda=\sum x_i/(n-\sum P_{i1})$.

**10. R reading gaps.** `vcov(m)` $=V$ (quasi already includes $\hat\phi$); `rstandard(m)` $=r_{SD}$; `rstandard(m,type="pearson")` $=r_{SP}$; `hatvalues(m)`.

**11. EM trace reading.** `length(log_liks)` $=$ iterations $+1$; equal to `max.iter`$+1$ means the cap was hit; negative `delta.ll` stops the loop silently, so a bug can look "converged" (Lesson 20).

**12. Classification boundary.** Normal, equal $\sigma^2$, $\mu_1<\mu_2$: cluster 1 if $x<\frac{\mu_1+\mu_2}2+\frac{\sigma^2\log(\pi_1/\pi_2)}{\mu_2-\mu_1}$. Poisson, $\lambda_2>\lambda_1$: $x<\frac{\log(\pi_1/\pi_2)+\lambda_2-\lambda_1}{\log(\lambda_2/\lambda_1)}$.

**13. Factor and binary traps.** Test a factor by one LRT on $L-1$ df; individual $z$ values do not answer it. With $m_i=1$: $D$ says nothing and overdispersion is undetectable.

**14. Score equations.** $U_j=\sum\frac{(y_i-\mu_i)x_{ij}}{a(\phi)v(\mu_i)g'(\mu_i)}$. Canonical: $g'=1/v$, $W_{ii}=v$, $X^{\mathsf T}(y-\hat\mu)=0$, so $\sum\hat\mu_i=\sum y_i$.

**15. Improper-prior checks.** $p(\lambda)\propto1/\lambda$: Gamma$(\sum y_i,n)$, proper iff $\sum y_i>0$. $p(\mu)\propto1$, $p(\tau)\propto1/\tau$: $\tau|x\sim$ Gamma$(\frac{n-1}2,\frac S2)$ with $S=\sum(x_i-\bar x)^2$, proper iff $n\ge2$, $S>0$.

**16. By-hand diagnostics.** $h_{ii}=w_ix_i^{\mathsf T}Vx_i$ ($\phi=1$); Cook $=r_P^2h/[p\hat\phi(1-h)^2]$; $y=0$ gives $r_D=-\sqrt{2\hat\mu}$.

**17. Bivariate ELBO** (tute week 12), up to a constant, with $q_i=\Nor(m_i,s_i^2)$:
$$-\tfrac12\big[\Lambda_{11}(s_1^2+(m_1-\mu_1)^2)+\Lambda_{22}(s_2^2+(m_2-\mu_2)^2)+2\Lambda_{12}(m_1-\mu_1)(m_2-\mu_2)\big]+\tfrac12\log s_1^2+\tfrac12\log s_2^2$$

**18. Rejection with prior as proposal.** $k=\max_\theta p(x|\theta)$; accept if $U\le p(x|\theta)/p(x|\hat\theta)$.

**19. Bayes with exposure.** Poisson$(t_i\lambda)$ gives Gamma$(a+\sum y_i,\ b+\sum t_i)$.

**20. Low value.** Non-null Wald $(\hat\beta-b)/\mathrm{se}$ (R's $z$ tests 0 only). BUGS `dnorm(mean, precision)` (2014 only). Case-control logit shifts only the intercept (Faraway, not slides).

---

## 5. CUTTABLE

Rough line savings at sheet font. Enough to fund items 1 to 6 above.

| # | Item | Why | Saves |
|---|---|---|---|
| 1 | "Why it works (theory not examinable)" (p2 col 7) | Labelled not examinable; slide says so too | 4 |
| 2 | Hypothesis tests box (p1 col 1), keep one line | Grep of 2017 to 2022 official papers: no "Type I", "power", "pivot", "unbiased", "mean squared error", "prediction interval" | 3 |
| 3 | Estimators box (p1 col 1), keep $\bar X$, $S^2$ facts | Same grep | 2 |
| 4 | CI table rows $\mu_X-\mu_Y$, $\sigma^2$, PI, $p$ | Same grep; the CIs asked are GLM Wald type | 4 |
| 5 | "ELBO here" line (p2 col 8) and $\psi$ facts | Needs digamma, not on FX-82 | 2 |
| 6 | "Derivations to copy": CAVI $\tau$, CAVI $\mu$, Gibbs $\tau$ | Duplicate Normal-Gamma and Recipe boxes | 5 |
| 7 | "MCMC vs VI" box | Duplicates first VI line; merge one clause | 2 |
| 8 | "Hard subquestions": overdispersed, why $F$, Poisson vs quasi | Each repeated elsewhere on page 1 | 3 |
| 9 | Jensen proof (p2 col 5): keep the chain only | Lesson 17: 2 to 3 sentence explanation is the likely use | 3 |
| 10 | df table (p1 col 4) | Repeats the $F$ formula and df list | 3 |
| 11 | "Conjugate exp family" and "Spike prior" | Spike appears in 2011 and 2017 only; cut last, they are one-liners | 2 |
| 12 | Log-linear clause in Old-paper extras | Appears in 2013 and 2017 only | 1 |
| 13 | Bern row; Normal row of IWLS table | $m=1$ case; trivial | 2 |
| 14 | Second `interaction.plot` mention | Duplicate | 1 |

---

## 6. VERIFIED

### Numerically checked

- **Critical values:** all $z$, $\chi^2_{.95}$, $\chi^2_{.99}$, $\Phi(1)$, $\Phi(2)$, $t_{60}(.975)$.
- **Moments:** Geo (both), NB, Beta variance, InvGamma mean and variance, $\E[1/\sigma^2]$, Gamma variance, $\E[1/X]$, $\E\log X$, scale-form mean, reciprocal link.
- **Bivariate Normal:** density and conditional.
- **MLE and Fisher table:** all 11 rows. $\E[-l'']$ by simulation, MLE by numeric optimisation, and $\mathrm{Var}(\hat\theta)I\approx1$.
- **Exponential family:** Normal, Poisson, Binomial, Gamma, Exponential, Inverse Gaussian densities reproduced including $c(y,\phi)$; $b'$, $b''$ by finite difference. Weibull transform and inversion.
- **GLM fitting:** IWLS hand loop vs `glm` for Poisson, binomial, Gamma log; all $z$ and $W$ rows; probit and logit SE formulas.
- **Deviance and diagnostics:** $d_i$ for all four families; Pearson and deviance sums; $H$ formula, $\sum H_{ii}=p$; Cook vs `cooks.distance` (exact) and vs real refits (close); jack-knife vs `rstudent`; `rstandard`.
- **Quasi and AIC:** SE scaling, $F$ vs `anova`, AIC NA, `step` error, `drop1`, `summary(dispersion=)`, $\hat l$ and $l_S$ (Poisson, binomial, Gamma, Normal), AIC identity.
- **EM:** every M-step via numeric maximisation of $Q$, including shared $\sigma^2$, mean 0, tied means, known-label batch, observed labels, Poisson, binomial, exponential, $K=3$. Poisson $K=2$ responsibility, mixture variance, equal starts stuck, monotone log-lik, $Q+C=l$ at $\theta^0$.
- **Bayes:** every conjugate row by grid posterior; Normal mean both forms; marginal of $\bar X$; 3-parameter $t$ predictive; beta-binomial; Poisson-Gamma marginal and variance.
- **Gibbs:** all conditionals by grid, including two samples, bivariate prior $A,B$, change point, hidden count.
- **Simulation:** Gamma rejection constants, best $\mu$, acceptance $1/k$ and $\int f^*/k$, logistic inversion, `-log(runif(1))*m/lambda`, `while(runif(1)>p)`, loop pmf reading.
- **MH:** asymmetric multi-part ratio run as a chain; means agree with independent Gibbs.
- **MCMC:** ESS example, $\hat R$ function, blocking.
- **VI:** Normal-Gamma updates confirmed by numerically maximising the ELBO; ELBO pieces monotone and below exact $\log p(x)$; exact posterior values; InvGamma variant; bivariate $q^*$.
- **R behaviour:** `sample` normalises `prob`; `rgamma` third argument is rate; `dnorm` uses sd; `acf` vs `cor`; `duplicated` acceptance; `cumsum(x)/1:n`; `test="Chi"` partial match; `step` output.

### Derivation only

Probability toolkit identities, Jensen, delta method, Taylor, $2\times2$ inverse, $t$ and $F$ facts, CI formulas, logistic curve slope, exponential-family proof, Newton-Raphson and Fisher scoring forms, studentising, EM proof, rejection proof, ESS geometric sum, KL and ELBO identity, CAVI hand derivations, conjugate exp-family line.

### Compared to sources only

- Formula sheet parametrisations and "not on sheet" list: correct.
- Regularity conditions, Wald notation, Fisher $=$ whole sample, $a(\phi)=\phi$, $\hat R=B/W$, $<1.05$, ESS $>4000$, thinning, 5% MC rule, leverage note, half-normal, F test, quasi definitions, mean-field wording, rejection and Gamma slides, Weibull rate form (matches past papers).
- Rules not in slides but correctly marked as rules of thumb: $2p/n$.

### Not done

- `halfnorm` not run (`faraway` not installed). `optim`, `contour`, `interaction.plot` not run.
- 2010 to 2013 papers and `Problems_sheet` not reviewed. Faraway not read beyond lesson references.
- Tutes and extra notes skimmed, not read in full. Rendering checked on 2 crops, not the whole PDF.
- Coverage pass: all 28 lessons read in full. Slide learning goals checked for 12 decks.

---

## 7. RESOLUTION (applied after this report)

- **WRONG:** W1, W2, W3 all fixed in the sheet.
- **MISMATCH:** M1, M2 (via the `drop1` note), M3, M4, M5, M7 fixed. M6 not added; W3's `cbind` warning covers the practical trap.
- **MISLEADING:** items 1 to 10, 12 to 20 fixed. Item 11 kept in softer form because `extra-notes/EM-updated.qmd` does say overlap makes EM more sensitive to starting values.
- **MISSING:** items 1 to 12 and 14 to 15, 17 to 19 added. Item 13 added in part. Items 16 and 20 left out for space.
- **CUTS:** 1, 6, 10, 13, 14 taken in full or in part. Hypothesis-test, estimator and CI boxes were kept, because the student explicitly asked for prerequisites such as confidence intervals and hypothesis testing. Spike prior kept; it also appears in the 2021 special paper, which this report's cut table missed.
- **Re-check:** additions came from formulas this report already checked (`v6_add.R`) or were derived by hand. No second independent pass was run on the final wording.
