# Extra notes (demos): must include
## Trout (quasi-binomial)
- Null deviance D_null=2{l(sat)-l(intercept)}; residual D_res=2{l(sat)-l(fitted)}. D_null-D_res = improvement. Adequacy uses residual vs residual df.
- GOF: pchisq(D,df,lower.tail=FALSE): P(χ²_{n-p} ≥ D_obs). H0: fitted GLM adequate. Small p = lack of fit: overdispersion, wrong mean structure, or missing interaction → inspect residuals vs η̂ first. No trend suggests mean OK, variance too small.
- "No universal cutoff" for φ̂. ~1 fine; appreciably >1 overdisp.
- Empirical logits log((y+.5)/(m-y+.5)), interaction.plot.
- SE_quasi=sqrt(φ̂)SE_{φ=1}; φ̂=4 → SE ×2. Quasi: same β̂, same fitted; SE bigger; CI wider; test stats smaller; fewer sig.
- "Same estimating equation up to 1/φ so same solution". IWLS: 1/φ cancels.
- Q need not be log of a genuine density.
- F_Q: φ̂ from larger model; 4,12 df. (913.56-64.5)/4/5.33=39.82. anova(bmod2,bmod,dispersion=phihat,test="F") equivalently.
## Gala
- Linearised response z=predict(mod)+(y-μ)/μ (log link). Plot g(y) and z vs log(Area).
- Residual plots: use link scale (η̂), μ̂ scale cramped; response residuals heteroskedastic; deviance/Pearson OK.
- halfnorm(influence(mod)$hat); halfnorm(rstudent(mod)); halfnorm(cooks.distance(mod)). Obs 25 Scruz=0 → log(.1) adjust. Refit subset=-25: conclusions changed (Scruz, Elevation lost).
- step(): compares AIC after dropping each term.
## Challenger
- Wald² 16.54 vs LR 21.99. D=16.91 on 21, p=.716 adequate; null D=38.90 on 22, p=.0145 not adequate.
- ylogxy with y=0 → 0 convention.
- l_F=-27.38, l_R=-38.37 (without constant).
- Null model glm(~1): p̂=ΣY/Σm=.0797.
## Bliss IWLS for logit
- z=η+(y-μ)m/(μ(m-μ)); w=μ(m-μ)/m; lm(z~x,weights=w). start μ=y. Converges 3 iterations.
- g'(μ)=m/(μ(m-μ)) for logit with μ=mp. W=1/(g'²v).
## Faraway QL
- Link, variance, independence more important than distribution. Quasi lets φ free. Underdispersion possible φ<1.
- Choice of v(μ) is random part; link is systematic part.
## Diagnostics additional
- Positive autocorr: naive CI too small. Var(mean)≈σ²/n(1+2Σρi). ρi≈ρ1^i → ESS≈n(1-ρ1)/(1+ρ1).
- Blocking: Q blocks size a; block means ~independent; MC error S/sqrt(Q), a=floor(sqrt n).
- Rule: MC error ≤5% posterior sd. Trace "hairy caterpillar" good, "woolly snake" bad.
