import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { TableCustom } from "@/components/table";
import { BOOKING_DETAILS } from "../constants";
import { BookingStatusPill } from "./BookingStatusPill";
import type { Assignment } from "@/data/systemHardware";

interface BookingRow {
  rowLabel: string;
  bookingId: string;
  program: string;
  displayBookingId: string;
  trainingType: string;
  trainingMode: string;
  bookingTime: string;
  status: string;
  trainees: string | number;
}

interface BookingSubTableProps {
  assignment: Assignment;
  parentNo: number;
}

export function BookingSubTable({ assignment, parentNo }: BookingSubTableProps) {
  const rows: BookingRow[] = useMemo(
    () =>
      assignment.bookings.map((bkId, bkIdx) => {
        const detail = BOOKING_DETAILS[bkId];
        return {
          rowLabel: `${parentNo}-${bkIdx + 1}`,
          bookingId: bkId,
          program: detail?.program ?? bkId,
          displayBookingId: detail?.bookingId ?? bkId,
          trainingType: detail?.trainingType ?? "—",
          trainingMode: detail?.trainingMode ?? "—",
          bookingTime: detail?.bookingTime ?? "—",
          status: detail?.status ?? "",
          trainees: detail?.trainees ?? "—",
        };
      }),
    [assignment.bookings, parentNo],
  );

  const columns = useMemo<ColumnDef<BookingRow, any>[]>(
    () => [
      {
        id: "rowLabel",
        header: () => "No",
        cell: (info: any) => (
          <div className="text-sm text-gray-500">{info.row.original.rowLabel}</div>
        ),
      },
      {
        id: "bookingInfo",
        header: () => "Booking ID",
        cell: (info: any) => (
          <div>
            <p className="text-sm font-medium text-gray-800 leading-snug">{info.row.original.program}</p>
            <p className="text-xs text-gray-400 mt-0.5">Booking ID - {info.row.original.displayBookingId}</p>
          </div>
        ),
      },
      {
        id: "trainingType",
        header: () => "Training Type",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">{info.row.original.trainingType}</div>
        ),
      },
      {
        id: "trainingMode",
        header: () => "Training Mode",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">{info.row.original.trainingMode}</div>
        ),
      },
      {
        id: "bookingTime",
        header: () => "Booking Time",
        // @ts-ignore — normalWhitespace is a custom extension read by TableCustom
        normalWhitespace: "true",
        cell: (info: any) => (
          <div className="text-sm text-gray-700 whitespace-pre-line leading-snug">
            {info.row.original.bookingTime}
          </div>
        ),
      },
      {
        id: "status",
        header: () => "Status",
        cell: (info: any) =>
          info.row.original.status ? (
            <BookingStatusPill status={info.row.original.status} />
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          ),
      },
      {
        id: "unitName",
        header: () => "Unit Name",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">{String(info.row.original.trainees)}</div>
        ),
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: () => (
          <button
            className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-red-50 rounded-lg transition-colors"
            title="View booking details"
          >
            <Eye size={15} />
          </button>
        ),
      },
    ],
    [],
  );

  return (
    <div className="bg-red-50/30 border-t border-red-100">
      <TableCustom
        columns={columns}
        data={rows}
        autoScrollTable={true}
        classThead="bg-red-50/60"
      />
    </div>
  );
}
