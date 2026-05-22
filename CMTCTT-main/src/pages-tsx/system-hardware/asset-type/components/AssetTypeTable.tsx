import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import { TableCustom } from "@/components/table";
import { Checkbox } from "@/components/checkbox";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { SortIcon, type SortDir } from "@/lib/sortUtils";
import { PER_PAGE } from "../constants";
import type { AssetTypeData, AssetTypeRow } from "../types";

interface AssetTypeTableProps {
  data: AssetTypeData[];
  currentPage: number;
  selected: Set<string>;
  sortField: string;
  sortDir: SortDir;
  onPageChange: (page: number) => void;
  onSort: (field: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
}

export function AssetTypeTable({
  data,
  currentPage,
  selected,
  sortField,
  sortDir,
  onPageChange,
  onSort,
  onToggleSelect,
  onToggleAll,
}: AssetTypeTableProps) {

  const rows: AssetTypeRow[] = useMemo(
    () =>
      data
        .slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
        .map((item, idx) => ({
          ...item,
          _idx: (currentPage - 1) * PER_PAGE + idx + 1,
        })),
    [currentPage, data]
  );

  const allPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const somePageSelected = rows.some((r) => selected.has(r.id)) && !allPageSelected;

  const columns = useMemo<ColumnDef<AssetTypeRow, any>[]>(
    () => [
      {
        id: "select",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        header: () => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={allPageSelected}
              indeterminate={somePageSelected}
              onChange={onToggleAll}
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
        id: "assetType",
        accessorKey: "assetType",
        header: () => (
          <button
            onClick={() => onSort("assetType")}
            className="flex items-center gap-1 font-semibold text-sm hover:text-brand-primary-hover transition-colors"
          >
            Asset Type <SortIcon active={sortField === "assetType"} dir={sortDir} />
          </button>
        ),
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-800 font-medium">{row.original.assetType}</div>
        ),
      },
      {
        id: "assetCategory",
        header: () => "Asset Category",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original.assetCategory}</div>
        ),
      },
      {
        id: "code",
        header: () => "Code",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700">{row.original.code}</div>
        ),
      },
      {
        id: "status",
        header: () => "Status",
        cell: ({ row }: any) => (
          <span
            className={cn(
              "inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5",
              row.original.status === "Active"
                ? "bg-green-50 text-green-600 border-green-200"
                : "bg-gray-100 text-gray-500 border-gray-200"
            )}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: "createdBy",
        header: () => "Created By",
        cell: ({ row }: any) => (
          <div>
            <div className="text-sm text-gray-800">{row.original.createdBy}</div>
            <div className="text-xs text-gray-400">{row.original.createdByRole}</div>
          </div>
        ),
      },
      {
        id: "lastUpdatedOn",
        accessorKey: "lastUpdatedOn",
        header: () => "Last Updated On",
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-700 whitespace-pre-line">{row.original.lastUpdatedOn}</div>
        ),
      },
      {
        accessorKey: "action",
        header: () => "Actions",
        cell: () => (
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
            <MoreVertical size={16} />
          </button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allPageSelected, somePageSelected, selected, sortField, sortDir]
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
