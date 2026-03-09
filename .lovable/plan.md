

## Add "Money Trauma 101" Workbook to Phase 1

**File:** `src/data/workbooks.ts`

### Changes

1. Insert a new workbook object at the beginning of Phase 1's `workbooks` array with `id: "p1-money-trauma"`, `order: 1`, `title: "Money Trauma 101"`

2. **Section 1: "Defining Money Trauma"** — one `textarea` field ("In your own words, what does 'money trauma' mean to you?")

3. **Section 2: "The Ripple Effect"** — two fields:
   - A `repeating` field with 4 columns: "Event" (text), "Emotion You Felt" (text), "How You Reacted" (text), "What You Needed Instead" (text). Description includes the example row (e.g., "Job loss / Fear / Shut down emotionally / Reassurance and a plan").
   - A `textarea` for guided reflection: "When I think about my relationship with money, I notice that..."

4. Bump `order` on existing Phase 1 workbooks (`p1-money-story` → 2, `p1-mindset-journal` → 3, etc.)

No other files need changes — existing `WorkbookFieldRenderer` already handles all required field types.

