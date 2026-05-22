import { cn } from "@/lib/utils";
import { aprilBookings, getMonthIntensity } from "../constants";
const START_DAY_OF_WEEK = 2; // April 2026 starts on Wednesday (0=Mon)
const DAYS_IN_MONTH = 30;
const TODAY = 30;
function buildCalendarWeeks() {
    const days = [
        ...Array(START_DAY_OF_WEEK).fill(null),
        ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
    ];
    while (days.length % 7 !== 0)
        days.push(null);
    const weeks = [];
    for (let i = 0; i < days.length; i += 7)
        weeks.push(days.slice(i, i + 7));
    return weeks;
}
const WEEKS = buildCalendarWeeks();
const WEEKEND_DAYS = [5, 6, 12, 13, 19, 20, 26];
export function MonthView() {
    const totalBookings = Object.values(aprilBookings).reduce((a, b) => a + b, 0);
    const weekendBookings = WEEKEND_DAYS.reduce((sum, d) => sum + (aprilBookings[d] ?? 0), 0);
    const weekdayBookings = totalBookings - weekendBookings;
    const busiest = Object.entries(aprilBookings).reduce((a, b) => (b[1] > a[1] ? b : a), ["0", 0]);
    const avg = (totalBookings / 30).toFixed(1);
    return (<div className="bg-white rounded-xl border border-red-50/80">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">April 2026</span>
          <span className="text-xs text-slate-400">{totalBookings} bookings · avg {avg}/day</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          {[
            { label: "Low", color: "bg-red-50" },
            { label: "Medium", color: "bg-red-100" },
            { label: "High", color: "bg-red-200" },
        ].map(({ label, color }) => (<div key={label} className="flex items-center gap-1.5">
              <div className={cn("w-3 h-3 rounded-sm border border-slate-200", color)}/>
              <span>{label}</span>
            </div>))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-5 gap-0 border-b border-slate-100">
        {[
            { label: "TOTAL BOOKINGS", value: totalBookings.toString(), color: "text-gray-700" },
            { label: "WEEKDAY", value: weekdayBookings.toString(), color: "text-red-400" },
            { label: "WEEKEND", value: weekendBookings.toString(), color: "text-orange-400" },
            { label: "BUSIEST DAY", value: `${busiest[0]} Apr (${busiest[1]})`, color: "text-amber-500" },
            { label: "AVG/DAY", value: avg, color: "text-red-500" },
        ].map(({ label, value, color }) => (<div key={label} className="px-5 py-4 border-r border-slate-100 last:border-r-0">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</div>
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
          </div>))}
      </div>

      {/* Calendar grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 mb-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (<div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>))}
        </div>
        {WEEKS.map((week, wi) => (<div key={wi} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((day, di) => {
                if (!day)
                    return <div key={di} className="h-20"/>;
                const count = aprilBookings[day] ?? 0;
                const isToday = day === TODAY;
                return (<div key={di} className={cn("h-20 rounded-lg p-2 border transition-colors cursor-pointer hover:opacity-80", getMonthIntensity(count), isToday ? "border-red-300 ring-1 ring-red-200" : "border-gray-100")}>
                  <div className="flex items-start justify-between">
                    <span className={cn("text-xs font-semibold", isToday ? "text-red-500" : "text-gray-500")}>
                      {day}
                      {isToday && <span className="ml-1 text-[9px] text-slate-400">TODAY</span>}
                    </span>
                  </div>
                  {count > 0 && (<div className="mt-auto pt-2">
                      <span className="text-[10px] text-slate-400">{count} bookings</span>
                    </div>)}
                </div>);
            })}
          </div>))}
      </div>

      {/* Insight bar */}
      <div className="mx-4 mb-4 px-4 py-2.5 bg-red-50/40 border border-red-100/60 rounded-lg">
        <span className="text-red-300 mr-2 text-xs">ℹ</span>
        <span className="text-xs text-gray-500">
          April peak: 9 Apr with 7 bookings. Weekend utilization at 32% — consider opening more weekend slots if demand exists.
        </span>
      </div>
    </div>);
}
