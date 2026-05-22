import Dropdown from "@/components/dropdown";
import { TableCustom } from "@/components/table";
import { Pagination } from "@/components/ui/Pagination";
import type { Asset } from "@/data/systemHardware";
import { type ColumnDef } from "@tanstack/react-table";
import { Archive, Edit2, Eye, MoreVertical } from "lucide-react";
import { useMemo } from "react";
import { PER_PAGE } from "../constants";
import { AssetStatusBadge } from "./AssetStatusBadge";

interface AssetsTableProps {
  data: Asset[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit: (asset: Asset) => void;
  onNavigate?: (path: string) => void;
}

interface AssetRow extends Asset {
  _idx: number;
}

export function AssetsTable({
  data,
  currentPage,
  onPageChange,
  onEdit,
  onNavigate,
}: AssetsTableProps) {

  const rows: AssetRow[] = useMemo(
    () =>
      data
        .slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
        .map((asset, idx) => ({
          ...asset,
          _idx: (currentPage - 1) * PER_PAGE + idx + 1,
        })),
    [currentPage, data],
  );



  const columns = useMemo<ColumnDef<AssetRow, any>[]>(
    () => [
      {
        id: "no",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        header: () => "No",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">{info.row.original._idx}</div>
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: () => "Asset",
        cell: (info: any) => (
          <div className="text-sm text-gray-800 font-medium">
            {info.row.original.name}
          </div>
        ),
      },
      {
        id: "serialNumber",
        accessorKey: "serialNumber",
        header: () => "Asset Serial Number",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">
            {info.row.original.serialNumber}
          </div>
        ),
      },
      {
        id: "assetType",
        header: () => "Asset Type",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">
            {info.row.original.assetType}
          </div>
        ),
      },
      {
        id: "assetCategory",
        header: () => "Asset Category",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">
            {info.row.original.assetCategory}
          </div>
        ),
      },
      {
        id: "status",
        header: () => "Status",
        cell: (info: any) => (
          <AssetStatusBadge status={info.row.original.status} />
        ),
      },
      {
        id: "issuedDate",
        accessorKey: "issuedDate",
        header: () => "Issued Date",
        cell: (info: any) => (
          <div className="text-sm text-gray-700">
            {info.row.original.issuedDate}
          </div>
        ),
      },
      {
        id: "createdBy",
        header: () => "Created By",
        cell: (info: any) => (
          <div>
            <div className="text-sm text-gray-800 font-medium">
              {info.row.original.createdBy || "—"}
            </div>
            <div className="text-xs text-gray-400">
              {info.row.original.createdByRole || ""}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: () => "Actions",
        cell: (info: any) => {
          const asset = info.row.original as AssetRow;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onNavigate?.(
                    `/system-hardware/asset-detail/${asset.id}`,
                  )
                }
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <Eye size={16} />
              </button>
              <Dropdown Icon={<MoreVertical size={16} className="text-gray-400" />} positionType="bottom-right" className="w-40">
                <button
                  onClick={() => onEdit(asset)}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                  <Archive size={16} />
                  Archive
                </button>
              </Dropdown>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onEdit, onNavigate],
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
