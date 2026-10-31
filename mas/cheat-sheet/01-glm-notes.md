# Binomial reg / MLE / Exp fam / GLM / Overdispersion: must include

## Binomial regression (BinReg I, II)
- Yi ~ bin(mi, pi), independent; g(pi)=ηi=xi'β. Links: logit η=log(p/(1-p)), p=e^η/(1+e^η); cloglog η=log(-log(1-p)), p=1-exp(-e^η); probit η=Φ^-1(p), p=Φ(η).
- Logistic curve: p(t)=1/2 at t=-β0/β1 (location); p'(-β0/β1)=β1/4 (steepness).
- ll: c+Σ[yi log(pi/(1-pi)) + mi log(1-pi)] = c+Σ[yi ηi - mi log(1+e^ηi)]. No closed form. optim / IWLS.
- Prediction: η̂=x'β̂, p̂=g^-1(η̂).
- Observed info J(θ)= -∂²l/∂θ∂θ' = -H. Fisher I(θ)=E J(θ;Y), no y. Logit binomial: J=I= [[Σ m p q, Σ m x p q],[Σ m x p q, Σ m x² p q]] (no yi left).
- Asymptotics (regularity): consistent, θ̂ ≈ N(θ*, I(θ*)^-1), efficient (asymptotically unbiased with smallest variance).
- Intuition: bigger information = sharper likelihood curvature = smaller variance.
- Wald CI for t'θ: t'θ̂ ± z_{α} sqrt(t' I(θ̂)^-1 t), Φ(z)=1-α/2. Use J if I not available. CI for p: CI for η then g^-1 both ends (monotone); p is not linear in β.
- LR confidence region {θ: 2l(θ̂)-2l(θ) ≤ χ²_k(1-α)}, better than normal approx for small n.
- Regularity: l smooth (third derivs exist, cts), third derivs bounded expectation, support of Y not depending on θ, parameter domain finite-dim and not depending on Y, θ* not on boundary.
- Wald test z*=β̂/se ~ N(0,1) under H0. LRT LR*=-2[log L(θ̂_R)-log L(θ̂_F)] ~ χ²_k. Equivalent asymptotically: z² ~ χ²_1. LRT generally better.
- Challenger numbers: |z|=4.07, p=.0000476; LR*=21.98, p=.0000027, crit 3.84. Null 38.898 on 22, resid 16.912 on 21, AIC 33.675.
- Saturated: #params=#obs. Deviance D=-2[log L(θ̂_R)-log L(θ̂_sat)]. Warning number of params n not fixed so χ² theory not guaranteed.
- Binomial D=2Σ[yi log(yi/ŷi)+(mi-yi) log((mi-yi)/(mi-ŷi))] (slide written with negative sign form: 2Σ -...) ŷi=mi p̂i.
- Adequacy: if mi pi, mi(1-pi) ≥5, D≈χ²_{n-k}, k includes β0. Small mi: cannot use D directly for adequacy, still OK for model selection.
- Nested: DA-DB=-2[log L_A - log L_B]; saturated cancels. AIC=2k-2 log L. AIC_B-AIC_A=2s-DA+DB (needs not nested). smaller AIC better.
- Not nested -> AIC/BIC not LRT.

## Exp family
- f=exp[(yθ-b(θ))/a(φ)+c(y,φ)]. θ canonical (location), φ dispersion (scale). EY=b'(θ), VarY=b''(θ)a(φ). v(μ)=b''(b'^-1(μ)). VarY=v(μ)a(φ).
- Parametrisation not unique (eg Normal a(φ)=φ with φ=σ²; or φ=σ... ).
- Normal θ=μ, φ=σ², b=θ²/2, a=φ, c=-(y²/φ+log(2πφ))/2. v=1.
- Poisson θ=log λ, φ=1, b=e^θ, a=φ=1, c=-log y!. v=μ.
- Binomial θ=log(p/(1-p)), φ=1, b=m log(1+e^θ), a=1, c=log choose(m,y). v=μ(1-μ/m).
- Proof of mean/var ("exercise"): ∫f=1, differentiate wrt θ. E[(Y-b')/a]=0; ... second derivative: E[(y-b')²/a²]-b''/a=0.

## GLM
- Definition: from exp family + μ=EY=g^-1(x'β), g monotonic differentiable. model location, scale sorts itself out.
- Canonical link g=(b')^-1: g(μ)=θ. normal μ, Poisson log μ, binomial log(μ/(m-μ)). Gamma -1/μ (course sign) / R 1/μ.
- Newton-Raphson: x_{n+1}=x_n-f'(x_n)/f''(x_n). θ^{n+1}=θ^n-H^-1 U. U=∂l/∂θ. Fisher scoring replaces J by I; I positive definite.
- WLS: β̂=(X'Σ^-1X)^-1X'Σ^-1y=(X'WX)^-1X'Wy, W=Σ^-1.
- IWLS: Zi=g(μi)+(Yi-μi)g'(μi). εi=(Yi-μi)g'(μi). Var εi=g'(μi)²VarYi. Σii=g'(μi)²v(μi)a(φ). a(φ) cancels in β̂. Start μ̂0=y. z, W=1/[g'²v]. β̂=(X'WX)^-1X'Wz. μ̂=g^-1(xβ̂). stop when close. IWLS=Fisher scoring for GLM.
- Var β̂=(X'Σ̂^-1X)^-1. a(φ) does not cancel. Estimate a(φ̂)=X²/(n-p), X²=Σ(Yi-μ̂i)²/v(μ̂i). Pearson statistic; consistent.

## Deviance / residuals / diagnostics (GLM II)
- convention a(φ)=φ. scaled deviance D^A/φ=-2 log[L(θ̂A)/L(S)]. Deviance is D^A. Saturated uses yi to estimate μi.
- Normal d=(y-μ̂)²; Poisson d=2[y log(y/μ̂)-(y-μ̂)] (lecture writes -2(y log(μ̂/y)-(μ̂-y)), same); Binomial as above.
- Adequacy: binomial/Poisson φ=1, rule of thumb mi pi, mi(1-pi)≥5; λi≥5 -> D≈χ²_{n-p}. Normal/gamma/IG: estimate φ, cannot use scaled deviance for adequacy.
- Nested selection: binomial/Poisson: ΔD≈χ²_s. Normal: (DA-DB)/s / (X²/(n-p)) ~F_{s,n-p}, X² from bigger model B; approx for others. Model A p-s params, B p params.
- AIC=2p-2logL; AIC_B-AIC_A=2s-(DA-DB)/φ. needs φ estimate.
- Residuals: response y-μ̂ (not homoskedastic unless v const). Pearson rP=(y-μ̂)/sqrt(v(μ̂)); Σ rP²=X². Deviance rD=sign(y-μ̂)sqrt(di); default residuals(glmfit); Σ rD²=D.
- Plot residuals vs η̂=x'β̂. Banding for counts: discrete; smooth trend. 
- Leverage Hii, H=X(X'Σ^-1X)^-1X'Σ^-1 no φ. Large leverage does not necessarily mean influence. influence(glmfit)$hat.
- Var(Z-Ẑ)=(I-H)Σ; Studentised Pearson rSP=rP/sqrt((1-Hii)φ̂); deviance rSD=rD/sqrt((1-Hii)φ̂).
- Jack-knife: change in μ̂i on deleting yi, approx sign(y-μ̂)sqrt((1-Hii)rSD²+Hii rSP²). rstudent(glmfit).
- Cook's D=(β̂(i)-β̂)'X'Σ^-1X(β̂(i)-β̂)/p. cooks.distance(glmfit). Whole-fit change.
- Half-normal plot: ordered abs vs Φ^-1((n+i)/(2n+1)). smooth OK, jump/kink = problem. Not straight necessarily.
- Linearity: plot g(y) vs x, or z=g(μ̂)+(y-μ̂)g'(μ̂) vs x. Transform x, not y.

## Overdispersion / quasi
- Actual Var larger than model. Cause: binomial dependence between trials / p varying; Poisson event dependence / non-constant rate.
- Solutions: different model e.g. NB (Poisson-Gamma mix) Var=μ+μ²/ν style; quasi.
- IWLS needs only g and v. Assumes g(μ)=x'β, EY=μ, VarY=φ v(μ).
- ui=(Yi-μi)/(φ v(μi)). E u=0, Var u=1/(φ v), -E∂u/∂μ=1/(φ v). (=Eu²)
- Qi=∫_{yi}^{μi}(yi-t)/(φ v(t)) dt. ∂Qi/∂μi=ui. Q=ΣQi. consistent β, φ̂=X²/(n-p). Asymptotics hold, less efficient than MLE: use distribution if you know it.
- Scaled quasi-deviance DQ/φ=2[ΣQi^s-ΣQi]=-2ΣQi. Sat Q=0. DQ=-2φΣQ =2Σ∫_{μi}^{yi}(yi-t)/v(t)dt (form on slide: -2... check)
- F_Q=(D_Q^A-D_Q^B)/s / φ̂ ≈ F_{s,n-p}, φ̂ from model B.
- quasi Poisson v=μ, Qi=(1/φ)[y log μ - μ]. quasi binomial v=μ(m-μ)/m. Qi=(1/φ)[y log(μ/(m-μ))+m log(m-μ)].
- deviance same as bin/Pois; scaled differ. So cannot use deviance for adequacy; compare with F; anova works, drop1/step do not.
- Ignoring: estimation unaffected, inference changes. Proper: F reduced so fewer sig; Σ bigger so wider CI.
