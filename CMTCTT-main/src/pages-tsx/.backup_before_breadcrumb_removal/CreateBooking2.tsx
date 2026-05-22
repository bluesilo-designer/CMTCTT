import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Users, Check, AlertCircle, Search, Upload, Plus, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────
type SessionType = "Standalone" | "Integrated";
type ProgramType = "SWT" | "CMT" | "CTT" | null;
type TrainingType = "Individual" | "Group" | null;
type DryRun = "Yes" | "No" | null;
interface WeaponItem { id: string; label: string; qty: number; selected: boolean; }

const PROGRAMS = [
  { id: "SWT" as const, title: "Specialised Weapon Trainer (SWT)", desc: "Focused on mastering advanced weapon handling and operations.", bg: "from-gray-900 via-gray-700 to-gray-800" },
  { id: "CMT" as const, title: "Company Tactical Mission Trainer (CMT)", desc: "Enhances team tactical skills through mission simulations.", bg: "from-gray-800 via-gray-600 to-gray-700" },
  { id: "CTT" as const, title: "Command Team Trainer (CTT)", desc: "Strengthens leadership in strategic planning and operations.", bg: "from-gray-900 via-gray-700 to-gray-600" },
];

const STEPS = ["Booking Details", "Lane Configuration", "Nominal Roll", "Schedule"];
const TRAINING_MODES = ["Marksmanship", "Collective", "Judgemental"];
const WEAPON_OPTIONS: WeaponItem[] = [
  { id: "SAR21", label: "SAR21", qty: 0, selected: false },
  { id: "LMG",   label: "LMG",   qty: 0, selected: false },
  { id: "M203",  label: "M203",  qty: 0, selected: false },
  { id: "GPMG",  label: "GPMG",  qty: 0, selected: false },
  { id: "M110",  label: "M110",  qty: 0, selected: false },
];
const LANE_COUNT = 15;
const OCCUPIED_LANES = [4, 11, 15]; // 1-based

const NOMINAL_ROLL_DATA = [
  { rank: "CPT", name: "Ken Chow",        nric: "****212A", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "MAJ", name: "Wayang King",     nric: "****212B", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "LTA", name: "Tan Wei Liang",   nric: "****212C", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "LTC", name: "Muthu Mohammad",  nric: "****212D", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "COL", name: "Liao Kang Chai",  nric: "****212E", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "LTA", name: "Ismail Iskandar", nric: "****212F", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "CPT", name: "Lee Yep",         nric: "****212G", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "MAJ", name: "Chun Xiong",      nric: "****212H", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "SLTC",name: "Halim Lim",       nric: "****212I", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "LTC", name: "Liang Zhi Qiang", nric: "****212J", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "CPT", name: "Ahmad Rizal",     nric: "****212K", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "MAJ", name: "David Tan",       nric: "****212L", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "LTA", name: "Ravi Kumar",      nric: "****212M", platoon: "Platoon 1", weapon: "SAR21" },
  { rank: "CPT", name: "Jason Lim",       nric: "****212N", platoon: "Platoon 2", weapon: "SAR21" },
  { rank: "LTC", name: "Mohamed Ali",     nric: "****212O", platoon: "Platoon 1", weapon: "SAR21" },
  ...Array.from({ length: 17 }, (_, i) => ({
    rank: "CPT", name: `Trainee ${i + 16}`, nric: `****2${i + 10}Z`, platoon: `Platoon ${(i % 2) + 1}`, weapon: "SAR21",
  })),
];

const PER_PAGE = 10;

// ── Shared: Custom Dropdown ───────────────────────────────────────────────────
function CustomSelect({ value, onChange, options, placeholder, className }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder: string; className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" onClick={() => setOpen(!open)}
        className={cn("w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white transition-colors",
          open ? "border-brand-primary" : "border-gray-200 hover:border-gray-300",
          value ? "text-gray-800" : "text-gray-400")}>
        <span>{value || placeholder}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <span>{opt}</span>
              {value === opt && <Check size={14} className="text-brand-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared: Lane Toggle ───────────────────────────────────────────────────────
function LaneToggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onChange} disabled={disabled}
      className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
        disabled ? "bg-gray-200 cursor-not-allowed" : on ? "bg-green-500" : "bg-red-400")}>
      <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
        on ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

// ── Shared: Stepper ───────────────────────────────────────────────────────────
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => {
        const isActive = idx === current;
        const isDone = idx < current;
        return (
          <div key={step} className="flex items-center">
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium",
              isActive || isDone ? "border-brand-primary border-dashed text-brand-primary" : "border-dashed border-gray-300 text-gray-400")}>
              <span className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                isActive ? "border-brand-primary" : isDone ? "border-brand-primary bg-brand-primary" : "border-gray-300")}>
                {isActive && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                {isDone && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              {step}
            </div>
            {idx < STEPS.length - 1 && (
              <div className="flex items-center gap-0.5 mx-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                <div className="w-10 border-t-2 border-dashed border-brand-primary/40" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── TopBar ────────────────────────────────────────────────────────────────────
function TopBar({ onBack, programLabel, sessionType }: {
  onBack: () => void;
  programLabel?: string;
  sessionType?: SessionType;
}) {
  return (
    <div className="h-14 border-b border-gray-200 relative flex items-center px-6 bg-white flex-shrink-0">
      {/* Left — back button */}
      <button type="button" onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 flex-shrink-0 z-10">
        <ArrowLeft size={18} />
      </button>

      {/* Center — absolutely centered so it stays true-center regardless of sidebar widths */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {programLabel ? (
          <>
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              Book Your {programLabel} Training Program
            </span>
            {sessionType && (
              <span className="text-[10px] text-gray-400 mt-0.5 leading-none">
                {sessionType} Session
              </span>
            )}
          </>
        ) : (
          <span className="text-sm font-semibold text-gray-800">Create New Booking</span>
        )}
      </div>

      {/* Right — date + user, pushed to right edge */}
      <div className="ml-auto flex items-center gap-3 text-sm text-gray-500 flex-shrink-0 z-10">
        <span>Thursday, 05 December 2024&nbsp;&nbsp;01:03:33 PM</span>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-semibold">OR</div>
          <div className="leading-tight">
            <div className="text-xs font-medium text-gray-800">Olivia Rhye</div>
            <div className="text-[10px] text-gray-400">Admin</div>
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

// ── Program Selection ─────────────────────────────────────────────────────────
function ProgramSelection({ sessionType, setSessionType, onSelect }: {
  sessionType: SessionType; setSessionType: (t: SessionType) => void; onSelect: (p: ProgramType) => void;
}) {
  const [hovered, setHovered] = useState<ProgramType>(null);
  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex flex-col items-center py-10 px-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Create New Booking</h1>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-xl">
        Choose your desired Training program to proceed. Click on a card below to explore its details and continue the setup process.
      </p>
      <div className="flex rounded-full overflow-hidden border border-gray-200 bg-white mb-10 shadow-sm">
        {(["Standalone", "Integrated"] as SessionType[]).map((type) => (
          <button key={type} type="button" onClick={() => setSessionType(type)}
            className={cn("flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors",
              sessionType === type ? "bg-brand-primary text-white" : "text-gray-600 hover:bg-gray-50")}>
            <Users size={15} />{type}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        {PROGRAMS.map((prog) => {
          const isHovered = hovered === prog.id;
          return (
            <div key={prog.id}
              className={cn("relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 h-[480px]",
                isHovered ? "ring-4 ring-brand-primary shadow-xl" : "shadow-md")}
              onMouseEnter={() => setHovered(prog.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(prog.id)}>
              <div className={cn("absolute inset-0 bg-gradient-to-b", prog.bg, isHovered && "opacity-70")} />
              {isHovered && <div className="absolute inset-0 bg-brand-primary/30" />}
              <div className={cn("absolute left-0 right-0 px-6 transition-all duration-200", isHovered ? "bottom-20" : "bottom-6")}>
                <h3 className="text-white font-semibold text-lg leading-snug mb-1">{prog.title}</h3>
                <p className="text-white/70 text-sm">{prog.desc}</p>
              </div>
              {isHovered && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <div className="w-11 h-11 rounded-full bg-brand-primary flex items-center justify-center shadow-lg">
                    <ArrowRight size={20} className="text-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mode-specific constants ───────────────────────────────────────────────────
const COLLECTIVE_ROLES = [
  "M110 Team (SNIPERS)", "F.O / OC", "GPMG Team (STEELNET)",
  "SPIKE SR (MPAT)", "SPIKE LR (ATGM)", "MATADOR",
  "SECTION Commander", "LMG", "SAR21 GUNNER", "M203", "PSLAM (PIONEER)",
];
const COLLECTIVE_WEAPONS = ["SAR21", "LMG", "M110", "MATADOR", "SPIKE SR", "SPIKE LR", "GPMG", "Comd Bino", "Claymore", "PSLAM", "Drone", "M203"];
const JUDGEMENTAL_WEAPONS = ["SAR21", "LMG", "M203", "GPMG", "M110", "P30"];
const COURSEWARE_BY_MODE: Record<string, string[]> = {
  Marksmanship: [
    "BTP (SAR21)", "ATP (M) (SAR21/LMG)", "ATP (SP) (SAR21/LMG)",
    "CS(M) (SAR21/LMG)", "CS(SP) (SAR21/LMG)", "Shoot (LMG)",
    "Zeroing (SAR21/LMG)", "APS (SAR21/LMG)", "GPMG (Basic)", "GPMG (Advanced)", "CMTP (M110)",
  ],
  Collective:  ["Component Type Training A", "Component Type Training B", "Component Type Training C"],
  Judgemental: ["Judgemental Shooting A", "Judgemental Shooting B", "Judgemental Shooting C"],
};

// ── Weapon Multi-Select ───────────────────────────────────────────────────────
function WeaponMultiSelect({ weapons, setWeapons, withQty = true }: {
  weapons: WeaponItem[]; setWeapons: (w: WeaponItem[]) => void; withQty?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = weapons.filter((w) => w.selected);
  const displayText = selected.length
    ? selected.map((w) => withQty ? `${w.label} (${w.qty})` : w.label).join(", ")
    : "Select weapon type";
  const toggle = (id: string) => setWeapons(weapons.map((w) => w.id === id ? { ...w, selected: !w.selected, qty: !w.selected ? 1 : 0 } : w));
  const changeQty = (id: string, delta: number) => setWeapons(weapons.map((w) => w.id === id ? { ...w, qty: Math.max(0, w.qty + delta) } : w));
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={cn("w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white",
          open ? "border-brand-primary" : "border-gray-200 hover:border-gray-300",
          selected.length ? "text-gray-800" : "text-gray-400")}>
        <span className="truncate">{displayText}</span>
        {open ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {weapons.map((w) => (
            <div key={w.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50">
              <input type="checkbox" checked={w.selected} onChange={() => toggle(w.id)} className="w-4 h-4 rounded accent-brand-primary cursor-pointer flex-shrink-0" />
              <span className="flex-1 text-sm text-gray-700">{w.label}</span>
              {withQty && (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={(e) => { e.stopPropagation(); changeQty(w.id, -1); }} className="text-brand-primary font-bold w-5 text-center">−</button>
                  <span className="text-sm text-gray-700 w-4 text-center">{w.qty}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); changeQty(w.id, 1); }} className="text-brand-primary font-bold w-5 text-center">+</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Role Tag Multi-Select ─────────────────────────────────────────────────────
function RoleTagSelect({ selected, onChange, options }: {
  selected: string[]; onChange: (roles: string[]) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const toggle = (role: string) => onChange(selected.includes(role) ? selected.filter((r) => r !== role) : [...selected, role]);
  const remove = (role: string, e: React.MouseEvent) => { e.stopPropagation(); onChange(selected.filter((r) => r !== role)); };
  const MAX_VISIBLE = 3;
  const visible = selected.slice(0, MAX_VISIBLE);
  const extra = selected.length - MAX_VISIBLE;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={cn("w-full min-h-[40px] flex flex-wrap items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm bg-white text-left",
          open ? "border-brand-primary" : "border-gray-200 hover:border-gray-300")}>
        {selected.length === 0 && <span className="text-gray-400 py-1">Select role(s)</span>}
        {visible.map((role) => (
          <span key={role} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-gray-200 text-xs text-gray-700 bg-gray-50">
            {role}
            <button type="button" onClick={(e) => remove(role, e)} className="text-gray-400 hover:text-gray-600 ml-0.5">×</button>
          </span>
        ))}
        {extra > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 text-xs text-brand-primary font-medium bg-red-50">
            +{extra}
          </span>
        )}
        <ChevronDown size={14} className="text-gray-400 ml-auto flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto">
          {options.map((opt) => (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <input type="checkbox" readOnly checked={selected.includes(opt)} className="w-4 h-4 rounded accent-brand-primary pointer-events-none" />
              <span>{opt}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Station Qty Input ─────────────────────────────────────────────────────────
function StationQtyInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 px-4 py-2.5 text-sm text-gray-700 focus:outline-none" />
      <button type="button" onClick={() => onChange(String(Math.max(0, (parseInt(value) || 0) - 1) || ""))}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 border-l border-gray-200 text-lg">−</button>
      <button type="button" onClick={() => onChange(String((parseInt(value) || 0) + 1))}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-gray-50 border-l border-gray-200 text-lg">+</button>
    </div>
  );
}

// ── Booking Details snapshot (lifted to BookingForm) ─────────────────────────
interface BookingDetailsSnapshot {
  weapons: string[];       // selected weapon labels
  weaponSummary: string;   // "SAR21 (4), LMG (5)"
  baseQty: string;
  cShapedQty: string;
  courseware: string;
  trainingType: string;    // "Group" | "Individual" | ""
  roles: string[];         // Collective roles
}

// ── Schedule snapshot ─────────────────────────────────────────────────────────
interface ScheduleSnapshot {
  scheduleType: ScheduleType;
  section: ScheduleSection;
  briefing: boolean;
  selectedDate: Date | null;
}

// ── Step 1: Booking Details ───────────────────────────────────────────────────
function BookingDetailsStep({
  trainingMode, onModeChange, onUpdate,
}: {
  trainingMode: string;
  onModeChange: (m: string) => void;
  onUpdate: (data: BookingDetailsSnapshot) => void;
}) {
  const [trainingType, setTrainingType] = useState<TrainingType>(null);
  const [courseware, setCourseware] = useState("");
  const [dryRun, setDryRun] = useState<DryRun>(null);
  const [weapons, setWeapons] = useState<WeaponItem[]>(WEAPON_OPTIONS);
  const [collectiveWeapons, setCollectiveWeapons] = useState<WeaponItem[]>(
    COLLECTIVE_WEAPONS.map((id) => ({ id, label: id, qty: 0, selected: false }))
  );
  const [judementalWeapons, setJudementalWeapons] = useState<WeaponItem[]>(
    JUDGEMENTAL_WEAPONS.map((id) => ({ id, label: id, qty: 0, selected: false }))
  );
  const [roles, setRoles] = useState<string[]>([]);
  const [baseQty, setBaseQty] = useState("");
  const [cShapedQty, setCShapedQty] = useState("");

  // Fire snapshot upward whenever relevant state changes
  useEffect(() => {
    const activeItems =
      trainingMode === "Collective"
        ? collectiveWeapons.filter((w) => w.selected)
        : trainingMode === "Judgemental"
        ? judementalWeapons.filter((w) => w.selected)
        : weapons.filter((w) => w.selected);
    const activeWeapons = activeItems.map((w) => w.label);
    const weaponSummary = activeItems.length
      ? activeItems.map((w) => w.qty > 0 ? `${w.label} (${w.qty})` : w.label).join(", ")
      : "";
    onUpdate({
      weapons: activeWeapons,
      weaponSummary,
      baseQty,
      cShapedQty,
      courseware,
      trainingType: trainingType ?? "",
      roles,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingMode, weapons, collectiveWeapons, judementalWeapons, baseQty, cShapedQty, courseware, trainingType, roles]);

  const isCollective = trainingMode === "Collective";
  const isJudgemental = trainingMode === "Judgemental";
  const coursewareOptions = COURSEWARE_BY_MODE[trainingMode] ?? [];

  const handleModeChange = (mode: string) => {
    onModeChange(mode);
    setCourseware("");
    // Reset weapon selections on mode switch
    setWeapons(WEAPON_OPTIONS.map((w) => ({ ...w, selected: false, qty: 0 })));
    setCollectiveWeapons(COLLECTIVE_WEAPONS.map((id) => ({ id, label: id, qty: 0, selected: false })));
    setJudementalWeapons(JUDGEMENTAL_WEAPONS.map((id) => ({ id, label: id, qty: 0, selected: false })));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 py-8 px-6">
      <h2 className="text-center text-base font-semibold text-gray-800 mb-6">Booking Details</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          {/* Training Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Training Type <span className="text-brand-primary">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              {(["Individual", "Group"] as TrainingType[]).map((type) => (
                <button key={type!} type="button" onClick={() => setTrainingType(type)}
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-colors",
                    trainingType === type ? "border-brand-primary bg-brand-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300")}>
                  <span className={cn("w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                    trainingType === type ? "border-white" : "border-gray-400")}>
                    {trainingType === type && <span className="w-2 h-2 rounded-full bg-white" />}
                  </span>
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Training Mode + Courseware */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Training Mode <span className="text-brand-primary">*</span></label>
              <CustomSelect value={trainingMode} onChange={handleModeChange} options={TRAINING_MODES} placeholder="Select training mode" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Courseware <span className="text-brand-primary">*</span></label>
              <CustomSelect value={courseware} onChange={setCourseware} options={coursewareOptions} placeholder="Choose courseware" />
            </div>
          </div>

          {/* Collective-only: Choose Role(s) */}
          {isCollective && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Choose Role(s) <span className="text-brand-primary">*</span></label>
              <RoleTagSelect selected={roles} onChange={setRoles} options={COLLECTIVE_ROLES} />
            </div>
          )}

          {/* Weapon Type + Dry Run */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Weapon Type(s) <span className="text-brand-primary">*</span></label>
              {isCollective
                ? <WeaponMultiSelect weapons={collectiveWeapons} setWeapons={setCollectiveWeapons} withQty={false} />
                : isJudgemental
                  ? <WeaponMultiSelect weapons={judementalWeapons} setWeapons={setJudementalWeapons} withQty={false} />
                  : <WeaponMultiSelect weapons={weapons} setWeapons={setWeapons} withQty={true} />
              }
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Dry Run Training <span className="text-brand-primary">*</span></label>
              <div className="grid grid-cols-2 gap-3">
                {(["Yes", "No"] as DryRun[]).map((val) => (
                  <button key={val!} type="button" onClick={() => setDryRun(val)}
                    className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                      dryRun === val ? "border-brand-primary bg-brand-primary text-white" : "border-gray-200 text-gray-700 hover:border-gray-300")}>
                    <span className={cn("w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                      dryRun === val ? "border-white" : "border-gray-400")}>
                      {dryRun === val && <span className="w-2 h-2 rounded-full bg-white" />}
                    </span>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Station(s) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Base Station(s) <span className="text-brand-primary">*</span></label>
            <StationQtyInput value={baseQty} onChange={setBaseQty} placeholder="Enter base station qty" />
          </div>
          {isCollective && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">C-Shaped Station <span className="text-brand-primary">*</span></label>
              <StationQtyInput value={cShapedQty} onChange={setCShapedQty} placeholder="Enter c-shaped station qty" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Mass Assign Modal ─────────────────────────────────────────────────
function MassAssignModal({ onClose }: { onClose: () => void }) {
  const [baseStation, setBaseStation] = useState("Base Station 1");
  const [weaponType, setWeaponType] = useState("SAR21");
  const [allChecked, setAllChecked] = useState(false);
  const laneOn = [true, true, true, false, true, false, true, true, true, false];
  const [laneChecks, setLaneChecks] = useState<boolean[]>(Array(10).fill(false));

  const toggleAll = () => {
    const next = !allChecked;
    setAllChecked(next);
    setLaneChecks(laneChecks.map((_, i) => (i + 1 === 10) ? false : next));
  };
  const toggleLane = (i: number) => {
    const next = laneChecks.map((v, idx) => idx === i ? !v : v);
    setLaneChecks(next);
    setAllChecked(next.every((v, i) => (i + 1 === 10) || v));
  };
  const onCount = laneOn.filter(Boolean).length;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={20} className="text-brand-primary" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">Mass Assign Assets</h3>
            <p className="text-xs text-gray-500 mt-0.5">Select base station and weapon type, then choose lanes to assign them to in one action.</p>
          </div>
        </div>
        <div className="px-6 pb-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base station <span className="text-brand-primary">*</span></label>
            <CustomSelect value={baseStation} onChange={setBaseStation} options={["Base Station 1", "Base Station 2"]} placeholder="Select base station" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weapon Type <span className="text-brand-primary">*</span></label>
            <CustomSelect value={weaponType} onChange={setWeaponType} options={["SAR21", "LMG", "M203", "GPMG", "M110"]} placeholder="Select weapon type" />
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">{baseStation}</span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="font-medium">{onCount}/10 Lanes</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
            {/* Header row */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center px-4 py-2 bg-red-50 border-b border-gray-100">
              <input type="checkbox" checked={allChecked} onChange={toggleAll} className="w-4 h-4 accent-brand-primary" />
              <span className="text-xs font-semibold text-brand-primary">Lane</span>
              <span className="text-xs font-semibold text-brand-primary">Status</span>
            </div>
            <div className="max-h-56 overflow-y-auto">
              {Array.from({ length: 10 }, (_, i) => {
                const isClosed = i + 1 === 10;
                const isOn = laneOn[i];
                return (
                  <div key={i} className={cn("grid grid-cols-[auto_1fr_auto] gap-3 items-center px-4 py-2.5 border-b border-gray-50 last:border-b-0",
                    isClosed ? "opacity-50" : "hover:bg-gray-50")}>
                    <input type="checkbox" checked={laneChecks[i]} disabled={isClosed} onChange={() => toggleLane(i)}
                      className="w-4 h-4 accent-brand-primary" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">Lane {i + 1}</span>
                      {isClosed && <span className="text-xs font-medium text-brand-primary">Closed</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LaneToggle on={isOn} onChange={() => {}} disabled={isClosed} />
                      <span className={cn("text-xs font-medium", isClosed ? "text-gray-400" : isOn ? "text-green-600" : "text-red-500")}>
                        {isClosed ? "Off" : isOn ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 pb-6">
          <button type="button" onClick={onClose} className="py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={onClose} className="py-3 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary-hover">Assign Lane</button>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Lane Configuration ────────────────────────────────────────────────
type StationType = "Base Station" | "C-Shaped Station";
interface LaneState { on: boolean; weaponType: string; team: string; }

const COLLECTIVE_TEAM_OPTIONS = [
  "M110 Team (SNIPERS)", "F.O / OC", "GPMG Team (STEELNET)",
  "SPIKE SR (MPAT)", "SPIKE LR (ATGM)", "MATADOR",
  "SECTION Commander", "LMG", "SAR21 GUNNER", "M203", "PSLAM (PIONEER)",
];

function LaneConfigStep({
  trainingMode, bookingWeapons, numBase, numCShaped, bookingCourseware,
}: {
  trainingMode: string;
  bookingWeapons: string[];
  numBase: number;
  numCShaped: number;
  bookingCourseware: string;
}) {
  const [stationType, setStationType] = useState<StationType>("Base Station");
  const [showMassAssign, setShowMassAssign] = useState(false);
  const isCollective = trainingMode === "Collective";

  // Determine weapon options: use only what was selected in Booking Details (fall back to full list)
  const weaponOptions = bookingWeapons.length > 0
    ? bookingWeapons
    : isCollective ? COLLECTIVE_WEAPONS : trainingMode === "Judgemental" ? JUDGEMENTAL_WEAPONS : ["SAR21", "LMG", "M203", "GPMG", "M110"];

  // How many base station cards to show (min 1, max 5)
  const baseCount = Math.min(5, Math.max(1, numBase || 1));
  // How many C-shaped cards to show (max 2, only Collective)
  const cShapedCount = isCollective ? Math.min(2, Math.max(0, numCShaped || 0)) : 0;

  const makeDefaultLanes = (): LaneState[] =>
    Array.from({ length: LANE_COUNT }, (_, i) => ({
      on: !OCCUPIED_LANES.includes(i + 1),
      weaponType: "",
      team: "",
    }));

  // Dynamic base station lanes: one array per station
  const [baseLanes, setBaseLanes] = useState<LaneState[][]>(() =>
    Array.from({ length: 5 }, () => makeDefaultLanes())
  );
  // Dynamic C-shaped station lanes
  const [cShapedLanes, setCShapedLanes] = useState<LaneState[][]>(() =>
    Array.from({ length: 2 }, () =>
      Array.from({ length: 5 }, (_, i) => ({ on: true, weaponType: "", team: "" }))
    )
  );

  const activeCount = (lanes: LaneState[]) =>
    isCollective
      ? lanes.filter((l) => l.team !== "").length
      : lanes.filter((l, i) => !OCCUPIED_LANES.includes(i + 1) && l.on).length;
  const totalCount = isCollective ? LANE_COUNT : LANE_COUNT - OCCUPIED_LANES.length;

  function BaseStationCard({ label, lanes, setLanes }: {
    label: string; lanes: LaneState[]; setLanes: React.Dispatch<React.SetStateAction<LaneState[]>>;
  }) {
    const [openWeaponDD, setOpenWeaponDD] = useState<number | null>(null);
    const [openTeamDD, setOpenTeamDD] = useState<number | null>(null);
    const active = activeCount(lanes);

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 bg-white">
          <span className="text-sm font-semibold text-gray-800">{label} ({active}/{totalCount} Lanes)</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="w-8 px-3 py-2.5"><input type="checkbox" className="w-4 h-4 accent-brand-primary" /></th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 w-20">Lane</th>
              {isCollective && (
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-brand-primary w-32">Team</th>
              )}
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-brand-primary">
                {isCollective ? "Controlled Item" : "Weapon/Controlled Item"}
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold text-brand-primary w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {lanes.map((lane, idx) => {
              const isOccupied = OCCUPIED_LANES.includes(idx + 1);
              const isWeaponOpen = openWeaponDD === idx;
              const isTeamOpen = openTeamDD === idx;
              return (
                <tr key={idx} className="border-b border-gray-50 last:border-b-0">
                  <td className="px-3 py-2"><input type="checkbox" disabled={isOccupied} className="w-4 h-4 accent-brand-primary" /></td>
                  <td className="px-3 py-2 text-sm text-gray-700">Lane {idx + 1}</td>

                  {/* Team column — Collective only */}
                  {isCollective && (
                    <td className="px-3 py-2">
                      {isOccupied ? (
                        <span className="text-xs text-gray-400">—</span>
                      ) : (
                        <div className="relative">
                          <button type="button"
                            onClick={() => { setOpenTeamDD(isTeamOpen ? null : idx); setOpenWeaponDD(null); }}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                            <span className="max-w-[90px] truncate">{lane.team || "Team"}</span>
                            <ChevronDown size={11} />
                          </button>
                          {isTeamOpen && (
                            <div className="absolute z-30 mt-1 left-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                              {COLLECTIVE_TEAM_OPTIONS.map((t) => (
                                <button key={t} type="button"
                                  onClick={() => { setLanes((prev) => prev.map((l, i) => i === idx ? { ...l, team: t } : l)); setOpenTeamDD(null); }}
                                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                  <span className="truncate">{t}</span>
                                  {lane.team === t && <Check size={12} className="text-brand-primary flex-shrink-0" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Weapon/Controlled Item column */}
                  <td className="px-3 py-2">
                    {isOccupied ? (
                      <span className="text-xs font-medium text-brand-primary">Occupied</span>
                    ) : (
                      <div className="relative">
                        <button type="button"
                          onClick={() => { setOpenWeaponDD(isWeaponOpen ? null : idx); setOpenTeamDD(null); }}
                          className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
                          <span>{lane.weaponType || "Weapon/Controlled Item"}</span>
                          {isWeaponOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        {isWeaponOpen && (
                          <div className="absolute z-20 mt-1 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto">
                            {weaponOptions.map((w) => (
                              <button key={w} type="button"
                                onClick={() => { setLanes((prev) => prev.map((l, i) => i === idx ? { ...l, weaponType: w } : l)); setOpenWeaponDD(null); }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                {w}
                                {lane.weaponType === w && <Check size={12} className="text-brand-primary" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <LaneToggle on={lane.on} onChange={() => !isOccupied && setLanes((prev) => prev.map((l, i) => i === idx ? { ...l, on: !l.on } : l))} disabled={isOccupied} />
                      <span className={cn("text-xs font-medium", isOccupied ? "text-gray-400" : lane.on ? "text-green-600" : "text-red-500")}>
                        {lane.on && !isOccupied ? "On" : "Off"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // ── Layout variant state ──────────────────────────────────────────────────
  const [laneVariant, setLaneVariant] = useState<"v1" | "v2">("v1");

  // Draggable toggle
  const [togglePos, setTogglePos] = useState({ x: 24, y: 24 });
  const dragging = useRef(false);
  const dragOrigin = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const onToggleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: togglePos.x, py: togglePos.y };
    const onMove = (me: MouseEvent) => {
      if (!dragging.current) return;
      setTogglePos({
        x: Math.max(0, dragOrigin.current.px + me.clientX - dragOrigin.current.mx),
        y: Math.max(0, dragOrigin.current.py + me.clientY - dragOrigin.current.my),
      });
    };
    const onUp = () => { dragging.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    e.preventDefault();
  };

  // ── V2 station focus state ────────────────────────────────────────────────
  // v2FocusIdx: -1 = All view, 0..n = focused station index
  const [v2FocusIdx, setV2FocusIdx] = useState(-1);

  type StationEntry = { id: string; label: string; shortLabel: string; type: "base" | "cshaped"; idx: number };
  const allStations: StationEntry[] = [
    ...Array.from({ length: baseCount }, (_, i) => ({
      id: `base-${i}`,
      label: `Base Station ${String(i + 1).padStart(2, "0")}`,
      shortLabel: String(i + 1).padStart(2, "0"),
      type: "base" as const,
      idx: i,
    })),
    ...(isCollective && cShapedCount > 0
      ? Array.from({ length: cShapedCount }, (_, i) => ({
          id: `cshaped-${i}`,
          label: `C-Shaped SWT ${4 + i}`,
          shortLabel: `SWT ${4 + i}`,
          type: "cshaped" as const,
          idx: i,
        }))
      : []),
  ];

  const isAllView = v2FocusIdx === -1;
  const safeFocusIdx = isAllView ? -1 : Math.min(v2FocusIdx, allStations.length - 1);
  const focusedStation = isAllView ? null : allStations[safeFocusIdx];

  // Per-station progress: lanes with a weapon assigned
  const stationProgress = allStations.map((s) => {
    const lanes = s.type === "base" ? baseLanes[s.idx] : cShapedLanes[s.idx];
    const available = s.type === "base" ? LANE_COUNT - OCCUPIED_LANES.length : lanes.length;
    const configured = lanes.filter((l) => l.weaponType !== "").length;
    return { configured, available };
  });

  // ── Shared header content ─────────────────────────────────────────────────
  const headerLeft = (
    <div>
      <h2 className="text-base font-semibold text-gray-800">Lane Configuration</h2>
      {bookingCourseware && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-gray-500">Courseware:</span>
          <span className="text-xs font-semibold text-brand-primary">{bookingCourseware}</span>
        </div>
      )}
    </div>
  );

  // ── Tabs V1: Base Station always; C-Shaped only if Collective + cShapedCount > 0
  const showCShapedTab = isCollective && cShapedCount > 0;
  const stationTabs: StationType[] = showCShapedTab
    ? ["Base Station", "C-Shaped Station"]
    : ["Base Station"];

  // ── Draggable floating toggle ─────────────────────────────────────────────
  const FloatingToggle = (
    <div
      className="fixed z-50 select-none"
      style={{ bottom: `${togglePos.y}px`, right: `${togglePos.x}px`, cursor: dragging.current ? "grabbing" : "grab" }}
      onMouseDown={onToggleMouseDown}
    >
      <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-lg px-1 py-1 gap-0.5">
        <span className="text-[10px] text-gray-400 font-semibold px-2 select-none">Layout</span>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setLaneVariant("v1")}
          className={cn("px-2.5 py-1 rounded-full text-xs font-semibold transition-colors",
            laneVariant === "v1" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-100")}
        >Classic</button>
        <button
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setLaneVariant("v2")}
          className={cn("px-2.5 py-1 rounded-full text-xs font-semibold transition-colors",
            laneVariant === "v2" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-100")}
        >Quick ✦</button>
      </div>
    </div>
  );

  // ═══════════════════════ V1 LAYOUT ════════════════════════════════════════
  if (laneVariant === "v1") return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      {FloatingToggle}
      <div className="flex items-center justify-between mb-4">
        {headerLeft}
        <div className="flex items-center gap-2">
          {stationTabs.map((t) => (
            <button key={t} type="button" onClick={() => setStationType(t)}
              className={cn("px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                stationType === t ? "border-brand-primary text-brand-primary bg-red-50" : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
              {t}
            </button>
          ))}
          <button type="button" onClick={() => setShowMassAssign(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primary-hover">
            + {isCollective ? "Mass Assign Asset" : "Mass Assign"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5">
        {Array.from({ length: baseCount }, (_, i) => (
          <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            Base Station {String(i + 1).padStart(2, "0")}
          </span>
        ))}
        {isCollective && cShapedCount > 0 && Array.from({ length: cShapedCount }, (_, i) => (
          <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
            C-Shaped SWT {4 + i}
          </span>
        ))}
        {weaponOptions.length > 0 && (
          <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
            Weapons: {weaponOptions.join(", ")}
          </span>
        )}
      </div>

      {stationType === "Base Station" && (
        <div className={cn("grid gap-5", baseCount === 1 ? "grid-cols-1 max-w-2xl" : "grid-cols-2")}>
          {Array.from({ length: baseCount }, (_, i) => (
            <BaseStationCard key={i} label={`Base Station ${String(i + 1).padStart(2, "0")}`}
              lanes={baseLanes[i]}
              setLanes={(fn) => setBaseLanes((prev) => { const next = [...prev]; next[i] = typeof fn === "function" ? fn(prev[i]) : fn; return next; })}
            />
          ))}
        </div>
      )}
      {stationType === "C-Shaped Station" && showCShapedTab && (
        <div className="grid grid-cols-2 gap-5">
          {Array.from({ length: cShapedCount }, (_, i) => (
            <BaseStationCard key={i} label={`C-Shaped Station SWT ${4 + i}`}
              lanes={cShapedLanes[i]}
              setLanes={(fn) => setCShapedLanes((prev) => { const next = [...prev]; next[i] = typeof fn === "function" ? fn(prev[i]) : fn; return next; })}
            />
          ))}
        </div>
      )}
      {showMassAssign && <MassAssignModal onClose={() => setShowMassAssign(false)} />}
    </div>
  );

  // ═══════════════════════ V2 LAYOUT ════════════════════════════════════════
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {FloatingToggle}

      {/* V2 top bar: title + mass assign CTA */}
      <div className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
        {headerLeft}
        <button type="button" onClick={() => setShowMassAssign(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Mass Assign
        </button>
      </div>

      {/* V2 station navigator */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0">
        <div className="flex items-stretch gap-3 overflow-x-auto pb-1">

          {/* All card */}
          {(() => {
            const totalConfigured = stationProgress.reduce((s, p) => s + p.configured, 0);
            const totalAvailable = stationProgress.reduce((s, p) => s + p.available, 0);
            const pct = totalAvailable > 0 ? (totalConfigured / totalAvailable) * 100 : 0;
            const isDone = totalConfigured === totalAvailable && totalAvailable > 0;
            return (
              <button type="button" onClick={() => setV2FocusIdx(-1)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-xl border-2 min-w-[120px] transition-all text-left",
                  isAllView
                    ? "border-gray-800 bg-gray-900 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                )}>
                <div className={cn("text-[9px] font-bold uppercase tracking-wider mb-0.5", isAllView ? "text-white/50" : "text-gray-400")}>
                  All
                </div>
                <div className={cn("text-xl font-bold leading-none", isAllView ? "text-white" : "text-gray-700")}>
                  {allStations.length}
                  <span className={cn("text-xs font-medium ml-1", isAllView ? "text-white/50" : "text-gray-400")}>stations</span>
                </div>
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-[10px] font-medium", isAllView ? "text-white/60" : "text-gray-400")}>
                      {totalConfigured}/{totalAvailable} lanes
                    </span>
                    {isDone && (
                      <span className="text-[9px] font-bold text-green-400 flex items-center gap-0.5">
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Done
                      </span>
                    )}
                  </div>
                  <div className={cn("h-1.5 rounded-full overflow-hidden", isAllView ? "bg-white/20" : "bg-gray-100")}>
                    <div
                      className={cn("h-full rounded-full transition-all duration-300", isDone ? "bg-green-400" : isAllView ? "bg-white/60" : "bg-gray-300")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })()}

          {/* Separator */}
          <div className="flex items-center flex-shrink-0">
            <div className="h-full w-px bg-gray-100 min-h-[80px]" />
          </div>

          {/* Base station cards */}
          {Array.from({ length: baseCount }, (_, i) => {
            const isActive = safeFocusIdx === i;
            const prog = stationProgress[i];
            const pct = prog.available > 0 ? (prog.configured / prog.available) * 100 : 0;
            const isDone = prog.configured === prog.available && prog.available > 0;
            return (
              <button key={i} type="button" onClick={() => setV2FocusIdx(i)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-xl border-2 min-w-[148px] transition-all text-left",
                  isActive
                    ? "border-brand-primary bg-red-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                )}>
                <div className={cn("text-[9px] font-bold uppercase tracking-wider mb-0.5", isActive ? "text-brand-primary/70" : "text-gray-400")}>
                  Base Station
                </div>
                <div className={cn("text-xl font-bold leading-none", isActive ? "text-brand-primary" : "text-gray-700")}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-[10px] font-medium", isActive ? "text-brand-primary/80" : "text-gray-400")}>
                      {prog.configured}/{prog.available} lanes
                    </span>
                    {isDone && (
                      <span className="text-[9px] font-bold text-green-600 flex items-center gap-0.5">
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Done
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-300", isDone ? "bg-green-500" : isActive ? "bg-brand-primary" : "bg-gray-300")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Divider between base and C-shaped */}
          {isCollective && cShapedCount > 0 && (
            <div className="flex items-center flex-shrink-0 px-1">
              <div className="h-full w-px bg-gray-200 min-h-[80px]" />
            </div>
          )}

          {/* C-Shaped station cards */}
          {isCollective && cShapedCount > 0 && Array.from({ length: cShapedCount }, (_, i) => {
            const flatIdx = baseCount + i;
            const isActive = safeFocusIdx === flatIdx;
            const prog = stationProgress[flatIdx];
            const pct = prog?.available > 0 ? ((prog.configured / prog.available) * 100) : 0;
            const isDone = prog?.configured === prog?.available && (prog?.available ?? 0) > 0;
            return (
              <button key={i} type="button" onClick={() => setV2FocusIdx(flatIdx)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-start px-4 py-3 rounded-xl border-2 min-w-[148px] transition-all text-left",
                  isActive
                    ? "border-purple-500 bg-purple-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                )}>
                <div className={cn("text-[9px] font-bold uppercase tracking-wider mb-0.5", isActive ? "text-purple-600" : "text-gray-400")}>
                  C-Shaped
                </div>
                <div className={cn("text-xl font-bold leading-none", isActive ? "text-purple-700" : "text-gray-700")}>
                  SWT {4 + i}
                </div>
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-[10px] font-medium", isActive ? "text-purple-600" : "text-gray-400")}>
                      {prog?.configured ?? 0}/{prog?.available ?? 0} lanes
                    </span>
                    {isDone && (
                      <span className="text-[9px] font-bold text-green-600 flex items-center gap-0.5">
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Done
                      </span>
                    )}
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-300", isDone ? "bg-green-500" : isActive ? "bg-purple-500" : "bg-gray-300")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}

          {/* Weapon reference chips — right-aligned, separated */}
          {weaponOptions.length > 0 && (
            <div className="ml-auto flex-shrink-0 flex flex-col justify-center pl-4 border-l border-gray-100 gap-1.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Weapons</span>
              <div className="flex flex-wrap gap-1">
                {weaponOptions.map((w) => (
                  <span key={w} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full border border-gray-200">
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto p-6">
        {isAllView ? (
          /* All view — 2-col grid of all stations */
          <div className={cn("grid gap-5", allStations.length === 1 ? "grid-cols-1 max-w-2xl" : "grid-cols-2")}>
            {allStations.map((s, flatIdx) => (
              <div key={s.id} className="relative group">
                {/* Click-to-focus overlay hint */}
                <div
                  onClick={() => setV2FocusIdx(flatIdx)}
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="px-2 py-1 bg-gray-800/80 text-white text-[10px] font-medium rounded-md cursor-pointer whitespace-nowrap">
                    Focus station →
                  </span>
                </div>
                <BaseStationCard
                  label={s.label}
                  lanes={s.type === "base" ? baseLanes[s.idx] : cShapedLanes[s.idx]}
                  setLanes={(fn) =>
                    s.type === "base"
                      ? setBaseLanes((prev) => { const next = [...prev]; next[s.idx] = typeof fn === "function" ? fn(prev[s.idx]) : fn; return next; })
                      : setCShapedLanes((prev) => { const next = [...prev]; next[s.idx] = typeof fn === "function" ? fn(prev[s.idx]) : fn; return next; })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          /* Single focused station */
          <>
            {focusedStation && (
              <BaseStationCard
                label={focusedStation.label}
                lanes={focusedStation.type === "base" ? baseLanes[focusedStation.idx] : cShapedLanes[focusedStation.idx]}
                setLanes={(fn) =>
                  focusedStation.type === "base"
                    ? setBaseLanes((prev) => { const next = [...prev]; next[focusedStation.idx] = typeof fn === "function" ? fn(prev[focusedStation.idx]) : fn; return next; })
                    : setCShapedLanes((prev) => { const next = [...prev]; next[focusedStation.idx] = typeof fn === "function" ? fn(prev[focusedStation.idx]) : fn; return next; })
                }
              />
            )}

            {/* Prev / Next station navigation footer */}
            {allStations.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button type="button"
                  onClick={() => setV2FocusIdx(safeFocusIdx === 0 ? -1 : safeFocusIdx - 1)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  <ChevronLeft size={15} />
                  {safeFocusIdx === 0 ? "All Stations" : "Previous Station"}
                </button>
                <span className="text-xs text-gray-400 font-medium">
                  {safeFocusIdx + 1} / {allStations.length}
                </span>
                <button type="button"
                  onClick={() => setV2FocusIdx(Math.min(allStations.length - 1, safeFocusIdx + 1))}
                  disabled={safeFocusIdx === allStations.length - 1}
                  className={cn("flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                    safeFocusIdx === allStations.length - 1
                      ? "border-gray-100 text-gray-300 cursor-not-allowed"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50")}>
                  Next Station <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showMassAssign && <MassAssignModal onClose={() => setShowMassAssign(false)} />}
    </div>
  );
}

// ── Step 3: Confirm Export to MIOS Modal ─────────────────────────────────────
function ConfirmExportModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <Check size={28} className="text-green-500" strokeWidth={2.5} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Export to MIOS</h3>
        <p className="text-sm text-gray-500 mb-8">
          You are about to export the Nominal Roll data to MIOS. Once confirmed, the data will be sent and processed. Do you want to proceed?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className="py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={onConfirm} className="py-3 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary-hover">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Upload List Modal ─────────────────────────────────────────────────────────
function UploadListModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Upload size={24} className="text-brand-primary" />
          </div>
          <p className="text-base font-semibold text-gray-800 mb-1">Drag and drop to upload file</p>
          <p className="text-sm text-gray-400 mb-4">Your IMT Spreadsheet File (up to 4 mb.)</p>
          <p className="text-sm text-gray-500 mb-4">Or</p>
          <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary-hover mb-6">
            <Upload size={14} /> Browse
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 mb-1">We have prepared the Nominal Roll "Template" for you.</p>
            <p className="text-sm text-gray-400 mb-2">Your IMT Spreadsheet File (up to 4 mb.)</p>
            <button type="button" className="flex items-center gap-1.5 text-sm text-brand-primary font-medium hover:underline mx-auto">
              <Upload size={13} /> Click here to download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Nominal Roll ──────────────────────────────────────────────────────
function NominalRollStep({ onNext, trainingMode }: { onNext: () => void; trainingMode: string }) {
  const [trainees] = useState(NOMINAL_ROLL_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filtered = trainees.filter(
    (t) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.nric.includes(searchQuery)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const headers = ["No", "Rank", "Name", "NRIC", "Platoon Number", "Weapon Type(s)", "Last Updated On", ""];

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800">
          Nominal Roll List <span className="font-normal text-gray-500">( {trainees.length} Trainee(s) )</span>
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
          </div>
          <button type="button" onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <Upload size={14} /> Upload List
          </button>
          <button type="button"
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover">
            <Plus size={14} /> Add Trainee
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-50 border-b border-gray-100">
              <th className="px-4 py-3 w-10"><input type="checkbox" className="w-4 h-4 accent-brand-primary" /></th>
              {headers.map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                        <line x1="9" y1="17" x2="13" y2="17" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">No Trainee(s) to show right now!</p>
                    <p className="text-xs text-gray-400 mb-4">Clicks on " Upload List" or " Add Trainee(s)" to create a nominal roll list in the system.</p>
                    <button type="button" onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-medium rounded-lg hover:bg-brand-primary-hover">
                      <Plus size={14} /> Add Trainee
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((t, idx) => (
                <tr key={idx} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-brand-primary" /></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.rank}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.nric}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.platoon}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.weapon}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">17 January 2025<br /><span className="text-xs">09.29.33 AM</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600"><Pencil size={14} /></button>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination current={currentPage} total={totalPages} perPage={PER_PAGE} totalItems={filtered.length} onPageChange={setCurrentPage} />
      </div>

      {showExportModal && (
        <ConfirmExportModal
          onCancel={() => setShowExportModal(false)}
          onConfirm={() => { setShowExportModal(false); onNext(); }}
        />
      )}
      {showUploadModal && <UploadListModal onClose={() => setShowUploadModal(false)} />}

      <button id="nominal-next-trigger" type="button" className="hidden" onClick={() => setShowExportModal(true)} />
    </div>
  );
}

// ── Schedule Step ─────────────────────────────────────────────────────────────
type ScheduleType = "AM/PM" | "FullDay" | "Ad-hoc" | null;
type ScheduleSection = string | null;

function DualCalendar({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const [baseYear, setBaseYear] = useState(2025);
  const [baseMonth, setBaseMonth] = useState(0); // 0 = Jan

  const prev = () => {
    if (baseMonth === 0) { setBaseMonth(11); setBaseYear(baseYear - 1); }
    else setBaseMonth(baseMonth - 1);
  };
  const next = () => {
    if (baseMonth === 11) { setBaseMonth(0); setBaseYear(baseYear + 1); }
    else setBaseMonth(baseMonth + 1);
  };

  const second = baseMonth === 11 ? { month: 0, year: baseYear + 1 } : { month: baseMonth + 1, year: baseYear };

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const renderMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const cells: { day: number; cur: boolean }[] = [];
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, cur: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, cur: true });
    while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 1, cur: false });

    return (
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-700 text-center mb-3">{MONTH_NAMES[month]} {year}</div>
        <div className="grid grid-cols-7 mb-1">
          {DOW.map((d) => <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((cell, i) => {
            const isSelected = selected && cell.cur &&
              selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === cell.day;
            return (
              <button key={i} type="button"
                disabled={!cell.cur}
                onClick={() => cell.cur && onSelect(new Date(year, month, cell.day))}
                className={cn("text-center py-1.5 text-sm rounded-full mx-auto w-8 h-8 flex items-center justify-center transition-colors",
                  !cell.cur ? "text-gray-300 cursor-default" :
                  isSelected ? "bg-brand-primary text-white font-semibold" :
                  "text-gray-700 hover:bg-red-50")}>
                {cell.day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <button type="button" onClick={prev} className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <ChevronLeft size={16} />
        </button>
        <div className="flex flex-1 gap-8">
          {renderMonth(baseYear, baseMonth)}
          <div className="w-px bg-gray-200 self-stretch" />
          {renderMonth(second.year, second.month)}
        </div>
        <button type="button" onClick={next} className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const TIME_OPTIONS = Array.from({ length: 24 }, (_, h) =>
  [`${String(h).padStart(2,"0")}:00`, `${String(h).padStart(2,"0")}:30`]).flat();

function ScheduleStep({ onUpdate }: { onUpdate?: (s: ScheduleSnapshot) => void }) {
  const [scheduleType, setScheduleType] = useState<ScheduleType>(null);
  const [section, setSection] = useState<ScheduleSection>(null);
  const [briefing, setBriefing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Bubble state up whenever it changes
  useEffect(() => {
    onUpdate?.({ scheduleType, section, briefing, selectedDate });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleType, section, briefing, selectedDate]);

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
        {/* Left: Schedule Selection */}
        <div className="w-72 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-5 space-y-5">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">
              Schedule Selection <span className="text-red-500">*</span>
            </div>
            <div className="space-y-2">
              {scheduleOpts.map(({ id, label }) => (
                <button key={id!} type="button"
                  onClick={() => { setScheduleType(id); setSection(null); }}
                  className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                    scheduleType === id
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-300")}>
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
              <div className="text-sm font-medium text-gray-700 mb-3">
                Schedule Section <span className="text-red-500">*</span>
              </div>
              <div className="space-y-2">
                {sectionOptions[scheduleType].map((opt) => (
                  <button key={opt} type="button"
                    onClick={() => setSection(opt)}
                    className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                      section === opt
                        ? "bg-brand-primary border-brand-primary text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-300")}>
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
            <div className="text-sm font-medium text-gray-700 mb-3">
              Briefing Room <span className="text-red-500">*</span>
            </div>
            <button type="button" onClick={() => setBriefing(!briefing)}
              className={cn("w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors",
                briefing
                  ? "bg-brand-primary border-brand-primary text-white"
                  : "border-gray-200 text-gray-700 hover:border-gray-300")}>
              <span className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                briefing ? "bg-white border-white" : "border-gray-300")}>
                {briefing && <Check size={10} className="text-brand-primary" strokeWidth={3} />}
              </span>
              Briefing Room
            </button>
          </div>
        </div>

        {/* Right: Calendar */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-5">
          <div className="text-sm font-medium text-gray-700 mb-4">
            Select Date Slot <span className="text-red-500">*</span>
          </div>
          <DualCalendar selected={selectedDate} onSelect={setSelectedDate} />
          {scheduleType === "Ad-hoc" && (
            <div className="flex gap-4 mt-5">
              <CustomSelect value={startTime} onChange={setStartTime} options={TIME_OPTIONS}
                placeholder="Select start time" className="flex-1" />
              <CustomSelect value={endTime} onChange={setEndTime} options={TIME_OPTIONS}
                placeholder="Select end time" className="flex-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Review Modal ──────────────────────────────────────────────────────────────
function ReviewModal({
  sessionType,
  trainingMode,
  detailsSnapshot,
  scheduleSnapshot,
  totalTrainees,
  onCancel,
  onConfirm,
}: {
  sessionType: SessionType;
  trainingMode: string;
  detailsSnapshot: BookingDetailsSnapshot;
  scheduleSnapshot: ScheduleSnapshot;
  totalTrainees: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const isIntegrated = sessionType === "Integrated";

  const formatDate = (d: Date | null) =>
    d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

  const scheduleLabel = scheduleSnapshot.section
    || (scheduleSnapshot.scheduleType === "Ad-hoc" ? "Ad-hoc" : "—");

  const dateLabel = scheduleSnapshot.selectedDate
    ? formatDate(scheduleSnapshot.selectedDate)
    : "6-10 January 2025"; // fallback mock

  const baseQty = parseInt(detailsSnapshot.baseQty) || 0;
  const cShapedQty = parseInt(detailsSnapshot.cShapedQty) || 0;

  // Row helper
  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">{value || "—"}</span>
    </div>
  );

  const Divider = () => <div className="border-t border-gray-200" />;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[92vh] flex flex-col">
        <div className="p-6 overflow-y-auto flex-1">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-gray-800">Review Your Booking Details</div>
              <div className="text-sm text-gray-500 mt-0.5">Please verify the information below before confirming your booking.</div>
            </div>
          </div>

          {/* Data table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            {/* Total Trainee */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <span className="text-sm text-gray-600">Total Trainee</span>
              <span className="text-sm font-bold text-gray-800">{totalTrainees} Trainee(s)</span>
            </div>

            <Divider />

            {/* Training info block */}
            <Row label="Training Section Type" value={sessionType} />
            <Row label="Training Type"         value={detailsSnapshot.trainingType || "Group"} />
            <Row label="Training Mode"         value={trainingMode || "—"} />
            <Row label="Courseware"            value={detailsSnapshot.courseware} />
            {isIntegrated && detailsSnapshot.roles.length > 0 && (
              <Row label="Role(s)" value={detailsSnapshot.roles.join(", ")} />
            )}
            <Row label="Weapon Type(s)" value={detailsSnapshot.weaponSummary} />

            <Divider />

            {/* Station block */}
            <Row label="Base Station(s)" value={`${baseQty} Station(s)`} />
            {isIntegrated && cShapedQty > 0 && (
              <Row label="C-Shaped Station(s)" value={`${cShapedQty} Station(s)`} />
            )}

            <Divider />

            {/* Schedule block */}
            <Row label="Training Schedule" value={scheduleLabel} />
            <Row label="Training Date"     value={dateLabel} />
            {scheduleSnapshot.briefing && (
              <Row label="Briefing Room" value="Briefing Room" />
            )}
          </div>

          <p className="text-xs text-gray-500 mb-5">
            Ensure you arrive 15 minutes before the scheduled time. You must bring your identity card and any required equipment.
          </p>

          <div className="flex gap-3">
            <button type="button" onClick={onCancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="button" onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover">
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Booking Form ──────────────────────────────────────────────────────────────
function BookingForm({ program, sessionType, onBack }: { program: ProgramType; sessionType: SessionType; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [trainingMode, setTrainingMode] = useState("");
  const [detailsSnapshot, setDetailsSnapshot] = useState<BookingDetailsSnapshot>({
    weapons: [], weaponSummary: "", baseQty: "2", cShapedQty: "0", courseware: "", trainingType: "", roles: [],
  });
  const [scheduleSnapshot, setScheduleSnapshot] = useState<ScheduleSnapshot>({
    scheduleType: null, section: null, briefing: false, selectedDate: null,
  });
  const programLabel = PROGRAMS.find((p) => p.id === program)?.id ?? "SWT";

  const handleNext = () => {
    if (step === 2) {
      const btn = document.getElementById("nominal-next-trigger");
      if (btn) btn.click();
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <button type="button" onClick={step === 0 ? onBack : () => setStep(step - 1)}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ArrowLeft size={14} /> Back
        </button>
        <Stepper current={step} />
        <div className="flex items-center gap-2">
          {(step === 1 || step === 2) && (
            <button type="button" onClick={() => setStep(step + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              Skip Step
            </button>
          )}
          {isLastStep ? (
            <button type="button" onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Confirm Booking
            </button>
          ) : (
            <button type="button" onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover">
              Next <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {step === 0 && <BookingDetailsStep trainingMode={trainingMode} onModeChange={setTrainingMode} onUpdate={setDetailsSnapshot} />}
      {step === 1 && (
        <LaneConfigStep
          trainingMode={trainingMode}
          bookingWeapons={detailsSnapshot.weapons}
          numBase={parseInt(detailsSnapshot.baseQty) || 1}
          numCShaped={parseInt(detailsSnapshot.cShapedQty) || 0}
          bookingCourseware={detailsSnapshot.courseware}
        />
      )}
      {step === 2 && <NominalRollStep onNext={() => setStep(3)} trainingMode={trainingMode} />}
      {step === 3 && <ScheduleStep onUpdate={setScheduleSnapshot} />}

      {showReviewModal && (
        <ReviewModal
          sessionType={sessionType}
          trainingMode={trainingMode}
          detailsSnapshot={detailsSnapshot}
          scheduleSnapshot={scheduleSnapshot}
          totalTrainees={NOMINAL_ROLL_DATA.length}
          onCancel={() => setShowReviewModal(false)}
          onConfirm={() => { setShowReviewModal(false); onBack(); }}
        />
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function CreateBooking2({ onClose }: { onClose: () => void }) {
  const [sessionType, setSessionType] = useState<SessionType>("Standalone");
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>(null);
  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      <TopBar
        onBack={selectedProgram ? () => setSelectedProgram(null) : onClose}
        programLabel={selectedProgram ?? undefined}
        sessionType={selectedProgram ? sessionType : undefined}
      />
      {!selectedProgram ? (
        <ProgramSelection sessionType={sessionType} setSessionType={setSessionType} onSelect={setSelectedProgram} />
      ) : (
        <BookingForm program={selectedProgram} sessionType={sessionType} onBack={() => setSelectedProgram(null)} />
      )}
    </div>
  );
}
