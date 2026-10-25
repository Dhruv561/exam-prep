# Q3: grouped binomial GLM (fungus infection in orchard plots)
set.seed(3027)
n <- 16
orch <- data.frame(plot = 1:n,
                   rain  = round(runif(n, 2, 11), 1),
                   spray = factor(rep(c("none", "sprayed"), each = n/2)))
eta <- -1.6 + 0.30 * orch$rain - 1.0 * (orch$spray == "sprayed")
orch$inf <- rbinom(n, 30, plogis(eta))
orch$ok  <- 30 - orch$inf
orch$rain <- orch$rain
fit1 <- glm(cbind(inf, ok) ~ rain + spray, family = binomial, data = orch)
fit0 <- glm(cbind(inf, ok) ~ rain, family = binomial, data = orch)
cat("> print(orch[, c('rain','spray','inf')])\n"); print(orch[, c("rain","spray","inf")])
cat("\n> summary(fit1)\n"); print(summary(fit1))
cat("\n> vcov(fit1)\n"); print(vcov(fit1))
cat("\n> anova(fit0, fit1, test = 'Chisq')\n"); print(anova(fit0, fit1, test = "Chisq"))
cat("\n> deviance(fit0); df.residual(fit0); AIC\n")
print(c(dev0 = deviance(fit0), df0 = df.residual(fit0), dev1 = deviance(fit1), df1 = df.residual(fit1), AIC0=AIC(fit0), AIC1=AIC(fit1)))
cat("chi2 .95 df1:", qchisq(.95,1), " df13:", qchisq(.95, df.residual(fit1)), " p gof:", pchisq(deviance(fit1), df.residual(fit1), lower.tail=FALSE), "\n")
saveRDS(list(fit1=fit1, fit0=fit0, orch=orch), "out/q3.rds")
