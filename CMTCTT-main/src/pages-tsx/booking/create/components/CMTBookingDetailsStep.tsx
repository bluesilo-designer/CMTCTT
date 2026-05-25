import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
  "ICV (TERREX)",
  "APC (V200)",
  "MBT (Leopard 2)",
  "Scout Vehicle",
];

const COMPARTMENT_OPTIONS = [
  "Driver Compartment",
  "Gunnery Compartment",
  "Commander Compartment",
  "Loader Compartment",
];

/** Weapon options available per vehicle type (Compartment Selection mode) */
const VEHICLE_WEAPON_OPTIONS: Record<string, string[]> = {
  "ICV (TERREX)":    ["40AGL", "50HMG"],
  "APC (V200)":      ["50HMG", "7.62 COAX"],
  "MBT (Leopard 2)": ["7.62 COAX", "Smoke Discharger"],
  "Scout Vehicle":   ["40AGL", "7.62 COAX"],
};
const DEFAULT_SINGLE_WEAPONS = ["40AGL", "50HMG", "7.62 COAX", "Smoke Discharger"];

export interface VariantItem {
  id:       string;
  label:    string;
  selected: boolean;
  qty:      number;
}

const DEFAULT_VARIANTS: VariantItem[] = [
  { id: "40AGL",    label: "40AGL",            selected: false, qty: 1 },
  { id: "50HMG",    label: "50HMG",            selected: false, qty: 1 },
  { id: "7.62COAX", label: "7.62 COAX",        selected: false, qty: 1 },
  { id: "SMOKE",    label: "Smoke Discharger", selected: false, qty: 1 },
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

// ── Compartment multi-select ───────────────────────────────────────────────────

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

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
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
            const checked = value.includes(opt);
            return (
              <div
                key={opt}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggle(opt)}
              >
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  checked ? "bg-brand-primary border-brand-primary" : "border-gray-300"
                )}>
                  {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sm text-gray-700">{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Simple single-select dropdown ─────────────────────────────────────────────

function SimpleDropdown({
  value, onChange, options, placeholder, error,
}: {
  value: string; onChange: (v: string) => void; options: string[];
  placeholder: string; error?: boolean;
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
        <span className={cn("flex-1 text-left", value ? "text-gray-800" : "text-gray-400")}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 flex-shrink-0 ml-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {opt}
              {value === opt && <Check size={13} className="text-brand-primary flex-shrink-0 ml-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Weapon Variant multi-select + qty (Entire Cabin mode) ─────────────────────

function variantSummary(items: VariantItem[]): string {
  const sel = items.filter(i => i.selected);
  if (!sel.length) return "";
  return sel.map(i => `${i.label} (${i.qty})`).join(", ");
}

function WeaponVariantSelector({
  value, onChange, error,
}: {
  value: VariantItem[]; onChange: (next: VariantItem[]) => void; error?: string;
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

  const toggle = (id: string) =>
    onChange(value.map(v => v.id === id ? { ...v, selected: !v.selected } : v));

  const setQty = (id: string, delta: number) =>
    onChange(value.map(v => v.id === id ? { ...v, qty: Math.max(1, v.qty + delta) } : v));

  const summary = variantSummary(value);

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
          {summary || "Select weapon variants"}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 flex-shrink-0 ml-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1">
          {value.map(item => (
            <div key={item.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center transition-colors",
                  item.selected ? "bg-brand-primary border-brand-primary" : "border-gray-300"
                )}
              >
                {item.selected && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
              <span className="flex-1 text-sm text-gray-700">{item.label}</span>
              {item.selected && (
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setQty(item.id, -1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-brand-primary hover:bg-red-50 border border-brand-primary/30">
                    <Minus size={10} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium text-gray-700">{item.qty}</span>
                  <button type="button" onClick={() => setQty(item.id, +1)}
                    className="w-5 h-5 rounded flex items-center justify-center text-brand-primary hover:bg-red-50 border border-brand-primary/30">
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
  bookingType: Yup.string().required("Required"),

  // ── Entire Cabin fields ──
  cabinAmount: Yup.number().when("bookingType", {
    is:        "Entire Cabin",
    then:      (s) => s.min(1, "Min 1").required("Required"),
    otherwise: (s) => s.nullable(),
  }),
  vehicleVariants: Yup.array().when("bookingType", {
    is:        "Entire Cabin",
    then:      (s) => s.test("at-least-one", "Select at least one variant", items =>
                 (items as VariantItem[] | undefined)?.some(i => i.selected) ?? false),
    otherwise: (s) => s,
  }),

  // ── Compartment Selection fields ──
  compartments: Yup.array().when("bookingType", {
    is:        "Compartment Selection",
    then:      (s) => s.min(1, "Select at least one compartment"),
    otherwise: (s) => s,
  }),
  weaponVariantSingle: Yup.string().when("bookingType", {
    is:        "Compartment Selection",
    then:      (s) => s.required("Required"),
    otherwise: (s) => s,
  }),

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
  vehicleType:         string;
  vehicleVariants:     VariantItem[];
  weaponVariantSingle: string;
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
          bookingType:         "",
          cabinAmount:         1,
          compartments:        [] as string[],
          vehicleType:         "",
          vehicleVariants:     DEFAULT_VARIANTS as VariantItem[],
          weaponVariantSingle: "",
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
          const isCompartment = values.bookingType === "Compartment Selection";
          const weaponOptions = values.vehicleType
            ? (VEHICLE_WEAPON_OPTIONS[values.vehicleType] ?? DEFAULT_SINGLE_WEAPONS)
            : DEFAULT_SINGLE_WEAPONS;

          return (
            <Form>
              {/* Hidden submit trigger */}
              <button type="submit" id="cmt-details-next-trigger" className="hidden" />

              <div className="text-center mb-5">
                <h2 className="text-base font-semibold text-gray-800">Booking Details</h2>
              </div>

              {/* 50/50 grid: form column + calendar column */}
              <div className="grid grid-cols-2 gap-4 items-start">

                {/* ── LEFT COLUMN ───────────────────────────────── */}
                <div className="space-y-4">

                  {/* ── Box 1: Booking / Vehicle info ───────────── */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

                    {/* Row 1: Booking Type | Cabin OR Compartment Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Booking Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Booking Type <span className="text-brand-primary">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="bookingType"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const val = e.target.value;
                              setFieldValue("bookingType", val);
                              // Reset mode-specific fields when switching
                              if (val === "Entire Cabin") {
                                setFieldValue("compartments", []);
                                setFieldValue("weaponVariantSingle", "");
                              } else {
                                setFieldValue("cabinAmount", 1);
                                setFieldValue("vehicleVariants", DEFAULT_VARIANTS);
                              }
                            }}
                            className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                              touched.bookingType && errors.bookingType ? "border-red-400" : "border-gray-200"
                            )}
                          >
                            <option value="" disabled>Select booking type</option>
                            <option value="Entire Cabin">Entire Cabin</option>
                            <option value="Compartment Selection">Compartment Selection</option>
                          </Field>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <ErrorMessage name="bookingType" component="p" className="mt-1 text-xs text-red-500" />
                      </div>

                      {/* Col 2: Cabin (Entire Cabin) OR Compartment Selection */}
                      {isCompartment ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Compartment Selection <span className="text-brand-primary">*</span>
                          </label>
                          <CompartmentSelector
                            value={values.compartments}
                            onChange={(next) => setFieldValue("compartments", next)}
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
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Cabin <span className="text-brand-primary">*</span>
                          </label>
                          <div className={cn(
                            "flex items-center border rounded-lg overflow-hidden",
                            touched.cabinAmount && errors.cabinAmount ? "border-red-400" : "border-gray-200"
                          )}>
                            <input
                              type="text"
                              readOnly
                              value={values.cabinAmount}
                              className="flex-1 px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none"
                            />
                            <button type="button"
                              onClick={() => setFieldValue("cabinAmount", Math.max(1, values.cabinAmount - 1))}
                              className="px-3 py-2.5 border-l border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                              <Minus size={13} />
                            </button>
                            <button type="button"
                              onClick={() => setFieldValue("cabinAmount", values.cabinAmount + 1)}
                              className="px-3 py-2.5 border-l border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                              <Plus size={13} />
                            </button>
                          </div>
                          <ErrorMessage name="cabinAmount" component="p" className="mt-1 text-xs text-red-500" />
                        </div>
                      )}
                    </div>

                    {/* Row 2: Vehicle Type | Weapon Variant */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Vehicle Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Vehicle Type <span className="text-brand-primary">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="vehicleType"
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              setFieldValue("vehicleType", e.target.value);
                              // Reset weapon selection when vehicle changes in Compartment mode
                              if (isCompartment) setFieldValue("weaponVariantSingle", "");
                            }}
                            className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                              touched.vehicleType && errors.vehicleType ? "border-red-400" : "border-gray-200"
                            )}
                          >
                            <option value="" disabled>Choose vehicle type</option>
                            {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                          </Field>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <ErrorMessage name="vehicleType" component="p" className="mt-1 text-xs text-red-500" />
                      </div>

                      {/* Weapon Variant: multi-select+qty (Entire Cabin) OR simple dropdown (Compartment) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Weapon Variant <span className="text-brand-primary">*</span>
                        </label>
                        {isCompartment ? (
                          <>
                            <SimpleDropdown
                              value={values.weaponVariantSingle}
                              onChange={(v) => setFieldValue("weaponVariantSingle", v)}
                              options={weaponOptions}
                              placeholder="Select weapon variant"
                              error={!!(touched.weaponVariantSingle && errors.weaponVariantSingle)}
                            />
                            <ErrorMessage name="weaponVariantSingle" component="p" className="mt-1 text-xs text-red-500" />
                          </>
                        ) : (
                          <>
                            <WeaponVariantSelector
                              value={values.vehicleVariants}
                              onChange={(next) => setFieldValue("vehicleVariants", next)}
                              error={
                                touched.vehicleVariants && typeof errors.vehicleVariants === "string"
                                  ? errors.vehicleVariants
                                  : undefined
                              }
                            />
                            {touched.vehicleVariants && typeof errors.vehicleVariants === "string" && (
                              <p className="mt-1 text-xs text-red-500">{errors.vehicleVariants}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                  </div>{/* /Box 1 */}

                  {/* ── Box 2: Unit info ─────────────────────────── */}
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

                    {/* Unit Name + Instructor */}
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

                    {/* Unit Contact Details (full width) */}
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

                  {/* ── Schedule Selection ──────────────────────── */}
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

                    {/* Schedule Section — only when AM/PM */}
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

                    {/* Briefing Room */}
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

                  </div>{/* /Schedule + Briefing box */}

                </div>{/* /LEFT COLUMN */}

                {/* ── RIGHT COLUMN: Calendar ────────────────────── */}
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
