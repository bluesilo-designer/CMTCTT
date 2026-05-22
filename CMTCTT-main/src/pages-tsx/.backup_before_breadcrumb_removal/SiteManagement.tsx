import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { baseStations } from "@/data/siteManagement";
import type { LaneStatus } from "@/data/siteManagement";
import { Search, Trash2, Eye, MoreVertical, Download, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

export function SiteManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = baseStations.filter(
    (s) => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((s) => s.id)));
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Site Management"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Site Management</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2">
              <Download size={14} />
              Export
            </button>
            <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
              Add Base Station
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">
              Base Station <span className="text-gray-400 font-normal">({filtered.length} Stations)</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <button
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border transition-colors",
                  selected.size > 0
                    ? "text-red-500 border-red-200 hover:bg-red-50"
                    : "text-gray-400 border-gray-200 cursor-not-allowed"
                )}
                disabled={selected.size === 0}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selected.size === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-10">No</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[180px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Base Station
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[100px]">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">Lane</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[240px]">Blackout Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((station, idx) => (
                  <tr key={station.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(station.id)}
                        onChange={() => toggleSelect(station.id)}
                        className="rounded border-gray-300 accent-brand-primary"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {(currentPage - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{station.name}</td>
                    <td className="px-4 py-3.5">
                      <StationStatusBadge status={station.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        {station.lanes.map((lane, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <span>{lane.count}</span>
                            {lane.count !== "0 Lanes" && (
                              <LaneStatusBadge status={lane.status} />
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {station.blackoutDates.length > 0 ? (
                        <div className="flex flex-col gap-0.5">
                          {station.blackoutDates.map((d, dIdx) => (
                            <div key={dIdx} className="text-sm text-gray-700">{d.label}</div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            current={currentPage}
            total={totalPages}
            perPage={PER_PAGE}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

function StationStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5 bg-green-50 text-green-600 border-green-200">
      {status}
    </span>
  );
}

function LaneStatusBadge({ status }: { status: LaneStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border text-xs font-medium px-2 py-0.5",
        status === "Active"
          ? "bg-green-50 text-green-600 border-green-200"
          : "bg-red-50 text-red-500 border-red-200"
      )}
    >
      {status}
    </span>
  );
}
