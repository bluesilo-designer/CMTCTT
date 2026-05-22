import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { MoreVertical, Search, Calendar, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const USER = {
  name: "Mia Murphy",
  userId: "#250101-USR199",
  role: "System Admin",
  status: "Active" as const,
  rank: "REC",
  nric: "*****341A",
  unitName: "SAR1",
  createdOn: "21 Apr 2026 (01:17:42 PM)",
};

const TABS = ["User Details", "Bookings", "Training Results", "Activities"] as const;
type Tab = typeof TABS[number];

// ── Mock data ─────────────────────────────────────────────────────────────────
const BOOKINGS_DATA = [
  { id: "BK-250101-001", type: "Marksmanship", time: "09:00 AM – 12:00 PM", date: "17 Jan 2025", status: "Completed", mode: "SAR21" },
  { id: "BK-250101-002", type: "Collective", time: "01:00 PM – 05:00 PM", date: "22 Jan 2025", status: "Completed", mode: "Component Type A" },
  { id: "BK-250101-003", type: "Judgemental", time: "09:00 AM – 11:00 AM", date: "30 Jan 2025", status: "Ongoing", mode: "15 Scenarios" },
  { id: "BK-250101-004", type: "Marksmanship", time: "02:00 PM – 05:00 PM", date: "10 Feb 2025", status: "Upcoming", mode: "LMG" },
];

const BOOKING_SUB_TABS = ["Upcoming", "Ongoing", "Return Assets", "Completed"] as const;
type BookingSubTab = typeof BOOKING_SUB_TABS[number];

const RESULTS_DATA = [
  { id: "BK-250101-001", type: "Marksmanship", date: "17 Jan 2025", weapon: "SAR21", score: "88/100", result: "Pass" },
  { id: "BK-250101-002", type: "Collective", date: "22 Jan 2025", weapon: "Component Type A", score: "—", result: "Pass" },
];

const ACTIVITIES_DATA = [
  { action: "Booking Created", module: "Booking Management", date: "22 Jan 2025, 09:14 AM", desc: "Created booking BK-250101-002 for Collective training" },
  { action: "Nominal Roll Uploaded", module: "Booking Management", date: "22 Jan 2025, 08:55 AM", desc: "Uploaded nominal roll for booking BK-250101-002 (28 trainees)" },
  { action: "Training Completed", module: "Training Performance", date: "17 Jan 2025, 12:04 PM", desc: "Marksmanship session BK-250101-001 ended successfully" },
  { action: "Asset Issued", module: "System Hardware", date: "17 Jan 2025, 08:40 AM", desc: "SAR21 × 15 issued to Base Station 2 for BK-250101-001" },
  { action: "User Login", module: "System", date: "17 Jan 2025, 08:30 AM", desc: "Logged into TRMS from Pulau Tekong Camp terminal" },
  { action: "Booking Created", module: "Booking Management", date: "10 Jan 2025, 03:22 PM", desc: "Created booking BK-250101-001 for Marksmanship training" },
];

// ── Status badge helpers ──────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-green-50 text-green-700 border-green-200",
    Ongoing: "bg-blue-50 text-blue-700 border-blue-200",
    Upcoming: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Pass: "bg-green-50 text-green-700 border-green-200",
    Fail: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", styles[status] ?? "bg-gray-100 text-gray-600 border-gray-200")}>
      {status}
    </span>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <tr>
      <td colSpan={10}>
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">No data to show right now!</p>
          <p className="text-xs text-gray-400">{message}</p>
        </div>
      </td>
    </tr>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function UserDetailsTab() {
  return (
    <div className="py-6">
      <h2 className="text-base font-bold text-gray-900 mb-6">User Details</h2>
      <div className="grid grid-cols-3 divide-x divide-gray-200">
        <div className="pr-8 space-y-5">
          {[["Rank", USER.rank], ["Name", USER.name], ["Created on", USER.createdOn]].map(([label, val]) => (
            <div key={label}>
              <div className="text-sm text-gray-500 mb-0.5">{label}</div>
              <div className="text-sm font-bold text-gray-900">{val}</div>
            </div>
          ))}
          <div>
            <div className="text-sm text-gray-500 mb-0.5">Status</div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">{USER.status}</span>
          </div>
        </div>
        <div className="px-8 space-y-5">
          {[["User ID", USER.userId], ["NRIC", USER.nric], ["Role", USER.role]].map(([label, val]) => (
            <div key={label}>
              <div className="text-sm text-gray-500 mb-0.5">{label}</div>
              <div className="text-sm font-bold text-gray-900">{val}</div>
            </div>
          ))}
        </div>
        <div className="pl-8 space-y-5">
          <div>
            <div className="text-sm text-gray-500 mb-0.5">Unit Name</div>
            <div className="text-sm font-bold text-gray-900">{USER.unitName}</div>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-200" />
    </div>
  );
}

function BookingsTab() {
  const [subTab, setSubTab] = useState<BookingSubTab>("Upcoming");
  const [search, setSearch] = useState("");

  const subMap: Record<BookingSubTab, string> = { Upcoming: "Upcoming", Ongoing: "Ongoing", "Return Assets": "Return Assets", Completed: "Completed" };
  const filtered = BOOKINGS_DATA.filter((b) => {
    const matchTab = subTab === "Return Assets" ? false : b.status === subMap[subTab];
    const matchSearch = !search || b.id.toLowerCase().includes(search.toLowerCase()) || b.type.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="py-5">
      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {BOOKING_SUB_TABS.map((t) => (
          <button key={t} type="button" onClick={() => setSubTab(t)}
            className={cn("px-4 py-2.5 text-sm font-medium relative transition-colors",
              subTab === t ? "text-brand-primary" : "text-gray-400 hover:text-gray-600")}>
            {t}
            {subTab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">{subTab} booking list ({filtered.length})</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md w-40 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-50">
            <Calendar size={13} /> Select Date
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-50">
            <Filter size={13} /> Filters <ChevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-50 border-b border-gray-100">
              {["No", "Booking ID", "Training Type", "Booking Time", "Status", "Training Mode"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <EmptyState message="This table will be automatically updated once users take action in the TRMS system." />
              : filtered.map((b, i) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-brand-primary font-medium">{b.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.time}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.mode}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainingResultsTab() {
  const [search, setSearch] = useState("");
  const filtered = RESULTS_DATA.filter((r) =>
    !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800">Training Results</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md w-40 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-600 hover:bg-gray-50">
            <Calendar size={13} /> Select Date
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-50 border-b border-gray-100">
              {["No", "Booking ID", "Training Type", "Date", "Weapon / Mode", "Score", "Result"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <EmptyState message="This table will be automatically updated once users take action in the TRMS system." />
              : filtered.map((r, i) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{i + 1}</td>
                  <td className="px-4 py-3 text-sm text-brand-primary font-medium">{r.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.weapon}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">{r.score}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.result} /></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivitiesTab() {
  return (
    <div className="py-5">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Activities</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-red-50 border-b border-gray-100">
              {["No", "Action", "Module", "Date", "Description"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ACTIVITIES_DATA.map((a, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{i + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">{a.action}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 font-medium whitespace-nowrap">{a.module}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{a.date}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{a.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function UserDetail({ onNavigate: _onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("User Details");

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["User List", "User Details"]} />
        </div>

        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{USER.name}</h1>
            <div className="text-sm text-gray-500 mt-1">User ID - {USER.userId}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">{USER.role}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">{USER.status}</span>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="border-b border-gray-200 flex mt-6">
          {TABS.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)}
              className={cn("px-4 py-3 text-sm font-medium relative transition-colors",
                activeTab === tab ? "text-brand-primary" : "text-gray-400 hover:text-gray-600")}>
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
            </button>
          ))}
        </div>

        {activeTab === "User Details" && <UserDetailsTab />}
        {activeTab === "Bookings" && <BookingsTab />}
        {activeTab === "Training Results" && <TrainingResultsTab />}
        {activeTab === "Activities" && <ActivitiesTab />}
      </div>
    </div>
  );
}
