import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock data ────────────────────────────────────────────────────────────────
const DETAIL = {
  program: "IMT Group Training For Unit Aldi 22 APR",
  bookingId: "#260422-PTC005",
  createdOn: "22 Apr 2026",
  session: "22 Apr 2026 01:00 PM - 05:00 PM (PM Session)",
  courseware: "Night Test for SAR21/M16 BTP",
  startTime: "22 Apr 2026 - 13:07 PM",
  endTime: "22 Apr 2026 - 14:25 PM",
  duration: "78m 29s",
  totalTrainees: 13,
  segments: [
    { label: "MARKSMAN", pct: 0.462, count: 6, color: "#4F46E5" },
    { label: "PASSED",   pct: 0.307, count: 4, color: "#16A34A" },
    { label: "FAILED",   pct: 0.231, count: 3, color: "#DC2626" },
  ],
  trainees: [
    { no: 1, rank: "3SG", name: "Noah Johnson",    nric: "****061C", results: "20 / 20" },
    { no: 2, rank: "CPL", name: "John Lim",        nric: "****421B", results: "20 / 20" },
    { no: 3, rank: "CPL", name: "John Ku 2",       nric: "****996Y", results: "20 / 20" },
    { no: 4, rank: "CPL", name: "John Koh",        nric: "****918Q", results: "20 / 20" },
    { no: 5, rank: "3SG", name: "Ethan Carter",    nric: "****239Y", results: "18 / 20" },
    { no: 6, rank: "3SG", name: "Olivia Thompson", nric: "****171G", results: "18 / 20" },
  ],
};

const TABS = ["Training Performance", "Nominal Roll", "Detail List", "Leaderboard"] as const;
type Tab = typeof TABS[number];

// ── SVG Donut ────────────────────────────────────────────────────────────────
function DonutChart() {
  const r = 70;
  const cx = 100;
  const cy = 100;
  const circ = 2 * Math.PI * r;

  let cumPct = 0;
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      {DETAIL.segments.map((seg) => {
        const dash = seg.pct * circ;
        const gap = circ - dash;
        const rotation = -90 + cumPct * 360;
        cumPct += seg.pct;
        return (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={28}
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />
        );
      })}
      {/* Center label */}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-gray-500" fontSize={11}>
        Trainee(s)
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-gray-800" fontSize={24} fontWeight="bold">
        {DETAIL.totalTrainees}
      </text>
    </svg>
  );
}

// ── Training Performance Tab ──────────────────────────────────────────────────
function TrainingPerformanceTab() {
  const [courseware, setCourseware] = useState(DETAIL.courseware);
  const [cwOpen, setCwOpen] = useState(false);

  const cwOptions = [
    "Night Test for SAR21/M16 BTP",
    "Day Test for SAR21/M16 BTP",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Courseware dropdown */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-2">Courseware</div>
        <div className="relative max-w-lg">
          <button
            type="button"
            onClick={() => setCwOpen(!cwOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 bg-white hover:border-gray-300"
          >
            <span>{courseware}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {cwOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
              {cwOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { setCourseware(opt); setCwOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Start / End time */}
      <div>
        <div className="text-sm font-semibold text-gray-700 mb-1">Start Time - End Time</div>
        <div className="text-sm text-gray-500">
          {DETAIL.startTime} - {DETAIL.endTime} ({DETAIL.duration})
        </div>
      </div>

      {/* Chart + Table row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm font-semibold text-gray-700 mb-5">Performance Chart</div>
          <div className="flex flex-col items-center">
            <DonutChart />
            <div className="mt-5 w-full space-y-2">
              {DETAIL.segments.map((seg) => (
                <div key={seg.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="text-gray-600">
                      {(seg.pct * 100).toFixed(1)}% ({seg.count} Trainees)
                    </span>
                  </div>
                  <span
                    className="font-bold text-xs"
                    style={{ color: seg.color }}
                  >
                    {seg.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trainee Result */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-700">Trainee Result</div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-red-50">
                {["No", "Rank", "Name", "NRIC", "Results"].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DETAIL.trainees.map((t) => (
                <tr key={t.no} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{t.no}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.rank}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{t.nric}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-800">{t.results}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function TrainingDetail({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("Training Performance");

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Training Results", "Training Detail"]} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{DETAIL.program}</h1>
            <div className="text-sm text-gray-500 mt-1">
              Booking ID - {DETAIL.bookingId}
            </div>
            <div className="text-sm text-gray-500">Created On {DETAIL.createdOn}</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-md hover:bg-brand-primary-hover">
            <Download size={14} />
            Download Take Home Package
          </button>
        </div>

        {/* Session + Action buttons */}
        <div className="mt-5 mb-6">
          <div className="text-xs font-semibold text-gray-700 mb-1">Session</div>
          <div className="text-sm text-gray-600 mb-4">{DETAIL.session}</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("/bookings/detail")}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              View Booking Details
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover"
            >
              Download Result
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium relative transition-colors",
                activeTab === tab
                  ? "text-brand-primary"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Training Performance" && <TrainingPerformanceTab />}
        {activeTab !== "Training Performance" && (
          <div className="p-8 text-center text-gray-400 text-sm">
            {activeTab} — coming soon
          </div>
        )}
      </div>
    </div>
  );
}
