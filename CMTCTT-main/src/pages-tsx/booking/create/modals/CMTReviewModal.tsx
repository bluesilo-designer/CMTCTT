import { FileText } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal-1";
import type { IosEntry } from "../components/CMTCabinConfigStep";

// ── Field component (label on top, value below) ────────────────────────────────

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-gray-800 leading-snug">{value || "—"}</p>
    </div>
  );
}

function SectionDivider() {
  return <div className="border-t border-gray-100 my-3" />;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CMTReviewModalProps {
  totalTrainees:  number;
  bookingType:    string;
  cabin:          number;
  vehicleType:    string;
  weaponVariant:  string;
  role:           string;
  instructor:     string;
  unitContact:    string;
  trainingSchedule: string;
  briefingRoom:   string;
  trainingDate:   string;
  iosList?:       IosEntry[];
  onCancel:       () => void;
  onConfirm:      () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CMTReviewModal({
  totalTrainees,
  bookingType,
  cabin,
  vehicleType,
  weaponVariant,
  role,
  instructor,
  unitContact,
  trainingSchedule,
  briefingRoom,
  trainingDate,
  iosList,
  onCancel,
  onConfirm,
}: CMTReviewModalProps) {
  return (
    <Modal open={true} onClose={onCancel} width={620} isUseX={false}>
      {/* Outer flex container — constrains total height to viewport */}
      <div className="flex flex-col" style={{ maxHeight: "calc(90vh - 3rem)" }}>

        {/* ── Fixed header (never scrolls) ─────────────────────── */}
        <div className="flex-shrink-0">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-brand-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">Review Your Booking Details</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Please verify the information below before confirming your booking.
              </p>
            </div>
          </div>

          {/* Total Trainee — pinned below header */}
          <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
            <span className="text-sm text-gray-500">Total Trainee</span>
            <span className="text-sm font-bold text-gray-800">{totalTrainees} Trainees</span>
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6">

          <SectionDivider />

          {/* 2-column grid: all booking fields */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-1">
            <DetailField label="Booking Type"        value={bookingType} />
            <DetailField label="Vehicle Type"        value={vehicleType} />
            <DetailField label="Cabin"               value={`${cabin} Cabin${cabin !== 1 ? "s" : ""}`} />
            <DetailField label="Weapon Variant"      value={weaponVariant} />
            <DetailField label="Role"                value={role} />
            <DetailField label="Instructor"          value={instructor} />
            <DetailField label="Unit Contact Details" value={unitContact} />
            <DetailField label="Training Schedule"   value={trainingSchedule} />
            <DetailField label="Briefing Room"       value={briefingRoom} />
            <DetailField label="Training Date"       value={trainingDate} />
          </div>

          {/* IOS Configuration — full width */}
          {iosList && iosList.length > 0 && (
            <>
              <SectionDivider />
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  IOS Configuration
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {iosList.map((ios, i) => (
                    <div key={ios.uid} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                      <p className="text-xs font-bold text-gray-600 mb-1">IOS {i + 1}</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {ios.iosDevice || "—"}{ios.baseStation ? ` · ${ios.baseStation}` : ""}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Master: {ios.masterIOS || "—"} &nbsp;·&nbsp; {ios.forceType || "—"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <SectionDivider />

          {/* Footer note */}
          <p className="text-xs text-gray-400 pb-3 leading-relaxed">
            Ensure you arrive 15 minutes before the scheduled time. You must bring your
            identity card and any required equipment.
          </p>
        </div>

        {/* ── Fixed footer buttons (never scrolls) ─────────────── */}
        <div className="flex-shrink-0 -mx-6 -mb-6 px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-3">
          <Button
            type="outline"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 justify-center"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover justify-center"
          >
            Confirm
          </Button>
        </div>

      </div>
    </Modal>
  );
}
