# MAST30027 Cheat Sheet: All Content

Every line of the landscape sheet in one file, in sheet order, with the wording that was cut only to fit the page put back. Maths is LaTeX, `code` is R, bold marks lead-in terms, bold italics mark warnings.

## PREREQUISITES

### Distributions NOT on formula sheet

| Name | pmf / pdf | Mean; Variance |
| --- | --- | --- |
| Bin$(m,p)$ | $\binom mxp^x(1-p)^{m-x}$ | $mp$; $mp(1-p)$ |
| Geo $x{\ge}1$ | $p(1-p)^{x-1}$ | $1/p$; $(1{-}p)/p^2$ |
| Geo $x{\ge}0$ | $p(1-p)^x$ | $(1{-}p)/p$; $(1{-}p)/p^2$ |
| NB$(r,p)$ | $\binom{x+r-1}{x}p^r(1-p)^x$ | $r(1{-}p)/p$; $r(1{-}p)/p^2$ |
| Beta$(a,b)$ | $\frac{x^{a-1}(1-x)^{b-1}}{B(a,b)}$ | $\frac a{a+b}$; $\frac{ab}{(a+b)^2(a+b+1)}$ |

**Variances the sheet omits:** Exp(rate $\lambda$) $1/\lambda^2$; Gamma$(a,\text{rate }b)$ $a/b^2$; InvGamma$(a,b)$ $\frac{b^2}{(a-1)^2(a-2)}$ ($a>2$); Poisson $\lambda$.

**Gamma extras:** $\mathbb{E}[1/X]=b/(a-1)$ ($a>1$); $\mathbb{E}[\log X]=\psi(a)-\log b$, $\psi=\Gamma'/\Gamma$. ***Scale form:*** $x^{a-1}e^{-x/b}/(\Gamma(a)b^a)$ has mean $ab$. $\tau\sim\mathrm{Gamma}(a,b)\iff1/\tau\sim\mathrm{InvGamma}(a,b)$; if $\sigma^2\sim\mathrm{InvGamma}(a,b)$, $\mathbb{E}[1/\sigma^2]=a/b$.

**Bivariate Normal:** $f(x)=\frac{1}{2\pi|\Sigma|^{1/2}}\exp\{-\frac12(x-\mu)^{\mathsf T}\Sigma^{-1}(x-\mu)\}$. $X_1|X_2{=}x_2\sim\mathrm{N}(\mu_1+(x_2-\mu_2)\sigma_{12}/\sigma_2^2,\ \sigma_1^2-\sigma_{12}^2/\sigma_2^2)$.

**Facts:** $Z^2\sim\chi^2_1$; sum of $k$ indep. $Z^2\sim\chi^2_k$ (mean $k$, var $2k$); $Z/\sqrt{U/r}\sim t_r$; $(U/m)/(V/n)\sim F_{m,n}$; $t_\nu^2\sim F_{1,\nu}$. $\sum$ Pois is Pois; $\sum_1^n$Exp$(\lambda)$ is Gamma$(n,\lambda)$.

**Critical values:** $z$: 1.645 (90%), **1.96** (95%), 2.576 (99%). $\chi^2_{df}(.95)$: 1: **3.84**, 2: 5.99, 3: 7.81, 4: 9.49, 5: 11.07, 6: 12.59, 8: 15.51, 10: 18.31, 25: 37.65, 30: 43.77. $\chi^2_{df}(.99)$: 1: 6.63, 2: 9.21, 3: 11.34. $\Phi(1)=.84$, $\Phi(2)=.98$. $t_{60}(.975)=2.00$.

### Confidence intervals

estimate $\pm$ critical value $\times$ SE. **Pivot:** function of data and $\theta$ with fully known distribution.

| Want | 95% CI |
| --- | --- |
| $\mu$, $\sigma$ known | $\bar x\pm z\,\sigma/\sqrt n$ |
| $\mu$, $\sigma$ unk. | $\bar x\pm t_{n-1}\,s/\sqrt n$ |
| $\mu_X{-}\mu_Y$, equal var | $\bar x-\bar y\pm t_{n+m-2}\,s_p\sqrt{1/n+1/m}$ |
| $p$ | $\hat p\pm z\sqrt{\hat p(1-\hat p)/n}$ |
| $\sigma^2$ ($\chi^2_{n-1}$ $c$) | $[(n-1)s^2/c_{.975},\ (n-1)s^2/c_{.025}]$ |
| New $X^*$ (PI) | $\bar x\pm t_{n-1}\,s\sqrt{1+1/n}$ |

**Say:** “if we repeated this, 95% of such intervals would contain the true value”; ***not*** “95% chance $\theta$ is here” (that is a credible interval). CI excludes 0 (1 for a ratio) $\iff$ reject $H_0$ at 5%.

### Tests

$H_0$ no effect, $H_1$ effect. **Test statistic:** known distribution under $H_0$. Reject if statistic beyond the cutoff, or $p<\alpha$. **p-value:** P(this extreme or more $|\ H_0$), ***not*** P($H_0$ true). **Type I:** reject true $H_0$ ($\alpha$). **Type II:** keep false $H_0$ ($\beta$). **Power:** $1-\beta$. Write “reject” or “insufficient evidence”, ***never “accept”***. $\chi^2$, $F$ right-tailed. Statistical $\ne$ practical significance.

### Estimators

**Bias** $=\mathbb{E}\hat{\theta}-\theta$. **MSE** $=\mathrm{Var}\hat{\theta}+$ Bias$^2$. **Unbiased:** Bias 0. **Consistent:** $\hat{\theta}\to\theta$. **SE:** estimated sd of $\hat{\theta}$. **Precision:** 1/variance. $\bar X\approx\mathrm{N}(\mu,\sigma^2/n)$ (CLT). $(n-1)S^2/\sigma^2\sim\chi^2_{n-1}$ for Normal data.

### Model terms

**Nested:** A is B with parameters constrained (usually to 0). **Factor**, $L$ levels: $L-1$ dummies vs a reference level; test it by one LRT on $L-1$ df, not its separate $z$ values. `x1*x2` $=$ `x1+x2+x1:x2`. `I(x^2)`: quadratic. Coefficients mean “holding other predictors fixed”. Observational data show **association, not causation**. A predictor can flip sign when correlated with others: it is “not significant in the presence of the others”.

## LIKELIHOOD & BINOMIAL REGRESSION

### Likelihood

independent $Y_i$ with densities $f_i(\cdot;\theta)$ (may depend on covariates): $l(\theta)=\sum_{i}\log f_i(y_i;\theta)$. MLE $\hat{\theta}$ maximises $l$.

**Score:** $U(\theta)=\partial l/\partial\theta$. **Observed information:** $J(\theta)=-\partial^2l/\partial\theta\,\partial\theta^{\mathsf T}=-H$, depends on $y$. **Fisher information:** $I(\theta)=\mathbb{E} J(\theta;Y)$, no $y$. This is the whole sample ($n\times$ one-obs info if iid). Bigger information = sharper curvature = smaller variance.

**Asymptotics** ($n\to\infty$, $\theta^*$ true): **Consistent:** $P(|\hat{\theta}-\theta^*|>\epsilon)\to0$. **Normal:** $\hat{\theta}\approx\mathrm{N}(\theta^*,I(\theta^*)^{-1})$. **Efficient:** asymptotically unbiased with smallest variance $I(\theta^*)^{-1}$.

**Regularity:** $l$ smooth (3rd derivatives exist, continuous, bounded expectation); support of $Y$ free of $\theta$; parameter space finite-dimensional, free of $Y$; $\theta^*$ not on boundary.

**Q1 recipe:** (a) $l$. (b) $l'$, $l''$; $I=-\mathbb{E}[l'']$, replace $\sum x_i$ by $n\mathbb{E} X$ if data remain. (c) Solve $l'=0$, check $l''<0$, state $\hat{\theta}\approx\mathrm{N}(\theta,1/I(\theta))$.

**Marks:** no data in $l''$: write “$J=I$, no expectation needed”. **New parameter:** the MLE plugs in (invariance), but ***$I$ must be redone***: one Bin: $I(p)=\frac m{p(1-p)}$, $I(\eta)=mp(1-p)$. Course $I$ is the whole sample: never divide by $n$ again.

| iid $X_i\sim$ | MLE | $I(\theta)$ |
| --- | --- | --- |
| Exp(rate $\lambda$) | $1/\bar x$ | $n/\lambda^2$ |
| Exp(mean $\lambda$) | $\bar x$ | $n/\lambda^2$ |
| Poisson$(\lambda)$ | $\bar x$ | $n/\lambda$ |
| $\mathrm{N}(\mu_0,1/\tau)$ | $n/\sum(x_i-\mu_0)^2$ | $n/(2\tau^2)$ |
| $\mathrm{N}(\mu_0,\sigma^2)$ | $\sum(x_i-\mu_0)^2/n$ | $n/(2\sigma^4)$ |
| $\mathrm{N}(\mu,\sigma_0^2)$ | $\bar x$ | $n/\sigma_0^2$ |
| Bin$(m,p)$ | $\bar x/m$ | $nm/(p(1{-}p))$ |
| Geom $x\ge1$ | $1/\bar x$ | $n/(p^2(1{-}p))$ |
| Geom $x\ge0$ | $1/(1+\bar x)$ | $n/(p^2(1{-}p))$ |
| Pois$(t_i\lambda)$ | $\sum x_i/\sum t_i$ | $\sum t_i/\lambda$ |
| Bernoulli$(p)$ | $\bar x$ | $n/(p(1{-}p))$ |
| $\theta x^{\theta-1}$ on (0,1) | $-n/\sum\log x_i$ | $n/\theta^2$ |
| $\frac x\theta e^{-x^2/2\theta}$ | $\sum x_i^2/2n$ | $n/\theta^2$ |
| Gamma($a$ kn.$,\lambda$) | $a/\bar x$ | $na/\lambda^2$ |
| $\kappa(1+x)^{-\kappa-1}$ | $n/\sum\log(1+x_i)$ | $n/\kappa^2$ |
| NegBin$(r,1{-}p)$, one $y$ | $y/(y+r)$ | $r/(p(1{-}p)^2)$ |

### Wald CI for $t^{\mathsf T}\theta$

$\hat{\theta}\approx\mathrm{N}(\theta^*,I(\hat{\theta})^{-1})$, so $t^{\mathsf T}\hat{\theta}\pm z_\alpha\sqrt{t^{\mathsf T} I(\hat{\theta})^{-1} t}$, $\Phi(z_\alpha)=1-\alpha/2$. Unit vector $t$: $\hat{\theta}_i\pm z_\alpha\sqrt{[I(\hat{\theta})^{-1}]_{ii}}$. No $I$? Use $J(\hat{\theta};y)$.

### LR confidence region

$\{\theta:2l(\hat{\theta})-2l(\theta)\le\chi^2_k(1-\alpha)\}$, $k=\dim\theta$. Better than the Normal approximation for small $n$. $\theta_0$ is inside iff $2[l(\hat{\theta})-l(\theta_0)]\le\chi^2_k(.95)$. The Wald box ignores correlation: a point can sit inside both intervals yet outside the region.

### Wald test

$H_0:\beta_j=0$. $z^*=\hat{\beta}_j/\mathrm{se}(\hat{\beta}_j)\sim\mathrm{N}(0,1)$ under $H_0$. Reject if $|z^*|>1.96$.

**Null not 0:** $z=(\hat{\beta}-b_0)/\mathrm{se}$; R's $z$ column only tests 0.

### LRT

Reduced R nested in Full F, $k$ fewer parameters. $LR^*=-2[\log L(\hat{\theta}^R)-\log L(\hat{\theta}^F)]\sim\chi^2_k$ under R. If $LR^*>\chi^2_k(1-\alpha)$ reject R, pick F.

**Wald vs LRT:** asymptotically equivalent ($z^{*2}\approx\chi^2_1$), but the $\chi^2$ approximation to the LR is generally better, so **prefer LRT**.

### Binomial regression

$Y_i\sim\mathrm{bin}(m_i,p_i)$ independent, $m_i$ known (binary: $m_i=1$), $g(p_i)=\eta_i=x_i^{\mathsf T}\beta$. Linear $p=\beta_0+\beta_1t$ fails because $0\le p\le1$ is needed.

**Logit:** $\eta=\log\frac p{1-p}$, $p=\frac{e^\eta}{1+e^\eta}=\frac1{1+e^{-\eta}}$. **Probit:** $\eta=\Phi^{-1}(p)$, $p=\Phi(\eta)$. **Cloglog:** $\eta=\log(-\log(1-p))$, $p=1-e^{-e^\eta}$.

**Logistic curve** $\eta=\beta_0+\beta_1t$: $p=\frac12$ at $t=-\beta_0/\beta_1$ (location), slope there $\beta_1/4$ (steepness).

$$
l(\beta)=c+\sum_{i}\big[y_i\log\tfrac{p_i}{1-p_i}+m_i\log(1-p_i)\big]
$$

Logit: $l=c+\sum_{i}[y_i\eta_i-m_i\log(1+e^{\eta_i})]$. No closed form: use `optim` or IWLS.

**Logit information:** $J=I=X^{\mathsf T} WX$, $W=\mathrm{diag}(m_ip_i(1-p_i))$ (no $y_i$ left). One predictor: entries $\sum m_ip_iq_i$, $\sum m_ix_ip_iq_i$, $\sum m_ix_i^2p_iq_i$, $q_i=1-p_i$.

$$
I(\beta)=\begin{pmatrix}\sum m_ip_iq_i&\sum m_ix_ip_iq_i\\\sum m_ix_ip_iq_i&\sum m_ix_i^2p_iq_i\end{pmatrix},\ q_i=1-p_i
$$

**Probit:** $I=X^{\mathsf T} WX$, $W_{ii}=m_i\varphi(\eta_i)^2/[\Phi(\eta_i)(1-\Phi(\eta_i))]$.

**Predict at $x_0$:** $\hat{\eta}_0=x_0^{\mathsf T}\hat{\beta}$, $\hat p_0=g^{-1}(\hat{\eta}_0)$.

**CI for $p$:** $p$ is not linear in $\beta$, so (1) CI for $\eta$: $\hat{\eta}_0\pm1.96\sqrt{x_0^{\mathsf T} Vx_0}$, $V=I(\hat{\beta})^{-1}$; one predictor $x_0^{\mathsf T} Vx_0=V_{11}+2x_0V_{12}+x_0^2V_{22}$. (2) Apply $g^{-1}$ to both ends ($g$ monotone).

**Two predictors,** $x_0=(1,a,b)$: $x_0^{\mathsf T} Vx_0=V_{00}+a^2V_{aa}+b^2V_{bb}+2aV_{0a}+2bV_{0b}+2abV_{ab}$. Keep every digit of `vcov`: terms nearly cancel; drop the covariances and se is far off. Smallest near the centre of the $x$s, wide when extrapolating.

**Odds:** $\log o=\eta$. Change $x_j$ by $\Delta$: $OR=e^{\Delta\beta_j}$, CI $\exp\{\Delta(\hat{\beta}_j\pm1.96\,\mathrm{se})\}$ (swap ends if $\Delta<0$). Several $x$ change by vector $d$: $\log OR=d^{\mathsf T}\hat{\beta}$, se $=\sqrt{d^{\mathsf T} Vd}$.

**OR between two non-baseline levels:** $\log OR=\hat{\beta}_a-\hat{\beta}_b$, $\mathrm{se}=\sqrt{V_{aa}+V_{bb}-2V_{ab}}$.

**Classify:** $\hat p\ge$ cutoff; trade off false positives and negatives by cost (screening: fewer false negatives).

**Score (logit):** $\sum_{i}(y_i-m_ip_i)x_{ij}=0$: observed minus fitted.

**Links:** same predictors with different links are not nested: no LRT, use AIC. They agree mid-range, differ in the tails. Cloglog leaves 0 slowly, nears 1 fast; natural if $p=1-e^{-\lambda}$ (at least one Poisson event). Probit, cloglog: $e^\beta$ is not an OR; $y$ stays in the Hessian, so $J\ne I$.

**Case-control:** logit slopes are still valid log OR; only the intercept shifts, by $\log(\pi_1/\pi_0)$, so no population risks. Not true for probit.

**Sparse data (Hauck-Donner):** se too big, $z$ too small, a real effect missed: trust $\Delta D$.

## GLMs: DEVIANCE, IWLS, DIAGNOSTICS

### Deviance

**Saturated S:** one parameter per observation, $\hat{\mu}_i=y_i$. **Null:** intercept only. **Scaled deviance:** $D^A/\phi=-2\log[L(\hat{\beta}_A)/L(S)]=2(l_S-l_A)$. **Deviance** is $D^A=\sum d_i$. Binomial and Poisson: $\phi=1$, same thing. $D_{null}-D_{res}$ = improvement from predictors. **Why the deviance (Poisson):** $l_S=\sum[y_i\log y_i-y_i-\log y_i!]$, $\hat l=\sum[y_i\log\hat{\mu}_i-\hat{\mu}_i-\log y_i!]$; double the gap.

**$y=0$:** Poisson $d_i=2\hat{\mu}_i$; binomial $d_i=-2m_i\log(1-\hat p_i)$.

| Model | $d_i$ ($0\log0=0$) |
| --- | --- |
| Normal | $(y_i-\hat{\mu}_i)^2$ (= SSE in LM) |
| Poisson | $2[y_i\log(y_i/\hat{\mu}_i)-(y_i-\hat{\mu}_i)]$ |
| Binomial | $2[y_i\log\frac{y_i}{\hat{\mu}_i}+(m_i-y_i)\log\frac{m_i-y_i}{m_i-\hat{\mu}_i}]$ |
| Gamma | $2[-\log(y_i/\hat{\mu}_i)+(y_i-\hat{\mu}_i)/\hat{\mu}_i]$ |

**Adequacy (goodness of fit), $\phi=1$ only:** $H_0$: fitted model adequate. If $m_ip_i,\ m_i(1-p_i)\ge5$ (binomial) or $\lambda_i\ge5$ (Poisson) then $D\approx\chi^2_{n-p}$, $p$ including $\beta_0$. Reject if $D>\chi^2_{n-p}(.95)$; rough check $D\approx df$. ***Saturated model has $n$ parameters (not fixed), so ML theory does not apply: $D$ need not be $\chi^2$.*** Small $m_i$ or counts (binary $m_i=1$ especially): no adequacy test, $\Delta D$ still fine. Normal, Gamma, IG: $\phi$ estimated, cannot test adequacy. $D$ far above the cutoff: misfit is real even if a few counts are small. 0/1 logit: $D$ depends only on $\hat p_i$, so says nothing about fit.

**Lack of fit** may be overdispersion, wrong mean or missing interaction: check residuals vs $\hat{\eta}$ first.

**Nested:** A in B, $s$ extra parameters. $(D^A-D^B)/\phi=-2[l_A-l_B]$, $l_S$ cancels. $\phi=1$: $D^A-D^B\approx\chi^2_s$. $\phi$ unknown: $F$ test (see Overdispersion). ***Subtract residual deviances, not null deviances.*** $D_{null}-D_{res}$ on $p-1$ df tests all predictors at once. **Numeric score vs factor** ($L$ levels), or a group-level covariate vs a group factor: nested, $s=L-2$.

**AIC (non-nested too):** $AIC=2p-2\hat l$, smaller is better, same data only, not a test. B has $s$ more parameters: $AIC_B-AIC_A=2s-(D_A-D_B)/\phi$ (exact for $\phi=1$). An extra parameter pays only if it cuts $D$ by more than 2.

**From R output:** $p=n-$residual df; $n=$ null df $+1$. $\phi=1$: $\hat l=p-AIC/2$, $l_S=\hat l+D/2$ (same $l_S$ for every model on those data). Gamma, Normal: R's AIC counts $\phi$, so $\hat l=(p+1)-AIC/2$. Check: two models on the same data give the same $l_S$. Continuous data: $\hat l>0$, AIC $<0$ are fine.

### Exponential family

$f(y;\theta,\phi)=\exp\big[\frac{y\theta-b(\theta)}{a(\phi)}+c(y,\phi)\big]$. $\theta$ canonical (location), $\phi$ dispersion (scale). Form not unique. Convention $a(\phi)=\phi$.

$\mathbb{E} Y=b'(\theta)$, $\mathrm{Var} Y=b''(\theta)a(\phi)=v(\mu)a(\phi)$. **Variance function** $v(\mu)=b''((b')^{-1}(\mu))$: how spread changes with mean. **Canonical link** $g=(b')^{-1}$, $g(\mu)=\theta$. Canonical: $g'(\mu)=1/v(\mu)$.

**Proof:** $\int f\,dy=1$. Differentiate in $\theta$: $\mathbb{E}[(Y-b')/a]=0$, so $\mathbb{E} Y=b'$. Again: $\mathbb{E}[(Y-b')^2/a^2]-b''/a=0$, so $\mathrm{Var} Y=b''a$.

**Recipe:** write $\log f$; find $y\times$(something) $=\theta/a$; the term with no $y$ gives $-b/a$; leftovers $c$. Write $b$ in $\theta$ only. ***Check $b'(\theta)=\mu$.*** State all of $\theta,\phi,a,b,c$ and write “support free of $\theta$”. ***Not exp family*** if the support depends on $\theta$, or the parameter multiplies $y^2$, $\log y$ or $e^y$ rather than $y$.
- **Normal:** $\theta=\mu$, $\phi=\sigma^2$, $b=\theta^2/2$, $c=-\frac12(\frac{y^2}\phi+\log2\pi\phi)$; $g=\mu$, $v=1$.
- **Poisson:** $\theta=\log\lambda$, $\phi=1$, $b=e^\theta$, $c=-\log y!$; $g=\log\mu$, $v=\mu$.
- **Binomial:** $\theta=\log\frac p{1-p}$, $\phi=1$, $b=m\log(1+e^\theta)$, $c=\log\binom my$; $g=\log\frac\mu{m-\mu}$, $v=\mu(1-\mu/m)$.
- **Gamma$(\nu,\lambda)$:** $\theta=-\lambda/\nu=-1/\mu$, $\phi=1/\nu$, $b=-\log(-\theta)$, $c=(\frac1\phi-1)\log y-\frac{\log\phi}\phi-\log\Gamma(\frac1\phi)$; $g=-1/\mu$ (R: $1/\mu$), $v=\mu^2$, $\mathrm{Var} Y=\phi\mu^2$.
- **Exponential$(\lambda)$:** $\theta=-\lambda$, $\phi=1$, $b=-\log(-\theta)$, $c=0$; $g=-1/\mu$, $v=\mu^2$. $\mu=-1/\eta$ needs $\eta<0$, so canonical link can fail: use log. $\phi$ known: $\chi^2$ tests.
- **Inverse Gaussian:** $\theta=-\frac1{2\mu^2}$, $\phi=1/\lambda$, $b=-\sqrt{-2\theta}$, $c=-\frac12[\log(2\pi\phi y^3)+\frac1{\phi y}]$; $g=-\frac1{2\mu^2}$ (R: $1/\mu^2$), $v=\mu^3$.
- **Weibull,** $k$ known: $Y=X^k\sim$ Exp(rate $\lambda^k$).
- **Geometric,** $y\ge0$: $\theta=\log(1-p)$, $\phi=1$, $b=-\log(1-e^\theta)$, $c=0$; $v=\mu+\mu^2$.
- **NegBin,** $r$ known: $\theta=\log\frac\mu{\mu+r}$, $\phi=1$, $b=-r\log(1-e^\theta)$, $c=\log\frac{\Gamma(y+r)}{\Gamma(r)y!}$; $v=\mu+\mu^2/r$. $r$ unknown: not exp family.
- **Proportion** $Y=X/m$: $\theta$ logit, $b=\log(1+e^\theta)$, $a(\phi)=1/m$, $v=\mu(1-\mu)$ (R's scale). **Mean of $k$ Poissons:** $b=e^\theta$, $a(\phi)=1/k$, $\mathrm{Var} Y=\mu/k$; $\phi$ known from the design.

### GLM

$Y$ from exponential family and $\mu=\mathbb{E} Y=g^{-1}(x^{\mathsf T}\beta)$; $g$ monotone differentiable link. We model location $\eta=x^{\mathsf T}\beta$; scale sorts itself out. Canonical link: $\theta_i=x_i^{\mathsf T}\beta$.

**Fitted mean:** log link $e^\eta$; logit $me^\eta/(1+e^\eta)$; identity $\eta$; inverse $1/\eta$.

**Newton-Raphson:** $x_{n+1}=x_n-f'(x_n)/f''(x_n)$; $\theta^{n+1}=\theta^n-H(\theta^n)^{-1} U(\theta^n)$. **Fisher scoring:** replace $J$ by $I$ (positive definite): $\theta^{n+1}=\theta^n+I(\theta^n)^{-1} U(\theta^n)$. Equal under a canonical link.

**Score:** $U_j=\sum_{i}\frac{(y_i-\mu_i)x_{ij}}{a(\phi)v(\mu_i)g'(\mu_i)}$. Canonical link: $X^{\mathsf T}(y-\hat{\mu})=0$, so $\sum\hat{\mu}_i=\sum y_i$ with an intercept.

**Canonical link:** $W=v(\mu)$, $J=I$, NR = Fisher scoring = IWLS, $X^{\mathsf T} y$ sufficient, and fitted totals match the data: group totals, $\sum x_{ij}\hat{\mu}_i=\sum x_{ij}y_i$. Non-canonical: $J$ contains $y$; same $\hat{\beta}$.

**WLS:** $Y=X\beta+\varepsilon$, $\varepsilon\sim\mathrm{N}(0,\Sigma)$: $\hat{\beta}=(X^{\mathsf T}\Sigma^{-1} X)^{-1} X^{\mathsf T}\Sigma^{-1} y$. **Idea:** $g(Y_i)\approx Z_i=g(\mu_i)+(Y_i-\mu_i)g'(\mu_i)$ with $\mathrm{Var}=g'(\mu_i)^2v(\mu_i)a(\phi)$; depends on $\beta$, so iterate.

**IWLS:** (1) $\hat{\mu}^0=y$. (2) $z_i=g(\hat{\mu}_i)+(y_i-\hat{\mu}_i)g'(\hat{\mu}_i)$, $W_{ii}=1/[g'(\hat{\mu}_i)^2v(\hat{\mu}_i)]$. (3) $\hat{\beta}=(X^{\mathsf T} WX)^{-1} X^{\mathsf T} Wz$, $\hat{\mu}_i=g^{-1}(x_i^{\mathsf T}\hat{\beta})$. (4) Repeat until $\hat{\beta}$ stable. $a(\phi)$ cancels. Same as Fisher scoring. Needs only $g$, $v$.

**One step by hand:** $\hat{\mu}^0=y$, so $z_i=g(y_i)$, $W_{ii}=1/[g'(y_i)^2v(y_i)]$ (Poisson log: $\log y$, $y$). $X^{\mathsf T} WX=\begin{pmatrix}\sum W&\sum Wx\\\sum Wx&\sum Wx^2\end{pmatrix}$, $X^{\mathsf T} Wz=\begin{pmatrix}\sum Wz\\\sum Wxz\end{pmatrix}$. $y=0$ breaks the start: R uses $y+.1$ (Poisson), $(y+.5)/(m+1)$ (binomial).

| Family, link | $z_i$ | $W_{ii}$ |
| --- | --- | --- |
| Poisson, log | $\eta+(y-\mu)/\mu$ | $\mu$ |
| Binom, logit | $\eta+\frac{(y-\mu)m}{\mu(m-\mu)}$ | $\mu(m-\mu)/m$ |
| Gamma, log | $\eta+(y-\mu)/\mu$ | 1 |
| Poisson, $\sqrt{\ }$ | $\eta/2+y/(2\eta)$ | 4 |
| Binom, cloglog | $\eta+\frac{y-\mu}{m(1-p)L}$ | $m(1-p)L^2/p$ |
| Gamma, $1/\mu$ | $\eta-(y-\mu)/\mu^2$ | $\mu^2$ |
| Gamma, identity | $y$ | $1/\mu^2$ |
| IG, $1/\mu$ | $\eta-(y-\mu)/\mu^2$ | $\mu$ |

Cloglog: $L=e^\eta=-\log(1-p)$.

**Variance:** $\mathrm{Var}\hat{\beta}=(X^{\mathsf T}\hat\Sigma^{-1} X)^{-1}$, $\hat\Sigma_{ii}=g'(\hat{\mu}_i)^2v(\hat{\mu}_i)a(\hat{\phi})$. Same as $a(\hat{\phi})(X^{\mathsf T}\hat WX)^{-1}$: $a(\phi)$ does ***not*** cancel here. Gamma log: $\hat{\phi}(X^{\mathsf T} X)^{-1}$. $\phi$ known but R took 1: SE$\times\sqrt{a(\phi)}$.

**Estimate $\phi$:** $\hat{\phi}=X^2/(n-p)$, Pearson $X^2=\sum_{i}(y_i-\hat{\mu}_i)^2/v(\hat{\mu}_i)$. Consistent. ***Not*** $D/(n-p)$. If $\phi=1$ and the model is adequate, $X^2\approx\chi^2_{n-p}$.

**Rate model:** $Y_i\sim$ Pois$(\lambda_i)$, $\lambda_i\propto t_i$: $\log\lambda_i=\log t_i+x_i^{\mathsf T}\beta$. `offset(log(t))` fixes the coefficient of $\log t$ at 1 (uses no df). $e^{\beta}$ = rate ratio; $\hat\lambda=t\,e^{x^{\mathsf T}\hat{\beta}}$. **Check it:** free coefficient of $\log t$, $z=(\hat{\beta}-1)/\mathrm{se}$, or $\Delta D$ on 1 df. Forget $\log t$ in $\hat{\eta}$ and you get the rate, not the count.

**Gamma GLM:** `Gamma(link="log")` etc. $\phi$ estimated, so $t$ and $F$. $\mathrm{sd}/\mu=\sqrt\phi$. Pick link by plotting $g(y)$ vs $x$.

**Intercept only:** $\hat{\mu}=\bar y$, $\hat{\beta}_0=g(\bar y)$; Poisson log se $=1/\sqrt{\sum y_i}$. **Quadratic:** turning point $x=-\hat{\beta}_1/(2\hat{\beta}_2)$. **Log link with $\log x$:** $\mu=e^{\beta_0}x_1^{\beta_1}x_2^{\beta_2}$; test a theory value by $(\hat{\beta}-b_0)/\mathrm{se}$. **Identity link:** CI directly on the response scale. **Inverse link:** larger $\eta$ means smaller $\mu$.

### Residuals

**Response:** $y_i-\hat{\mu}_i$: raw gap on $y$'s scale; not homoskedastic unless $v$ constant, so points not comparable. **Pearson:** $r_P(i)=(y_i-\hat{\mu}_i)/\sqrt{v(\hat{\mu}_i)}$: gap in SDs if $\phi=1$, so comparable. $\sum r_P^2=X^2$. **Deviance:** $r_D(i)=\mathrm{sign}(y_i-\hat{\mu}_i)\sqrt{d_i}$: $r_D^2$ is the point's share of $D$, big = much misfit. $\sum r_D^2=D$ (R default). Binomial $v=m\hat p\hat q$. $y=0$: $r_D=-\sqrt{2\hat{\mu}}$, a smooth curve on the plot. `type="response"` on `cbind` gives $y/m-\hat p$.

**Leverage:** $H=X(X^{\mathsf T}\hat\Sigma^{-1} X)^{-1} X^{\mathsf T}\hat\Sigma^{-1}$, $H_{ii}$ measures potential influence (unusual $x$; also depends on IWLS weight), no $\phi$. $\sum H_{ii}=p$, mean $p/n$: rule of thumb, flag $>2p/n$. Large leverage need not mean actual influence. By hand: $H_{ii}=w_ix_i^{\mathsf T}\widehat{\mathrm{Var}}(\hat{\beta})x_i$ ($\phi=1$), $w_i$ the IWLS weight: $m\hat p\hat q$ (logit), $\hat{\mu}$ (Poisson log), 1 (Gamma log: $H$ depends on $x$ only). Tiny $\hat{\mu}$: small $H$ even at extreme $x$.

**Studentised:** $\mathrm{Var}(Z-\hat Z)=(I-H)\Sigma$, so $r_{SP}=r_P/\sqrt{(1-H_{ii})\hat{\phi}}$, $r_{SD}=r_D/\sqrt{(1-H_{ii})\hat{\phi}}$. Unit variance after adjusting for leverage and $\hat{\phi}$: use these to compare sizes. $\pm$: above/below fit.

**Jack-knife:** change in $\hat{\mu}_i$ when $y_i$ removed, big = outlier: $\mathrm{sign}(y_i-\hat{\mu}_i)\sqrt{(1-H_{ii})r_{SD}^2+H_{ii}r_{SP}^2}$. $\phi=1$: $\mathrm{sign}\cdot\sqrt{r_D^2+H_{ii}r_P^2/(1-H_{ii})}$.

**Cook:** change in the whole fit when $i$ removed: $(\hat{\beta}_{(i)}-\hat{\beta})^{\mathsf T} X^{\mathsf T}\hat\Sigma^{-1} X(\hat{\beta}_{(i)}-\hat{\beta})/p\approx r_{SP}^2H_{ii}/[p(1-H_{ii})]$. Same as $r_P^2H_{ii}/[p\hat{\phi}(1-H_{ii})^2]$. Near 1 or a clear jump = influential. Gamma: keep $\hat{\phi}$.

**Half-normal plot:** ordered $|$values$|$ vs $\Phi^{-1}((n+i)/(2n+1))$. Smooth = fine; ***jump or kink in tail = problem***. Need not be straight.

**$r_D$ vs $\hat{\eta}$:** no trend, even spread is good. Trend or curve: wrong mean. Fan: wrong variance. **Banding:** discrete counts, not a problem; use a smoother. 0/1 data: two curves, nothing to read.

**Linearity:** plot $g(y)$ or $z$ vs each $x_j$: want straight. Fix by transforming $x$, ***not $y$*** (breaks distribution of $Y$).

**Influential point:** refit without it, compare $\hat{\beta}$, $D$, $\hat{\phi}$. Typically keep unless a recording error.

**Classify:** **outlier:** big jack-knife, ordinary $H$, coefficients barely move. **High leverage only:** big $H$, tiny residual, small Cook. **Influential:** big Cook, coefficients move when dropped (needs both leverage and residual).

## OVERDISPERSION & QUASI-LIKELIHOOD

### Overdispersion

actual $\mathrm{Var} Y_i$ larger than the model says. **Causes:** binomial: dependent trials or $p$ changing trial to trial. Poisson: dependent events or non-constant rate. Random rate: $\mathrm{Var} Y=\mathbb{E}\lambda+\mathrm{Var}\lambda>\mathbb{E}\lambda$. Clusters of size $k$, $\mathrm{Var} p_i=\tau^2p(1-p)$: $\mathrm{Var} Y=(1+(k-1)\tau^2)mp(1-p)$.

**Detect:** $D\gg df$, GOF $p$ tiny, $\hat{\phi}\gg1$ (no universal cutoff). Rule out wrong mean and outliers first. $D/df$ is close to $\hat{\phi}$, but quote Pearson. A free mean for every group and $D$ still big: must be overdispersion. ***0/1 data: cannot be detected.***

**If ignored:** $\hat{\beta}$ unaffected, but SEs too small, $z$ too big, $p$-values too small, CIs too narrow: spurious significant predictors, too big a model. True se $\approx\sqrt{\hat{\phi}}\,$se, $z\to z/\sqrt{\hat{\phi}}$, $\Delta D\to\Delta D/\hat{\phi}$. $\hat{\phi}>1$ only ever makes terms less significant; $\hat{\phi}<1$: SEs too large.

**Fixes:** quasi-likelihood; different model (Poisson with Gamma rate gives NegBin, $\mathrm{Var}=\mu+\mu^2/\nu$); Bayes: random effect in $\eta$.

### Quasi-likelihood

specify only $g(\mu_i)=x_i^{\mathsf T}\beta$, $\mathbb{E} Y_i=\mu_i$, $\mathrm{Var} Y_i=\phi v(\mu_i)$; no distribution. Score $u_i=\frac{Y_i-\mu_i}{\phi v(\mu_i)}$: $\mathbb{E} u=0$, $\mathrm{Var} u=\frac1{\phi v}$, $-\mathbb{E}\frac{\partial u}{\partial\mu}=\frac1{\phi v}=\mathbb{E} u^2$, same as $\partial\log L/\partial\mu$.

$$
Q_i=\int_{y_i}^{\mu_i}\frac{y_i-t}{\phi v(t)}dt,\quad Q=\sum_{i} Q_i
$$

$\partial Q_i/\partial\mu_i=u_i$. $Q$ need not be a real log-density. $\hat{\beta}$ is consistent and asymptotically Normal as for MLE, but less efficient: use the distribution if known.

**Quasi-deviance:** saturated $Q=0$, so scaled $D_Q/\phi=-2\sum Q_i$, $D_Q=-2\sum_{i}\int_{y_i}^{\mu_i}\frac{y_i-t}{v(t)}dt$.

**Quasi-Poisson:** $v=\mu$, $Q_i=\frac1\phi[y_i\log\mu_i-\mu_i]$ + const. **Quasi-binomial:** $v=\mu(m-\mu)/m$, $Q_i=\frac1\phi[y_i\log\frac{\mu_i}{m_i-\mu_i}+m_i\log(m_i-\mu_i)]$ + const. $\phi$ cancels in IWLS, so **same $\hat{\beta}$, $\hat{\mu}$, $D$** as Poisson/binomial.

**Numeric $Q_i$ (definite integral, $\le0$):** $v=\mu$: $\phi Q_i=y\log\frac\mu y-(\mu-y)$. $v=\mu(m-\mu)/m$: $y\log\frac\mu y+(m-y)\log\frac{m-\mu}{m-y}$. $v=\mu^2$: $1-\frac y\mu+\log\frac y\mu$. $v=\mu^3$: $-\frac{(y-\mu)^2}{2y\mu^2}$.

**Other $v$:** $v=1$: $\phi Q_i=-\frac12(y-\mu)^2$, $D_Q$ = RSS, $\hat{\phi}=\hat\sigma^2$. $D_Q$ for $v=\mu$, $\mu(m-\mu)/m$, $\mu^2$, $\mu^3$ is the Poisson, binomial, Gamma, IG deviance. $Q_i\le0$: integrand opposes the direction of integration. **Why Pearson, not max $Q$:** $Q=\frac1\phi\times(\le0)$ rises to 0 as $\phi\to\infty$. **Scaled:** $D_Q/\hat{\phi}=-2\sum Q_i\approx n-p$ by construction, so no fit test.

**SE:** $\mathrm{se}_Q=\sqrt{\hat{\phi}}\ \mathrm{se}_P$, $\hat{\phi}$ of ***that same model***; reverse: $\mathrm{se}_P=\mathrm{se}_Q/\sqrt{\hat{\phi}}$. Estimate never changes. $t=z/\sqrt{\hat{\phi}}$, $z=t\sqrt{\hat{\phi}}$. One point: $\mathrm{Var} Y_i=\hat{\phi} m\hat p\hat q$.

**Coefficient:** $t^*=\hat{\beta}/\mathrm{se}_Q\approx t_{n-p}$; CI $\hat{\beta}\pm t_{n-p}(.975)\mathrm{se}_Q$ (1.96 if no $t$ given), exp for ratio. Prediction is unchanged, only its CI widens: `predict` on the quasi fit includes $\hat{\phi}$ (`residual.scale` $=\sqrt{\hat{\phi}}$); on the Poisson fit multiply se.fit by $\sqrt{\hat{\phi}}$.

**Nested $F$:** $F=\frac{(D_A-D_B)/s}{\hat{\phi}}\approx F_{s,\,n-p_B}$, ***$\hat{\phi}$ from the BIG model B***. No adequacy test, no $\chi^2$, AIC is NA (no likelihood), `step`/`drop1` do not work. Exact for Normal (LM $F$ test), approximate otherwise. Big model's $\hat{\phi}$ not printed: approx. $D_B/(n-p_B)$. $X^2$ can fall while $\hat{\phi}$ rises: df fell, the extra terms explain nothing.

**New data type:** choose link and $v$ from mean-variance (e.g. proportions: logit, $\mu(1-\mu)$), fit IWLS, $\hat{\phi}$ from Pearson. $\hat{\phi}<1$ (underdispersion) is allowed. iid mean $\lambda$, var $\phi\lambda$: $\hat\lambda=\bar y$, $\hat{\phi}=\frac{\sum(y_i-\bar y)^2}{\bar y(n-1)}$. Non-integer fractions work in `quasibinomial`. Lognormal: $v=\mu^2$, $\phi=e^{\sigma^2}-1$.

## READING R OUTPUT

### `summary(glm)` line by line

- **Deviance Residuals** (old R): 5-number summary of $r_D$; want median near 0, roughly symmetric.
- **Estimate** $\hat{\beta}_j$: change in $\eta$ per unit of $x_j$, others fixed. Row `schoolB` = level B vs baseline; `a:b` = interaction; `(Intercept)` = $\eta$ at $x=0$, baseline levels. **Std. Error:** $\sqrt{V_{jj}}=\sqrt{[I(\hat{\beta})^{-1}]_{jj}}$.
- **z value** (t if $\phi$ estimated) = Est/SE: tests $\beta_j=0$ ***with every other term kept in***. **Pr(>|z|):** two-sided $p$. Stars `***` $<.001$, `**` $<.01$, `*` $<.05$, `.` $<.1$.
- **Dispersion line:** “taken to be 1” is an assumption, not an estimate. Other value: $\hat{\phi}=X^2/(n-p)$.
- **Null deviance** on $n-1$: intercept-only fit, same for every model on those data. **Residual deviance** on $n-p$: your model.
- **AIC:** $2p-2\hat l$; NA for quasi. **Fisher Scoring iterations:** IWLS steps. **“$k$ observations deleted”:** $n$ is smaller than the data.

### Recover anything hidden

$n=$ null df $+1$ (with intercept). $p=n-$ res df. Non-intercept terms $=$ null df $-$ res df. SE $=$ Est$/z$; Est $=z\,$SE. $\hat l=p-AIC/2$ (Gamma $p+1$); $l_S=\hat l+D/2$; $\hat l_B=\hat l_A+\Delta D/2$. $s=$ res df$_A-$ res df$_B$. $\Delta D=D_A-D_B$. $AIC_B-AIC_A=2s-\Delta D/\phi$. $\hat{\phi}=X^2/(n-p)=(\mathrm{se}_Q/\mathrm{se}_P)^2=(z/t)^2$; $X^2=\hat{\phi}(n-p)$. $F=(\Delta D/s)/\hat{\phi}$, so $\hat{\phi}=(\Delta D/s)/F$. $z^2\approx\Delta D$ and $t^2\approx F$ on 1 df. Logit $\hat p=1/(1+e^{-\hat{\eta}})$; log link $\hat{\mu}=e^{\hat{\eta}}$. $|z|>1.96$: $p<.05$; $|z|>2.58$: $p<.01$.

### `anova(A,B,test="Chisq")`, two models

row 1 is the smaller model A, row 2 the bigger B.
- **Resid. Df:** $n-p_A$, $n-p_B$. **Resid. Dev:** $D_A$, $D_B$.
- **Df** (row 2): $s$. **Deviance:** $\Delta D=D_A-D_B\ge0$.
- **Pr(>Chi):** $P(\chi^2_s>\Delta D)$. Small: reject A, keep B. Large: keep A.
- `test="F"` adds **F** $=(\Delta D/s)/\hat{\phi}_B$ and **Pr(>F)** on $(s,n-p_B)$.

### `anova(m,test="Chisq")`, one model

“terms added sequentially (first to last)”.
- **NULL row:** Resid. Df $n-1$, Resid. Dev $D_{null}$.
- **Term rows:** that term added ***after those above it***. Df its df; Deviance the drop in $D$; Resid. Df, Resid. Dev running totals.
- ***Order matters:*** only the last row tests a term given all the others.
- **Checks:** Df column sums to $p-1$; Deviance column to $D_{null}-D_{res}$; last Resid. Dev is the summary's.
- Read upward: interaction first. If `A:B` is significant keep `A` and `B`, whatever their rows say.

### `drop1(m,test="Chisq")`

`<none>` is $m$; each row drops ***only that term***, so order is irrelevant. Deviance = $D$ after dropping; LRT = rise in $D$; 1-df term: LRT $\approx z^2$. `a*b`: only `a:b` shown.

### `step(m)`

`Start: AIC=` is the current model. Rows sorted by AIC, lowest first: `- x` drops x, `<none>` changes nothing. Top row wins; stops when `<none>` is on top. Last block's formula is the final model. Fails on quasi (AIC NA).

### Which test goes with which family

| | Poisson, binomial | Gamma, IG | Quasi |
| --- | --- | --- | --- |
| $\phi$ | 1, fixed | $\hat{\phi}$ Pearson | $\hat{\phi}$ Pearson |
| Coef | $z$ | $t_{n-p}$ | $t_{n-p}$ |
| Nested | $\Delta D$ vs $\chi^2_s$ | $F_{s,n-p_B}$ | $F_{s,n-p_B}$ |
| Fit | $D$ vs $\chi^2_{n-p}$, fitted $\ge5$ | none | none |
| $\hat l$ | $p-AIC/2$ | $p{+}1-AIC/2$ | AIC NA |

### Degrees of freedom

**null** $n-1$. **Residual, GOF $\chi^2$, Wald $t$, $\hat{\phi}$:** $n-p$, $p$ counting the intercept. **All terms:** $p-1$. **LRT $\chi^2$:** $s$ = difference in residual df. **Quasi, Gamma $F$:** $(s,n-p_B)$. **Numeric term** or `I(x^2)`: 1. **Offset:** 0. **Factor:** $L-1$. **Two factors** `A:B`: $(L_A-1)(L_B-1)$. **Factor by numeric** `A:x`: $L-1$. `A*B`: main effects plus interaction. **Numeric to factor:** $L-2$. **LR region:** $\dim\theta$. **Saturated:** 0 residual df. **Log-linear table:** cells $-$ parameters; `A+B+C` = mutual independence, `A*B` = interaction. **Mixture:** $K-1$ + component parameters.

### Interpretation lines

**Log link:** “Holding other predictors fixed, a 1-unit rise in $x$ multiplies the expected count by $e^{\hat{\beta}}$, a $100(e^{\hat{\beta}}-1)$% change.” **Logit:** same for the ***odds***, not the probability. **Identity:** adds $\hat{\beta}$. **Inverse:** $1/\mu$ rises by $\hat{\beta}$, so $\hat{\beta}>0$ lowers $\mu$. **Factor:** “relative to the reference level”. **$\log x$ with log link:** doubling $x$ multiplies $\mu$ by $2^{\hat{\beta}}$. **Interaction:** the effect of one predictor depends on the other; a cell vs baseline is $\exp$(its main effects + interaction); add the intercept for the cell mean. **Intercept:** $e^{\hat{\beta}_0}$ = baseline mean, rate or odds at $x=0$. **$\Delta$ units:** $e^{\Delta\hat{\beta}}$, ***not*** $\Delta e^{\hat{\beta}}$. CI: exponentiate the ends, never the se. Observational: “associated with”, not “causes”.

### Hard subquestions (R output)

- **Which model, 2 quantitative reasons:** smaller AIC, and $\Delta D>\chi^2_s(.95)$ rejects the smaller one.
- **2 reasons overdispersed:** $D\gg df$ and $\hat{\phi}\gg1$.
- **Why $F$, $t$ not $\chi^2$, $z$:** $\phi$ unknown, estimated by $\hat{\phi}$.
- **Poisson vs quasi-Poisson:** Poisson fixes $\mathrm{Var} Y=\mu$. Quasi keeps the same mean model, sets $\mathrm{Var} Y=\phi\mu$ with $\phi$ estimated from Pearson and assumes no distribution. Same $\hat{\beta}$; SEs $\times\sqrt{\hat{\phi}}$; tests become $t$, $F$; no AIC.
- **Interaction tested twice:** $z$ from Fisher information $\sim\mathrm{N}(0,1)$, and $\Delta D\sim\chi^2_1$. Prefer $\Delta D$.
- **Linear assumption evidence:** $\log(y/t)$ vs $x$ straight; interaction plot parallel lines = no interaction.
- **Outlier:** clear point in half-normal Cook/jack-knife plot. Refit, re-check $\hat{\phi}$: overdispersion typically remains.
- **GOF valid?** Check first: fitted counts $\hat{\mu}$ (binomial $m\hat p$, $m\hat q$) all $\ge5$; never for 0/1.
- **$\chi^2$ says keep, $F$ says drop:** believe $F$, $\phi=1$ is false: prefer the smaller model.
- **Which $\hat{\phi}$?** SE: the model holding that coefficient. $F$: the bigger model.
- **Factor with no significant dummy:** can still matter: one LRT on $L-1$ df.
- **$z^2\ne\Delta D$, $t^2\ne F$:** curvature at $\hat{\beta}$ vs the actual drop; close, not equal. Trust $\Delta D$.

### Maid Mast Codes PT1: GLM

`glm(cbind(y,m-y)~x, family=binomial, d)`: grouped binomial. `family=poisson`, `quasipoisson`, `quasibinomial`, `Gamma(link="log")`. `subset=-25` drops row 25; `update(m,subset=-7)` refits without row 7.
- `anova(A,B,dispersion=phi,test="F")` on binomial fits: same $F$ as quasi, but $p$ uses $F_{s,\infty}$. `test="F"` on plain Poisson/binomial: $F=\Delta D/s$, ignores overdispersion (R warns).
- `sum(residuals(m,type="pearson")^2)/m$df.residual` $=\hat{\phi}$.
- `pchisq(D,df,lower.tail=FALSE)` $=P(\chi^2_{df}>D)$. `qchisq(.95,df)`, `qf(.95,s,n-p)`, `qt(.975,n-p)`: cutoffs. `predict(m,newdata=list(x=1),type="response")`: $\hat{\mu}$ (***`cbind` binomial: $\hat p$, multiply by $m$***; same for `fitted`; offset: `newdata` needs $t$). `type="link",se.fit=TRUE`: $\hat{\eta}$, se. `rstudent` jack-knife (= the formula if $\phi=1$); `influence(m)$hat`; `cooks.distance`; `halfnorm`.
- `sum(m*fitted(f)<5)`: rows with $m\hat p<5$; check $m\hat q$ too. `logLik(m)`: $\hat l$ with df $p$ (Gamma $p+1$, quasi NA). `cov2cor(vcov(m))`: correlations. `binomial()$variance(mu)`: $v$ on the proportion scale.
- `optim(start,logL,control=list(fnscale=-1))` maximises $l$; start values matter.
- `summary(m,dispersion=phi)` rescales SEs ($z\div\sqrt\phi$, uses Normal). Old papers: `drop1(m,scale=phi,test="F")`, its $F$ uses $D/(n-p)$, not Pearson.
- `vcov(m)` $=V$ (quasi includes $\hat{\phi}$); `rstandard(m)` $=r_{SD}$; `rstandard(m,type="pearson")` $=r_{SP}$; `hatvalues(m)` $=H_{ii}$.
- `z<-predict(m)+(y-mu)/mu`: working response, log link. `w<-mu`: weight. `dnorm`, `rnorm` take ***sd***; `rgamma(n,shape,rate)`.

## PROBABILITY TOOLKIT

### Probability toolkit

**Total prob:** $P(A)=\sum_k P(A|B_k)P(B_k)$. **Bayes:** $P(B_k|A)=P(A|B_k)P(B_k)/\sum_j P(A|B_j)P(B_j)$. **Joint:** $p(x,z)=p(x|z)p(z)$. **Marginal:** $p(x)=\int p(x,z)\,dz$ (or $\sum_z$). **Conditional indep.** given $\theta$: $p(\tilde x|\theta,x)=p(\tilde x|\theta)$. **Indicator:** $\mathbb{E}[I(A)]=P(A)$.

**Tower:** $\mathbb{E} X=\mathbb{E}[\mathbb{E}(X|Z)]$. **Total variance:** $\mathrm{Var} X=\mathbb{E}[\mathrm{Var}(X|Z)]+\mathrm{Var}[\mathbb{E}(X|Z)]$. **Linear:** $\mathrm{Var}(aX+bY)=a^2\mathrm{Var} X+b^2\mathrm{Var} Y+2ab\mathrm{Cov}(X,Y)$; $\mathrm{Var}(t^{\mathsf T}\hat{\theta})=t^{\mathsf T} Vt$; $\mathrm{Var}(AY)=A\mathrm{Var}(Y)A^{\mathsf T}$.

**Square trick (CAVI):** $\mathbb{E}[(c-\mu)^2]=(c-\mathbb{E}\mu)^2+\mathrm{Var}\mu$, so $\mathbb{E}[\mu^2]=(\mathbb{E}\mu)^2+\mathrm{Var}\mu$.

**Jensen:** $f$ convex $\Rightarrow\mathbb{E} f(X)\ge f(\mathbb{E} X)$. Log is concave: $\log\mathbb{E} Y\ge\mathbb{E}\log Y$, equal iff $Y$ is constant.

**Invariance:** MLE of $g(\theta)$ is $g(\hat{\theta})$. **Delta:** $g(\hat{\theta})\approx\mathrm{N}(g(\theta),g'(\theta)^2I(\theta)^{-1})$. **Taylor:** $g(Y)\approx g(\mu)+(Y-\mu)g'(\mu)$.

**Integrals:** $\int_0^\infty x^{a-1}e^{-bx}dx=\Gamma(a)/b^a$; $\int_0^1x^{a-1}(1-x)^{b-1}dx=B(a,b)=\Gamma(a)\Gamma(b)/\Gamma(a+b)$; $\Gamma(a+1)=a\Gamma(a)$; $\Gamma(n)=(n-1)!$; $\Gamma(\tfrac12)=\sqrt\pi$. **Normal integral:** $\int e^{-\frac A2\mu^2+B\mu}d\mu=\sqrt{2\pi/A}\,e^{B^2/2A}$.

**Inverse:** $\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=\frac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$. **Odds:** $o=\frac p{1-p}$, $p=\frac o{1+o}$.

**Complete the square:** $-\frac A2\mu^2+B\mu$ is the kernel of $\mathrm{N}(B/A,\ 1/A)$. ***Course log = ln: press **ln** on the FX-82, not log.*** Round final answers to 2dp. FX-82: type $(-0.5)^2$ with brackets; $\sum\log a_i$ is one **ln** of the product.

## MIXTURES & EM

### Mixture model

(1) $Z_i\sim\mathrm{Categorical}(\pi_1,\dots,\pi_K)$, $Z_i$ latent label, $\pi_k$ mixture proportions. (2) $X_i|Z_i=k\sim P(X_i|\Theta_k)$ component.

$P(x_i)=\sum_k\pi_kf(x_i;\Theta_k)$, $L(\theta)=\prod_i\sum_k\pi_kf(x_i;\Theta_k)$. Free parameters: $K-1$ proportions + component parameters. ***A mixture is not a linear combination:*** $\pi_aX_a+\pi_bX_b$ of Normals is Normal; a mixture may be bimodal, or unimodal and skewed.

**Mean:** $\bar\mu=\sum\pi_k\mu_k$. **Var:** $\sum\pi_k\sigma_k^2+\sum\pi_k(\mu_k-\bar\mu)^2$. Poisson mixtures are overdispersed.

**Clustering:** $P(Z_i=k|X_i)=\frac{\pi_kf(x_i;\Theta_k)}{\sum_j\pi_jf(x_i;\Theta_j)}$; assign to the largest. Common factors cancel ($x!$, $\sqrt{2\pi}$) but ***not $\pi_k$ or unequal $1/\sigma_k$***. Poisson, $K=2$: $P_{i1}=1/[1+\frac{\pi_2}{\pi_1}(\frac{\lambda_2}{\lambda_1})^{x_i}e^{-(\lambda_2-\lambda_1)}]$. Normal, equal $\sigma^2$, $\mu_1<\mu_2$: cluster 1 if $x<\frac{\mu_1+\mu_2}2+\frac{\sigma^2\log(\pi_1/\pi_2)}{\mu_2-\mu_1}$.

### EM algorithm

$l(\theta)=\sum_{i}\log\sum_k\pi_kf$: the sum inside the log blocks a closed form. If $Z$ were known it would be easy.

**Incomplete log-lik:** $\log P(X|\theta)=\log\sum_ZP(X,Z|\theta)$. **Complete:** $\log P(X,Z|\theta)$. **Q:** $Q(\theta,\theta^0)=\mathbb{E}_{Z|X,\theta^0}[\log P(X,Z|\theta)]$.

**Steps:** (1) Set $\theta^0$; evaluate incomplete log-lik. (2) **E:** compute $P(Z|X,\theta^0)$. (3) **M:** $\hat{\theta}=\arg\max_\theta Q(\theta,\theta^0)$. (4) Evaluate incomplete log-lik; stop if change $<\epsilon$, else $\theta^0\leftarrow\hat{\theta}$, go to 2.

**Deriving Q:** write $P_{ik}=P(Z_i=k|X_i,\theta^0)$.

$$
\textstyle P(X,Z|\theta)=\prod_i\prod_k[\pi_kf(x_i;\Theta_k)]^{I(Z_i=k)}
$$

$$
\textstyle\log P(X,Z|\theta)=\sum_{i}\sum_{k} I(Z_i=k)[\log\pi_k+\log f(x_i;\Theta_k)]
$$

$\mathbb{E}[I(Z_i=k)]= P_{ik}$ and only $I$ is random, so

$$
\textstyle Q=\sum_{i}\sum_{k} P_{ik}[\log\pi_k+\log f(x_i;\Theta_k)]
$$

$K=2$: $\pi_1=\pi$, $\pi_2=1-\pi$. Normal: $\log f=-\frac12\log(2\pi\sigma_k^2)-\frac{(x_i-\mu_k)^2}{2\sigma_k^2}$ (that $\pi$ is 3.14). Poisson: $x_i\log\lambda_k-\lambda_k-\log x_i!$. Normal answer in full:

$$
\textstyle Q=\sum_{i}\sum_{k=1}^2 P_{ik}[\log\pi_k-\frac12\log2\pi\sigma_k^2-\frac{(x_i-\mu_k)^2}{2\sigma_k^2}]
$$

**M-step**, $N_k=\sum_{i} P_{ik}$ (effective count):
- **$\pi$:** $\frac{\partial Q}{\partial\pi}=\frac{N_1}\pi-\frac{N_2}{1-\pi}=0$, so $\hat\pi_k=N_k/n$. $K\ge3$: Lagrange $Q+\nu(1-\sum\pi_k)$ gives $\pi_k=N_k/\nu$; sum over $k$: $\nu=n$.
- **Normal:** $\hat{\mu}_k=\sum_{i} P_{ik} x_i/N_k$, $\hat\sigma_k^2=\sum_{i} P_{ik}(x_i-\hat{\mu}_k)^2/N_k$ (from $\frac{\partial Q}{\partial\sigma^2}=\sum P_{ik}[-\frac1{2\sigma^2}+\frac{(x_i-\mu)^2}{2\sigma^4}]=0$). Mean 0: $\sum P_{ik} x_i^2/N_k$. Shared $\sigma^2$: $\sum_{i}\sum_{k} P_{ik}(x_i-\hat{\mu}_k)^2/n$.
- **Poisson:** $\hat\lambda_k=\sum P_{ik} x_i/N_k$; $Q''=-\sum P_{ik} x_i/\lambda_k^2<0$. **Bin$(m,p_k)$:** $\hat p_k=\sum P_{ik} x_i/(mN_k)$. **Exp(rate $\lambda_k$):** $\hat\lambda_k=N_k/\sum P_{ik} x_i$.

**Twists rule:** collect every term with the parameter across all components and blocks, differentiate once. Exp$(\lambda)$, Exp$(2\lambda)$: $\hat\lambda=n/\sum(P_{i1}+2P_{i2})x_i$. Exposure $t_i$: $\hat\lambda_k=\sum P_{ik} x_i/\sum P_{ik} t_i$. $\mathrm{N}(\mu,\sigma^2)$, $\mathrm{N}(\mu,9\sigma^2)$: $w_i=P_{i1}+P_{i2}/9$, $\hat{\mu}=\sum w_ix_i/\sum w_i$, $\hat\sigma^2=\sum w_i(x_i-\hat{\mu})^2/n$.

**$n'$ points known from component $j$** (not drawn from the mixture): no $Z$, so they add $\sum\log f_j(x_i)$ to $Q$ with weight 1 and no $\pi$. ***$\hat\pi_k=N_k/n$, unlabelled $n$ only.*** $\hat{\mu}_j=(\sum P_{ik} x_i+\sum_{lab}x_i)/(N_j+n')$; same for $\sigma_j^2$ with $(x_i-\hat{\mu}_j)^2$. Incomplete log-lik: $\sum_{unlab}\log\sum_k\pi_kf_k+\sum_{lab}\log f_j$.

**Observed labels from the mixture:** count in both: $\hat\pi_k=(N_k+m_k)/(n+m)$. **Known parameters:** do not differentiate. **Tied:** $\mathrm{N}(\mu,1),\mathrm{N}(-\mu,1)$: differentiate once, $\hat{\mu}=\sum(P_{i1}-P_{i2})x_i/n$. **Zero-inflated:** $P_{i1}=0$ if $x_i>0$; $\hat\lambda=\sum x_i/(n-N_1)$. $K=3$: $\pi_3=1-\pi_1-\pi_2$, three terms in the denominator.

**Behaviour:** incomplete log-lik **never decreases** (a drop means a bug). Local maxima: sensitive to initial values, so run many starts, keep the **highest incomplete log-lik**. **Label switching:** same log-lik, permuted labels, same fit. Equal starts ($\lambda_1^0=\lambda_2^0$) get stuck at $\hat\lambda_k=\bar x$, $\pi$ unchanged. Overlap: $P_{ik}$ less decisive, EM slower and more start-sensitive. Do not compare log-lik across different data.

**By hand:** table of $x_i$, $P_{i1}$, $P_{i2}$; check $N_1+N_2=n$. M-step is the complete-data MLE with hard counts replaced by weights $P_{ik}$. To choose between runs, plug each $\hat{\theta}$ into $\sum_{i}\log(\pi f_1(x_i)+(1-\pi)f_2(x_i))$. Keep $\log x_i!$ when reporting $Q$ or log-lik values.

**Proof (Jensen):** $q(Z)=P(Z|X,\theta^0)$:

$$
\textstyle l(\theta)=\log\sum_Zq\frac{P(X,Z|\theta)}q\ge\sum_Zq\log\frac{P(X,Z|\theta)}q
$$

$=Q(\theta,\theta^0)+C$, $C=-\sum q\log q$. Equality at $\theta^0$, as $P(X,Z|\theta^0)/q=P(X|\theta^0)$ is constant. M-step: $Q(\hat{\theta},\theta^0)\ge Q(\theta^0,\theta^0)$. So $l(\hat{\theta})\ge Q(\hat{\theta},\theta^0)+C\ge Q(\theta^0,\theta^0)+C=l(\theta^0)$.

### EM shortcuts

write “the terms of $Q$ involving $\lambda$ are…” before each derivative.

**Any two classes, no underflow:** $P_{i1}=1/(1+e^{d})$, $d=\log\frac{\pi_2\sigma_1}{\pi_1\sigma_2}+\frac{(x-\mu_1)^2}{2\sigma_1^2}-\frac{(x-\mu_2)^2}{2\sigma_2^2}$.
- Pois$(\lambda)$, Pois$(3\lambda)$: $P_{i1}=1/[1+\frac{1-\pi}\pi3^{x_i}e^{-2\lambda}]$; $\hat\lambda=\sum x_i/\sum(P_{i1}+3P_{i2})$, known block adds 3 each below.
- Pois$(t\lambda_1)$, Pois$(t\lambda_2)$: $P_{i1}=1/[1+\frac{1-\pi}\pi(\frac{\lambda_2}{\lambda_1})^{x_i}e^{-t_i(\lambda_2-\lambda_1)}]$.
- $\mathrm{N}(\mu,\sigma^2)$, $\mathrm{N}(-\mu,\sigma^2)$: $P_{i1}=\pi/[\pi+(1-\pi)e^{-2\mu x_i/\sigma^2}]$; $\hat{\mu}=\frac1n\sum(2P_{i1}-1)x_i$; $\hat\sigma^2=\frac1n\sum x_i^2-\hat{\mu}^2$.
- Exp$(\lambda)$, Exp$(2\lambda)$: $P_{i1}=\pi/[\pi+2(1-\pi)e^{-\lambda x_i}]$.
- Zero-inflated Poisson: $x_i=0$: $P_{i1}=\pi/[\pi+(1-\pi)e^{-\lambda}]$; $x_i>0$: 0. Binomial: $\pi/[\pi+(1-\pi)(1-p)^{m_i}]$; $\hat p=\sum x_i/\sum P_{i2}m_i$.
- $\mathrm{N}(\mu,1)$, $\mathrm{N}(2\mu,4)$: $\hat{\mu}=\frac1n\sum(P_{i1}+\frac12P_{i2})x_i$.

**Mixture moments:** $K=2$ between term $=\pi_1\pi_2(\mu_1-\mu_2)^2$. Poisson: $\mathrm{Var} X=\bar\lambda+\pi_1\pi_2(\lambda_1-\lambda_2)^2$, so intercept-only $\hat{\phi}\approx\mathrm{Var} X/\mathbb{E} X$. Exposure $t$: $t\bar\lambda+t^2\pi_1\pi_2(\lambda_1-\lambda_2)^2$. Zero-inflated: $\mathbb{E} X=(1-\pi)\lambda$, $\mathrm{Var} X=\mathbb{E} X(1+\pi\lambda)$.

**Cutoffs:** Poisson, $\lambda_1<\lambda_2$: cluster 1 if $x<\frac{\log(\pi_1/\pi_2)+\lambda_2-\lambda_1}{\log(\lambda_2/\lambda_1)}$. Same mean $\mu$, $\sigma_1<\sigma_2$: cluster 2 if $|x-\mu|>c$, $c^2=\log\frac{\pi_1\sigma_2}{\pi_2\sigma_1}\big/\big(\frac1{2\sigma_1^2}-\frac1{2\sigma_2^2}\big)$ (log $\le0$: all cluster 2). Misclassified: $\pi_1P(x>c|1)+\pi_2P(x\le c|2)$.

**By hand:** $\sum P_{i2}x_i=\sum x_i-\sum P_{i1}x_i$. Pooled $\hat\sigma^2=(N_1\hat\sigma_1^2+N_2\hat\sigma_2^2)/n$. Variance update uses the ***new*** mean. $K=3$: $N_k/\pi_k=c$ for all $k$, sum gives $c=n$.

**Is it a maximum?** $Q''_\mu=-N_k/\sigma_k^2$; $Q''_\pi=-N_1/\pi^2-N_2/(1-\pi)^2$; $Q''_{\sigma^2}=-N_k/2\hat\sigma_k^4$.

**Choose $K$:** $l$ always rises with $K$: use AIC, $p=K-1$ + component parameters (known values not counted).

### Maid Mast Codes PT2: EM

`Z=sample(1:K,n,replace=TRUE,prob=pi); X=rnorm(n,mu[Z],sd[Z])`: simulate.
- `L[,k]=dnorm(X,mu[k],s)*w[k]`: $n\times K$ matrix $P(X_i,Z_i{=}k)$.
- `P_ik=prob.x.z/rowSums(prob.x.z)`: E-step.
- `w.new=colSums(P_ik)/sum(P_ik)`: $\hat\pi_k$; `sum(P_ik)` $=n$.
- `mu.new=colSums(P_ik*X)/colSums(P_ik)`: $\hat{\mu}_k$.
- `ill=sum(log(rowSums(prob.x.z)))`: incomplete log-lik.
- `delta.ll`, `epsilon`: gain, tolerance. Negative `delta.ll` also stops the loop, so a bug can look converged. Bugs: `/colSums` in E-step; `sum(log(prob.x.z))`.
- `cluster=apply(P_ik,1,which.max)`: largest $P_{ik}$. `table(true=Z,cluster)`: diagonal correct, needs simulated labels; permute columns if labels switched.
- `length(log_liks)` $=$ iterations $+1$; $=$ `max.iter+1`: stopped at the cap, not converged, rerun longer. All means equal: every row of `P_ik` is $\pi^0$, stuck at $\bar x$ after 2 iterations.
- **More bugs:** `pi.new=colSums(P_ik)`: $\pi$ sums to $n$, $l$ jumps by $n\log n$ yet still rises. `mu.new=colSums(P_ik*X)/sum(P_ik)`: $l$ can fall, loop stops, looks converged.
- **Say:** $l$ rises every iteration and levels off, so it has converged.

## BAYES

### Bayes

Frequentist: $\theta$ fixed, probability = long-run frequency. Bayesian: $\theta$ random, probability = degree of belief.

$$
p(\theta|x)=\frac{f(x|\theta)p(\theta)}{f(x)}\propto f(x|\theta)\,p(\theta)
$$

Likelihood $\times$ prior. Marginal $f(x)=\int f(x|\theta)p(\theta)d\theta$. **Point estimate:** posterior mean (minimises squared error loss). **Credible interval:** central 95% of the posterior, a direct probability statement about $\theta$. Normal posterior: mean $\pm1.96$ sd; samples: `quantile(th,c(.025,.975))`.

**Kernels:** **Gamma$(a,b)$:** $\tau^{a-1}e^{-b\tau}$. **InvGamma$(a,b)$:** $x^{-a-1}e^{-b/x}$. **Normal:** $e^{-\frac A2\mu^2+B\mu}$ is $\mathrm{N}(B/A,1/A)$. **Beta$(a,b)$:** $\theta^{a-1}(1-\theta)^{b-1}$.

**In $\lambda$:** Poisson likelihood is $\lambda^{\sum y_i}e^{-n\lambda}$, Exp is $\lambda^ne^{-\lambda\sum y_i}$: Gamma kernels. Exp(rate $b$) = Gamma$(1,b)$.

**Recipe:** joint $\to$ keep factors with the parameter $\to$ add exponents $\to$ name the kernel. Summaries: $\sum(x_i-c)^2=\sum(x_i-\bar x)^2+n(\bar x-c)^2$. ***$\tau^{n/2}$ is constant for $\mu$ but not for $\tau$: keep it. Each prior appears once.***

| Likelihood ($n$) | Prior | Posterior |
| --- | --- | --- |
| Bin$(m,\theta)$ | Beta | Beta$(a+\sum y_i,\ b+nm-\sum y_i)$ |
| Geom ($x{\ge}1$) | Beta | Beta$(a+n,\ b+\sum y_i-n)$ |
| Poisson$(\lambda)$ | Gamma | Gamma$(a+\sum y_i,\ b+n)$ |
| Exp(rate $\lambda$) | Gamma | Gamma$(a+n,\ b+\sum y_i)$ |
| $\mathrm{N}(\mu_0,1/\tau)$ | Gamma | Gamma$(a+\frac n2,\ b+\frac12S)$ |
| $\mathrm{N}(\mu_0,\sigma^2)$ | InvG | InvGamma$(a+\frac n2,\ b+\frac12S)$ |

$S=\sum(x_i-\mu_0)^2$. ***$\mathbb{E}[\sigma^2|x]=b_n/(a_n-1)$, not $1/\mathbb{E}[\tau|x]=b_n/a_n$.*** Poisson$(t_i\lambda)$: rate $b+\sum t_i$.

**Normal mean, $\sigma^2$ known:** prior $\mathrm{N}(\mu,\sigma^2/n_0)$ ($n_0$ = implicit sample size):

$$
\theta|x\sim\mathrm{N}\Big(\frac{n_0\mu+n\bar x}{n_0+n},\ \frac{\sigma^2}{n_0+n}\Big)
$$

Prior $\mathrm{N}(m,s^2)$: precisions add: variance $(\frac1{s^2}+\frac n{\sigma^2})^{-1}$, mean = variance $\times(\frac m{s^2}+\frac{n\bar x}{\sigma^2})$. $\bar X\sim\mathrm{N}(m,\frac{\sigma^2}n+s^2)$ marginally.

**Posterior mean** is a precision-weighted average of prior mean and MLE. Variance is below both prior and MLE variance. $n\to\infty$: $\to\mathrm{N}(\bar x,\sigma^2/n)$, prior forgotten. $n_0\to0$: flat prior. Weight on the prior mean $w=\kappa_0/(\kappa_0+n\tau)=n_0/(n_0+n)$; $\kappa_0\approx n\tau$ gives the prior half the say.

**Posterior predictive:** $p(\tilde x|x)=\int p(\tilde x|\theta)p(\theta|x)d\theta$. Normal: $\mathrm{N}$(post. mean, post. var $+\ \sigma^2$). Simulate: $\theta^{(l)}\sim p(\theta|x)$, then $\tilde x^{(l)}\sim p(\tilde x|\theta^{(l)})$; average. Known mean $\mu_0$, $\tau|x\sim\mathrm{Gamma}(a^*,b^*)$: 3-parameter $t$ with $\nu=2a^*$, location $\mu_0$, scale$^2$ $s^2=b^*/a^*$, pdf $\propto(1+\frac{(x-\mu_0)^2}{\nu s^2})^{-(\nu+1)/2}$. Poisson-Gamma: $\mathrm{Var}\tilde y=\mathbb{E}[\lambda|y]+\mathrm{Var}(\lambda|y)$; $P(\tilde y=0)=(\frac{b_n}{b_n+1})^{a_n}$.

**Pseudo-counts:** Beta$(a,b)$ acts like $a+b$ prior trials; Beta(1,1) = U(0,1). Poisson-Gamma mean: $\frac{a+\sum y_i}{b+n}=w\frac ab+(1-w)\bar y$, $w=\frac b{b+n}$. $\mathrm{Var}(\lambda|y)=a_n/b_n^2$. Exp-Gamma mean: weight $\frac b{b+\sum x_i}$ on $a/b$, rest on $n/\sum x_i$. Gamma interval: mean $\pm1.96$ sd is a shortcut; exact uses quantiles.

**Marginals:** Beta-binomial $P(X{=}x)=\binom mx B(a+x,b+m-x)/B(a,b)$; Poisson-Gamma gives NegBin. Poisson-Gamma $p(y)=\frac{\Gamma(a+y)}{\Gamma(a)y!}\frac{b^a}{(b+1)^{a+y}}$, $\mathrm{Var}=\mu+\mu^2/a$. $X_1,X_2$ iid only given $\lambda$: $\mathrm{Cov}=\mathrm{Var}\lambda>0$.

**Priors:** **vague** $\mathrm{N}(0,10^4)$, $\mathrm{Gamma}(.001,.001)$; **informative**: concentrated. **Improper:** does not integrate to 1, $p(\mu)\propto1$, $p(\tau)\propto1/\tau$ (Gibbs: $a=b=0$); fine if the posterior is proper ($p(\lambda)\propto1/\lambda$, Poisson: Gamma$(\sum y_i,n)$, needs $\sum y_i>0$). $p(\mu,\sigma^2)\propto1/\sigma^2$ goes straight into $\pi$ in MH. Flat $\mu$, $\tau$ known: $\mathrm{N}(\bar x,\frac1{n\tau})$. $p(\tau)\propto1/\tau$, mean known: $\mathrm{Gamma}(\frac n2,\frac S2)$. Flat $\mu$ and $1/\tau$: $\tau|x\sim\mathrm{Gamma}(\frac{n-1}2,\frac12\sum(x_i-\bar x)^2)$, needs $n\ge2$. $x_i\sim\mathrm{N}(0,\sigma^2)$, $p(\sigma^2)\propto1/\sigma^2$: $\mathrm{InvGamma}(\frac n2,\frac12\sum x_i^2)$, mean $\sum x_i^2/(n-2)$ if $n\ge3$.

**BUGS:** `dnorm(m,p)`: second argument is a ***precision***: `mu~dnorm(0,.001)` is $\mathrm{N}(0,1000)$, vague. Vague prior: expect mean $\approx\bar y$, sd $\approx1/\sqrt{n\tau}$.

**Spike prior:** $\gamma$ discrete: $p(\gamma|x)\propto p(x|\gamma)p(\gamma)$, with $p(x|\gamma)=\int p(x|\mu)p(\mu|\gamma)d\mu$; sample $\gamma$, then $\mu|\gamma,x$.

**Conjugate exp family:** $f=\alpha(x)e^{x\theta+\beta(\theta)}$, prior $\propto e^{\gamma\theta+\delta\beta(\theta)}$: posterior $(\gamma+x,\delta+1)$.

**Bayes estimator:** minimise posterior expected loss; squared error gives posterior mean. **Bayesian GLM:** vague priors $\beta_j\sim\mathrm{N}(0,10^4)$; overdispersion: add $\varepsilon_i\sim\mathrm{N}(0,1/\tau)$ to $\eta_i$, or $\lambda_i\sim\mathrm{Gamma}$ per unit. **Joint prior** $\mu|\tau$, $\tau$: exact posterior (VI box), so sample $\tau$ then $\mu$, no MCMC.

## SIMULATION

### Simulation

**Monte Carlo:** $\frac1N\sum g(X_j)\approx\mathbb{E} g(X)$; proportions estimate probabilities. `set.seed` makes it repeatable. Need $N\ge\hat p(1-\hat p)/\mathrm{se}^2$ (at most $.25/\mathrm{se}^2$). ***sd of draws is the posterior spread, fixed; MC s.e. = sd$/\sqrt N$ shrinks.***

**Discrete:** $U\sim$ U(0,1); `x<-0; while(F(x)<U) x<-x+1`. Ends with $F(x-1)<U\le F(x)$, so $P(X=x)=F(x)-F(x-1)=p(x)$. **Read a pmf from a loop:** `while(U>G(Y)) Y<-Y+1` means $F=G$, then difference it. `sample(x,n,replace=TRUE,prob=p)`. Expected comparisons: $\sum$ (tests needed) $\times$ prob, so test likely values first.

**Inversion:** $Y=F^{-1}(U)$: $P(Y\le y)=P(U\le F(y))=F(y)$. Needs $F^{-1}$. Exp$(\lambda)$: $-\log(1-U)/\lambda$; U$(a,b)$: $a+(b-a)U$; logistic: $\log\frac U{1-U}$; Weibull: $(-\log U)^{1/k}/\lambda$. Pdf $2x$ on (0,1): $\sqrt U$. $e^{-z}$ on (0,1): $-\log(1-U(1-e^{-1}))$.

**Rejection, uniform:** $f\le k$ on $[a,b]$. (1) $X\sim$ U$(a,b)$, $Y\sim$ U$(0,k)$. (2) If $Y<f(X)$ return $X$, else go to 1.

**General:** envelope density $h$, $k\ge\sup_xf(x)/h(x)$. (1) $X\sim h$. (2) $Y\sim$ U$(0,kh(X))$. (3) If $Y<f(X)$ return $X$, else go to 1. Works with unnormalised $f^*$ (posterior): $k\ge\sup f^*/h$. Prior as $h$: $k=\max_\theta p(x|\theta)$, keep if $U\le p(x|\theta)/k$. ***$k$ too small biases the output*** (where $f>kh$ is under-sampled); too big only slows. $h$ tails at least as heavy as $f$.

**Why rejection works:** $(X,Y)$ is uniform under $kh$ (density $1/k$); points kept are uniform under $f$, so $X\sim f$.

**Derive output pdf:** $P(X\le x|\text{accept})=P(X\le x,\text{accept})/P(\text{accept})=\int_{-\infty}^xh(t)\frac{f(t)}{kh(t)}dt\big/\frac1k=F(x)$.

**Efficiency:** expected candidates per sample. $P(\text{accept})=1/k$ (with $f^*$: $\int f^*/k$). $N\sim$ Geom$(1/k)$, $\mathbb{E} N=k$ ($f^*$: $k/\int f^*$). Least rejection: smallest valid $k$, $h$ close to $f$. Uniform envelope: rectangle height $\sup f$ on $[a,b]$, so $k=(b-a)\sup f$. Then accept if $U\le f^*(X)/\max f^*$.

**Gamma(shape $m$, rate $\lambda$)**, $m>1$, $h=\mu e^{-\mu x}$: $f/h$ peaks at $x=\frac{m-1}{\lambda-\mu}$. Best $\mu=\lambda/m$, $k^*=m^me^{-(m-1)}/\Gamma(m)$. $k^*=\infty$ if $m<1$ or $\lambda\le\mu$.

### Maid Mast Codes PT3: Simulation

- `x<-runif(1,a,b); y<-runif(1,0,K); if(y<fx(x)) return(x)`: rejection.
- `X<- -log(runif(1))*m/lambda`: Exp(rate $\lambda/m$) by inversion.
- `tha<-rbeta(N,2,3); X<-rbinom(N,10,tha); table(X)/N`: marginal pmf by simulating parameter then data.
- `while(runif(1)>p) Y<-Y+1` from $Y=0$: failures before first success, $P(Y=y)=p(1-p)^y$.
- `xt<-rbinom(N,10,theta)`: each draw uses its own $\theta$, so `mean(xt>=8)` is predictive. Label then $x$ is a mixture draw.

## MCMC

### MCMC

build a Markov chain whose stationary distribution is the posterior. Long-run draws are dependent but approximately from the posterior.

### Metropolis-Hastings

target $\pi\propto p(\theta)p(x|\theta)$ (constant not needed). **Proposal** $q(\theta,\theta')$: density of new $\theta'$ given current $\theta$; must be simulable.

(1) Start $\theta^{(0)}$, $t=0$. (2) Propose $\theta'\sim q(\theta^{(t)},\cdot)$. (3)

$$
A=\min\Big(1,\ \frac{\pi(\theta')\,q(\theta',\theta)}{\pi(\theta)\,q(\theta,\theta')}\Big)
$$

(4) With probability $A$ set $\theta^{(t+1)}=\theta'$, else $\theta^{(t+1)}=\theta$ ($U\le A$). (5) $t\leftarrow t+1$, go to 2.

**Random walk:** $\theta'=\theta+$ symmetric noise (U$[-\epsilon,\epsilon]$, $\mathrm{N}(0,\epsilon^2)$): $q$ cancels, $A=\min(1,\pi(\theta')/\pi(\theta))$. Uphill always accepted, downhill sometimes, so time spent $\propto\pi$. **Independence:** $q(\theta,\theta')=q(\theta')$, so $A=\min\{1,w(\theta')/w(\theta)\}$, $w=\pi/q$. **Walk on $\log\tau$:** extra factor $\tau'/\tau$.

**Numeric $A$ recipe:** (i) $\pi$ = likelihood $\times$ prior at new and current. (ii) $q$ ratio: top is density of proposing ***current from new***, bottom new from current. Multi-part proposals multiply: $\tau_n\sim g(\cdot|\tau_c)$, $\mu_n\sim h(\cdot|\mu_c,\tau_n)$ gives $q(c,n)=g(\tau_n|\tau_c)h(\mu_n|\mu_c,\tau_n)$, $q(n,c)=g(\tau_c|\tau_n)h(\mu_c|\mu_n,\tau_c)$. (iii) Cancel common constants only. (iv) $\min(1,\cdot)$. Out of support: $\pi=0$, $A=0$. Log form (symmetric $q$): `A<-min(1,exp(lp(new)-lp(cur)))`; else add log $q$ ratio.

**Ledger:** one line each: likelihood (keep $\tau^{n/2}$), each prior (keep $\sqrt\tau$), each proposal, multiply, $\min(1,\cdot)$. A correct unfinished ledger still scores.

**Proposal ratios** $q(c|n)/q(n|c)$: Gamma$(k$, rate $k/\tau_c)$: $(\tau_c/\tau_n)^{2k-1}e^{-k\tau_c/\tau_n+k\tau_n/\tau_c}$ ($k=1$: Exp, mean $\tau_c$). Exp(rate $\tau_c$): $\tau_n/\tau_c$. $\mu_n\sim\mathrm{N}(\mu_c,1/\tau_n)$: $\sqrt{\tau_c/\tau_n}\,e^{-\frac12(\tau_c-\tau_n)(\mu_n-\mu_c)^2}$. Walk on $\log\tau$: $\tau_n/\tau_c$. Same variance both ways: 1.

**Symmetric?** Swap current and new: same formula for every pair. $\mathrm{N}(\theta_c,s^2)$ yes; $\mathrm{N}(0,1)$, Exp(rate $1/\theta_c$) no. ***Leave $q$ out and it runs silently on the wrong target.*** `dunif` prior out of range: log is $-$Inf, rejected. Normal step on $\tau$ can go negative: $\pi=0$, wasted. Independence: $q$ tails as heavy as $\pi$, else sticky.

**Tuning:** want large moves and high acceptance; they compete, so aim for intermediate $A$. Tiny steps: high acceptance, slow crawl. Huge steps: low acceptance, sticky. Both: high autocorrelation, low ESS. Rule of thumb (not slides): 20–50% accepted.

**Read $\pi$ off $A$:** symmetric $q$ and $A=\min(1,r(\theta_n)/r(\theta_o))$ give $\pi\propto r$.

**Why it works (not examinable):** detailed balance $\pi(\theta)p(\theta\to\theta')=\pi(\theta')p(\theta'\to\theta)$ makes $\pi$ stationary; aperiodic, irreducible: limiting; ergodic: averages converge.

**MH derivation, $x\sim\mathrm{N}(\mu,1)$, $\mu\sim\mathrm{N}(0,1)$, random walk:** $\log\frac{\pi(\mu')}{\pi(\mu)}=-\frac12[(x-\mu')^2+\mu'^2]+\frac12[(x-\mu)^2+\mu^2]$; $A=\min(1,e^{\text{this}})$.

### Gibbs sampler

needs only full conditionals. $\theta=(\theta_1,\dots,\theta_k)$. Start $\theta^{(0)}$. Each sweep: $\theta_j^{(t+1)}\sim p(\theta_j|x,\text{latest values of others})$, $j=1,\dots,k$. Discard burn-in $m$; keep the rest as a dependent sample; marginals: keep that coordinate.

**Use output:** $\mathbb{E}[g(\theta)|x]\approx$ average of $g(\theta^{(t)})$ after burn-in; $P(\theta>c|x)\approx$ proportion above $c$; credible interval from sample quantiles. ***Apply $g$ to each draw, then average:*** $\mathbb{E}[\mu\theta]$ = mean of products; $\mathbb{E}\sigma\ne1/\sqrt{\mathbb{E}\tau}$; mean of ratios $\ne$ ratio of means. Difference: $\delta^{(t)}=\mu_1^{(t)}-\mu_2^{(t)}$, then `mean(d<0)`.

**Special case of MH:** proposal = full conditional, so $A=1$. **Limit:** strong correlation between coordinates gives tiny moves and slow exploration. Bivariate, correlation $\rho$: lag-1 autocorrelation of one coordinate is $\rho^2$.

**Not a named distribution?** Finite support: sample with weights (R normalises `prob`). Otherwise an MH step for that coordinate.

**Check before dropping a prior:** does it contain the parameter you condition on? Scheme answer: start values ($\tau^{(0)}>0$), each draw with the ***newest*** values, drop burn-in, average.

**Standard conditionals** ($x_i\sim\mathrm{N}(\mu,1/\tau)$, $S=\sum(x_i-\mu)^2$):
- $\mu\sim\mathrm{N}(m,\frac1\kappa)$: $\mu|\tau,x\sim\mathrm{N}\big(\frac{\kappa m+\tau n\bar x}{\kappa+n\tau},\frac1{\kappa+n\tau}\big)$.
- $\mu|\tau\sim\mathrm{N}(m,\frac1{\kappa\tau})$: $\mu|\tau,x\sim\mathrm{N}\big(\frac{\kappa m+n\bar x}{\kappa+n},\frac1{(\kappa+n)\tau}\big)$.
- $\tau\sim\mathrm{Gamma}(a,b)$: $\tau|\mu,x\sim\mathrm{Gamma}(a+\frac n2,b+\frac S2)$; with the $\mu|\tau$ prior: $\mathrm{Gamma}(a+\frac{n+1}2,b+\frac S2+\frac\kappa2(\mu-m)^2)$.
- $\sigma^2\sim\mathrm{InvGamma}(a,b)$: $\mathrm{InvGamma}(a+\frac n2,b+\frac S2)$; prior $\mu|\sigma^2\sim\mathrm{N}(m,\sigma^2/\kappa)$: $\mathrm{InvGamma}(a+\frac{n+1}2,b+\frac S2+\frac\kappa2(\mu-m)^2)$.
- **Two samples** $x$ ($n_1$), $y$ ($n_2$), common $\tau$: $\mathrm{Gamma}(a+\frac{n_1+n_2}2,b+\frac{S_x+S_y}2)$; $\mu_1$ uses $x$ only.
- **One $\mu$, two sources:** $x_i\sim\mathrm{N}(\mu,\frac1\tau)$ ($n$), $y_j\sim\mathrm{N}(c\mu,\frac1{d\tau})$ ($m$), $\mu\sim\mathrm{N}(\mu_0,\frac1\kappa)$: $A=\kappa+(n+c^2dm)\tau$, $B=\kappa\mu_0+\tau(\sum x_i+cd\sum y_j)$; $\tau|\cdot\sim\mathrm{Gamma}(a+\frac{n+m}2,b+\frac12[\sum(x_i-\mu)^2+d\sum(y_j-c\mu)^2])$.
- **Hierarchical:** $y_{ij}\sim\mathrm{N}(\theta_j,\frac1\tau)$, $\theta_j\sim\mathrm{N}(\mu,\frac1{\tau_\theta})$, $\mu\sim\mathrm{N}(m,\frac1\kappa)$: $\theta_j|\cdot$ precision $n_j\tau+\tau_\theta$, mean $(n_j\tau\bar y_j+\tau_\theta\mu)/$prec (weight $n_j\tau/$prec on $\bar y_j$); $\mu|\cdot$ precision $\kappa+J\tau_\theta$, mean $(\kappa m+\tau_\theta\sum\theta_j)/$prec (no $y$); $\tau_\theta|\cdot\sim\mathrm{Gamma}(a+\frac J2,b+\frac12\sum(\theta_j-\mu)^2)$.
- **Bivariate prior**, $\Lambda=\Sigma^{-1}$, zero mean, $x_i\sim\mathrm{N}(\mu_1,\sigma^2)$: $-\frac12(\Lambda_{11}\mu_1^2+2\Lambda_{12}\mu_1\mu_2+\Lambda_{22}\mu_2^2)$ in the exponent gives $A=\Lambda_{11}+n/\sigma^2$, $B=n\bar x/\sigma^2-\Lambda_{12}\mu_2$: $\mu_1|\mu_2,x\sim\mathrm{N}(B/A,1/A)$.
- **Change point:** $Y_i\sim$ Pois$(\lambda_1)$, $i\le m$; Pois$(\lambda_2)$, $i>m$; Gamma priors; $m$ uniform on $1..n$: $\lambda_1|\cdot\sim\mathrm{Gamma}(\alpha_1+\sum_1^my_i,\beta_1+m)$; $\lambda_2|\cdot\sim\mathrm{Gamma}(\alpha_2+\sum_{m+1}^ny_i,\beta_2+n-m)$; $p(m|\cdot)\propto(\lambda_1/\lambda_2)^{\sum_1^my_i}e^{(\lambda_2-\lambda_1)m}$.
- **Exp change point:** $\lambda_1|\cdot\sim\mathrm{Gamma}(a_1+M,b_1+S_M)$, $\lambda_2|\cdot\sim\mathrm{Gamma}(a_2+n-M,b_2+S_n-S_M)$, $S_m=\sum_1^my_i$; $p(m|\cdot)\propto(\lambda_1/\lambda_2)^me^{-(\lambda_1-\lambda_2)S_m}$.
- **Hidden count:** $X|p,N\sim$ bin$(N,p)$, $p\sim$ Beta$(a,b)$, $N\sim$ Pois$(\lambda)$: $p|\cdot\sim$ Beta$(x+a,N-x+b)$; $N-x|\cdot\sim$ Pois$(\lambda(1-p))$.
- **Discrete $\mu\in\{0,1\}$:** $P(\mu=1|\theta)=f(\theta,1)/[f(\theta,0)+f(\theta,1)]$.
- **Two groups, flat priors,** $p(\tau)\propto1/\tau$: $\mu_1|\cdot\sim\mathrm{N}(\bar x,\frac1{n\tau})$, $\mu_2|\cdot\sim\mathrm{N}(\bar y,\frac1{m\tau})$, $\tau|\cdot\sim\mathrm{Gamma}(\frac{n+m}2,\frac12[\sum(x_i-\mu_1)^2+\sum(y_j-\mu_2)^2])$.
- **Poisson two sources:** $y_i\sim$ Pois$(\lambda)$ ($n$), $z_j\sim$ Pois$(c\lambda)$ ($m$): $\lambda|\cdot\sim\mathrm{Gamma}(a+\sum y_i+\sum z_j,b+n+cm)$.
- **Poisson hierarchy:** $\lambda_j|\beta\sim\mathrm{Gamma}(\alpha,\beta)$, $\beta\sim\mathrm{Gamma}(c,d)$: $\lambda_j|\cdot\sim\mathrm{Gamma}(\alpha+\sum_iy_{ij},\beta+n_j)$; $\beta|\cdot\sim\mathrm{Gamma}(c+J\alpha,d+\sum\lambda_j)$.

**Derivation, Gibbs $\mu$:** $p(\mu|\tau,x)\propto\exp\{-\frac\tau2\sum(x_i-\mu)^2-\frac\kappa2(\mu-m)^2\}\propto\exp\{-\frac12(n\tau+\kappa)\mu^2+(\tau n\bar x+\kappa m)\mu\}$: $A=n\tau+\kappa$, $B=\tau n\bar x+\kappa m$.

### MCMC diagnostics

(1) Converged? (2) How correlated?

**Trace plots:** run several chains from **overdispersed** starts (more variable than the target). Good: chains overlap, stable, “hairy caterpillar”. Separate or drifting: not converged. Slow wander, “woolly snake”: high autocorrelation. **Burn-in:** discard early iterations affected by the start; read length off the trace.

**BGR:** $M$ chains, each length $L+T$; keep last $T$. **B** = sd of the pooled $MT$ draws (between). **W** = average of the $M$ within-chain sds (within). $\hat R=B/W<1.05$: accept last $T$ as stationary and pool. $\hat R\gg1$: not converged. $T\to\infty$: $\hat R\to1$. ***Exclude burn-in from $\hat R$.***

**Trace vs step size:** tiny steps: smooth wander; huge steps: flat runs then jumps; good: fuzzy band. Accept near 1 and smooth: raise step. Low accept and plateaus: lower it. Gibbs accepts all, so use ACF, ESS, trace.

**Not converged:** run longer, better proposal. A pass is no proof: all starts may miss a region.

**Autocorrelation:** lag $k$: $\rho_k=\mathrm{cor}(\theta^{(t)},\theta^{(t+k)})$; `acf(chain)`; `cor(chain[-n],chain[-1])` is $\hat\rho_1$. **Thinning:** keep every $k$th; simple, saves memory, throws away information. ESS never rises. `acf(x,plot=FALSE)$acf[2]` $=\hat\rho_1$ (entry 1 is lag 0); bars above the dashed band are real. `mean(diff(x)!=0)`: acceptance rate.

**ESS:** independent sample size with the same information: $n/(1+2\sum_i\rho_i)\approx n\frac{1-\rho_1}{1+\rho_1}$. Aim ESS $>4000$ (slides). E.g. $n=5000$, $\rho_1=.9$: ESS $\approx263$. Naive SE too small by $\sqrt{(1+\rho_1)/(1-\rho_1)}$. $n$ for a target ESS: target$\times\frac{1+\rho_1}{1-\rho_1}$.

**Accuracy:** $\mathrm{Var}(\bar h)\approx\frac{\sigma^2}n(1+2\sum\rho_i)$: iid SE is too small. MC s.e.: iid $s/\sqrt N$; proportion $\sqrt{\hat p(1-\hat p)/N}$; chain $s/\sqrt{\mathrm{ESS}}$. Posterior sd does not shrink with $N$. **Blocking:** MC error $=$ sd(block means)$/\sqrt Q$; want $\le5\%$ of posterior sd. Same as ESS $\ge400$ (5% rule).

### Maid Mast Codes PT4: MCMC

- `prob<-dtarget(prop)/dtarget(cur); if(runif(1)<prob) accept`: symmetric MH. `is.nan` guard. `proposal<-rnorm(2,chain[i,],sd)`: random walk.
- `acceptance<-1-mean(duplicated(chain[-(1:burnIn),]))`: after burn-in. `chain[-(1:burnIn),]` drops burn-in.
- `la1<-rgamma(1,a1+cfreq[M],b1+M)`: Gamma(shape, rate); `cfreq<-cumsum(freq)` gives $\sum_1^my_i$.
- `M<-sample(1:n,1,prob=(la1/la2)^cfreq*exp((la2-la1)*(1:n)))`: discrete conditional.
- `rnorm(1,mu1+(x2-mu2)*s12/s2,sqrt(s1-s12^2/s2))`: Gibbs, sd not var.
- `cumsum(x)/1:n`: running mean, should flatten. `mean(th>0)`: posterior probability. `s[seq(1,n,by=k),]`: thin.
- `1/rgamma(1,a,b)`: $\mathrm{InvGamma}$ draw. `rnorm(1,m,sqrt(1/A))`: sd is the root of the variance.

## VARIATIONAL INFERENCE

### Variational inference

turns inference into optimisation: find $q^*\in D$ nearest the posterior. Faster for large data and complex models, at a cost in accuracy.

**KL:** $KL(q\|p(\theta|y))=\int q(\theta)[\log q(\theta)-\log p(\theta|y)]d\theta\ge0$. Not symmetric. Penalises $q$ for mass where $p$ is tiny, not for missing mass, so $q$ sits inside $p$.

**ELBO:** $p(\theta|y)$ unknown, but $KL=-ELBO+\log p(y)$ with

$$
ELBO(q)=-\int q[\log q-\log p(\theta)p(y|\theta)]d\theta
$$

$=\mathbb{E}_q[\log p(\theta,y)]-\mathbb{E}_q[\log q]$. $\log p(y)$ is free of $q$, so **min KL = max ELBO**; $KL\ge0$ gives $\log p(y)\ge ELBO$. $\log p(y)=ELBO+KL$: the gap is the KL.

**Mean field:** $q(\theta)=\prod_jq_j(\theta_j)$: parameters independent under $q$. An assumption on the approximation, ***not on the model***.

**CAVI:** update one factor at a time, others fixed: $q_j^*(\theta_j)\propto\exp\{\mathbb{E}_{-j}[\log p(\theta,y)]\}$. ELBO rises to a local optimum (a drop means a bug). Stop when ELBO change is small. Sensitive to initial values: run several, keep highest ELBO. It updates distributions; it draws no samples. Checks: ELBO never falls, stays $\le\log p(y)$.

**Recipe:** (1) $\log p(\theta,y)$ = log likelihoods + log priors. (2) Keep terms with $\theta_j$. (3) Take $\mathbb{E}$ over the others (linear). (4) Collect powers, name the kernel. Same kernel as Gibbs, with terms in other parameters replaced by their expectations.

**Use:** $\mathbb{E}(x-\mu)^2=(x-\mathbb{E}\mu)^2+V\mu=\sigma^{2*}+\mu^{*2}-2x\mu^*+x^2$; $\mathbb{E}\mu^2=(\mathbb{E}\mu)^2+V\mu$; $\mathbb{E}\tau=a^*/b^*$; $\mathbb{E}\log\tau=\psi(a^*)-\log b^*$; $\mathbb{E}[1/\sigma^2]=a^*/b^*$. ***$q_\mu$ uses $\mathbb{E}[1/\sigma^2]$, not $1/\mathbb{E}\sigma^2$.***

**Normal-Gamma:** $x_i\sim\mathrm{N}(\mu,\frac1\tau)$, $\mu|\tau\sim\mathrm{N}(\mu_0,\frac1{\lambda_0\tau})$, $\tau\sim\mathrm{Gamma}(a_0,b_0)$:

$q_\mu^*=\mathrm{N}(\mu^*,\sigma^{2*})$: $\mu^*=\frac{\lambda_0\mu_0+n\bar x}{\lambda_0+n}$, $\sigma^{2*}=\frac1{(\lambda_0+n)\mathbb{E}\tau}$.

$q_\tau^*=\mathrm{Gamma}(a^*,b^*)$: $a^*=a_0+\frac{n+1}2$, $b^*=b_0+\frac12\sum_{i}\mathbb{E}(x_i-\mu)^2+\frac{\lambda_0}2\mathbb{E}(\mu-\mu_0)^2$.

Only $\sigma^{2*}$ and $b^*$ change between iterations. **Variance form** $\sigma^2\sim\mathrm{InvGamma}(a_0,b_0)$, $\mu|\sigma^2\sim\mathrm{N}(\mu_0,\sigma^2/\lambda_0)$: $q_{\sigma^2}^*$ is $\mathrm{InvGamma}$ with the same two parameters.

**Independent priors** $\mu\sim\mathrm{N}(m,\frac1\kappa)$, $\tau\sim\mathrm{Gamma}(a,b)$: $q_\mu^*=\mathrm{N}(\frac{\kappa m+n\bar x\mathbb{E}\tau}{\kappa+n\mathbb{E}\tau},\frac1{\kappa+n\mathbb{E}\tau})$; $q_\tau^*=\mathrm{Gamma}(a+\frac n2,\ b+\frac12[\sum(x_i-\mathbb{E}\mu)^2+nV\mu])$. ***Shape $a+\frac n2$, not $\frac{n+1}2$***; here both factors move each round. **Two sources,** $y_j$ variance $d\sigma^2$: $\mathbb{E} Q=\sum(x_i-\mathbb{E}\mu)^2+nV\mu+\frac1d[\sum(y_j-\mathbb{E}\mu)^2+mV\mu]$, shape $a+\frac{n+m}2$.

**Exact:** $\mu|\tau,x\sim\mathrm{N}(\frac{\lambda_0\mu_0+n\bar x}{\lambda_0+n},\frac1{(\lambda_0+n)\tau})$, $\tau|x\sim\mathrm{Gamma}(a_0+\frac n2,b_0+\frac12\sum(x_i-\bar x)^2+\frac{n\lambda_0(\bar x-\mu_0)^2}{2(\lambda_0+n)})$. $\mathrm{Var}(\mu|x)=\frac{b_n}{(n+\lambda_0)(a_n-1)}$.

**Bivariate Normal target:** $\Lambda=\Sigma^{-1}$: $q_1^*=\mathrm{N}(\mu_1-\frac{\Lambda_{12}}{\Lambda_{11}}(\mathbb{E} x_2-\mu_2),\frac1{\Lambda_{11}})$. $1/\Lambda_{11}=\sigma_1^2-\sigma_{12}^2/\sigma_2^2<\sigma_1^2$: the conditional variance. Means right, but ***VI underestimates variance and ignores correlation***; worse as correlation rises. Error in the means shrinks by $\rho^2$ a round: strong correlation is slow too.

**ELBO, Normal-Gamma:** $\mathbb{E}[\log p(x,\mu,\tau)]-\mathbb{E}\log q_\mu-\mathbb{E}\log q_\tau$, with $\mathbb{E}\log q_\mu=-\frac12\log\sigma^{2*}+c$, $\mathbb{E}\log q_\tau=\log b^*-\log\Gamma(a^*)+(a^*-1)\psi(a^*)-a^*$.

**ELBO, bivariate target,** up to a constant, $q_i=\mathrm{N}(m_i,s_i^2)$: $-\frac12[\Lambda_{11}(s_1^2+(m_1-\mu_1)^2)+\Lambda_{22}(s_2^2+(m_2-\mu_2)^2)+2\Lambda_{12}(m_1-\mu_1)(m_2-\mu_2)]+\frac12\log s_1^2+\frac12\log s_2^2$.

**Bivariate prior** (Gibbs row): $q_1^*=\mathrm{N}(B/A,1/A)$ with $\mu_2$ replaced by $\mathbb{E}\mu_2$.

**Derivation, CAVI $\tau$:** $\log q_\tau^*=\mathbb{E}_\mu[\log p(x|\mu,\tau)+\log p(\mu|\tau)+\log p(\tau)]+c$ $=(\frac n2+\frac12+a_0-1)\log\tau-\tau[b_0+\frac12\sum\mathbb{E}(x_i-\mu)^2+\frac{\lambda_0}2\mathbb{E}(\mu-\mu_0)^2]+c$: power of $\log\tau$ is $a^*-1$, coefficient of $-\tau$ is $b^*$.

### MCMC vs VI

MCMC simulates the density, is heavier, asymptotically exact. VI approximates it, is faster, suits large data and model exploration, no guarantee, underestimates variance.

## EXAM CHECKS

- Define $P_{ik}$; state which $\theta^0$.
- State $H_0$, statistic, df, decision, sentence in context.
- CI on $\eta$ first, transform last.
- $\hat p$, $\hat{\mu}$ on response scale.
- $p$ includes intercept.
- $\hat{\phi}$: big model for $F$, own model for SE.
- Rate vs scale; variance vs sd in $\mathrm{N}$.
- Name distribution and every parameter.
- 4 dp inside, round once.
- $\mathrm{N}$(mean, variance), Gamma(shape, rate), $\mathrm{InvGamma}$(shape, scale).
