# Q4: Poisson vs quasi-Poisson (seabird counts on transects, offset log(km))
set.seed(4411)
n <- 36
bird <- data.frame(km = round(runif(n, 2, 8), 1),
                   depth = round(runif(n, 10, 90)),
                   sst = round(rnorm(n, 17, 2.2), 1),
                   zone = factor(sample(c("inshore","shelf","slope"), n, replace = TRUE),
                                 levels = c("inshore","shelf","slope")))
mu <- bird$km * exp(1.9 - 0.012*bird$depth + 0.05*(bird$sst-17) + c(0,0.25,0.15)[as.integer(bird$zone)])
bird$count <- rnbinom(n, mu = mu, size = 3)
mA <- glm(count ~ depth + sst + zone + offset(log(km)), family = poisson, data = bird)
mB <- glm(count ~ depth + offset(log(km)), family = poisson, data = bird)
qA <- glm(count ~ depth + sst + zone + offset(log(km)), family = quasipoisson, data = bird)
cat("> summary(mA)\n"); print(summary(mA))
cat("\n> (phiA <- sum(residuals(mA, type = 'pearson')^2 / mA$df.residual))\n"); print(sum(residuals(mA, type="pearson")^2/mA$df.residual))
cat("\n> (phiB <- sum(residuals(mB, type = 'pearson')^2 / mB$df.residual))\n"); print(sum(residuals(mB, type="pearson")^2/mB$df.residual))
cat("\n> anova(mB, mA, test = 'Chisq')\n"); print(anova(mB, mA, test="Chisq"))
cat("\n> anova(mB, mA, test = 'F') [quasi hidden]\n")
qB <- glm(count ~ depth + offset(log(km)), family = quasipoisson, data = bird)
print(anova(qB, qA, test="F"))
cat("\n> summary(qA)\n"); print(summary(qA))
cat("AIC mA:", AIC(mA), " logLik:", as.numeric(logLik(mA)), "\n")
cat("qF .95 (2,", mA$df.residual, ")=", qf(.95, 2, mA$df.residual), " t .975 df ", mA$df.residual, "=", qt(.975, mA$df.residual), " chisq.95 df2=", qchisq(.95,2), " chisq.95 df ", mA$df.residual, "=", qchisq(.95, mA$df.residual), "\n")
saveRDS(list(mA=mA,mB=mB,qA=qA,bird=bird), "out/q4.rds")
