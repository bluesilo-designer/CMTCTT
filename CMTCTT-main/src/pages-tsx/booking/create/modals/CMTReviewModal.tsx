import { FileText } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal-1";

// ── Row component ─────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-800 text-right ml-4 max-w-[55%]">{value || "—"}</span>
    </div>
  );
}

function SectionDivider() {
  return <div className="border-t border-gray-100 my-1" />;
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
  onCancel,
  onConfirm,
}: CMTReviewModalProps) {
  return (
    <Modal open={true} onClose={onCancel} width={520} isUseX={false}>

      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
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

      {/* Total Trainee */}
      <div className="flex items-center justify-between py-2.5 border-b border-gray-200 mb-1">
        <span className="text-sm text-gray-600">Total Trainee</span>
        <span className="text-sm font-bold text-gray-800">{totalTrainees} Trainees</span>
      </div>

      <SectionDivider />

      {/* Booking info */}
      <div className="py-1">
        <DetailRow label="Booking Type"   value={bookingType} />
        <DetailRow label="Cabin"          value={`${cabin} Cabins`} />
        <DetailRow label="Vehicle Type"   value={vehicleType} />
        <DetailRow label="Weapon Variant" value={weaponVariant} />
        <DetailRow label="Role"           value={role} />
      </div>

      <SectionDivider />

      {/* Unit info */}
      <div className="py-1">
        <DetailRow label="Instructor"          value={instructor} />
        <DetailRow label="Unit Contact Details" value={unitContact} />
      </div>

      <SectionDivider />

      {/* Schedule info */}
      <div className="py-1">
        <DetailRow label="Training Schedule" value={trainingSchedule} />
        <DetailRow label="Briefing Room"     value={briefingRoom} />
        <DetailRow label="Training Date"     value={trainingDate} />
      </div>

      <SectionDivider />

      {/* Footer note */}
      <p className="text-xs text-gray-400 mt-2 mb-5 leading-relaxed">
        Ensure you arrive 15 minutes before the scheduled time. You must bring your
        identity card and any required equipment.
      </p>

      {/* Actions */}
      <div className="-mx-6 -mb-6 px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-3">
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

    </Modal>
  );
}
