---
description: Perform a strict read-only audit of the target file to ensure IMT compliance
argument-hint: [path to file — defaults to IDE-opened file]
---

# /audit

Perform a strict, read-only audit of the target file(s) to ensure they comply with the IMT Codebase Patterns (`docs/technical/codebase-patterns.md`). 

## Target
Argument: `$ARGUMENTS`
If empty, use the file currently opened in the IDE.

## Procedure

### Step 1 — Pre-flight Check
1. **DO NOT MODIFY ANY CODE.** This command is strictly for reporting.
2. Read the `TRMS/docs/technical/codebase-patterns.md` and `TRMS/CLAUDE.md` to refresh the absolute rules.

### Step 2 — Check Critical IMT Constraints
Analyze the target file line-by-line and flag the following deviations:

- **Rule 1 (Form Library):** Are they using `formik` and `yup`? Flag any usage of `react-hook-form`, `zod`, or raw `useState` for complex forms.
- **Rule 2 (Tables):** Are they using `<TableCustom>` from `@/components/table`? Flag any usage of raw HTML `<table>` or generic Tanstack implementations without the `TableCustom` wrapper.
- **Rule 3 (Inputs/Buttons):** Are they using `<InputCustom>`, `<InputTextComponent>`, and `<Button>` from `@/components`? Flag raw `<input>` or `<button>` tags.
- **Rule 3b (Modals):** Are they using `<Modal>` from `@/components/modal-1`? Flag any raw `fixed inset-0` overlay divs used as modals.
- **Rule 4 (File Structure):** Is the file placed correctly? Generic UI components belong in `src/components/`, while features/pages belong in `src/pages/`.
- **Rule 5 (Styling):** Are they using standard Tailwind classes combined with `cn()` from `@/lib/utils`? Flag any hardcoded non-IMT hex colors (allowable exception: IMT primary red `#912018`).

### Step 3 — Report Generation
Output a structured Markdown report:
- **Status:** PASS / FAIL / NEEDS REVIEW
- **Violations:** Grouped by rule, list specific deviations with line numbers.
- **Recommendations:** Exactly how to fix the violations using the standard IMT components ported in `TRMS/src/components`.
