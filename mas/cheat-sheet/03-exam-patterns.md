# Past-paper patterns (what the sheet must let me answer)

## 2020-22 skeleton (same lecturer): MLE -> GLM R output -> EM -> Bayes (Gibbs/MH/CAVI)
- Q1 iid MLE: log-lik, Fisher info, MLE + asymptotic. Dists: Pareto(κ(1+x)^{-κ-1}), Poisson, N(1,1/τ) (precision), Exponential(1/λ) i.e. mean λ, exp(λ), Gamma(m,λ) λ̂=m/x̄, negbin(p), Inv Gaussian.
- Exp family proof: Gamma (2017), Poisson (2018), Exponential (2021,2014), Inv-Gaussian (2021sp, hint θ=1/μ²); identify θ,φ,a,b,c; canonical link; v(μ).
  Weibull transform Y=X^k exponential(λ^k) (2016). Binomial (lab).
- R output: l̂ from AIC (p counts every β incl intercept), saturated l from D; which model better 2 quantitative reasons (AIC smaller AND χ² test rejects smaller); F by hand; SE quasi; prefer quasi model; F df (s, n-p_big); predict μ̂ at x; reasons for overdisp (D>>df, φ̂>>1); Poisson vs quasi in 2-3 sentences; misleading results if ignored; outlier picks from halfnorm + refit.
- Two φ̂ printed: use BIG model for F, own model's φ̂ for SE of that model.
- odds ratio Q 2018: exp(β(x1-x2)); CI Δ*(β±1.96se), exp. With negative Δ swap the ends.
- Wald vs chi for interaction tested twice: z from Fisher info N(0,1) vs Δdeviance χ²1; prefer LRT.
- D approx χ²_{n-p}: breaks for small counts (λ<5 / m small).
- Consequences of overdispersion (2021 4 marks): SEs too small, z too large, spurious significance, CIs too narrow; β̂ unaffected.
- "what evidence supports linear assumption": plots of log(y/m) vs x / interaction plot parallel lines.
- EM: 2 comps Normal(0,σ1²), Normal(0,σ²): derive Q then M-step. Twist: known component obs X51..X100 (Q gets extra term without weights; σ1² = (ΣP_i1 x² + Σ_known x²)/(ΣP_i1 + 50); σ2²=ΣP_i2x²/ΣP_i2; p=ΣP_i1/50).
  Note 2 on exam: answers may contain P(Zi=1|Xi,θ⁰).
- Binomial(m,p) mixture: p_k=ΣP x/(mΣP). Choosing between EM runs: larger incomplete ll; classify by P(Z=1|X=x).
- Bayes 17-18 marks: Gibbs conditional; MH numeric A with asymmetric proposal (both τ_n~Exp(1/τ_c) [rate] and μ_n~N(0,1/τ_n): q is product); improper p(μ,σ²)∝1/σ²; prop σ_n²~Gamma(5σ_c²,5). CAVI q*(τ)/q*(σ²) Gamma/Inv-Gamma with E[μ]²+V[μ].
- 2021 sp Q5: spike and slab with p(γ|x) via marginals; simulate. Need marginal p(x|γ=1)=N(1,2), posterior μ|γ=1 =N(1.5,1/2); sample γ~Bern, then μ.
- Old papers (2014-18): DAG / vague priors; improper priors; conjugate exp family proof; rejection minimise rejection; stationary dist from A; discrete Gibbs; posterior predictive sim; pmf from R loop; derive pdf from algorithm; expected number of comparisons in discrete sampler (order probs descending); beta-binomial; MH reversibility proof; hierarchical model; while loop geometric (runif>p => # failures before success, geometric on 0,1,..); Weibull inversion; burn-in from trace; MC error check.
- Log-linear (2014,16,17): df, interpretation of independence: ignore unless space (off-syllabus-ish).
- Bayes estimator/loss 2017/18 old lecturer: 1 line at most.
