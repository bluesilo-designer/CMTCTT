import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { TableCustom } from "@/components/table";
import { Checkbox } from "@/components/checkbox";
import { Pagination } from "@/components/ui/Pagination";
import { SortIcon, type SortDir } from "@/lib/sortUtils";
import { PER_PAGE } from "../constants";
import type { AntennaEntry, AntennaRow } from "../types";

interface AntennaTableProps {
  data: AntennaEntry[];
  currentPage: number;
  selected: Set<string>;
  allSelected: boolean;
  someSelected: boolean;
  sortField: string;
  sortDir: SortDir;
  onPageChange: (page: number) => void;
  onSort: (field: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

export function AntennaTable({
  data,
  currentPage,
  selected,
  allSelected,
  someSelected,
  sortField,
  sortDir,
  onPageChange,
  onSort,
  onToggleSelect,
  onToggleAll,
}: AntennaTableProps) {

  const rows: AntennaRow[] = useMemo(
    () =>
      data
        .slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
        .map((entry, idx) => ({
          ...entry,
          _idx: (currentPage - 1) * PER_PAGE + idx + 1,
        })),
    [currentPage, data]
  );

  const columns = useMemo<ColumnDef<AntennaRow, any>[]>(
    () => [
      {
        id: "select",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        header: () => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={() => onToggleAll()}
              size={16}
            />
          </div>
        ),
        cell: ({ row }: any) => (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected.has(row.original.id)}
              onChange={() => onToggleSelect(row.original.id)}
              size={16}
            />
          </div>
        ),
      },
      {
        id: "no",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        header: () => "No",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original._idx}</div>
        ),
      },
      {
        id: "station",
        header: () => "Station",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-800 font-medium">{row.original.station}</div>
        ),
      },
      {
        id: "rfidReader",
        header: () => "RFID Reader",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original.rfidReader}</div>
        ),
      },
      {
        id: "antennaPortNumber",
        header: () => "Antenna Port Number",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700 font-mono">{row.original.antennaPortNumber}</div>
        ),
      },
      {
        id: "antenna",
        accessorKey: "antenna",
        header: () => (
          <button
            onClick={() => onSort("antenna")}
            className="flex items-center gap-1 hover:text-brand-primary-hover transition-colors"
          >
            Antenna <SortIcon active={sortField === "antenna"} dir={sortDir} />
          </button>
        ),
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original.antenna}</div>
        ),
      },
      {
        id: "antennaKey",
        header: () => "Antenna Key",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original.antennaKey}</div>
        ),
      },
      {
        id: "gpo",
        header: () => "GPO",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original.gpo}</div>
        ),
      },
      {
        accessorKey: "action",
        header: () => "Actions",
        cell: () => (
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={16} />
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allSelected, someSelected, selected, sortField, sortDir]
  );

  return (
    <div>
      <TableCustom columns={columns} data={rows} autoScrollTable={true} />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={PER_PAGE}
        totalItems={data.length}
        setCurrentPage={onPageChange}
      />
    </div>
  );
}
