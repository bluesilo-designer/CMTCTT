import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { TableCustom } from "@/components/table";
import { cn } from "@/lib/utils";
import type { CMTBookingDetailsValues } from "./CMTBookingDetailsStep";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CabinRow {
  id:            string;
  occupied:      boolean;
  selected:      boolean;
  weaponVariant: string;
  role:          string;
}

interface SlaveIOSEntry {
  uid:   number;
  value: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const WEAPON_VARIANT_OPTIONS = ["40AGL", "50HMG", "7.62 COAX", "Smoke Discharger"];
const ROLE_OPTIONS           = ["All role selected", "Commander", "Gunner", "Driver", "Loader"];
const FORCE_OPTIONS          = ["Blue", "Red"];

const INITIAL_CABINS: CabinRow[] = [
  { id: "CMT_CABIN_01", occupied: false, selected: true,  weaponVariant: "", role: "All role selected" },
  { id: "CMT_CABIN_02", occupied: false, selected: true,  weaponVariant: "", role: "All role selected" },
  { id: "CMT_CABIN_03", occupied: true,  selected: false, weaponVariant: "", role: "" },
  { id: "CMT_CABIN_04", occupied: false, selected: true,  weaponVariant: "", role: "All role selected" },
  { id: "CMT_CABIN_05", occupied: true,  selected: false, weaponVariant: "", role: "" },
  { id: "CMT_CABIN_06", occupied: false, selected: true,  weaponVariant: "", role: "All role selected" },
  { id: "CMT_CABIN_07", occupied: true,  selected: false, weaponVariant: "", role: "" },
  { id: "CMT_CABIN_08", occupied: false, selected: true,  weaponVariant: "", role: "All role selected" },
  { id: "CMT_CABIN_09", occupied: true,  selected: false, weaponVariant: "", role: "" },
  { id: "CMT_CABIN_10", occupied: true,  selected: false, weaponVariant: "", role: "" },
  { id: "CMT_CABIN_11", occupied: false, selected: false, weaponVariant: "", role: "" },
  { id: "CMT_CABIN_12", occupied: false, selected: false, weaponVariant: "", role: "" },
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
}: {
  bookingDetails?: CMTBookingDetailsValues | null;
}) {
  const [cabins,       setCabins]       = useState<CabinRow[]>(INITIAL_CABINS);
  const [mainIOS,      setMainIOS]      = useState("");
  const [force,        setForce]        = useState("");
  const [slaveIOSList, setSlaveIOSList] = useState<SlaveIOSEntry[]>([]);

  // ── Derive Main IOS options from weapon variant quantities ──────────────────
  const totalWeaponQty = useMemo(() => {
    if (!bookingDetails?.vehicleVariants) return 0;
    return bookingDetails.vehicleVariants
      .filter(v => v.selected)
      .reduce((sum, v) => sum + v.qty, 0);
  }, [bookingDetails]);

  // Generate "Main IOS 1" … "Main IOS N" where N = total weapon qty
  // Fall back to 4 when no booking details exist yet (e.g. navigated directly)
  const mainIOSOptions = useMemo(
    () => Array.from(
      { length: Math.max(1, totalWeaponQty || 4) },
      (_, i) => `Main IOS ${i + 1}`
    ),
    [totalWeaponQty]
  );

  // ── Derived values ──────────────────────────────────────────────────────────
  const availableCabins  = cabins.filter(c => !c.occupied);
  const selectedCount    = cabins.filter(c => !c.occupied && c.selected).length;
  const allSelected      = availableCabins.length > 0 && availableCabins.every(c => c.selected);
  const someSelected     = availableCabins.some(c => c.selected);

  // ── Cabin state setters ─────────────────────────────────────────────────────
  const toggleAll = useCallback(() => {
    const shouldSelect = !allSelected;
    setCabins(prev => prev.map(c =>
      c.occupied ? c : {
        ...c,
        selected: shouldSelect,
        role:     shouldSelect ? "All role selected" : "",
      }
    ));
  }, [allSelected]);

  const toggleCabin = useCallback((id: string) => {
    setCabins(prev => prev.map(c =>
      c.id === id
        ? { ...c, selected: !c.selected, role: !c.selected ? "All role selected" : "" }
        : c
    ));
  }, []);

  const setWeaponVariant = useCallback((id: string, variant: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, weaponVariant: variant } : c));
  }, []);

  const setRole = useCallback((id: string, role: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, role } : c));
  }, []);

  // ── Slave IOS ───────────────────────────────────────────────────────────────
  const addSlaveIOS = () =>
    setSlaveIOSList(prev => [...prev, { uid: Date.now(), value: "" }]);

  const updateSlaveIOS = (uid: number, value: string) =>
    setSlaveIOSList(prev => prev.map(s => s.uid === uid ? { ...s, value } : s));

  const removeSlaveIOS = (uid: number) =>
    setSlaveIOSList(prev => prev.filter(s => s.uid !== uid));

  // ── Table columns ───────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<CabinRow, any>[]>(() => [
    columnHelper.display({
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
      cell: ({ row }) => (
        row.original.occupied ? null : (
          <button
            type="button"
            onClick={() => toggleCabin(row.original.id)}
            className={cn(
              "w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors",
              row.original.selected
                ? "bg-brand-primary border-brand-primary"
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            {row.original.selected && <Check size={10} className="text-white" strokeWidth={3} />}
          </button>
        )
      ),
    }),

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
      header: () => "Weapon Variant",
      cell:   ({ row }) => row.original.occupied ? (
        <span className="text-sm text-gray-400 italic">Occupied</span>
      ) : (
        <TableDropdown
          value={row.original.weaponVariant}
          onChange={(v) => setWeaponVariant(row.original.id, v)}
          options={WEAPON_VARIANT_OPTIONS}
          placeholder="Weapon Variant"
        />
      ),
    }),

    columnHelper.display({
      id:     "role",
      header: () => "Role",
      cell:   ({ row }) => row.original.occupied ? null : (
        <TableDropdown
          value={row.original.role}
          onChange={(v) => setRole(row.original.id, v)}
          options={ROLE_OPTIONS}
          placeholder="Assign role"
        />
      ),
    }),
  ], [allSelected, someSelected, toggleAll, toggleCabin, setWeaponVariant, setRole]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {/* Page header */}
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-800">
          Cabin Configuration{" "}
          <span className="font-normal text-gray-500 text-sm">
            ({selectedCount}/{availableCabins.length} cabins selected)
          </span>
        </h2>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-[1fr_420px] gap-4 items-start">

        {/* ── LEFT: Cabin table ──────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TableCustom<CabinRow>
            data={cabins}
            columns={columns}
            autoScrollTable={true}
            actionSticky={false}
            classTheadTh="!px-4 !py-3 !text-xs"
            classTBodyTd="!px-4 !py-2.5 !h-auto"
          />
        </div>

        {/* ── RIGHT: IOS Configuration ───────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">

          {/* Main IOS + Force Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Main IOS <span className="text-brand-primary">*</span>
              </label>
              <PanelDropdown
                value={mainIOS}
                onChange={setMainIOS}
                options={mainIOSOptions}
                placeholder="Choose main IOS"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Force Selection <span className="text-brand-primary">*</span>
              </label>
              <PanelDropdown
                value={force}
                onChange={setForce}
                options={FORCE_OPTIONS}
                placeholder="Choose force selection"
              />
            </div>
          </div>

          {/* Slave IOS entries */}
          {slaveIOSList.length > 0 && (
            <div className="space-y-3 border-t border-gray-100 pt-3">
              {slaveIOSList.map((slave, idx) => (
                <div key={slave.uid}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Slave IOS {idx + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => removeSlaveIOS(slave.uid)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <PanelDropdown
                    value={slave.value}
                    onChange={(v) => updateSlaveIOS(slave.uid, v)}
                    options={mainIOSOptions}
                    placeholder="Choose slave IOS"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Add Slave IOS button */}
          <div className={cn(
            "border border-dashed border-gray-200 rounded-lg py-4 flex justify-center",
            slaveIOSList.length > 0 && "mt-0"
          )}>
            <button
              type="button"
              onClick={addSlaveIOS}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center">
                <Plus size={11} />
              </div>
              Add Slave IOS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
