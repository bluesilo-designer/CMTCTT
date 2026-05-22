---
description: Generate a new page or feature from scratch, strictly adhering to the IMT patterns
argument-hint: [Feature Name or Path]
---

# /scaffold

Generates a new page or feature from scratch, strictly adhering to the IMT Codebase Patterns (`codebase-patterns.md`).

## Target
Argument: `$ARGUMENTS`
If empty, ask the user for the feature name.

## Procedure

### Step 1 — Folder Structure Definition
1. Define the correct file path. All new pages must live in `src/pages/[feature-name]/`.
2. Determine if it's a simple list or a multi-page flow (e.g., `create`, `edit`, `detail`).
3. Set up the primary file (e.g., `index.tsx` for the main list, `create.tsx` for forms).

### Step 2 — Boilerplate Enforcement
Write the file content enforcing these absolute requirements:
- **Forms:** MUST import and set up `<Formik>` and `Yup` validation schemas.
- **Tables:** MUST import and render `<TableCustom>` from `@/components/table` along with Tanstack's `createColumnHelper`.
- **Interactivity:** MUST use `<Button>`, `<InputCustom>`, or `<InputTextComponent>` from `@/components`.
- **Modals:** MUST use `<Modal>` from `@/components/modal-1` for any modal dialogs. Never use raw `fixed inset-0` overlay divs.

### Step 3 — Mock Data Generation
Since API endpoints for new TRMS features might not be ready:
- Implement a clean, well-typed `mockData` array.
- Place it at the top of the file or in a sibling `constants.ts` file if it exceeds 30 lines.
- Wire this mock data into the `<TableCustom>` so the user can immediately see the UI.

### Step 4 — Wire-up Instructions
Once the files are written, provide the user with the exact `react-router-dom` block they need to copy/paste into `App.tsx` (or `routes/index.tsx`) to make the page accessible in the UI.

### Step 5 — Build Verification (MANDATORY)
Before ending your response, run `npm run build` in the terminal to verify the scaffolded code compiles cleanly. Fix any `verbatimModuleSyntax` errors (e.g. `import type`) before confirming the scaffold is complete.
