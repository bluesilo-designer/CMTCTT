import { Cpu, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal-1";
import { StatusBadge } from "../components/StatusBadge";
import type { Cluster } from "../types";

interface Props {
  cluster: Cluster;
  onClose: () => void;
  onEdit?: (cluster: Cluster) => void;
}

export function ViewClusterModal({ cluster, onClose, onEdit }: Props) {
  const [date, time] = cluster.updatedOn.split("\n");

  return (
    <Modal open={true} onClose={onClose} width={480} isUseX={true}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <Cpu size={20} className="text-brand-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Cluster Detail</h2>
          <p className="text-sm text-gray-500 mt-0.5">{cluster.name}</p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Cluster Name</span>
          <span className="text-sm font-semibold text-gray-800">{cluster.name}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Status</span>
          <StatusBadge status={cluster.status} />
        </div>

        <div className="flex items-start justify-between py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Blackout Dates</span>
          <div className="text-right max-w-[260px]">
            {cluster.blackoutDates.length === 0 ? (
              <span className="text-sm text-gray-400">No blackout dates</span>
            ) : (
              <div className="flex flex-wrap gap-1.5 justify-end">
                {cluster.blackoutDates.map((d, i) => (
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
        {onEdit && (
          <Button
            onClick={() => { onClose(); onEdit(cluster); }}
            className="flex-1 py-2.5 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover justify-center"
          >
            Edit Cluster
          </Button>
        )}
      </div>
    </Modal>
  );
}
