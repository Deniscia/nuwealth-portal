

## Add "Regulating Financial Stress" Workbook to Phase 1

**File:** `src/data/workbooks.ts`

### Changes

1. Insert new workbook `p1-regulating-stress` with `order: 5` after `p1-mindset-journal` (order 4), at the end of Phase 1's workbooks array.

2. **Section 1: "Body Awareness Mapping" (Guide)**
   - Description with instructions (close eyes, think about checking bank account, notice body sensations)
   - Note about the body diagram placeholder
   - One `textarea` field: "Where do you feel financial stress in your body? Describe the sensations and where they show up (chest, throat, stomach, shoulders, etc.)"

3. **Section 2: "Financial Regulation Tools" (Guide)**
   - Description explaining to try each grounding technique during the week
   - A `repeating` field pre-populated guidance with 4 techniques as description, with columns:
     - "Technique" (text, read-reference in description)
     - "Tried?" (checkbox with options ["Yes"])
     - "Calming?" (checkbox with options ["Yes"])
     - "Notes" (text)
   - Actually, since repeating allows adding/removing rows and we want fixed rows, better approach: use 4 groups — each technique gets its own row. But the `repeating` type lets users add/remove. 
   
   **Better approach:** Use a set of fields per technique. For each of the 4 techniques, render a label and checkbox + text fields. This can be done with 4 mini-groups inside a single section, each having a checkbox "Tried" + checkbox "Calming" + text "Notes". To keep it clean, use individual fields with descriptive IDs:
   - For each technique (Box Breathing, EFT Tapping, Mindful Money Check-in, Positive Self-Talk): a `checkbox` field with options ["Tried it", "Found it calming"] plus a `text` field for notes.

4. **Section 3: "Money Ritual Design"**
   - Description about building a calm money ritual
   - A `repeating` field with 4 columns: "Ritual Step" (text), "Frequency" (text), "Environment" (text), "How It Makes Me Feel" (text)
   - Description includes examples

5. **Section 4: "The Weekly Money Check-In" (Guide)**
   - Description explaining this is a weekly practice
   - A `checkbox` field with 5 options:
     - "I reviewed my income and expenses calmly"
     - "I noticed any triggers without judgment"
     - "I celebrated one small win"
     - "I practiced gratitude for one financial blessing"
     - "I affirmed: 'I am building a safe relationship with money.'"

6. **Section 5: "Moving Forward"**
   - Description with the commitment statement text displayed as the section description
   - A `text` field labeled "Sign your name here" for emotional closure (signature line)
   - A `textarea` for any final thoughts

### No other file changes needed
All field types used (textarea, text, checkbox, repeating) are already supported by the existing `WorkbookFieldRenderer`.

