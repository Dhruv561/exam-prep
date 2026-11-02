# MAS cheat sheet working notes
## Style target (Modernia = Stats 2pp; Crown = LSM 4pp; both Word: Aptos + Cambria Math, 540x780pt pages)
- Portrait, 3-4 cols, black-ruled boxes filling whole page, ~6.5-7pt. Bold lead-in term then plain sentence.
- Yellow highlight on section-lead terms (Crown), magenta formulas, blue key words, red warnings/"NOTE".
- Tables: Scenario | Pivot | CI (Modernia p2). Conjugate table. MLE table. ANOVA tables.
- "Maid Mast Codes" R boxes: Consolas mono, bullet explanation of each output line, green R code.
- Q/A interpretive sentences (Crown p3-4): "Question: ... Answer: ..."
- Proof mini-panels (Crown p4 bottom right), "Hard subquestions" box.
- Plain English; proofs included as compressed lines; dfs always stated.
## Fonts: Aptos TTFs + Cambria Math available? check Word DFonts dir. Tectonic present (XeTeX). No pdflatex.
## Do NOT read: mas/final/cheatsheet.*, also skip reference/*cheatsheet.html
## Exam: 3h+15min, 9 Qs, 78 marks, 2dp, Casio FX82, 1 double-sided A4. Formula sheet gives pdf+mean only: Normal, Exp(rate), Gamma(shape,rate), InvGamma(shape,scale), Poisson, Categorical 2/3. NOT given: Binomial, Beta, variances, etc.
## Read so far: all lectures; extra-notes Challenger, obs info, Bliss, Gala, Trout, Faraway QL
## Facts to keep
- Challenger: CI uses 2*se in lecture note; Wald^2=16.54 vs LR 21.99; deviance 16.91 on 21 df; p=.716 adequate.
- Null deviance vs residual; D_null - D_res improvement. GOF: pchisq(D, df, lower=F). H0: fitted GLM adequate. Lack of fit could be overdisp, wrong mean, missing interaction: check residuals vs eta first.
- Trout: phihat 5.33 from bigger model; F=(913.56-64.5)/4/phihat=39.82 ~F4,12. anova(bmod2,bmod,dispersion=phihat,test="F"). drop1/step don't work for quasi per slides, though Faraway uses drop1(test="F").
- SE quasi = sqrt(phi) * SE. summary uses t values, AIC NA.
- Gala: halfnorm of hat, rstudent, cooks. z=predict(mod)+(y-mu)/mu linearised response for log link. obs with Scruz=0 influential.
- step(): AIC table, "- x" row with AIC lower than <none> means drop.
- Bliss: IWLS R: z=eta+(y-mu)*m/mu/(m-mu); w=mu*(m-mu)/m, lm(z~x,weights=w).
- Mixture note: mixture != linear combination. Non-bimodal mixture possible.
- EM: initialise, E, M, stop when incomplete-ll changes <eps; ll increases each step; run many starts, pick highest incomplete ll.
- Gamma rejection: h=mu e^{-mu x}, k*=..., best mu=lambda/m, k*=m^m e^{-(m-1)}/Gamma(m). Accept prob 1/k, N~geom(1/k), EN=k.
- Rejection with f* unnormalised: accept prob = (int f*)/k.
- Gibbs insect ex: X|p,N bin; p|x,N Beta(x+2,N-x+4); N-x|x,p Pois(16(1-p)).
- Coal change point: lambda1|.. Gamma(a1+sum_1^m y, b1+m), lambda2 Gamma(a2+sum_{m+1}^n, b2+n-m); p(m|..) propto (l1/l2)^{sum_1^m y} e^{(l2-l1)m}; discrete so sample() finite.
- MCMC diag: R-hat=B/W < 1.05, B=sd of pooled MT, W=avg within-chain sd; ESS=n/(1+2 sum rho)≈n(1-rho1)/(1+rho1); target ESS>4000; thinning; burn-in; overdispersed starts.
- VI: q*(theta)=argmin KL(q||p); KL=-ELBO+log p(y); ELBO=-∫q[log q - log p(theta)p(y|theta)]; log p(y)>=ELBO; mean field not model assumption; CAVI q_i* ∝ exp{E_-i log p(theta,y)}; sensitive to init, pick highest ELBO; VI underestimates variance.
- VI example: x_i~N(mu,1/tau), mu|tau~N(mu0,1/(lambda0 tau)), tau~Gamma(a0,b0). q_mu=N((lambda0 mu0+n xbar)/(lambda0+n),1/((lambda0+n)E tau)); q_tau=Gamma((n+1)/2+a0, b0+ sum E(x_i-mu)^2/2 + lambda0 E(mu-mu0)^2/2).

## Read: extra notes done (EM-updated, Jensen, Lagrange, CAVI, VI-3, VI_normal + correction, MH, Gibbs coal, Diagnostics, sampling, reject, gamma_sim, sim Gibbs, Markov; tutes 2-5 done)
- EM R: prob.x.z[i,k]=pi_k f(x_i;mu_k), P_ik=prob.x.z/rowSums(prob.x.z), pi.new=colSums(P_ik)/sum(P_ik) (sum=n), mu.new=colSums(P_ik*X)/colSums(P_ik), ill=sum(log(rowSums(prob.x.z))). max.iter stops early. label switching: same ll, permuted labels. overlap -> more start-sensitive.
- Jensen proof: l(th) >= Q(th,th0)+C, C=-sum q log q, equality at th0, M-step raises Q => l(th1)>=Q(th1,th0)+C>=Q(th0,th0)+C=l(th0)
- Lagrange: L=sum r_ik log pi_k + lam(1-sum pi_k); pi_k=sum r_ik/lam; sum over k -> lam=n. K=2 sub: dQ/dpi = N1/pi - N2/(1-pi)=0
- CAVI: E[(x-c)^2]=Var+(E-c)^2; E[log tau]=Psi(a)-log b; update a*=a0+(n+1)/2 fixed, m* fixed; only s2 and b* change. "We update distributions, not sample". ELBO=E[log p(x,mu,tau)]-E[log q_mu]-E[log q_tau]; E log q_mu=-(1/2) log s2 + const; E log q_tau=log b-logGamma(a)+(a-1)Psi(a)-a.
- MH R: A<-min(1,exp(posterior(proposal)-posterior(current))) log-post; U<=A accept; rnorm(3,mean=param,sd=...) symmetric RW; acceptance=1-mean(duplicated(chain[-(1:burnIn),])); chain[-(1:burnIn),]; dunif(log=T) prior gives -Inf outside.
- Gibbs coal R: cfreq=cumsum(freq); la1<-rgamma(1,a1+cfreq[M],b1+M); la2<-rgamma(1,a2+cfreq[n]-cfreq[M],b2+n-M); M<-sample(1:n,1,prob=(la1/la2)^cfreq*exp((la2-la1)*(1:n))) sample normalises. rgamma(n,shape,rate). acf(); thin: samples[seq(1,nrow(samples),by=thin),]; acf bars above CI band.
- Diagnostics additional: positive corr => iid sd S underestimates, CI too small; blocking; MC error <=5% posterior sd; "hairy caterpillar" vs "woolly snake"; Var(mean)=sigma^2/n (1+2 sum rho_i); rho_i≈rho1^i.
- rejection R: x<-runif(1,a,b); y<-runif(1,0,K); if(y<fx(x)) return(x). gamma.sim k=m^m exp(1-m)/gamma(m). X=-log(runif(1))*m/lambda
- discrete sim: x<-0; while(F(x)<U) x<-x+1; sample(c(0,1,2),n,replace=TRUE,prob=...)
- wk2: predict(model,newdata=list(..),type="response"/"link",se.fit=TRUE); ilogit(fit±2*se.fit); classification false pos/neg, cutoff tradeoff; Sign flip: marginal corr positive but coef negative b/c correlated predictors ("significant in presence of others").
- wk3: LR confidence region contour level qchisq(.95,2); LRT factor with 3 levels df=2. pchisq(dev2-dev1,2,lower.tail=F).
- wk4: binomial exp fam: theta=log(p/(1-p)), b=m log(1+e^theta), c=log choose(m,y). I(year^2) quadratic. discoveries.
- wk5: Gamma(link="identity"/"log"/inverse) t value not z; dispersion=sum(resid pearson^2)/df; anova(gmod,test="F"): F=(null_dev-model_dev)/1/phihat; offset(log(t)) rate model; coefficient of log t fixed to 1; log(lambda_i)=log t_i+x'beta; Cook's large but no change → still overdispersed.

## tutes 6-12 + review exercises read
- Review exercise (official-style): factor reference coding; exp(0.3716)=1.45 → 45% higher mean, multiplicative. p=n-df; l=p-AIC/2; l_S=l+D/2 (Poisson phi=1); LR*=D_A-D_B, s=df diff; compare chi2_s crit (chi2_{2,.95}=5.991). AIC separate, not a test. subtract residual deviances, not null. quasi: t* = beta/se_Q ~ t_{n-p}; CI beta ± t_{n-p,.975} se_Q, then exp. F=(DA-DB)/s/phihat ~ F_{s,n-pB}. Mixture Poisson: tau_i1 = 1/(1+ (lam2/lam1)^x e^{-(lam2-lam1)} ratio). N_k=sum tau_ik; pi=N_k/n; lambda=sum tau x/N_k. second derivative check. Poisson mixture can be overdispersed.
- wk7: Poisson mix Q: sum[ p(Z=1)(x log l1 - l1 - log x! + log pi1)+ p(Z=2)(... log(1-pi1)) ]; equal-start (lambda1=lambda2=5) stuck at lam 3.5, pi stays; ll -258 vs -229.8 → stuck saddle. label switching equal ll.
- wk8: posterior with N(mu,tau^2) prior: mean=(n tau^2 xbar+sigma^2 mu)/(n tau^2+sigma^2), var= sigma^2 tau^2/(n tau^2+sigma^2). marginal Xbar~N(mu,sigma^2/n+tau^2). Y.sim while(U>1-1/(1+Y)) Y++ → F(y)=1-1/(1+y), pmf 1/(y(y+1)). logistic F=1/(1+e^-x), F^-1(y)=log(y/(1-y)).
- wk9: beta-binomial sim: tha<-rbeta(N,2,3); X<-rbinom(N,10,tha). truncated exp rejection, rectangle height 1/(1-e^-1).
- wk10-11: MH bivariate normal RW sd 2.5 accept .46; sd .1 high accept, tiny moves, high autocorr; sd 10 low accept, sticky; both low ESS. rho estimate cor(chain[-n],chain[-1]). cumavg=cumsum/1:n. Gibbs bivariate: X1|X2=x2 ~ N(mu1+(x2-mu2)s12/s2^2, s1^2 - s12^2/s2^2). High corr (2.8) → slower Gibbs. Estimate prob: mean(success), cumsum(success)/1:n.
- wk12: CAVI bivariate normal: h=exp(-.5 (x-mu)'S^-1(x-mu)). q1*=N(mu1 - (Lambda12/Lambda11)(E x2 -mu2), 1/Lambda11) where Lambda = S^-1. var 1/Lambda11 = s1^2 - s12^2/s2^2 < s1^2: conditional variance. So VI underestimates marginal var; with corr .95 huge underestimation, ignores correlation. means: mu. 

## Assignments 2,3,4 read, A1 part
- A1: probit Fisher info I(beta)=sum m_i phi(eta)^2/(Phi(1-Phi)) x x' = X'WX; CI for p: eta0 se sqrt(x0' V x0) then Phi; LRT 2(l_F-l_R).
- 500-unit change log-odds: 500 beta1. odds ratio exp(500 beta1).
- A2: interaction * ; reference group; exp(sum coefs) for interaction cell; interaction model test chisq sig but F not after phihat 5.38; report on quasi. Ratio CI: exp(beta ± t_{.975,df} se). "76% more". Influential point: refit without, compare; retain unless recording error. Observational → association not causation. step()/drop1 not for quasi.
- A3: labelled batch: Q gets extra sum (x log l2 - l2 - log x!); pi divisor n (unlabelled only); lambda2 = (sum P_i2 x_i + sum_lab x_i)/(sum P_i2 + n'); incomplete ll = mixture part + labelled part. ll must never decrease — if decreases: code bug (M-step wrong). Hessian d2Q/dl2 <0 check max. Weighted mean interpretation.
- A4: x_i~N(75,1/tau), tau~Gamma(2,1) posterior Gamma(a+n/2,b+sum(x-mu)^2/2). Posterior predictive = t(nu=2a*, a=mu, b=b*/a*) 3-param t. Two-sample N(mu1,1), N(mu2,1/2) with bivariate normal prior: Gibbs conditionals normal; MH RW variance 0.1^2; CAVI: q factors normal; credible interval 5% each tail (quantile). 

## Exams 2020-22 patterns (read)
- A1 Gamma: log f=(nu-1)log y - lambda y + nu log lambda - logGamma(nu). phi=1/nu, theta=-lambda/nu=-1/mu, b=-log(-theta), a=phi, c=(1/phi-1)log y - log(phi)/phi - logGamma(1/phi). mu=-1/theta, b''=1/theta^2 → v=mu^2. Var=phi mu^2. R's inverse link 1/mu.
- Q1: iid sample: log-lik, Fisher info, MLE + asymptotic. rate 1/lambda param; N(1,1/tau) precision.
- Exp family exponential variance function.
- phiA vs phiB printed: use bigger model for F; SE quasi for model = SE poisson * sqrt(its OWN phi). "Compute F; dfs". "Calculate coefficient & se for modelD (quasi) from Poisson modelB": est same, se*sqrt(phiB).
- 2020 Q2(d) l_fitted from AIC; saturated l. reverse: se_poisson = se_quasi/ sqrt(phi).
- Mixture: 2 EM estimates -> compare incomplete log-lik by plugging in. P(Z=1|X=x) calc; classify.
- X51..X100 known component.. mean 0, unknown variances: M-step sigma1^2 = (sum P1 x^2 + sum known x^2)/(sum P1 + n'), p = sum P/50.
- N(0,1) vs N(0,sigma^2): mixture.
- Bayesian: x~N(mu,1), y~N(0,1/tau), mu|tau~N(0,1/tau), tau~Gamma(2,1) → Gibbs p(mu|tau,x,y) normal; MH with tau_n~Exponential(1/tau_c), mu_n~N(0,1/tau_n) → q ratio includes both; CAVI q*(tau) Gamma with E[mu]^2+V[mu].
- improper prior p(mu,sigma^2) ∝ 1/sigma^2; MH with sigma_n^2~Gamma(shape 5 sigma_c^2, rate 5), mu_n~N(mu_c, sigma_n^2).
- InvGamma: mu|s2~N(0,s2), s2~InvGamma(1,1): q*(s2)=InvGamma.
- bivariate normal prior; x~N(mu1,1), y~N(mu2,1): Gibbs: complete square; Sigma^-1 needed: 2x2 inverse; independence proposal mu1n~N(0,1), mu2n~N(mu2c,1) mix of independent + RW: q ratio only mu1 part matters. CAVI q1,q2 normal: E[mu2] in the mean.

## Exams 2017/18 + sols read
- odds change bmi 27.87 vs 36.90: O1/O2=exp(beta (x1-x2)), CI: Δ*(beta ± 1.96 se) then exp. 
- Fiji: offset; .L .Q ordered contrasts (off-syllabus). l_fit= p - AIC/2; l_sat=(D+2 l_fit)/2.
- Reasons model better: (1) smaller AIC; (2) chisq rejects smaller model.
- Bayes estimator under loss: (2017/18 old lecturer) minimise posterior expected loss; squared error → posterior mean. Keep 1 line.
- Rejection: minimise rejection with f∝ log(1+x) on [0,2]: uniform X, accept if Y<f*(X), Y~U(0,log3), k=sup f*. 
- MH stationary dist from acceptance formula: A=min(1,π(θn)/π(θo)) symmetric, so read off π.
- Discrete Gibbs: f(θ,µ|x) with µ∈{0,1}: θ|µ normal; µ|θ Bernoulli with prob ratio.
- Posterior predictive simulation: θ^(l)~p(θ|y), ỹ^(l)~p(ỹ|θ^(l)); mean(ỹ).
- Algorithm: U,V~U(0,1), if U+V<1 X=1-U → f(x)=2x, via P(X<=x)=P(1-U<=x | U+V<1).
- Improper: p(µ)∝1, p(τ)∝1/τ; τ|... ~Gamma((n1+n2)/2, S/2).
- Log-linear models 3-way (off syllabus 2017).
- Gibbs convergence: multiple chains widely separated, trace plots, BGR<1.05.

## Exams 2014,15,16,21special read
- Inverse Gaussian exp family (theta=1/mu^2 hint): v(mu)=mu^3, canonical 1/mu^2 (up to sign/ const). Check: f ∝ exp(-lambda (x-mu)^2/(2mu^2 x)). -lambda x/(2mu^2)+lambda/mu - lambda/(2x). phi=1/lambda, theta=-1/(2mu^2), b(theta)=-sqrt(-2theta)=-1/mu. b'=1/sqrt(-2 theta)=mu. b''=(−2θ)^{−3/2}=mu^3. canonical g=-1/(2mu^2).
- p-values of interaction twice: z Wald from Fisher info vs chi2 deviance diff (LRT preferred).
- "support linear assumption": interaction plots/ log(y) linear plots.
- EM mixture of Binomial(20,p): p_k = sum P x_i/(20 sum P).
- Spike prior: mu~N(1,1) if gamma=1, mu=0 if gamma=0, P(gamma=1)=.8: sample gamma|X then mu|gamma,X. p(X|gamma=1): N(1,2) marginal; p(X|gamma=0)=N(0,1). Compute posterior weights; if gamma=1 mu|X~N((1+2)/2,1/2).
- negbin Fisher scoring single param: p1=p0 + U(p0)/I(p0). Observed info. 
- Weibull: Y=X^k ~ Exponential(lambda^k) exp fam. Quasi-likelihood: specify link and v(mu)=mu^2 (var ∝ mean^2 with fixed k), estimate by IWLS, phi Pearson.
- Reasons to prefer: Outliers: largest jackknife/Cook. After removal re-evaluate overdisp.
- 2-3 sentence Poisson vs quasi.
- f1/f2 U<... expected number of comparisons; cdf; order prob desc faster.
- Beta-binomial pmf: choose(m,x) B(a+x,b+m-x)/B(a,b).
- Bayesian GLM: vague priors beta~N(0,10^4); overdispersion → add random effect eps_i~N(0,1/tau) in linear predictor. 
- MH reversible proof: pi(x)q(x,y)A(x,y)=min(pi(x)q(x,y), pi(y)q(y,x)) symmetric → detailed balance → stationary.
- Burn-in: discard before stationary because start not from pi.
- 2015: Gamma(m,l): lambda_hat=m/xbar; digamma; Newton; Fisher scoring replaces -l'' by E. GLM definition; Pearson chi2; deviance tests; overdispersion definition/detection/effect.
- Fitted rate; "diag of inverse Fisher info" = se^2 from output. Banding due to discrete y, not problem. Trend via lowess. Cooks kink in half-normal.
- ordinal (polr) off-syllabus skip.
- 2015: a(phi)=1 → alpha(x)exp(x theta + beta(theta)); conjugate prior exp(gamma theta + delta beta(theta)); posterior gamma+x, delta+1.
- Rejection proof: truncated normal: h ∝cos; accept prob = (∫f*)/k.
- Vague vs informative: N(0,10^4), Gamma(.001,.001) vague. Improper uniform p(mu)∝1, p(tau)∝1/tau: Gibbs same with a=b=0, still proper posterior if n large.
- Burn-in from trace plot; sample size check: MC error (<5% post sd) / blocks.
- 2014: Exponential GLM: canonical link -1/mu may give mu<0 unless constrained (practical difficulty); nested test chi2 as phi=1 known; deviance D=2 sum[ -log(y/mu)+(y-mu)/mu ]. Quasi Poisson iid: Q=sum (y log λ - λ)/φ; λ̂=ȳ; φ̂=sum(y-ȳ)^2/(ȳ (n-1)).
- D approx chi2_{n-p} when counts large, fails small lambda.
- summary(model2, dispersion=phi2): uses z with SE scaled. drop1(model, scale=phi, test="F").
- WinBUGS dnorm(mu, prec): precision param (old, skip? 1 line).
- hierarchical: y_ij~N(mu_i,1/tau_w), mu_i~N(0,1/tau_b).
- MH code with independence proposal: Y geometric proposal; alpha = pi(Y)q(Y→X)/... not symmetric. stationary is negbin(r,p). mean(X<=2) consistent by ergodicity. discard burn-in; accuracy via MC error.

## Exams 2011/2013: older subject (NP lemma, bootstrap, Mantel-Haenszel, McNemar off-syllabus). Useful: EM with censoring (E[T^3|T>c]), Fisher scoring update, Poisson GLM score + info matrix, odds ratio CI with cov.unscaled: Var(c'beta), prob CI at x, accept-reject derive pdf: P(X<=x | accept); N~Geom(p), E N=1/p.
2020 sols: I(tau)=n/(2tau^2), tau_hat=n/sum(x-1)^2 ~N(tau,2tau^2/n). Compare incomplete ll at each pi.
