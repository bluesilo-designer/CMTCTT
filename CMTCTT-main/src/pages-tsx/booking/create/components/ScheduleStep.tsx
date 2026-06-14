import { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomSelect } from "./CustomSelect";
import { TIME_OPTIONS } from "../constants";
import type { ScheduleType, ScheduleSection, ScheduleSnapshot } from "../types";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Mock already-booked dates per schedule type — stored as "YYYY-M-D" (month 0-indexed)
const BOOKED_DATES: Record<string, Set<string>> = {
  "AM/PM": new Set([
    "2025-0-7",  "2025-0-8",
    "2025-0-14", "2025-0-15",
    "2025-0-21",
    "2025-1-4",  "2025-1-5",
    "2025-1-11", "2025-1-12",
    "2025-1-18", "2025-1-19",
    "2025-2-5",  "2025-2-6",
    "2025-2-12", "2025-2-19",
  ]),
  "FullDay": new Set([
    "2025-0-10", "2025-0-17", "2025-0-24",
    "2025-1-7",  "2025-1-14", "2025-1-21",
    "2025-2-3",  "2025-2-10", "2025-2-17",
  ]),
  "Ad-hoc": new Set([
    "2025-1-5",  "2025-1-6",
    "2025-1-12", "2025-1-19",
    "2025-2-5",  "2025-2-6",
    "2025-2-12", "2025-2-19",
  ]),
};

function isBooked(year: number, month: number, day: number, scheduleType: ScheduleType) {
  if (!scheduleType) return false;
  return BOOKED_DATES[scheduleType]?.has(`${year}-${month}-${day}`) ?? false;
}

function buildCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { day: number; cur: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, cur: false });
  return cells;
}

function DateRangeCalendar({
  startDate, endDate, onSelectStart, onSelectEnd, scheduleType,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onSelectStart: (d: Date) => void;
  onSelectEnd: (d: Date) => void;
  scheduleType: ScheduleType;
}) {
  const [baseYear, setBaseYear] = useState(2025);
  const [baseMonth, setBaseMonth] = useState(0);

  const prev = () => { if (baseMonth === 0) { setBaseMonth(11); setBaseYear(baseYear - 1); } else setBaseMonth(baseMonth - 1); };
  const next = () => { if (baseMonth === 11) { setBaseMonth(0); setBaseYear(baseYear + 1); } else setBaseMonth(baseMonth + 1); };
  const second = baseMonth === 11 ? { month: 0, year: baseYear + 1 } : { month: baseMonth + 1, year: baseYear };

  const isInRange = (year: number, month: number, day: number) => {
    if (!startDate || !endDate) return false;
    const d = new Date(year, month, day);
    return d >= startDate && d <= endDate;
  };

  const renderMonth = (year: number, month: number) => (
    <div className="flex-1 min-w-0">
      <div className="text-sm font-semibold text-gray-700 text-center mb-3">{MONTH_NAMES[month]} {year}</div>
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d) => <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {buildCells(year, month).map((cell, i) => {
          const booked = cell.cur && isBooked(year, month, cell.day, scheduleType);
          const isStart = startDate && cell.cur && startDate.getFullYear() === year && startDate.getMonth() === month && startDate.getDate() === cell.day;
          const isEnd = endDate && cell.cur && endDate.getFullYear() === year && endDate.getMonth() === month && endDate.getDate() === cell.day;
          const inRange = cell.cur && isInRange(year, month, cell.day);
          return (
            <button key={i} type="button" disabled={!cell.cur || booked}
              title={booked ? "Already booked" : undefined}
              onClick={() => {
                if (!cell.cur || booked) return;
                const newDate = new Date(year, month, cell.day);
                if (startDate && endDate) { onSelectStart(newDate); onSelectEnd(null as any); }
                else if (startDate && !endDate) { if (newDate < startDate) { onSelectEnd(startDate); onSelectStart(newDate); } else { onSelectEnd(newDate); } }
                else { onSelectStart(newDate); }
              }}
              className={cn("text-center py-1.5 text-sm rounded-full mx-auto w-8 h-8 flex items-center justify-center transition-colors",
                !cell.cur ? "text-gray-300 cursor-default" :
                booked ? "text-gray-300 line-through cursor-not-allowed bg-gray-100" :
                isStart || isEnd ? "bg-brand-primary text-white font-semibold" :
                inRange ? "bg-brand-primary/20 text-gray-700" :
                "text-gray-700 hover:bg-red-50")}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={prev} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronLeft size={16} /></button>
      <div className="flex flex-1 gap-8">
        {renderMonth(baseYear, baseMonth)}
        <div className="w-px bg-gray-200 self-stretch" />
        {renderMonth(second.year, second.month)}
      </div>
      <button type="button" onClick={next} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronRight size={16} /></button>
    </div>
  );
}

function DualCalendar({ selected, onSelect, scheduleType }: { selected: Date | null; onSelect: (d: Date) => void; scheduleType: ScheduleType }) {
  const [baseYear, setBaseYear] = useState(2025);
  const [baseMonth, setBaseMonth] = useState(0);

  const prev = () => { if (baseMonth === 0) { setBaseMonth(11); setBaseYear(baseYear - 1); } else setBaseMonth(baseMonth - 1); };
  const next = () => { if (baseMonth === 11) { setBaseMonth(0); setBaseYear(baseYear + 1); } else setBaseMonth(baseMonth + 1); };
  const second = baseMonth === 11 ? { month: 0, year: baseYear + 1 } : { month: baseMonth + 1, year: baseYear };

  const renderMonth = (year: number, month: number) => (
    <div className="flex-1 min-w-0">
      <div className="text-sm font-semibold text-gray-700 text-center mb-3">{MONTH_NAMES[month]} {year}</div>
      <div className="grid grid-cols-7 mb-1">
        {DOW.map((d) => <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {buildCells(year, month).map((cell, i) => {
          const booked = cell.cur && isBooked(year, month, cell.day, scheduleType);
          const isSelected = selected && cell.cur && selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === cell.day;
          return (
            <button key={i} type="button" disabled={!cell.cur || booked}
              title={booked ? "Already booked" : undefined}
              onClick={() => { if (cell.cur && !booked) onSelect(new Date(year, month, cell.day)); }}
              className={cn("text-center py-1.5 text-sm rounded-full mx-auto w-8 h-8 flex items-center justify-center transition-colors",
                !cell.cur ? "text-gray-300 cursor-default" :
                booked ? "text-gray-300 line-through cursor-not-allowed bg-gray-100" :
                isSelected ? "bg-brand-primary text-white font-semibold" :
                "text-gray-700 hover:bg-red-50")}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={prev} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronLeft size={16} /></button>
      <div className="flex flex-1 gap-8">
        {renderMonth(baseYear, baseMonth)}
        <div className="w-px bg-gray-200 self-stretch" />
        {renderMonth(second.year, second.month)}
      </div>
      <button type="button" onClick={next} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronRight size={16} /></button>
    </div>
  );
}

export function ScheduleStep({ onUpdate }: { onUpdate?: (s: ScheduleSnapshot) => void }) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>(null);
  const [section, setSection] = useState<ScheduleSection>(null);
  const [briefing, setBriefing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [adHocStartDate, setAdHocStartDate] = useState<Date | null>(null);
  const [adHocEndDate, setAdHocEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const snapshot: ScheduleSnapshot = { scheduleType, section, briefing, selectedDate, startTime, endTime };
    if (scheduleType === "Ad-hoc") { snapshot.dateRangeStart = adHocStartDate; snapshot.dateRangeEnd = adHocEndDate; }
    onUpdate?.(snapshot);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleType, section, briefing, selectedDate, adHocStartDate, adHocEndDate, startTime, endTime]);

  const sectionOptions: Record<string, string[]> = {
    "AM/PM": ["AM Session", "PM Session"],
    "FullDay": ["Single Day", "Multiple Days"],
  };

  const scheduleOpts: { id: ScheduleType; label: string }[] = [
    { id: "AM/PM", label: "AM/PM Schedule" },
    { id: "FullDay", label: "Full Day Schedule" },
    { id: "Ad-hoc", label: "Ad-hoc Schedule" },
  ];

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-base font-semibold text-gray-800 text-center mb-6">Schedule</h2>
      <div className="flex gap-6">
        <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-5 space-y-5">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Schedule Selection <span className="text-red-500">*</span></div>
            <div className="space-y-2">
              {scheduleOpts.map(({ id, label }) => (
                <button key={id!} type="button"
                  onClick={() => { setScheduleType(id); setSection(null); }}
                  className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                    scheduleType === id ? "bg-brand-primary border-brand-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300")}>
                  <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    scheduleType === id ? "border-white" : "border-gray-300")}>
                    {scheduleType === id && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {scheduleType && scheduleType !== "Ad-hoc" && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-3">Schedule Section <span className="text-red-500">*</span></div>
              <div className="space-y-2">
                {sectionOptions[scheduleType].map((opt) => (
                  <button key={opt} type="button" onClick={() => setSection(opt)}
                    className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                      section === opt ? "bg-brand-primary border-brand-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300")}>
                    <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      section === opt ? "border-white" : "border-gray-300")}>
                      {section === opt && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Briefing Room <span className="text-red-500">*</span></div>
            <button type="button" onClick={() => setBriefing(!briefing)}
              className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                briefing ? "bg-brand-primary border-brand-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300")}>
              <span className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                briefing ? "bg-white border-white" : "border-gray-300")}>
                {briefing && <Check size={10} className="text-brand-primary" strokeWidth={3} />}
              </span>
              Briefing Room
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm font-medium text-gray-700 mb-4">Select Date Slot <span className="text-red-500">*</span></div>
          {scheduleType === "Ad-hoc" ? (
            <>
              <DateRangeCalendar
                startDate={adHocStartDate} endDate={adHocEndDate}
                onSelectStart={setAdHocStartDate} onSelectEnd={setAdHocEndDate}
                scheduleType={scheduleType}
              />
              <div className="flex gap-4 mt-5">
                <CustomSelect value={startTime} onChange={setStartTime} options={TIME_OPTIONS} placeholder="Select start time" className="flex-1" />
                <CustomSelect value={endTime} onChange={setEndTime} options={TIME_OPTIONS} placeholder="Select end time" className="flex-1" />
              </div>
            </>
          ) : (
            <DualCalendar selected={selectedDate} onSelect={setSelectedDate} scheduleType={scheduleType} />
          )}
        </div>
      </div>
    </div>
  );
}
