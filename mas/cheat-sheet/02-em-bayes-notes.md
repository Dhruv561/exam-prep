# Mixture / EM / Bayes / MC / MCMC / VI: must include (from slides)

## Mixture
- Generative: Zi~Categorical(π1..πK); Xi|Zi=k ~ P(Xi|Θk). Zi latent. P(Xi)=Σ π_k P(Xi|Θk). Likelihood L(θ)=Π Σ f(xi;μk,σk²)π_k.
- Params count: π1..π(K-1), μ's, σ's.
- Book price: bimodal; heights: unimodal asymmetric. Mixture ≠ linear combination: πaXa+πbXb is normal; mixture is two stage.
- Clustering: P(Zi=k|Xi)=P(Xi|Zi=k)P(Zi=k)/Σk' ...

## EM
- l(θ)=Σ log Σ π_k f: sum blocks log. If Z known, easy.
- Derivative wrt μk: Σ P(Zi=k|Xi)(xi-μk)/σk²=0. "pretend" P doesn't depend on μ.
- Nk=ΣP(Zi=k|Xi) effective number. μ̂k=ΣPxi/Nk; σ̂k²=ΣP(xi-μk)²/Nk; π̂k=Nk/n. weighted avg.
- Algorithm: init θ⁰, eval incomplete ll; E: P(Z|X,θ⁰); M: θ̂=argmax Q(θ,θ⁰), Q=E_{Z|X,θ⁰}[log P(X,Z|θ)]; eval incomplete ll; stop if change <ε, else θ⁰←θ̂.
- Incomplete ll log P(X|θ)=log Σ_Z P(X,Z|θ); complete ll log P(X,Z|θ).
- Increases each step; sensitive to initial values; run multiple starts, choose highest incomplete ll.
- Complete: Π_i Π_k [π_k f]^{I(Zi=k)}. log=ΣΣ I(Zi=k)[log π_k+log f]. Q=ΣΣ P(Zi=k|X,θ⁰)[log π_k+log f]. E[I]=P.
- Monotonicity: Jensen E f(X) ≥ f(EX) convex; l(θ̂)=log E_Q[P(X,Z|θ̂)/Q(Z)] ≥ E_Q log[...] ; Q(Z)=P(Z|X,θ⁰) ; ≥ (defn θ̂) E log[P(X,Z|θ⁰)/P(Z|X,θ⁰)] = l(θ⁰). (Ratio is P(X|θ⁰), constant: equality in Jensen.)

## Bayes
- Prior p(θ), likelihood f(x|θ), posterior p(θ|x)=f(x|θ)p(θ)/f(x), marginal f(x)=∫f(x|θ)p(θ)dθ.
- Normal known σ²: prior N(μ,σ²/n0) -> posterior N((n0μ+nx̄)/(n0+n), σ²/(n0+n)). n0 implicit sample size. n0→0 flat improper.
- Post mean: weighted average of prior mean and MLE, weighted by precisions. compromise. Post var smaller than prior var and var of MLE (blue: generally true). n→∞: post → N(x̄,σ²/n), independent of prior.
- THM eg: x̄=130, σ=5,n=2; prior N(120,10²), n0=.25; post N(128.9,3.33²); credible 122.4-135.4.
- Frequentist CI: 123.1-136.9.
- Credible interval: central 95% of posterior. direct probability statement.
- Posterior predictive p(x̃|x)=∫p(x̃|θ)p(θ|x)dθ (cond indep given θ). Normal: N((n0μ+nx̄)/(n0+n), σ²+σ²/(n0+n)). mean=post mean; var=post var + sampling var. THM: N(128.9, 3.33²+5²)=36.1; P(>145)=.004.
- Freq vs Bayes probability. parameter fixed vs random.

## MC methods
- set.seed reproducible. runif(n).
- Discrete: x<-0; while(F(x)<U) x<-x+1. P(X=x)=P(U∈(F(x-1),F(x)])=p(x). sample(x,size,replace,prob).
- Inversion: Y=F^-1(U), P(Y≤y)=P(U≤F(y))=F(y). U(1,3): 2u+1. exp(λ): -log(1-u)/λ (also -log(U)/λ).
- R r*: rbinom, rpois, rgeom, rnbinom, runif, rexp, rnorm, rgamma, rbeta, rt, rf, rchisq, rweibull.
- Rejection uniform: fX≤k on [a,b]: X~U(a,b), Y~U(0,k), if Y<fX(X) return X.  
- General: envelope density h, k≥sup f/h, X~h, Y~U(0,kh(X)), Y<f(X) accept. (X,Y) uniform under kh: density 1/k.
- Unnormalised f*: k≥sup f*/h: same with f*. Use for posterior.
- Efficiency: expected candidates. P(accept)=1/k; N~geom(1/k); EN=k. closer h to f better. (with f*: accept prob=∫f*/k).
- Gamma(λ,m) with exp envelope h=μe^{-μx}: k*=sup λ^m x^{m-1}e^{-(λ-μ)x}/(μΓ(m)); max at x=(m-1)/(λ-μ); k*=λ^m(m-1)^{m-1}e^{-(m-1)}/(μ(λ-μ)^{m-1}Γ(m)); infinite if m<1 or λ≤μ. Best μ=λ/m => k*=m^m e^{-(m-1)}/Γ(m).
- Inverse: exp sample -log(U)/μ.

## Gibbs
- Need only full conditionals. Uses latest values. u^(j) -> f(u). burn-in m discard. Dependent, Markov chain.
- Insects: X|p,N~bin(N,p), N~Poi(16), p~Beta(2,4). p|x,N~Beta(x+2,N-x+4). N-x|x,p~Poi(16(1-p)). Start (8,.5,16).
- Marginal of X by keeping X draws.
- Trick: f(p|x,N)∝f(x,p,N) drop everything non-p.

## MCMC
- Target π up to constant (π=p(θ)p(x|θ)). q(θ,θ') proposal. A=min(1,π(θ')q(θ',θ)/(π(θ)q(θ,θ'))). U≤A accept, else stay.
- q: need simulate from q(θ,·) for every θ.
- Good q: large moves + high acceptance; competing; aim intermediate A. Gibbs A=1.
- Random walk MH: add symmetric noise U[-ε,ε], N(0,ε²): q cancels. A=min(1,π(θ')/π(θ)). Move uphill always, downhill sometimes. spends more time where π large.
- Theory not examinable: detailed balance π(θ)p(θ→θ')=π(θ')p(θ'→θ); aperiodic (can stay), irreducible; ergodic so can estimate.
- Gibbs special case of MH, A=1. Limitation: strong correlation slows it (moves coordinate-wise).
- Coal change point: Yi~Pois(λ1) i≤m, Pois(λ2) i>m. λ1~Γ(α1,β1), λ2~Γ(α2,β2), m~U{1..n}. λ1|..~Γ(α1+Σ1^m y, β1+m). λ2|..~Γ(α2+Σ_{m+1}^n y, β2+n-m). p(m|..)∝(λ1/λ2)^{Σ1^m y} e^{(λ2-λ1)m}. Not known dist but finite so sample with weights normalised.

## Diagnostics
- Two concerns: converged? autocorrelation?
- Trace plots; multiple chains overdispersed initial values (more variable than target); pool if similar. Burn-in discard early; trace helps.
- BGR: M chains length L+T; last T. B=sd of pooled MT (between), W=avg of M within-chain sd. R̂=B/W <1.05 accept stationary; R̂>>1 not converged; T→∞ R̂→1.
- Not converged: increase length, more efficient proposal. Even passing may be far if areas missed: overdispersed initial values.
- Autocorrelation: lag k cor(θ^t,θ^{t+k}). ACF plot. Thinning: keep every kth; simple, less memory; throws information away.
- ESS=n/(1+2Σρi)≈n(1-ρ1)/(1+ρ1). Target ESS>4000.

## VI
- KL(q||p(θ|y))=∫q[log q-log p(θ|y)]dθ. =-ELBO+log p(y). ELBO=-∫q[log q-log p(θ)p(y|θ)]dθ. KL≥0 → log p(y)≥ELBO. Minimise KL = maximise ELBO. KL not symmetric; EP uses other direction (not covered).
- Mean field q(θ)=Πq_j(θ_j): assumption on approximation, not model.
- CAVI: q_i*(θ_i)∝exp{E_{-i}[log p(θ,y)]}. uphill ELBO, local optimum. stop when ELBO changes little. Sensitive to initial values; run multiple; choose highest ELBO.
- Example: xi~N(μ,1/τ), μ|τ~N(μ0,1/(λ0τ)), τ~Gamma(a0,b0). Exact: μ|τ,x~N((λ0μ0+nx̄)/(λ0+n),1/((λ0+n)τ)); τ|x~Gamma(a0+n/2, b0+Σ(xi-x̄)²/2+nλ0(x̄-μ0)²/(2(λ0+n))).
- q_μ*=N((λ0μ0+nx̄)/(λ0+n),1/((λ0+n)Eτ)); q_τ*=Gamma((n+1)/2+a0,b0+ΣE(xi-μ)²/2+λ0E(μ-μ0)²/2).
- E(xi-μ)²=σ²*+μ*²-2xiμ*+xi². Eτ=a*/b*.
- MCMC vs VI: simulate vs approximate; MCMC intensive, asymptotically exact; VI faster, no guarantee, underestimates variance; large data, quick model exploration.
