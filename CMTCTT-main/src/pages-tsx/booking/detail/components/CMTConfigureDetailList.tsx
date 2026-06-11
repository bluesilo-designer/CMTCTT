import { useState, useRef, useEffect, useCallback } from "react";
import {
  X, Plus, ChevronDown,
  ArrowLeft, Pencil, Check, Trash2, GripVertical,
} from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EditableTrainee {
  _id:      string;
  role:     string;
  name:     string;
  nric:     string;
  rank:     string;
  callsign: string;
  batch:    string;
  course:   string;
  unit:     string;
}

export interface EditableCabin {
  _id:          string;
  cabin:        string;
  platformType: string;
  callsign:     string;
  trainees:     EditableTrainee[];
}

interface PointerDrag {
  traineeId:     string;
  sourceCabinId: string;
  role:          string;
  name:          string;
  rank:          string;
  cursorX:       number;
  cursorY:       number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ROLES = ["VC", "VO", "TC/PC", "TC", "SC", "SO"];

const PLATFORM_OPTIONS = [
  "Terrex 50 HMG",
  "Terrex 40 AGL",
  "L2SG",
  "PCSV Mortar",
  "ICV (TERREX)",
  "Engineer (BRONCO)",
];

const ROLE_COLOUR: Record<string, string> = {
  VC:      "bg-blue-100   text-blue-700",
  VO:      "bg-violet-100 text-violet-700",
  "TC/PC": "bg-orange-100 text-orange-700",
  TC:      "bg-orange-100 text-orange-700",
  SC:      "bg-emerald-100 text-emerald-700",
  SO:      "bg-gray-100   text-gray-600",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function RoleBadge({ role, sm }: { role: string; sm?: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded font-bold tracking-wide whitespace-nowrap",
      sm ? "px-1.5 py-0 text-[10px]" : "px-2 py-0.5 text-[11px]",
      ROLE_COLOUR[role] ?? "bg-gray-100 text-gray-600",
    )}>
      {role}
    </span>
  );
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

// ── Role picker ───────────────────────────────────────────────────────────────

function RolePicker({ value, onChange }: { value: string; onChange: (r: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onPointerDown={e => e.stopPropagation()} // don't start drag from role picker
        onClick={() => setOpen(v => !v)}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide cursor-pointer hover:opacity-80",
          ROLE_COLOUR[value] ?? "bg-gray-100 text-gray-600",
        )}
      >
        {value}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 py-1 min-w-[90px]">
          {ROLES.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => { onChange(r); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between gap-2"
            >
              <RoleBadge role={r} />
              {r === value && <Check size={11} className="text-green-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Add Detail modal ───────────────────────────────────────────────────────────

function AddDetailModal({ onAdd, onClose }: {
  onAdd: (c: Omit<EditableCabin, "_id" | "trainees">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState(PLATFORM_OPTIONS[0]);
  const [callsign, setCallsign] = useState("");
  const valid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-800">Add New Detail</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Detail Name</label>
            <input type="text" placeholder="e.g. CMT05" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Platform Type</label>
            <div className="relative">
              <select value={platform} onChange={e => setPlatform(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none pr-8">
                {PLATFORM_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Callsign</label>
            <input type="text" placeholder="e.g. 15Z" value={callsign} onChange={e => setCallsign(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button type="button" onClick={onClose}
            className="py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="button" disabled={!valid}
            onClick={() => { onAdd({ cabin: name.trim(), platformType: platform, callsign: callsign.trim() }); onClose(); }}
            className={cn("py-2.5 text-sm font-semibold rounded-lg", valid ? "bg-brand-primary text-white hover:bg-brand-primary-hover" : "bg-gray-100 text-gray-400 cursor-not-allowed")}>
            Add Detail
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assign Trainee modal ───────────────────────────────────────────────────────

// ── Editable cabin card ────────────────────────────────────────────────────────

function EditableCabinCard({
  cabin, drag, onPointerDownTrainee,
  onRemoveTrainee, onChangeRole, onRemoveCabin,
}: {
  cabin:                EditableCabin;
  drag:                 PointerDrag | null;
  onPointerDownTrainee: (e: React.PointerEvent, t: EditableTrainee) => void;
  onRemoveTrainee:      (traineeId: string, cabinId: string) => void;
  onChangeRole:         (traineeId: string, cabinId: string, role: string) => void;
  onRemoveCabin:        (cabinId: string) => void;
}) {
  const isCMT    = cabin.cabin.startsWith("CMT");
  const isDragging = drag !== null;
  const isSource = drag?.sourceCabinId === cabin._id;
  // Can swap only if destination cabin ALSO has a trainee with the same role
  const canDrop  = isDragging && !isSource
    && cabin.trainees.some(t => t.role === drag!.role);

  return (
    <div
      data-cabin-id={cabin._id}
      className={cn(
        "bg-white rounded-xl flex flex-col border-2 transition-colors",
        !isDragging                        && "border-gray-200",
        isDragging && canDrop              && "border-green-400 ring-2 ring-green-100 shadow-lg",
        isDragging && !canDrop && !isSource && "border-gray-100 opacity-40",
        isDragging && isSource             && "border-gray-200 opacity-60",
      )}
    >
      {/* Visual drop cue */}
      {isDragging && canDrop && (
        <div className="bg-green-500 text-white text-xs font-bold text-center py-1.5 rounded-t-xl">
          ↓ Move here
        </div>
      )}
      {isDragging && !canDrop && !isSource && (
        <div className="bg-gray-100 text-gray-400 text-xs text-center py-1.5 rounded-t-xl">
          No {drag!.role} role here
        </div>
      )}

      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-3 border-b border-gray-100",
        isCMT ? "bg-red-50/50" : "bg-blue-50/50",
      )}>
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded",
              isCMT ? "bg-red-100 text-brand-primary" : "bg-blue-100 text-blue-700")}>
              {isCMT ? "CMT" : "CTT"}
            </span>
            <p className="text-sm font-bold text-gray-800">{cabin.cabin}</p>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {cabin.platformType}{cabin.callsign && <> &bull; <span className="font-medium">{cabin.callsign}</span></>}
          </p>
        </div>
        <button type="button" onClick={() => onRemoveCabin(cabin._id)}
          className="text-gray-300 hover:text-red-400 p-1 rounded transition-colors">
          <Trash2 size={13} />
        </button>
      </div>

      {/* Trainee list */}
      <div className="flex-1 px-3 py-2 space-y-0.5" data-cabin-id={cabin._id}>
        {cabin.trainees.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-5" data-cabin-id={cabin._id}>
            {isDragging && canDrop ? "Release to drop here" : "No trainees assigned"}
          </p>
        )}
        {cabin.trainees.map(t => {
          const isBeingDragged = drag?.traineeId === t._id;
          return (
            <div
              key={t._id}
              data-cabin-id={cabin._id}
              onPointerDown={(e) => onPointerDownTrainee(e, t)}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-lg group select-none",
                isBeingDragged
                  ? "opacity-30 bg-blue-50 border border-dashed border-blue-300"
                  : "hover:bg-gray-50 cursor-grab active:cursor-grabbing",
              )}
            >
              <GripVertical size={12} className="text-gray-300 shrink-0" />
              <div onPointerDown={e => e.stopPropagation()}>
                <RolePicker value={t.role} onChange={role => onChangeRole(t._id, cabin._id, role)} />
              </div>
              <span className="text-[11px] text-gray-400 font-mono shrink-0 w-8">{t.rank}</span>
              <span className="flex-1 text-xs text-gray-700 truncate min-w-0" data-cabin-id={cabin._id}>{t.name}</span>
              <button type="button"
                onPointerDown={e => e.stopPropagation()}
                onClick={() => onRemoveTrainee(t._id, cabin._id)}
                className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 shrink-0 transition-colors">
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ── UID factory ────────────────────────────────────────────────────────────────

let _uid = 0;
const uid = () => `${++_uid}`;

function initEditable(groups: Array<{
  cabin: string; platformType: string; callsign: string;
  trainees: Array<{ role: string; name: string; nric: string; rank: string; callsign?: string; batch: string; course: string; unit: string }>;
}>): EditableCabin[] {
  return groups.map(g => ({
    _id: uid(), cabin: g.cabin, platformType: g.platformType, callsign: g.callsign,
    trainees: g.trainees.map(t => ({
      _id: uid(), role: t.role, name: t.name, nric: t.nric, rank: t.rank,
      callsign: t.callsign ?? "", batch: t.batch, course: t.course, unit: t.unit,
    })),
  }));
}

// ── Main component ─────────────────────────────────────────────────────────────

export function CMTConfigureDetailList({
  initialCabins, onClose, onSave,
}: {
  initialCabins: Array<{
    cabin: string; platformType: string; callsign: string;
    trainees: Array<{ role: string; name: string; nric: string; rank: string; callsign?: string; batch: string; course: string; unit: string }>;
  }>;
  onClose: () => void;
  onSave:  (cabins: EditableCabin[]) => void;
}) {
  const [cabins,        setCabins]        = useState<EditableCabin[]>(() => initEditable(initialCabins));
  const [showAddDetail, setShowAddDetail] = useState(false);
  const [hasChanges,    setHasChanges]    = useState(false);
  const [drag,          setDrag]          = useState<PointerDrag | null>(null);
  const dragRef = useRef<PointerDrag | null>(null);
  const cabinsRef = useRef(cabins);

  useEffect(() => { cabinsRef.current = cabins; }, [cabins]);

  const totalTrainees = cabins.reduce((s, c) => s + c.trainees.length, 0);

  // ── Pointer drag — global listeners ──────────────────────────────────────

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = { ...dragRef.current, cursorX: e.clientX, cursorY: e.clientY };
    setDrag({ ...dragRef.current });
  }, []);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;

    // Walk up from the element under cursor to find a cabin
    let el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    let targetCabinId: string | null = null;
    while (el) {
      if (el.dataset?.cabinId) { targetCabinId = el.dataset.cabinId; break; }
      el = el.parentElement;
    }

    if (targetCabinId && targetCabinId !== d.sourceCabinId) {
      setCabins(prev => {
        const target = prev.find(c => c._id === targetCabinId);
        // Destination must have a trainee with the same role
        if (!target || !target.trainees.some(t => t.role === d.role)) return prev;

        const next     = prev.map(c => ({ ...c, trainees: [...c.trainees] }));
        const srcCabin = next.find(c => c._id === d.sourceCabinId)!;
        const tgtCabin = next.find(c => c._id === targetCabinId)!;

        const srcIdx = srcCabin.trainees.findIndex(t => t._id === d.traineeId);
        if (srcIdx === -1) return prev;

        // Remove from source, add to destination
        const [trainee] = srcCabin.trainees.splice(srcIdx, 1);
        tgtCabin.trainees.push(trainee);

        return next;
      });
      setHasChanges(true);
    }

    dragRef.current = null;
    setDrag(null);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  // Attach / detach global listeners when drag is active
  useEffect(() => {
    if (!drag) return;
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup",   handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup",   handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [!!drag, handlePointerMove, handlePointerUp]);

  // ── Start drag ────────────────────────────────────────────────────────────

  const startDrag = (e: React.PointerEvent, t: EditableTrainee, cabinId: string) => {
    e.preventDefault();
    const d: PointerDrag = {
      traineeId: t._id, sourceCabinId: cabinId,
      role: t.role, name: t.name, rank: t.rank,
      cursorX: e.clientX, cursorY: e.clientY,
    };
    dragRef.current = d;
    setDrag(d);
    document.body.style.cursor    = "grabbing";
    document.body.style.userSelect = "none";
  };

  // ── Mutators ──────────────────────────────────────────────────────────────

  const mutate = (fn: (p: EditableCabin[]) => EditableCabin[]) => {
    setCabins(fn); setHasChanges(true);
  };

  const removeTrainee = (traineeId: string, cabinId: string) =>
    mutate(prev => prev.map(c =>
      c._id !== cabinId ? c : { ...c, trainees: c.trainees.filter(t => t._id !== traineeId) }
    ));

  const changeRole = (traineeId: string, cabinId: string, role: string) =>
    mutate(prev => prev.map(c =>
      c._id !== cabinId ? c : { ...c, trainees: c.trainees.map(t => t._id !== traineeId ? t : { ...t, role }) }
    ));

  const addDetail = (data: Omit<EditableCabin, "_id" | "trainees">) =>
    mutate(prev => [...prev, { _id: uid(), ...data, trainees: [] }]);

  const removeCabin = (cabinId: string) =>
    mutate(prev => prev.filter(c => c._id !== cabinId));


  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-gray-50 z-40 flex flex-col">

      {/* Top bar */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div>
            <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Pencil size={13} className="text-brand-primary" />
              Configure Detail List
            </p>
            <p className="text-xs text-gray-400">{cabins.length} Details &bull; {totalTrainees} Trainees</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <Button onClick={() => onSave(cabins)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover">
            <Check size={14} /> Save Changes
          </Button>
        </div>
      </div>

      {/* Drag hint */}
      {drag && (
        <div className="flex-shrink-0 bg-blue-600 text-white text-xs font-medium py-2 text-center">
          Moving <span className="font-bold">{drag.name}</span> ({drag.role}) — drop onto any cabin that has <span className="font-bold">{drag.role}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-5">
          <button type="button" onClick={() => setShowAddDetail(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-primary border border-dashed border-brand-primary/50 rounded-xl hover:bg-red-50 hover:border-brand-primary transition-colors">
            <Plus size={15} /> Add New Details
          </button>
        </div>

        {cabins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Plus size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No details yet</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add New Details" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {cabins.map(c => (
              <EditableCabinCard
                key={c._id}
                cabin={c}
                drag={drag}
                onPointerDownTrainee={(e, t) => startDrag(e, t, c._id)}
                onRemoveTrainee={removeTrainee}
                onChangeRole={changeRole}
                onRemoveCabin={removeCabin}
              />
            ))}
          </div>
        )}
      </div>

      {/* Ghost element — follows cursor, pointer-events:none so elementFromPoint works */}
      {drag && (
        <div
          style={{
            position: "fixed",
            left: drag.cursorX + 14,
            top:  drag.cursorY + 8,
            pointerEvents: "none",
            zIndex: 9999,
          }}
          className="bg-white border-2 border-blue-400 rounded-xl px-3 py-2 shadow-2xl flex items-center gap-2"
        >
          <GripVertical size={12} className="text-blue-300" />
          <RoleBadge role={drag.role} sm />
          <span className="text-[11px] text-gray-400 font-mono">{drag.rank}</span>
          <span className="text-xs font-semibold text-gray-800">{drag.name}</span>
        </div>
      )}

      {showAddDetail && (
        <AddDetailModal onAdd={addDetail} onClose={() => setShowAddDetail(false)} />
      )}
    </div>
  );
}
