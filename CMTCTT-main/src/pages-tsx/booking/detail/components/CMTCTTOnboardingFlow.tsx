import { useState } from "react";
import { ArrowLeft, Bell, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/button";
import { CMTCTTOnboardingCabinConfig } from "./CMTCTTOnboardingCabinConfig";
import { CMTAttendanceStep } from "./CMTAttendanceStep";
import { CMTCTTConfirmDetailList } from "./CMTCTTConfirmDetailList";
import { CMTCTTLiveTrainingDashboard } from "./CMTCTTLiveTrainingDashboard";
import { useBookingStore } from "../store/useBookingStore";

// ── IOS Top Bar ───────────────────────────────────────────────────────────────

function CMTCTTIOSTopBar({ onClose }: { onClose: () => void }) {
  const booking = useBookingStore((s) => s.booking);

  return (
    <div className="h-14 border-b border-gray-200 relative flex items-center px-6 bg-white flex-shrink-0">
      {/* Back arrow */}
      <Button
        onClick={onClose}
        className="w-8 h-8 p-0 flex items-center justify-center bg-transparent text-gray-600 hover:bg-gray-100 w-auto z-10"
      >
        <ArrowLeft size={18} />
      </Button>

      {/* Center: title + IOS badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-2">
        <span className="text-sm font-semibold text-gray-800">
          {booking?.title ?? "CMT CTT Training for Unit 19"}
        </span>
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-brand-primary text-white tracking-wide">
          IOS
        </span>
      </div>

      {/* Right: datetime, location, notification, user */}
      <div className="ml-auto flex items-center gap-3 text-sm text-gray-500 flex-shrink-0 z-10">
        <span className="hidden md:block text-xs">Thursday, 05 December 2024&nbsp;&nbsp;01:03:33 PM</span>

        {/* Location badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 bg-white">
          <MapPin size={12} className="text-brand-primary flex-shrink-0" />
          <span className="text-xs font-medium text-gray-700 hidden lg:block">Kranji Camp</span>
          <span className="text-xs font-bold text-gray-700">KC</span>
        </div>

        {/* Notification bell */}
        <div className="relative">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-primary rounded-full" />
        </div>

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">
            OR
          </div>
          <div className="leading-tight hidden md:block">
            <div className="text-xs font-medium text-gray-800">Olivia Rhye</div>
            <div className="text-[10px] text-gray-400">Admin</div>
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

// ── CMT+CTT Onboarding Flow ───────────────────────────────────────────────────
//
//  Step 0 → Confirm Attendance       (CMTAttendanceStep)
//  Step 1 → Cabin / Cluster Config   (CMTCTTOnboardingCabinConfig)
//  Step 2 → Confirm Detail List      (CMTCTTConfirmDetailList)
//             → Review Modal → Start Session overlay → step 3
//  Step 3 → Live Training Dashboard  (CMTCTTLiveTrainingDashboard)
//             → ← in IOS top bar calls onClose
//

export function CMTCTTOnboardingFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      <CMTCTTIOSTopBar onClose={onClose} />

      {/* Step 0: Confirm Attendance */}
      {step === 0 && (
        <CMTAttendanceStep
          onBack={onClose}
          onConfirm={() => setStep(1)}
        />
      )}

      {/* Step 1: Cabin / Cluster Configuration */}
      {step === 1 && (
        <CMTCTTOnboardingCabinConfig
          onBack={() => setStep(0)}
          onConfirm={() => setStep(2)}
        />
      )}

      {/* Step 2: Confirm Detail List → Review → Start Session */}
      {step === 2 && (
        <CMTCTTConfirmDetailList
          onBack={() => setStep(1)}
          onConfirm={() => setStep(3)}
        />
      )}

      {/* Step 3: Live Training Dashboard */}
      {step === 3 && (
        <CMTCTTLiveTrainingDashboard />
      )}
    </div>
  );
}
