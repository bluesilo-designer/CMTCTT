import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import {
  ChevronDown, ChevronUp, Check, Users, Upload, Search,
  ArrowLeft, ArrowRight, Pencil, Trash2, Bell, MoreVertical,
  Monitor, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock booking data (SWT format) ───────────────────────────────────────────
const BOOKING = {
  id: "#111024-KC0004",
  title: "SWT Training for Unit 19",
  status: "Upcoming" as const,
  date: "10 January 2025",
  time: "08:00 AM – 06:00 PM (Full Day)",
  program: "SWT Training",
  trainingMode: "Collective",
  briefingRoom: "Briefing Room",
  sectionType: "Standalone",
  courseware: "Component Type Training B",
  traineesCount: 32,
  trainingType: "Group",
  assignmentId: "-",
  atmsFile: "202412231456",
  weapons: [
    { type: "SAR21", units: 1 },
    { type: "SPIKE SR", units: 2 },
    { type: "GPMG", units: 1 },
    { type: "MATADOR", units: 2 },
    { type: "SPIKE LR", units: 1 },
  ],
  baseStations: [
    { label: "Base Station Assignment", value: "SWT-01" },
    { label: "Base Station Assignment", value: "SWT-02" },
  ],
  cShapedStations: [
    { label: "C-Shaped Station Assignment", value: "SWT-04" },
    { label: "C-Shaped Station Assignment", value: "SWT-05" },
  ],
  laneConfig: [
    { lane: "Lane 1", weapon: "SAR21", status: "On" },
    { lane: "Lane 2", weapon: "SAR21", status: "On" },
    { lane: "Lane 3", weapon: "SAR21", status: "On" },
    { lane: "Lane 4", weapon: "-", status: "Off" },
    { lane: "Lane 5", weapon: "SAR21", status: "On" },
    { lane: "Lane 6", weapon: "-", status: "Off" },
    { lane: "Lane 7", weapon: "SAR21", status: "On" },
    { lane: "Lane 8", weapon: "SAR21", status: "On" },
    { lane: "Lane 9", weapon: "SAR21", status: "On" },
    { lane: "Lane 10", weapon: "-", status: "Closed" },
  ],
  trainees: Array.from({ length: 32 }, (_, i) => ({
    no: i + 1,
    rank: "REC",
    name: [
      "Roger Botosh","Davis Culhane","Kadin Torff","Craig Septimus","Roger Septimus",
      "Jaxson Donin","James Lubin","Jakob Vaccaro","Ruben Calzoni","Jake Pascal",
      "Ahmad Rizal","David Tan","Ravi Kumar","Jason Lim","Mohamed Ali",
      "Wei Ming Lee","Kai En Tan","Ismail Yusof","Guo Liang Chen","Farid Rahman",
      "Zhen Wei Liu","Hari Kumar","Siva Nathan","Yong Sheng Ng","Boon Kiat Lim",
      "Jun Wei Chua","Kai Xuan Teo","Shi Hao Sim","Reuben Tan","Ethan Yap",
      "Dylan Koh","Marcus Low",
    ][i] ?? `Trainee ${i + 1}`,
    nric: "****212A",
    platoon: `Platoon ${(i % 2) + 1}`,
    weaponType: "SAR21",
  })),
};

const MOCK_ASSIGNMENTS = [
  { id: "#260422-AT001", courseware: "Component Type Training A" },
  { id: "#260422-AT002", courseware: "Component Type Training B" },
  { id: "#260422-AT003", courseware: "Component Type Training C" },
];

const WEAPON_OPTIONS = ["SAR21", "LMG", "M203", "GPMG", "M110", "SPIKE SR", "SPIKE LR", "MATADOR"];
const PER_PAGE = 10;

// ── Tiny helpers ──────────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
      <dd className="text-sm font-semibold text-gray-800">{value ?? "—"}</dd>
    </div>
  );
}

function LaneStatusPill({ status }: { status: string }) {
  if (status === "Closed") return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Closed</span>;
  if (status === "On")     return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">On</span>;
  return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500">Off</span>;
}

// ── Lane Toggle ───────────────────────────────────────────────────────────────
function LaneToggle({ on, onChange, disabled }: { on: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onChange} disabled={disabled}
      className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0",
        disabled ? "bg-gray-200 cursor-not-allowed" : on ? "bg-green-500" : "bg-red-400")}>
      <span className={cn("inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform",
        on ? "translate-x-4" : "translate-x-0.5")} />
    </button>
  );
}

// ── Reissue Modal ─────────────────────────────────────────────────────────────
function ReissueModal({ onClose }: { onClose: () => void }) {
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedCW, setSelectedCW] = useState("Component Type Training B");
  const [assignOpen, setAssignOpen] = useState(false);
  const [cwOpen, setCwOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <Check size={26} className="text-green-500" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Reissue Assets from Another Booking</h3>
            <p className="text-sm text-gray-500 mt-0.5">Select another Booking ID to reissue assets</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Assignment <span className="text-brand-primary">*</span></label>
            <div className="relative">
              <button type="button" onClick={() => { setAssignOpen(!assignOpen); setCwOpen(false); }}
                className={cn("w-full flex items-center justify-between px-4 py-3 border-2 rounded-lg text-sm transition-colors",
                  assignOpen ? "border-gray-800" : "border-gray-200 hover:border-gray-300")}>
                <span className={selectedAssignment ? "text-gray-800" : "text-gray-400"}>{selectedAssignment || "Select assignment"}</span>
                <ChevronDown size={18} className="text-gray-500" />
              </button>
              {assignOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {MOCK_ASSIGNMENTS.map((a) => (
                    <button key={a.id} type="button"
                      onClick={() => { setSelectedAssignment(a.id); setSelectedCW(a.courseware); setAssignOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                      <div className="font-medium">{a.id}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{a.courseware}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Courseware <span className="text-brand-primary">*</span></label>
            <div className="relative">
              <button type="button" onClick={() => { setCwOpen(!cwOpen); setAssignOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white hover:border-gray-300">
                <span className="text-gray-800">{selectedCW}</span>
                <ChevronDown size={18} className="text-gray-500" />
              </button>
              {cwOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {MOCK_ASSIGNMENTS.map((a) => (
                    <button key={a.courseware} type="button"
                      onClick={() => { setSelectedCW(a.courseware); setCwOpen(false); }}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">{a.courseware}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-8">
          <button type="button" onClick={onClose} className="py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={onClose} className="py-3 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── Upload Modal ──────────────────────────────────────────────────────────────
function UploadModal({ onClose, onUpload }: { onClose: () => void; onUpload: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8" onClick={(e) => e.stopPropagation()}>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Upload size={24} className="text-brand-primary" />
          </div>
          <p className="text-base font-semibold text-gray-800 mb-1">Drag and drop to upload file</p>
          <p className="text-sm text-gray-400 mb-4">Your IMT Spreadsheet File (up to 4 mb.)</p>
          <p className="text-sm text-gray-500 mb-4">Or</p>
          <button type="button" onClick={onUpload}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary-hover mb-6">
            <Upload size={14} /> Browse
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 mb-1">We have prepared the Nominal Roll "Template" for you.</p>
            <p className="text-sm text-gray-400 mb-2">Your IMT Spreadsheet File (up to 4 mb.)</p>
            <button type="button" className="flex items-center gap-1.5 text-sm text-brand-primary font-medium hover:underline mx-auto">
              <Upload size={13} /> Click here to download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ONBOARDING FLOW
// ══════════════════════════════════════════════════════════════════════════════

// ── Onboarding top bar ────────────────────────────────────────────────────────
function OnboardingTopBar({ onBack }: { onBack: () => void }) {
  return (
    <div className="h-14 border-b border-gray-200 flex items-center px-6 bg-white flex-shrink-0 relative">
      <button type="button" onClick={onBack}
        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-600 z-10">
        <ArrowLeft size={18} />
      </button>

      {/* Absolute center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-semibold text-gray-800">{BOOKING.title}</span>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-4 text-sm text-gray-500 z-10">
        <span className="hidden md:block">Thursday, 05 December 2024&nbsp;&nbsp;01:03:33 PM</span>
        <button type="button" className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-primary rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold">DH</div>
          </div>
          <div className="leading-tight hidden md:block">
            <div className="text-xs font-medium text-gray-800">Daniel Huston</div>
            <div className="text-[10px] text-gray-400">olivia@untitledui.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scan ID full page ─────────────────────────────────────────────────────────
function ScanIDContent({
  onBack, onFinished,
}: { onBack: () => void; onFinished: (t: typeof BOOKING.trainees) => void }) {
  const [status, setStatus] = useState<"scanning" | "connected">("scanning");
  const [scanned, setScanned] = useState<typeof BOOKING.trainees>([]);
  const [scanPage, setScanPage] = useState(1);
  const COLS = 10; // items per column
  const PER_PAGE = COLS * 2; // 20 per page
  const isConnected = status === "connected";

  // Simulate auto-scan after 2.5 s
  useEffect(() => {
    if (status !== "scanning") return;
    const t = setTimeout(() => { setStatus("connected"); setScanned(BOOKING.trainees); }, 2500);
    return () => clearTimeout(t);
  }, [status]);

  const totalPages = Math.max(1, Math.ceil(scanned.length / PER_PAGE));
  const pageStart = (scanPage - 1) * PER_PAGE;
  const pageItems = scanned.slice(pageStart, pageStart + PER_PAGE);
  const leftItems  = pageItems.slice(0, COLS);
  const rightItems = pageItems.slice(COLS);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* CSS keyframe for scan line */}
      <style>{`
        @keyframes scanLine { 0%,100%{top:4%} 50%{top:82%} }
        .scan-line-anim { position:absolute; left:0; right:0; height:2px; background:#ef4444; animation:scanLine 2s ease-in-out infinite; }
      `}</style>

      {/* Step header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-800">
            Scan ID for the training
            {isConnected && <span className="text-green-500 font-normal"> — (Connected)</span>}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Total scans ({scanned.length} IDs)</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ArrowLeft size={14} /> Back
          </button>
          <button type="button"
            onClick={() => isConnected && onFinished(scanned)}
            disabled={!isConnected}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors",
              isConnected ? "bg-brand-primary text-white hover:bg-brand-primary-hover" : "bg-gray-100 text-gray-300 cursor-not-allowed")}>
            <ArrowRight size={14} /> Finished scanning
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {!isConnected ? (
            /* Camera viewfinder */
            <div className="relative h-[520px] overflow-hidden">
              {/* Background — simulated camera feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
              {/* Grain texture overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />

              {/* Instruction */}
              <div className="absolute top-6 left-0 right-0 flex justify-center">
                <span className="text-white text-base font-semibold drop-shadow-lg">
                  Place your identity card inside the rectangle box to scan it
                </span>
              </div>

              {/* Scanning rectangle — centered */}
              <div className="absolute"
                style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "480px", height: "300px" }}>
                {/* Border */}
                <div className="absolute inset-0 border-2 border-green-400 rounded-sm" />
                {/* Corner accents */}
                {[["top-0 left-0","border-t-4 border-l-4"],["top-0 right-0","border-t-4 border-r-4"],
                  ["bottom-0 left-0","border-b-4 border-l-4"],["bottom-0 right-0","border-b-4 border-r-4"]].map(([pos, b]) => (
                  <div key={pos} className={cn("absolute w-6 h-6 border-green-400", pos, b)} />
                ))}
                {/* Animated scan line */}
                <div className="scan-line-anim" />
              </div>

              {/* Scanning indicator */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">Scanning…</span>
                </div>
              </div>
            </div>
          ) : (
            /* Scanned list */
            <div>
              <div className="px-5 py-4 border-b border-gray-100 text-center">
                <h3 className="text-base font-bold text-gray-800">Trainned Scanned List</h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left column */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 bg-red-50 border-b border-gray-100">
                      <div className="px-4 py-2.5 text-xs font-bold text-brand-primary">No</div>
                      <div className="px-4 py-2.5 text-xs font-bold text-brand-primary">NRIC</div>
                    </div>
                    {leftItems.map((t, i) => (
                      <div key={i} className="grid grid-cols-2 border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                        <div className="px-4 py-3 text-sm text-gray-700">{pageStart + i + 1}</div>
                        <div className="px-4 py-3 text-sm text-gray-600">{t.nric}</div>
                      </div>
                    ))}
                  </div>

                  {/* Right column */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-2 bg-red-50 border-b border-gray-100">
                      <div className="px-4 py-2.5 text-xs font-bold text-brand-primary">No</div>
                      <div className="px-4 py-2.5 text-xs font-bold text-brand-primary">NRIC</div>
                    </div>
                    {rightItems.map((t, i) => (
                      <div key={i} className="grid grid-cols-2 border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                        <div className="px-4 py-3 text-sm text-gray-700">{pageStart + COLS + i + 1}</div>
                        <div className="px-4 py-3 text-sm text-gray-600">{t.nric}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-1 mt-5">
                  {[["«", 1], ["‹", Math.max(1, scanPage - 1)], null, ["›", Math.min(totalPages, scanPage + 1)], ["»", totalPages]].map((item, idx) =>
                    item === null ? (
                      <span key={idx} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded bg-white min-w-[40px] text-center">
                        {scanPage} of {totalPages}
                      </span>
                    ) : (
                      <button key={idx} type="button"
                        onClick={() => setScanPage(item[1] as number)}
                        disabled={item[1] === scanPage || (item[0] === "«" || item[0] === "‹" ? scanPage === 1 : scanPage === totalPages)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">
                        {item[0]}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: Confirm Attendance ────────────────────────────────────────────────
function AttendanceStep({ onNext }: { onNext: () => void }) {
  const [trainees, setTrainees] = useState<typeof BOOKING.trainees>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [showScanPage, setShowScanPage] = useState(false);
  const hasData = trainees.length > 0;

  // If scan page is open, render it instead
  if (showScanPage) {
    return (
      <ScanIDContent
        onBack={() => setShowScanPage(false)}
        onFinished={(scanned) => { setTrainees(scanned); setShowScanPage(false); }}
      />
    );
  }

  const filtered = trainees.filter(
    (t) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.nric.includes(searchQuery)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleUpload = () => {
    setTrainees(BOOKING.trainees);
    setShowUpload(false);
  };


  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Step header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Confirm Attendance for the training</h2>
          <p className="text-xs text-gray-400 mt-0.5">Please check the attendance of the trainees by scanning or uploading final nominal roll list.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onNext}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ArrowLeft size={14} /> Back
          </button>
          <button type="button"
            onClick={hasData ? onNext : undefined}
            disabled={!hasData}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors",
              hasData
                ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
                : "bg-gray-100 text-gray-400 cursor-not-allowed")}>
            {hasData ? "Confirm nominal roll list" : "Next"} <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Table toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              Nominal Roll List <span className="font-normal text-gray-400">({trainees.length} Trainees)</span>
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search" value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
              </div>
              <button type="button" onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Upload size={14} /> Upload final nominal roll list
              </button>
              <button type="button" onClick={() => setShowScanPage(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-brand-primary text-white hover:bg-brand-primary-hover">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h2v8H7zM11 8h6M11 12h6M11 16h6"/></svg> Scan ID
              </button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="bg-red-50 border-b border-gray-100">
                <th className="w-10 px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-brand-primary" /></th>
                {["No","Rank","Name","NRIC","Platoon Number","Role(s)","Last Updated On",""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                          <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">No trainees to show right now!</p>
                      <p className="text-xs text-gray-400 mb-5">Clicks on " Upload List" or " Scan ID" to create a nominal roll list in the system.</p>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setShowUpload(true)}
                          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                          <Upload size={14} /> Upload final nominal roll list
                        </button>
                        <button type="button" onClick={() => setShowScanPage(true)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary-hover">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h2v8H7zM11 8h6M11 12h6M11 16h6"/></svg>
                          Scan ID
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((t, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="checkbox" className="w-4 h-4 accent-brand-primary" /></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.rank}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.nric}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.platoon}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{t.weaponType}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">Registered (Present)</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      17 January 2025<br /><span className="text-xs">09.29.33 AM</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600"><Pencil size={14} /></button>
                        <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <Pagination current={currentPage} total={totalPages} perPage={PER_PAGE} totalItems={filtered.length} onPageChange={setCurrentPage} />
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUpload={handleUpload} />}
    </div>
  );
}

// ── Step 2: Onboarding Lane Config ────────────────────────────────────────────
interface OnboardingLaneState { on: boolean; weaponType: string; closed: boolean; }

const ONBOARDING_STATIONS = [
  { id: "PLC-IMT-01", label: "PLC-IMT-01" },
  { id: "PLC-IMT-02", label: "PLC-IMT-02" },
];

const makeOnboardingLanes = (): OnboardingLaneState[] =>
  Array.from({ length: 10 }, (_, i) => ({
    on: i !== 3 && i !== 5 && i !== 9,
    weaponType: (i !== 3 && i !== 5 && i !== 9) ? "SAR21" : "",
    closed: i === 9,
  }));

function OnboardingLaneConfig({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const [lanes, setLanes] = useState<OnboardingLaneState[][]>(() =>
    ONBOARDING_STATIONS.map(() => makeOnboardingLanes())
  );
  const [courseware, setCourseware] = useState("ATP (SP)");
  const [cwOpen, setCwOpen] = useState(false);
  // openWeaponDD: null | { stIdx, lIdx }
  const [openWeaponDD, setOpenWeaponDD] = useState<{ stIdx: number; lIdx: number } | null>(null);
  const cwRef = useRef<HTMLDivElement>(null);
  const coursewareOptions = ["ATP (SP)", "BTP (SAR21)", "CS(M) (SAR21/LMG)", "Zeroing (SAR21/LMG)"];

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cwRef.current && !cwRef.current.contains(e.target as Node)) setCwOpen(false);
      setOpenWeaponDD(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const activeLanes = (stationLanes: OnboardingLaneState[]) =>
    stationLanes.filter((l) => l.on && !l.closed).length;

  const setStationLane = (stIdx: number, lIdx: number, patch: Partial<OnboardingLaneState>) => {
    setLanes((prev) => {
      const next = prev.map((s) => [...s]);
      next[stIdx][lIdx] = { ...next[stIdx][lIdx], ...patch };
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Step header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Lane Configuration</h2>
          <p className="text-xs text-gray-400 mt-0.5">Please confirm the lane before start of the training.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ArrowLeft size={14} /> Back
          </button>
          <button type="button" onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">
            Confirm lane configuration <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Card header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              Lane Configuration <span className="text-gray-400 font-normal">({ONBOARDING_STATIONS.length} Base Stations)</span>
            </h3>
            <button type="button"
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary-hover">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              + Mass Assign
            </button>
          </div>

          {/* Courseware dropdown */}
          <div className="px-5 py-3 border-b border-gray-100">
            <div ref={cwRef} className="relative w-44">
              <button type="button" onClick={() => setCwOpen(!cwOpen)}
                className={cn("w-full flex items-center justify-between px-3 py-2 border rounded-lg text-sm bg-white transition-colors",
                  cwOpen ? "border-brand-primary" : "border-gray-200 hover:border-gray-300")}>
                <span className="text-gray-800">{courseware}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {cwOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {coursewareOptions.map((opt) => (
                    <button key={opt} type="button" onClick={() => { setCourseware(opt); setCwOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <span>{opt}</span>
                      {courseware === opt && <Check size={13} className="text-brand-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stations grid */}
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            {ONBOARDING_STATIONS.map((station, stIdx) => {
              const stationLanes = lanes[stIdx];
              const active = activeLanes(stationLanes);
              return (
                <div key={station.id} className="p-5">
                  <div className="text-sm font-semibold text-gray-800 mb-4">
                    {station.label} <span className="text-gray-400 font-normal">({active}/{stationLanes.length} Lanes)</span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-2 text-xs font-semibold text-brand-primary w-20">Lane</th>
                        <th className="text-left py-2 text-xs font-semibold text-brand-primary">Weapon Type</th>
                        <th className="text-left py-2 text-xs font-semibold text-brand-primary w-24">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stationLanes.map((lane, lIdx) => {
                        const isWOpen = openWeaponDD?.stIdx === stIdx && openWeaponDD?.lIdx === lIdx;
                        return (
                          <tr key={lIdx} className={cn("border-b border-gray-50 last:border-b-0", lane.closed && "opacity-60")}>
                            <td className="py-2.5 text-sm text-gray-700">
                              Lane {lIdx + 1}
                              {lane.closed && <span className="ml-2 text-xs font-medium text-brand-primary">Closed</span>}
                            </td>
                            <td className="py-2.5 relative">
                              {lane.closed ? (
                                <span className="text-xs text-gray-400">—</span>
                              ) : (
                                <div className="relative">
                                  <button type="button"
                                    onClick={() => setOpenWeaponDD(isWOpen ? null : { stIdx, lIdx })}
                                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                                    <span className={lane.weaponType ? "text-gray-800" : "text-gray-400"}>
                                      {lane.weaponType || "Weapon Type"}
                                    </span>
                                    <ChevronDown size={12} className="text-gray-400" />
                                  </button>
                                  {isWOpen && (
                                    <div className="absolute z-20 mt-1 left-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-44 overflow-y-auto">
                                      {WEAPON_OPTIONS.map((w) => (
                                        <button key={w} type="button"
                                          onClick={() => { setStationLane(stIdx, lIdx, { weaponType: w }); setOpenWeaponDD(null); }}
                                          className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                          {w}
                                          {lane.weaponType === w && <Check size={12} className="text-brand-primary" />}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                <LaneToggle
                                  on={lane.on}
                                  disabled={lane.closed}
                                  onChange={() => setStationLane(stIdx, lIdx, { on: !lane.on })}
                                />
                                <span className={cn("text-xs font-medium",
                                  lane.closed ? "text-gray-400" : lane.on ? "text-green-600" : "text-red-500")}>
                                  {lane.closed ? "Off" : lane.on ? "On" : "Off"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


// ── Detail List mock data ─────────────────────────────────────────────────────
const DETAIL_GROUPS = [
  {
    station: "PLC-IMT-01",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-01", trainees: 8, status: "Pending" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-01", trainees: 8, status: "Pending" },
    ],
  },
  {
    station: "PLC-IMT-02",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-03", trainees: 8, status: "Pending" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-02", trainees: 8, status: "Pending" },
    ],
  },
];

// ── Edit Detail List sub-page ─────────────────────────────────────────────────
type LaneRow =
  | { type: "trainee"; rank: string; name: string; nric: string }
  | { type: "closed" }
  | { type: "available" };

const EDIT_DETAILS: { label: string; lanes: LaneRow[] }[] = [
  {
    label: "Detail 1",
    lanes: [
      { type: "trainee", rank: "REC", name: "Ken Chow",      nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Brant Chow",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Jake Chow",     nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Kelvin Mars",   nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Holland Tomz",  nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Sam Porter",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Krake Bell",    nric: "S8237272D" },
      { type: "closed" },
      { type: "trainee", rank: "REC", name: "Vaniz Martin",  nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Louis Hamilton", nric: "S8237272D" },
    ],
  },
  {
    label: "Detail 2",
    lanes: [
      { type: "trainee", rank: "REC", name: "Ken Chow",      nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Brant Chow",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Jake Chow",     nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Kelvin Mars",   nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Holland Tomz",  nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Sam Porter",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Krake Bell",    nric: "S8237272D" },
      { type: "closed" },
      { type: "trainee", rank: "REC", name: "Vaniz Martin",  nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Louis Hamilton", nric: "S8237272D" },
    ],
  },
  {
    label: "Detail 3",
    lanes: [
      { type: "trainee", rank: "REC", name: "Ken Chow",      nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Brant Chow",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Jake Chow",     nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Kelvin Mars",   nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Holland Tomz",  nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Sam Porter",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Krake Bell",    nric: "S8237272D" },
      { type: "closed" },
      { type: "trainee", rank: "REC", name: "Vaniz Martin",  nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Louis Hamilton", nric: "S8237272D" },
    ],
  },
  {
    label: "Detail 4",
    lanes: [
      { type: "trainee", rank: "REC", name: "Ken Chow",      nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Brant Chow",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Jake Chow",     nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Kelvin Mars",   nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Holland Tomz",  nric: "S8237272D" },
      { type: "available" },
      { type: "available" },
      { type: "closed" },
      { type: "available" },
      { type: "trainee", rank: "REC", name: "Louis Hamilton", nric: "S8237272D" },
    ],
  },
];

function EditDetailListPage({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Edit Detail List</h2>
          <p className="text-xs text-gray-400 mt-0.5">Update the detail list</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ArrowLeft size={14} /> Back
          </button>
          <button type="button" onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">
            <ArrowRight size={14} /> Confirm
          </button>
        </div>
      </div>

      {/* 4-column grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-4 gap-4 min-w-[900px]">
          {EDIT_DETAILS.map((detail) => (
            <div key={detail.label} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Column header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">{detail.label}</span>
              </div>

              {/* Lane rows */}
              <div className="divide-y divide-gray-50">
                {detail.lanes.map((row, laneIdx) => {
                  const laneNum = laneIdx + 1;

                  if (row.type === "closed") {
                    return (
                      <div key={laneIdx} className="flex items-center gap-2 px-3 py-2.5 bg-red-50">
                        {/* Drag handle */}
                        <span className="text-gray-300 cursor-grab flex-shrink-0">
                          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                            <circle cx="3" cy="2.5" r="1.2"/><circle cx="7" cy="2.5" r="1.2"/>
                            <circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/>
                            <circle cx="3" cy="11.5" r="1.2"/><circle cx="7" cy="11.5" r="1.2"/>
                          </svg>
                        </span>
                        <span className="flex-1 text-xs font-medium text-red-400 italic">Closed for maintenance</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">Lane {laneNum}</span>
                      </div>
                    );
                  }

                  if (row.type === "available") {
                    return (
                      <div key={laneIdx} className="flex items-center gap-2 px-3 py-2.5 bg-green-50">
                        <span className="text-gray-300 cursor-grab flex-shrink-0">
                          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                            <circle cx="3" cy="2.5" r="1.2"/><circle cx="7" cy="2.5" r="1.2"/>
                            <circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/>
                            <circle cx="3" cy="11.5" r="1.2"/><circle cx="7" cy="11.5" r="1.2"/>
                          </svg>
                        </span>
                        <span className="flex-1 text-xs font-medium text-green-600">Available</span>
                        <span className="text-xs text-gray-400 flex-shrink-0">Lane {laneNum}</span>
                      </div>
                    );
                  }

                  // Trainee row
                  return (
                    <div key={laneIdx} className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors">
                      <span className="text-gray-300 cursor-grab flex-shrink-0">
                        <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                          <circle cx="3" cy="2.5" r="1.2"/><circle cx="7" cy="2.5" r="1.2"/>
                          <circle cx="3" cy="7" r="1.2"/><circle cx="7" cy="7" r="1.2"/>
                          <circle cx="3" cy="11.5" r="1.2"/><circle cx="7" cy="11.5" r="1.2"/>
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">
                          {row.rank} {row.name}
                        </div>
                        <div className="text-[10px] text-gray-400">{row.nric}</div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">Lane {laneNum}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Confirm Detail List ───────────────────────────────────────────────
function DetailListStep({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const [showReview, setShowReview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const totalDetails = DETAIL_GROUPS.reduce((s, g) => s + g.details.length, 0);

  const handleEditConfirm = () => {
    setShowEdit(false);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  if (showEdit) {
    return <EditDetailListPage onBack={() => setShowEdit(false)} onConfirm={handleEditConfirm} />;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Step header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Confirm Detail List</h2>
          <p className="text-xs text-gray-400 mt-0.5">Please confirm the detail list for the training.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ArrowLeft size={14} /> Back
          </button>
          <button type="button" onClick={() => setShowReview(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">
            Confirm detail list <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed top-5 right-6 z-50 flex items-center gap-2 bg-white border border-green-200 shadow-lg rounded-lg px-4 py-3 text-sm font-medium text-green-700 animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 flex-shrink-0">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Details have been updated.
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">
              Details <span className="text-gray-400 font-normal">({totalDetails} Details)</span>
            </h3>
            <button type="button" onClick={() => setShowEdit(true)}
              className="px-4 py-2 border border-brand-primary text-brand-primary text-sm font-semibold rounded-lg hover:bg-red-50">
              Edit detail list
            </button>
          </div>

          <div className="p-5 space-y-6">
            {DETAIL_GROUPS.map((group) => (
              <div key={group.station}>
                <div className="text-sm font-bold text-gray-800 mb-3">
                  {group.station}{" "}
                  <span className="text-gray-400 font-normal">({group.details.length} Details)</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {group.details.map((detail, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="text-sm font-semibold text-gray-800">{detail.label}</div>
                      <div className="h-px bg-gray-100" />
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[10px] text-gray-400 mb-0.5">Station</div>
                          <div className="text-xs font-bold text-gray-800">{detail.assignedStation}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 mb-0.5">Trainees</div>
                          <div className="text-xs font-bold text-gray-800">{detail.trainees} Trainees</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 mb-0.5">Status</div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 text-xs font-medium text-gray-600 bg-gray-50">
                            {detail.status}
                          </span>
                        </div>
                      </div>
                      <button type="button"
                        className="w-full py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover">
                        View Detail List
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReview && <ReviewSummaryModal onCancel={() => setShowReview(false)} onConfirm={onConfirm} />}
    </div>
  );
}

// ── Review Summary Modal ──────────────────────────────────────────────────────
function ReviewSummaryModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  const totalDetails = DETAIL_GROUPS.reduce((s, g) => s + g.details.length, 0);
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-start gap-4 p-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A1515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">Review Your Booking Details</h3>
            <p className="text-xs text-gray-500 mt-0.5">Please verify the information below before confirming your booking.</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Total trainee bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Total Trainee</span>
            <span className="text-sm font-bold text-gray-800">{BOOKING.traineesCount} Trainees</span>
          </div>

          {/* Two-column detail */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              {[
                ["Training Section Type", BOOKING.sectionType],
                ["Training Type", BOOKING.trainingType],
                ["Training Mode", BOOKING.trainingMode],
                ["Weapon Type(s)", "SAR21"],
                ["Training Programme", BOOKING.courseware],
                ["Role(s)", "M110 Team (SNIPERS), SPIKE SR (MPAT)"],
                ["Instructor", "Allen Ritchson"],
                ["Unit Contact Details", "+65 232 232 2323\nddah@gmail.com"],
                ["Training Schedule", "AM Session"],
                ["Training Date", "31 January 2025"],
                ["Training Time", "08:00 AM – 12:00 PM"],
                ["Briefing Room", "Briefing Room A"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between px-4 py-2.5 border-b border-gray-50 last:border-b-0">
                  <span className="text-xs text-gray-500 flex-shrink-0 w-36">{label}</span>
                  <span className="text-xs font-semibold text-gray-800 text-right whitespace-pre-line">{value}</span>
                </div>
              ))}
            </div>

            {/* Right */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              {[
                ["Base Station(s)", "PLC-SWT-01, PLC-SWT-02"],
                ["Detail(s)", String(totalDetails)],
                ["Courseware(s)", "ATP (M)"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className="text-xs font-semibold text-gray-800">{value}</span>
                </div>
              ))}
              <div className="px-4 py-3 border-t border-gray-100 mt-1">
                <div className="text-xs font-bold text-gray-700 mb-2">Lane Configuration</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">ATP (M)</span>
                  <span className="text-xs font-bold text-green-600">Assigned</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Ensure you arrive 15 minutes before the scheduled time. You must bring your identity card and any required equipment.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 pb-6">
          <button type="button" onClick={onCancel}
            className="py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm}
            className="py-3 bg-brand-primary text-white rounded-xl text-sm font-semibold hover:bg-brand-primary-hover">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Session Ready Modal ───────────────────────────────────────────────────────
function SessionReadyModal({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <div className="w-12 h-12 rounded-full border-2 border-green-400 flex items-center justify-center">
            <Check size={24} className="text-green-500" strokeWidth={2.5} />
          </div>
        </div>
        <p className="text-base font-bold text-gray-800 mb-6 leading-snug">
          All lanes are operational and the session is about to begin!
        </p>
        <button type="button" onClick={onStart}
          className="w-full py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:bg-brand-primary-hover">
          Start session
        </button>
      </div>
    </div>
  );
}

// ── Live Training Dashboard ───────────────────────────────────────────────────
const LIVE_DETAIL_GROUPS = [
  {
    station: "PLC-IMT-01",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-01", trainees: 8, status: "Completed" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-01", trainees: 8, status: "In Queue" },
    ],
  },
  {
    station: "PLC-IMT-02",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-02", trainees: 8, status: "Completed" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-02", trainees: 8, status: "Ready" },
    ],
  },
];

// ── Live Results mock data ────────────────────────────────────────────────────
const STATIONS_FOR_RESULTS = ["PLC-IMT-01","PLC-IMT-01","PLC-IMT-01","PLC-IMT-01","PLC-IMT-02","PLC-IMT-02","PLC-IMT-02","PLC-IMT-02"];
const LIVE_RESULTS = BOOKING.trainees.map((t, i) => ({
  ...t,
  weapon: "SAR21",
  station: STATIONS_FOR_RESULTS[Math.floor(i / 4) % 8] ?? "PLC-IMT-01",
  detail: `Detail ${Math.floor(i / 8) + 1}`,
  lane: `Lane ${(i % 8) + 1}`,
  stageA: { score: 16, total: 25, pass: true },
  stageB: { score: 24, total: 25, pass: true },
  stageC: { score: 24, total: 25, pass: true },
  courseScore: 64, courseTotalScore: 75, pass: true,
  attempts: [
    { a: 8,  b: 8,  c: 8,  pass: false },
    { a: 11, b: 16, c: 14, pass: false },
    { a: 16, b: 24, c: 24, pass: true  },
  ],
}));

const BASE_STATION_OPTIONS = ["PLC-IMT-01","PLC-IMT-02","PLC-IMT-03","PLC-IMT-04","PLC-SWT-01","PLC-SWT-02"];

// ── Live Results page ─────────────────────────────────────────────────────────
const RESULTS_PER_PAGE = 7;

function LiveResultsPage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"trainee" | "stage">("trainee");
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const filtered = LIVE_RESULTS.filter(
    (r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.nric.includes(search)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / RESULTS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  const Score = ({ score, total, pass }: { score: number; total: number; pass: boolean }) => (
    <span className="text-sm">
      <span className="font-bold text-gray-800">{score}</span>
      <span className="text-gray-400">/{total}</span>{" "}
      <span className={cn("font-bold text-xs", pass ? "text-green-600" : "text-red-500")}>({pass ? "P" : "F"})</span>
    </span>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <h2 className="text-sm font-bold text-gray-800">Live Results</h2>
        <button type="button" onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Nominal Roll List</span>
              <span className="text-sm text-gray-400">({filtered.length} Trainees)</span>
              {/* Tab toggle */}
              <div className="flex items-center ml-4 border border-gray-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setTab("trainee")}
                  className={cn("px-4 py-1.5 text-xs font-semibold transition-colors",
                    tab === "trainee" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50")}>
                  Trainee Info
                </button>
                <button type="button" onClick={() => setTab("stage")}
                  className={cn("px-4 py-1.5 text-xs font-semibold transition-colors border-l border-gray-200",
                    tab === "stage" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50")}>
                  Stage Breakdown
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search" className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
              </div>
              <button type="button" className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {tab === "trainee" ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-gray-100">
                    {["No","Rank","Name","NRIC","Weapon Type(s)","Station","Detail","Lane","Course Results"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, idx) => {
                    const rowIdx = (page - 1) * RESULTS_PER_PAGE + idx;
                    const isExpanded = expandedRow === rowIdx;
                    return (
                      <>
                        <tr key={rowIdx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-700">{rowIdx + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.rank}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.nric}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.weapon}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.station}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.detail}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.lane}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Score score={r.courseScore} total={r.courseTotalScore} pass={r.pass} />
                              <button onClick={() => setExpandedRow(isExpanded ? null : rowIdx)} className="text-gray-400 hover:text-gray-700">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${rowIdx}-exp`} className="border-b border-gray-100 bg-gray-50/50">
                            <td colSpan={9} className="px-6 py-3">
                              <div className="grid grid-cols-3 gap-6 text-xs">
                                {(["A","B","C"] as const).map((stage) => {
                                  const s = stage === "A" ? r.stageA : stage === "B" ? r.stageB : r.stageC;
                                  return (
                                    <div key={stage}>
                                      <div className="font-bold text-gray-600 mb-2">Stage {stage}</div>
                                      <div className="mb-1.5">
                                        Best Attempt: <Score score={s.score} total={s.total} pass={s.pass} />
                                      </div>
                                      <div className="text-gray-400 mb-1">Past Attempt:</div>
                                      {r.attempts.map((att, ai) => {
                                        const sc = stage === "A" ? att.a : stage === "B" ? att.b : att.c;
                                        const p = sc >= 16;
                                        return (
                                          <div key={ai} className="ml-2">
                                            {ai+1}. {ai === 0 ? "1st" : ai === 1 ? "2nd" : "3rd"} Attempt:{" "}
                                            <Score score={sc} total={25} pass={p} />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              /* Stage Breakdown tab */
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-gray-100">
                    {["","Station","Detail","Lane","Stage A","Stage B","Stage C","Course Results"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, idx) => {
                    const rowIdx = (page - 1) * RESULTS_PER_PAGE + idx;
                    const isExpanded = expandedRow === rowIdx;
                    return (
                      <>
                        <tr key={rowIdx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <input type="checkbox" className="w-4 h-4 accent-brand-primary" />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.station}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.detail}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.lane}</td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            Best Attempt: <Score score={r.stageA.score} total={r.stageA.total} pass={r.stageA.pass} />
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            Best Attempt: <Score score={r.stageB.score} total={r.stageB.total} pass={r.stageB.pass} />
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            Best Attempt: <Score score={r.stageC.score} total={r.stageC.total} pass={r.stageC.pass} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Score score={r.courseScore} total={r.courseTotalScore} pass={r.pass} />
                              <button onClick={() => setExpandedRow(isExpanded ? null : rowIdx)} className="text-gray-400 hover:text-gray-700">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${rowIdx}-exp`} className="border-b border-gray-100 bg-gray-50/50">
                            <td colSpan={8} className="px-6 py-3">
                              <div className="grid grid-cols-3 gap-6 text-xs">
                                {(["A","B","C"] as const).map((stage) => {
                                  const s = stage === "A" ? r.stageA : stage === "B" ? r.stageB : r.stageC;
                                  return (
                                    <div key={stage}>
                                      <div className="font-bold text-gray-600 mb-2">Stage {stage} — Best Attempt: <Score score={s.score} total={s.total} pass={s.pass} /></div>
                                      <div className="text-gray-400 mb-1">Past Attempt:</div>
                                      {r.attempts.map((att, ai) => {
                                        const sc = stage === "A" ? att.a : stage === "B" ? att.b : att.c;
                                        return (
                                          <div key={ai} className="ml-2">
                                            {ai+1}. {ai === 0 ? "1st" : ai === 1 ? "2nd" : "3rd"} Attempt:{" "}
                                            <Score score={sc} total={25} pass={sc >= 16} />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <Pagination current={page} total={totalPages} perPage={RESULTS_PER_PAGE} totalItems={filtered.length} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// ── Create New Detail Modal ───────────────────────────────────────────────────
const STAGE_OPTIONS = ["Stage A","Stage B","Stage C","Stage D","Stage E"] as const;

function CreateNewDetailModal({ onCancel, onConfirm }: {
  onCancel: () => void;
  onConfirm: (stages: string[], station: string) => void;
}) {
  const [stageOpen, setStageOpen] = useState(true);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [station, setStation] = useState("");
  const [stationOpen, setStationOpen] = useState(false);
  const stationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (stationRef.current && !stationRef.current.contains(e.target as Node)) setStationOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const allSelected = selectedStages.length === STAGE_OPTIONS.length;
  const toggleAll = () => setSelectedStages(allSelected ? [] : [...STAGE_OPTIONS]);
  const toggleStage = (s: string) => setSelectedStages((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const gridItems = [{ label: "Select All", special: true }, ...STAGE_OPTIONS.map((s) => ({ label: s, special: false }))];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-brand-primary" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-800">Create New Detail</div>
              <div className="text-sm text-gray-400 mt-0.5">Please fill all the information.</div>
            </div>
          </div>

          {/* Booking Type */}
          <div>
            <button type="button" onClick={() => setStageOpen(!stageOpen)}
              className="w-full flex items-center justify-between text-sm font-semibold text-gray-800 mb-3">
              Booking Type
              {stageOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {stageOpen && (
              <div className="grid grid-cols-3 gap-2">
                {gridItems.map(({ label, special }) => {
                  const checked = special ? allSelected : selectedStages.includes(label);
                  return (
                    <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={checked} onChange={special ? toggleAll : () => toggleStage(label)}
                        className="w-4 h-4 accent-brand-primary rounded" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Station */}
          <div>
            <div className="text-sm font-semibold text-gray-800 mb-2">
              Station <span className="text-brand-primary">*</span>
            </div>
            <div ref={stationRef} className="relative">
              <button type="button" onClick={() => setStationOpen(!stationOpen)}
                className={cn("w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm bg-white",
                  stationOpen ? "border-brand-primary" : "border-gray-200 hover:border-gray-300",
                  station ? "text-gray-800" : "text-gray-400")}>
                <span>{station || "Select base station"}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {stationOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {BASE_STATION_OPTIONS.map((opt) => (
                    <button key={opt} type="button" onClick={() => { setStation(opt); setStationOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <span>{opt}</span>
                      {station === opt && <Check size={13} className="text-brand-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 pb-6">
          <button type="button" onClick={onCancel}
            className="py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button type="button" onClick={() => onConfirm(selectedStages, station)} disabled={!station || selectedStages.length === 0}
            className={cn("py-3 rounded-xl text-sm font-semibold", (!station || selectedStages.length === 0) ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-brand-primary text-white hover:bg-brand-primary-hover")}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Detail Lane Card ──────────────────────────────────────────────────────
const NEW_DETAIL_LANES: { lane: number; state: "available" | "closed" | "off" }[] = [
  { lane: 1, state: "available" },
  { lane: 2, state: "closed" },
  { lane: 3, state: "available" },
  { lane: 4, state: "available" },
  { lane: 5, state: "available" },
  { lane: 6, state: "available" },
  { lane: 7, state: "available" },
  { lane: 8, state: "off" },
  { lane: 9, state: "available" },
  { lane: 10, state: "available" },
];

// ── Select Trainee Page ───────────────────────────────────────────────────────
type AssignedTrainee = { rank: string; name: string; nric: string; weapon: string };

function SelectTraineePage({ laneNo, onBack, onSave }: {
  laneNo: number;
  onBack: () => void;
  onSave: (t: AssignedTrainee) => void;
}) {
  const [tab, setTab] = useState<"trainee" | "stage">("trainee");
  const [search, setSearch] = useState("");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const filtered = LIVE_RESULTS.filter(
    (r) => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.nric.includes(search)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / RESULTS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE);

  const Score = ({ score, total, pass }: { score: number; total: number; pass: boolean }) => (
    <span className="text-sm">
      <span className="font-bold text-gray-800">{score}</span>
      <span className="text-gray-400">/{total}</span>{" "}
      <span className={cn("font-bold text-xs", pass ? "text-green-600" : "text-red-500")}>({pass ? "P" : "F"})</span>
    </span>
  );

  const handleSave = () => {
    if (selectedIdx === null) return;
    const t = LIVE_RESULTS[selectedIdx];
    onSave({ rank: t.rank, name: t.name, nric: t.nric, weapon: t.weapon });
  };

  const globalIdx = (rowIdx: number) => (page - 1) * RESULTS_PER_PAGE + rowIdx;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Page title row */}
      <div className="px-6 py-5 flex items-start justify-between flex-shrink-0">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Select Trainees</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Select trainees you would like to add into Lane {laneNo} for reshoot.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <ArrowLeft size={14} /> Back
          </button>
          <button type="button" onClick={handleSave} disabled={selectedIdx === null}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary-hover disabled:opacity-40 disabled:cursor-not-allowed">
            Save Detail List <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">Nominal Roll List</span>
              <span className="text-sm text-gray-400">({filtered.length} Trainees)</span>
              <div className="flex items-center ml-4 border border-gray-200 rounded-lg overflow-hidden">
                <button type="button" onClick={() => setTab("trainee")}
                  className={cn("px-4 py-1.5 text-xs font-semibold transition-colors",
                    tab === "trainee" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50")}>
                  Trainee Info
                </button>
                <button type="button" onClick={() => setTab("stage")}
                  className={cn("px-4 py-1.5 text-xs font-semibold transition-colors border-l border-gray-200",
                    tab === "stage" ? "bg-brand-primary text-white" : "text-gray-500 hover:bg-gray-50")}>
                  Stage Breakdown
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search" className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary" />
              </div>
              <button type="button" className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {tab === "trainee" ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-gray-100">
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 accent-brand-primary" disabled />
                    </th>
                    {["No","Rank","Name","NRIC","Weapon Type(s)","Station","Detail","Lane","Course Results"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, idx) => {
                    const gi = globalIdx(idx);
                    const isExpanded = expandedRow === gi;
                    const checked = selectedIdx === gi;
                    return (
                      <>
                        <tr key={gi} onClick={() => setSelectedIdx(checked ? null : gi)}
                          className={cn("border-b border-gray-50 cursor-pointer transition-colors", checked ? "bg-red-50/40" : "hover:bg-gray-50")}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={checked} onChange={() => setSelectedIdx(checked ? null : gi)}
                              className="w-4 h-4 accent-brand-primary" />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{gi + 1}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.rank}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{r.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.nric}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.weapon}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.station}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.detail}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.lane}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Score score={r.courseScore} total={r.courseTotalScore} pass={r.pass} />
                              <button type="button" onClick={(e) => { e.stopPropagation(); setExpandedRow(isExpanded ? null : gi); }}
                                className="text-gray-400 hover:text-gray-700">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${gi}-exp`} className="border-b border-gray-100 bg-gray-50/50">
                            <td colSpan={10} className="px-6 py-3">
                              <div className="grid grid-cols-3 gap-6 text-xs">
                                {(["A","B","C"] as const).map((stage) => {
                                  const s = stage === "A" ? r.stageA : stage === "B" ? r.stageB : r.stageC;
                                  return (
                                    <div key={stage}>
                                      <div className="font-bold text-gray-600 mb-2">Stage {stage}</div>
                                      <div className="mb-1.5">Best Attempt: <Score score={s.score} total={s.total} pass={s.pass} /></div>
                                      <div className="text-gray-400 mb-1">Past Attempt:</div>
                                      {r.attempts.map((att, ai) => {
                                        const sc = stage === "A" ? att.a : stage === "B" ? att.b : att.c;
                                        return (
                                          <div key={ai} className="ml-2">
                                            {ai + 1}. {ai === 0 ? "1st" : ai === 1 ? "2nd" : "3rd"} Attempt:{" "}
                                            <Score score={sc} total={25} pass={sc >= 16} />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-gray-100">
                    <th className="w-10 px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 accent-brand-primary" disabled />
                    </th>
                    {["Station","Detail","Lane","Stage A","Stage B","Stage C","Course Results"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brand-primary whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r, idx) => {
                    const gi = globalIdx(idx);
                    const isExpanded = expandedRow === gi;
                    const checked = selectedIdx === gi;
                    return (
                      <>
                        <tr key={gi} onClick={() => setSelectedIdx(checked ? null : gi)}
                          className={cn("border-b border-gray-50 cursor-pointer transition-colors", checked ? "bg-red-50/40" : "hover:bg-gray-50")}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={checked} onChange={() => setSelectedIdx(checked ? null : gi)}
                              className="w-4 h-4 accent-brand-primary" />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.station}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.detail}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{r.lane}</td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            Best Attempt: <Score score={r.stageA.score} total={r.stageA.total} pass={r.stageA.pass} />
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            Best Attempt: <Score score={r.stageB.score} total={r.stageB.total} pass={r.stageB.pass} />
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-700">
                            Best Attempt: <Score score={r.stageC.score} total={r.stageC.total} pass={r.stageC.pass} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Score score={r.courseScore} total={r.courseTotalScore} pass={r.pass} />
                              <button type="button" onClick={(e) => { e.stopPropagation(); setExpandedRow(isExpanded ? null : gi); }}
                                className="text-gray-400 hover:text-gray-700">
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${gi}-exp`} className="border-b border-gray-100 bg-gray-50/50">
                            <td colSpan={8} className="px-6 py-3">
                              <div className="grid grid-cols-3 gap-6 text-xs">
                                {(["A","B","C"] as const).map((stage) => {
                                  const s = stage === "A" ? r.stageA : stage === "B" ? r.stageB : r.stageC;
                                  return (
                                    <div key={stage}>
                                      <div className="font-bold text-gray-600 mb-2">Stage {stage} — Best: <Score score={s.score} total={s.total} pass={s.pass} /></div>
                                      <div className="text-gray-400 mb-1">Past Attempt:</div>
                                      {r.attempts.map((att, ai) => {
                                        const sc = stage === "A" ? att.a : stage === "B" ? att.b : att.c;
                                        return (
                                          <div key={ai} className="ml-2">
                                            {ai + 1}. {ai === 0 ? "1st" : ai === 1 ? "2nd" : "3rd"} Attempt:{" "}
                                            <Score score={sc} total={25} pass={sc >= 16} />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <Pagination current={page} total={totalPages} perPage={RESULTS_PER_PAGE} totalItems={filtered.length} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

// ── New Detail Card ───────────────────────────────────────────────────────────
function NewDetailCard({ stages, station, laneAssignments, onAddToLane, onRemoveFromLane, onDelete, onConfirm }: {
  stages: string[]; station: string;
  laneAssignments: Record<number, AssignedTrainee>;
  onAddToLane: (laneNo: number) => void;
  onRemoveFromLane: (laneNo: number) => void;
  onDelete: () => void; onConfirm: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const assignedCount = Object.keys(laneAssignments).length;
  const availableCount = NEW_DETAIL_LANES.filter((l) => l.state === "available").length - assignedCount;
  const stageLabel = stages.join(", ");
  const label = `New Detail (${stageLabel})`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-800">{label}</span>
          <span className="text-xs text-gray-400">{station}</span>
          <span className="text-xs text-gray-500">{availableCount}/10 seats available</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onDelete}
            className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50">
            Delete Detail
          </button>
          <button type="button"
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
            Edit Stage
          </button>
          <button type="button" onClick={onConfirm}
            className="px-3 py-1.5 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover">
            Confirm New Detail
          </button>
          <button type="button" onClick={() => setCollapsed(!collapsed)}
            className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50">
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Lane grid */}
      {!collapsed && (
        <div className="p-4">
          <div className="grid grid-cols-5 gap-3">
            {NEW_DETAIL_LANES.map(({ lane, state }) => {
              const isClosed = state === "closed";
              const isOff = state === "off";
              const unavailable = isClosed || isOff;
              const assigned = laneAssignments[lane];

              if (assigned) {
                return (
                  <div key={lane} className="relative border border-green-200 bg-green-50 rounded-lg px-3 py-2.5 min-h-[64px]">
                    <button type="button" onClick={() => onRemoveFromLane(lane)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                    <div className="text-xs font-semibold text-gray-800 pr-5">{assigned.rank} {assigned.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{assigned.nric} | {assigned.weapon}</div>
                    <div className="text-[10px] text-gray-400 mt-1 text-right">Lane {lane}</div>
                  </div>
                );
              }

              return (
                <div key={lane}
                  onClick={unavailable ? undefined : () => onAddToLane(lane)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-lg border min-h-[64px]",
                    unavailable ? "border-gray-100 bg-gray-50" : "border-gray-200 bg-white hover:border-brand-primary/30 cursor-pointer"
                  )}>
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center flex-shrink-0",
                    unavailable ? "bg-gray-100" : "bg-gray-100"
                  )}>
                    {unavailable ? (
                      <span className="text-[10px] text-gray-400 font-bold">—</span>
                    ) : (
                      <Plus size={12} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-700">Lane {lane}</div>
                    {isClosed && <div className="text-[10px] text-red-400 font-medium">(Closed)</div>}
                    {isOff && <div className="text-[10px] text-red-400 font-medium">(Off)</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function LiveTrainingDashboard({ onBack }: { onBack: () => void }) {
  // Countdown from 60 minutes
  const [secondsLeft, setSecondsLeft] = useState(3599);
  const [showLiveResults, setShowLiveResults] = useState(false);
  const [showCreateDetail, setShowCreateDetail] = useState(false);
  const [newDetail, setNewDetail] = useState<{ stages: string[]; station: string } | null>(null);
  const [selectingForLane, setSelectingForLane] = useState<number | null>(null);
  const [laneAssignments, setLaneAssignments] = useState<Record<number, AssignedTrainee>>({});

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const totalDetails = LIVE_DETAIL_GROUPS.reduce((s, g) => s + g.details.length, 0);

  function StatusPill({ status }: { status: string }) {
    if (status === "Ongoing") return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">{status}</span>
    );
    if (status === "In Queue") return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-500">{status}</span>
    );
    if (status === "Completed") return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">{status}</span>
    );
    if (status === "Ready") return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">{status}</span>
    );
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">{status}</span>;
  }

  // ── Sub-page: Live Results ────────────────────────────────────────────────
  if (showLiveResults) {
    return <LiveResultsPage onBack={() => setShowLiveResults(false)} />;
  }

  // ── Sub-page: Select trainee for a lane ───────────────────────────────────
  if (selectingForLane !== null) {
    return (
      <SelectTraineePage
        laneNo={selectingForLane}
        onBack={() => setSelectingForLane(null)}
        onSave={(t) => {
          setLaneAssignments((prev) => ({ ...prev, [selectingForLane]: t }));
          setSelectingForLane(null);
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Info bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-6 flex-shrink-0">
        <div className="flex items-center gap-6 flex-1">
          <div>
            <div className="text-sm font-bold text-gray-800">IMT Training For Unit 20</div>
            <div className="text-xs text-gray-400">#111024-PTC001</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Unit Number</div>
            <div className="text-sm font-bold text-gray-800">Unit 20</div>
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Courseware</div>
            <div className="text-sm font-bold text-gray-800">ATP (SP)</div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={14} className="text-blue-500" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-medium">Marksmanship Trainee(s)</div>
              <div className="text-sm font-bold text-gray-800"><span className="text-xl">0</span> /28 Trainee(s)</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Users size={14} className="text-green-500" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-medium">Pass Trainee(s)</div>
              <div className="text-sm font-bold text-gray-800"><span className="text-xl">0</span> /28 Trainee(s)</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Users size={14} className="text-brand-primary" />
            </div>
            <div>
              <div className="text-[10px] text-gray-400 font-medium">Fail Trainee(s)</div>
              <div className="text-sm font-bold text-gray-800"><span className="text-xl">0</span> /28 Trainee(s)</div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A1515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-lg font-bold text-brand-primary tracking-widest font-mono">
              {hh}:{mm}:{ss}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">
            Details <span className="font-normal text-gray-400">({totalDetails} Details)</span>
          </h3>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowCreateDetail(true)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Create New Detail
            </button>
            <button
              type="button"
              onClick={() => setShowLiveResults(true)}
              className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary-hover">
              Live Results
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {/* New detail card (if created) */}
          {newDetail && (
            <NewDetailCard
              stages={newDetail.stages}
              station={newDetail.station}
              laneAssignments={laneAssignments}
              onAddToLane={(laneNo) => setSelectingForLane(laneNo)}
              onRemoveFromLane={(laneNo) => setLaneAssignments((prev) => {
                const next = { ...prev };
                delete next[laneNo];
                return next;
              })}
              onDelete={() => { setNewDetail(null); setLaneAssignments({}); }}
              onConfirm={() => { setNewDetail(null); setLaneAssignments({}); }}
            />
          )}

          {LIVE_DETAIL_GROUPS.map((group) => (
            <div key={group.station}>
              <div className="text-sm font-bold text-gray-800 mb-3">
                {group.station}{" "}
                <span className="text-gray-400 font-normal">({group.details.length} Details)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {group.details.map((detail, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-semibold text-gray-800">{detail.label}</span>
                      <Monitor size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="h-px bg-gray-100" />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[10px] text-gray-400 mb-0.5">Station</div>
                        <div className="text-xs font-bold text-gray-800">{detail.assignedStation}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 mb-0.5">Trainees</div>
                        <div className="text-xs font-bold text-gray-800">{detail.trainees} Trainees</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 mb-0.5">Status</div>
                        <StatusPill status={detail.status} />
                      </div>
                    </div>
                    <button type="button"
                      className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover">
                      View Detail List
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Detail modal overlay */}
      {showCreateDetail && (
        <CreateNewDetailModal
          onCancel={() => setShowCreateDetail(false)}
          onConfirm={(stages, station) => {
            setNewDetail({ stages, station });
            setShowCreateDetail(false);
          }}
        />
      )}
    </div>
  );
}

// ── Onboarding entry point ────────────────────────────────────────────────────
function OnboardingFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [showSessionReady, setShowSessionReady] = useState(false);

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      <OnboardingTopBar onBack={step === 0 ? onClose : () => setStep((s) => s - 1)} />

      {step === 0 && <AttendanceStep onNext={() => setStep(1)} />}
      {step === 1 && (
        <OnboardingLaneConfig
          onBack={() => setStep(0)}
          onConfirm={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <DetailListStep
          onBack={() => setStep(1)}
          onConfirm={() => setShowSessionReady(true)}
        />
      )}
      {step === 3 && <LiveTrainingDashboard onBack={() => setStep(2)} />}

      {showSessionReady && (
        <SessionReadyModal onStart={() => { setShowSessionReady(false); setStep(3); }} />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BOOKING DETAIL PAGE
// ══════════════════════════════════════════════════════════════════════════════

type DetailTab = "Booking Details" | "Trainee Information" | "Time Slots" | "Lane Configuration";

export function BookingDetail({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<DetailTab>("Booking Details");
  const [issueDropOpen, setIssueDropOpen] = useState(false);
  const [showReissue, setShowReissue] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const tabs: DetailTab[] = ["Booking Details", "Trainee Information", "Time Slots", "Lane Configuration"];

  if (showOnboarding) {
    return <OnboardingFlow onClose={() => setShowOnboarding(false)} />;
  }

  return (
    <>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-6">
          <div className="mb-4">
            <Breadcrumb items={["Bookings", "Booking List", "Booking Details"]} />
          </div>

          {/* Page header */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-gray-900">{BOOKING.title}</h1>
                <StatusBadge status={BOOKING.status} size="sm" />
              </div>
              <p className="text-sm text-gray-500">{BOOKING.id}</p>
              <p className="text-sm text-gray-500 mt-0.5">{BOOKING.date}&nbsp;&nbsp;&nbsp;{BOOKING.time}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Issue Assets dropdown */}
              <div className="relative">
                <button type="button" onClick={() => setIssueDropOpen(!issueDropOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Issue Assets
                  {issueDropOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {issueDropOpen && (
                  <div className="absolute right-0 mt-1 w-68 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    <button type="button" onClick={() => setIssueDropOpen(false)}
                      className="w-full text-left px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50">
                      Issue Assets
                    </button>
                    <button type="button" onClick={() => { setIssueDropOpen(false); setShowReissue(true); }}
                      className="w-full text-left px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50">
                      Reissue Assets from Another Booking
                    </button>
                  </div>
                )}
              </div>

              <button type="button" onClick={() => setShowOnboarding(true)}
                className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-lg hover:bg-brand-primary-hover">
                Start Onboarding
              </button>

              <button type="button" className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-5 border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                className={cn("px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === tab
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700")}>
                {tab}
              </button>
            ))}
          </div>

          {/* Tab: Booking Details */}
          {activeTab === "Booking Details" && (
            <div className="space-y-5">
              {/* Info grid */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <dl className="grid grid-cols-3 gap-x-8 gap-y-5">
                  <Field label="Program" value={BOOKING.program} />
                  <Field label="Training Mode" value={BOOKING.trainingMode} />
                  <Field label="Briefing Room" value={BOOKING.briefingRoom} />
                  <Field label="Section Type" value={BOOKING.sectionType} />
                  <Field label="Courseware" value={BOOKING.courseware} />
                  <Field label="Trainee" value={`${BOOKING.traineesCount} Trainee(s)`} />
                  <Field label="Training Type" value={BOOKING.trainingType} />
                  <Field label="Assignment ID" value={<span className="text-gray-400">—</span>} />
                  <Field label="ATMS File" value={BOOKING.atmsFile} />
                </dl>
              </div>

              {/* Weapon list */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-bold text-gray-700 mb-4">
                  Weapon List ({BOOKING.weapons.reduce((a, w) => a + w.units, 0)} Units)
                </h2>
                <dl className="grid grid-cols-3 gap-x-8 gap-y-4">
                  {BOOKING.weapons.map((w) => (
                    <div key={w.type}>
                      <dt className="text-xs text-gray-400 mb-0.5">Weapon Type</dt>
                      <dd className="text-sm font-semibold text-gray-800">{w.type} ({w.units} Units)</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Stations */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-sm font-bold text-gray-700 mb-4">Base Station ({BOOKING.baseStations.length} Stations)</h2>
                  <dl className="space-y-3">
                    {BOOKING.baseStations.map((s, i) => (
                      <div key={i}>
                        <dt className="text-xs text-gray-400 mb-0.5">{s.label}</dt>
                        <dd className="text-sm font-semibold text-gray-800">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-sm font-bold text-gray-700 mb-4">C-Shaped Station ({BOOKING.cShapedStations.length} Stations)</h2>
                  <dl className="space-y-3">
                    {BOOKING.cShapedStations.map((s, i) => (
                      <div key={i}>
                        <dt className="text-xs text-gray-400 mb-0.5">{s.label}</dt>
                        <dd className="text-sm font-semibold text-gray-800">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Trainee Information */}
          {activeTab === "Trainee Information" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800">
                  Nominal Roll <span className="font-normal text-gray-400">({BOOKING.trainees.length} Trainees)</span>
                </h2>
                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-md hover:bg-gray-50">
                  <Users size={13} /> Export
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-gray-100">
                    {["No","Rank","Name","NRIC","Platoon Number","Weapon Type(s)"].map((h) => (
                      <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-brand-primary">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BOOKING.trainees.slice(0, 10).map((t) => (
                    <tr key={t.no} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50">
                      <td className="px-5 py-3 text-sm text-gray-700">{t.no}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{t.rank}</td>
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{t.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{t.nric}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{t.platoon}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{t.weaponType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 text-xs text-gray-400 border-t border-gray-100">
                Showing 10 of {BOOKING.trainees.length} trainees
              </div>
            </div>
          )}

          {/* Tab: Time Slots */}
          {activeTab === "Time Slots" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-bold text-gray-700 mb-5">Training Schedule</h2>
              <dl className="grid grid-cols-3 gap-x-8 gap-y-5">
                <Field label="Schedule Type" value="Fixed Schedule" />
                <Field label="Training Date" value={BOOKING.date} />
                <Field label="Training Time" value={BOOKING.time} />
                <Field label="Briefing Room" value={BOOKING.briefingRoom} />
                <Field label="Session Type" value="Full Day" />
              </dl>
            </div>
          )}

          {/* Tab: Lane Configuration */}
          {activeTab === "Lane Configuration" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-700">Lane Configuration</h2>
                <p className="text-xs text-gray-400 mt-0.5">SWT-01 — {BOOKING.courseware}</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="bg-red-50 border-b border-gray-100">
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-primary w-32">Lane</th>
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-primary">Weapon Type</th>
                    <th className="text-left px-5 py-2.5 text-xs font-semibold text-brand-primary w-24">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {BOOKING.laneConfig.map((lane) => (
                    <tr key={lane.lane} className="border-b border-gray-50 last:border-b-0">
                      <td className="px-5 py-3 text-sm text-gray-700">{lane.lane}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{lane.weapon}</td>
                      <td className="px-5 py-3"><LaneStatusPill status={lane.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showReissue && <ReissueModal onClose={() => setShowReissue(false)} />}
    </>
  );
}
