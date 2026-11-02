/* Content for reference/exam-flow.html. Every edge is a trigger: "if you see this, go there".
   Strings: $maths$, $$display$$, «R code», **bold**. Source: cheat-sheet/horizontal-side{1,2}.tex (audited). */
window.FLOW = (() => {
const T = String.raw;
const nodes = [], edges = [], rels = [], drills = [];
let cur = null;
const In = r => { cur = r; };
const N = (id, k, title, o = {}) => nodes.push({ id, k, title, r: cur, ...o });
const E = (a, b, label) => edges.push({ a, b, label: label || '' });
const X = (a, b, why) => rels.push({ a, b, why });
const D = (t, path, ans) => drills.push({ t, path, ans });

const regions = [
  { id: 'mle',  name: 'Likelihood & MLE',        short: 'MLE',       s: 'a', c: 0, r: 0, entry: 'mle.start',  marks: 'Usually Q1, 7–10 marks',  sheet: 'likelihood-cheatsheet.html', blurb: T`Point estimate, information, asymptotics.` },
  { id: 'ef',   name: 'Exponential family & IWLS', short: 'Exp fam',  s: 'a', c: 1, r: 0, entry: 'ef.start',   marks: 'Usually 8–10 marks',      sheet: 'glm-cheatsheet.html',        blurb: T`Form, $v(\mu)$, canonical link, how «glm» fits.` },
  { id: 'glm',  name: 'Choose the GLM',          short: 'Choose GLM', s: 'a', c: 2, r: 0, entry: 'glm.start',  marks: 'Feeds the R-output Q',    sheet: 'glm-cheatsheet.html',        blurb: T`Response type gives family, link, offset.` },
  { id: 'test', name: 'Is it needed? Tests',     short: 'Tests',     s: 'a', c: 3, r: 0, entry: 'test.start', marks: 'R-output Q, 7–22 marks',  sheet: 'glm-cheatsheet.html',        blurb: T`Wald, LRT, $F$, AIC, goodness of fit.` },
  { id: 'est',  name: 'Numbers & meaning',       short: 'Numbers',   s: 'a', c: 4, r: 0, entry: 'est.start',  marks: 'R-output Q',              sheet: 'glm-cheatsheet.html',        blurb: T`R tables, hidden values, prediction, odds and rate ratios.` },
  { id: 'over', name: 'Overdispersion & quasi',  short: 'Overdisp',  s: 'b', c: 2, r: 1, entry: 'over.start', marks: 'In every R-output Q',     sheet: 'quasi-cheatsheet.html',      blurb: T`$D\gg\df$: why, what breaks, how to fix.` },
  { id: 'diag', name: 'GLM diagnostics',         short: 'Diagnostics', s: 'b', c: 3, r: 1, entry: 'diag.start', marks: 'Seen in 2014–16',       sheet: 'glm-cheatsheet.html',        blurb: T`Residuals, leverage, Cook's, classify a point.` },
  { id: 'mix',  name: 'Mixture models',          short: 'Mixtures',  s: 'c', c: 1, r: 1, entry: 'mix.start',  marks: 'Part of the EM Q',        sheet: 'em-cheatsheet.html',         blurb: T`Hidden labels, responsibilities, mixture moments.` },
  { id: 'em',   name: 'EM algorithm',            short: 'EM',        s: 'c', c: 0, r: 1, entry: 'em.start',   marks: 'Usually 10–12 marks',     sheet: 'em-cheatsheet.html',         blurb: T`$Q$, M-step, twists, reading runs.` },
  { id: 'bay',  name: 'Bayes: the posterior',    short: 'Bayes',     s: 'd', c: 1, r: 2, entry: 'bay.start',  marks: 'Bayes Q, 14–18 marks',    sheet: 'bayes-cheatsheet.html',      blurb: T`Prior × likelihood, kernels, predictive.` },
  { id: 'mc',   name: 'MCMC: Gibbs & MH',        short: 'MCMC',      s: 'd', c: 2, r: 2, entry: 'mc.start',   marks: 'Part of the Bayes Q',     sheet: 'bayes-cheatsheet.html',      blurb: T`Full conditionals, acceptance ledger, tuning.` },
  { id: 'out',  name: 'Check the chain',         short: 'Chain checks', s: 'd', c: 3, r: 2, entry: 'out.start', marks: 'Seen in 2014, 15, 17',  sheet: 'bayes-cheatsheet.html',      blurb: T`Trace, $\hat R$, ACF, ESS, using draws.` },
  { id: 'sim',  name: 'Simulation',              short: 'Simulation', s: 'd', c: 4, r: 2, entry: 'sim.start',  marks: 'Rejection, 5–8 marks',   sheet: 'bayes-cheatsheet.html',      blurb: T`Discrete loop, inversion, rejection, MC.` },
  { id: 'vi',   name: 'Variational inference',   short: 'VI',        s: 'd', c: 0, r: 2, entry: 'vi.start',   marks: 'Part of the Bayes Q',     sheet: 'bayes-cheatsheet.html',      blurb: T`Mean field, CAVI, ELBO.` },
  { id: 'tool', name: 'Shared tools',            short: 'Tools',     s: 't', c: 4, r: 1, entry: 'tool.square', marks: 'Used everywhere',        sheet: 'probability-toolkit.html',   blurb: T`The algebra that keeps reappearing.` },
];

/* Curated overview arrows. Only real exam-useful links: no line between the GLM stream and MCMC. */
const mapLinks = [
  { a: 'mle', b: 'ef', t: T`Newton → IWLS` },
  { a: 'ef', b: 'glm', t: T`$g$, $v(\mu)$` },
  { a: 'glm', b: 'test', t: T`fit, read output` },
  { a: 'test', b: 'est', t: T`then numbers` },
  { a: 'mle', b: 'test', t: T`se from $I^{-1}$`, bend: -74 },
  { a: 'test', b: 'over', t: T`$D\gg\df$`, both: 1 },
  { a: 'over', b: 'diag', t: T`mean wrong? outlier?`, both: 1 },
  { a: 'mix', b: 'over', t: T`mixing inflates Var` },
  { a: 'mix', b: 'em', t: T`sum in log` },
  { a: 'mle', b: 'em', t: T`M-step: weighted MLE` },
  { a: 'em', b: 'vi', t: T`same lower bound`, both: 1 },
  { a: 'mix', b: 'bay', t: T`$P_{ik}$ is Bayes' rule`, both: 1 },
  { a: 'bay', b: 'vi', t: T`fast, approx` },
  { a: 'bay', b: 'mc', t: T`many unknowns` },
  { a: 'mc', b: 'out', t: T`check chain` },
  { a: 'bay', b: 'sim', t: T`one unnamed unknown`, bend: 62 },
  { a: 'out', b: 'sim', t: T`MC averages`, both: 1 },
  { a: 'mc', b: 'vi', t: T`same kernels`, bend: -62, both: 1 },
];

/* ---------- Triage: the first thought in every question ---------- */
In('map');
N('stem', 'start', T`Read the stem. What am I handed?`, { goal: T`Name the question type before writing anything.` });
E('stem', 'mle.start', T`iid sample, one parameter: log-likelihood, information, MLE`);
E('stem', 'ef.start', T`"Show $f$ is an exponential family", or find $v(\mu)$, canonical link`);
E('stem', 'ef.iwls', T`"Do one IWLS iteration"`);
E('stem', 'glm.start', T`Data described in words: propose a model`);
E('stem', 'test.start', T`«glm» printout: is a term needed, which model, does it fit?`);
E('stem', 'est.start', T`Printout: read a table, predict, interpret, recover a number`);
E('stem', 'over.start', T`$D\gg\df$, $\hphi$ printed, or quasi family`);
E('stem', 'diag.start', T`Residual, half-normal, leverage or Cook's output`);
E('stem', 'mix.start', T`Hidden groups, mixture density, latent $Z_i$`);
E('stem', 'em.start', T`"Derive $Q(\theta,\theta^0)$ and the M-step"`);
E('stem', 'em.run', T`EM runs or EM R code printed`);
E('stem', 'bay.start', T`Stem has Model + Prior: find a posterior`);
E('stem', 'mc.start', T`"Describe a Gibbs sampler" or "compute the acceptance probability"`);
E('stem', 'out.start', T`Trace plots, ACF, $\hat R$, ESS, MCMC draws`);
E('stem', 'sim.start', T`Build a sampler using only uniforms`);
E('stem', 'sim.read', T`R simulation loop: what does it output?`);
E('stem', 'vi.start', T`"Find $q^*$", CAVI, ELBO, KL`);

/* ---------- Likelihood ---------- */
In('mle');
N('mle.start', 'start', T`iid sample, one parameter`, {
  see: [T`$X_1,\dots,X_n$ iid with density $f(x;\theta)$`, T`"Find the log-likelihood, Fisher information, MLE and its asymptotic distribution"`],
  goal: T`Estimate $\theta$ and say how uncertain the estimate is.`, L: [1] });
N('mle.lik', 'do', T`Write the log-likelihood`, { f: T`$l(\theta)=\sum_i\log f(x_i;\theta)$`,
  goal: T`Turn the data into a function of $\theta$.`,
  do: [T`$l(\theta)=\sum_i\log f(x_i;\theta)$`, T`Collapse to $n$, $\sum x_i$, $\sum\log x_i$.`],
  trap: [T`Check the parametrisation: rate or mean, variance or precision.`], L: [1] });
N('mle.solve', 'do', T`Solve the score equation`, { f: T`$U(\hth)=l'(\hth)=0$`,
  goal: T`Find the maximiser.`,
  do: [T`Score $U(\theta)=l'(\theta)$.`, T`Set $U(\hth)=0$ and solve.`, T`Check $l''(\hth)<0$.`], L: [1] });
N('mle.newton', 'do', T`No closed form: iterate`, { f: T`$\theta^{n+1}=\theta^n+I(\theta^n)^{-1}U(\theta^n)$`,
  see: [T`Score equation has no algebraic solution`, T`«optim(start, logL, control=list(fnscale=-1))»`],
  goal: T`Reach the MLE numerically.`,
  do: [T`Newton-Raphson: $\theta^{n+1}=\theta^n-H(\theta^n)^{-1}U(\theta^n)$`, T`Fisher scoring: replace $J=-H$ by $I$: $\theta^{n+1}=\theta^n+I(\theta^n)^{-1}U(\theta^n)$`, T`The two agree under a canonical link.`],
  trap: [T`Start values matter for «optim».`], L: [6] });
N('mle.ask', 'ask', T`Data left in $l''$?`, {
  goal: T`Decides whether Fisher information needs an expectation.`,
  do: [T`Observed: $J(\theta)=-l''(\theta)$, depends on the data.`, T`Fisher: $I(\theta)=\E[J(\theta;X)]$, no data.`], L: [1] });
N('mle.exp', 'do', T`Take the expectation`, { f: T`$I(\theta)=-\E[l''(\theta)]$`,
  goal: T`Remove the data from the curvature.`,
  do: [T`$I(\theta)=-\E[l''(\theta)]$`, T`Replace $\sum x_i$ by $n\,\E X$.`],
  trap: [T`Course $I$ is the whole sample ($n\times$ one-observation information). Never divide by $n$ again.`], L: [1] });
N('mle.same', 'do', T`Write "$J=I$"`, {
  goal: T`Collect the mark for noticing no expectation is needed.`,
  say: T`$l''$ contains no data, so $J=I$ and no expectation is needed.`, L: [1] });
N('mle.asym', 'do', T`Asymptotic distribution`, { f: T`$\hth\approx\N(\theta,I(\theta)^{-1})$`,
  goal: T`Uncertainty of the MLE for large $n$.`,
  do: [T`$\hth\approx\N(\theta,I(\theta)^{-1})$`, T`Consistent, asymptotically Normal, efficient.`],
  trap: [T`Regularity: support of $Y$ free of $\theta$, $\theta^*$ not on the boundary, $l$ smooth.`], L: [1] });
N('mle.ci', 'do', T`Wald CI`, { f: T`$\hth\pm1.96\sqrt{1/I(\hth)}$`,
  see: [T`"95% confidence interval for $\theta$"`], goal: T`Interval from curvature at the MLE.`,
  do: [T`One parameter: $\hth\pm1.96\sqrt{1/I(\hth)}$`, T`Linear combination: $t\T\hth\pm1.96\sqrt{t\T I(\hth)^{-1}t}$`, T`No $I$? Use $J(\hth;y)$.`],
  say: T`If we repeated this, 95% of such intervals would contain the true value.`, L: [1] });
N('mle.lrr', 'do', T`LR confidence region`, { f: T`$2l(\hth)-2l(\theta)\le\chi^2_k(.95)$`,
  see: [T`Small $n$`, T`"Is $\theta_0$ in the joint region?"`, T`Point inside both Wald intervals, region looks tilted`],
  goal: T`Joint region that respects correlation.`,
  do: [T`$\{\theta:2l(\hth)-2l(\theta)\le\chi^2_k(.95)\}$, $k=\dim\theta$`],
  trap: [T`The Wald box ignores correlation: a point can sit inside both intervals yet outside the region.`], L: [3] });
N('mle.reparam', 'do', T`New parameter $g(\theta)$`, { f: T`$\widehat{g(\theta)}=g(\hth)$`,
  see: [T`Model asks for the MLE of $1/\theta$, $\log\theta$, odds`], goal: T`Move to another scale without redoing the MLE.`,
  do: [T`MLE plugs in (invariance): $\widehat{g(\theta)}=g(\hth)$.`, T`$I$ must be redone. One Bin: $I(p)=\frac{m}{p(1-p)}$, $I(\eta)=mp(1-p)$.`, T`Delta: $g(\hth)\approx\N(g(\theta),g'(\theta)^2I(\theta)^{-1})$`],
  trap: [T`The MLE transforms; $I$ does not.`], L: [1] });
E('mle.start', 'mle.lik');
E('mle.lik', 'mle.solve');
E('mle.solve', 'mle.ask', T`algebra works`);
E('mle.solve', 'mle.newton', T`no closed form`);
E('mle.ask', 'mle.exp', T`yes: $\sum x_i$ remains`);
E('mle.ask', 'mle.same', T`no data left`);
E('mle.exp', 'mle.asym');
E('mle.same', 'mle.asym');
E('mle.asym', 'mle.ci', T`want an interval`);
E('mle.asym', 'mle.reparam', T`asked about $g(\theta)$`);
E('mle.ci', 'mle.lrr', T`small $n$ or joint region`);
E('mle.ci', 'test.z', T`same idea for GLM $\beta_j$`);
E('mle.newton', 'ef.iwls', T`GLM version`);
X('mle.lik', 'bay.post', T`Same likelihood: Bayes multiplies it by a prior.`);
X('mle.lik', 'em.m', T`The M-step is this MLE with hard counts replaced by weights $P_{ik}$.`);
X('mle.ci', 'bay.point', T`Same-looking interval, different meaning: long-run coverage vs direct probability about $\theta$.`);
X('mle.ask', 'glm.logit', T`Logit: no $y$ in the Hessian, so $J=I$. Probit, cloglog: $J\ne I$.`);

/* ---------- Exponential family ---------- */
In('ef');
N('ef.start', 'start', T`"Show $f$ is exponential family"`, {
  see: [T`"Show this belongs to the exponential family"`, T`"Identify $\theta,\phi,a,b,c$"`, T`"Find the canonical link and variance function"`],
  goal: T`Unlocks mean, variance, link and the GLM machinery.`, L: [5] });
N('ef.check', 'ask', T`Can it be one?`, {
  goal: T`Rule it out fast before attempting the algebra.`,
  do: [T`Support must be free of $\theta$.`, T`The parameter must multiply $y$, not $y^2$, $\log y$ or $e^y$.`], L: [5] });
N('ef.not', 'do', T`Say why not`, {
  goal: T`Full marks for a one-line reason.`,
  do: [T`Name the failing condition: support depends on $\theta$, or the parameter sits on the wrong function of $y$.`, T`Try a transform first. Weibull, $k$ known: $Y=X^k\sim$ Exp(rate $\lambda^k$).`, T`NegBin with unknown $r$: not exponential family.`], L: [5] });
N('ef.match', 'do', T`Match the form`, { f: T`$\exp\big[\frac{y\theta-b(\theta)}{a(\phi)}+c(y,\phi)\big]$`,
  goal: T`Read off $\theta,\phi,a,b,c$.`,
  do: [T`Write $\log f$.`, T`$y\times$(something) gives $\theta/a$.`, T`The term with no $y$ gives $-b/a$.`, T`Leftovers are $c$.`, T`Write $b$ in $\theta$ only.`],
  trap: [T`State all of $\theta,\phi,a,b,c$ and write "support free of $\theta$".`], L: [5] });
N('ef.mom', 'do', T`Mean and variance`, { f: T`$\mu=b'(\theta)$, $\Var Y=b''(\theta)a(\phi)$`,
  goal: T`Mean and variance without any integral.`,
  do: [T`$\E Y=b'(\theta)$`, T`$\Var Y=b''(\theta)a(\phi)$`, T`Proof if asked: differentiate $\int f\,dy=1$ in $\theta$ twice.`],
  trap: [T`Check $b'(\theta)=\mu$. It catches sign errors.`], L: [5] });
N('ef.v', 'do', T`Variance function`, { f: T`$v(\mu)=b''((b')^{-1}(\mu))$`,
  goal: T`How spread changes with the mean.`,
  tbl: { h: ['Family', T`$v(\mu)$`, 'Canonical $g$'], r: [
    ['Normal', '$1$', T`$\mu$`], ['Poisson', T`$\mu$`, T`$\log\mu$`], ['Binomial', T`$\mu(1-\mu/m)$`, T`$\log\frac{\mu}{m-\mu}$`],
    ['Gamma', T`$\mu^2$`, T`$-1/\mu$ (R: $1/\mu$)`], ['Inv Gaussian', T`$\mu^3$`, T`$-\frac{1}{2\mu^2}$ (R: $1/\mu^2$)`], ['Geometric', T`$\mu+\mu^2$`, T`$\log\frac{\mu}{1+\mu}$`] ] }, L: [5] });
N('ef.link', 'do', T`Canonical link`, { f: T`$g=(b')^{-1}$, $g(\mu)=\theta$`,
  goal: T`The link that makes $\theta_i=x_i\T\beta$.`,
  do: [T`$g=(b')^{-1}$`, T`Canonical: $g'(\mu)=1/v(\mu)$.`, T`Then $J=I$, Newton = Fisher scoring = IWLS, and $X\T y$ is sufficient.`, T`With an intercept: $\sum\hmu_i=\sum y_i$.`],
  trap: [T`Exponential: $\mu=-1/\eta$ needs $\eta<0$, so the canonical link can fail. Use log.`], L: [5, 6] });
N('ef.iwls', 'do', T`One IWLS step`, { f: T`$\hb=(X\T WX)^{-1}X\T Wz$`,
  see: [T`"Perform one iteration of IWLS"`, T`«Number of Fisher Scoring iterations»`],
  goal: T`How «glm» actually fits. Needs only $g$ and $v$.`,
  do: [T`Start $\hmu^0=y$ (R: $y+.1$ Poisson, $(y+.5)/(m+1)$ binomial).`, T`$z_i=g(\hmu_i)+(y_i-\hmu_i)g'(\hmu_i)$`, T`$W_{ii}=1/[g'(\hmu_i)^2v(\hmu_i)]$`, T`$\hb=(X\T WX)^{-1}X\T Wz$`, T`$\hmu_i=g^{-1}(x_i\T\hb)$, repeat until stable.`],
  trap: [T`$a(\phi)$ cancels in $\hb$ but not in $\Var\hb=a(\hphi)(X\T\hat WX)^{-1}$.`], L: [6] });
E('ef.start', 'ef.check');
E('ef.check', 'ef.match', T`yes`);
E('ef.check', 'ef.not', T`support depends on $\theta$, or wrong function of $y$`);
E('ef.match', 'ef.mom');
E('ef.mom', 'ef.v', T`want spread vs mean`);
E('ef.mom', 'ef.link', T`want the link`);
E('ef.v', 'ef.iwls', T`fit it`);
E('ef.link', 'ef.iwls', T`fit it`);
E('ef.v', 'quasi.new', T`keep only $v$`);
E('ef.iwls', 'test.start', T`fitted: read the output`);
X('ef.v', 'glm.y', T`The family you pick fixes $v(\mu)$.`);
X('ef.iwls', 'quasi.fit', T`$\phi$ cancels in IWLS, which is why quasi gives the same $\hb$.`);

/* ---------- Choose the GLM ---------- */
In('glm');
N('glm.start', 'start', T`Data in words: propose a model`, {
  see: [T`"Suggest a model", "state the model in full"`, T`Response and predictors described, no output yet`],
  goal: T`Write distribution, link and linear predictor.`,
  do: [T`(1) Distribution of independent $Y_i$.`, T`(2) Link: $g(\mu_i)=\eta_i=x_i\T\beta$.`], L: [2, 7] });
N('glm.y', 'ask', T`What is the response?`, {
  goal: T`The response type picks the family.`,
  do: [T`GLM: $Y$ from an exponential family, $\mu=g^{-1}(x\T\beta)$, $g$ monotone.`], L: [6] });
N('glm.bin', 'do', T`Binomial regression`, { f: T`$Y_i\sim\mathrm{bin}(m_i,p_i)$`,
  goal: T`Model a probability.`,
  do: [T`$g(p_i)=x_i\T\beta$, $m_i$ known (binary: $m_i=1$).`, T`R: «glm(cbind(y,m-y)~x, family=binomial)».`, T`Logit: $l=c+\sum_i[y_i\eta_i-m_i\log(1+e^{\eta_i})]$. No closed form: IWLS.`],
  trap: [T`Linear $p=\beta_0+\beta_1t$ fails: $0\le p\le1$ is needed.`], L: [2] });
N('glm.link', 'ask', T`Which link?`, {
  goal: T`Links agree mid-range, differ in the tails.`, L: [2] });
N('glm.logit', 'do', T`Logit`, { f: T`$\eta=\log\frac{p}{1-p}$, $p=\frac{1}{1+e^{-\eta}}$`,
  see: [T`Odds ratios wanted`, T`Case-control data: slopes stay valid log OR, only the intercept shifts`],
  goal: T`Canonical link: slopes are log odds ratios.`,
  do: [T`$e^{\Delta\beta_j}$ is an odds ratio.`, T`$J=I=X\T WX$, $W=\mathrm{diag}(m_ip_i(1-p_i))$: no $y_i$ left.`, T`Logistic curve: $p=\frac12$ at $t=-\beta_0/\beta_1$, slope there $\beta_1/4$.`], L: [2] });
N('glm.other', 'do', T`Probit or cloglog`, { f: T`$\Phi^{-1}(p)$, $\log(-\log(1-p))$`,
  see: [T`Cloglog: $p=1-e^{-\lambda}$, at least one Poisson event`, T`Cloglog leaves 0 slowly, nears 1 fast`],
  goal: T`Non-canonical alternatives.`,
  do: [T`Probit: $p=\Phi(\eta)$. Cloglog: $p=1-e^{-e^\eta}$.`, T`$e^\beta$ is not an odds ratio.`, T`$y$ stays in the Hessian: $J\ne I$.`],
  trap: [T`Same predictors with different links are not nested: no LRT.`], L: [2] });
N('glm.pois', 'do', T`Poisson log-linear`, { f: T`$\log\mu_i=x_i\T\beta$`,
  goal: T`Model a count. $\phi=1$, $\Var Y=\mu$.`,
  do: [T`$Y_i\sim$ Pois$(\mu_i)$, independent.`, T`Log link keeps $\mu>0$; effects multiply.`], L: [7] });
N('glm.exp', 'ask', T`Same exposure for every row?`, {
  goal: T`Different time, area or population must be modelled.`, L: [7] });
N('glm.offset', 'do', T`Rate model: offset`, { f: T`$\log\mu_i=\log t_i+x_i\T\beta$`,
  see: [T`«offset(log(t))»`, T`Counts over different durations, areas or populations`],
  goal: T`Model the rate, not the raw count.`,
  do: [T`Coefficient of $\log t$ fixed at 1, uses 0 df.`, T`$e^\beta$ is a rate ratio.`, T`$\hmu=t\,e^{x\T\hb}$`, T`Check it: free coefficient of $\log t$, $z=(\hb-1)/\se$.`],
  trap: [T`Forget $\log t$ in $\heta$ and you get the rate, not the count.`], L: [7] });
N('glm.gam', 'do', T`Gamma GLM`, { f: T`$\Var Y=\phi\mu^2$`,
  see: [T`«Gamma(link="log")»`, T`Positive, skewed, sd grows with the mean`],
  goal: T`Constant coefficient of variation.`,
  do: [T`$\mathrm{sd}/\mu=\sqrt\phi$`, T`$\phi$ estimated, so $t$ and $F$.`, T`Pick the link by plotting $g(y)$ vs $x$.`], L: [7] });
N('glm.norm', 'do', T`Normal (linear model)`, { f: T`$v=1$, $\phi=\sigma^2$`,
  goal: T`Baseline case of the GLM.`,
  do: [T`Identity link, $D$ is the RSS.`, T`$\phi$ estimated; $F$ test exact here.`], L: [6] });
E('glm.start', 'glm.y');
E('glm.y', 'glm.bin', T`$y$ out of $m$, or 0/1`);
E('glm.y', 'glm.pois', T`counts, no upper limit`);
E('glm.y', 'glm.gam', T`positive, sd grows with mean`);
E('glm.y', 'glm.norm', T`constant variance`);
E('glm.y', 'quasi.new', T`only mean and variance known`);
E('glm.bin', 'glm.link');
E('glm.link', 'glm.logit', T`odds ratios, case-control, default`);
E('glm.link', 'glm.other', T`"at least one event", latent threshold`);
E('glm.pois', 'glm.exp');
E('glm.exp', 'glm.offset', T`no: $t_i$ differ`);
E('glm.exp', 'test.start', T`yes`);
E('glm.logit', 'test.start', T`fit, read output`);
E('glm.other', 'test.aic', T`compare links`);
E('glm.offset', 'test.start', T`fit, read output`);
E('glm.gam', 'test.start', T`fit, read output`);
E('glm.norm', 'test.start', T`fit, read output`);

/* ---------- Tests ---------- */
In('test');
N('test.start', 'start', T`«glm» printout: what is asked?`, {
  see: [T`«summary(glm)», «anova(...)», «drop1», «step»`, T`"Is $x$ significant?", "which model?", "does it fit?"`],
  goal: T`First pin down $n$, $p$ and whether $\phi$ is fixed. Then match the test to the question.`,
  do: [T`$n=$ null df $+1$, $p=n-$ residual df.`, T`"Dispersion taken to be 1": $\phi$ fixed. Otherwise estimated.`],
  tbl: { h: ['', 'Poisson, binomial', 'Gamma', 'Quasi'], r: [
    [T`$\phi$`, '1, fixed', T`$\hphi$ Pearson`, T`$\hphi$ Pearson`], ['Coef', T`$z$`, T`$t_{n-p}$`, T`$t_{n-p}$`],
    ['Nested', T`$\Delta D$, $\chi^2_s$`, T`$F_{s,n-p_B}$`, T`$F_{s,n-p_B}$`], ['Fit', T`$D$, $\chi^2_{n-p}$`, 'none', 'none'], [T`$\hat l$`, T`$p-\frac{AIC}{2}$`, T`$p+1-\frac{AIC}{2}$`, 'AIC NA'] ] }, L: [3, 7, 12] });
N('test.one', 'ask', T`$\phi$ fixed or estimated?`, {
  goal: T`Picks $z$ or $t$ for a single coefficient.`,
  do: [T`Fixed at 1: binomial, Poisson.`, T`Estimated: Gamma, Normal, quasi.`], L: [7] });
N('test.z', 'do', T`Wald $z$`, { f: T`$z^*=\hb_j/\se(\hb_j)$`,
  see: [T`«z value», «Pr(>|z|)»`], goal: T`Is this one parameter relevant, given all the others?`,
  do: [T`$H_0:\beta_j=0$`, T`$z^*=\hb_j/\se(\hb_j)\sim\N(0,1)$ under $H_0$.`, T`Reject if $|z^*|>1.96$.`, T`Null not 0: $z=(\hb-b_0)/\se$.`],
  trap: [T`$z$ tests $\beta_j=0$ with every other term kept in.`, T`A factor with no significant dummy can still matter: use one LRT on $L-1$ df.`],
  say: T`$H_0:\beta_j=0$. $|z^*|>1.96$, so reject at 5%: $x_j$ is needed in the presence of the others.`, L: [3] });
N('test.t', 'do', T`Wald $t$`, { f: T`$t^*=\hb/\se_Q\approx t_{n-p}$`,
  see: [T`«t value», «Pr(>|t|)»`, T`«family=quasipoisson», «Gamma»`], goal: T`Same question as Wald, but $\phi$ was estimated.`,
  do: [T`$t^*=\hb/\se_Q\approx t_{n-p}$`, T`CI: $\hb\pm t_{n-p}(.975)\se_Q$, 1.96 if no $t$ given.`, T`Compare with Poisson: $t=z/\sqrt{\hphi}$.`], L: [12] });
N('test.wvl', 'do', T`Wald vs LRT`, { f: T`$z^2\approx\Delta D$ on 1 df`,
  see: [T`Same term tested twice in one output`, T`Two $p$-values disagree`, T`Huge estimate with huge se (sparse data)`],
  goal: T`Say which to trust and why.`,
  do: [T`Wald: curvature at $\hb$, one fit.`, T`LRT: actual drop in likelihood, both fits.`, T`Asymptotically equivalent, but the $\chi^2$ approximation to the LR is generally better.`],
  trap: [T`Sparse data (Hauck-Donner): se too big, $z$ too small, real effect missed.`],
  say: T`Both test the same hypothesis and agree asymptotically, but the $\chi^2$ approximation to the LR is generally better, so prefer the LRT.`, L: [3] });
N('test.set', 'ask', T`Nested?`, {
  goal: T`Is a term or group of terms relevant? Only nested models can be tested.`,
  do: [T`A is nested in B if A is B with parameters constrained, usually to 0.`, T`$s=$ difference in residual df.`, T`Factor with $L$ levels: $s=L-1$. Numeric score vs factor: $s=L-2$.`], L: [3] });
N('test.setphi', 'ask', T`$\phi$ fixed or estimated?`, {
  goal: T`Picks $\chi^2$ or $F$.`, L: [12] });
N('test.lrt', 'do', T`LRT`, { f: T`$\Delta D=D_A-D_B\approx\chi^2_s$`,
  see: [T`«anova(A,B,test="Chisq")», «Pr(>Chi)»`, T`Factor with several levels`, T`"Does the interaction help?"`],
  goal: T`Is a group of parameters relevant?`,
  do: [T`$LR^*=-2[\log L(\hth^R)-\log L(\hth^F)]$`, T`$\phi=1$: $LR^*=D_A-D_B$.`, T`Reject A if $\Delta D>\chi^2_s(.95)$.`],
  trap: [T`Subtract residual deviances, not null deviances.`],
  say: T`$H_0$: smaller model adequate. $\Delta D$ on $s$ df exceeds $\chi^2_s(.95)$, so reject and keep the larger model.`, L: [3] });
N('test.f', 'do', T`$F$ test`, { f: T`$F=\frac{(D_A-D_B)/s}{\hphi_B}$`,
  see: [T`«anova(A,B,test="F")»`, T`Quasi or Gamma fits`, T`Two $\hphi$ values printed`],
  goal: T`Is a group of parameters relevant when $\phi$ is estimated?`,
  do: [T`$F=\frac{(D_A-D_B)/s}{\hphi}\approx F_{s,\,n-p_B}$`, T`Big model's $\hphi$ not printed: approx $D_B/(n-p_B)$.`],
  trap: [T`$\hphi$ comes from the BIG model.`, T`$\chi^2$ says keep, $F$ says drop: believe $F$, since $\phi=1$ is false.`], L: [12] });
N('test.aic', 'do', T`AIC`, { f: T`$AIC=2p-2\hat l$`,
  see: [T`Different links`, T`Different predictors, neither contains the other`, T`«step()»`],
  goal: T`Compare models that cannot be tested against each other.`,
  do: [T`Smaller is better. Same data only. Not a test.`, T`$AIC_B-AIC_A=2s-\Delta D/\phi$`, T`An extra parameter pays only if it cuts $D$ by more than 2.`],
  trap: [T`Quasi: AIC is NA, «step» and «drop1» fail.`], L: [3] });
N('test.fit', 'ask', T`Can I test adequacy?`, {
  goal: T`Does the model fit at all?`,
  do: [T`Need $\phi=1$.`, T`Need fitted $\hmu\ge5$; binomial $m\hat p$ and $m\hat q\ge5$.`], L: [3, 7] });
N('test.gof', 'do', T`Deviance goodness of fit`, { f: T`$D\approx\chi^2_{n-p}$`,
  see: [T`«pchisq(D,df,lower.tail=FALSE)»`, T`"Residual deviance: D on df degrees of freedom"`],
  goal: T`$H_0$: the fitted model is adequate.`,
  do: [T`Reject if $D>\chi^2_{n-p}(.95)$.`, T`Rough check: $D\approx\df$.`],
  trap: [T`$p$ includes the intercept.`], L: [3, 7] });
N('test.nogof', 'do', T`No adequacy test`, {
  see: [T`0/1 data, small counts`, T`Gamma, Normal, quasi`],
  goal: T`Say why the test is unavailable.`,
  do: [T`Saturated model has $n$ parameters, so ML theory does not apply: $D$ need not be $\chi^2$.`, T`0/1 logit: $D$ depends only on $\hat p_i$, so says nothing about fit.`, T`$\Delta D$ between nested models is still fine.`], L: [3] });
E('test.start', 'test.one', T`is one coefficient relevant?`);
E('test.start', 'test.set', T`is a term or set of terms relevant? which model?`);
E('test.start', 'test.fit', T`does the model fit?`);
E('test.one', 'test.z', T`fixed: «z value»`);
E('test.one', 'test.t', T`estimated: «t value»`);
E('test.z', 'test.wvl', T`also tested by $\Delta D$`);
E('test.set', 'test.setphi', T`nested`);
E('test.set', 'test.aic', T`not nested`);
E('test.setphi', 'test.lrt', T`fixed`);
E('test.setphi', 'test.f', T`estimated`);
E('test.fit', 'test.gof', T`$\phi=1$ and fitted $\ge5$`);
E('test.fit', 'test.nogof', T`small counts, 0/1, or $\phi$ estimated`);
E('test.gof', 'over.start', T`$D\gg\df$`);
E('test.lrt', 'test.wvl', T`also tested by $z$`);
X('test.t', 'quasi.se', T`Quasi SEs give these $t$ values: $t=z/\sqrt{\hphi}$.`);
X('test.f', 'quasi.fit', T`Quasi has no likelihood, so the LRT is replaced by $F$.`);
X('test.aic', 'mix.k', T`Same tool to choose the number of components $K$.`);

/* ---------- Numbers and meaning ---------- */
In('est');
N('est.start', 'start', T`Want a number or a meaning`, {
  see: [T`Blanks in the output`, T`"Predict", "95% CI", "interpret"`, T`"What is the log-likelihood?"`],
  goal: T`Every printed number links to the others.`, L: [3, 7] });
N('est.hidden', 'do', T`Recover hidden values`, {
  see: [T`Blanked cell in «summary» or «anova»`], goal: T`Rebuild the output from identities.`,
  do: [T`$n=$ null df $+1$; $p=n-$ res df.`, T`SE $=$ Est$/z$; Est $=z\,$SE.`, T`$s=$ res df$_A-$ res df$_B$; $\Delta D=D_A-D_B$.`, T`$z^2\approx\Delta D$ and $t^2\approx F$ on 1 df.`, T`$F=(\Delta D/s)/\hphi$, so $\hphi=(\Delta D/s)/F$.`, T`$|z|>1.96$: $p<.05$. $|z|>2.58$: $p<.01$.`], L: [3, 12] });
N('est.ll', 'do', T`Log-likelihood from AIC`, { f: T`$\hat l=p-AIC/2$`,
  see: [T`"Find the maximised log-likelihood"`, T`"Saturated log-likelihood"`], goal: T`Back out $\hat l$ and $l_S$.`,
  do: [T`$\phi=1$: $\hat l=p-AIC/2$.`, T`Gamma, Normal: $\hat l=(p+1)-AIC/2$.`, T`$l_S=\hat l+D/2$, the same for every model on those data.`],
  trap: [T`$p$ counts every $\beta$ including the intercept.`], L: [3] });
N('est.dev', 'do', T`Deviance by hand`, { f: T`$D=\sum_id_i$`,
  see: [T`"Compute the deviance contribution of this row"`], goal: T`Twice the gap to the saturated fit.`,
  do: [T`Poisson: $d_i=2[y_i\log(y_i/\hmu_i)-(y_i-\hmu_i)]$`, T`Binomial: $2[y_i\log\frac{y_i}{\hmu_i}+(m_i-y_i)\log\frac{m_i-y_i}{m_i-\hmu_i}]$`, T`Gamma: $2[-\log(y_i/\hmu_i)+(y_i-\hmu_i)/\hmu_i]$`, T`$y=0$: Poisson $d_i=2\hmu_i$; binomial $-2m_i\log(1-\hat p_i)$.`], L: [3, 7] });
N('est.pred', 'do', T`Point prediction`, { f: T`$\hat p_0=g^{-1}(x_0\T\hb)$`,
  see: [T`"Estimate the probability / mean at $x=\dots$"`, T`«predict(m,type="response")»`], goal: T`Fitted value on the response scale.`,
  do: [T`$\heta_0=x_0\T\hb$`, T`Logit: $\hat p=1/(1+e^{-\heta})$. Log: $\hmu=e^{\heta}$. Inverse: $1/\heta$.`],
  trap: [T`«predict» on «cbind» binomial gives $\hat p$: multiply by $m$.`, T`Offset: add $\log t$.`], L: [2] });
N('est.ci', 'do', T`CI: on $\eta$, then transform`, { f: T`$\heta_0\pm1.96\sqrt{x_0\T Vx_0}$`,
  see: [T`"95% CI for $p$"`, T`«vcov(m)» printed`], goal: T`$p$ is not linear in $\beta$; $\eta$ is.`,
  do: [T`$V=I(\hb)^{-1}$`, T`One predictor: $x_0\T Vx_0=V_{11}+2x_0V_{12}+x_0^2V_{22}$`, T`$\heta_0\pm1.96\sqrt{x_0\T Vx_0}$`, T`Apply $g^{-1}$ to both ends.`],
  trap: [T`Keep every digit of «vcov»: terms nearly cancel.`, T`Quasi: «predict» on the quasi fit includes $\hphi$; on a Poisson fit multiply se.fit by $\sqrt{\hphi}$.`], L: [2] });
N('est.interp', 'ask', T`Which link?`, {
  goal: T`The link decides the sentence.`,
  do: [T`Factor: "relative to the reference level".`, T`Interaction: the effect of one predictor depends on the other.`, T`Observational data: "associated with", not "causes".`], L: [3, 7] });
N('est.or', 'do', T`Odds ratio`, { f: T`$OR=e^{\Delta\hb_j}$`,
  goal: T`Effect on the odds.`,
  do: [T`Change $x_j$ by $\Delta$: $OR=e^{\Delta\beta_j}$.`, T`CI: $\exp\{\Delta(\hb_j\pm1.96\,\se)\}$; swap ends if $\Delta<0$.`, T`Two non-baseline levels: $\log OR=\hb_a-\hb_b$, $\se=\sqrt{V_{aa}+V_{bb}-2V_{ab}}$.`],
  trap: [T`It is the odds, not the probability. $e^{\Delta\hb}$, not $\Delta e^{\hb}$.`],
  say: T`Holding other predictors fixed, a 1-unit rise in $x$ multiplies the odds by $e^{\hb}$.`, L: [2] });
N('est.rr', 'do', T`Rate ratio`, { f: T`$e^{\hb}$`,
  goal: T`Effect on the mean count or rate.`,
  do: [T`$100(e^{\hb}-1)$% change per unit.`, T`$\log x$ with log link: doubling $x$ multiplies $\mu$ by $2^{\hb}$.`, T`CI: exponentiate the ends, never the se.`],
  say: T`Holding other predictors fixed, a 1-unit rise in $x$ multiplies the expected count by $e^{\hb}$.`, L: [7] });
N('est.add', 'do', T`Identity or inverse`, {
  goal: T`Effect is not multiplicative.`,
  do: [T`Identity: $\mu$ rises by $\hb$. CI directly on the response scale.`, T`Inverse: $1/\mu$ rises by $\hb$, so $\hb>0$ lowers $\mu$.`], L: [7] });
N('est.phi', 'do', T`Estimate $\phi$`, { f: T`$\hphi=X^2/(n-p)$`,
  see: [T`«sum(residuals(m,type="pearson")^2)/m$df.residual»`], goal: T`Measure spread beyond the model's $v(\mu)$.`,
  do: [T`$X^2=\sum_i(y_i-\hmu_i)^2/v(\hmu_i)$`, T`From two outputs: $\hphi=(\se_Q/\se_P)^2=(z/t)^2$.`],
  trap: [T`Not $D/(n-p)$, though it is usually close.`], L: [7, 12] });
N('est.tables', 'do', T`Which R table?`, {
  see: [T`«anova(m,test="Chisq")», «drop1», «step», «Start: AIC=»`],
  goal: T`Read what each table is actually testing.`,
  do: [T`«anova(A,B)»: row 2 Df $=s$, Deviance $=\Delta D$.`, T`«anova(m)»: each term added after those above it. Only the last row tests a term given all the others.`, T`«drop1»: each row drops only that term; order irrelevant.`, T`«step»: rows sorted by AIC; stops when «<none>» is on top.`],
  trap: [T`Read «anova(m)» upward: if «A:B» is significant keep «A» and «B» whatever their rows say.`], L: [3, 7] });
E('est.start', 'est.tables', T`what does this table say?`);
E('est.start', 'est.hidden', T`a value is blanked`);
E('est.start', 'est.ll', T`log-likelihood`);
E('est.start', 'est.dev', T`one row's deviance`);
E('est.start', 'est.pred', T`predict at new $x$`);
E('est.start', 'est.interp', T`interpret a coefficient`);
E('est.start', 'est.phi', T`dispersion`);
E('est.pred', 'est.ci', T`want an interval`);
E('est.interp', 'est.or', T`logit`);
E('est.interp', 'est.rr', T`log`);
E('est.interp', 'est.add', T`identity, inverse`);
E('est.phi', 'over.start', T`$\hphi\gg1$`);

/* ---------- Overdispersion ---------- */
In('over');
N('over.start', 'start', T`$D\gg\df$ or $\hphi\gg1$`, {
  see: [T`Residual deviance far above its df`, T`GOF $p$-value tiny`, T`Printed «phi» well above 1 on a Poisson or binomial fit`],
  goal: T`Find out if the variance is bigger than the model allows.`, L: [10] });
N('over.rule', 'ask', T`Could the mean be wrong?`, {
  goal: T`Rule out wrong mean and outliers first.`,
  do: [T`$r_D$ vs $\heta$: trend or curve?`, T`Half-normal plot: a stand-out point?`, T`A free mean for every group and $D$ still big: must be overdispersion.`], L: [10] });
N('over.yes', 'do', T`Declare overdispersion`, {
  goal: T`Give two quantitative reasons.`,
  do: [T`$D\gg\df$, with the numbers.`, T`$\hphi\gg1$, with the number.`],
  trap: [T`0/1 data: cannot be detected.`],
  say: T`Residual deviance $D$ is far above its df and $\hphi\gg1$, so the variance exceeds the Poisson assumption $\Var Y=\mu$.`, L: [10] });
N('over.cause', 'do', T`Why it happens`, {
  see: [T`"Give a reason for overdispersion in this study"`], goal: T`Link to the data story.`,
  do: [T`Binomial: dependent trials, or $p$ changing trial to trial.`, T`Poisson: dependent events or non-constant rate.`, T`Random rate: $\Var Y=\E\lambda+\Var\lambda>\E\lambda$.`, T`Clusters of size $k$: $\Var Y=(1+(k-1)\tau^2)mp(1-p)$.`], L: [10] });
N('over.ignore', 'do', T`What if ignored?`, {
  see: [T`"What misleading results could you get?"`], goal: T`Standard 2–4 mark explanation.`,
  do: [T`$\hb$ unaffected.`, T`SEs too small, $z$ too big.`, T`$p$-values too small, CIs too narrow.`, T`Spurious significant predictors, too big a model.`],
  say: T`Estimates are unaffected, but SEs are too small, so $z$ is too large and $p$-values too small. Predictors may look significant when they are not, and CIs are too narrow.`, L: [10] });
N('over.fix', 'ask', T`Which fix?`, {
  goal: T`Keep the mean model, change the variance.`, L: [10] });
N('over.nb', 'do', T`Negative binomial`, { f: T`$\Var Y=\mu+\mu^2/\nu$`,
  goal: T`A real distribution with extra variance.`,
  do: [T`Poisson with Gamma rate gives NegBin.`, T`Bayes version: random effect in $\eta$.`], L: [10] });
N('quasi.fit', 'do', T`Quasi-likelihood fit`, { f: T`$\Var Y=\phi v(\mu)$`,
  see: [T`«family=quasipoisson», «quasibinomial»`], goal: T`Honest uncertainty with no distribution assumed.`,
  do: [T`Specify only $g(\mu_i)=x_i\T\beta$, $\E Y_i=\mu_i$, $\Var Y_i=\phi v(\mu_i)$.`, T`$\phi$ cancels in IWLS: **same** $\hb$, $\hmu$, $D$.`, T`$\hphi$ from Pearson.`],
  trap: [T`No likelihood: AIC NA, no adequacy test, «step» fails.`], L: [11, 12] });
N('quasi.se', 'do', T`Scale the SEs`, { f: T`$\se_Q=\sqrt{\hphi}\,\se_P$`,
  see: [T`"SE allowing for overdispersion"`, T`Poisson SE and a $\hphi$ printed`], goal: T`Correct standard error from the Poisson fit.`,
  do: [T`$\se_Q=\sqrt{\hphi}\,\se_P$`, T`Reverse: $\se_P=\se_Q/\sqrt{\hphi}$.`, T`Estimate never changes.`],
  trap: [T`$\hphi$ of **that same model**. $F$ uses the big model's.`], L: [12] });
N('quasi.vs', 'do', T`Poisson vs quasi-Poisson`, {
  see: [T`"Explain the difference in 2–3 sentences"`], goal: T`Stock answer.`,
  say: T`Poisson fixes $\Var Y=\mu$. Quasi-Poisson keeps the same mean model, sets $\Var Y=\phi\mu$ with $\phi$ estimated from Pearson, and assumes no distribution. Same $\hb$; SEs $\times\sqrt{\hphi}$; tests become $t$ and $F$; AIC is NA.`, L: [12] });
N('quasi.new', 'start', T`Non-standard data, no distribution`, {
  see: [T`"Could you fit this with quasi-likelihood? How?"`, T`Only mean and variance described`, T`Non-integer proportions`],
  goal: T`Build the model from the mean-variance relationship.`,
  do: [T`Choose link and $v(\mu)$ from mean-variance, e.g. proportions: logit, $\mu(1-\mu)$.`, T`Fit by IWLS: needs only $g$, $v$.`, T`$\hphi$ from Pearson. $\hphi<1$ is allowed.`], L: [11] });
N('quasi.Q', 'do', T`Quasi-likelihood, quasi-deviance`, { f: T`$Q_i=\int_{y_i}^{\mu_i}\frac{y_i-t}{\phi v(t)}dt$`,
  see: [T`"Write $Q_i$", "compute the quasi-deviance"`], goal: T`Integrate the quasi-score.`,
  do: [T`$\partial Q_i/\partial\mu_i=u_i=\frac{y_i-\mu_i}{\phi v(\mu_i)}$`, T`$D_Q=-2\sum_i\int_{y_i}^{\mu_i}\frac{y_i-t}{v(t)}dt$`, T`Quasi-Poisson: $Q_i=\frac1\phi[y_i\log\mu_i-\mu_i]$ + const.`, T`Scaled: $D_Q/\phi=-2\sum Q_i$.`],
  trap: [T`Do not maximise $Q$ in $\phi$: it rises to 0 as $\phi\to\infty$. Use Pearson.`], L: [11] });
E('over.start', 'over.rule');
E('over.rule', 'diag.start', T`trend, curve or outlier`);
E('over.rule', 'over.yes', T`no pattern left`);
E('over.yes', 'over.cause', T`asked why`);
E('over.yes', 'over.ignore', T`asked what if ignored`);
E('over.yes', 'over.fix', T`asked to fix it`);
E('over.fix', 'quasi.fit', T`keep the mean model, assume no distribution`);
E('over.fix', 'over.nb', T`want a real distribution`);
E('quasi.fit', 'quasi.se', T`SE of one coefficient`);
E('quasi.fit', 'test.f', T`compare nested models`);
E('quasi.fit', 'quasi.vs', T`explain the difference`);
E('quasi.se', 'test.t', T`then test it`);
E('quasi.new', 'quasi.fit', T`fit it`);
E('quasi.new', 'quasi.Q', T`asked for $Q$`);
X('over.cause', 'mix.mom', T`A Poisson mixture has $\Var X=\bar\lambda+\pi_1\pi_2(\lambda_1-\lambda_2)^2>\E X$: hidden groups are one cause.`);
X('over.nb', 'bay.pred', T`Poisson-Gamma marginal is NegBin in both places.`);

/* ---------- Diagnostics ---------- */
In('diag');
N('diag.start', 'start', T`Model check or influence output`, {
  see: [T`«halfnorm», «cooks.distance», «hatvalues», «rstudent», «rstandard»`, T`"Any outliers or influential points?"`, T`Residual plot shown`],
  goal: T`Find what is wrong: mean, variance, or a single point.`, L: [8] });
N('diag.pat', 'do', T`Read $r_D$ vs $\heta$`, {
  see: [T`Residuals plotted against fitted values`], goal: T`Check mean and variance.`,
  do: [T`No trend, even spread: good.`, T`Trend or curve: wrong mean.`, T`Fan: wrong variance.`, T`Banding: discrete counts, not a problem.`, T`0/1 data: two curves, nothing to read.`], L: [8] });
N('diag.line', 'do', T`Check linearity`, {
  see: [T`$\log(y/t)$ vs $x$, $g(y)$ vs $x_j$`, T`Interaction plot: parallel lines mean no interaction`], goal: T`Is $\eta$ linear in each $x_j$?`,
  do: [T`Plot $g(y)$ or $z$ vs each $x_j$: want straight.`],
  trap: [T`Fix by transforming $x$, not $y$: transforming $y$ breaks the distribution of $Y$.`], L: [8] });
N('diag.res', 'do', T`Residual types`, { f: T`$r_{SD}=\frac{r_D}{\sqrt{(1-H_{ii})\hphi}}$`,
  see: [T`"Compute the Pearson / deviance / studentised residual"`], goal: T`Put residuals on one scale.`,
  do: [T`Pearson: $r_P=(y_i-\hmu_i)/\sqrt{v(\hmu_i)}$, $\sum r_P^2=X^2$.`, T`Deviance: $r_D=\mathrm{sign}(y_i-\hmu_i)\sqrt{d_i}$, $\sum r_D^2=D$.`, T`Studentised: divide by $\sqrt{(1-H_{ii})\hphi}$.`, T`Jack-knife, $\phi=1$: $\mathrm{sign}\cdot\sqrt{r_D^2+H_{ii}r_P^2/(1-H_{ii})}$.`], L: [8] });
N('diag.half', 'do', T`Half-normal plot`, {
  see: [T`Ordered absolute values vs $\Phi^{-1}((n+i)/(2n+1))$`], goal: T`Spot stand-out points.`,
  do: [T`Smooth: fine.`, T`Jump or kink in the tail: problem.`],
  trap: [T`Need not be straight.`], L: [8] });
N('diag.lev', 'do', T`Leverage`, { f: T`flag $H_{ii}>2p/n$`,
  see: [T`«hatvalues», «influence(m)$hat»`], goal: T`Potential influence from unusual $x$.`,
  do: [T`$H_{ii}=w_ix_i\T\widehat{\Var}(\hb)x_i$ ($\phi=1$)`, T`$w_i$: $m\hat p\hat q$ logit, $\hmu$ Poisson log, 1 Gamma log.`, T`$\sum H_{ii}=p$, mean $p/n$.`],
  trap: [T`Large leverage need not mean actual influence.`], L: [8] });
N('diag.cook', 'do', T`Cook's distance`, { f: T`$\frac{r_{SP}^2H_{ii}}{p(1-H_{ii})}$`,
  see: [T`«cooks.distance»`], goal: T`Change in the whole fit when $i$ is removed.`,
  do: [T`Approximately $r_{SP}^2H_{ii}/[p(1-H_{ii})]$.`, T`Flag near 1, or a clear jump.`], L: [8] });
N('diag.class', 'do', T`Classify the point`, {
  goal: T`Name what kind of problem it is.`,
  do: [T`**Outlier:** big jack-knife, ordinary $H$, coefficients barely move.`, T`**High leverage only:** big $H$, tiny residual, small Cook.`, T`**Influential:** big Cook, coefficients move. Needs both leverage and residual.`], L: [8] });
N('diag.refit', 'do', T`Refit without it`, {
  see: [T`«update(m,subset=-7)», «subset=-25»`], goal: T`See whether conclusions change.`,
  do: [T`Compare $\hb$, $D$, $\hphi$.`, T`Typically keep the point unless it is a recording error.`], L: [8] });
E('diag.start', 'diag.pat', T`residuals vs fitted`);
E('diag.start', 'diag.line', T`$g(y)$ vs $x$`);
E('diag.start', 'diag.res', T`compute a residual`);
E('diag.start', 'diag.half', T`half-normal plot`);
E('diag.start', 'diag.lev', T`leverages`);
E('diag.start', 'diag.cook', T`Cook's distances`);
E('diag.res', 'diag.class');
E('diag.half', 'diag.class');
E('diag.lev', 'diag.class');
E('diag.cook', 'diag.class');
E('diag.class', 'diag.refit');
E('diag.refit', 'over.yes', T`$\hphi$ still large`);
E('diag.pat', 'over.yes', T`fine, yet $D\gg\df$`);

/* ---------- Mixtures ---------- */
In('mix');
N('mix.start', 'start', T`Hidden groups`, {
  see: [T`"Each observation comes from one of $K$ groups"`, T`$Z_i$ unobserved, «sample(1:K,n,replace=TRUE,prob=pi)»`, T`Density $\pi f_1+(1-\pi)f_2$, bimodal histogram`],
  goal: T`Write a hidden label for each observation.`, L: [16] });
N('mix.write', 'do', T`Write the model`, { f: T`$P(x_i)=\sum_k\pi_kf(x_i;\Theta_k)$`,
  goal: T`Generative story: label, then data.`,
  do: [T`$Z_i\sim\mathrm{Categorical}(\pi_1,\dots,\pi_K)$`, T`$X_i|Z_i=k\sim f(\cdot;\Theta_k)$`, T`Free parameters: $K-1$ proportions + component parameters.`],
  trap: [T`A mixture is not a linear combination: $\pi_aX_a+\pi_bX_b$ of Normals is Normal, a mixture need not be.`], L: [16] });
N('mix.goal', 'ask', T`What is asked?`, { goal: T`Each goal uses a different tool.`, L: [16] });
N('mix.resp', 'do', T`Responsibilities`, { f: T`$P_{ik}=\frac{\pi_kf(x_i;\Theta_k)}{\sum_j\pi_jf(x_i;\Theta_j)}$`,
  see: [T`"Which group does $x$ belong to?"`, T`«prob.x.z/rowSums(prob.x.z)»`], goal: T`Soft classification by Bayes' rule.`,
  do: [T`Compute $\pi_kf_k(x)$ for each $k$.`, T`Divide by the sum.`, T`Assign to the largest.`, T`Common factors cancel: $x!$, $\sqrt{2\pi}$.`],
  trap: [T`$\pi_k$ and unequal $1/\sigma_k$ do not cancel.`], L: [16] });
N('mix.cut', 'do', T`Classification cutoff`, {
  see: [T`"For which $x$ is it classified to group 1?"`], goal: T`Solve $P_{i1}=\frac12$.`,
  do: [T`Normal, equal $\sigma^2$, $\mu_1<\mu_2$: group 1 if $x<\frac{\mu_1+\mu_2}{2}+\frac{\sigma^2\log(\pi_1/\pi_2)}{\mu_2-\mu_1}$`, T`Poisson, $\lambda_1<\lambda_2$: group 1 if $x<\frac{\log(\pi_1/\pi_2)+\lambda_2-\lambda_1}{\log(\lambda_2/\lambda_1)}$`], L: [16] });
N('mix.mom', 'do', T`Mixture mean and variance`, { f: T`$\Var X=\E[\Var(X|Z)]+\Var[\E(X|Z)]$`,
  see: [T`"Find $\E X$ and $\Var X$"`], goal: T`Tower and total variance.`,
  do: [T`$\bar\mu=\sum_k\pi_k\mu_k$`, T`$\Var X=\sum_k\pi_k\sigma_k^2+\sum_k\pi_k(\mu_k-\bar\mu)^2$`, T`$K=2$ between term: $\pi_1\pi_2(\mu_1-\mu_2)^2$.`, T`Poisson: $\Var X=\bar\lambda+\pi_1\pi_2(\lambda_1-\lambda_2)^2$.`], L: [16] });
N('mix.lik', 'do', T`Why not plain MLE?`, { f: T`$l(\theta)=\sum_i\log\sum_k\pi_kf(x_i;\Theta_k)$`,
  see: [T`"Why is direct maximisation hard?"`], goal: T`Justify EM.`,
  do: [T`The sum inside the log blocks a closed form.`, T`If $Z$ were known it would be easy.`], L: [16, 17] });
N('mix.k', 'do', T`Choose $K$`, {
  see: [T`Log-likelihoods for $K=2,3,4$ printed`], goal: T`Penalise extra components.`,
  do: [T`$l$ always rises with $K$.`, T`AIC, with $p=K-1$ + component parameters. Known values are not counted.`], L: [21] });
E('mix.start', 'mix.write');
E('mix.write', 'mix.goal');
E('mix.goal', 'mix.resp', T`which group is $x$ from?`);
E('mix.goal', 'mix.mom', T`mean or variance of $X$`);
E('mix.goal', 'mix.lik', T`fit the parameters`);
E('mix.goal', 'mix.k', T`how many components?`);
E('mix.resp', 'mix.cut', T`asked for a boundary`);
E('mix.lik', 'em.start', T`so use EM`);
X('mix.resp', 'tool.bayes', T`This is Bayes' rule with prior $\pi_k$ and likelihood $f_k$.`);
X('mix.mom', 'tool.tower', T`Tower rule and total variance, conditioning on $Z$.`);

/* ---------- EM ---------- */
In('em');
N('em.start', 'start', T`Derive EM`, {
  see: [T`"Derive $Q(\theta,\theta^0)$"`, T`"Give the M-step updates"`, T`Answers may contain $P(Z_i=k|X_i,\theta^0)$`],
  goal: T`Replace the hard log-likelihood by an easy weighted one.`, L: [17] });
N('em.q', 'do', T`Derive $Q$`, { f: T`$Q=\sum_{i,k}P_{ik}[\log\pi_k+\log f(x_i;\Theta_k)]$`,
  goal: T`Expected complete-data log-likelihood.`,
  do: [T`$P(X,Z|\theta)=\prod_i\prod_k[\pi_kf(x_i;\Theta_k)]^{I(Z_i=k)}$`, T`$\log P(X,Z|\theta)=\sum_{i,k}I(Z_i=k)[\log\pi_k+\log f(x_i;\Theta_k)]$`, T`$\E[I(Z_i=k)]=P_{ik}$, and only $I$ is random.`, T`$Q=\sum_{i,k}P_{ik}[\log\pi_k+\log f(x_i;\Theta_k)]$`, T`Expand $\log f$.`],
  trap: [T`Define $P_{ik}=P(Z_i=k|X_i,\theta^0)$ and say which $\theta^0$.`], L: [17] });
N('em.twist', 'ask', T`Any twist?`, { goal: T`The twist changes what you collect before differentiating.`, L: [19] });
N('em.m', 'do', T`M-step: weighted MLE`, { f: T`$N_k=\sum_iP_{ik}$, $\hat\pi_k=N_k/n$`,
  goal: T`Complete-data MLE with counts replaced by weights.`,
  do: [T`$\frac{\partial Q}{\partial\pi}=\frac{N_1}{\pi}-\frac{N_2}{1-\pi}=0$, so $\hat\pi_k=N_k/n$.`, T`Normal: $\hmu_k=\sum_iP_{ik}x_i/N_k$`, T`$\hat\sigma_k^2=\sum_iP_{ik}(x_i-\hmu_k)^2/N_k$`, T`Poisson: $\hat\lambda_k=\sum_iP_{ik}x_i/N_k$`, T`Bin$(m,p_k)$: $\hat p_k=\sum_iP_{ik}x_i/(mN_k)$`, T`Exp(rate): $\hat\lambda_k=N_k/\sum_iP_{ik}x_i$`],
  trap: [T`Variance update uses the **new** mean.`], L: [18] });
N('em.known', 'do', T`Some labels known`, { f: T`extra $\sum\log f_j(x_i)$, no $\pi$`,
  see: [T`"Observations $X_{n+1},\dots$ are known to come from component $j$"`], goal: T`Known points have no $Z$.`,
  do: [T`$n'$ points known from $j$, not drawn from the mixture: they add $\sum\log f_j(x_i)$ with weight 1 and no $\pi$.`, T`$\hat\pi_k=N_k/n$, unlabelled $n$ only.`, T`$\hmu_j=(\sum P_{ij}x_i+\sum_{lab}x_i)/(N_j+n')$`, T`Labels observed from the mixture: $\hat\pi_k=(N_k+m_k)/(n+m)$.`], L: [19] });
N('em.tied', 'do', T`Parameter shared across components`, {
  see: [T`Exp$(\lambda)$, Exp$(2\lambda)$`, T`$\N(\mu,1)$, $\N(-\mu,1)$`, T`Exposures $t_i$`], goal: T`Collect every term, differentiate once.`,
  do: [T`Write "the terms of $Q$ involving $\lambda$ are…"`, T`Exp$(\lambda)$, Exp$(2\lambda)$: $\hat\lambda=n/\sum_i(P_{i1}+2P_{i2})x_i$`, T`$\N(\mu,1)$, $\N(-\mu,1)$: $\hmu=\sum_i(P_{i1}-P_{i2})x_i/n$`, T`Exposure: $\hat\lambda_k=\sum_iP_{ik}x_i/\sum_iP_{ik}t_i$`], L: [19] });
N('em.zero', 'do', T`Zero-inflated`, { f: T`$P_{i1}=0$ if $x_i>0$`,
  see: [T`Extra zeros, "structural zero" group`], goal: T`One component is a point mass at 0.`,
  do: [T`$x_i=0$: $P_{i1}=\pi/[\pi+(1-\pi)e^{-\lambda}]$.`, T`$\hat\lambda=\sum x_i/(n-N_1)$`], L: [19] });
N('em.k3', 'do', T`$K\ge3$ proportions`, { f: T`Lagrange $\nu=n$`,
  goal: T`Constrained maximum for $\pi$.`,
  do: [T`$Q+\nu(1-\sum_k\pi_k)$ gives $\pi_k=N_k/\nu$.`, T`Sum over $k$: $\nu=n$.`, T`Or substitute $\pi_3=1-\pi_1-\pi_2$.`], L: [19] });
N('em.loop', 'do', T`Iterate`, { f: T`stop if $\Delta l<\epsilon$`,
  see: [T`"Do one iteration by hand"`], goal: T`Alternate E and M.`,
  do: [T`(1) Set $\theta^0$; evaluate the incomplete log-lik.`, T`(2) **E:** compute $P_{ik}$.`, T`(3) **M:** $\hth=\arg\max_\theta Q(\theta,\theta^0)$.`, T`(4) Stop if the change $<\epsilon$, else $\theta^0\leftarrow\hth$.`, T`By hand: table of $x_i$, $P_{i1}$, $P_{i2}$; check $N_1+N_2=n$.`], L: [17] });
N('em.run', 'start', T`EM output printed`, {
  see: [T`Several starts, different $\hth$`, T`«log_liks», «delta.ll», «mixture.EM»`, T`«prob.x.z», «P_ik»`], goal: T`Interpret the run, not rederive it.`, L: [20] });
N('em.pick', 'do', T`Pick the run`, { f: T`highest incomplete log-lik`,
  see: [T`"Which run would you use and why?"`], goal: T`Local maxima: keep the best.`,
  do: [T`Plug each $\hth$ into $\sum_i\log(\pi f_1(x_i)+(1-\pi)f_2(x_i))$.`, T`Same log-lik, permuted labels: label switching, same fit.`, T`«length(log_liks)» $=$ «max.iter+1»: stopped at the cap, not converged.`],
  trap: [T`Do not compare log-lik across different data.`], L: [20] });
N('em.stuck', 'do', T`Stuck run`, { f: T`$\hat\lambda_k=\bar x$`,
  see: [T`Means identical after iteration 1, $\pi$ never moves`], goal: T`Explain equal starts.`,
  do: [T`$\lambda_1^0=\lambda_2^0$: every row of $P_{ik}$ is $\pi^0$.`, T`Stuck at $\hat\lambda_k=\bar x$, $\pi$ unchanged.`, T`Fix: different starts.`], L: [20] });
N('em.code', 'do', T`Decode the R`, {
  see: [T`Asked what a line computes`], goal: T`Map lines to E and M.`,
  do: [T`«P_ik=prob.x.z/rowSums(prob.x.z)»: E-step.`, T`«w.new=colSums(P_ik)/sum(P_ik)»: $\hat\pi_k$.`, T`«mu.new=colSums(P_ik*X)/colSums(P_ik)»: $\hmu_k$.`, T`«ill=sum(log(rowSums(prob.x.z)))»: incomplete log-lik.`, T`«apply(P_ik,1,which.max)»: classify.`],
  trap: [T`Bugs: «/colSums» in the E-step; «sum(log(prob.x.z))».`, T`Negative «delta.ll» also stops the loop, so a bug can look converged.`], L: [20] });
N('em.proof', 'do', T`Why $l$ never falls`, { f: T`$l(\theta)\ge Q(\theta,\theta^0)+C$`,
  see: [T`"Show the log-likelihood does not decrease"`], goal: T`Jensen lower bound.`,
  do: [T`$q(Z)=P(Z|X,\theta^0)$`, T`$l(\theta)=\log\sum_Zq\frac{P(X,Z|\theta)}{q}\ge\sum_Zq\log\frac{P(X,Z|\theta)}{q}$`, T`$=Q(\theta,\theta^0)+C$, $C=-\sum_Zq\log q$`, T`Equality at $\theta^0$.`, T`$l(\hth)\ge Q(\hth,\theta^0)+C\ge Q(\theta^0,\theta^0)+C=l(\theta^0)$`], L: [17] });
E('em.start', 'em.q');
E('em.q', 'em.twist');
E('em.twist', 'em.m', T`plain mixture`);
E('em.twist', 'em.known', T`some labels known`);
E('em.twist', 'em.tied', T`parameter shared`);
E('em.twist', 'em.zero', T`excess zeros`);
E('em.twist', 'em.k3', T`$K\ge3$`);
E('em.m', 'em.loop');
E('em.known', 'em.loop');
E('em.tied', 'em.loop');
E('em.zero', 'em.loop');
E('em.k3', 'em.loop');
E('em.run', 'em.pick', T`which run?`);
E('em.run', 'em.stuck', T`nothing moves`);
E('em.run', 'em.code', T`what does this line do?`);
E('em.run', 'em.proof', T`why can't $l$ fall?`);
E('em.loop', 'mix.resp', T`classify with $\hth$`);
X('em.q', 'vi.recipe', T`Both take an expectation of the log joint: EM over $Z$, CAVI over the other parameters.`);
X('em.proof', 'vi.elbo', T`Same lower bound: EM uses the exact $q(Z)$, VI restricts $q$ to a family.`);
X('em.proof', 'tool.jensen', T`Jensen applied to the concave log.`);
X('em.q', 'tool.ind', T`$\E[I(Z_i=k)]=P_{ik}$ turns indicators into weights.`);

/* ---------- Bayes ---------- */
In('bay');
N('bay.start', 'start', T`Model + Prior stem`, {
  see: [T`"Model: $x_i|\ldots$. Prior: …"`, T`"Find the posterior of…"`, T`$\mu$, $\tau$, $\sigma^2$, $\lambda$ with priors`],
  goal: T`Probability statements about the parameter.`, L: [22] });
N('bay.post', 'do', T`Prior × likelihood`, { f: T`$p(\theta|x)\propto f(x|\theta)p(\theta)$`,
  goal: T`The joint is your starting line for everything.`,
  do: [T`Joint: likelihood × every prior.`, T`Keep only factors with the parameter.`, T`Add exponents.`],
  trap: [T`$\tau^{n/2}$ is constant for $\mu$ but not for $\tau$: keep it.`, T`Each prior appears once.`], L: [15, 22] });
N('bay.prior', 'do', T`What kind of prior?`, {
  see: [T`"Vague", "informative", "improper"`, T`$p(\mu)\propto1$, $p(\tau)\propto1/\tau$`, T`BUGS «dnorm(0,.001)»`],
  goal: T`Say what the prior does.`,
  do: [T`Vague: $\N(0,10^4)$, $\Ga(.001,.001)$.`, T`Improper: does not integrate to 1; fine if the posterior is proper.`, T`Gibbs: improper $p(\tau)\propto1/\tau$ means $a=b=0$.`, T`$p(\mu,\sigma^2)\propto1/\sigma^2$ goes straight into $\pi$ in MH.`],
  trap: [T`BUGS «dnorm(m,p)»: second argument is a precision.`], L: [22] });
N('bay.n', 'ask', T`How many unknowns?`, { goal: T`Decides closed form or computation.`, L: [22] });
N('bay.kernel', 'ask', T`Kernel recognised?`, {
  goal: T`Match the shape, drop the constant.`,
  do: [T`Gamma: $\tau^{a-1}e^{-b\tau}$`, T`InvGamma: $x^{-a-1}e^{-b/x}$`, T`Normal: $e^{-\frac A2\mu^2+B\mu}$ is $\N(B/A,1/A)$`, T`Beta: $\theta^{a-1}(1-\theta)^{b-1}$`], L: [15] });
N('bay.name', 'do', T`Name it: conjugate update`, {
  goal: T`Posterior as a named distribution with every parameter.`,
  tbl: { h: ['Likelihood', 'Prior', 'Posterior'], r: [
    [T`Pois$(\lambda)$`, 'Gamma', T`$\Ga(a+\sum y_i,b+n)$`], [T`Exp$(\lambda)$`, 'Gamma', T`$\Ga(a+n,b+\sum y_i)$`],
    [T`$\N(\mu_0,1/\tau)$`, 'Gamma', T`$\Ga(a+\frac n2,b+\frac S2)$`], [T`$\N(\mu_0,\sigma^2)$`, 'InvG', T`$\IG(a+\frac n2,b+\frac S2)$`],
    [T`Bin$(m,\theta)$`, 'Beta', T`Beta$(a+\sum y_i,b+nm-\sum y_i)$`] ] },
  do: [T`$S=\sum(x_i-\mu_0)^2$`, T`Normal mean, $\sigma^2$ known: precisions add. Variance $(\frac1{s^2}+\frac n{\sigma^2})^{-1}$, mean = variance $\times(\frac m{s^2}+\frac{n\bar x}{\sigma^2})$.`],
  trap: [T`$\E[\sigma^2|x]=b_n/(a_n-1)$, not $1/\E[\tau|x]=b_n/a_n$.`], L: [15, 22] });
N('bay.ask', 'ask', T`What do you want from it?`, { goal: T`The posterior is the answer; these are summaries.`, L: [22] });
N('bay.point', 'do', T`Mean and credible interval`, { f: T`mean $\pm1.96$ sd if Normal`,
  see: [T`"Bayes estimate", "95% credible interval"`], goal: T`Point estimate, plus a direct probability statement about $\theta$.`,
  do: [T`Posterior mean minimises squared error loss.`, T`Gamma: $a_n/b_n$. InvGamma: $b_n/(a_n-1)$.`, T`Interval: central 95% of the posterior.`, T`Samples: «quantile(th,c(.025,.975))».`],
  say: T`Given the data, there is a 95% probability that $\theta$ lies in this interval.`, L: [22] });
N('bay.pred', 'do', T`Posterior predictive`, { f: T`$\int p(\tilde x|\theta)p(\theta|x)d\theta$`,
  see: [T`"Distribution of a new observation"`, T`«xt<-rbinom(N,10,theta)»`], goal: T`Predict data, carrying parameter uncertainty.`,
  do: [T`Normal: $\N$(post. mean, post. var $+\ \sigma^2$).`, T`Simulate $\theta^{(l)}\sim p(\theta|x)$, then $\tilde x^{(l)}\sim p(\tilde x|\theta^{(l)})$.`, T`Known mean, $\tau|x\sim\Ga(a^*,b^*)$: $t$ with $\nu=2a^*$, location $\mu_0$, $s^2=b^*/a^*$.`, T`Poisson-Gamma: $\Var\tilde y=\E[\lambda|y]+\Var(\lambda|y)$.`], L: [22] });
N('bay.weight', 'do', T`Prior vs data`, { f: T`$w=\frac{b}{b+n}$ on the prior mean`,
  see: [T`"How does the posterior mean compare to the MLE?"`], goal: T`Precision-weighted average.`,
  do: [T`Poisson-Gamma: $\frac{a+\sum y_i}{b+n}=w\frac ab+(1-w)\bar y$.`, T`Normal: weight on prior mean $n_0/(n_0+n)$.`, T`$n\to\infty$: prior forgotten.`], L: [22] });
N('bay.joint', 'ask', T`Joint posterior available?`, { goal: T`Only a conjugate joint prior gives one exactly.`, L: [27] });
N('bay.exact', 'do', T`Exact: $\tau$ then $\mu$`, { f: T`$p(\mu,\tau|x)=p(\tau|x)p(\mu|\tau,x)$`,
  see: [T`Prior $\mu|\tau\sim\N(\mu_0,\frac{1}{\lambda_0\tau})$, $\tau\sim\Ga$`], goal: T`No MCMC needed.`,
  do: [T`$\tau|x\sim\Ga(a_0+\frac n2,\ b_0+\frac12\sum(x_i-\bar x)^2+\frac{n\lambda_0(\bar x-\mu_0)^2}{2(\lambda_0+n)})$`, T`$\mu|\tau,x\sim\N(\frac{\lambda_0\mu_0+n\bar x}{\lambda_0+n},\frac{1}{(\lambda_0+n)\tau})$`, T`Sample $\tau$, then $\mu$.`], L: [27] });
N('bay.spike', 'do', T`Spike prior`, { f: T`$p(\gamma|x)\propto p(x|\gamma)p(\gamma)$`,
  see: [T`Discrete indicator $\gamma$ switching the prior on $\mu$`], goal: T`Sample the discrete part first.`,
  do: [T`$p(x|\gamma)=\int p(x|\mu)p(\mu|\gamma)d\mu$`, T`Sample $\gamma$ from $p(\gamma|x)$.`, T`Then $\mu|\gamma,x$.`], L: [22] });
N('bay.how', 'ask', T`Exact draws or fast approximation?`, {
  goal: T`Trade accuracy for speed.`,
  do: [T`Rejection: iid draws, needs an envelope.`, T`MCMC: simulates the density, heavier, asymptotically exact.`, T`VI: approximates it, faster, suits large data, underestimates variance.`], L: [27] });
E('bay.start', 'bay.post', T`find the posterior`);
E('bay.start', 'bay.prior', T`asked about the prior`);
E('bay.post', 'bay.n');
E('bay.n', 'bay.kernel', T`one`);
E('bay.n', 'bay.joint', T`two or more`);
E('bay.kernel', 'bay.name', T`yes`);
E('bay.kernel', 'bay.how', T`no`);
E('bay.name', 'bay.ask');
E('bay.ask', 'bay.point', T`estimate or interval`);
E('bay.ask', 'bay.pred', T`a new observation`);
E('bay.ask', 'bay.weight', T`how does it compare to the MLE?`);
E('bay.joint', 'bay.exact', T`yes: prior $\mu|\tau$, $\tau$`);
E('bay.joint', 'bay.spike', T`discrete indicator`);
E('bay.joint', 'bay.how', T`no: independent priors`);
E('bay.how', 'sim.start', T`draws, one unknown, $f^*$ bounded`);
E('bay.how', 'mc.start', T`draws, build a chain`);
E('bay.how', 'vi.start', T`fast approximation`);
X('bay.kernel', 'gibbs.cond', T`Same recognise-the-kernel recipe, one parameter at a time.`);
X('bay.post', 'tool.bayes', T`Bayes' rule with the constant dropped.`);
X('bay.pred', 'tool.tower', T`Predictive variance is total variance conditioning on $\theta$.`);
X('bay.name', 'tool.square', T`Normal posteriors come from completing the square.`);

/* ---------- MCMC ---------- */
In('mc');
N('mc.start', 'start', T`Posterior known up to a constant`, {
  see: [T`"Describe a Gibbs sampler"`, T`"Compute the acceptance probability"`, T`Joint posterior has no name`],
  goal: T`Build a chain whose stationary distribution is the posterior.`,
  do: [T`Long-run draws are dependent but approximately from the posterior.`], L: [24, 25] });
N('mc.cond', 'ask', T`Full conditionals named?`, { goal: T`Gibbs if you can, MH if you can't.`, L: [25] });
N('gibbs.cond', 'do', T`Derive each conditional`, { f: T`$p(\theta_j|x,\theta_{-j})$`,
  see: [T`"Show the full conditional is…", "identify the name and parameters"`], goal: T`Named distribution for each parameter.`,
  do: [T`Joint → keep factors with $\theta_j$ → add exponents → name the kernel.`, T`Normal: read $A$, $B$ from $e^{-\frac A2\mu^2+B\mu}$.`, T`$\mu\sim\N(m,\frac1\kappa)$: $\mu|\tau,x\sim\N(\frac{\kappa m+\tau n\bar x}{\kappa+n\tau},\frac{1}{\kappa+n\tau})$`, T`$\tau\sim\Ga(a,b)$: $\tau|\mu,x\sim\Ga(a+\frac n2,b+\frac S2)$`, T`Prior $\mu|\tau$: $\mu|\tau,x\sim\N(\frac{\kappa m+n\bar x}{\kappa+n},\frac{1}{(\kappa+n)\tau})$`],
  trap: [T`Before dropping a prior: does it contain the parameter you condition on?`], L: [25, 29] });
N('gibbs.sweep', 'do', T`Gibbs sweep`, { f: T`$\theta_j^{(t+1)}\sim p(\theta_j|x,\text{latest others})$`,
  see: [T`"Give the scheme"`], goal: T`Cycle through the conditionals.`,
  do: [T`Start values, e.g. $\tau^{(0)}>0$.`, T`Each draw uses the **newest** values.`, T`Discard burn-in, keep the rest.`, T`Special case of MH with proposal = full conditional, so $A=1$.`],
  trap: [T`Strong correlation between coordinates: tiny moves. Bivariate: lag-1 autocorrelation is $\rho^2$.`], L: [25] });
N('gibbs.mix', 'do', T`Conditional not named`, {
  goal: T`Mix methods inside the sweep.`,
  do: [T`Finite support: sample with weights (R normalises «prob»).`, T`Otherwise: an MH step for that coordinate.`], L: [25] });
N('mh.q', 'ask', T`Is $q$ symmetric?`, {
  goal: T`Does the proposal ratio cancel?`,
  do: [T`Swap current and new: same formula for every pair?`, T`$\N(\theta_c,s^2)$: yes. $\N(0,1)$, Exp(rate $1/\theta_c$): no.`], L: [24] });
N('mh.sym', 'do', T`Random walk`, { f: T`$A=\min(1,\pi(\theta')/\pi(\theta))$`,
  see: [T`$\theta'=\theta+$ noise, U$[-\epsilon,\epsilon]$, $\N(0,\epsilon^2)$`], goal: T`$q$ cancels.`,
  do: [T`$\pi\propto p(\theta)p(x|\theta)$, constant not needed.`, T`Uphill always accepted, downhill sometimes.`, T`Log form: «A<-min(1,exp(lp(new)-lp(cur)))».`], L: [24] });
N('mh.asym', 'do', T`Full ledger`, { f: T`$A=\min\big(1,\frac{\pi(\theta')q(\theta',\theta)}{\pi(\theta)q(\theta,\theta')}\big)$`,
  see: [T`Proposal is Exponential, Gamma or depends on the current value`], goal: T`Numeric acceptance probability.`,
  do: [T`One line each: likelihood (keep $\tau^{n/2}$), each prior, each proposal.`, T`Top $q$: density of proposing **current from new**.`, T`Multi-part proposals multiply.`, T`Cancel common constants only, then $\min(1,\cdot)$.`],
  trap: [T`Leave $q$ out and it runs silently on the wrong target.`, T`Out of support: $\pi=0$, $A=0$.`], L: [24] });
N('mh.step', 'do', T`Accept or stay`, { f: T`$U\le A$`,
  goal: T`Move with probability $A$.`,
  do: [T`$U\le A$: $\theta^{(t+1)}=\theta'$.`, T`Else $\theta^{(t+1)}=\theta$.`], L: [24] });
N('mh.tune', 'do', T`Tune the step`, {
  see: [T`Acceptance near 1, or near 0`], goal: T`Large moves and high acceptance compete.`,
  do: [T`Tiny steps: high acceptance, slow crawl.`, T`Huge steps: low acceptance, sticky.`, T`Both: high autocorrelation, low ESS.`, T`Aim intermediate (rule of thumb 20–50%).`], L: [24] });
E('mc.start', 'mc.cond');
E('mc.cond', 'gibbs.cond', T`all named`);
E('mc.cond', 'gibbs.mix', T`some not named`);
E('mc.cond', 'mh.q', T`none, or asked for $A$`);
E('gibbs.cond', 'gibbs.sweep');
E('gibbs.mix', 'mh.q', T`MH step`);
E('mh.q', 'mh.sym', T`symmetric`);
E('mh.q', 'mh.asym', T`asymmetric`);
E('mh.sym', 'mh.step');
E('mh.asym', 'mh.step');
E('mh.step', 'mh.tune', T`acceptance too high or low`);
E('mh.step', 'out.start', T`chain done`);
E('gibbs.sweep', 'out.start', T`chain done`);
X('gibbs.cond', 'vi.recipe', T`Same kernel. Gibbs plugs in current values, CAVI plugs in expectations.`);
X('gibbs.cond', 'tool.square', T`Normal conditionals come from completing the square.`);
X('gibbs.cond', 'tool.sum', T`Split $\sum(x_i-\mu)^2$ to expose $\bar x$ and $\mu$.`);
X('mh.step', 'sim.rej', T`Both accept or reject using a density ratio. Rejection retries and gives iid draws; MH stays put and gives a dependent chain.`);

/* ---------- Chain checks ---------- */
In('out');
N('out.start', 'start', T`Chain output shown`, {
  see: [T`Trace plots, «acf», $\hat R$, «effectiveSize»`, T`"Has it converged?", "choose a burn-in"`],
  goal: T`(1) Converged? (2) How correlated? (3) Use the draws.`, L: [26] });
N('out.trace', 'do', T`Read the trace`, {
  goal: T`Converged?`,
  do: [T`Several chains from overdispersed starts.`, T`Good: chains overlap, stable, "hairy caterpillar".`, T`Separate or drifting: not converged.`, T`Slow wander, "woolly snake": high autocorrelation.`, T`Flat runs then jumps: steps too big.`],
  trap: [T`A pass is no proof: all starts may miss a region.`], L: [26] });
N('out.burn', 'do', T`Pick the burn-in`, {
  see: [T`"Choose a burn-in from the plot"`], goal: T`Drop iterations still affected by the start.`,
  do: [T`Read the length off the trace, where chains reach the stable band.`, T`«chain[-(1:burnIn),]» drops them.`], L: [26] });
N('out.rhat', 'do', T`BGR $\hat R$`, { f: T`$\hat R=B/W<1.05$`,
  see: [T`$M$ chains, each length $L+T$`], goal: T`Formal convergence check.`,
  do: [T`Keep last $T$ of each chain.`, T`$B$: sd of the pooled $MT$ draws.`, T`$W$: average of the $M$ within-chain sds.`, T`$\hat R\gg1$: not converged.`],
  trap: [T`Exclude burn-in from $\hat R$.`], L: [26] });
N('out.acf', 'do', T`ACF and ESS`, { f: T`$\mathrm{ESS}\approx n\frac{1-\rho_1}{1+\rho_1}$`,
  see: [T`«acf(chain)», «cor(chain[-n],chain[-1])»`], goal: T`How much information is in the chain?`,
  do: [T`$\rho_k=\mathrm{cor}(\theta^{(t)},\theta^{(t+k)})$`, T`$\mathrm{ESS}=n/(1+2\sum_i\rho_i)$`, T`Aim ESS $>4000$ (slides).`, T`Naive SE too small by $\sqrt{(1+\rho_1)/(1-\rho_1)}$.`, T`Thinning: simple, saves memory, discards information.`], L: [26] });
N('out.use', 'do', T`Use the draws`, { f: T`$\E[g(\theta)|x]\approx\frac1n\sum g(\theta^{(t)})$`,
  see: [T`«mean(th>0)», «quantile», «cumsum(x)/1:n»`], goal: T`Posterior summaries by averaging.`,
  do: [T`After burn-in, average $g(\theta^{(t)})$.`, T`$P(\theta>c|x)\approx$ proportion above $c$.`, T`Credible interval: sample quantiles.`, T`MC s.e.: $s/\sqrt{\mathrm{ESS}}$.`],
  trap: [T`Apply $g$ to each draw, then average: $\E\sigma\ne1/\sqrt{\E\tau}$.`, T`Posterior sd does not shrink with $N$.`], L: [25, 26] });
E('out.start', 'out.trace', T`has it converged?`);
E('out.start', 'out.rhat', T`$\hat R$ or several chains`);
E('out.start', 'out.acf', T`how correlated?`);
E('out.start', 'out.use', T`estimate something`);
E('out.trace', 'out.burn', T`converged after a while`);
E('out.trace', 'mh.tune', T`step size wrong`);
X('out.use', 'sim.mc', T`Same Monte Carlo averaging, but a chain needs ESS in place of $N$.`);
X('out.use', 'bay.point', T`Credible intervals from sample quantiles.`);

/* ---------- Simulation ---------- */
In('sim');
N('sim.start', 'start', T`Build a sampler`, {
  see: [T`"Using only U(0,1) random numbers…"`, T`"Give an algorithm", "minimise rejection"`],
  goal: T`Turn uniforms into draws from $f$.`, L: [23] });
N('sim.type', 'ask', T`What do I have?`, { goal: T`Pick the cheapest method that works.`, L: [23] });
N('sim.disc', 'do', T`CDF loop`, { f: T`$F(x-1)<U\le F(x)$`,
  see: [T`Discrete pmf`], goal: T`Discrete draw.`,
  do: [T`$U\sim$ U(0,1).`, T`«x<-0; while(F(x)<U) x<-x+1»`, T`$P(X=x)=F(x)-F(x-1)=p(x)$`, T`Expected comparisons: $\sum$(tests needed)$\times$prob, so test likely values first.`], L: [23] });
N('sim.inv', 'do', T`Inversion`, { f: T`$Y=F^{-1}(U)$`,
  see: [T`$F$ has a closed-form inverse`], goal: T`One uniform, one draw.`,
  do: [T`$P(Y\le y)=P(U\le F(y))=F(y)$`, T`Exp$(\lambda)$: $-\log(1-U)/\lambda$.`, T`U$(a,b)$: $a+(b-a)U$.`, T`Weibull: $(-\log U)^{1/k}/\lambda$.`], L: [23] });
N('sim.rej', 'do', T`Rejection`, { f: T`accept if $Y<f(X)$`,
  see: [T`Only $f$ or unnormalised $f^*$`, T`Posterior up to a constant`], goal: T`Exact iid draws from a bounded target.`,
  do: [T`(1) $X\sim h$.`, T`(2) $Y\sim$ U$(0,kh(X))$.`, T`(3) If $Y<f(X)$ return $X$, else go to 1.`, T`Prior as $h$: $k=\max_\theta p(x|\theta)$.`],
  trap: [T`$k$ too small biases the output; too big only slows.`, T`$h$ tails at least as heavy as $f$.`], L: [23] });
N('sim.k', 'do', T`Pick $k$`, { f: T`$k\ge\sup_xf(x)/h(x)$`,
  see: [T`"Minimise the rejection rate"`], goal: T`Smallest valid envelope.`,
  do: [T`Uniform envelope on $[a,b]$: $k=(b-a)\sup f$.`, T`Gamma$(m,\lambda)$, $m>1$, $h$ Exp$(\mu)$: best $\mu=\lambda/m$.`, T`$k^*=m^me^{-(m-1)}/\Gamma(m)$`], L: [23] });
N('sim.eff', 'do', T`Efficiency`, { f: T`$P(\text{accept})=1/k$`,
  see: [T`"Expected number of candidates per sample"`], goal: T`Cost of the sampler.`,
  do: [T`$N\sim$ Geom$(1/k)$, $\E N=k$.`, T`With $f^*$: $P(\text{accept})=\int f^*/k$.`], L: [23] });
N('sim.pdf', 'do', T`Derive the output pdf`, {
  see: [T`"Show the algorithm returns draws from $f$"`], goal: T`Prove it works.`,
  do: [T`$P(X\le x|\text{accept})=\frac{P(X\le x,\text{accept})}{P(\text{accept})}$`, T`$=\int_{-\infty}^xh(t)\frac{f(t)}{kh(t)}dt\big/\frac1k=F(x)$`], L: [23] });
N('sim.mc', 'do', T`Monte Carlo estimate`, { f: T`$\frac1N\sum g(X_j)\approx\E g(X)$`,
  goal: T`Turn draws into numbers.`,
  do: [T`Proportions estimate probabilities.`, T`MC s.e.: sd$/\sqrt N$.`, T`Need $N\ge\hat p(1-\hat p)/\se^2$.`],
  trap: [T`sd of draws is the spread, fixed. MC s.e. shrinks.`], L: [23] });
N('sim.read', 'start', T`R loop: what does it make?`, {
  see: [T`«while», «runif», «rbinom», «sample» in a short snippet`], goal: T`Read the pmf or pdf from code.`,
  do: [T`«while(U>G(Y)) Y<-Y+1» means $F=G$: difference it.`, T`«while(runif(1)>p) Y<-Y+1» from 0: failures before first success, $P(Y=y)=p(1-p)^y$.`, T`«-log(runif(1))*m/lambda»: Exp(rate $\lambda/m$).`, T`«tha<-rbeta(N,2,3); X<-rbinom(N,10,tha)»: marginal of $X$.`], L: [23] });
E('sim.start', 'sim.type');
E('sim.type', 'sim.disc', T`discrete pmf`);
E('sim.type', 'sim.inv', T`continuous, $F^{-1}$ in closed form`);
E('sim.type', 'sim.rej', T`only $f$ or $f^*$`);
E('sim.rej', 'sim.k', T`choose the envelope`);
E('sim.rej', 'sim.pdf', T`prove it works`);
E('sim.k', 'sim.eff', T`how many tries?`);
E('sim.disc', 'sim.mc', T`use the draws`);
E('sim.inv', 'sim.mc', T`use the draws`);
E('sim.eff', 'sim.mc', T`use the draws`);

/* ---------- VI ---------- */
In('vi');
N('vi.start', 'start', T`Approximate the posterior`, {
  see: [T`"Find $q^*(\mu)$ and $q^*(\tau)$"`, T`Answer expressed in $\E[\mu]$, $V[\mu]$`, T`ELBO, KL, mean-field`],
  goal: T`Turn inference into optimisation.`, L: [27] });
N('vi.mf', 'do', T`Mean field`, { f: T`$q(\theta)=\prod_jq_j(\theta_j)$`,
  goal: T`Parameters independent under $q$.`,
  trap: [T`An assumption on the approximation, not on the model.`], L: [27] });
N('vi.q', 'do', T`CAVI update`, { f: T`$q_j^*\propto\exp\{\E_{-j}[\log p(\theta,y)]\}$`,
  goal: T`Optimal factor, others held fixed.`, L: [27] });
N('vi.recipe', 'do', T`Four-step recipe`, {
  goal: T`Same kernel as Gibbs, with expectations in place of values.`,
  do: [T`(1) $\log p(\theta,y)=$ log likelihoods + log priors.`, T`(2) Keep terms with $\theta_j$.`, T`(3) Take $\E$ over the others.`, T`(4) Collect powers, name the kernel.`], L: [27] });
N('vi.E', 'do', T`Expectations you need`, { f: T`$\E(x-\mu)^2=(x-\E\mu)^2+V\mu$`,
  goal: T`Replace $\mu$, $\tau$ terms.`,
  do: [T`$\E\mu^2=(\E\mu)^2+V\mu$`, T`$\E\tau=a^*/b^*$`, T`$\E\log\tau=\psi(a^*)-\log b^*$`, T`$\E[1/\sigma^2]=a^*/b^*$`],
  trap: [T`$q_\mu$ uses $\E[1/\sigma^2]$, not $1/\E\sigma^2$.`], L: [27] });
N('vi.prior', 'ask', T`Does the prior on $\mu$ involve $\tau$?`, { goal: T`Changes the shape of $q_\tau^*$.`, L: [27] });
N('vi.joint', 'do', T`Joint prior $\mu|\tau$`, { f: T`$a^*=a_0+\frac{n+1}{2}$`,
  goal: T`Normal-Gamma updates.`,
  do: [T`$q_\mu^*=\N(\mu^*,\sigma^{2*})$: $\mu^*=\frac{\lambda_0\mu_0+n\bar x}{\lambda_0+n}$, $\sigma^{2*}=\frac{1}{(\lambda_0+n)\E\tau}$`, T`$q_\tau^*=\Ga(a^*,b^*)$: $b^*=b_0+\frac12\sum_i\E(x_i-\mu)^2+\frac{\lambda_0}{2}\E(\mu-\mu_0)^2$`, T`Only $\sigma^{2*}$ and $b^*$ change between iterations.`], L: [27] });
N('vi.ind', 'do', T`Independent priors`, { f: T`$a^*=a+\frac n2$`,
  goal: T`Both factors move each round.`,
  do: [T`$q_\mu^*=\N(\frac{\kappa m+n\bar x\E\tau}{\kappa+n\E\tau},\frac{1}{\kappa+n\E\tau})$`, T`$q_\tau^*=\Ga(a+\frac n2,\ b+\frac12[\sum(x_i-\E\mu)^2+nV\mu])$`],
  trap: [T`Shape $a+\frac n2$, not $a+\frac{n+1}{2}$.`], L: [27] });
N('vi.loop', 'do', T`Iterate, watch the ELBO`, { f: T`$ELBO=\E_q[\log p(\theta,y)]-\E_q[\log q]$`,
  goal: T`Check progress.`,
  do: [T`ELBO rises to a local optimum; a drop means a bug.`, T`Stop when the change is small.`, T`Sensitive to starts: keep the highest ELBO.`],
  trap: [T`CAVI updates distributions. It draws no samples.`], L: [27] });
N('vi.elbo', 'do', T`Why maximise the ELBO?`, { f: T`$\log p(y)=ELBO+KL$`,
  see: [T`"Show minimising KL equals maximising the ELBO"`], goal: T`KL needs the unknown posterior; the ELBO does not.`,
  do: [T`$KL(q\|p(\theta|y))=\int q[\log q-\log p(\theta|y)]d\theta\ge0$`, T`$\log p(y)$ is free of $q$, so min KL = max ELBO.`, T`$KL\ge0$ gives $\log p(y)\ge ELBO$.`, T`KL penalises $q$ for mass where $p$ is tiny, so $q$ sits inside $p$.`], L: [27] });
N('vi.vs', 'do', T`VI vs MCMC`, {
  see: [T`"Compare the variance from VI with the exact one"`, T`Bivariate Normal target`], goal: T`Say what VI gets wrong.`,
  do: [T`VI: faster, large data, no guarantee.`, T`MCMC: heavier, asymptotically exact.`, T`Means right, variance underestimated, correlation ignored.`, T`$1/\Lambda_{11}=\sigma_1^2-\sigma_{12}^2/\sigma_2^2<\sigma_1^2$: the conditional variance.`], L: [27] });
E('vi.start', 'vi.mf', T`derive $q^*$`);
E('vi.start', 'vi.elbo', T`explain the objective`);
E('vi.start', 'vi.vs', T`compare with MCMC`);
E('vi.mf', 'vi.q');
E('vi.q', 'vi.recipe');
E('vi.recipe', 'vi.E');
E('vi.E', 'vi.prior');
E('vi.prior', 'vi.joint', T`yes: $\mu|\tau$`);
E('vi.prior', 'vi.ind', T`no: independent`);
E('vi.joint', 'vi.loop');
E('vi.ind', 'vi.loop');
X('vi.E', 'tool.vsq', T`The square trick that CAVI needs in every Normal model.`);
X('vi.elbo', 'tool.jensen', T`$\log p(y)\ge ELBO$ is Jensen again.`);

/* ---------- Tools ---------- */
In('tool');
N('tool.square', 'do', T`Complete the square`, { f: T`$-\frac A2\mu^2+B\mu\to\N(B/A,1/A)$`,
  goal: T`Name any Normal posterior or conditional.`,
  do: [T`Collect the $\mu^2$ coefficient: $A$.`, T`Collect the $\mu$ coefficient: $B$.`, T`Read $\N(B/A,1/A)$.`], L: [15] });
N('tool.sum', 'do', T`Sum of squares split`, { f: T`$\sum(x_i-c)^2=\sum(x_i-\bar x)^2+n(\bar x-c)^2$`,
  goal: T`Expose $\bar x$.`, L: [15] });
N('tool.bayes', 'do', T`Bayes' rule`, { f: T`$P(B_k|A)=\frac{P(A|B_k)P(B_k)}{\sum_jP(A|B_j)P(B_j)}$`,
  goal: T`Flip a conditional.`, L: [14] });
N('tool.tower', 'do', T`Tower and total variance`, { f: T`$\Var X=\E[\Var(X|Z)]+\Var[\E(X|Z)]$`,
  goal: T`Moments of anything built in two stages.`, do: [T`$\E X=\E[\E(X|Z)]$`], L: [14] });
N('tool.vsq', 'do', T`Square trick`, { f: T`$\E[(c-\mu)^2]=(c-\E\mu)^2+\Var\mu$`,
  goal: T`Expectation of a squared term.`, L: [14] });
N('tool.ind', 'do', T`Indicator expectation`, { f: T`$\E[I(A)]=P(A)$`,
  goal: T`Why $Q$ has weights $P_{ik}$.`, L: [14] });
N('tool.jensen', 'do', T`Jensen`, { f: T`$\log\E Y\ge\E\log Y$`,
  goal: T`Lower bounds on a log.`, do: [T`Equal iff $Y$ is constant.`], L: [17] });
E('tool.square', 'bay.name', T`Normal mean posterior`);
E('tool.square', 'gibbs.cond', T`$\mu$ conditional`);
E('tool.square', 'vi.ind', T`$q_\mu^*$`);
E('tool.sum', 'gibbs.cond', T`expose $\bar x$`);
E('tool.bayes', 'mix.resp', T`$P_{ik}$`);
E('tool.bayes', 'bay.post', T`posterior`);
E('tool.tower', 'mix.mom', T`mixture moments`);
E('tool.tower', 'over.cause', T`random rate`);
E('tool.tower', 'bay.pred', T`predictive variance`);
E('tool.vsq', 'vi.E', T`CAVI`);
E('tool.ind', 'em.q', T`$Q$ weights`);
E('tool.jensen', 'em.proof', T`EM ascent`);
E('tool.jensen', 'vi.elbo', T`ELBO bound`);

/* ---------- Drills: fresh scenarios, patterns only. Path follows graph edges from the stem. ---------- */
const S = (...p) => ['stem', ...p];
D(T`An iid sample from a one-parameter density. You reach $l''(\theta)$ and it still contains $\sum x_i$. You need the asymptotic variance of $\hth$.`,
  S('mle.start', 'mle.lik', 'mle.solve', 'mle.ask', 'mle.exp', 'mle.asym'), T`$I(\theta)=-\E[l'']$ with $\sum x_i\to n\E X$, then $\hth\approx\N(\theta,1/I(\theta))$.`);
D(T`Same setup, but this time $l''(\theta)=-n/\theta^2$.`,
  S('mle.start', 'mle.lik', 'mle.solve', 'mle.ask', 'mle.same', 'mle.asym'), T`Write "no data in $l''$, so $J=I$", then the same asymptotic statement.`);
D(T`You have $\hat p$ and its information. The next part wants the MLE of the log odds and its asymptotic variance.`,
  S('mle.start', 'mle.lik', 'mle.solve', 'mle.ask', 'mle.exp', 'mle.asym', 'mle.reparam'), T`The MLE plugs in; the information must be redone on the new scale.`);
D(T`A density has the parameter in its support: $0<x<\theta$. Part (a) asks if it is an exponential family.`,
  S('ef.start', 'ef.check', 'ef.not'), T`No: the support depends on $\theta$.`);
D(T`Show a new count density is an exponential family, then give how the variance depends on the mean.`,
  S('ef.start', 'ef.check', 'ef.match', 'ef.mom', 'ef.v'), T`$\theta,\phi,a,b,c$, then $v(\mu)=b''((b')^{-1}(\mu))$.`);
D(T`Given $y$ and $x$ for a Poisson log-link model, carry out the first iteration of the fitting algorithm by hand.`,
  S('ef.iwls'), T`$\hmu^0=y$, so $z_i=\log y_i$, $W_{ii}=y_i$, then solve $(X\T WX)\hb=X\T Wz$.`);
D(T`Seedlings germinated out of 20 in each tray, with a soil pH predictor. The grower wants effects quoted as odds.`,
  S('glm.start', 'glm.y', 'glm.bin', 'glm.link', 'glm.logit'), T`Binomial with logit link: $e^{\beta}$ is an odds ratio.`);
D(T`Insects caught per trap, where traps were left out for different numbers of nights.`,
  S('glm.start', 'glm.y', 'glm.pois', 'glm.exp', 'glm.offset'), T`Poisson with «offset(log(nights))»: the coefficient of $\log t$ is fixed at 1.`);
D(T`Repair times are positive and skewed, and the spread scales with the mean.`,
  S('glm.start', 'glm.y', 'glm.gam'), T`Gamma GLM: $\Var Y=\phi\mu^2$, $\phi$ estimated, so $t$ and $F$.`);
D(T`Two binomial fits with the same predictors, one logit and one cloglog. Which is better?`,
  S('test.start', 'test.set', 'test.aic'), T`Not nested, so no LRT. Smaller AIC.`);
D(T`Poisson summary printed. Is temperature needed, given the other predictors?`,
  S('test.start', 'test.one', 'test.z'), T`$z^*=\hb/\se$ vs 1.96: $\phi$ is fixed at 1.`);
D(T`A Poisson fit has a 4-level factor and none of its 3 dummies is significant. Does the factor matter?`,
  S('test.start', 'test.set', 'test.setphi', 'test.lrt'), T`One LRT on 3 df: $\Delta D$ vs $\chi^2_3(.95)$.`);
D(T`Quasi-Poisson small and big models printed with two $\hphi$ values. Should the extra terms stay?`,
  S('test.start', 'test.set', 'test.setphi', 'test.f'), T`$F=(\Delta D/s)/\hphi_B$ on $(s,n-p_B)$, using the big model's $\hphi$.`);
D(T`Response is 0/1 and the residual deviance is close to its df. A classmate says this shows a good fit.`,
  S('test.start', 'test.fit', 'test.nogof'), T`Invalid: fitted counts too small, and for 0/1 logit $D$ depends only on $\hat p_i$.`);
D(T`Poisson fit, all $\hmu_i>5$, $D=190$ on 40 df. Check the fit, then deal with what you find. Residual plots look clean, and you are asked what fitting to use instead.`,
  S('test.start', 'test.fit', 'test.gof', 'over.start', 'over.rule', 'over.yes', 'over.fix', 'quasi.fit'), T`GOF rejects; no mean problem; two quantitative reasons; quasi-Poisson.`);
D(T`Poisson SE is printed and $\hphi$ is printed for the same model. What is the SE allowing for overdispersion?`,
  S('over.start', 'over.rule', 'over.yes', 'over.fix', 'quasi.fit', 'quasi.se'), T`$\se_Q=\sqrt{\hphi}\,\se_P$, then $t=\hb/\se_Q$.`);
D(T`Worth 4 marks: what misleading results can you get if you ignore the overdispersion?`,
  S('over.start', 'over.rule', 'over.yes', 'over.ignore'), T`$\hb$ fine; SEs too small; spurious significance; CIs too narrow.`);
D(T`Weekly proportions (non-integer) are observed with variance proportional to $\mu(1-\mu)$. No distribution is stated. Can you fit a model?`,
  S('glm.start', 'glm.y', 'quasi.new', 'quasi.fit'), T`Yes: logit link, $v=\mu(1-\mu)$, IWLS, $\hphi$ from Pearson.`);
D(T`Logit output with «vcov». Give a 95% CI for the probability at $x_0$.`,
  S('est.start', 'est.pred', 'est.ci'), T`CI on $\eta$, then apply $g^{-1}$ to both ends.`);
D(T`Output shows AIC and residual deviance. Find $\hat l$ and the saturated log-likelihood.`,
  S('est.start', 'est.ll'), T`$\hat l=p-AIC/2$, $l_S=\hat l+D/2$.`);
D(T`Logit slope is printed. Find a 95% CI for the odds ratio for a 5-unit decrease in $x$.`,
  S('est.start', 'est.interp', 'est.or'), T`$\exp\{-5(\hb\pm1.96\,\se)\}$, then swap the ends.`);
D(T`A Cook's distance plot has one clear jump. What now?`,
  S('diag.start', 'diag.cook', 'diag.class', 'diag.refit'), T`Classify, refit without it, compare $\hb$, $D$, $\hphi$.`);
D(T`Residuals vs fitted show a clear curve.`,
  S('diag.start', 'diag.pat'), T`Wrong mean: add a term or change the link.`);
D(T`Two-component Normal mixture with values given. Which component would you assign $x=2.1$ to?`,
  S('mix.start', 'mix.write', 'mix.goal', 'mix.resp'), T`$P_{i1}=\pi_1f_1/(\pi_1f_1+\pi_2f_2)$, assign to the largest.`);
D(T`Two-component Poisson mixture. Why would a single Poisson fit to this look overdispersed?`,
  S('mix.start', 'mix.write', 'mix.goal', 'mix.mom'), T`$\Var X=\bar\lambda+\pi_1\pi_2(\lambda_1-\lambda_2)^2>\E X$.`);
D(T`Normal mixture, plus 30 extra points known to be from component 1. Derive the M-step.`,
  S('em.start', 'em.q', 'em.twist', 'em.known', 'em.loop'), T`Known points add $\sum\log f_1$ with weight 1 and no $\pi$; $\hat\pi_k=N_k/n$ on unlabelled $n$.`);
D(T`Mixture of Exp$(\lambda)$ and Exp$(3\lambda)$ with a single $\lambda$. Derive the update.`,
  S('em.start', 'em.q', 'em.twist', 'em.tied', 'em.loop'), T`Collect all $\lambda$ terms across components, differentiate once.`);
D(T`Three EM runs on the same data print different log-likelihoods, and two have the same value with labels swapped.`,
  S('em.run', 'em.pick'), T`Keep the highest incomplete log-lik; equal values with permuted labels are the same fit.`);
D(T`A run started both means at the same value and they never move.`,
  S('em.run', 'em.stuck'), T`Every $P_{ik}=\pi^0$, so both means stay at $\bar x$.`);
D(T`Poisson counts with a Gamma prior on the rate. Give the Bayes estimate.`,
  S('bay.start', 'bay.post', 'bay.n', 'bay.kernel', 'bay.name', 'bay.ask', 'bay.point'), T`$\lambda|y\sim\Ga(a+\sum y_i,b+n)$, posterior mean $a_n/b_n$.`);
D(T`Normal data, known mean, InvGamma prior on the variance. Distribution of a new observation?`,
  S('bay.start', 'bay.post', 'bay.n', 'bay.kernel', 'bay.name', 'bay.ask', 'bay.pred'), T`Integrate over the posterior: a $t$, or simulate $\theta$ then $\tilde x$.`);
D(T`Independent Normal prior on $\mu$ and Gamma prior on $\tau$, small data, accuracy matters. Say how you would get posterior means.`,
  S('bay.start', 'bay.post', 'bay.n', 'bay.joint', 'bay.how', 'mc.start', 'mc.cond', 'gibbs.cond', 'gibbs.sweep'), T`Both conditionals are named: Gibbs, then discard burn-in and average.`);
D(T`Proposal for $\tau$ is Exponential with mean equal to the current value. Compute the acceptance probability.`,
  S('mc.start', 'mc.cond', 'mh.q', 'mh.asym'), T`Asymmetric: include $q(\text{new},\text{cur})/q(\text{cur},\text{new})$ in the ledger.`);
D(T`Random-walk Normal proposal on $\mu$.`,
  S('mc.start', 'mc.cond', 'mh.q', 'mh.sym'), T`$q$ cancels: $A=\min(1,\pi(\mu')/\pi(\mu))$.`);
D(T`Target $f(x)\propto x(1-x)^2$ on $(0,1)$, uniforms only, and you must say how many tries per sample.`,
  S('sim.start', 'sim.type', 'sim.rej', 'sim.k', 'sim.eff'), T`Uniform envelope at $\sup f^*$; $P(\text{accept})=\int f^*/k$.`);
D(T`Sample from an exponential distribution with one uniform.`,
  S('sim.start', 'sim.type', 'sim.inv'), T`$-\log(1-U)/\lambda$.`);
D(T`Three chains from spread-out starts: traces settle into a shared band after 300 iterations. What do you discard?`,
  S('out.start', 'out.trace', 'out.burn'), T`Burn-in of about 300, read off the trace.`);
D(T`A chain of length 5000 has lag-1 autocorrelation 0.8. How much is it really worth?`,
  S('out.start', 'out.acf'), T`$\mathrm{ESS}\approx5000\times0.2/1.8$.`);
D(T`Gibbs draws of $\tau$ are given. Estimate the posterior mean of $1/\sqrt\tau$.`,
  S('out.start', 'out.use'), T`Transform each draw, then average. Do not transform the mean.`);
D(T`Independent priors on $\mu$ and $\tau$. Find $q^*_\tau$.`,
  S('vi.start', 'vi.mf', 'vi.q', 'vi.recipe', 'vi.E', 'vi.prior', 'vi.ind'), T`$\Ga(a+\frac n2,\ b+\frac12[\sum(x_i-\E\mu)^2+nV\mu])$.`);
D(T`Exact posterior variance vs CAVI's. Which is smaller and why?`,
  S('vi.start', 'vi.vs'), T`CAVI's: mean field ignores correlation and underestimates variance.`);

return { regions, mapLinks, nodes, edges, rels, drills };
})();
