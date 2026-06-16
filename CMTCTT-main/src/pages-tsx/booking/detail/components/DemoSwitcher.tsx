/**
 * DemoSwitcher — floating switchers for vibe-coding demos.
 *
 * DemoSwitcher:         toggle number of records shown (3 / 5 / 10 / 15).
 * BatchScenarioSwitcher: toggle CMT batch scenarios (1 / 2 / 3 batches).
 *
 * NOT production features — do not include in real booking flow requirements.
 */

import { cn } from "@/lib/utils";

export const DEMO_SIZES = [3, 5, 10, 15] as const;
export type  DemoSize   = typeof DEMO_SIZES[number];

export function DemoSwitcher({
  value,
  onChange,
}: {
  value:    DemoSize;
  onChange: (v: DemoSize) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full shadow-lg px-3 py-1.5 select-none">
      <span className="text-[10px] text-gray-400 font-medium mr-0.5">Show</span>
      {DEMO_SIZES.map(size => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-full transition-all",
            value === size
              ? "bg-brand-primary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

// ── Batch scenario switcher ────────────────────────────────────────────────────

export interface BatchScenarioDef {
  id:            string;
  label:         string;
  cabinCount:    number;
  rolesPerCabin: number;
  totalTrainees: number;
}

export const CMT_BATCH_SCENARIOS: BatchScenarioDef[] = [
  { id: "s1", label: "1 Batch",    cabinCount: 4,  rolesPerCabin: 3, totalTrainees: 12 },
  { id: "s2", label: "2 Batches",  cabinCount: 4,  rolesPerCabin: 3, totalTrainees: 24 },
  { id: "s3", label: "3 Batches",  cabinCount: 4,  rolesPerCabin: 3, totalTrainees: 30 },
  { id: "s4", label: "12 Cabins",  cabinCount: 12, rolesPerCabin: 3, totalTrainees: 120 },
  { id: "s5", label: "Worst Case", cabinCount: 12, rolesPerCabin: 5, totalTrainees: 65 },
];

export function BatchScenarioSwitcher({
  value,
  onChange,
}: {
  value:    string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-full shadow-lg px-3 py-1.5 select-none">
      <span className="text-[10px] text-gray-400 font-medium mr-1">Batch Demo</span>
      {CMT_BATCH_SCENARIOS.map(s => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          title={`${s.cabinCount} cabins × ${s.rolesPerCabin} roles = ${s.cabinCount * s.rolesPerCabin} capacity | ${s.totalTrainees} trainees`}
          className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-full transition-all",
            value === s.id
              ? "bg-brand-primary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
