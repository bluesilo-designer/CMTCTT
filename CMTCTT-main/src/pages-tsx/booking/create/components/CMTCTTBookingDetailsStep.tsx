import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  ChevronDown, ChevronLeft, ChevronRight,
  Minus, Plus, Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────────────────

// CMT vehicle types (single-select dropdown)
const CMT_VEHICLE_TYPES = [
  "ICV (TERREX)",
];

// CTT vehicle types — multi-select checkbox (from screenshots)
const CTT_VEHICLE_TYPE_OPTIONS = [
  "ICV (TERREX)",
  "Armour (LEOPARD2)",
  "Engineer (M3G)",
  "Engineer (BRONCO)",
  "PCSV (BELREX)",
  "Transport (TONNER)",
  "Transport (LUV)",
];

// CTT weapon variants — multi-select + qty (from screenshots)
const DEFAULT_CTT_WEAPON_VARIANTS: VariantItem[] = [
  { id: "40AGL",       label: "40AGL",            selected: false, qty: 1 },
  { id: "50HMG",       label: "50HMG",            selected: false, qty: 1 },
  { id: "MORTAL",      label: "MORTAL",           selected: false, qty: 1 },
  { id: "7.62COAXIAL", label: "7.62mm COAXIAL",   selected: false, qty: 1 },
  { id: "120MMSMB",    label: "120MM SMOOTHBORE",  selected: false, qty: 1 },
];

const SCHEDULE_OPTIONS = [
  { value: "AM/PM",    label: "AM/PM Schedule"   },
  { value: "Full Day", label: "Full Day Schedule" },
  { value: "Ad-hoc",  label: "Ad-hoc Schedule"   },
];
const SCHEDULE_SECTIONS = [
  { value: "AM", label: "AM Session (8:00 AM - 12:00 PM)" },
  { value: "PM", label: "PM Session (12:00 PM - 5:00 PM)" },
];
const BRIEFING_ROOMS = [
  "Briefing Room A", "Briefing Room B",
  "Briefing Room C", "Briefing Room D",
];

// ── VariantItem type ──────────────────────────────────────────────────────────
export interface VariantItem {
  id:       string;
  label:    string;
  selected: boolean;
  qty:      number;
}

// CMT weapon variant defaults (multi-select + qty)
const DEFAULT_CMT_WEAPON_VARIANTS: VariantItem[] = [
  { id: "40AGL", label: "40AGL", selected: false, qty: 1 },
  { id: "50HMG", label: "50HMG", selected: false, qty: 1 },
];

// CTT vehicle variant defaults (multi-select + qty — from screenshots)
const DEFAULT_CTT_VEHICLE_VARIANTS: VariantItem[] = [
  { id: "TERREX_CMD",  label: "TERREX (COMMANDER)", selected: false, qty: 1 },
  { id: "TERREX_TRPR", label: "TERREX (TROOPER)",   selected: false, qty: 1 },
  { id: "TERREX_SCOU", label: "TERREX (SCOUT)",     selected: false, qty: 1 },
  { id: "TERREX_PION", label: "TERREX (PIONEER)",   selected: false, qty: 1 },
  { id: "TERREX_MED",  label: "TERREX (MEDICAL)",   selected: false, qty: 1 },
  { id: "TERREX_STRM", label: "TERREX (STORM)",     selected: false, qty: 1 },
  { id: "BRONCO",      label: "BRONCO",             selected: false, qty: 1 },
];

// ── Sub-components ────────────────────────────────────────────────────────────

/** Multi-select checkbox dropdown (no qty) — used for CTT Vehicle Type */
function MultiCheckboxDropdown({
  value, onChange, options, placeholder, error,
}: {
  value: string[]; onChange: (next: string[]) => void;
  options: string[]; placeholder: string; error?: string;
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

  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);

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
          {summary || placeholder}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 flex-shrink-0 ml-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-56 overflow-y-auto">
          {options.map(opt => {
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

/** Multi-select + qty dropdown — used for both CMT Weapon Variant and CTT Vehicle Variant */
function variantSummary(items: VariantItem[]): string {
  const sel = items.filter(i => i.selected);
  if (!sel.length) return "";
  return sel.map(i => `${i.label} (${i.qty})`).join(", ");
}

function VariantQtySelector({
  value, onChange, placeholder, error,
}: {
  value: VariantItem[]; onChange: (next: VariantItem[]) => void;
  placeholder?: string; error?: string;
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
          {summary || (placeholder ?? "Select variants")}
        </span>
        <ChevronDown size={14} className={cn("text-gray-400 flex-shrink-0 ml-2 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 max-h-60 overflow-y-auto">
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

/** Toggle switch */
function ToggleSwitch({
  checked, onChange, label,
}: {
  checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors focus:outline-none flex-shrink-0",
          checked ? "bg-brand-primary" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5"
        )} />
      </button>
    </label>
  );
}

/** Stepper counter (number + –/+ buttons) */
function StepperCounter({
  value, onChange, min = 1, error,
}: {
  value: number; onChange: (v: number) => void; min?: number; error?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center border rounded-lg overflow-hidden",
      error ? "border-red-400" : "border-gray-200"
    )}>
      <input
        type="text"
        readOnly
        value={value}
        className="flex-1 px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2.5 border-l border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Minus size={13} />
      </button>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="px-3 py-2.5 border-l border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Plus size={13} />
      </button>
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

function MonthView({
  year, month, selected, onSelect,
}: {
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
                active
                  ? "bg-brand-primary text-white font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
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
  // ── CMT section ──
  cmtBookingType: Yup.string().required("Required"),
  cmtCabinAmount: Yup.number().min(1, "Min 1").required("Required"),
  cmtVehicleType: Yup.string().required("Required"),
  cmtWeaponVariants: Yup.array().test(
    "at-least-one",
    "Select at least one variant",
    (items) => (items as VariantItem[] | undefined)?.some(i => i.selected) ?? false
  ),

  // ── CTT section ──
  cttClusterAmount: Yup.number().min(1, "Min 1").required("Required"),
  cttVehicleTypes: Yup.array().of(Yup.string()).min(1, "Select at least one vehicle type"),
  cttVehicleVariants: Yup.array().test(
    "at-least-one",
    "Select at least one variant",
    (items) => (items as VariantItem[] | undefined)?.some(i => i.selected) ?? false
  ),
  cttWeaponVariants: Yup.array().test(
    "at-least-one",
    "Select at least one variant",
    (items) => (items as VariantItem[] | undefined)?.some(i => i.selected) ?? false
  ),

  // ── Shared ──
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

export interface CMTCTTBookingDetailsValues {
  // CMT
  cmtBookingType:    string;
  cmtCabinAmount:    number;
  cmtVehicleType:    string;
  cmtWeaponVariants: VariantItem[];
  cmtUseForMainIOS:  boolean;
  // CTT
  cttClusterAmount:    number;
  cttVehicleTypes:     string[];
  cttVehicleVariants:  VariantItem[];
  cttWeaponVariants:   VariantItem[];
  cttUseForMainIOS:    boolean;
  // Shared
  unitName:           string;
  instructor:         string;
  unitContactDetails: string;
  scheduleType:       string | null;
  scheduleSection:    string | null;
  briefingRooms:      string[];
  selectedDate:       Date | null;
}

interface Props {
  onNext: (values: CMTCTTBookingDetailsValues) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CMTCTTBookingDetailsStep({ onNext }: Props) {
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
          // CMT
          cmtBookingType:    "",
          cmtCabinAmount:    1,
          cmtVehicleType:    "",
          cmtWeaponVariants: DEFAULT_CMT_WEAPON_VARIANTS as VariantItem[],
          cmtUseForMainIOS:  false,
          // CTT
          cttClusterAmount:   1,
          cttVehicleTypes:    [] as string[],
          cttVehicleVariants: DEFAULT_CTT_VEHICLE_VARIANTS as VariantItem[],
          cttWeaponVariants:  DEFAULT_CTT_WEAPON_VARIANTS  as VariantItem[],
          cttUseForMainIOS:   false,
          // Shared
          unitName:           "",
          instructor:         "",
          unitContactDetails: "",
          scheduleType:       null as string | null,
          scheduleSection:    null as string | null,
          briefingRooms:      [] as string[],
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          onNext({ ...values, selectedDate });
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            {/* Hidden submit trigger */}
            <button type="submit" id="cmtctt-details-next-trigger" className="hidden" />

            <div className="text-center mb-5">
              <h2 className="text-base font-semibold text-gray-800">Booking Details</h2>
            </div>

            {/* 50/50 grid */}
            <div className="grid grid-cols-2 gap-4 items-start">

              {/* ── LEFT COLUMN ───────────────────────────────── */}
              <div className="space-y-4">

                {/* ── CMT Card ────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-brand-primary text-white tracking-wide">
                        CMT
                      </span>
                      <span className="text-sm font-semibold text-gray-700">CMT Configuration</span>
                    </div>
                    <ToggleSwitch
                      checked={values.cmtUseForMainIOS}
                      onChange={(v) => setFieldValue("cmtUseForMainIOS", v)}
                      label="Use for Main IOS"
                    />
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Row 1: Booking Type | Cabin */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Booking Type <span className="text-brand-primary">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="cmtBookingType"
                            className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                              touched.cmtBookingType && errors.cmtBookingType
                                ? "border-red-400"
                                : "border-gray-200"
                            )}
                          >
                            <option value="" disabled>Select booking type</option>
                            <option value="Entire Cabin">Entire Cabin</option>
                            <option value="Compartment Selection">Compartment Selection</option>
                          </Field>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                        <ErrorMessage
                          name="cmtBookingType"
                          component="p"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Cabin <span className="text-brand-primary">*</span>
                        </label>
                        <StepperCounter
                          value={values.cmtCabinAmount}
                          onChange={(v) => setFieldValue("cmtCabinAmount", v)}
                          error={!!(touched.cmtCabinAmount && errors.cmtCabinAmount)}
                        />
                        <ErrorMessage
                          name="cmtCabinAmount"
                          component="p"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    </div>

                    {/* Row 2: Vehicle Type | Weapon Variant */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Vehicle Type <span className="text-brand-primary">*</span>
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            name="cmtVehicleType"
                            className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                              touched.cmtVehicleType && errors.cmtVehicleType
                                ? "border-red-400"
                                : "border-gray-200"
                            )}
                          >
                            <option value="" disabled>Choose vehicle type</option>
                            {CMT_VEHICLE_TYPES.map(v => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </Field>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                        <ErrorMessage
                          name="cmtVehicleType"
                          component="p"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Weapon Variant <span className="text-brand-primary">*</span>
                        </label>
                        <VariantQtySelector
                          value={values.cmtWeaponVariants}
                          onChange={(next) => setFieldValue("cmtWeaponVariants", next)}
                          placeholder="Select weapon variants"
                          error={
                            touched.cmtWeaponVariants && typeof errors.cmtWeaponVariants === "string"
                              ? errors.cmtWeaponVariants
                              : undefined
                          }
                        />
                        {touched.cmtWeaponVariants && typeof errors.cmtWeaponVariants === "string" && (
                          <p className="mt-1 text-xs text-red-500">{errors.cmtWeaponVariants}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>{/* /CMT Card */}

                {/* ── CTT Card ────────────────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-gray-700 text-white tracking-wide">
                        CTT
                      </span>
                      <span className="text-sm font-semibold text-gray-700">CTT Configuration</span>
                    </div>
                    <ToggleSwitch
                      checked={values.cttUseForMainIOS}
                      onChange={(v) => setFieldValue("cttUseForMainIOS", v)}
                      label="Use for Main IOS"
                    />
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Row 1: Cluster | Vehicle Type (multi-select) */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Cluster <span className="text-brand-primary">*</span>
                        </label>
                        <StepperCounter
                          value={values.cttClusterAmount}
                          onChange={(v) => setFieldValue("cttClusterAmount", v)}
                          error={!!(touched.cttClusterAmount && errors.cttClusterAmount)}
                        />
                        <ErrorMessage
                          name="cttClusterAmount"
                          component="p"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Vehicle Type <span className="text-brand-primary">*</span>
                        </label>
                        <MultiCheckboxDropdown
                          value={values.cttVehicleTypes}
                          onChange={(next) => setFieldValue("cttVehicleTypes", next)}
                          options={CTT_VEHICLE_TYPE_OPTIONS}
                          placeholder="Choose vehicle type"
                          error={
                            touched.cttVehicleTypes && typeof errors.cttVehicleTypes === "string"
                              ? errors.cttVehicleTypes
                              : undefined
                          }
                        />
                        {touched.cttVehicleTypes && typeof errors.cttVehicleTypes === "string" && (
                          <p className="mt-1 text-xs text-red-500">{errors.cttVehicleTypes}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Vehicle Variant (multi-select+qty) | Weapon Variant */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Vehicle Variant <span className="text-brand-primary">*</span>
                        </label>
                        <VariantQtySelector
                          value={values.cttVehicleVariants}
                          onChange={(next) => setFieldValue("cttVehicleVariants", next)}
                          placeholder="Select vehicle variants"
                          error={
                            touched.cttVehicleVariants && typeof errors.cttVehicleVariants === "string"
                              ? errors.cttVehicleVariants
                              : undefined
                          }
                        />
                        {touched.cttVehicleVariants && typeof errors.cttVehicleVariants === "string" && (
                          <p className="mt-1 text-xs text-red-500">{errors.cttVehicleVariants}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Weapon Variant <span className="text-brand-primary">*</span>
                        </label>
                        <VariantQtySelector
                          value={values.cttWeaponVariants}
                          onChange={(next) => setFieldValue("cttWeaponVariants", next)}
                          placeholder="Select weapon variants"
                          error={
                            touched.cttWeaponVariants && typeof errors.cttWeaponVariants === "string"
                              ? errors.cttWeaponVariants
                              : undefined
                          }
                        />
                        {touched.cttWeaponVariants && typeof errors.cttWeaponVariants === "string" && (
                          <p className="mt-1 text-xs text-red-500">{errors.cttWeaponVariants}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>{/* /CTT Card */}

                {/* ── Shared: Unit info ──────────────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Unit Name <span className="text-brand-primary">*</span>
                      </label>
                      <Field
                        name="unitName"
                        type="text"
                        placeholder="Enter unit name"
                        className={cn(
                          "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                          touched.unitName && errors.unitName ? "border-red-400" : "border-gray-200"
                        )}
                      />
                      <ErrorMessage
                        name="unitName"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Instructor <span className="text-brand-primary">*</span>
                      </label>
                      <Field
                        name="instructor"
                        type="text"
                        placeholder="Enter instructor name"
                        className={cn(
                          "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                          touched.instructor && errors.instructor ? "border-red-400" : "border-gray-200"
                        )}
                      />
                      <ErrorMessage
                        name="instructor"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Unit Contact Details <span className="text-brand-primary">*</span>
                    </label>
                    <Field
                      name="unitContactDetails"
                      type="text"
                      placeholder="Enter unit contact details"
                      className={cn(
                        "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary",
                        touched.unitContactDetails && errors.unitContactDetails
                          ? "border-red-400"
                          : "border-gray-200"
                      )}
                    />
                    <ErrorMessage
                      name="unitContactDetails"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>

                {/* ── Shared: Schedule + Briefing ────────────────── */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Selection <span className="text-brand-primary">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {SCHEDULE_OPTIONS.map(({ value, label }) => (
                        <label
                          key={value}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors",
                            values.scheduleType === value
                              ? "border-brand-primary bg-red-50 text-brand-primary"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}
                        >
                          <input
                            type="radio"
                            name="scheduleType"
                            value={value}
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
                    <ErrorMessage
                      name="scheduleType"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
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
                            <label
                              key={value}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors",
                                isActive
                                  ? "border-brand-primary bg-brand-primary text-white"
                                  : "border-gray-200 text-gray-600 hover:border-gray-300"
                              )}
                            >
                              <span className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                isActive ? "border-white" : "border-gray-300"
                              )}>
                                {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                              </span>
                              <input
                                type="radio"
                                name="scheduleSection"
                                value={value}
                                checked={isActive}
                                onChange={() => setFieldValue("scheduleSection", value)}
                                className="sr-only"
                              />
                              {label}
                            </label>
                          );
                        })}
                      </div>
                      <ErrorMessage
                        name="scheduleSection"
                        component="p"
                        className="mt-1 text-xs text-red-500"
                      />
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
                          <label
                            key={room}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2.5 border rounded-lg cursor-pointer text-sm transition-colors",
                              isSelected
                                ? "border-brand-primary bg-brand-primary text-white"
                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                            )}
                          >
                            <span className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                              isSelected ? "border-white bg-white" : "border-gray-300"
                            )}>
                              {isSelected && (
                                <Check size={10} className="text-brand-primary" strokeWidth={3} />
                              )}
                            </span>
                            <input
                              type="checkbox"
                              checked={isSelected}
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
                    <ErrorMessage
                      name="briefingRooms"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>

              </div>{/* /LEFT COLUMN */}

              {/* ── RIGHT COLUMN: Calendar ────────────────────── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-0">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Select Date Slot <span className="text-brand-primary">*</span>
                </p>
                <div className="flex items-start gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0 mt-1"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <div className="flex-1 flex gap-4 min-w-0">
                    <MonthView
                      year={calYear} month={calMonth}
                      selected={selectedDate} onSelect={setSelectedDate}
                    />
                    <div className="w-px bg-gray-100 flex-shrink-0 self-stretch" />
                    <MonthView
                      year={year2} month={month2}
                      selected={selectedDate} onSelect={setSelectedDate}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0 mt-1"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
                {selectedDate && (
                  <p className="mt-4 text-xs text-center text-brand-primary font-medium">
                    {selectedDate.toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                )}
              </div>

            </div>{/* /grid */}
          </Form>
        )}
      </Formik>
    </div>
  );
}
