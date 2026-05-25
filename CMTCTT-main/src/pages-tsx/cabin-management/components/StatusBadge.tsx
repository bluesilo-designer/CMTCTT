import { cn } from "@/lib/utils";
import type { CabinStatus } from "../types";

const STATUS_STYLES: Record<CabinStatus, string> = {
  Available:   "bg-green-50 text-green-600 border-green-200",
  Degraded:    "bg-amber-50 text-amber-600 border-amber-200",
  Unavailable: "bg-red-50 text-red-500 border-red-200",
};

export function StatusBadge({ status }: { status: CabinStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border text-xs font-semibold px-2.5 py-0.5",
        STATUS_STYLES[status] ?? "bg-gray-50 text-gray-500 border-gray-200"
      )}
    >
      {status}
    </span>
  );
}
