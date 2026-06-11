import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { TableCustom } from "@/components/table";
import { cn } from "@/lib/utils";
import type { CMTBookingDetailsValues } from "./CMTBookingDetailsStep";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CabinRow {
  id:            string;
  occupied:      boolean;
  /** Temporarily unavailable (e.g. under maintenance) — displayed like Occupied but amber */
  unavailable?:  boolean;
  selected:      boolean;
  callSign:      string;
  weaponVariant: string;
  role:          string;
}

export interface IosEntry {
  uid:         number;
  iosDevice:   string;
  baseStation: string;
  masterIOS:   "Yes" | "No" | "";
  forceType:   "Opposing" | "Friendly" | "";
}

// ── Constants ─────────────────────────────────────────────────────────────────

const WEAPON_VARIANT_OPTIONS = ["40AGL", "50HMG", "7.62 COAX", "Smoke Discharger"];
const ROLE_OPTIONS           = ["VO", "VC", "TS/TC", "SC", "SO"];

// CMT-only IOS devices. CTT IOS devices (CTTIOS01, CTTIOS02) are reserved for
// the CMT+CTT flow and should not appear in standalone CMT bookings.
const IOS_OPTIONS = [
  "CMTIOS01", "CMTIOS02", "CMTIOS03", "CMTIOS04",
];

/** Extended list that includes CTT devices — used when CMT+CTT flow is re-enabled */
export const CMTCTT_IOS_OPTIONS = [
  "CMTIOS01", "CMTIOS02", "CMTIOS03", "CMTIOS04",
  "CTTIOS01", "CTTIOS02",
];
const BASE_STATION_OPTIONS = ["BMS1ForceSide", "BMS2ForceSide"];
const FORCE_TYPE_OPTIONS   = ["Opposing", "Friendly"];

const CALL_SIGN_OPTIONS = [
  "09", "09Z", "08", "08Z", "07", "01",
  "06", "06Z", "05", "05Z", "03", "45Z",
  "81", "81A", "81AZ", "81Z",
  "83Z", "83A1Z", "83A2Z", "83A3Z", "83A4Z",
];

/** Default cabin data for Standalone CMT — cabins 11 & 12 are occupied */
export const INITIAL_CABINS: CabinRow[] = [
  { id: "CMT01", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT02", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT03", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT04", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT05", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT06", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT07", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT08", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT09", occupied: false, unavailable: true, selected: false, callSign: "", weaponVariant: "", role: "" }, // Under maintenance
  { id: "CMT10", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT11", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT12", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
];

/** Cabin data for CMT+CTT — cabins 11 & 12 are selectable (not occupied) */
export const CMTCTT_INITIAL_CABINS: CabinRow[] = [
  { id: "CMT01", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT02", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT03", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT04", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT05", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT06", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT07", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT08", occupied: false, selected: true,  callSign: "", weaponVariant: "", role: "" },
  { id: "CMT09", occupied: false, unavailable: true, selected: false, callSign: "", weaponVariant: "", role: "" }, // Under maintenance
  { id: "CMT10", occupied: true,  selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT11", occupied: false, selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT12", occupied: false, selected: false, callSign: "", weaponVariant: "", role: "" },
];

const columnHelper = createColumnHelper<CabinRow>();

// ── Sub-components ────────────────────────────────────────────────────────────

/** Compact dropdown used inside table cells */
function TableDropdown({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
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
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 bg-white whitespace-nowrap transition-colors max-w-[160px] w-full"
      >
        <span className={cn("flex-1 text-left truncate", value ? "text-gray-800" : "text-gray-400")}>
          {value || placeholder}
        </span>
        <ChevronDown size={11} className={cn("text-gray-400 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[50] py-1 min-w-[170px]">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              {opt}
              {value === opt && <Check size={11} className="text-brand-primary flex-shrink-0 ml-1" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Multi-select dropdown for Role column — stores comma-separated values in role: string */
function MultiRoleDropdown({ value, onChange }: {
  value: string; onChange: (v: string) => void;
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

  const selected   = value ? value.split(",").filter(Boolean) : [];
  const allChecked = ROLE_OPTIONS.every(r => selected.includes(r));
  const someChecked = selected.length > 0 && !allChecked;

  const toggleAll = () => onChange(allChecked ? "" : ROLE_OPTIONS.join(","));

  const toggleRole = (role: string) => {
    const next = selected.includes(role)
      ? selected.filter(r => r !== role)
      : [...selected, role];
    onChange(next.join(","));
  };

  const label = selected.length > 0 ? selected.join(", ") : "Select roles";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs border border-gray-200 rounded-md hover:border-gray-300 bg-white transition-colors w-full max-w-[180px]"
      >
        <span className={cn("flex-1 text-left truncate", selected.length > 0 ? "text-gray-800" : "text-gray-400")}>
          {label}
        </span>
        <ChevronDown size={11} className={cn("text-gray-400 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[50] py-1 min-w-[150px]">
          {/* All */}
          <button
            type="button"
            onClick={toggleAll}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
          >
            <div className={cn(
              "w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
              allChecked  ? "bg-brand-primary border-brand-primary" :
              someChecked ? "bg-brand-primary/20 border-brand-primary/50" : "border-gray-300",
            )}>
              {allChecked  && <Check size={8} className="text-white" strokeWidth={3} />}
              {someChecked && !allChecked && <span className="w-1.5 h-0.5 bg-brand-primary block rounded-full" />}
            </div>
            All
          </button>

          <div className="h-px bg-gray-100 mx-2 my-0.5" />

          {/* Core roles */}
          {ROLE_OPTIONS.map(role => {
            const checked = selected.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleRole(role)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
              >
                <div className={cn(
                  "w-3.5 h-3.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                  checked ? "bg-brand-primary border-brand-primary" : "border-gray-300",
                )}>
                  {checked && <Check size={8} className="text-white" strokeWidth={3} />}
                </div>
                {role}
              </button>
            );
          })}

        </div>
      )}
    </div>
  );
}

/** Searchable (Select2-style) dropdown used for Call Sign column */
function SearchableTableDropdown({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string;
}) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const ref     = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 bg-white whitespace-nowrap transition-colors max-w-[160px] w-full"
      >
        <span className={cn("flex-1 text-left truncate", value ? "text-gray-800" : "text-gray-400")}>
          {value || placeholder}
        </span>
        <ChevronDown size={11} className={cn("text-gray-400 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[50] min-w-[170px]">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
          {/* Options list */}
          <div className="max-h-40 overflow-y-auto py-1">
            {filtered.length > 0 ? filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); setSearch(""); }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
              >
                {opt}
                {value === opt && <Check size={11} className="text-brand-primary flex-shrink-0 ml-1" />}
              </button>
            )) : (
              <p className="px-3 py-2 text-xs text-gray-400 italic">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Full-width custom select for the IOS panel */
function PanelDropdown({
  value, onChange, options, placeholder, error,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string; error?: boolean;
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
          error  ? "border-red-400" :
          open   ? "border-brand-primary" : "border-gray-200 hover:border-gray-300"
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
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              {opt}
              {value === opt && <Check size={14} className="text-brand-primary flex-shrink-0 ml-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CMTCabinConfigStep({
  bookingDetails,
  weaponVariantOptions,
  initialCabins: initialCabinsProp,
  initialIosList: initialIosListProp,
  showCallSign = true,
  onIOSChange,
  onCabinsChange,
  gridCols = "grid-cols-[60%_40%]",
}: {
  bookingDetails?:       CMTBookingDetailsValues | null;
  /** Overrides the default weapon variant list in the cabin table (e.g. for CMT+CTT with qty labels) */
  weaponVariantOptions?: string[];
  /** Overrides the default initial cabin data (e.g. CMT+CTT uses CMTCTT_INITIAL_CABINS) */
  initialCabins?:        CabinRow[];
  /** Pre-populate IOS entries (e.g. loaded from localStorage for the detail page) */
  initialIosList?:       IosEntry[];
  /** Whether to show the Call Sign column (default: true). Set false for CMT+CTT flow. */
  showCallSign?:         boolean;
  /** Called whenever the IOS list changes — used to bubble state up to parent */
  onIOSChange?:          (list: IosEntry[]) => void;
  /** Called whenever the cabin list changes — used to bubble state up to parent */
  onCabinsChange?:       (cabins: CabinRow[]) => void;
  /** Tailwind grid-cols class for the table/IOS panel split. Default: "grid-cols-[60%_40%]" (60/40) */
  gridCols?:             string;
}) {
  const defaultIosList: IosEntry[] = [
    { uid: 1, iosDevice: "", baseStation: "", masterIOS: "", forceType: "" },
  ];

  const [cabins, setCabins] = useState<CabinRow[]>(() => {
    const base   = initialCabinsProp ?? INITIAL_CABINS;
    const amount = bookingDetails?.cabinAmount;
    // If loaded from localStorage or no amount specified — use as-is
    if (initialCabinsProp || !amount) return base;
    // Pre-select exactly `amount` non-occupied cabins in order
    let count = 0;
    return base.map(c => {
      if (c.occupied) return c;
      const selected = count < amount;
      if (selected) count++;
      return { ...c, selected };
    });
  });
  const [iosList,     setIosList]     = useState<IosEntry[]>(initialIosListProp ?? defaultIosList);
  /** uid of the IOS entry currently open in form-edit mode (null = all collapsed) */
  const [editingUid, setEditingUid]   = useState<number | null>(initialIosListProp ? null : 1);

  // Bubble IOS list up to parent whenever it changes
  const onIOSChangeRef = useRef(onIOSChange);
  onIOSChangeRef.current = onIOSChange;
  useEffect(() => {
    onIOSChangeRef.current?.(iosList);
  }, [iosList]);

  // Bubble cabin list up to parent whenever it changes
  const onCabinsChangeRef = useRef(onCabinsChange);
  onCabinsChangeRef.current = onCabinsChange;
  useEffect(() => {
    onCabinsChangeRef.current?.(cabins);
  }, [cabins]);

  // ── Derive Platform Type options from booking details ─────────────────────────
  // Only show variants the user actually selected in Booking Details step
  const platformTypeOptions = useMemo(() => {
    const selected = bookingDetails?.platformVariants?.filter(v => v.selected).map(v => v.label);
    return selected && selected.length > 0 ? selected : (weaponVariantOptions ?? WEAPON_VARIANT_OPTIONS);
  }, [bookingDetails, weaponVariantOptions]);

  // ── Derived values ──────────────────────────────────────────────────────────
  const availableCabins = cabins.filter(c => !c.occupied);
  const selectedCount   = cabins.filter(c => !c.occupied && c.selected).length;
  // Cap = cabinAmount from booking details (or all available if not specified)
  const maxCabins       = bookingDetails?.cabinAmount ?? availableCabins.length;
  const atMax           = selectedCount >= maxCabins;
  const allSelected     = selectedCount > 0 && selectedCount >= Math.min(maxCabins, availableCabins.length);
  const someSelected    = availableCabins.some(c => c.selected);

  // Platform type quota: how many of each type the user allocated in Booking Details
  const platformQuota = useMemo<Record<string, number>>(() => {
    const q: Record<string, number> = {};
    bookingDetails?.platformVariants?.filter(v => v.selected).forEach(v => { q[v.label] = v.qty; });
    return q;
  }, [bookingDetails]);

  // Current usage: how many selected cabins have each platform type assigned
  const platformUsage = useMemo<Record<string, number>>(() => {
    const u: Record<string, number> = {};
    cabins.filter(c => c.selected && c.weaponVariant).forEach(c => {
      u[c.weaponVariant] = (u[c.weaponVariant] ?? 0) + 1;
    });
    return u;
  }, [cabins]);

  // Returns available options for a cabin, respecting per-type quotas
  const availableVariantOptions = useCallback((currentValue: string) =>
    platformTypeOptions.filter(opt => {
      const quota = platformQuota[opt];
      if (!quota) return true;                        // no quota → always available
      const used = platformUsage[opt] ?? 0;
      return used < quota || opt === currentValue;    // quota not reached, or already selected here
    }),
  [platformTypeOptions, platformQuota, platformUsage]);

  // ── Cabin state setters ─────────────────────────────────────────────────────
  const toggleAll = useCallback(() => {
    if (allSelected) {
      // Deselect all
      setCabins(prev => prev.map(c => c.occupied ? c : { ...c, selected: false }));
    } else {
      // Select up to maxCabins in order
      let count = 0;
      setCabins(prev => prev.map(c => {
        if (c.occupied) return c;
        const sel = count < maxCabins;
        if (sel) count++;
        return { ...c, selected: sel };
      }));
    }
  }, [allSelected, maxCabins]);

  const toggleCabin = useCallback((id: string) => {
    setCabins(prev => {
      const cabin = prev.find(c => c.id === id);
      if (!cabin || cabin.occupied) return prev;
      // Block selecting a new cabin if already at the limit
      if (!cabin.selected && prev.filter(c => !c.occupied && c.selected).length >= maxCabins) return prev;
      return prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c);
    });
  }, [maxCabins]);

  const setCallSign = useCallback((id: string, callSign: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, callSign } : c));
  }, []);

  const setWeaponVariant = useCallback((id: string, variant: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, weaponVariant: variant } : c));
  }, []);

  const setRole = useCallback((id: string, role: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, role } : c));
  }, []);

  // ── IOS list helpers ────────────────────────────────────────────────────────
  const addIOS = () => {
    const newUid = Date.now();
    setIosList(prev => [...prev, { uid: newUid, iosDevice: "", baseStation: "", masterIOS: "", forceType: "" }]);
    setEditingUid(newUid);
  };

  const removeIOS = (uid: number) => {
    setIosList(prev => prev.filter(e => e.uid !== uid));
    setEditingUid(prev => prev === uid ? null : prev);
  };

  const updateIOS = (uid: number, field: keyof Omit<IosEntry, "uid">, value: string) =>
    setIosList(prev => prev.map(e => e.uid === uid ? { ...e, [field]: value } : e));

  // ── Table columns ───────────────────────────────────────────────────────────
  const columns = useMemo<(ColumnDef<CabinRow, any> & { minWidth?: string; maxWidth?: string; width?: string })[]>(() => {
    const all: (ColumnDef<CabinRow, any> & { minWidth?: string; maxWidth?: string; width?: string })[] = [
    {
      ...columnHelper.display({
        id: "select",
        header: () => (
          <button
            type="button"
            onClick={toggleAll}
            className={cn(
              "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors",
              allSelected
                ? "bg-brand-primary border-brand-primary"
                : someSelected
                  ? "bg-brand-primary/30 border-brand-primary/50"
                  : "border-gray-300 hover:border-gray-400"
            )}
          >
            {allSelected  && <Check size={10} className="text-white" strokeWidth={3} />}
            {someSelected && !allSelected && <span className="w-2 h-px bg-brand-primary" />}
          </button>
        ),
        cell: ({ row }) => {
          if (row.original.occupied || row.original.unavailable) return null;
          const isUnavail = false;
          const isDisabled = isUnavail || (!row.original.selected && atMax);
          return (
            <button
              type="button"
              onClick={() => !isDisabled && toggleCabin(row.original.id)}
              disabled={isDisabled}
              title={isUnavail ? "Cabin unavailable — under maintenance" : undefined}
              className={cn(
                "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors",
                row.original.selected
                  ? "bg-brand-primary border-brand-primary"
                  : isUnavail
                    ? "border-amber-300 bg-amber-50 cursor-not-allowed"
                    : isDisabled
                      ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-40"
                      : "border-gray-300 hover:border-gray-400"
              )}
            >
              {row.original.selected && <Check size={10} className="text-white" strokeWidth={3} />}
            </button>
          );
        },
      }),
      minWidth: "48px",
      maxWidth: "48px",
      width:    "48px",
    },

    columnHelper.accessor("id", {
      header: () => "Cabin",
      cell:   ({ row }) => (
        <span className={cn(
          "text-sm font-medium",
          row.original.occupied ? "text-gray-400" :
          row.original.selected ? "text-gray-800"  : "text-gray-600"
        )}>
          {row.original.id}
        </span>
      ),
    }),

    columnHelper.display({
      id:     "weaponVariant",
      header: () => "Platform Type",
      cell:   ({ row }) => row.original.occupied ? (
        <span className="text-sm text-gray-400 italic">Occupied</span>
      ) : row.original.unavailable ? (
        <span className="text-sm text-amber-600 italic font-medium">Unavailable</span>
      ) : (
        <TableDropdown
          value={row.original.weaponVariant}
          onChange={(v) => setWeaponVariant(row.original.id, v)}
          options={availableVariantOptions(row.original.weaponVariant)}
          placeholder="Platform Type"
        />
      ),
    }),

    columnHelper.display({
      id:     "role",
      header: () => "Role",
      cell:   ({ row }) => row.original.occupied || row.original.unavailable ? null : (
        <MultiRoleDropdown
          value={row.original.role}
          onChange={(v) => setRole(row.original.id, v)}
        />
      ),
    }),

    columnHelper.display({
      id:     "callSign",
      header: () => "Call Sign",
      cell:   ({ row }) => row.original.occupied || row.original.unavailable ? null : (
        <SearchableTableDropdown
          value={row.original.callSign}
          onChange={(v) => setCallSign(row.original.id, v)}
          options={CALL_SIGN_OPTIONS}
          placeholder="Call Sign"
        />
      ),
    }),
    ];
    return showCallSign
      ? all
      : all.filter(col => (col as any).id !== "callSign");
  }, [allSelected, someSelected, toggleAll, toggleCabin, setCallSign, setWeaponVariant, setRole, platformTypeOptions, availableVariantOptions, showCallSign]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Page header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-base font-semibold text-gray-800">
            Cabin Configuration{" "}
            <span className="font-normal text-gray-500 text-sm">
              ({selectedCount}/{maxCabins} cabin{maxCabins !== 1 ? "s" : ""} selected)
            </span>
          </h2>
        </div>

        {/* Platform type quota bar — only shown when quota is defined from Booking Details */}
        {Object.keys(platformQuota).length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">Platform quota:</span>
            {Object.entries(platformQuota).map(([label, quota]) => {
              const used      = platformUsage[label] ?? 0;
              const remaining = quota - used;
              const full      = remaining <= 0;
              return (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium",
                    full
                      ? "bg-red-50 border-red-200 text-brand-primary"
                      : "bg-white border-gray-200 text-gray-600"
                  )}
                >
                  <span className="font-semibold">{label}</span>
                  <span className={cn("font-mono", full ? "text-brand-primary" : "text-gray-500")}>
                    {used}/{quota}
                  </span>
                  {full && (
                    <span className="text-[10px] text-brand-primary font-bold">FULL</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Configurable layout split */}
      <div className={cn("grid gap-4 items-start", gridCols)}>

        {/* ── LEFT: Cabin table ──────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TableCustom<CabinRow>
            data={cabins}
            columns={columns}
            autoScrollTable={true}
            actionSticky={false}
            classTheadTh="!px-4 !py-3 !text-xs"
            classTBodyTd="!px-4 !py-2.5 !h-auto"
            getRowClass={(row) =>
              row.unavailable
                ? "bg-amber-50/60"
                : row.selected
                  ? "bg-red-50"
                  : ""
            }
          />
        </div>

        {/* ── RIGHT: IOS Configuration list ──────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">

          {/* IOS entries — full width, stacked vertically */}
          <div className="flex flex-col gap-3">
          {iosList.map((entry, idx) => {
            const isEditing = editingUid === entry.uid;
            const isFilled  = !!entry.iosDevice;

            /* ── Collapsed list-item card ── */
            if (!isEditing) {
              return (
                <div key={entry.uid} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-700 mb-1">IOS {idx + 1}</p>
                    {isFilled ? (
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          entry.iosDevice,
                          entry.baseStation,
                          entry.masterIOS ? `Master: ${entry.masterIOS}` : null,
                          entry.forceType,
                        ].filter(Boolean).map((chip, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white border border-gray-200 text-gray-600 whitespace-nowrap">
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Not configured</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingUid(entry.uid)}
                      className="text-[11px] font-medium text-brand-primary hover:underline transition-colors"
                    >
                      Edit
                    </button>
                    {iosList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIOS(entry.uid)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            /* ── Expanded form card ── */
            // IOS devices already chosen by other entries (exclude current entry so it can keep its own)
            const usedIosDevices = iosList
              .filter(e => e.uid !== entry.uid && e.iosDevice !== "")
              .map(e => e.iosDevice);
            const availableIosOptions = IOS_OPTIONS.filter(opt => !usedIosDevices.includes(opt));

            return (
              <div key={entry.uid} className="rounded-lg border border-brand-primary/30 bg-white p-3 space-y-3">
                {/* Entry header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    IOS {idx + 1}
                  </span>
                  {iosList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIOS(entry.uid)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Select IOS + Base Station — side by side */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Select IOS */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Select IOS <span className="text-brand-primary">*</span>
                    </label>
                    <PanelDropdown
                      value={entry.iosDevice}
                      onChange={(v) => updateIOS(entry.uid, "iosDevice", v)}
                      options={availableIosOptions}
                      placeholder="Choose IOS"
                    />
                  </div>

                  {/* Select Base Station */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Base Station <span className="text-brand-primary">*</span>
                    </label>
                    <PanelDropdown
                      value={entry.baseStation}
                      onChange={(v) => updateIOS(entry.uid, "baseStation", v)}
                      options={BASE_STATION_OPTIONS}
                      placeholder="Choose base station"
                    />
                  </div>
                </div>

                {/* Master IOS Yes / No */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Master IOS <span className="text-brand-primary">*</span>
                  </label>
                  <div className="flex gap-2">
                    {(["Yes", "No"] as const).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateIOS(entry.uid, "masterIOS", opt)}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                          entry.masterIOS === opt
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Force Type Opposing / Friendly */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Force Type <span className="text-brand-primary">*</span>
                  </label>
                  <div className="flex gap-2">
                    {(FORCE_TYPE_OPTIONS as ("Opposing" | "Friendly")[]).map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateIOS(entry.uid, "forceType", opt)}
                        className={cn(
                          "flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                          entry.forceType === opt
                            ? "bg-brand-primary text-white border-brand-primary"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button */}
                <button
                  type="button"
                  onClick={() => setEditingUid(null)}
                  className="w-full py-2 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
                >
                  Save IOS {idx + 1}
                </button>
              </div>
            );
          })}

          </div>{/* /grid grid-cols-2 */}

          {/* Add Another IOS — spans full width */}
          <div className="border border-dashed border-gray-200 rounded-lg py-3 flex justify-center mt-3">
            <button
              type="button"
              onClick={addIOS}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                <Plus size={11} />
              </div>
              Add Another IOS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
