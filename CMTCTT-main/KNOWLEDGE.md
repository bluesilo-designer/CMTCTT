# TRMS SWT — Project Knowledge Base

> Last updated: 29 Apr 2026  
> Purpose: Handoff reference for any PM / developer continuing this project with a new Claude session.

---

## 1. Project Overview

**TRMS SWT** (Training Resource Management System — Small-Arms Weapon Training) is a React + TypeScript SPA that manages:
- **Bookings** — training sessions with trainees, assets, and lane assignments
- **System Hardware** — RFID asset tracking (issue, return, assignments)
- **Onboarding Flow** — multi-step trainee attendance and lane configuration

Tech stack:
- React 18 + TypeScript (strict mode)
- Vite (HMR dev server, usually on port 5173)
- Tailwind CSS (`cn()` from `@/lib/utils`)
- No backend — all data is mock/in-memory

---

## 2. Routing

Routing is **hash-based** (`window.location.hash`), implemented in `src/App.tsx`.  
Routes use `#/path?param=value` format.

**CRITICAL**: Always strip query string before breadcrumb lookup:
```ts
const hash = (window.location.hash.slice(1) || "/dashboard").split("?")[0];
```

Key routes:
| Hash | Page |
|------|------|
| `#/` | Dashboard |
| `#/bookings/list` | Booking List |
| `#/bookings/detail?id=<id>` | Booking Detail |
| `#/system-hardware/assets-list` | Asset List |
| `#/system-hardware/assignment-list` | Assignment List |
| `#/system-hardware/issue-assets?baseStation=<s>&bookingIds=<ids>` | Issue Assets (RFID scan flow) |
| `#/system-hardware/assignments/new?bookingId=<id>&fromBooking=true` | Create Assignment (from booking) |
| `#/system-hardware/create-assignment` | Create Assignment (standalone) |

---

## 3. Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Router + top-level nav shell |
| `src/data/mock.ts` | Booking mock data (bookings array, trainees per booking) |
| `src/data/systemHardware.ts` | Assets, Assignments, AssetTypes, AssetCategories, operators, baseStations |
| `src/pages/BookingDetail.tsx` | The largest file (~3300+ lines) — booking detail page + full onboarding flow |
| `src/pages/BookingList.tsx` | Booking list with calendar + list view toggle |
| `src/pages/IssueAssets.tsx` | RFID scanning + scanned asset table + success dialog |
| `src/pages/AssignmentList.tsx` | Assignment list with nested child table, context menu |
| `src/pages/CreateAssignment.tsx` | Create assignment form — left form + right weapons panel |
| `src/components/layout/Header.tsx` | Top bar: breadcrumbs, global search, clock, user |
| `src/components/ui/StatusBadge.tsx` | Reusable colored status pill |
| `src/components/ui/Pagination.tsx` | Reusable pagination component |

---

## 4. Mock Data

### `src/data/mock.ts` — Bookings
Each booking has:
```ts
{
  id: string,          // "1" through "9"
  title: string,
  status: "Ongoing" | "Upcoming" | "Completed" | "Overdue" | "Cancelled",
  trainingType: string,
  trainingMode: string,
  courseware: string,
  sectionType: string,
  traineesCount: number,
  assetIssued: boolean,   // controls "Start Onboarding" button visibility
  trainees: Trainee[],    // array of trainee objects
  weaponList: WeaponItem[],  // [{ type, quantity }] for CreateAssignment right panel
  ...
}
```
Booking IDs 1–9 are used. ID 6 has `weaponList` with 5 weapons. Booking with `status === "Overdue"` hides the Issue Assets button.

### `src/data/systemHardware.ts` — Assets & Assignments
- `assets[]` — 18 assets (RFID Readers + Sirens). Asset `a1` has full RFID metadata.
- `assignments[]` — 7 assignments (ASGN-2026-001 to 007) with `issuedDate` / `returnedDate` in format `"HH:MM:SS AM/PM\nDD MMM YYYY"`.
- `baseStations[]` — `["SWT-01","SWT-02","SWT-04","SWT-05","IMT-01","IMT-02","IMT-03"]`
- `baseStationBookings` — maps base station ID → array of booking IDs (strings "1"–"9")

---

## 5. BookingDetail.tsx — Architecture

This is the most complex file (~3300+ lines). Key structure:

```
BookingDetail (main export)
  ├── Tabs: Booking Details | Nominal Rolls | Lane Configuration
  ├── Header buttons:
  │     ├── "Issue Assets" dropdown (hidden for Overdue)
  │     │     ├── Issue Assets → navigates to CreateAssignment
  │     │     └── Reissue Assets from Another Booking → ReissueModal
  │     ├── "Continue Session" (Ongoing) / "Start Onboarding" (Upcoming)
  │     │     disabled when !assetIssued → opens Select Courseware popup
  │     └── MoreVertical (3-dot) button
  │           Only shows dropdown when status === "Ongoing"
  │           Items: Top up assets | Ready for return assets | Return assets | Reschedule | Assign briefing Room | Cancel (red)
  ├── Select Courseware popup → then launches OnboardingFlow
  └── OnboardingFlow (full-screen overlay)
        ├── OnboardingTopBar
        ├── Step stepper (steps: Attendance → Lane Config → Detail List)
        ├── AttendanceStep  ← Step 1
        ├── OnboardingLaneConfig  ← Step 2
        └── DetailListStep  ← Step 3
```

### Main Button Wording Rule
```tsx
{BOOKING.status === "Ongoing" ? "Continue Session" : "Start Onboarding"}
```
Only rendered when `status` is `"Ongoing"` or `"Upcoming"`.

---

## 6. AttendanceStep — Two Scan Cases

### Case 1 (all registered):
1. Click "+ Scan ID" → `ScanIDContent` full page (camera viewfinder with animated red scan line)
2. After 2.5s auto-scan: view shows "Trainee Scanned List" (2-column NRIC list)
3. Click "Finished scanning" → back to attendance table with trainees loaded
4. Table shows all as "Registered (Present)"
5. Click "Confirm nominal roll list" → `FinalConfirmationModal` → proceed to Step 2

### Case 2 (mixed statuses — dev demo):
1. Click "Scan ID Case 2 →" link (visible in **toolbar**, always shown)
2. After scan: loads `CASE2_TRAINEES` (32 trainees with mixed statuses)
3. Table shows mixed attendance statuses
4. Click "Confirm attendance submission" → `Case2AttendanceSummaryModal` (overlay, 4-box stats grid)
5. Click Confirm → `Case2UnregisteredAlert` ("New unregistered trainees detected!" modal)
6. Click "Update Nominal Roll" → `Case2FinalNominalRollPage` (full-page, all set to Registered Present)
7. Click "Upload final nominal roll list" → `Case2SuccessAlert` (green check modal)
8. Click Done → proceed to Step 2 (Lane Config)

### ScanIDContent Component
- Located in `BookingDetail.tsx` around line 196
- States: `"scanning"` (dark camera viewfinder + animated red line) → `"connected"` (2-col NRIC list)
- Auto-transitions after 2.5s via `useEffect`
- `startScan("case1")` or `startScan("case2")` — sets scan mode state before showing

### Attendance Statuses (Case 2)
| Status | Pill Color |
|--------|-----------|
| Registered (Present) | green (`bg-green-100 text-green-700`) |
| Non-registered (Present) | orange (`bg-orange-100 text-orange-600`) |
| Registered (Absent) | blue (`bg-blue-100 text-blue-600`) |

Component: `AttendanceStatusText({ status })` — renders colored pill badges.

---

## 7. Header.tsx — Breadcrumbs

- Located: `src/components/layout/Header.tsx`
- Breadcrumb lookup strips query string: `.split("?")[0]`
- Entry: `"/bookings/detail": ["Booking List", "Booking Detail"]`
- Parent breadcrumbs are **clickable links** if they exist in `BREADCRUMB_LINKS`
- `BREADCRUMB_LINKS` maps label → hash path (e.g. `"Booking List"` → `"/bookings/list"`)

---

## 8. IssueAssets.tsx — RFID Scan Flow

Two-phase flow controlled by `phase` state:
1. **Scanning** — auto-transitions to "scanned" after 4 seconds
2. **Scanned** — shows table of `DUMMY_SCANNED_ASSETS` with multi-select checkboxes

Features:
- `Set<string>` for `selectedIds` (multi-select)
- "Delete Selected" button appears when checkboxes checked
- Indeterminate checkbox state for partial selection
- Success dialog on "Create Assignment" → navigates to `#/system-hardware/assignment-list`

---

## 9. AssignmentList.tsx — Key Features

- **Parent rows**: Assignment ID, Type, Bookings (pill tags), Status, Base Stations, Asset Qty, Issued Date, Returned Date, Actions (context menu)
- **Child rows** (expanded): nested `<table>` with Booking ID, Training Type, Mode, Time, Status, Unit Name, Eye icon
- **Context menu** (3-dot on parent): View Details | Return Assets | Top Up Assets
- **Toolbar**: search right-aligned + "Select Date" button
- `BOOKING_DETAILS` map in file provides mock data for child rows
- `colSpan={10}` for the child table expansion row

---

## 10. CreateAssignment.tsx — Layout & Design

### Panel Layout (when opened from "Issue Assets" in a Booking)
- **50:50 split**: `w-1/2` for both left and right panels
- **Left panel**: form (Personnel, Assignment Configuration, Booking sections) — compact spacing (`space-y-3`, `gap-3`, `p-4`)
- **Right panel** (`RightPanel` component): "Weapons to Withdraw" panel
  - Header shows weapon count + total units
  - Weapon cards displayed in **2-column grid** (`grid grid-cols-2 gap-3`)
  - Each card shows ONLY: weapon type name + qty to withdraw (large `text-2xl font-extrabold text-brand-primary` number)
  - Nothing else (no booking ID, date, trainee count)

### fromBooking Flow
1. BookingDetail "Issue Assets" → navigates to `#/system-hardware/assignments/new?bookingId=<id>&fromBooking=true`
2. `useEffect` reads URL params, pre-fills form, opens `CoursewareModal`
3. After courseware confirm: form fields (Assignment Type, Base Station) are locked with "Auto-filled" badge
4. Booking ID section shows locked red card (can't be changed)
5. Right panel shows from `booking.weaponList`

### SectionCard
```tsx
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/70 rounded-t-xl">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
    </div>
    <div className="p-4">{children}</div>
  </div>
);
```

---

## 11. BookingList.tsx — Calendar/List Toggle

- Two views: Calendar (month/week/daily) and List (tab-based by status)
- Toggle is **icon-only buttons** (`List` icon + `Calendar` icon), `w-8 h-8`
- Toggle is embedded in **each view's own row** (not a shared parent row)
- "Select Date" → Calendar icon button (icon only)
- "Filters" → SlidersHorizontal icon button (icon only, no label)
- Calendar view toolbar: `Month | Weekly | Daily | Today` tabs + `< April 2026 >` nav + toggle (right)
- List view toolbar: status tabs (`All | Ongoing | Upcoming | Completed | Overdue`) + toggle (right)

---

## 12. UI Conventions — CRITICAL

### Page Title Color
**ALL top-level page titles** (`h1` or `h2` that is the main heading of the page) MUST use `text-brand-primary`.  
**NOT** `text-gray-800`, `text-gray-900`, or any other gray.

```tsx
// CORRECT ✓
<h1 className="text-xl font-semibold text-brand-primary">Booking List</h1>

// WRONG ✗
<h1 className="text-xl font-semibold text-gray-800">Booking List</h1>
```

This applies to: Dashboard, Booking List, Booking Detail (title), Training Results, Asset List, Assignment List, User List, User Detail (name), User Role, Role Permission, Rank, Site Management, System Health, System Maintenance, Operational Availability, Resource Planning, Data Import, Data Export, Asset Type, Asset Category, Asset Tracking, RFID Reader Listing, Antenna Listing, Stock Take Variance Report, Asset Statistics, Activity Log, Training Detail (program name), Today's Booking, New Assignment.

**Sub-headings inside cards/modals** (e.g. "Training Information", "Booking Summary") stay gray — only the page-level title changes.

### Brand Colors
- **Brand primary**: `bg-brand-primary` / `text-brand-primary` = `#7A1515` (dark red, defined in Tailwind config)
- **Brand hover**: `hover:bg-brand-primary-hover`

### Table Headers (all tables)
```tsx
<tr className="bg-red-50 border-b border-gray-100">
  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary">...</th>
</tr>
```

### Table Body Rows
```tsx
<tr className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
```

### Modals / Popups
- Always have `X` close button (top-right)
- Footer buttons: `grid grid-cols-2 gap-3 px-6 pb-6` pattern
- Cancel: `border border-gray-200 rounded-lg text-sm font-semibold text-gray-600`
- Confirm: `bg-brand-primary text-white rounded-lg text-sm font-semibold`
- Backdrop: `fixed inset-0 bg-black/40 z-50 flex items-center justify-center`

### Status Pills
`px-2.5 py-1 rounded-full text-xs font-semibold` + color classes

### Multi-line dates
Use `whitespace-pre-line` class with `\n` in data strings:
```tsx
"17 January 2025\n09:29:33 AM"
```

---

## 13. Pagination

Reusable `<Pagination>` component from `@/components/ui/Pagination`.  
Props: `current`, `total`, `perPage`, `totalItems`, `onPageChange`.

Default `PER_PAGE = 10` in most list pages.

---

## 14. Common Patterns

### Click-outside dropdown close
```tsx
const menuRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  const h = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
  };
  document.addEventListener("mousedown", h);
  return () => document.removeEventListener("mousedown", h);
}, []);
```

### Hash navigation
```tsx
window.location.hash = "#/some-path?param=value";
```

### Reading route params
```tsx
const hash = window.location.hash; // "#/bookings/detail?id=3"
const params = new URLSearchParams(hash.split("?")[1]);
const id = params.get("id");
```

### `cn()` helper
Used throughout for conditional Tailwind class merging:
```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", condition && "conditional-class")} />
```

---

## 15. Pending / Future Work

- Connect to real backend API (replace all mock data)
- Return Assets flow (button exists in AssignmentList context menu, not yet implemented)
- Top Up Assets flow (button exists in AssignmentList context menu, not yet implemented)
- View Details for assignment (button exists, not yet implemented)
- Live training session data (currently all mock scores in `LiveResultsPage`)
- Proper auth / user session (currently hardcoded "Daniel Huston" user in onboarding, "Olivia Carter" in header)
- ScanID Case 2 link ("Scan ID Case 2 →") — currently visible in toolbar always; consider hiding in production
