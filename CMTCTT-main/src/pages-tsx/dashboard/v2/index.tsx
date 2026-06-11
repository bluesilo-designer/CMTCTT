import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ViewMode, BookingType } from "./types";
import { TopCards } from "./components/TopCards";
import { TeamBar } from "./components/TeamBar";
import { WeekView } from "./components/WeekView";
import { DayView } from "./components/DayView";
import { MonthView } from "./components/MonthView";

const BOOKING_TYPES: { type: BookingType; label: string; desc: string }[] = [
  { type: "All",     label: "All",     desc: "All booking types" },
  { type: "CMT",     label: "CMT",     desc: "Combat Mission Trainer" },
  { type: "SWT",     label: "SWT",     desc: "Shooter Weapon Trainer" },
  { type: "CMT CTT", label: "CMT CTT", desc: "Combined Simulation" },
];

const TYPE_PILL: Record<BookingType, string> = {
  All:       "bg-gray-800   text-white",
  CMT:       "bg-brand-primary text-white",
  SWT:       "bg-blue-600    text-white",
  "CMT CTT": "bg-violet-600  text-white",
};

export function Dashboard2() {
  const [view,        setView]        = useState<ViewMode>("Week");
  const [bookingType, setBookingType] = useState<BookingType>("All");

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-4 md:p-6">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-semibold text-slate-600">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Booking & training overview</p>
          </div>
          {/* View toggle */}
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            {(["Day", "Week", "Month"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-5 py-2 text-sm font-semibold transition-colors",
                  view === v ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* ── Booking type filter ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-5">
          {BOOKING_TYPES.map(({ type, label, desc }) => {
            const active = bookingType === type;
            return (
              <button
                key={type}
                onClick={() => setBookingType(type)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
                  active
                    ? cn(TYPE_PILL[type], "border-transparent shadow-sm")
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                )}
              >
                {label}
                {!active && (
                  <span className="text-[10px] text-slate-400 font-normal">{desc}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Top stats cards (3 booking types) ──────────────────────────── */}
        <TopCards activeType={bookingType} />

        {/* ── Team bar ────────────────────────────────────────────────────── */}
        <TeamBar />

        {/* ── Schedule views ──────────────────────────────────────────────── */}
        {view === "Week"  && <WeekView bookingType={bookingType} />}
        {view === "Day"   && <DayView  />}
        {view === "Month" && <MonthView />}

      </div>
    </div>
  );
}
