import { useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { Download, Search, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface StockTakeRecord {
  id: number;
  createdDate: string;
  createdTime: string;
  scannedBy: string;
  scannedByRole: string;
  status: "Missing" | "Complete" | "In Progress";
  scanStartTime: string;
  scanStartDate: string;
  scanEndTime: string;
  scanEndDate: string;
  issues: number;
}

const MOCK_DATA: StockTakeRecord[] = [
  {
    id: 1,
    createdDate: "24 Apr 2026",
    createdTime: "02:10:12 PM",
    scannedBy: "Liam Johansson",
    scannedByRole: "Operator",
    status: "Missing",
    scanStartTime: "02:10:12 PM",
    scanStartDate: "24 Apr 2026",
    scanEndTime: "-",
    scanEndDate: "-",
    issues: 1,
  },
];

const PER_PAGE = 10;

const STATUS_STYLE: Record<StockTakeRecord["status"], string> = {
  Missing: "bg-red-100 text-red-600",
  Complete: "bg-green-100 text-green-600",
  "In Progress": "bg-yellow-100 text-yellow-700",
};

interface Props {
  onViewDetail?: (id: number) => void;
}

export function StockTakeVarianceReport({ onViewDetail }: Props) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MOCK_DATA.filter(
    (r) =>
      r.scannedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.createdDate.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Stock Take Variance Report</h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-semibold">
            <Download size={15} />
            Export
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Filters */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 font-medium">
              Select Date
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-14">No</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <span className="flex items-center gap-1">
                      <Search size={11} className="opacity-70" />
                      Created On
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </span>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <span className="flex items-center gap-1">
                      <Search size={11} className="opacity-70" />
                      Scanned By
                    </span>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Scan Start Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Scan End Time</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Issues</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
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
                ) : (
                  paginated.map((row, idx) => (
                    <tr key={row.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-700">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        <div>{row.createdDate}</div>
                        <div className="text-xs text-gray-400">{row.createdTime}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm">
                        <div className="font-medium text-gray-800">{row.scannedBy}</div>
                        <div className="text-xs text-gray-400">{row.scannedByRole}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", STATUS_STYLE[row.status])}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        <div>{row.scanStartTime}</div>
                        <div className="text-xs text-gray-400">{row.scanStartDate}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">
                        <div>{row.scanEndTime}</div>
                        <div className="text-xs text-gray-400">{row.scanEndDate !== "-" ? row.scanEndDate : ""}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.issues}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => onViewDetail?.(row.id)}
                          className="text-gray-400 hover:text-brand-primary transition-colors"
                          title="View detail"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
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
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
