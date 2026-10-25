# Q5: (b,c) one IWLS step for a gamma GLM, inverse link; (d) diagnostics of a gamma fit
x <- c(0,1,2); y <- c(2.4,1.7,1.1); b0 <- c(0.45,0.10)
eta <- b0[1] + b0[2]*x; mu <- 1/eta
z <- eta - (y-mu)/mu^2; W <- mu^2
X <- cbind(1,x)
XtWX <- t(X) %*% diag(W) %*% X; XtWz <- t(X) %*% (W*z)
b1 <- solve(XtWX, XtWz)
cat("eta\n"); print(eta); cat("mu\n"); print(mu); cat("z\n"); print(z); cat("W\n"); print(W)
cat("XtWX\n"); print(XtWX); cat("XtWz\n"); print(XtWz); cat("b1\n"); print(b1)
# diagnostics data
set.seed(515)
n <- 8
age <- 1:8
mean_y <- 1/(0.35 + 0.07*age)
cost <- round(rgamma(n, shape = 8, rate = 8/mean_y), 2)
cost[7] <- round(cost[7]*0.45,2)
age[8] <- 14   # high-leverage point
cost[8] <- round(1/(0.35+0.07*14) * 1.4, 2)
d <- data.frame(age, cost)
m <- glm(cost ~ age, family = Gamma, data = d)
cat("\n> print(d)\n"); print(d)
cat("\n> summary(m)\n"); print(summary(m))
cat("\n> round(hatvalues(m), 3)\n"); print(round(hatvalues(m),3))
cat("\n> round(residuals(m, type = 'pearson'), 3)\n"); print(round(residuals(m, type="pearson"),3))
cat("\n> round(cooks.distance(m), 3)\n"); print(round(cooks.distance(m),3))
cat("phi hat:", summary(m)$dispersion, " pearson-based:", sum(residuals(m,type='pearson')^2)/m$df.residual, "\n")
