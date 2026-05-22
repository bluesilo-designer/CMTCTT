import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type ViewMode = "Month" | "Day";

// Mock data — empty by default (matches the design screenshot)
const MOVEMENTS: {
  no: number;
  assignmentId: string;
  assetName: string;
  assetTagId: string;
  assetType: string;
  assetCategory: string;
  timePeriod: string;
  date: string;
  status: string;
}[] = [];

const PER_PAGE = 10;

// Date helpers
function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function AssetMovementReport() {
  const [viewMode, setViewMode] = useState<ViewMode>("Day");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDate, setActiveDate] = useState(new Date(2026, 3, 27)); // 27 Apr 2026

  const shiftDate = (delta: number) => {
    setActiveDate((prev) => {
      const d = new Date(prev);
      if (viewMode === "Day") d.setDate(d.getDate() + delta);
      else d.setMonth(d.getMonth() + delta);
      return d;
    });
  };

  const displayLabel =
    viewMode === "Day"
      ? formatDate(activeDate)
      : activeDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const totalPages = Math.max(1, Math.ceil(MOVEMENTS.length / PER_PAGE));
  const paginated = MOVEMENTS.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const EmptyState = () => (
    <tr>
      <td colSpan={8}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">No data to show right now!</p>
          <p className="text-xs text-gray-400">This table will be automatically updated once users take action in the IMT system.</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Reports", "Asset Movement Report"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Asset Movement Report</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-semibold">
            <Download size={15} />
            Export
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Month/Day tabs + date navigator */}
          <div className="flex items-center px-5 py-3 border-b border-gray-100">
            {/* Tabs */}
            <div className="flex items-end gap-1 w-40">
              {(["Month", "Day"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors relative",
                    viewMode === mode
                      ? "text-brand-primary"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {mode}
                  {viewMode === mode && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Date nav — centered */}
            <div className="flex-1 flex items-center justify-center gap-4">
              <button onClick={() => shiftDate(-1)} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-gray-800 min-w-[110px] text-center">{displayLabel}</span>
              <button onClick={() => shiftDate(1)} className="p-1 text-gray-500 hover:text-gray-800 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="w-40" />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-14">No</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Assignment ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Asset Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Asset Tag ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Asset Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Asset Category</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <span className="flex items-center gap-1">
                      Time Period
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </span>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <EmptyState />
                ) : (
                  paginated.map((item) => (
                    <tr key={item.no} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.no}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.assignmentId}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.assetName}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.assetTagId}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.assetType}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.assetCategory}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        <div>{item.timePeriod}</div>
                        <div className="text-xs text-gray-400">{item.date}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{item.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            current={currentPage}
            total={totalPages}
            perPage={PER_PAGE}
            totalItems={MOVEMENTS.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
