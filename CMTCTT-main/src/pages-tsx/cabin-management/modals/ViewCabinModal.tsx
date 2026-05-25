import { DoorOpen, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal-1";
import { StatusBadge } from "../components/StatusBadge";
import type { Cabin } from "../types";

interface Props {
  cabin: Cabin;
  onClose: () => void;
  onEdit: (cabin: Cabin) => void;
}

export function ViewCabinModal({ cabin, onClose, onEdit }: Props) {
  const [date, time] = cabin.updatedOn.split("\n");

  return (
    <Modal open={true} onClose={onClose} width={480} isUseX={true}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <DoorOpen size={20} className="text-brand-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Cabin Detail</h2>
          <p className="text-sm text-gray-500 mt-0.5">{cabin.name}</p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Cabin Name</span>
          <span className="text-sm font-semibold text-gray-800">{cabin.name}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Status</span>
          <StatusBadge status={cabin.status} />
        </div>

        <div className="flex items-start justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Blackout Dates</span>
          <div className="text-right max-w-[260px]">
            {cabin.blackoutDates.length === 0 ? (
              <span className="text-sm text-gray-400">No blackout dates</span>
            ) : (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {cabin.blackoutDates.map((d, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs rounded-full"
                  >
                    <Calendar size={10} />
                    {d.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-sm text-gray-500 font-medium">Last Updated</span>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-sm text-gray-800 justify-end">
              <Calendar size={12} className="text-gray-400" />
              {date}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-end mt-0.5">
              <Clock size={11} className="text-gray-300" />
              {time}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="outline"
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 justify-center"
        >
          Close
        </Button>
        <Button
          onClick={() => { onClose(); onEdit(cabin); }}
          className="flex-1 py-2.5 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover justify-center"
        >
          Edit Cabin
        </Button>
      </div>
    </Modal>
  );
}
