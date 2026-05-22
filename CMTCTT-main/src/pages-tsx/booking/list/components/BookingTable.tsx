import { useMemo } from "react";
import { Eye, Clock, CheckCircle2, ArrowUpDown } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { TableCustom } from "@/components/table";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Booking } from "@/data/mock";
import { cn } from "@/lib/utils";
import { PER_PAGE } from "../constants";
import type { TabType } from "../types";
import { parseBookingTime } from "../utils";
import { BookingRowMenu } from "./BookingRowMenu";
import { CoursewareCell } from "./CoursewareCell";

interface BookingTableProps {
  paginated: Booking[];
  activeTab: TabType;
  currentPage: number;
  sortDir: "asc" | "desc";
  onToggleSort: () => void;
  onNavigate?: (path: string) => void;
}

const columnHelper = createColumnHelper<Booking>();

export function BookingTable({
  paginated,
  activeTab,
  currentPage,
  sortDir: _sortDir,
  onToggleSort,
  onNavigate,
}: BookingTableProps) {
  const columns = useMemo(() => {
    const cols = [
      columnHelper.display({
        id: "rowNum",
        header: () => "#",
        cell: (info) => (
          <div
            className="text-sm text-gray-500 font-medium cursor-pointer"
            onClick={() => onNavigate?.(`/bookings/detail?id=${info.row.original.id}`)}
          >
            {(currentPage - 1) * PER_PAGE + info.row.index + 1}
          </div>
        ),
      }),
      columnHelper.display({
        id: "booking",
        header: () => "Booking",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div
              className="cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              <div className="font-semibold text-sm text-gray-800 hover:text-brand-primary transition-colors leading-snug">
                {booking.program}
              </div>
              <div className="text-xs text-gray-400 mt-0.5 font-mono">{booking.bookingId}</div>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "type",
        header: () => "Type",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div
              className="cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              <span className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
                booking.trainingType === "Group"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              )}>
                {booking.trainingType}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "bookingTime",
        header: () => (
          <button
            onClick={onToggleSort}
            className="flex items-center gap-1 hover:text-brand-primary-hover transition-colors"
          >
            Booking Time
            <ArrowUpDown size={11} className="text-gray-400" />
          </button>
        ),
        cell: (info) => {
          const booking = info.row.original;
          const { date, timeRange, label } = parseBookingTime(booking.bookingTime);
          return (
            <div
              className="cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              <div className="text-sm font-semibold text-gray-700">{date}</div>
              {timeRange && (
                <div className="text-xs text-gray-500 mt-0.5">{timeRange}</div>
              )}
              {label && (
                <div className="text-[10px] text-gray-400 mt-0.5 italic">{label}</div>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "status",
        header: () => "Status",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div
              className="cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              <StatusBadge status={booking.status} />
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "mode",
        header: () => "Mode",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              {booking.trainingMode}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "courseware",
        header: () => "Courseware",
        cell: (info) => <CoursewareCell text={info.row.original.courseware} />,
      }),
      columnHelper.display({
        id: "unit",
        header: () => "Unit",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div
              className="text-sm text-gray-600 cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              {booking.unitName}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "action",
        header: () => "",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div className="flex items-center justify-center gap-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate?.(`/bookings/detail?id=${booking.id}`); }}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-brand-primary transition-colors"
                title="View Details"
              >
                <Eye size={14} />
              </button>
              {(booking.status === "Upcoming" || booking.status === "Ongoing" || booking.status === "Return Assets") && (
                <BookingRowMenu onView={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)} />
              )}
            </div>
          );
        },
      }),
    ];

    // Conditionally insert the Assets column before Mode (index 5) when not on Completed tab
    if (activeTab !== "Completed") {
      const assetsCol = columnHelper.display({
        id: "assets",
        header: () => "Assets",
        cell: (info) => {
          const booking = info.row.original;
          return (
            <div
              className="cursor-pointer"
              onClick={() => onNavigate?.(`/bookings/detail?id=${booking.id}`)}
            >
              {booking.assetIssued ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                  <CheckCircle2 size={10} /> Issued
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                  <Clock size={10} /> Pending
                </span>
              )}
            </div>
          );
        },
      });
      cols.splice(5, 0, assetsCol);
    }

    return cols;
  }, [activeTab, currentPage, onNavigate, onToggleSort]);

  return (
    <TableCustom
      columns={columns}
      data={paginated}
      autoScrollTable={true}
      classThead="bg-red-50/70"
      classTheadTh="text-brand-primary text-xs font-semibold"
    />
  );
}

