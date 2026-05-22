import { useState } from "react";
import { Award, Plus } from "lucide-react";
import { Modal } from "@/components/modal-1";
import { InputCustom } from "@/components/input";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import type { Rank } from "@/data/userManagement";
import type { ModalMode } from "../types";

interface RankModalProps {
  mode: ModalMode;
  rank?: Rank;
  onClose: () => void;
  onConfirm: (rankName: string, sequence: number, status: "Active" | "Inactive") => void;
}

export function RankModal({ mode, rank, onClose, onConfirm }: RankModalProps) {
  const [rankName, setRankName] = useState(rank?.rank ?? "");
  const [sequence, setSequence] = useState<string>(rank ? String(rank.sequence) : "");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const isValid = rankName.trim() !== "" && sequence !== "" && !isNaN(Number(sequence));

  return (
    <Modal open={true} onClose={onClose} isUseX={false} width={448}>
      {/* Header */}
      <div className="flex items-start gap-4 pb-4">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            mode === "edit" ? "bg-red-100" : "bg-green-100"
          )}
        >
          {mode === "edit" ? (
            <Award size={20} className="text-brand-primary" />
          ) : (
            <Plus size={20} className="text-green-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-800">
            {mode === "edit" ? "Edit Rank" : "Add Rank"}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">Please fill all the information.</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4 pb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Rank <span className="text-red-500">*</span>
          </label>
          <InputCustom
            type="text"
            value={rankName}
            onChange={(e) => setRankName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
            placeholder="Enter rank (e.g. CPT)"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Sequence <span className="text-red-500">*</span>
          </label>
          <InputCustom
            type="number"
            min={1}
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
            placeholder="Enter sequence number"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
              className="w-full appearance-none px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all cursor-pointer pr-8"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <svg
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors bg-white"
        >
          Cancel
        </Button>
        <Button
          onClick={() => { if (isValid) onConfirm(rankName.trim(), Number(sequence), status); }}
          disabled={!isValid}
          className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
