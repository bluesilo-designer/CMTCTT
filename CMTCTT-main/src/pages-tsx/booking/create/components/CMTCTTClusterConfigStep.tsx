import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, ChevronDown, Plus, Trash2 } from "lucide-react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { TableCustom } from "@/components/table";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import type { CMTCTTBookingDetailsValues } from "./CMTCTTBookingDetailsStep";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ClusterRow {
  id:             string;
  occupied:       boolean;
  selected:       boolean;
  vehicleVariant: string;
  weaponVariant:  string;
  roles:          string[];
}

interface SlaveIOSEntry {
  uid:            number;
  value:          string;
  forceSelection: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 10;
const FORCE_OPTIONS  = ["Blue", "Red", "Both"];
const ROLE_OPTIONS   = ["VO", "VC", "TC", "SC", "SO"];

const DEFAULT_WEAPON_VARIANTS  = ["40AGL", "50HMG", "MORTAL", "7.62mm COAXIAL", "120MM SMOOTHBORE"];
const DEFAULT_VEHICLE_VARIANTS = [
  "TERREX (COMMANDER)", "TERREX (TROOPER)", "TERREX (SCOUT)",
  "TERREX (PIONEER)",   "TERREX (MEDICAL)", "TERREX (STORM)", "BRONCO",
];

/**
 * 64 clusters total.
 * Occupied pattern: (n % 10) ∈ {3, 5, 7, 9}
 * Matches screenshot: 03, 05, 07, 09 occupied in first page.
 * All start as NOT selected.
 */
const INITIAL_CLUSTERS: ClusterRow[] = Array.from({ length: 64 }, (_, i) => {
  const n   = i + 1;
  const mod = n % 10;
  return {
    id:             `CTT_CLUSTER_${String(n).padStart(2, "0")}`,
    occupied:       mod === 3 || mod === 5 || mod === 7 || mod === 9,
    selected:       false,
    vehicleVariant: "",
    weaponVariant:  "",
    roles:          [],
  };
});

const columnHelper = createColumnHelper<ClusterRow>();

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

function MultiCheckboxTableDropdown({
  selected, onChange, options, placeholder,
}: {
  selected: string[]; onChange: (roles: string[]) => void; options: string[]; placeholder: string;
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
    selected.includes(opt)
      ? onChange(selected.filter(r => r !== opt))
      : onChange([...selected, opt]);

  const displayValue = selected.join(", ");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-300 bg-white whitespace-nowrap transition-colors max-w-[160px] w-full"
      >
        <span className={cn("flex-1 text-left truncate", displayValue ? "text-gray-800" : "text-gray-400")}>
          {displayValue || placeholder}
        </span>
        <ChevronDown size={11} className={cn("text-gray-400 flex-shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[50] py-1 min-w-[130px]">
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
            >
              <div className={cn(
                "w-[15px] h-[15px] rounded border-2 flex items-center justify-center flex-shrink-0",
                selected.includes(opt) ? "bg-brand-primary border-brand-primary" : "border-gray-300"
              )}>
                {selected.includes(opt) && <Check size={9} className="text-white" strokeWidth={3} />}
              </div>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CMTCTTClusterConfigStep({
  bookingDetails,
}: {
  bookingDetails?: CMTCTTBookingDetailsValues | null;
}) {
  const [clusters,     setClusters]     = useState<ClusterRow[]>(INITIAL_CLUSTERS);
  const [mainIOS,      setMainIOS]      = useState("");
  const [force,        setForce]        = useState("");
  const [slaveIOSList, setSlaveIOSList] = useState<SlaveIOSEntry[]>([]);
  const [currentPage,  setCurrentPage]  = useState(1);

  // ── Derive options from booking details ─────────────────────────────────────
  const vehicleVariantOptions = useMemo(() => {
    const sel = (bookingDetails?.cttVehicleVariants ?? []).filter(v => v.selected);
    return sel.length > 0 ? sel.map(v => `${v.label} (${v.qty})`) : DEFAULT_VEHICLE_VARIANTS;
  }, [bookingDetails]);

  const weaponVariantOptions = useMemo(() => {
    const sel = (bookingDetails?.cttWeaponVariants ?? []).filter(v => v.selected);
    return sel.length > 0 ? sel.map(v => `${v.label} (${v.qty})`) : DEFAULT_WEAPON_VARIANTS;
  }, [bookingDetails]);

  const cttClusterAmount = bookingDetails?.cttClusterAmount ?? 0;

  const mainIOSOptions = useMemo(
    () => Array.from({ length: Math.max(1, cttClusterAmount || 4) }, (_, i) => `Main IOS ${i + 1}`),
    [cttClusterAmount]
  );

  const slaveIOSOptions = useMemo(
    () => Array.from({ length: Math.max(1, cttClusterAmount || 4) }, (_, i) => `Slave IOS ${i + 1}`),
    [cttClusterAmount]
  );

  // ── Derived counts (all rows, not just current page) ────────────────────────
  const availableClusters = useMemo(() => clusters.filter(c => !c.occupied), [clusters]);
  const selectedCount     = useMemo(() => clusters.filter(c => !c.occupied && c.selected).length, [clusters]);
  const targetCount       = cttClusterAmount || availableClusters.length;

  // allSelected: true when we've filled up to the target amount
  const allSelected  = selectedCount >= targetCount && targetCount > 0;
  const someSelected = selectedCount > 0;

  // ── Paginated slice ─────────────────────────────────────────────────────────
  const pagedClusters = useMemo(
    () => clusters.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [clusters, currentPage]
  );

  // ── Cluster state setters ───────────────────────────────────────────────────

  /**
   * Toggle all:
   * - If fewer than targetCount are selected → select the first N=targetCount available clusters
   * - Otherwise → deselect all
   */
  const toggleAll = useCallback(() => {
    if (selectedCount < targetCount) {
      let remaining = targetCount;
      setClusters(prev => prev.map(c => {
        if (c.occupied) return c;
        if (c.selected) { remaining--; return c; }       // already selected, counts toward remaining
        if (remaining > 0) { remaining--; return { ...c, selected: true, roles: [...ROLE_OPTIONS] }; }
        return c;
      }));
    } else {
      setClusters(prev => prev.map(c =>
        c.occupied ? c : { ...c, selected: false, roles: [] }
      ));
    }
  }, [selectedCount, targetCount]);

  const toggleCluster = useCallback((id: string) => {
    setClusters(prev => prev.map(c =>
      c.id === id
        ? { ...c, selected: !c.selected, roles: [] }
        : c
    ));
  }, []);

  const setVehicleVariantFn = useCallback((id: string, variant: string) => {
    setClusters(prev => prev.map(c => c.id === id ? { ...c, vehicleVariant: variant } : c));
  }, []);

  const setWeaponVariantFn = useCallback((id: string, variant: string) => {
    setClusters(prev => prev.map(c => c.id === id ? { ...c, weaponVariant: variant } : c));
  }, []);

  const setRolesFn = useCallback((id: string, roles: string[]) => {
    setClusters(prev => prev.map(c => c.id === id ? { ...c, roles } : c));
  }, []);

  // ── Slave IOS ───────────────────────────────────────────────────────────────
  const addSlaveIOS = () =>
    setSlaveIOSList(prev => [...prev, { uid: Date.now(), value: "", forceSelection: "" }]);

  const updateSlaveIOS = (uid: number, value: string) =>
    setSlaveIOSList(prev => prev.map(s => s.uid === uid ? { ...s, value } : s));

  const updateSlaveForce = (uid: number, forceSelection: string) =>
    setSlaveIOSList(prev => prev.map(s => s.uid === uid ? { ...s, forceSelection } : s));

  const removeSlaveIOS = (uid: number) =>
    setSlaveIOSList(prev => prev.filter(s => s.uid !== uid));

  // ── Table columns ───────────────────────────────────────────────────────────
  const columns = useMemo<(ColumnDef<ClusterRow, any> & { minWidth?: string; maxWidth?: string; width?: string })[]>(() => [
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
        cell: ({ row }) => row.original.occupied ? null : (
          <button
            type="button"
            onClick={() => toggleCluster(row.original.id)}
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
      minWidth: "48px", maxWidth: "48px", width: "48px",
    },

    columnHelper.accessor("id", {
      header: () => "Cluster",
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
      id:     "vehicleVariant",
      header: () => "Vehicle Variant",
      cell:   ({ row }) => row.original.occupied ? (
        <span className="text-sm text-gray-400 italic">Occupied</span>
      ) : (
        <TableDropdown
          value={row.original.vehicleVariant}
          onChange={(v) => setVehicleVariantFn(row.original.id, v)}
          options={vehicleVariantOptions}
          placeholder="Vehicle Variant"
        />
      ),
    }),

    columnHelper.display({
      id:     "weaponVariant",
      header: () => "Weapon Variant",
      cell:   ({ row }) => row.original.occupied ? null : (
        <TableDropdown
          value={row.original.weaponVariant}
          onChange={(v) => setWeaponVariantFn(row.original.id, v)}
          options={weaponVariantOptions}
          placeholder="Weapon Variant"
        />
      ),
    }),

    columnHelper.display({
      id:     "role",
      header: () => "Role",
      cell:   ({ row }) => row.original.occupied ? null : (
        <MultiCheckboxTableDropdown
          selected={row.original.roles}
          onChange={(roles) => setRolesFn(row.original.id, roles)}
          options={ROLE_OPTIONS}
          placeholder="Assign role"
        />
      ),
    }),
  ], [allSelected, someSelected, toggleAll, toggleCluster, setVehicleVariantFn, setWeaponVariantFn, setRolesFn, vehicleVariantOptions, weaponVariantOptions]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">

      {/* Page header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Cluster Configuration{" "}
          <span className="font-normal text-gray-500 text-sm">
            ({selectedCount}/{targetCount} clusters selected)
          </span>
        </h2>
        <button
          type="button"
          className="px-4 py-2 text-sm font-semibold text-white bg-brand-primary rounded-lg hover:bg-brand-primary-hover transition-colors"
        >
          Mass Assign Assets
        </button>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-[1fr_420px] gap-4 items-start">

        {/* ── LEFT: Cluster table + pagination ───────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <TableCustom<ClusterRow>
            data={pagedClusters}
            columns={columns}
            autoScrollTable={true}
            actionSticky={false}
            classTheadTh="!px-4 !py-3 !text-xs"
            classTBodyTd="!px-4 !py-2.5 !h-auto"
            getRowClass={(row) => row.selected ? "bg-red-50" : ""}
          />
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={clusters.length}
          />
        </div>

        {/* ── RIGHT: IOS Configuration ────────────────────────── */}
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
              {slaveIOSList.map((slave) => (
                <div key={slave.uid} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Slave IOS <span className="text-brand-primary">*</span>
                    </label>
                    <PanelDropdown
                      value={slave.value}
                      onChange={(v) => updateSlaveIOS(slave.uid, v)}
                      options={slaveIOSOptions}
                      placeholder="Choose slave IOS"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Force Selection <span className="text-brand-primary">*</span>
                    </label>
                    <PanelDropdown
                      value={slave.forceSelection}
                      onChange={(v) => updateSlaveForce(slave.uid, v)}
                      options={FORCE_OPTIONS}
                      placeholder="Choose force selection"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlaveIOS(slave.uid)}
                    className="h-[42px] w-9 flex items-center justify-center text-brand-primary border border-brand-primary/30 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Slave IOS button */}
          <div className="border border-dashed border-gray-200 rounded-lg py-4 flex justify-center">
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
