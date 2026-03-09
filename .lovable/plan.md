

## One-Card-at-a-Time Workbook Navigation

**What changes:** Replace the current scroll-through-all-sections layout in `WorkbookPage.tsx` with a step-by-step card view that shows one section at a time.

### How it works

1. **Add a `currentStep` state** (0-indexed) tracking which section is visible
2. **Render only `workbook.sections[currentStep]`** instead of mapping all sections
3. **Add a progress indicator** at the top showing "Step X of Y" with a slim progress bar
4. **Add Previous / Next navigation buttons** at the bottom of each card:
   - First card: only "Next" button
   - Middle cards: "Previous" and "Next"
   - Last card: "Previous" and "Mark as Complete" (replaces the current separate complete button)
5. **Auto-save on step change** -- trigger `save()` when navigating between steps
6. **Smooth transition** -- use a fade/slide animation when switching cards

### UI Layout

```text
┌─────────────────────────────────┐
│ ← Phase 1 · Money Story    Saved│
│ ─────────────────────────────── │
│ Step 2 of 3    ████████░░░░░░░  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Family Money Messages       │ │
│ │ (section description)       │ │
│ │                             │ │
│ │ [field 1]                   │ │
│ │ [field 2]                   │ │
│ │ ...                         │ │
│ └─────────────────────────────┘ │
│                                 │
│   ◀ Previous        Next ▶      │
└─────────────────────────────────┘
```

### File changed

- **`src/pages/WorkbookPage.tsx`** -- add `currentStep` state, render single section, add step indicator + prev/next buttons, trigger save on navigation. No other files need changes.

