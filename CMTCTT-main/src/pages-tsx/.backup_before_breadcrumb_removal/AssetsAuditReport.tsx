import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface AuditRecord {
  id: number;
  scanDate: string;
  scanTime: string;
  createdBy: string;
  totalAssets: number;
  assetsFound: number;
  assetsNotFound: number;
}

/* ─── Mock data — empty by default ──────────────────────────────────── */
const MOCK_AUDITS: AuditRecord[] = [];

const PER_PAGE = 10;

/* ─── Scan Assets for Report (sub-page) ─────────────────────────────── */
interface BaseStationRow {
  name: string;
  totalAssignments: number;
  issued: number;
  returned: number;
  missing: number;
  status: "Missing" | "Complete";
}

const SCAN_SUMMARY = {
  date: "2026-04-24",
  issued: 1,
  returned: 0,
  missing: 1,
  totalScans: 1,
  stations: [
    { name: "IMT-01", totalAssignments: 1, issued: 1, returned: 0, missing: 1, status: "Missing" as const },
    { name: "IMT-02", totalAssignments: 1, issued: 1, returned: 0, missing: 1, status: "Missing" as const },
  ] as BaseStationRow[],
};

function ScanAssetsPage({ onBack }: { onBack: () => void }) {
  const [scanned, setScanned] = useState(SCAN_SUMMARY.totalScans);

  const handleScanAssets = () => {
    // Dummy scan action
    setScanned((s) => s + 1);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Scan Assets for Report</h1>
            <p className="text-sm text-gray-500 mt-0.5">Total Scans ({scanned} Assets)</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleScanAssets}
              className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Scan Assets
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              View Report
            </button>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-semibold text-gray-800 text-center mb-5">
            Stock Take Variance Report ({SCAN_SUMMARY.date})
          </h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-8 bg-red-50 rounded-lg px-10 py-5 min-w-[480px]">
              <div>
                <p className="text-xs text-gray-500 mb-1">Issued Asset(s)</p>
                <p className="text-lg font-bold text-gray-800">{SCAN_SUMMARY.issued}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Returned Asset(s)</p>
                <p className="text-lg font-bold text-gray-800">{SCAN_SUMMARY.returned}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Missing Asset(s)</p>
                <p className="text-lg font-bold text-red-600">{SCAN_SUMMARY.missing}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Base station table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-red-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Base Station Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Total Assignments</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Issued Asset(s)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Returned Asset(s)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Missing Asset(s)</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Status</th>
              </tr>
            </thead>
            <tbody>
              {SCAN_SUMMARY.stations.map((st) => (
                <tr key={st.name} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-gray-800">{st.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{st.totalAssignments}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{st.issued} asset(s)</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{st.returned} asset(s)</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{st.missing} asset(s)</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        st.status === "Missing"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      )}
                    >
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Assets Audit Report (main list page) ───────────────────────────── */
export function AssetsAuditReport() {
  const [subPage, setSubPage] = useState<"list" | "scan">("list");
  const [currentPage, setCurrentPage] = useState(1);

  if (subPage === "scan") {
    return <ScanAssetsPage onBack={() => setSubPage("list")} />;
  }

  const totalPages = Math.max(1, Math.ceil(MOCK_AUDITS.length / PER_PAGE));
  const paginated = MOCK_AUDITS.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Reports", "Assets Audit Report"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Assets Audit Report</h1>
          <button
            onClick={() => setSubPage("scan")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-semibold"
          >
            Generate Report
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-14">No</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <span className="flex items-center gap-1">
                      Scan Date &amp; Time
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </span>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <span className="flex items-center gap-1">
                      <Search size={11} className="opacity-70" />
                      Created By
                    </span>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Total Assets</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Assets Found</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Assets Not Found</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
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
                        <div>{row.scanDate}</div>
                        <div className="text-xs text-gray-400">{row.scanTime}</div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.createdBy}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.totalAssets}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.assetsFound}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-700">{row.assetsNotFound}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-gray-400 hover:text-brand-primary transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
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
            totalItems={MOCK_AUDITS.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
