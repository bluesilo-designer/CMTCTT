# TRMS Refactoring to IMT Codebase Rules

This project (TRMS) is a prototype used to present new features, but it needs to be refactored to perfectly match the **IMT Codebase Patterns** (from `imt-fe`). Every new page you generate or edit here MUST follow the conventions below so the port back to `imt-fe` is trivial.

**Out of scope (ignore drift from real codebase):** routing mechanism if it differs heavily, pure API calls (we may still use mock arrays if backend isn't ready).
**In scope (MUST match real codebase):** component composition, form pattern (Formik + Yup), table pattern (TanstackTable Custom), modal pattern, styling tokens, file layout, and libraries.

---

## The Core Stack
- **Forms**: `formik` + `yup` (NEVER use react-hook-form + zod)
- **Tables**: `@tanstack/react-table` + `TableCustom` wrapper.
- **State**: `react-redux` (Redux Toolkit) or `zustand`.
- **Fetching**: `react-query` + `axios`.
- **Routing**: `react-router-dom`.
- **Styling**: Tailwind CSS + `clsx`/`tailwind-merge`.

---

## Component Folder Structure

Organize components tightly by feature in `pages/` and keep reusable UI primitives in `components/`.

```
src/
├── components/          # Shared UI primitives (always flat directories per component)
│   ├── table/
│   ├── input/
│   ├── button/
│   └── modal-1/
├── pages/               # Features and Routing Views
│   ├── booking/         # Feature: Booking
│   │   ├── index.js     # Main entry point
│   │   ├── bookingDetail.js
│   │   └── createBooking.js
│   └── system-hardware/
└── routes/
```

### Rules
- **New components MUST use nested structure**. Move generic elements to `components/` and specific views to `pages/[feature]/`.
- **File Extensions**: Use `.js` or `.jsx` (as `imt-fe` uses `.js` primarily).
- **Index files**: Each feature folder should ideally have an `index.js` that exports the main component.

---

## Rules (MUST)

### 1. UI Primitives — Import from `components/*` only
Do not reinvent inputs, tables, or buttons. Map TRMS elements to:
- **Table**: `components/table/index.js` (`TableCustom`)
- **Modals**: `components/modal-1/` or equivalent
- **Dropdowns**: `components/dropdown/`
- **Buttons**: `components/button/`

### 2. Forms — Formik + Yup, no exceptions
```javascript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const schema = Yup.object().shape({ name: Yup.string().required() });

<Formik initialValues={{ name: '' }} validationSchema={schema} onSubmit={onSubmit}>
  {({ errors, touched }) => (
    <Form>
      <Field name="name" className="your-input-class" />
    </Form>
  )}
</Formik>
```
- **Never** use `react-hook-form`.
- **Never** use `useState` for individual form fields.

### 3. Tables — `@tanstack/react-table` with `TableCustom`
```javascript
import { createColumnHelper } from "@tanstack/react-table";
import { TableCustom } from "components/table";

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("id", { header: () => "ID" })
];

<TableCustom columns={columns} data={data} autoScrollTable={true} />
```
- **Never** render raw HTML tables (`<table>`, `<tr>`).

### 4. Styling Tokens
- **Use**: `bg-white`, `bg-gray-50`, `border-[#EAECF0]`, `text-[#912018]` (Primary IMT Red), `text-[#344054]`.
- **Tailwind**: Use `cn()` from `utils` to merge `clsx` and `tailwind-merge`.
- **Never**: Hardcode random hex colors unless they are specific IMT branding tokens.

### 5. CRITICAL RULE: Zero Functionality Loss
When refactoring vibe-coded TRMS components into the IMT standard, you must ensure **1:1 Functional Parity**:
- **NEVER** drop an `onClick` handler, a dropdown action menu, or an existing modal.
- **PRESERVE** all business logic, local state toggles, mock data, and routing. 
- The refactored code must look standard, but do exactly what the original prototype did. Do not make autonomous decisions to remove "unused" or "complex" actions.

### 6. CRITICAL RULE: Build Verification
TRMS uses strict TypeScript settings (like `verbatimModuleSyntax`). Whenever you create or modify a file, you MUST verify the build does not break.
- **Rule:** Before completing your response to the user, run `npm run build` in the background.
- If it fails, fix the errors (e.g., adding `type` to imports) BEFORE telling the user you are done. The user should never see a broken build after your edits.

### 7. Slash Commands
- `/audit` — strictly read-only check of a file against IMT constraints.
- `/refactor` — rewrites the file to match IMT standard, ensuring Zero Functionality Loss, and finishes with an automatic audit and build check.
- `/scaffold` — generates a new feature or page from scratch with standard boilerplate and finishes with a build check.
