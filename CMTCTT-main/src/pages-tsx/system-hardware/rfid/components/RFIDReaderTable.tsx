import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { TableCustom } from "@/components/table";
import { Checkbox } from "@/components/checkbox";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { SortIcon, type SortDir } from "@/lib/sortUtils";
import { RowActionMenu } from "./RowActionMenu";
import { PER_PAGE } from "../constants";
import type { RFIDReader } from "../types";

interface RFIDReaderTableProps {
  data: RFIDReader[];
  currentPage: number;
  totalItems: number;
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  sortField: string;
  sortDir: SortDir;
  onSort: (field: string) => void;
  onToggleAll: () => void;
  onToggleSelect: (id: string) => void;
  onEdit: (reader: RFIDReader) => void;
  onDelete: (ids: Set<string>) => void;
  onPageChange: (page: number) => void;
}

interface RFIDReaderRow extends RFIDReader {
  _idx: number;
}

export function RFIDReaderTable({
  data,
  currentPage,
  totalItems,
  selected,
  allSelected,
  someSelected,
  sortField,
  sortDir,
  onSort,
  onToggleAll,
  onToggleSelect,
  onEdit,
  onDelete,
  onPageChange,
}: RFIDReaderTableProps) {

  const rows: RFIDReaderRow[] = useMemo(
    () =>
      data.map((reader, idx) => ({
        ...reader,
        _idx: (currentPage - 1) * PER_PAGE + idx + 1,
      })),
    [data, currentPage],
  );

  const columns = useMemo<ColumnDef<RFIDReaderRow, any>[]>(
    () => [
      {
        id: "select",
        width: 48,
        minWidth: 48,
        maxWidth: 48,
        header: () => (
          <Checkbox
            id="select-all"
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={() => onToggleAll()}
            size={16}
          />
        ),
        cell: (info) => (
          <Checkbox
            id={`select-${info.row.original.id}`}
            checked={selected.has(info.row.original.id)}
            onChange={() => onToggleSelect(info.row.original.id)}
            size={16}
          />
        ),
      },
      {
        id: "no",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        header: () => "No",
        cell: (info) => (
          <div className="text-sm text-gray-700">{info.row.original._idx}</div>
        ),
      },
      {
        id: "displayName",
        accessorKey: "displayName",
        header: () => (
          <button
            onClick={() => onSort("displayName")}
            className="flex items-center gap-1 hover:text-brand-primary-hover transition-colors"
          >
            Display Name <SortIcon active={sortField === "displayName"} dir={sortDir} />
          </button>
        ),
        cell: (info) => (
          <div className="text-sm text-gray-800 font-medium">{info.row.original.displayName}</div>
        ),
      },
      {
        id: "macAddress",
        header: () => "Reader MAC Address",
        cell: (info) => (
          <div className="text-sm text-gray-700 font-mono">{info.row.original.macAddress}</div>
        ),
      },
      {
        id: "status",
        header: () => "Status",
        cell: (info) => {
          const status = info.row.original.status;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5",
                status === "Active"
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-orange-50 text-orange-500 border-orange-200",
              )}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: "armStatus",
        header: () => "Arm Status",
        cell: (info) => (
          <span className="inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5 bg-green-50 text-green-600 border-green-200">
            {info.row.original.armStatus}
          </span>
        ),
      },
      {
        id: "serialNumber",
        header: () => "Serial Number",
        cell: (info) => (
          <div className="text-sm text-gray-700 font-mono">{info.row.original.serialNumber}</div>
        ),
      },
      {
        id: "ipAddress",
        header: () => "IP Address",
        cell: (info) => (
          <div className="text-sm text-gray-700 font-mono">{info.row.original.ipAddress}</div>
        ),
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: (info) => {
          const reader = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(reader)}
                className="text-gray-400 hover:text-brand-primary p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <RowActionMenu
                onEdit={() => onEdit(reader)}
                onDelete={() => onDelete(new Set([reader.id]))}
              />
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSelected, someSelected, selected, sortField, sortDir],
  );

  return (
    <div>
      <TableCustom columns={columns} data={rows} autoScrollTable={true} />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={PER_PAGE}
        totalItems={totalItems}
        setCurrentPage={onPageChange}
      />
    </div>
  );
}
