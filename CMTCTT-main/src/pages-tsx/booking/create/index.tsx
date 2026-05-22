import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { BookingDetailsStep } from "./components/BookingDetailsStep";
import { LaneConfigStep } from "./components/LaneConfigStep";
import { NominalRollStep } from "./components/NominalRollStep";
import { ScheduleStep } from "./components/ScheduleStep";
import { ReviewModal } from "./modals/ReviewModal";
import { PROGRAMS, STEPS, NOMINAL_ROLL_DATA } from "./constants";
import type { SessionType, ProgramType, BookingDetailsSnapshot, ScheduleSnapshot } from "./types";

// ── Stepper ───────────────────────────────────────────────────────────────────
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
      <Button
        type="outline"
        onClick={onBack}
        className="h-8 aspect-square p-0 flex items-center justify-center rounded-md border-0 text-gray-600 hover:bg-gray-100 w-auto"
      >
        <ArrowLeft size={18} />
      </Button>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {programLabel ? (
          <>
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              Book Your {programLabel} Training Program
            </span>
            {sessionType && (
              <span className="text-[10px] text-gray-400 mt-0.5 leading-none">{sessionType} Session</span>
            )}
          </>
        ) : (
          <span className="text-sm font-semibold text-gray-800">Create New Booking</span>
        )}
      </div>
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
  sessionType: SessionType;
  setSessionType: (t: SessionType) => void;
  onSelect: (p: ProgramType) => void;
}) {
  const [hovered, setHovered] = useState<ProgramType>(null);
  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex flex-col items-center py-10 px-6">
      <h1 className="text-xl font-semibold text-brand-primary mb-2">Create New Booking</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
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

// ── Booking Form (step orchestrator) ──────────────────────────────────────────
function BookingForm({ sessionType, onBack }: { sessionType: SessionType; onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [trainingMode, setTrainingMode] = useState("");
  const [detailsSnapshot, setDetailsSnapshot] = useState<BookingDetailsSnapshot>({
    weapons: [], weaponSummary: "", baseQty: "2", cShapedQty: "0", courseware: "", trainingType: "", roles: [],
  });
  const [scheduleSnapshot, setScheduleSnapshot] = useState<ScheduleSnapshot>({
    scheduleType: null, section: null, briefing: false, selectedDate: null,
  });

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
        <Button
          type="outline"
          onClick={step === 0 ? onBack : () => setStep(step - 1)}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-gray-700 w-auto border border-gray-300"
        >
          <ArrowLeft size={14} /> Back
        </Button>
        <Stepper current={step} />
        <div className="flex items-center gap-2">
          {(step === 1 || step === 2) && (
            <Button
              type="outline"
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-300"
            >
              Skip Step
            </Button>
          )}
          {isLastStep ? (
            <Button
              onClick={() => setShowReviewModal(true)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Confirm Booking
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
            >
              Next <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </div>

      {step === 0 && (
        <BookingDetailsStep
          trainingMode={trainingMode}
          onModeChange={setTrainingMode}
          onUpdate={setDetailsSnapshot}
        />
      )}
      {step === 1 && (
        <LaneConfigStep
          trainingMode={trainingMode}
          bookingWeapons={detailsSnapshot.weapons}
          bookingRoles={detailsSnapshot.roles}
          numBase={parseInt(detailsSnapshot.baseQty) || 1}
          numCShaped={parseInt(detailsSnapshot.cShapedQty) || 0}
          bookingCourseware={detailsSnapshot.courseware}
        />
      )}
      {step === 2 && <NominalRollStep onNext={() => setStep(3)} sessionType={sessionType} />}
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

// ── Main export ───────────────────────────────────────────────────────────────
export function CreateBooking({ onClose }: { onClose: () => void }) {
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
        <BookingForm sessionType={sessionType} onBack={() => setSelectedProgram(null)} />
      )}
    </div>
  );
}
