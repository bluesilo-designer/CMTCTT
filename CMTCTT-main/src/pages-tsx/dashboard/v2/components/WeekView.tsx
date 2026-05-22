import { useState } from "react";
import { cn } from "@/lib/utils";
import type { SessionType, BookingStatus } from "../types";
import {
  STATIONS,
  weekData,
  weekDailyCounts,
  sessionColors,
  statusDot,
  WEEK_DAYS,
  WEEK_DATES,
  TODAY_IDX,
} from "../constants";

export function WeekView() {
  const [activeFilters, setActiveFilters] = useState<SessionType[]>(["AM", "PM", "Full", "Hr", "Ad"]);

  const toggleFilter = (t: SessionType) =>
    setActiveFilters((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  return (
    <div className="bg-white rounded-xl border border-red-50/80">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Week Overview</span>
          <span className="text-xs text-slate-400">7–13 Apr 2026</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {(["Completed", "Ongoing", "Upcoming"] as BookingStatus[]).map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-2.5 h-2.5 rounded-sm",
                  s === "Completed" ? "bg-emerald-200" :
                  s === "Ongoing"   ? "bg-amber-200"   : "bg-sky-200"
                )}
              />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session type filter toggle buttons (tab-style, stay raw per IMT rules) */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100">
        {(["AM", "PM", "Full", "Hr", "Ad"] as SessionType[]).map((t) => {
          const c = sessionColors[t];
          const active = activeFilters.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleFilter(t)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                active ? `${c.bg} ${c.text} ${c.border}` : "bg-white text-slate-300 border-slate-200"
              )}
            >
              <div className={cn("w-2 h-2 rounded-full", active ? c.dot : "bg-slate-200")} />
              {t}
            </button>
          );
        })}
      </div>

      {/* Grid — raw table is intentional here: this is a bespoke schedule grid, not a data table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="w-24 px-4 py-2" />
              {WEEK_DAYS.map((day, i) => (
                <th key={day} className={cn("py-2 text-center", i === TODAY_IDX ? "bg-red-50/50" : "")}>
                  <div className={cn("text-xs font-medium", i === TODAY_IDX ? "text-red-500" : "text-gray-400")}>
                    {day} {WEEK_DATES[i]}
                  </div>
                  {i === TODAY_IDX && <div className="text-[10px] text-slate-400">Today</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STATIONS.map((station) => {
              const stationBookings = Object.values(weekData[station] ?? {}).flat().length;
              return (
                <tr key={station} className="border-t border-slate-50">
                  <td className="px-4 py-3 text-left">
                    <div className="text-xs font-bold text-slate-600">{station}</div>
                    <div className="text-[10px] text-slate-400">{stationBookings} bookings</div>
                  </td>
                  {WEEK_DAYS.map((day, di) => {
                    const cells = (weekData[station]?.[day] ?? []).filter((c) =>
                      activeFilters.includes(c.type)
                    );
                    return (
                      <td
                        key={day}
                        className={cn("px-1.5 py-2 align-top", di === TODAY_IDX ? "bg-red-50/30" : "")}
                      >
                        {cells.length === 0 ? (
                          <div className="h-8 flex items-center justify-center text-slate-200 text-xs">–</div>
                        ) : (
                          <div className="flex flex-col gap-1">
                            {cells.map((cell, ci) => {
                              const c = sessionColors[cell.type];
                              return (
                                <div
                                  key={ci}
                                  className={cn(
                                    "flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold border",
                                    c.bg, c.text, c.border
                                  )}
                                >
                                  <span>{cell.type}</span>
                                  <div className={cn("w-1.5 h-1.5 rounded-full ml-auto", statusDot[cell.status])} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="border-t border-slate-100 bg-slate-50/50">
              <td className="px-4 py-2 text-xs font-semibold text-slate-400">Daily</td>
              {weekDailyCounts.map((count, i) => (
                <td
                  key={i}
                  className={cn(
                    "py-2 text-center text-sm font-bold",
                    i === TODAY_IDX ? "bg-red-50 text-red-500" : "text-gray-600"
                  )}
                >
                  {count}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
