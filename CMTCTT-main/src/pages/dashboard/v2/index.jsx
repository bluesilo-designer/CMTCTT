import { useState } from "react";
import { cn } from "@/lib/utils";
import { TopCards } from "./components/TopCards";
import { TeamBar } from "./components/TeamBar";
import { WeekView } from "./components/WeekView";
import { DayView } from "./components/DayView";
import { MonthView } from "./components/MonthView";
export function Dashboard2() {
    const [view, setView] = useState("Week");
    return (<div className="flex-1 overflow-auto bg-slate-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-base font-semibold text-slate-600">Dashboard</h1>
            <p className="text-xs text-slate-400 mt-0.5">Booking & asset overview</p>
          </div>
          {/* View toggle — raw button group per IMT rules (tab/toggle stays raw) */}
          <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden">
            {["Day", "Week", "Month"].map((v) => (<button key={v} onClick={() => setView(v)} className={cn("px-5 py-2 text-sm font-semibold transition-colors", view === v ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-600")}>
                {v}
              </button>))}
          </div>
        </div>

        <TopCards />
        <TeamBar />

        {view === "Week" && <WeekView />}
        {view === "Day" && <DayView />}
        {view === "Month" && <MonthView />}
      </div>
    </div>);
}
