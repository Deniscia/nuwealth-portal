

## Add "Your Money Wounds — Self Quiz" with Reflection to Phase 1

The quiz workbook hasn't been created yet, so this plan covers the full implementation including the reflection section you've requested.

### File: `src/data/workbooks.ts`

1. **Add `min`/`max` optional properties** to the `WorkbookField` interface for custom slider ranges.

2. **Insert new workbook** `p1-money-wounds-quiz` with `order: 3` (after `p1-money-story` at order 2), with three sections:

   - **Section 1: "Rate Each Statement"** — 6 slider fields (1–5 scale) for each quiz statement
   - **Section 2: "Scoring Guide"** — Description text explaining the three wound types, plus a textarea for identifying their pattern
   - **Section 3: "Reflection"** — Two textarea fields with generous min-height:
     - "What does your money wound type reveal about how you protect yourself emotionally?"
     - "How has this pattern helped you survive — and how might it now be holding you back?"

3. **Bump** `p1-mindset-journal` order from 3 → 4.

### File: `src/components/workbook/WorkbookFieldRenderer.tsx`

4. **Update slider case** to use `field.min ?? 1` and `field.max ?? 10` instead of hardcoded values, and display the correct range labels.

