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
