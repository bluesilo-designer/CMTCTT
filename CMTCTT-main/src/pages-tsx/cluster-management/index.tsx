import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, Download, Eye, Calendar } from "lucide-react";
import { TableCustom } from "@/components/table";
import { InputCustom } from "@/components/input";
import { Button } from "@/components/button";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { clusters as initialClusters } from "@/data/clusterManagement";
import type { Cluster } from "./types";
import { PER_PAGE } from "./constants";
import { StatusBadge } from "./components/StatusBadge";
import { ViewClusterModal } from "./modals/ViewClusterModal";

// ── helpers ───────────────────────────────────────────────────────────────────

function shortName(name: string): string {
  const match = name.match(/^([A-Z]+)-[A-Z]+-(\d+)$/);
  if (match) return `${match[1]}${match[2]}`;
  return name;
}

function BlackoutCell({ dates }: { dates: Cluster["blackoutDates"] }) {
  if (dates.length === 0)
    return <span className="text-gray-400 text-sm">-</span>;
  const visible = dates.slice(0, 3);
  const extra   = dates.length - 3;
  return (
    <span className="text-sm text-gray-700">
      {visible.map((d) => d.label).join(", ")}
      {extra > 0 && <span className="text-gray-400 ml-1">+{extra} more</span>}
    </span>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export function ClusterManagement() {
  const [clusters]                           = useState<Cluster[]>(initialClusters);
  const [searchQuery,    setSearchQuery]     = useState("");
  const [currentPage,    setCurrentPage]     = useState(1);
  const [viewingCluster, setViewingCluster]  = useState<Cluster | null>(null);

  // ── derived ──
  const filtered = useMemo(
    () => clusters.filter((c) =>
      !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [clusters, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // ── columns ──
  const columns = useMemo<ColumnDef<Cluster, any>[]>(
    () => [
      {
        accessorKey: "name",
        header:      () => "Cluster",
        cell: ({ getValue }: any) => {
          const full  = getValue() as string;
          const short = shortName(full);
          return (
            <div>
              <span className="text-sm font-semibold text-gray-800">{short}</span>
              {short !== full && (
                <div className="text-xs text-gray-400 mt-0.5">{full}</div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header:      () => "Status",
        cell: ({ getValue }: any) => <StatusBadge status={getValue()} />,
      },
      {
        id:     "blackoutDates",
        header: () => "Blackout Date",
        cell:   ({ row }: any) => <BlackoutCell dates={row.original.blackoutDates} />,
      },
      {
        id:     "updatedOn",
        header: () => "Updated On",
        cell:   ({ row }: any) => {
          const [date, time] = row.original.updatedOn.split("\n");
          return (
            <div>
              <div className="text-sm text-gray-800">{date}</div>
              <div className="text-xs text-gray-400">{time}</div>
            </div>
          );
        },
      },
      {
        id:     "actions",
        header: () => "",
        cell:   ({ row }: any) => (
          <div
            className="flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              title="View detail"
              onClick={() => setViewingCluster(row.original)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-gray-100 transition-colors"
            >
              <Eye size={15} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // ── render ──
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="px-6 py-2.5 border-b border-gray-200 bg-white">
        <Breadcrumb items={["Cluster Management"]} />
      </div>

      <div className="p-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Cluster Management</h1>
          <Button
            type="outline"
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold w-auto"
          >
            <Download size={14} /> Export Spreadsheet
          </Button>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">
              Cluster{" "}
              <span className="text-gray-500 font-normal">({filtered.length} Clusters)</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <InputCustom
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search"
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Calendar size={13} className="text-gray-400" />
                <span>10 January 2025</span>
              </button>
            </div>
          </div>

          <TableCustom columns={columns} data={paginated} autoScrollTable={true} />

          <Pagination
            currentPage={safePage}
            itemsPerPage={PER_PAGE}
            totalItems={filtered.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* View modal — read-only */}
      {viewingCluster && (
        <ViewClusterModal
          cluster={viewingCluster}
          onClose={() => setViewingCluster(null)}
        />
      )}
    </div>
  );
}
