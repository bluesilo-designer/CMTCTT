import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { TableCustom } from "@/components/table";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CabinRow {
  id:            string;
  occupied:      boolean;
  selected:      boolean;
  weaponVariant: string;
  role:          string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const WEAPON_VARIANT_OPTIONS = ["40AGL", "50HMG", "7.62 COAX", "Smoke Discharger"];
const ROLE_OPTIONS           = ["All role selected", "Commander", "Gunner", "Driver", "Loader"];
const FORCE_OPTIONS          = ["Blue", "Red"];
const MAIN_IOS_OPTIONS       = Array.from({ length: 5 }, (_, i) => `Main IOS ${i + 1}`);

// Pre-populated with weapon variants matching the booking creation mock
const INITIAL_CABINS: CabinRow[] = [
  { id: "CMT_CABIN_01", occupied: false, selected: true,  weaponVariant: "40AGL", role: "All role selected" },
  { id: "CMT_CABIN_02", occupied: false, selected: true,  weaponVariant: "40AGL", role: "All role selected" },
  { id: "CMT_CABIN_03", occupied: true,  selected: false, weaponVariant: "",       role: "" },
  { id: "CMT_CABIN_04", occupied: false, selected: true,  weaponVariant: "50HMG", role: "All role selected" },
  { id: "CMT_CABIN_05", occupied: true,  selected: false, weaponVariant: "",       role: "" },
  { id: "CMT_CABIN_06", occupied: false, selected: true,  weaponVariant: "40AGL", role: "All role selected" },
  { id: "CMT_CABIN_07", occupied: true,  selected: false, weaponVariant: "",       role: "" },
  { id: "CMT_CABIN_08", occupied: false, selected: true,  weaponVariant: "50HMG", role: "All role selected" },
  { id: "CMT_CABIN_09", occupied: true,  selected: false, weaponVariant: "",       role: "" },
  { id: "CMT_CABIN_10", occupied: true,  selected: false, weaponVariant: "",       role: "" },
  { id: "CMT_CABIN_11", occupied: false, selected: false, weaponVariant: "",       role: "" },
  { id: "CMT_CABIN_12", occupied: false, selected: false, weaponVariant: "",       role: "" },
];

const columnHelper = createColumnHelper<CabinRow>();

// ── Sub-components ────────────────────────────────────────────────────────────

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
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs border border-gray-200 rounded-md bg-white whitespace-nowrap transition-colors max-w-[160px] w-full"
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

function PanelDropdown({
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
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 text-sm border rounded-lg bg-white transition-colors focus:outline-none",
          open ? "border-brand-primary" : "border-gray-200 hover:border-gray-300"
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

export function CMTOnboardingCabinConfig({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [cabins,  setCabins]  = useState<CabinRow[]>(INITIAL_CABINS);
  const [mainIOS, setMainIOS] = useState("Main IOS 2");
  const [force,   setForce]   = useState("Red");

  const availableCabins = cabins.filter(c => !c.occupied);
  const selectedCount   = cabins.filter(c => !c.occupied && c.selected).length;
  const allSelected     = availableCabins.length > 0 && availableCabins.every(c => c.selected);
  const someSelected    = availableCabins.some(c => c.selected);

  const toggleAll = useCallback(() => {
    const shouldSelect = !allSelected;
    setCabins(prev => prev.map(c =>
      c.occupied ? c : { ...c, selected: shouldSelect, role: shouldSelect ? "All role selected" : "" }
    ));
  }, [allSelected]);

  const toggleCabin = useCallback((id: string) => {
    setCabins(prev => prev.map(c =>
      c.id === id ? { ...c, selected: !c.selected, role: !c.selected ? "All role selected" : "" } : c
    ));
  }, []);

  const setWeaponVariant = useCallback((id: string, variant: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, weaponVariant: variant } : c));
  }, []);

  const setRole = useCallback((id: string, role: string) => {
    setCabins(prev => prev.map(c => c.id === id ? { ...c, role } : c));
  }, []);

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
      cell: ({ row }) => row.original.occupied ? null : (
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
      ),
    }),

    columnHelper.accessor("id", {
      header: () => "Cabin",
      cell: ({ row }) => (
        <span className={cn(
          "text-sm font-medium",
          row.original.occupied ? "text-gray-400" :
          row.original.selected ? "text-gray-800" : "text-gray-600"
        )}>
          {row.original.id}
        </span>
      ),
    }),

    columnHelper.display({
      id: "weaponVariant",
      header: () => "Weapon Variant",
      cell: ({ row }) => row.original.occupied ? (
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
      id: "role",
      header: () => "Role",
      cell: ({ row }) => row.original.occupied ? null : (
        <TableDropdown
          value={row.original.role}
          onChange={(v) => setRole(row.original.id, v)}
          options={ROLE_OPTIONS}
          placeholder="Assign role"
        />
      ),
    }),
  ], [allSelected, someSelected, toggleAll, toggleCabin, setWeaponVariant, setRole]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between flex-shrink-0 gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Cabin Configuration</h2>
          <p className="text-xs text-gray-400 mt-0.5">Please confirm the cabin before start of the training.</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 w-auto border border-gray-200"
          >
            <ArrowLeft size={14} /> Back
          </Button>
          <Button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
          >
            Confirm cabin configuration <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Card header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              Cabin Configuration{" "}
              <span className="font-normal text-gray-400">({selectedCount}/{availableCabins.length} Cabins)</span>
            </h3>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-[1fr_380px]">

            {/* Left: cabin table */}
            <div className="border-r border-gray-100">
              <TableCustom<CabinRow>
                data={cabins}
                columns={columns}
                autoScrollTable={true}
                actionSticky={false}
                classTheadTh="!px-4 !py-3 !text-xs"
                classTBodyTd="!px-4 !py-2.5 !h-auto"
              />
            </div>

            {/* Right: IOS config */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Main IOS <span className="text-brand-primary">*</span>
                  </label>
                  <PanelDropdown
                    value={mainIOS}
                    onChange={setMainIOS}
                    options={MAIN_IOS_OPTIONS}
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
                    placeholder="Choose force"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
