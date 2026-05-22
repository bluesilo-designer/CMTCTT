import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/data/mock";

interface StatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<BookingStatus, { bg: string; text: string; border: string }> = {
  Upcoming: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  Ongoing: { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-200" },
  Completed: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  Cancelled: { bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  Overdue: { bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
  "Return Assets": { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        cfg.bg,
        cfg.text,
        cfg.border,
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-0.5"
      )}
    >
      {status}
    </span>
  );
}
