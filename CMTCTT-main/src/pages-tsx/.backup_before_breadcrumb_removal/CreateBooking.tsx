import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Search,
  Upload,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────────────
const STEPS = ["Booking Details", "Lane Configuration", "Nominal Roll", "Schedule"] as const;
type StepName = (typeof STEPS)[number];

const TRAINING_MODES = ["Marksmanship", "Simulation", "CQB", "Collective", "Judgmental"];
const COURSEWARES = [
  "ATP(M)", "ATP(SP)", "BTP", "CS(M)", "CS(SP)",
  "Q-Shoot", "Night Test for SAR21/M16 BTP", "Zeroing", "APS", "NCC",
];
const WEAPONS = ["M16", "SAR21", "LMG"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const TODAY = new Date(2026, 3, 23); // Apr 23 2026

// ── Helpers ──────────────────────────────────────────────────────────────────
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDisplayDate(key: string): string {
  if (!key) return "";
  const [y, m, d] = key.split("-").map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

function monIdx(dow: number): number {
  return dow === 0 ? 6 : dow - 1;
}

function getMonthWeeks(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const startOffset = monIdx(firstDay.getDay());
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastDay = new Date(year, month, daysInMonth);
  const lastMonIdx = monIdx(lastDay.getDay());
  const endOffset = lastMonIdx === 6 ? 0 : 6 - lastMonIdx;
  const totalCells = startOffset + daysInMonth + endOffset;
  const numWeeks = Math.ceil(totalCells / 7);

  const weeks: Date[][] = [];
  const cur = new Date(year, month, 1 - startOffset);
  for (let w = 0; w < numWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const TIME_OPTIONS = [
  "6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM",
];

// ── Shared small components ──────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0",
        on ? "bg-green-500" : "bg-gray-300"
      )}
    >
      <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow transition-transform", on ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}

function StepperConnector({ completed }: { completed: boolean }) {
  return (
    <div className="flex items-center">
      <span className={cn("text-[10px]", completed ? "text-brand-primary" : "text-gray-300")}>●</span>
      <div className={cn("w-10 border-t border-dashed", completed ? "border-brand-primary" : "border-gray-300")} />
      <span className={cn("text-[10px]", completed ? "text-brand-primary" : "text-gray-300")}>●</span>
    </div>
  );
}

function StepBadge({ step, index, currentStep }: { step: string; index: number; currentStep: number }) {
  const isActive = index === currentStep;
  const isCompleted = index < currentStep;
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 rounded", (isActive || isCompleted) && "border border-dashed border-brand-primary")}>
      {isCompleted ? (
        <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", isActive ? "border-brand-primary" : "border-gray-300")}>
          {isActive && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
        </div>
      )}
      <span className={cn("text-sm font-medium whitespace-nowrap", isActive || isCompleted ? "text-brand-primary" : "text-gray-400")}>{step}</span>
    </div>
  );
}

// ── Step 1: Booking Details ──────────────────────────────────────────────────
interface Step1State {
  trainingType: "Individual" | "Group";
  trainingMode: string;
  courseware: string;
  unitName: string;
  instructor: string;
  phone: string;
  weaponType: string;
  baseStations: number;
  cwOpen: boolean; tmOpen: boolean; wpOpen: boolean;
}

function BookingDetailsStep({ state, setState }: { state: Step1State; setState: (s: Step1State) => void }) {
  const set = (p: Partial<Step1State>) => setState({ ...state, ...p });
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">Booking Details</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-7">
        {/* Training Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Training Type <span className="text-brand-primary">*</span></label>
          <div className="grid grid-cols-2 gap-3">
            {(["Individual", "Group"] as const).map((t) => (
              <button key={t} type="button" onClick={() => set({ trainingType: t })}
                className={cn("flex items-center gap-2 px-4 py-3 rounded border-2 text-sm font-medium transition-colors",
                  state.trainingType === t ? "bg-brand-primary border-brand-primary text-white" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0", state.trainingType === t ? "border-white" : "border-gray-400")}>
                  {state.trainingType === t && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                {t}
              </button>
            ))}
          </div>
        </div>
        {/* Training Mode + Courseware */}
        <div className="grid grid-cols-2 gap-5">
          {[
            { label: "Training Mode", key: "trainingMode" as const, open: "tmOpen" as const, options: TRAINING_MODES, placeholder: "Select training mode" },
            { label: "Courseware", key: "courseware" as const, open: "cwOpen" as const, options: COURSEWARES, placeholder: "Select courseware" },
          ].map(({ label, key, open, options, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{label} <span className="text-brand-primary">*</span></label>
              <div className="relative">
                <button type="button" onClick={() => set({ [open]: !state[open], cwOpen: false, tmOpen: false, wpOpen: false } as any)}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white hover:border-gray-300">
                  <span className={state[key] ? "text-gray-800" : "text-gray-400"}>{state[key] || placeholder}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                {state[open] && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {options.map((o) => (
                      <button key={o} type="button" onClick={() => set({ [key]: o, [open]: false } as any)}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{o}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Unit Name + Instructor */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Name <span className="text-brand-primary">*</span></label>
            <input type="text" placeholder="Enter unit name" value={state.unitName} onChange={(e) => set({ unitName: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor <span className="text-brand-primary">*</span></label>
            <input type="text" placeholder="Enter instructor name" value={state.instructor} onChange={(e) => set({ instructor: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder-gray-400" />
          </div>
        </div>
        {/* Contact + Weapon */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Contact Details</label>
            <div className="flex border border-gray-200 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-brand-primary">
              <span className="px-3 py-2.5 bg-gray-50 text-sm text-gray-600 border-r border-gray-200 flex-shrink-0">+65</span>
              <input type="tel" placeholder="Enter phone number" value={state.phone} onChange={(e) => set({ phone: e.target.value })}
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none placeholder-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Weapon Type(s) <span className="text-brand-primary">*</span></label>
            <div className="relative">
              <button type="button" onClick={() => set({ wpOpen: !state.wpOpen, tmOpen: false, cwOpen: false })}
                className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white hover:border-gray-300">
                <span className={state.weaponType ? "text-gray-800" : "text-gray-400"}>{state.weaponType || "Select weapon type"}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {state.wpOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {WEAPONS.map((w) => (
                    <button key={w} type="button" onClick={() => set({ weaponType: w, wpOpen: false })}
                      className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{w}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Base Stations */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Base Station(s) <span className="text-brand-primary">*</span></label>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
            <span className="flex-1 px-4 py-2.5 text-sm text-gray-800">{state.baseStations}</span>
            <div className="flex border-l border-gray-200">
              <button type="button" onClick={() => set({ baseStations: Math.max(1, state.baseStations - 1) })} className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 border-r border-gray-200">
                <span className="text-lg leading-none">−</span>
              </button>
              <button type="button" onClick={() => set({ baseStations: state.baseStations + 1 })} className="px-3 py-2.5 text-gray-500 hover:bg-gray-50">
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Lane Configuration ───────────────────────────────────────────────
interface LaneConfig { weaponType: string; status: boolean; dropdownOpen: boolean; }

function LaneConfigStep({ baseStations, courseware, lanes, setLanes, selectedCW, setSelectedCW, cwOpen, setCwOpen, weaponType, trainingMode }:
  { baseStations: number; courseware: string; lanes: LaneConfig[]; setLanes: (l: LaneConfig[]) => void;
    selectedCW: string; setSelectedCW: (s: string) => void; cwOpen: boolean; setCwOpen: (b: boolean) => void;
    weaponType?: string; trainingMode?: string; }) {

  const updateLane = (i: number, p: Partial<LaneConfig>) => setLanes(lanes.map((l, idx) => idx === i ? { ...l, ...p } : l));
  const displayCW = selectedCW || courseware || "Select courseware";

  // Define which lanes should be auto-closed for Collective and Judgmental
  const isAutoClosing = trainingMode === "Collective" || trainingMode === "Judgmental";
  const autoClosedLanes = new Set([3, 7, 11, 15]); // 0-indexed: lanes 4, 8, 12, 16 (every 4th lane)

  return (
    <div className="py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Lane Configuration <span className="font-normal text-gray-500">({baseStations} Base Station)</span></h2>
        <button type="button" className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary-hover">
          <Plus size={15} />Mass Assign
        </button>
      </div>
      <div className="relative w-60 mb-6">
        <button type="button" onClick={() => setCwOpen(!cwOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-white hover:border-gray-300">
          <span className="text-gray-800 truncate">{displayCW}</span>
          <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
        </button>
        {cwOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {COURSEWARES.map((c) => (
              <button key={c} type="button" onClick={() => { setSelectedCW(c); setCwOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{c}</button>
            ))}
          </div>
        )}
      </div>
      {Array.from({ length: baseStations }).map((_, bIdx) => {
        const startLane = bIdx * 10;
        const bsLanes = lanes.slice(startLane, startLane + 10);
        return (
          <div key={bIdx} className="border border-gray-200 rounded-lg mb-5">
            <div className="px-5 py-3 font-semibold text-gray-700 text-sm border-b border-gray-100">
              Base Station {bIdx + 1} ({displayCW}) (10/10) Lanes
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-28">Lane</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Weapon Type</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-brand-primary w-32">Status</th>
                </tr>
              </thead>
              <tbody>
                {bsLanes.map((lane, li) => {
                  const gi = startLane + li;
                  const isClosed = isAutoClosing && autoClosedLanes.has(gi);
                  const isOff = !lane.status; // Lane is Off/disabled
                  const isDisabled = isClosed || isOff;
                  const displayWeapon = lane.weaponType || (weaponType && !isDisabled ? weaponType : "-");

                  return (
                    <tr key={li} className={cn("border-b border-gray-50 last:border-b-0", isDisabled && "bg-gray-50")}>
                      <td className="px-5 py-3 text-sm text-gray-700">Lane {li + 1}</td>
                      <td className="px-5 py-3 text-sm text-gray-700 relative">
                        <div className="flex items-center justify-between">
                          <span className={isDisabled ? "text-gray-400" : ""}>{displayWeapon}</span>
                          {!isDisabled && (
                            <button type="button" onClick={() => updateLane(gi, { dropdownOpen: !lane.dropdownOpen })} className="text-gray-400 hover:text-gray-600">
                              {lane.dropdownOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </button>
                          )}
                        </div>
                        {lane.dropdownOpen && !isDisabled && (
                          <div className="absolute z-10 left-4 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                            <button type="button" onClick={() => updateLane(gi, { weaponType: "", dropdownOpen: false })}
                              className="w-full text-left px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50">-</button>
                            {WEAPONS.map((w) => (
                              <button key={w} type="button" onClick={() => updateLane(gi, { weaponType: w, dropdownOpen: false })}
                                className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{w}</button>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isClosed ? (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Closed</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <Toggle on={lane.status} onChange={() => updateLane(gi, { status: !lane.status })} />
                            <span className="text-sm text-gray-600 w-5">{lane.status ? "On" : "Off"}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

// ── Step 3: Nominal Roll ─────────────────────────────────────────────────────
function NominalRollStep() {
  return (
    <div className="py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Nominal Roll <span className="font-normal text-gray-500">(0 Trainees)</span></h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" className="pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
          </div>
          <button type="button" className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50">
            <Upload size={15} />Upload List
          </button>
          <button type="button" className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary-hover">
            <Plus size={15} />Add Trainee
          </button>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-50 border-b border-gray-100">
              {["No","Rank","Name","NRIC","Platoon Number","Weapon Type(s)","Last Updated On"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">{h}</th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="border border-dashed border-gray-300 m-3 rounded-lg py-14 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ClipboardList size={22} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">No Trainee(s) to show right now!</p>
            <p className="text-xs text-gray-400 mt-1">Clicks on " Upload List" or " Add Trainee(s)" to create a nominal roll in the system.</p>
          </div>
          <button type="button" className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary-hover">
            <Plus size={15} />Add Trainee
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Step 4: Schedule ─────────────────────────────────────────────────────────
const DAY_ABBREVS_MON = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface TimeDropdownProps { value: string; onChange: (v: string) => void; open: boolean; onToggle: () => void; }
function TimeDropdown({ value, onChange, open, onToggle }: TimeDropdownProps) {
  return (
    <div className="relative flex-1">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-sm bg-white hover:border-gray-300">
        <Clock size={14} className="text-brand-primary flex-shrink-0" />
        <span className="flex-1 text-left text-gray-700">{value || "Select time"}</span>
        <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
          {TIME_OPTIONS.map((t) => (
            <button key={t} type="button" onClick={() => onChange(t)}
              className={cn("w-full text-left px-3 py-2 text-sm hover:bg-gray-50", t === value && "text-brand-primary font-medium")}>{t}</button>
          ))}
        </div>
      )}
    </div>
  );
}

interface Step4State {
  scheduleType: "Fixed Schedule" | "Ad-hoc Schedule";
  selectedDate: string;
  startTime: string;
  endTime: string;
  startOpen: boolean;
  endOpen: boolean;
  briefingRooms: Set<string>;
  calLeftYear: number;
  calLeftMonth: number;
  fixedDate: string;
  fixedTimeSlot: string;
  fixedTimeOpen: boolean;
}

function ScheduleStep({ state, setState }: { state: Step4State; setState: (s: Step4State) => void }) {
  const set = (p: Partial<Step4State>) => setState({ ...state, ...p });

  const rightMonth = state.calLeftMonth === 11 ? 0 : state.calLeftMonth + 1;
  const rightYear = state.calLeftMonth === 11 ? state.calLeftYear + 1 : state.calLeftYear;

  const navPrev = () => {
    if (state.calLeftMonth === 0) set({ calLeftMonth: 11, calLeftYear: state.calLeftYear - 1 });
    else set({ calLeftMonth: state.calLeftMonth - 1 });
  };
  const navNext = () => {
    if (state.calLeftMonth === 11) set({ calLeftMonth: 0, calLeftYear: state.calLeftYear + 1 });
    else set({ calLeftMonth: state.calLeftMonth + 1 });
  };

  const todayKey = dateKey(TODAY);

  function renderMonthGrid(year: number, month: number) {
    const weeks = getMonthWeeks(year, month);
    return (
      <div className="flex-1 min-w-0">
        <p className="text-center text-sm font-semibold text-gray-700 mb-3">{MONTH_NAMES[month]} {year}</p>
        <div className="grid grid-cols-7 mb-1">
          {DAY_ABBREVS_MON.map((d) => (
            <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const inMonth = day.getMonth() === month;
              const dKey = dateKey(day);
              const isPast = day < new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
              const isToday = dKey === todayKey;
              const isSelected = dKey === state.selectedDate;
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div key={di} className="flex items-center justify-center py-0.5">
                  <button
                    type="button"
                    disabled={!inMonth || isPast}
                    onClick={() => inMonth && !isPast && set({ selectedDate: dKey })}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors",
                      !inMonth && "text-gray-200 cursor-default",
                      inMonth && isPast && "text-gray-300 cursor-not-allowed",
                      inMonth && !isPast && !isSelected && !isToday && !isWeekend && "text-gray-800 hover:bg-gray-100 font-medium",
                      inMonth && !isPast && isWeekend && !isSelected && !isToday && "text-brand-primary hover:bg-red-50 font-medium",
                      isToday && !isSelected && "bg-gray-400 text-white font-medium",
                      isSelected && "bg-brand-primary text-white font-medium",
                    )}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  const toggleBriefing = (room: string) => {
    const next = new Set(state.briefingRooms);
    if (next.has(room)) next.delete(room); else next.add(room);
    set({ briefingRooms: next });
  };

  return (
    <div className="py-8 px-8">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-8">Schedule</h2>
      <div className="flex gap-6">
        {/* Left panel */}
        <div className="w-80 flex-shrink-0 space-y-8">
          {/* Schedule Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Schedule Selection <span className="text-brand-primary">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(["Fixed Schedule", "Ad-hoc Schedule"] as const).map((t) => (
                <button key={t} type="button" onClick={() => set({ scheduleType: t })}
                  className={cn("flex items-center gap-2 px-3 py-3 rounded border-2 text-sm font-medium transition-colors",
                    state.scheduleType === t ? "bg-brand-primary border-brand-primary text-white" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                  <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0", state.scheduleType === t ? "border-white" : "border-gray-400")}>
                    {state.scheduleType === t && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-xs">{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Briefing Room */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Briefing Room</label>
            <div className="grid grid-cols-2 gap-3">
              {["Briefing Room 1", "Briefing Room 2"].map((room) => (
                <button key={room} type="button" onClick={() => toggleBriefing(room)}
                  className={cn("flex items-center gap-2 px-3 py-3 rounded border-2 text-sm font-medium transition-colors text-left",
                    state.briefingRooms.has(room) ? "border-brand-primary text-brand-primary bg-red-50" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                  <div className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                    state.briefingRooms.has(room) ? "bg-brand-primary border-brand-primary" : "border-gray-400")}>
                    {state.briefingRooms.has(room) && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-xs">{room}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0">
          {state.scheduleType === "Ad-hoc Schedule" ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Select Date Slot <span className="text-brand-primary">*</span></label>
              <div className="border border-gray-200 rounded-lg bg-white">
                {/* Calendar header + grids */}
                <div className="flex items-start gap-4 px-4 pt-4 pb-2">
                  <button type="button" onClick={navPrev} className="p-1.5 rounded hover:bg-gray-100 mt-5 flex-shrink-0">
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  {renderMonthGrid(state.calLeftYear, state.calLeftMonth)}
                  <div className="w-px self-stretch bg-gray-100 mx-2" />
                  {renderMonthGrid(rightYear, rightMonth)}
                  <button type="button" onClick={navNext} className="p-1.5 rounded hover:bg-gray-100 mt-5 flex-shrink-0">
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>
                {/* Time pickers */}
                <div className="border-t border-gray-100 px-4 py-3 flex gap-4">
                  <TimeDropdown
                    value={state.startTime}
                    onChange={(v) => set({ startTime: v, startOpen: false })}
                    open={state.startOpen}
                    onToggle={() => set({ startOpen: !state.startOpen, endOpen: false })}
                  />
                  <TimeDropdown
                    value={state.endTime}
                    onChange={(v) => set({ endTime: v, endOpen: false })}
                    open={state.endOpen}
                    onToggle={() => set({ endOpen: !state.endOpen, startOpen: false })}
                  />
                </div>
              </div>
              {state.selectedDate && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: <span className="font-medium text-gray-700">{formatDisplayDate(state.selectedDate)}</span>
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Schedule Section <span className="text-brand-primary">*</span></label>
              <div className="flex items-center gap-3 border border-gray-200 rounded-md px-4 py-2.5 bg-white">
                <span className="text-sm text-gray-500 whitespace-nowrap">Courseware 1</span>
                <div className="w-px h-5 bg-gray-200" />
                <input type="text" placeholder="Select date" value={state.fixedDate} onChange={(e) => set({ fixedDate: e.target.value })}
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 focus:outline-none" />
                <div className="w-px h-5 bg-gray-200" />
                <div className="relative flex-1">
                  <button type="button" onClick={() => set({ fixedTimeOpen: !state.fixedTimeOpen })}
                    className="w-full flex items-center justify-between text-sm text-gray-400">
                    <span className={state.fixedTimeSlot ? "text-gray-800" : ""}>{state.fixedTimeSlot || "Select time slot"}</span>
                    <ChevronDown size={15} className="text-gray-400" />
                  </button>
                  {state.fixedTimeOpen && (
                    <div className="absolute z-10 right-0 mt-2 w-72 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {["08:00 AM - 12:00 PM (AM Session)", "01:00 PM - 05:00 PM (PM Session)", "06:00 PM - 10:00 PM (Night Session)"].map((ts) => (
                        <button key={ts} type="button" onClick={() => set({ fixedTimeSlot: ts, fixedTimeOpen: false })}
                          className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">{ts}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Review Modal ─────────────────────────────────────────────────────────────
interface ReviewModalProps {
  step1: Step1State;
  step4: Step4State;
  step2CW: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ReviewModal({ step1, step4, step2CW, onCancel, onConfirm }: ReviewModalProps) {
  const courseware = step2CW || step1.courseware || "—";
  const trainingDate = step4.selectedDate ? formatDisplayDate(step4.selectedDate) : (step4.fixedDate || "—");
  const trainingTime = step4.selectedDate
    ? `(${step4.selectedDate.slice(5, 10).split("-").reverse().join(" ")}) ${step4.startTime || "—"} - (${step4.selectedDate.slice(5, 10).split("-").reverse().join(" ")}) ${step4.endTime || "—"}`
    : step4.fixedTimeSlot || "—";
  const briefingRooms = [...step4.briefingRooms].join(", ") || "—";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <FileText size={22} className="text-brand-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Review Your Booking Details</h3>
            <p className="text-sm text-gray-500 mt-0.5">Please verify the information below before confirming your booking.</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 grid grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-1">
            {/* Total Trainee */}
            <div className="flex justify-between py-2.5">
              <span className="text-sm text-gray-500">Total Trainee</span>
              <span className="text-sm font-bold text-gray-800">0 Trainee(s)</span>
            </div>
            <div className="border-t border-gray-100 pt-2 space-y-1">
              {[
                ["Training Type", step1.trainingType],
                ["Training Mode", step1.trainingMode || "—"],
                ["Weapon Type", step1.weaponType || "—"],
                ["Instructor", step1.instructor || "—"],
                ["Unit Contact Details", step1.phone ? `+65 ${step1.phone}` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-bold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-2 space-y-1">
              {[
                ["Training Schedule", step4.scheduleType],
                ["Training Date", trainingDate],
                ["Training Time", trainingTime],
                ["Briefing Room", briefingRooms],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-bold text-gray-800 text-right max-w-[60%]">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-1">
            <div className="bg-gray-50 rounded-lg p-4 space-y-1">
              {[
                ["Base Station(s)", String(step1.baseStations)],
                ["Detail(s)", "—"],
                ["Courseware(s)", courseware],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5">
                  <span className="text-sm text-gray-500">{k}</span>
                  <span className="text-sm font-bold text-gray-800 text-right">{v}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <p className="text-sm font-semibold text-gray-700 mb-3">Lane Configuration</p>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">{courseware}</span>
                <span className="text-sm font-semibold text-green-600">Assigned</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="px-8 pb-4">
          <p className="text-xs text-gray-400">Ensure you arrive 15 minutes before the scheduled time. You must bring your identity card and any required equipment.</p>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel}
            className="py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={onConfirm}
            className="py-3 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
          <Check size={28} className="text-green-500" strokeWidth={2.5} />
        </div>
        <p className="text-lg font-bold text-gray-800 text-center">Your booking for the training is confirmed.</p>
        <button type="button" onClick={onClose}
          className="w-full py-3 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">
          Back to Booking List
        </button>
      </div>
    </div>
  );
}

// ── Main CreateBooking ───────────────────────────────────────────────────────
export function CreateBooking({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [step1, setStep1] = useState<Step1State>({
    trainingType: "Group", trainingMode: "", courseware: "", unitName: "",
    instructor: "", phone: "", weaponType: "", baseStations: 1,
    cwOpen: false, tmOpen: false, wpOpen: false,
  });

  const [lanes, setLanes] = useState<LaneConfig[]>(
    Array.from({ length: 30 }, () => ({ weaponType: "", status: true, dropdownOpen: false }))
  );
  const [step2CW, setStep2CW] = useState("");
  const [step2CWOpen, setStep2CWOpen] = useState(false);

  const [step4, setStep4] = useState<Step4State>({
    scheduleType: "Fixed Schedule", selectedDate: "", startTime: "8:00 AM", endTime: "10:00 AM",
    startOpen: false, endOpen: false, briefingRooms: new Set(),
    calLeftYear: 2026, calLeftMonth: 3,
    fixedDate: "", fixedTimeSlot: "", fixedTimeOpen: false,
  });

  const isLastStep = currentStep === STEPS.length - 1;

  // Auto-populate lanes with selected weapon when entering Step 2 (Lane Configuration)
  // But preserve any manually edited lanes
  const goNext = () => {
    if (currentStep === 0 && step1.weaponType) {
      // When moving from Step 1 to Step 2, populate empty lanes with selected weapon
      const updatedLanes = lanes.map((lane) =>
        lane.weaponType ? lane : { ...lane, weaponType: step1.weaponType }
      );
      setLanes(updatedLanes);
    }
    if (!isLastStep) setCurrentStep((s) => s + 1);
    else setShowReview(true);
  };
  const goBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-white z-40 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center px-8 py-5 border-b border-gray-200 flex-shrink-0">
          <div className="w-48 flex-shrink-0">
            <button type="button" onClick={goBack}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 font-medium">
              <ArrowLeft size={15} />Back
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-1">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center">
                <StepBadge step={step} index={i} currentStep={currentStep} />
                {i < STEPS.length - 1 && <StepperConnector completed={i < currentStep} />}
              </div>
            ))}
          </div>
          <div className="w-48 flex-shrink-0 flex justify-end">
            <button type="button" onClick={goNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary-hover">
              {isLastStep ? (<><FileText size={15} />Confirm Booking</>) : (<>Next<ArrowRight size={15} /></>)}
            </button>
          </div>
        </div>

        {/* Subtitle bar */}
        <div className="px-8 pt-5 pb-1 flex-shrink-0">
          <h1 className="text-base font-bold text-gray-800">Book Your IMT Training Program</h1>
          <p className="text-sm text-gray-500 mt-0.5">Follow the steps below to complete your training booking.</p>
        </div>
        <div className="border-b border-gray-200 mx-8 mt-4" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {currentStep === 0 && <BookingDetailsStep state={step1} setState={setStep1} />}
          {currentStep === 1 && (
            <LaneConfigStep baseStations={step1.baseStations} courseware={step1.courseware}
              lanes={lanes} setLanes={setLanes} selectedCW={step2CW} setSelectedCW={setStep2CW}
              cwOpen={step2CWOpen} setCwOpen={setStep2CWOpen}
              weaponType={step1.weaponType} trainingMode={step1.trainingMode} />
          )}
          {currentStep === 2 && <NominalRollStep />}
          {currentStep === 3 && <ScheduleStep state={step4} setState={setStep4} />}
        </div>
      </div>

      {showReview && (
        <ReviewModal
          step1={step1} step4={step4} step2CW={step2CW}
          onCancel={() => setShowReview(false)}
          onConfirm={() => { setShowReview(false); setShowSuccess(true); }}
        />
      )}

      {showSuccess && <SuccessModal onClose={onClose} />}
    </>
  );
}
