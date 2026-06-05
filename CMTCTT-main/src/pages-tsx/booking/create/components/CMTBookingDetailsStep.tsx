import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronDown, ChevronLeft, ChevronRight, Check, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────────

// Vehicle type is fixed to ICV (TERREX) — auto-selected, no dropdown shown
const FIXED_VEHICLE_TYPE = "ICV (TERREX)";

const COMPARTMENT_OPTIONS = [
  "CMT_Driving",
  "CMT_Gunnery",
  "CMT_Vehicle",
  "CMT_Standalone",
  // NOTE: "CTT_Standalone" and "SimIntegrated" are temporarily hidden — do NOT delete
];

/** Selecting one of these deselects everything else; nothing else can be added while one is active */
const STANDALONE_OPTIONS = new Set(["CMT_Standalone"]);

/**
 * Training types that cap cabin amount to 1.
 * CMT_Standalone → up to 11 cabins.
 * Anything else (CTT_Standalone, SimIntegrated) → up to 11 cabins as well.
 */
const SINGLE_CABIN_TYPES = new Set(["CMT_Gunnery", "CMT_Vehicle", "CMT_Driving"]);
const MAX_CABIN_STANDALONE = 11;

export interface VariantItem {
  id:       string;
  label:    string;
  selected: boolean;
  qty:      number;
}

/** Platform type options for ICV (TERREX) — multi-select + qty */
const DEFAULT_PLATFORM_VARIANTS: VariantItem[] = [
  { id: "40AGL", label: "40AGL", selected: false, qty: 1 },
  { id: "50HMG", label: "50HMG", selected: false, qty: 1 },
];

const BRIEFING_ROOMS   = ["Briefing Room A", "Briefing Room B", "Briefing Room C", "Briefing Room D"];
const SCHEDULE_OPTIONS = [
  { value: "AM/PM",    label: "AM/PM Schedule"   },
  { value: "Full Day", label: "Full Day Schedule" },
  { value: "Ad-hoc",  label: "Ad-hoc Schedule"   },
];
const SCHEDULE_SECTIONS = [
  { value: "AM", label: "AM Session (8:00 AM - 12:00 PM)" },
  { value: "PM", label: "PM Session (12:00 PM - 5:00 PM)" },
];

// ── Compartment multi-select ──────────────────────────────────────────────────

function CompartmentSelector({
  value, onChange, error,
}: {
  value: string[]; onChange: (next: string[]) => void; error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const hasStandaloneSelected = value.some(v => STANDALONE_OPTIONS.has(v));
  const hasNonStandaloneSelected = value.some(v => !STANDALONE_OPTIONS.has(v));

  const toggle = (opt: string) => {
    const isChecked    = value.includes(opt);
    const isStandalone = STANDALONE_OPTIONS.has(opt);

    if (isChecked) {
      // Always allow deselect
      onChange(value.filter(v => v !== opt));
    } else if (isStandalone) {
      // Standalone selected → clear everything else, select only this
      onChange([opt]);
    } else if (hasStandaloneSelected) {
      // Can't add non-standalone while a standalone is active — no-op
      return;
    } else {
      onChange([...value, opt]);
    }
  };

  const summary = value.length > 0 ? value.join(", ") : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 text-sm border rounded-lg bg-white transition-colors focus:outline-none",
          error ? "border-red-400" : open ? "border-brand-primary" : "border-gray-200"
        )}
      >
        <span className={cn("truncate flex-1 text-left", summary ? "text-gray-800" : "text-gray-400")}>
          {summary || "Select compartments"}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 flex-shrink-0 ml-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
          {COMPARTMENT_OPTIONS.map(opt => {
            const checked      = value.includes(opt);
            const isStandalone = STANDALONE_OPTIONS.has(opt);
            // Dim option when it cannot be selected:
            // - a standalone is active and this is a different (non-checked) option
            // - a non-standalone is active and this standalone is the option
            const isDisabled =
              !checked && (
                (hasStandaloneSelected && !isStandalone) ||
                (hasNonStandaloneSelected && isStandalone)
              );

            return (
              <div
                key={opt}
                onClick={() => !isDisabled && toggle(opt)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 transition-colors",
                  isDisabled
                    ? "cursor-not-allowed opacity-35"
                    : "hover:bg-gray-50 cursor-pointer"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  checked    ? "bg-brand-primary border-brand-primary" :
                  isDisabled ? "border-gray-200 bg-gray-50"            : "border-gray-300"
                )}>
                  {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span className={cn("text-sm", checked ? "text-gray-800 font-medium" : "text-gray-700")}>
                  {opt}
                </span>
                {isStandalone && !isDisabled && !checked && (
                  <span className="ml-auto text-[10px] text-gray-400 italic">exclusive</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Simple single-select dropdown ─────────────────────────────────────────────

/**
 * Platform Type selector.
 * - cabinAmount === 1 : radio mode — select exactly one, no qty shown.
 * - cabinAmount  >  1 : checkbox mode — select one or both, qty stepper,
 *                       sum of selected qtys capped at cabinAmount.
 */
function VariantQtySelector({
  value, onChange, placeholder, error, cabinAmount = 1,
}: {
  value:        VariantItem[];
  onChange:     (next: VariantItem[]) => void;
  placeholder?: string;
  error?:       string;
  cabinAmount?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const isSingle = cabinAmount === 1;

  /** Total qty currently allocated across all selected items */
  const totalQty = value.filter(i => i.selected).reduce((s, i) => s + i.qty, 0);

  const toggle = (id: string) => {
    if (isSingle) {
      // Radio: selecting one deselects all others
      onChange(value.map(v => ({ ...v, selected: v.id === id })));
    } else {
      const item = value.find(v => v.id === id)!;
      if (item.selected) {
        // Deselect
        onChange(value.map(v => v.id === id ? { ...v, selected: false } : v));
      } else {
        // Select with qty=1, but only if there's remaining quota
        const remaining = cabinAmount - totalQty;
        if (remaining <= 0) return;
        onChange(value.map(v => v.id === id ? { ...v, selected: true, qty: 1 } : v));
      }
    }
  };

  const setQty = (id: string, delta: number) => {
    onChange(value.map(v => {
      if (v.id !== id) return v;
      const newQty = Math.max(1, v.qty + delta);
      // Cap so total doesn't exceed cabinAmount
      const otherTotal = value.filter(x => x.selected && x.id !== id).reduce((s, x) => s + x.qty, 0);
      return { ...v, qty: Math.min(newQty, cabinAmount - otherTotal) };
    }));
  };

  const selected = value.filter(i => i.selected);
  const summary  = selected.length > 0
    ? isSingle
      ? selected.map(i => i.label).join(", ")
      : selected.map(i => `${i.label} (${i.qty})`).join(", ")
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 text-sm border rounded-lg bg-white transition-colors focus:outline-none",
          error ? "border-red-400" : open ? "border-brand-primary" : "border-gray-200"
        )}
      >
        <span className={cn("truncate flex-1 text-left", summary ? "text-gray-800" : "text-gray-400")}>
          {summary || (placeholder ?? "Select platform types")}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 flex-shrink-0 ml-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
          {!isSingle && (
            <p className="px-3 pt-1 pb-0.5 text-[10px] text-gray-400">
              Total qty: {totalQty} / {cabinAmount}
            </p>
          )}
          {value.map(item => (
            <div key={item.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
              {isSingle ? (
                /* Radio circle */
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    item.selected ? "border-brand-primary" : "border-gray-300"
                  )}
                >
                  {item.selected && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                </button>
              ) : (
                /* Checkbox */
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    item.selected ? "bg-brand-primary border-brand-primary" : "border-gray-300"
                  )}
                >
                  {item.selected && <Check size={10} className="text-white" strokeWidth={3} />}
                </button>
              )}
              <span className={cn("flex-1 text-sm", item.selected ? "text-gray-800 font-medium" : "text-gray-700")}>
                {item.label}
              </span>
              {/* Qty stepper — only shown in multi-cabin mode */}
              {!isSingle && item.selected && (
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setQty(item.id, -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-brand-primary hover:bg-red-50 border border-brand-primary/30">
                    <Minus size={10} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-gray-700">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(item.id, +1)}
                    disabled={totalQty >= cabinAmount}
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center border border-brand-primary/30",
                      totalQty >= cabinAmount
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-brand-primary hover:bg-red-50"
                    )}
                  >
                    <Plus size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Calendar helpers ──────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y: number, m: number)    { return new Date(y, m, 1).getDay(); }

function isSameDay(a: Date | null, b: Date) {
  return a !== null
    && a.getFullYear() === b.getFullYear()
    && a.getMonth()    === b.getMonth()
    && a.getDate()     === b.getDate();
}

function MonthView({ year, month, selected, onSelect }: {
  year: number; month: number; selected: Date | null; onSelect: (d: Date) => void;
}) {
  const days  = getDaysInMonth(year, month);
  const start = getFirstDay(year, month);
  const cells: (number | null)[] = Array(start).fill(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  return (
    <div className="flex-1 min-w-0">
      <p className="text-center text-xs font-semibold text-gray-600 mb-2">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const date   = new Date(year, month, day);
          const active = isSameDay(selected, date);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "mx-auto w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors",
                active ? "bg-brand-primary text-white font-semibold" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Validation schema ─────────────────────────────────────────────────────────

const schema = Yup.object({
  // bookingType is always "Compartment Selection" — no user validation needed
  compartments: Yup.array().min(1, "Select at least one compartment"),
  platformVariants: Yup.array().test(
    "at-least-one",
    "Select at least one platform type",
    (items) => (items as VariantItem[] | undefined)?.some(i => i.selected) ?? false
  ),
  vehicleType:        Yup.string().required("Required"),
  unitName:           Yup.string().trim().required("Required"),
  instructor:         Yup.string().trim().required("Required"),
  unitContactDetails: Yup.string().trim().required("Required"),
  scheduleType:       Yup.string().nullable().required("Required"),
  scheduleSection:    Yup.string().nullable().when("scheduleType", {
    is:        "AM/PM",
    then:      (s) => s.required("Required"),
    otherwise: (s) => s.nullable(),
  }),
  briefingRooms: Yup.array().of(Yup.string()).min(1, "Select at least one briefing room"),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CMTBookingDetailsValues {
  bookingType:         string;
  cabinAmount:         number;
  compartments:        string[];
  vehicleType:      string;
  platformVariants: VariantItem[];
  unitName:            string;
  instructor:          string;
  unitContactDetails:  string;
  scheduleType:        string | null;
  scheduleSection:     string | null;
  briefingRooms:       string[];
  selectedDate:        Date | null;
}

interface Props {
  onNext: (values: CMTBookingDetailsValues) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CMTBookingDetailsStep({ onNext }: Props) {
  const [calYear,      setCalYear]      = useState(2025);
  const [calMonth,     setCalMonth]     = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const month2 = calMonth === 11 ? 0          : calMonth + 1;
  const year2  = calMonth === 11 ? calYear + 1 : calYear;

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <Formik
        initialValues={{
          // Booking type is fixed — Compartment Selection is always active
          bookingType:         "Compartment Selection",
          cabinAmount:         1,
          compartments:        [] as string[],
          vehicleType:      FIXED_VEHICLE_TYPE,   // auto-selected, never changes
          platformVariants: DEFAULT_PLATFORM_VARIANTS as VariantItem[],
          unitName:            "",
          instructor:          "",
          unitContactDetails:  "",
          scheduleType:        null as string | null,
          scheduleSection:     null as string | null,
          briefingRooms:       [] as string[],
        }}
        validationSchema={schema}
        onSubmit={(values) => { onNext({ ...values, selectedDate }); }}
      >
        {({ values, setFieldValue, errors, touched }) => {
          // ── Cabin amount rules (from flowchart) ──────────────────
          const isSingleCabinMode = values.compartments.some(c => SINGLE_CABIN_TYPES.has(c));
          const maxCabin          = isSingleCabinMode ? 1 : MAX_CABIN_STANDALONE;

          return (
            <Form>
              {/* Hidden submit trigger */}
              <button type="submit" id="cmt-details-next-trigger" className="hidden" />

              <div className="text-center mb-5">
                <h2 className="text-base font-semibold text-gray-800">Booking Details</h2>
              </div>

              {/* 50/50 grid: form column + calendar column */}
              <div className="grid grid-cols-2 gap-4 items-start">

                {/* ── LEFT COLUMN ─────────────────────────────────── */}
                <div className="space-y-4">

                  {/* ── Box 1: Booking / Vehicle info ─────────────── */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

                    {/* Row 1: Training Type | Cabin Amount */}
                    <div className="grid grid-cols-2 gap-4">

                      {/* Training Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Training Type <span className="text-brand-primary">*</span>
                        </label>
                        <CompartmentSelector
                          value={values.compartments}
                          onChange={(next) => {
                            setFieldValue("compartments", next);
                            // Auto-lock cabin to 1 when non-standalone types are selected
                            const locked = next.some(c => SINGLE_CABIN_TYPES.has(c));
                            if (locked) setFieldValue("cabinAmount", 1);
                          }}
                          error={
                            touched.compartments && typeof errors.compartments === "string"
                              ? errors.compartments
                              : undefined
                          }
                        />
                        {touched.compartments && typeof errors.compartments === "string" && (
                          <p className="mt-1 text-xs text-red-500">{errors.compartments}</p>
                        )}
                      </div>

                      {/* Cabin Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Cabin Amount <span className="text-brand-primary">*</span>
                        </label>

                        {values.compartments.length === 0 ? (
                          /* Nothing selected yet — greyed placeholder */
                          <div className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400">
                            Select training type first
                          </div>
                        ) : isSingleCabinMode ? (
                          /* Non-standalone types → locked at 1 */
                          <div className="flex items-center gap-2">
                            <div className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium">
                              1 Cabin
                            </div>
                            <span className="text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded-md px-2 py-1 whitespace-nowrap">
                              Max 1
                            </span>
                          </div>
                        ) : (
                          /* Standalone / others → stepper up to 11 */
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                const next = Math.max(1, values.cabinAmount - 1);
                                setFieldValue("cabinAmount", next);
                                // Reset variant qtys to respect new cabin amount
                                setFieldValue("platformVariants", DEFAULT_PLATFORM_VARIANTS);
                              }}
                              className="px-3 py-2.5 border-r border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <input
                              type="text"
                              readOnly
                              value={values.cabinAmount}
                              className="flex-1 px-3 py-2.5 text-sm text-center text-gray-700 bg-white focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = Math.min(maxCabin, values.cabinAmount + 1);
                                setFieldValue("cabinAmount", next);
                                // Reset variant qtys when switching away from single-cabin
                                setFieldValue("platformVariants", DEFAULT_PLATFORM_VARIANTS);
                              }}
                              className="px-3 py-2.5 border-l border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        )}

                        {/* Show max cabin hint when standalone mode is active */}
                        {values.compartments.length > 0 && !isSingleCabinMode && (
                          <p className="mt-1 text-[11px] text-gray-400">Up to {maxCabin} cabins</p>
                        )}
                        <ErrorMessage name="cabinAmount" component="p" className="mt-1 text-xs text-red-500" />
                      </div>

                    </div>

                    {/* Row 2: Vehicle Type (static) | Platform Type */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Vehicle Type — auto-selected, read-only display */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Vehicle Type
                        </label>
                        <div className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium">
                          {FIXED_VEHICLE_TYPE}
                        </div>
                      </div>

                      {/* Platform Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Platform Type <span className="text-brand-primary">*</span>
                        </label>
                        <VariantQtySelector
                          value={values.platformVariants}
                          onChange={(next) => setFieldValue("platformVariants", next)}
                          placeholder="Select platform type"
                          cabinAmount={values.cabinAmount}
                          error={
                            touched.platformVariants && typeof errors.platformVariants === "string"
                              ? errors.platformVariants : undefined
                          }
                        />
                        {touched.platformVariants && typeof errors.platformVariants === "string" && (
                          <p className="mt-1 text-xs text-red-500">{errors.platformVariants}</p>
                        )}
                      </div>
                    </div>

                  </div>{/* /Box 1 */}

                  {/* ── Box 2: Unit info ───────────────────────────── */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Unit Name <span className="text-brand-primary">*</span>
                        </label>
                        <Field
                          name="unitName" type="text" placeholder="Enter unit name"
                          className={cn(
                            "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                            touched.unitName && errors.unitName ? "border-red-400" : "border-gray-200"
                          )}
                        />
                        <ErrorMessage name="unitName" component="p" className="mt-1 text-xs text-red-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Instructor <span className="text-brand-primary">*</span>
                        </label>
                        <Field
                          name="instructor" type="text" placeholder="Enter instructor name"
                          className={cn(
                            "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                            touched.instructor && errors.instructor ? "border-red-400" : "border-gray-200"
                          )}
                        />
                        <ErrorMessage name="instructor" component="p" className="mt-1 text-xs text-red-500" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Unit Contact Details <span className="text-brand-primary">*</span>
                      </label>
                      <Field
                        name="unitContactDetails" type="text" placeholder="Enter unit contact details"
                        className={cn(
                          "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                          touched.unitContactDetails && errors.unitContactDetails ? "border-red-400" : "border-gray-200"
                        )}
                      />
                      <ErrorMessage name="unitContactDetails" component="p" className="mt-1 text-xs text-red-500" />
                    </div>

                  </div>{/* /Box 2 */}

                  {/* ── Box 3: Schedule + Briefing ─────────────────── */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule Selection <span className="text-brand-primary">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {SCHEDULE_OPTIONS.map(({ value, label }) => (
                          <label key={value} className={cn(
                            "flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors",
                            values.scheduleType === value
                              ? "border-brand-primary bg-red-50 text-brand-primary"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}>
                            <input
                              type="radio" name="scheduleType" value={value}
                              checked={values.scheduleType === value}
                              onChange={() => {
                                setFieldValue("scheduleType", value);
                                if (value !== "AM/PM") setFieldValue("scheduleSection", null);
                              }}
                              className="accent-brand-primary"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                      <ErrorMessage name="scheduleType" component="p" className="mt-1 text-xs text-red-500" />
                    </div>

                    {values.scheduleType === "AM/PM" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule Section <span className="text-brand-primary">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {SCHEDULE_SECTIONS.map(({ value, label }) => {
                            const isActive = values.scheduleSection === value;
                            return (
                              <label key={value} className={cn(
                                "flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors",
                                isActive
                                  ? "border-brand-primary bg-brand-primary text-white"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              )}>
                                <span className={cn(
                                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                  isActive ? "border-white" : "border-gray-300"
                                )}>
                                  {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                                </span>
                                <input
                                  type="radio" name="scheduleSection" value={value}
                                  checked={isActive}
                                  onChange={() => setFieldValue("scheduleSection", value)}
                                  className="sr-only"
                                />
                                {label}
                              </label>
                            );
                          })}
                        </div>
                        <ErrorMessage name="scheduleSection" component="p" className="mt-1 text-xs text-red-500" />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Briefing Room <span className="text-brand-primary">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {BRIEFING_ROOMS.map(room => {
                          const isSelected = values.briefingRooms.includes(room);
                          return (
                            <label key={room} className={cn(
                              "flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors",
                              isSelected
                                ? "border-brand-primary bg-brand-primary text-white"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}>
                              <span className={cn(
                                "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                                isSelected ? "border-white bg-white" : "border-gray-300"
                              )}>
                                {isSelected && <Check size={10} className="text-brand-primary" strokeWidth={3} />}
                              </span>
                              <input
                                type="checkbox" checked={isSelected}
                                onChange={() => {
                                  const next = isSelected
                                    ? values.briefingRooms.filter(r => r !== room)
                                    : [...values.briefingRooms, room];
                                  setFieldValue("briefingRooms", next);
                                }}
                                className="sr-only"
                              />
                              {room}
                            </label>
                          );
                        })}
                      </div>
                      <ErrorMessage name="briefingRooms" component="p" className="mt-1 text-xs text-red-500" />
                    </div>

                  </div>{/* /Box 3 */}

                </div>{/* /LEFT COLUMN */}

                {/* ── RIGHT COLUMN: Calendar ──────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    Select Date Slot <span className="text-brand-primary">*</span>
                  </p>
                  <div className="flex items-start gap-1">
                    <button type="button" onClick={prevMonth}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0 mt-1">
                      <ChevronLeft size={15} />
                    </button>
                    <div className="flex-1 flex gap-4 min-w-0">
                      <MonthView year={calYear} month={calMonth} selected={selectedDate} onSelect={setSelectedDate} />
                      <div className="w-px bg-gray-100 flex-shrink-0 self-stretch" />
                      <MonthView year={year2}   month={month2}   selected={selectedDate} onSelect={setSelectedDate} />
                    </div>
                    <button type="button" onClick={nextMonth}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0 mt-1">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                  {selectedDate && (
                    <p className="mt-4 text-xs text-center text-brand-primary font-medium">
                      {selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>

              </div>{/* /grid */}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
