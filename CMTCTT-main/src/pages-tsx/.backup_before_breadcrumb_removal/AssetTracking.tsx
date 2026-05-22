import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { assets } from "@/data/systemHardware";
import { Eye, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;
type Tab = "RFID Map" | "Asset List";

/* ── simplified floor-plan SVG ── */
const rooms = [
  { x: 870, y: 320, w: 260, h: 220, label: "IMT 06" },
  { x: 1130, y: 320, w: 260, h: 220, label: "IMT 05" },
  { x: 350, y: 560, w: 260, h: 220, label: "IMT 01" },
  { x: 610, y: 560, w: 260, h: 220, label: "IMT 02" },
  { x: 870, y: 560, w: 260, h: 220, label: "IMT 03" },
  { x: 1130, y: 560, w: 260, h: 220, label: "IMT 04" },
];

const rfidMarkers = [
  { x: 940, y: 340 }, { x: 980, y: 340 }, { x: 1020, y: 340 },
  { x: 1200, y: 340 }, { x: 1240, y: 340 }, { x: 1280, y: 340 },
];

const alertMarkers = [
  { x: 600, y: 540 }, { x: 1120, y: 540 },
];

function RFIDMap() {
  return (
    <div className="w-full overflow-auto bg-gray-100 rounded-lg border border-gray-200" style={{ minHeight: 480 }}>
      <svg viewBox="300 280 1120 540" width="100%" style={{ minWidth: 800 }}>
        {/* Background */}
        <rect x="300" y="280" width="1120" height="540" fill="#f3f4f6" />

        {/* Corridor label */}
        <text x="750" y="552" fontSize="11" fill="#9ca3af" fontWeight="500" textAnchor="middle" letterSpacing="3">CORRIDOR</text>
        <line x1="300" y1="560" x2="1420" y2="560" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,4" />

        {/* Outdoor staircase labels */}
        <text x="360" y="310" fontSize="9" fill="#9ca3af" letterSpacing="2">OUTDOOR STAIRCASE</text>
        <text x="1300" y="310" fontSize="9" fill="#9ca3af" letterSpacing="2">OUTDOOR STAIRCASE</text>

        {/* Rooms */}
        {rooms.map((r) => (
          <g key={r.label}>
            {/* Green grid fill */}
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="#86efac" stroke="#4ade80" strokeWidth="1" />
            {/* Grid lines horizontal */}
            {Array.from({ length: Math.floor(r.h / 20) - 1 }, (_, i) => (
              <line key={`h${i}`} x1={r.x} y1={r.y + (i + 1) * 20} x2={r.x + r.w} y2={r.y + (i + 1) * 20} stroke="#4ade80" strokeWidth="0.4" />
            ))}
            {/* Grid lines vertical */}
            {Array.from({ length: Math.floor(r.w / 20) - 1 }, (_, i) => (
              <line key={`v${i}`} x1={r.x + (i + 1) * 20} y1={r.y} x2={r.x + (i + 1) * 20} y2={r.y + r.h} stroke="#4ade80" strokeWidth="0.4" />
            ))}
            {/* Room border */}
            <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="#1a3a6b" strokeWidth="1.5" />
            {/* Room label */}
            <text x={r.x + r.w / 2} y={r.y - 8} fontSize="11" fill="#374151" fontWeight="600" textAnchor="middle">{r.label}</text>
          </g>
        ))}

        {/* RFID Reader markers (pink/magenta squares) */}
        {rfidMarkers.map((m, i) => (
          <rect key={i} x={m.x - 6} y={m.y - 6} width="12" height="12" fill="#e879f9" stroke="#a21caf" strokeWidth="1" rx="1" />
        ))}

        {/* Alert markers (red circles with wifi icon) */}
        {alertMarkers.map((m, i) => (
          <g key={i}>
            <circle cx={m.x} cy={m.y} r="14" fill="#ef4444" />
            <text x={m.x} y={m.y + 5} fontSize="14" fill="white" textAnchor="middle">⊙</text>
          </g>
        ))}

        {/* STO labels */}
        <text x="870" y="355" fontSize="9" fill="#6b7280">STO</text>
        <text x="1130" y="355" fontSize="9" fill="#6b7280">STO</text>

        {/* Structural walls top */}
        <rect x="300" y="280" width="1120" height="30" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />

        {/* Bottom structural band */}
        <rect x="300" y="784" width="1120" height="36" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function AssetTracking() {
  const [activeTab, setActiveTab] = useState<Tab>("RFID Map");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(assets.length / PER_PAGE));
  const paginated = assets.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["System Hardware Management", "Asset Tracking"]} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-5">Asset Tracking List</h1>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(["RFID Map", "Asset List"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab
                    ? "text-brand-primary border-brand-primary"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "RFID Map" ? (
              <RFIDMap />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="bg-red-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-12">No</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[180px]">Asset</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[140px]">Serial Number</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[130px]">Asset Type</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((asset, idx) => (
                        <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3.5 text-sm text-gray-700">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{asset.name}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-700">{asset.serialNumber}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-700">{asset.assetType}</td>
                          <td className="px-4 py-3.5">
                            <span className={cn(
                              "inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5",
                              asset.status === "Available" ? "bg-green-50 text-green-600 border-green-200"
                              : asset.status === "Issued" ? "bg-purple-50 text-purple-600 border-purple-200"
                              : "bg-orange-50 text-orange-500 border-orange-200"
                            )}>
                              {asset.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <button className="text-gray-400 hover:text-gray-600"><Eye size={16} /></button>
                              <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
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
                  totalItems={assets.length}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
