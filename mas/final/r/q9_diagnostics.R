# Q9: MCMC diagnostics: random-walk MH for a N(5, 2^2)-shaped posterior, 2 chains from dispersed starts
set.seed(909)
mh <- function(start, n, step) {
  x <- numeric(n); x[1] <- start
  for (t in 2:n) {
    prop <- rnorm(1, x[t-1], step)
    lr <- dnorm(prop, 5, 2, log = TRUE) - dnorm(x[t-1], 5, 2, log = TRUE)
    x[t] <- if (log(runif(1)) < lr) prop else x[t-1]
  }
  x
}
ch <- cbind(A = mh(-8, 1200, 1.2), B = mh(18, 1200, 1.2))
pdf("out/q9_trace.pdf", width = 6.4, height = 2.6)
par(mar = c(4,4,1,1), mgp = c(2.4,0.8,0))
matplot(ch, type = "l", lty = 1, col = c("black","grey55"), xlab = "Iteration", ylab = expression(theta))
legend("topright", c("chain A","chain B"), lty = 1, col = c("black","grey55"), bty = "n")
dev.off()
keep <- ch[301:1200, ]
cat("> round(apply(ch[1:300, ], 2, sd), 2)\n"); print(round(apply(ch[1:300, ], 2, sd), 2))
cat("> round(apply(keep, 2, sd), 2)\n"); print(round(apply(keep, 2, sd), 2))
cat("> round(sd(as.vector(keep)), 2)\n"); print(round(sd(as.vector(keep)), 2))
cat("> round(sd(as.vector(ch[1:300, ])), 2)\n"); print(round(sd(as.vector(ch[1:300, ])),2))
cat("> round(sapply(1:2, function(j) acf(keep[, j], plot = FALSE)$acf[2]), 2)\n")
print(round(sapply(1:2, function(j) acf(keep[, j], plot = FALSE)$acf[2]), 2))
cat("> round(colMeans(keep),2)\n"); print(round(colMeans(keep),2))
cat("first rows\n"); print(round(ch[c(1,50,100,150,200,300),],1))
