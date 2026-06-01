import { Trash2 } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal-1";
import type { Cluster } from "../types";

interface Props {
  cluster:   Cluster;
  onClose:   () => void;
  onConfirm: (id: string) => void;
}

export function DeleteConfirmModal({ cluster, onClose, onConfirm }: Props) {
  return (
    <Modal open={true} onClose={onClose} width={420} isUseX={false}>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Delete Cluster</h2>
          <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg px-4 py-3 mb-6 border border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Cluster Name</p>
        <p className="text-sm font-semibold text-gray-800">{cluster.name}</p>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-900">{cluster.name}</span>? This
        record will be permanently removed.
      </p>

      <div className="flex gap-3">
        <Button
          type="outline"
          onClick={onClose}
          className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 text-gray-700 justify-center"
        >
          Cancel
        </Button>
        <Button
          onClick={() => { onConfirm(cluster.id); onClose(); }}
          className="flex-1 py-2.5 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white justify-center"
        >
          Delete Cluster
        </Button>
      </div>
    </Modal>
  );
}
