# IMT Frontend: Real Codebase Patterns Reference

This document bridges the "vibe-coded" TRMS prototype with the actual production code in `imt-fe`. Use this as the ground truth when implementing any IMT feature or refactoring the TRMS codebase.

---

## 1. Project Structure & Naming Conventions

### Production SDK Structure (`imt-fe/src`)

The actual IMT frontend follows this folder structure:

```
src/
├── components/          # Shared UI primitives (table, input, button, modal-1, etc.)
│   ├── table/           # Tanstack Table wrappers
│   ├── input/           # Formik-compatible inputs
│   ├── button/          # Shared buttons
│   └── icons/           # SVGs/Icons
├── pages/               # Page components (grouped by feature)
│   ├── booking/         # Booking feature pages
│   ├── site-management/ # Site Management
│   └── user-list/       # User management
├── routes/              # Routing configurations (React Router)
├── hooks/               # Custom hooks (data fetching, state, etc.)
├── store/               # Global state (Redux Toolkit & Zustand)
├── services/            # API integration (Axios calls)
├── configures/          # Global configurations
├── context/             # React Contexts
└── utils/               # Helper utilities
```

**Rules for Refactoring TRMS:**
- Move generic UI components out of pages and into `src/components/[name]/index.js`.
- Move page components into `src/pages/[feature-name]/`.
- Component filenames should generally be `camelCase.js` or `PascalCase.js` depending on the file, but standard is typically `camelCase` for folders in `pages/` and `components/`.

---

## 2. Core Libraries

**You MUST use these libraries** when building or refactoring components. Do NOT introduce alternatives if these exist:

| Capability | IMT Library | Notes |
|---|---|---|
| **Form Management** | `formik` | Do **not** use `react-hook-form` |
| **Validation** | `yup` | Do **not** use `zod` |
| **Tables** | `@tanstack/react-table` | Custom wrapper in `components/table/index.js` |
| **State Management** | `@reduxjs/toolkit` / `zustand` | Use Redux Toolkit for complex state, Zustand for simpler stores |
| **Data Fetching** | `react-query` + `axios` | Use for all API integrations |
| **Styling** | `tailwindcss`, `tailwind-merge`, `clsx` | Semantic Tailwind classes. Some components use `styled-components` |
| **Date & Time** | `moment`, `dayjs` | Used interchangeably for date formatting |

---

## 3. Table Pattern

Always use the `TableCustom` component from `components/table/index.js`. Never use raw `<table>` HTML.

### Implementation Example:
```javascript
import { createColumnHelper } from "@tanstack/react-table";
import { TableCustom } from "components/table";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("siteName", {
    header: () => "Site Name",
    cell: (info) => <span className="font-semibold text-primary">{info.getValue()}</span>,
  }),
  columnHelper.accessor("status", {
    header: () => "Status",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
];

export const MyFeatureTable = ({ data, isLoading }) => {
  return (
    <TableCustom 
      columns={columns} 
      data={data} 
      isLoading={isLoading} 
      autoScrollTable={true}
    />
  );
}
```

---

## 4. Form Pattern (Formik + Yup)

Do NOT use `react-hook-form` + `zod` like in other Axora projects. The `imt-fe` project relies entirely on **Formik** and **Yup**.

### Implementation Example:
```javascript
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Input } from 'components/input'; // Assuming standard input wrapper
import { Button } from 'components/button';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

export const MyForm = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={{ name: '', email: '' }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <Field name="name" as={Input} placeholder="Enter Name" />
            {errors.name && touched.name ? <div className="text-red-500 text-sm">{errors.name}</div> : null}
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};
```

---

## 5. UI & Styling

- **Tailwind + CLSX/Tailwind-Merge**: Use `cn()` from `utils/utils` to conditionally join classes.
- **Brand Colors**: 
  - Primary red in IMT is usually `#912018` (used in Table headers).
  - Backgrounds often use `bg-gray-50`, `bg-white`, border colors like `border-[#EAECF0]`.
- Always stick to the existing custom UI components (e.g., `components/modal-1`, `components/dropdown`) rather than building raw HTML primitives.

---

## 6. CRITICAL RULE: Zero Functionality Loss
The TRMS prototype has already been approved by C-Level executives. When refactoring any feature or page to these IMT patterns, you **MUST** ensure 1:1 functional parity:
- **Do not remove action menus**, secondary buttons, or modals, even if they seem complex.
- **Do not drop state toggles**, mock data, or click handlers.
- **Do not make autonomous decisions** to simplify the UX. The goal is to make the code *underneath* standard, while keeping the user experience completely untouched.
