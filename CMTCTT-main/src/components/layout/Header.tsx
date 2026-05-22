import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, MapPin, Search, X, Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock search data ──────────────────────────────────────────────────────────
const SEARCH_DATA = [
  // Bookings
  { category: "Bookings", label: "BK-001 — SWT Marksmanship (SAR21)", sub: "17 Jan 2025 · Platoon 1", path: "/bookings/list" },
  { category: "Bookings", label: "BK-002 — SWT Collective (Component Type A)", sub: "18 Jan 2025 · Platoon 2", path: "/bookings/list" },
  { category: "Bookings", label: "BK-003 — SWT Judgemental Shoot", sub: "20 Jan 2025 · Platoon 1", path: "/bookings/list" },
  { category: "Bookings", label: "BK-004 — CMT Tactical Mission", sub: "22 Jan 2025 · Platoon 3", path: "/bookings/list" },
  { category: "Bookings", label: "BK-005 — CTT Command Team", sub: "25 Jan 2025 · HQ", path: "/bookings/list" },
  { category: "Bookings", label: "BK-006 — SWT Marksmanship (LMG)", sub: "28 Jan 2025 · Platoon 2", path: "/bookings/list" },
  // Trainees
  { category: "Trainees", label: "CPT Ken Chow", sub: "NRIC ****212A · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "MAJ Wayang King", sub: "NRIC ****212B · Platoon 2", path: "/training-results" },
  { category: "Trainees", label: "LTA Tan Wei Liang", sub: "NRIC ****212C · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "LTC Muthu Mohammad", sub: "NRIC ****212D · Platoon 2", path: "/training-results" },
  { category: "Trainees", label: "COL Liao Kang Chai", sub: "NRIC ****212E · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "LTA Ismail Iskandar", sub: "NRIC ****212F · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "CPT Lee Yep", sub: "NRIC ****212G · Platoon 2", path: "/training-results" },
  { category: "Trainees", label: "MAJ Chun Xiong", sub: "NRIC ****212H · Platoon 2", path: "/training-results" },
  { category: "Trainees", label: "SLTC Halim Lim", sub: "NRIC ****212I · Platoon 2", path: "/training-results" },
  { category: "Trainees", label: "LTC Liang Zhi Qiang", sub: "NRIC ****212J · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "CPT Ahmad Rizal", sub: "NRIC ****212K · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "MAJ David Tan", sub: "NRIC ****212L · Platoon 2", path: "/training-results" },
  { category: "Trainees", label: "LTA Ravi Kumar", sub: "NRIC ****212M · Platoon 1", path: "/training-results" },
  { category: "Trainees", label: "CPT Jason Lim", sub: "NRIC ****212N · Platoon 2", path: "/training-results" },
  // Locations
  { category: "Locations", label: "Pulau Tekong Camp (PTC)", sub: "Base Station 1–5 · C-Shaped Station SWT 4, SWT 5", path: "/site-management" },
  { category: "Locations", label: "Pasir Laba Camp (PLC)", sub: "Base Station 1–5", path: "/site-management" },
  { category: "Locations", label: "Nee Soon Camp (NSC)", sub: "Base Station 1–5", path: "/site-management" },
  // Training Results
  { category: "Training Results", label: "Marksmanship Results — Jan 2025", sub: "32 trainees · SAR21", path: "/training-results" },
  { category: "Training Results", label: "Collective Results — Jan 2025", sub: "28 trainees · Component Type A", path: "/training-results" },
  { category: "Training Results", label: "Judgemental Results — Feb 2025", sub: "20 trainees · 15 scenarios", path: "/training-results" },
  // Assets
  { category: "Assets", label: "SAR21 Rifle — RFID #A0012", sub: "Issued · Base Station 2", path: "/system-hardware/assets-list" },
  { category: "Assets", label: "LMG — RFID #A0034", sub: "Available · Armskote", path: "/system-hardware/assets-list" },
  { category: "Assets", label: "SPIKE SR — RFID #A0089", sub: "Available · Armskote", path: "/system-hardware/assets-list" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Bookings: "bg-blue-100 text-blue-700",
  Trainees: "bg-purple-100 text-purple-700",
  Locations: "bg-green-100 text-green-700",
  "Training Results": "bg-orange-100 text-orange-700",
  Assets: "bg-gray-100 text-gray-600",
};

// ── Global Search ─────────────────────────────────────────────────────────────
function GlobalSearch({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q.length >= 1
    ? SEARCH_DATA.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
    : [];

  // Group by category
  const grouped: Record<string, typeof results> = {};
  for (const item of results) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }
  const categories = Object.keys(grouped);

  const handleSelect = (path: string) => {
    setOpen(false);
    setQuery("");
    onNavigate?.(path);
  };

  return (
    <div ref={ref} className="relative w-64">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 border rounded-lg bg-gray-50 transition-colors",
        open || query ? "border-brand-primary bg-white" : "border-gray-200 hover:border-gray-300"
      )}>
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          placeholder="Search bookings, trainees..."
          className="flex-1 bg-transparent text-xs text-gray-700 placeholder-gray-400 outline-none"
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); setOpen(false); }}>
            <X size={12} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {open && q.length >= 1 && (
        <div className="absolute top-full left-0 mt-1.5 w-[420px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-[480px] overflow-y-auto">
          {categories.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400">No results for "{query}"</div>
          ) : (
            categories.map((cat) => (
              <div key={cat}>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <span className={cn("text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full", CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600")}>
                    {cat}
                  </span>
                </div>
                {grouped[cat].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelect(item.path)}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{item.label}</div>
                      <div className="text-xs text-gray-400 truncate">{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 text-center">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Path to Breadcrumb mapping ────────────────────────────────────────────────
const PATH_BREADCRUMBS: Record<string, string[]> = {
  "/dashboard": ["Dashboard"],
  "/bookings/today": ["Bookings", "Today's Booking"],
  "/bookings/list": ["Bookings", "Booking List"],
  "/bookings/detail": ["Booking List", "Booking Detail"],
  "/training-results": ["Training Results"],
  "/training-results/detail": ["Training Results", "Detail"],
  "/reports/asset-movement": ["Reports", "Asset Movement"],
  "/reports/stock-take": ["Reports", "Stock Take Variance"],
  "/reports/asset-audit": ["Reports", "Assets Audit"],
  "/user-management/user-list": ["User Management", "User List"],
  "/user-management/user-detail": ["User Management", "User Detail"],
  "/user-management/user-role": ["User Management", "User Role"],
  "/user-management/role-permission": ["User Management", "Role Permission"],
  "/user-management/rank": ["User Management", "Rank"],
  "/site-management": ["Site Management"],
  "/system-hardware": ["System Hardware"],
  "/system-hardware/dashboard": ["System Hardware", "Dashboard"],
  "/system-hardware/assets-list": ["System Hardware", "Assets List"],
  "/system-hardware/assignment-list": ["System Hardware", "Assignment List"],
  "/system-hardware/asset-type": ["System Hardware", "Asset Type"],
  "/system-hardware/asset-category": ["System Hardware", "Asset Category"],
  "/system-hardware/asset-tracking": ["System Hardware", "Asset Tracking"],
  "/system-hardware/rfid-configuration": ["System Hardware", "RFID Configuration"],
  "/system-hardware/rfid-configuration/reader-listing": ["System Hardware", "RFID Configuration", "Reader Listing"],
  "/system-hardware/rfid-configuration/antenna-listing": ["System Hardware", "RFID Configuration", "Antenna Listing"],
  "/system-health": ["System Health"],
  "/operational-availability": ["Operational Availability"],
  "/system-maintenance": ["System Maintenance"],
  "/data-management": ["Data Management"],
  "/data-management/export": ["Data Management", "Export"],
  "/data-management/import": ["Data Management", "Import"],
  "/activity-log": ["Activity Log"],
  "/resource-planning": ["Resource Planning"],
  "/settings": ["Settings"],
};

// Map breadcrumb label → navigable hash path
const BREADCRUMB_LINKS: Record<string, string> = {
  "Booking List": "/bookings/list",
  "Bookings": "/bookings/list",
  "Training Results": "/training-results",
  "User Management": "/user-management/user-list",
  "System Hardware": "/system-hardware",
  "Reports": "/reports/asset-movement",
};

function getBreadcrumbs(pathname: string): string[] {
  const normalizedPath = pathname || "/dashboard";
  return PATH_BREADCRUMBS[normalizedPath] || ["Dashboard"];
}

// ── Header ────────────────────────────────────────────────────────────────────
export function Header({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>(() => getBreadcrumbs(location.pathname));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setBreadcrumbs(getBreadcrumbs(location.pathname));
  }, [location.pathname]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="h-[60px] bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1 text-xs text-gray-500 flex-1">
        <Home size={13} className="text-gray-400" />
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          const linkPath = !isLast ? BREADCRUMB_LINKS[item] : undefined;
          return (
            <div key={idx} className="flex items-center gap-1">
              <ChevronRight size={12} className="text-gray-300" />
              {linkPath ? (
                <button
                  type="button"
                  onClick={() => navigate(linkPath)}
                  className="text-gray-500 hover:text-brand-primary hover:underline transition-colors"
                >
                  {item}
                </button>
              ) : (
                <span className={isLast ? "text-brand-primary font-medium" : "text-gray-500"}>
                  {item}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <GlobalSearch onNavigate={onNavigate} />

      <div className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
        <MapPin size={12} className="text-brand-primary flex-shrink-0" />
        <span className="font-semibold text-gray-700">Pulau Tekong Camp</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-400">{formatDate(time)}</span>
        <span className="text-gray-300">|</span>
        <span className="font-medium text-gray-600">{formatTime(time)}</span>
      </div>

      <button
        onClick={() => onNavigate?.("/notifications")}
        className="relative p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <Bell size={17} />
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
          9
        </span>
      </button>
    </header>
  );
}
