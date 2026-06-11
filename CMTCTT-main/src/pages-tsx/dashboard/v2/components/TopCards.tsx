import { cn } from "@/lib/utils";
import { bookingTypeStats } from "../constants";
import type { BookingType } from "../types";

// ── Per-type colour tokens ─────────────────────────────────────────────────────

const TYPE_STYLE: Record<"CMT" | "SWT" | "CMT CTT", {
  badge: string; bar: string; accent: string; ongoing: string; upcoming: string; completed: string;
}> = {
  CMT: {
    badge:     "bg-red-50 text-brand-primary",
    bar:       "bg-brand-primary/20",
    accent:    "text-brand-primary",
    ongoing:   "bg-brand-primary",
    upcoming:  "bg-red-200",
    completed: "bg-emerald-300",
  },
  SWT: {
    badge:     "bg-blue-50 text-blue-600",
    bar:       "bg-blue-100",
    accent:    "text-blue-600",
    ongoing:   "bg-blue-400",
    upcoming:  "bg-blue-200",
    completed: "bg-emerald-300",
  },
  "CMT CTT": {
    badge:     "bg-violet-50 text-violet-600",
    bar:       "bg-violet-100",
    accent:    "text-violet-600",
    ongoing:   "bg-violet-400",
    upcoming:  "bg-violet-200",
    completed: "bg-emerald-300",
  },
};

interface Props {
  activeType: BookingType;
}

export function TopCards({ activeType }: Props) {
  const types = ["CMT", "SWT", "CMT CTT"] as const;

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {types.map((type) => {
        const stats  = bookingTypeStats[type];
        const style  = TYPE_STYLE[type];
        const isActive = activeType === "All" || activeType === type;
        const pctDone  = Math.round((stats.completed / stats.total) * 100);
        const pctOn    = Math.round((stats.ongoing   / stats.total) * 100);
        const pctUp    = 100 - pctDone - pctOn;

        return (
          <div
            key={type}
            className={cn(
              "bg-white rounded-xl border p-5 transition-all",
              isActive ? "border-gray-100 shadow-sm" : "border-gray-100 opacity-40",
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", style.badge)}>
                  {type}
                </span>
                <p className="text-[11px] text-gray-400 mt-1">{stats.desc}</p>
              </div>
              <span className={cn("text-2xl font-extrabold", style.accent)}>{stats.total}</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Ongoing",   value: stats.ongoing,   color: style.accent },
                { label: "Upcoming",  value: stats.upcoming,  color: "text-gray-500" },
                { label: "Completed", value: stats.completed, color: "text-emerald-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center bg-gray-50 rounded-lg py-2">
                  <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                  <p className={cn("text-xl font-bold", color)}>{value}</p>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden flex gap-px">
              <div className={cn("rounded-full", style.completed)} style={{ width: `${pctDone}%` }} />
              <div className={cn("rounded-full", style.ongoing)}   style={{ width: `${pctOn}%`  }} />
              <div className={cn("rounded-full", style.upcoming)}  style={{ width: `${pctUp}%`  }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5 text-right">{pctDone}% completed</p>
          </div>
        );
      })}
    </div>
  );
}
