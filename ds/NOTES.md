# Notes

## Preferences / rules
- **Intuition first, many scenarios** (user, 14 Oct): "a lot of this subject is really focused around building intuition, so it can be applied to a lot of different cases." Every lesson explains why before how, runs one setup through several scenarios (up/down, strengthen/weaken, above/below fair value, long/short side), has predict-first prompts and lots of directional "what happens if" questions, and leaves a reusable rule of thumb.
- **Past exams are OFF-LIMITS for practice** (`exams/`, `MST/`). The user will sit them timed and cold. Never reproduce or lightly reword one. DO mine them for patterns, tricks, variations and difficulty, and build fresh exam-style questions (new numbers, new setups). User (12 Oct): "Exam style questions are the best and most accurate source of what my exam will look like."
- Tutorial questions (`tutes/`, with solutions) can be used directly or assigned as homework by number.
- Starting from zero finance knowledge on 12 Oct 2026. Define every term the first time it appears.
- Same teaching set-up as `../diff`: short Tufte-style HTML lessons, immediate-feedback quizzes, a trimmed homework set (about 3 parts per question) with the rest optional.
- **Open lessons in VS Code's integrated browser**: serve with `python3 -m http.server 8766 --bind 127.0.0.1 --directory <ds workspace>` (start it if `lsof -iTCP:8766` shows nothing), then `code --open-url http://localhost:8766/lessons/<file>.html`, and print the link too. (diff uses port 8765.)
- `assets/quiz.js` supports numeric typed answers (`.quiz.num`). Use these for calculations; MCQ for concepts.

## Course map (lectures → tutorials)
1. Futures intro: long/short, settlement, convergence, margins and daily settlement, forwards vs futures (L1, T1)
2. Hedging with futures: short/long hedges, basis risk, cross-hedging, minimum-variance hedge ratio, stock-index futures and beta (L2, T2)
3. Forward and futures pricing: cost of carry, income, yields, storage, convenience yield, currency forwards, valuing forwards (L3, T3)
4. Options intro: payoffs, profit diagrams, put-call parity, bounds (L4, T4)
5–6. Binomial trees I and II, American options, futures options (L5, L6, T5, T6)
7. Black-Scholes-Merton (L7, T7)
8–9. Dividends; Greeks and delta hedging (L8, L9, T8, T9)
10. Lecture 10 (handwritten notes only). Check the topic. Older finals also had interest rates/swaps (zero rates, par yield); confirm whether they're on the 2026 syllabus.

## Exam patterns, topic 1 (patterns only, from MST/finals, for designing practice)
- Margin account with several contracts: settle-price changes × multiplier × number of contracts; a margin call restores to the **initial** margin (total across contracts) whenever the balance drops **below maintenance**; you can withdraw only the excess **above initial**.
- Twists: adding more contracts mid-way on the same delivery month (new initial margin deposited; the old and new positions are marked against different prices on that day); the first day is marked against the entry price, not the previous settle; short positions gain when the price falls; working out how many contracts a given amount of capital buys (capital ÷ initial margin per contract); the "falls by how much before a call" and "rises by how much before a withdrawal" questions.
- MCQ distractors: restoring to maintenance instead of initial; measuring the loss from maintenance; forgetting the contract size or the number of contracts.
- Convergence: if F > S at delivery → short futures, buy the asset, deliver; F < S is not a clean arbitrage, because the short chooses delivery.
- Conceptual MCQs on lecture case studies and news articles (Hershey, cocoa, Metallgesellschaft stack-and-roll liquidity, oil backwardation). These need the lecture recordings or slides; lessons can only flag them.
- Leverage: return on margin vs return on the index (SPI 200 at $25/pt).
- Conceptual one-mark MCQs (lesson 0002 targets these): "which is an advantage of futures over forwards" with distractors that are really forward features or futures disadvantages (tailoring, extra liquidity needed for margin calls); "which statement is true" about where forwards/futures trade (exchange vs OTC); multi-statement "(i)–(iv), which are true" items mixing systemic risk, OTC volume, "margining only on exchanges", central counterparties; who chooses delivery and the effect of delivery flexibility (grades, locations) on the futures price; classifying hedger / speculator / arbitrageur and long vs short hedger; liquidity risk from daily margin calls when rolling short-dated futures against a long-dated exposure (Metallgesellschaft-style), and the movie case (Trading Places FCOJ, clearing-house calls).
- Open interest/volume and order types are not on the Lecture 1 slides (Hull Ch. 2 only) and didn't appear in the MSTs seen; 0002 covers open interest briefly, order types skipped.

## Exam patterns, topics 2–3 (hedging and pricing; patterns only, collected 15 Oct by lesson subagents)
- **Basis MCQ (1 mark):** the basis unexpectedly strengthens/weakens; how does the effective price (F1 + b2) compare with expectation, for a short or a long hedger (the two streams flip the side). Distractors: "futures eliminate basis risk", "now speculating", "need the margin balance".
- **Stack-and-roll MCQ:** answer = short-run liquidity pressure from daily settlement plus rollover losses. **For/against hedging** pair MCQs. **FX direction** MCQs worded "naturally long/short X"; article twist: a wider forward premium makes the importer's hedge dearer, higher vol makes option hedges dearer, and the expected shock duration drives the hedge ratio.
- **Final cross-hedge question (~10 marks):** stats table (mean, σ, β, α for the hedged spot, proxy spot, proxy futures) + correlation matrix where the proxy spot–futures ρ (~0.99) and the proxy spot σ are distractors. Parts: direction + reason, maturity (first after the purchase date, avoid delivery month), N* ignoring tailing, a full strategy summary (open date/side/maturity/N/price; close trade), "can the effective price be known today?" (no: asset + maturity mismatch → basis risk). MSTs: "which is NOT correct" about h*.
- **Beta question:** MST 2-mark 5-option "Long/Short N" (distractors: wrong side, only β or only β*). Finals (10–14 marks): direction, maturity, compute F = S·e^{(r−q)T} for that month (expires last day of month, 4-dp rounding), N, residual risks (more/less exposed than before), 6-month expected return rf/2 + α/2 + β*(E[rm] − rf/2). Variants: ¥ multiplier, negative-beta short fund going long.
- **Forward arbitrage:** dealer forward vs spot on an index; fair F, t=0 and t=T cash-flow tables (net 0 at t=0, S_T cancels), $ → index units → contracts. Twist: a holder "temporarily replaces" the portfolio (sell, invest, long forward). Rounding "4 dp at each step" shifts answers on big notionals.
- **MST arbitrage MCQ (2 marks, 5 options):** investment metal with storage payable at the end; options = strategy + profit with wrong-direction, forgot-storage, "convenience yield" and "storage allows any premium" distractors. Index versions with q > r.
- **Commodities:** classify industry vs normal contango/backwardation from (S0, F, E[ST]) ("can't classify without storage" distractor); supply shock (Hormuz) → prompt up more than deferred → deeper backwardation, higher y. Finals: oil y in % to 2 dp + explain why cheap futures isn't arbitrage for a consumption asset. 2022 final also had roll yield and hedging pressure (roll yield not taught; check syllabus).
- **FX:** "X per AUD" spot (AUD is foreign!), two continuous rates, 2–3 forwards at end-of-month expiries; fair value of each to 4 dp, find the mispriced one, arbitrage with amounts.
- **Valuation:** value of a short forward agreed earlier (sign-flip and undiscounted distractors); futures vs forward price under ± correlation; 2025 final asked forward delta 1 vs futures delta e^{rT} (formula sheet has it).
- Notation: Lesson 3 uses Hull/MST F1 + b2; lecture slides and Lesson 4 use F0 + b1. Same formula.

## Official 2026 final exam info (lecturer's PDF, user shared 22 Oct; source exams/Final exam information.pdf)
- **Coverage:** Topics 1–10. Guest lecture excluded. **Case studies examinable** (cases/: Hershey, Oil futures, GameStop, Binomial on futures options, BSM). 30% Topics 1–4, 70% Topics 5–10 (binomial, BSM, dividends, Greeks, swaps): lessons/practice should weight the back half. Past paper doesn't mirror this split.
- **Format:** 8 short-answer questions, **no MCQ**. 65 marks (≈8 per question), 65% of grade. ~85% calculation, ~15% theory. **Derivations examinable**; the question gives the initial portfolio setup (e.g. replicating/hedge portfolio, arbitrage table) and you derive the result. Final answer to the dp stated in each question; write in answer boxes, overflow to last page with the sentence "My answer continues on the last page".
- **Tools:** Casio fx-82 only. Formula sheet on LMS (exams/Final Exam Formula Sheet.pdf); all lecture content examinable even if not on the sheet (concept-only items have no formula).
- **Clarifications:** traditional binomial valuation approach (expected payoff at risk-adjusted rate; lesson 17 §2) NOT examined. Binomial up to 3 steps. BSM: round d1, d2 to 2 dp, no interpolation. Swap design: same floating rate for ALL floating payments, as in the lecture.
- **Design rules this implies for lessons/quizzes (apply to everything not yet built, and to new mixed-practice sets):**
  - No MCQ-style exam practice: use `.quiz.num` typed answers with the dp stated, and short written answers (2–4 sentences, model answer revealed) for the 15% theory. MCQ only for quick concept checks inside a lesson.
  - Include "derive it from this setup" items (given portfolio → show the result), e.g. delta-hedge/replication portfolio, p formula, forward arbitrage table, h*, BSM-delta intuition, swap valuation as bonds/FRAs.
  - Case-study items per case (what happened, why, which concept it illustrates), in written-answer form.
  - Question sizes ≈ 8 marks, multi-part; mark allocations shown; count of working steps matches marks.
  - Trees max 3 steps; BSM d to 2 dp via table (no interpolation); calculator is fx-82, so avoid anything needing more than basic functions (e^x, ln, √ fine).
  - Swap lessons: build/design a swap with one floating rate (reference rate) for all floating legs; cover the lecture's method only.
  - Do not teach the traditional binomial approach beyond a "not examined" flag.
- Done 22 Oct: MISSION.md updated; lesson 17 §2 flagged "not examined".
- TODO: Topics 8 (dividends), 9 (Greeks/delta hedging), 10 (swaps) lessons per above; case-study lessons (5 cases); written-answer + derivation practice set; mixed 8-question mock exam in the official format (65 marks).

## Plan
1. 0001 Futures mechanics and margin accounts ← drafted 12 Oct
2. 0002 Forwards vs futures, clearing house, delivery, open interest, trader types ← drafted 12 Oct
3. 0003 Hedging and basis risk (L2) ← built 15 Oct (lessons 3–10 all built by subagents 15 Oct, numbers spot-checked)
4. 0004 Cross hedging and the minimum-variance hedge ratio (L2, T3 Q7)
5. 0005 Hedging with stock index futures / beta (L2, T2 Q6)
6. 0006 Cost of carry and arbitrage, compounding (L3)
7. 0007 Assets with income and yield, index futures (L3, T3 Q2–Q3)
8. 0008 Currency forwards (L3, T3 Q4)
9. 0009 Commodities, storage, convenience yield, contango/backwardation (L3)
10. 0010 Valuing forward and futures contracts, forward vs futures (L3, T3 Q1, Q5, Q6)
11. then options (L4 onward). Futures options (L6) deferred until after options basics.
12. Topic 4 (options intro) built 20 Oct by 5 parallel subagents: 0011 payoffs/profits/moneyness (+ brief strategies, which past papers test), 0012 factors affecting prices, 0013 bounds, 0014 put-call parity, 0015 early exercise + mixed retrieval quiz. Reference: reference/options-cheatsheet.html. Not browser-checked; numbers recomputed in Python.
13. Topics 5–6 (binomial) built 22 Oct by 6 parallel subagents, one per lesson: 0016 one-period replication, 0017 risk-neutral valuation, 0018 two-step trees + u/d from σ, 0019 American options on trees, 0020 futures options basics + parity, 0021 futures-option trees + mixed quiz. KaTeX strict-checked (0 failures) and headless-Chrome rendered. Reference: binomial section appended to reference/options-cheatsheet.html; glossary rows added. Assets: three tree widgets (binomial-tree.js, binomial-tree-widget.js, american-tree.js) plus futures-option-tree-explorer.js, overlapping; could consolidate.
14. Topic 7 (BSM) built 22 Oct by 7 parallel subagents: 0022 normal/lognormal prices, 0023 BSM assumptions + delta-hedge intuition + N(d1)/N(d2), 0024 computing c/p (tables), 0025 BSM as limit of tree (convergence), 0026 implied vol/smile/VIX, 0027 Black's model + FX/yield/dividend preview (L8 overlap), 0028 capstone exam-style. New widgets: bsm-lognormal-explorer, bsm-limits-explorer, bsm-price-explorer, bsm-convergence-plot, bsm-implied-vol-solver, bsm-blacks-calculator.

## Exam patterns, topics 5–6 (patterns only, 22 Oct)
- Final binomial Q ≈ 10–12 marks, 2–3 steps, u = e^{σ√Δt}, d = 1/u, "4 dp at each step". Parts: price European/American tree; market-maker Δ hedge (long put → long |Δ| shares); "does Δ0 still hedge at t=1?" (no, rebalance); arbitrage if quoted price ≠ tree value; 2-mark "risk preferences play no role" (disagree: they act through S0); link binomial↔BSM.
- Variants: odd payoffs (squared, digital), percentage up/down moves, 3-step American put/FX/index options, dividends on trees (not yet covered; belongs with Topic 8).
- Futures options: only Black's model (BSM lesson) in the 2025 final; formula sheet has futures parity, bounds, p = (1−d)/(u−d). MSTs had no binomial questions.
- Open: Tute 6 Q6 day-count (lesson 21 uses T=83/365); Hull chapter numbers approximate; lesson 19 widget controls not click-tested.

## Exam patterns, topic 4 (patterns only, 20 Oct)
- 1-mark MCQs: intrinsic vs time value from S, K, premium (distractor: intrinsic = premium); ATM has most time value; straddle / bull spread definitions; which statement is true of a European call (distractors: value ≥ K, bound exactly 0, can exceed S).
- Short question: time value of an American put (S=30, K=32 style), sign of the put premium after a dividend announcement (rises), zero time value means exercise now.
- Parity: put from call with discrete dividends (PV(D) added), FX/index put with r_f or q; sample exam repeated Tute 4 Q4 numbers verbatim, so tutes do reappear. Vol change: Δc = Δp.
- American call, no dividends: never exercise early (distractors "deep ITM", "low vol", "r = 0"). Early put exercise: r up, vol down.
- Arbitrage MCQ: American put below K − S → buy put and stock, exercise.
- Open: 'Black's pseudo-American' appeared in a 2021 practice final (check syllabus). Tute 4 Q7.2 GameStop xlsx not in workspace. Lesson 14's claim that same-K/T European options share implied vol is unverified. Hull chapter numbers in lessons are approximate.

## Exam patterns, topic 7 BSM (patterns only, 22 Oct)
- 2025 final BSM slot: ~10 marks: P(call exercised) 5 marks (lognormal, μ given, use μ not r), P(put exercised) 1, binomial vs BSM assumptions 1, convergence condition 1, link 2. 4-dp working common.
- BSM pricing: stock with 2 dividends (one after expiry, ignore it), FX option, 5,000 lb copper futures put (Black, 6 marks: exercise-now/margin credit 2 + price 4; contract multiplier). 2022 final: d to 4dp with table interpolation; 2025: 2dp d.
- Delta hedge: units of stock to hedge, then re-hedge after move (5+5). Call N(d1), put N(d1)−1.
- MCQ 2 marks: implied vol definition; delta of ITM put near maturity → −1. 6-mark short answer: explain implied vol + VIX. MSTs had no BSM.
- BSM rounding rule (settled 22 Oct from Lecture 7, Tute 7 solutions, 2025 final solutions): d2 = unrounded d1 − σ√T, then round d1, d2 to 2dp; N at 4dp from table, no interpolation, N(−x)=1−N(x); contract size inside formula, round once at end; answer to dp asked, else 2dp dollars. Exception: 2022 final said 4dp d + interpolation, so obey the paper. Table answer differs from exact by up to ~6c; write the table answer. N table is in exams/Final Exam Formula Sheet.pdf pp.5–6 (x≤0 and x≥0 tables, 0.00–4.00, 4dp, 'no interpolation required'); formula sheet also has delta formulas, Black, yield/FX/dividend BSM.
- Brent (Tute 7 Q6 / solutions Q8): tute 6.82/7.23/7.45/7.57 are AMERICAN-tree values (futures call early exercise), T=84/365; European 6.80/7.21/7.43/7.55 (limit 7.667 = Black); American limit ~7.68.
- VIX: only slide content used (30-day S&P 500 implied vol, 15 = 15% pa, futures x1000, buy 18.5 close 19.3 = +$800). No 1-s.d. move rule on slides; removed.
- Handwritten L7 notes read in full (sparse): option vs futures expiry table, hedge rule, N(x) shaded area, φ(3.2,1.6) example, S→0 / S→∞ limits. All covered now.
- Open: slide 8 mixes variance/s.d. in φ(3.990,0.045) (trap box in 0022); slide 34 prices illustrative not exact BSM (stated in 0026); Tute 7 Q5(c) solution says "increasing time step" (should be shorten; noted in 0025); Lesson 14 same-K/T implied-vol claim holds at BSM prices only; 0027 previews L8 (yield, currency, dividends), overlap accepted; Hull chapter numbers approximate; d2 rule being applied across 0022–0028 (22 Oct, second pass).
