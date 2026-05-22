---
description: Refactor the target page to match CLAUDE.md rules and IMT Standards
argument-hint: [path to file — defaults to IDE-opened file]
---

# /refactor

Refactors a page component so it matches `CLAUDE.md` and `codebase-patterns.md`. The goal is a trivial port to the real IMT codebase.

## Target
Argument: `$ARGUMENTS`
If empty, use the file currently opened in the IDE.

## Procedure

### Step 0 — Backup Original (CRITICAL)
Before changing a single line of code, ALWAYS copy the target file to `<filename>.backup`. This ensures the original layout, mock data, and full functionality are preserved as a reference.

### Step 1 — Read the Rules
Ensure you have full context by reviewing `TRMS/CLAUDE.md` and `TRMS/docs/technical/codebase-patterns.md`.

### Step 2 — Analyze and Audit
Perform a quick inline audit (similar to the `/audit` flow):
- Identify all raw HTML inputs, buttons, and tables.
- Identify `react-hook-form` / `zod` usages.
- Identify generic Tanstack setups without `TableCustom`.

### Step 3 — Apply Fixes in One Pass (ZERO FUNCTIONALITY LOSS)
Once confirmed, edit the target file in place.

**CRITICAL RULE: 1:1 Functional Parity (C-Level Approved).** 
- The TRMS prototype has already passed C-Level review. You MUST preserve ALL business logic, mock data, field names, event handlers, dropdown action menus, and modal states.
- NEVER drop an `onClick` handler or state toggle because it seems "complex" or "unused". The code must do exactly what the original prototype did.
- **Forms:** Replace `react-hook-form` and `zod` with `Formik` and `Yup`. 
- **Inputs:** Swap raw `<input>` and `<button>` with `<InputCustom>`, `<InputTextComponent>`, and `<Button>`. Remember `InputTextComponent` goes inside Formik forms.
- **Tables:** Swap raw tables with `<TableCustom>`. Setup columns using `@tanstack/react-table`'s `createColumnHelper`.
- **Modals:** Replace raw `fixed inset-0` overlay divs with `<Modal>` from `@/components/modal-1`. Use `open={true}` (parent controls mounting), `onClose` for dismiss, `width` for sizing, and `isUseX={false}` when the modal has its own Cancel button.
- **Styling:** Replace arbitrary hex values with Tailwind utilities + `cn()`.
- **Extraction:** If the file is a massive vibe-coded prototype (e.g., 800+ lines), split it into logical sub-components and place them inside `src/pages/[feature]/`. Extract reusable UI to `src/components/`.

### Step 4 — Post-Refactor Audit
After the refactor is complete, perform a final audit to ensure no missing implementations:
1. Verify no `react-hook-form` remains.
2. Verify all complex types, status maps, and mock data have been moved to a `constants.ts` or `mock.ts` file.
3. Re-grep the file to ensure no raw `<table>`, `<input>`, or `<button>` exist outside the core component imports.
4. Verify no raw `fixed inset-0` modal overlays remain — all modals must use `<Modal>` from `@/components/modal-1`.

### Step 5 — Build Verification (MANDATORY)
1. Run `npm run build` in the terminal to verify strict TypeScript compatibility (`verbatimModuleSyntax`).
2. If there are Type errors (e.g., missing `type` keyword in imports), fix them immediately.
3. Once the build passes cleanly, report the classification, the list of changes applied, and confirm a perfect audit and build pass to the user.
