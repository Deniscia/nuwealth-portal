

## Plan: Add Payoff Timeline Chart to Debt Payoff Calculator

### File: `src/components/tracker/DebtTracker.tsx`

**1. Modify `simulatePayoff`** to also return a `timeline` array — an array of `{ month, ...balancePerCreditor }` objects capturing each debt's remaining balance at each month. Sample every N months if total months is large (cap at ~60 data points for readability).

**2. Add an Area Chart** (using Recharts `AreaChart` + `Area`, already available) inside the Debt Payoff Calculator card, placed between the ordered list and the results boxes. Each debt gets its own stacked area in a distinct color, showing balance declining to zero over time. X-axis = month, Y-axis = dollar amount.

**3. Color palette**: Use a predefined array of 6-8 colors so each creditor gets a unique fill. Include a legend via Recharts `Legend`.

No new dependencies needed — Recharts `AreaChart` and `Area` are already available.

