

## Plan: Embed Debt Payoff Calculator into Debt Tracker

### File: `src/components/tracker/DebtTracker.tsx`

**1. Add state** for the calculator section:
- `payoffMethod`: `"snowball" | "avalanche"` (toggle between the two)
- `extraPayment`: number (extra monthly payment to apply)

**2. Add a new "Debt Payoff Calculator" card** after the chart section, containing:
- A toggle/select to choose payoff method (Snowball vs Avalanche)
- A currency input for extra monthly payment amount
- A **numbered ordered list** of debts sorted by the selected method, showing each debt's creditor, balance, interest rate, and min payment -- this is the "pay in this order" view
- Summary result boxes: total payoff time (with extra), total interest paid, and interest saved vs minimum-only

**3. Calculator logic:**
- Sort debts by selected method (snowball = smallest balance first, avalanche = highest rate first)
- Simulate month-by-month payoff: pay minimums on all debts, apply extra payment to the first unpaid debt in order. When a debt is paid off, roll its payment + extra into the next debt
- Compare against minimum-only scenario to calculate interest saved and time saved

**4. Remove** the standalone Debt Payoff Calculator card from `FinancialCalculators.tsx` (lines ~120-135) since it's now integrated

### No database changes needed -- all calculator logic is client-side using existing debt data.

