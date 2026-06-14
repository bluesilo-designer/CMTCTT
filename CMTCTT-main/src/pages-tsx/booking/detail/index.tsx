import { useState, useRef, useEffect, useMemo } from "react";
import type { Booking } from "./types";
import { useBookingStore } from "./store/useBookingStore";
import { NominalRollTable } from "./components/NominalRollTable";
import { CMTNominalRollDetail } from "./components/CMTNominalRollDetail";
import { CMTDetailListTab } from "./components/CMTDetailListTab";
import { LaneConfigTable } from "./components/LaneConfigTable";
import { BookingDetailListTab } from "./components/BookingDetailListTab";
import { CMTCabinConfigStep } from "../create/components/CMTCabinConfigStep";
import type { CabinRow } from "../create/components/CMTCabinConfigStep";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { CMTOnboardingFlow } from "./components/CMTOnboardingFlow";
import { CMTCTTOnboardingFlow } from "./components/CMTCTTOnboardingFlow";
import { ReissueModal } from "./modals/ReissueModal";
import { AddTraineeModal } from "./modals/AddTraineeModal";
import { Button } from "@/components/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ChevronDown, ChevronUp, Check, Upload,
  MoreVertical, Plus, X, Calendar, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { bookings } from "@/data/mock";
import { getCMTLocalBookingById, cmtLocalBookingToBooking } from "@/data/localBookings";

// ── Pre-filled cabin data for Booking Detail view (demo) ─────────────────────
const DETAIL_DEMO_CABINS: CabinRow[] = [
  { id: "CMT01", occupied: false, selected: true,  callSign: "09",  weaponVariant: "40AGL", role: "VO,VC"     },
  { id: "CMT02", occupied: false, selected: true,  callSign: "09Z", weaponVariant: "40AGL", role: "TC/PC,SC"  },
  { id: "CMT03", occupied: true,  selected: false, callSign: "",    weaponVariant: "",      role: ""          },
  { id: "CMT04", occupied: false, selected: true,  callSign: "08",  weaponVariant: "50HMG", role: "SO,VO"     },
  { id: "CMT05", occupied: true,  selected: false, callSign: "",    weaponVariant: "",      role: ""          },
  { id: "CMT06", occupied: false, selected: false, callSign: "08Z", weaponVariant: "50HMG", role: "VC"        },
  { id: "CMT07", occupied: true,  selected: false, callSign: "",    weaponVariant: "",      role: ""          },
  { id: "CMT08", occupied: false, selected: false, callSign: "07",  weaponVariant: "40AGL", role: "TC"        },
  { id: "CMT09", occupied: false, unavailable: true, selected: false, callSign: "", weaponVariant: "", role: "" },
  { id: "CMT10", occupied: true,  selected: false, callSign: "",    weaponVariant: "",      role: ""          },
  { id: "CMT11", occupied: true,  selected: false, callSign: "",    weaponVariant: "",      role: ""          },
  { id: "CMT12", occupied: true,  selected: false, callSign: "",    weaponVariant: "",      role: ""          },
];

// ── Mock booking base data ────────────────────────────────────────────────────
const BOOKING_DATA = {
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

// ── Tiny helpers ──────────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-gray-400 mb-0.5">{label}</dt>
      <dd className="text-sm font-semibold text-gray-800">{value ?? "—"}</dd>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// BOOKING DETAIL PAGE
// ══════════════════════════════════════════════════════════════════════════════

type DetailTab = "Booking Details" | "Nominal Rolls" | "Lane Configuration" | "Cabin Configuration" | "Detail List";

export function BookingDetail() {
  const [activeTab, setActiveTab] = useState<DetailTab>("Booking Details");
  const [issueDropOpen, setIssueDropOpen] = useState(false);
  const [showReissue, setShowReissue] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCoursewarePopup, setShowCoursewarePopup] = useState(false);
  const [showAddTrainee, setShowAddTrainee] = useState(false);
  const [showDotMenu,           setShowDotMenu]           = useState(false);
  const [cmtDetailListGenerated, setCmtDetailListGenerated] = useState(false);
  // Track unsaved changes in Nominal Roll / Cabin Config after Detail List is generated
  const [nominalRollChanged,  setNominalRollChanged]  = useState(false);
  const [cabinConfigChanged,  setCabinConfigChanged]   = useState(false);
  const [showSyncConfirm,     setShowSyncConfirm]      = useState(false);
  const [showSyncApproval,    setShowSyncApproval]     = useState(false);
  // True once the user explicitly confirms Sync — hides Sync, shows Start Onboarding
  const [isSynced,            setIsSynced]             = useState(false);
  const [cmtcttActiveTab, setCmtcttActiveTab] = useState("Booking Details");
  const dotMenuRef = useRef<HTMLDivElement>(null);
  const setBooking = useBookingStore((s) => s.setBooking);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target as Node)) setShowDotMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const getBookingData = () => {
    const params = new URLSearchParams(window.location.search);
    let bookingId = params.get("id");
    if (!bookingId) {
      const hashMatch = window.location.hash.match(/\?id=([^&]+)/);
      if (hashMatch) bookingId = hashMatch[1];
    }
    const id = bookingId || "1";
    // Check mock data first
    const mockBooking = bookings.find(b => b.id === id);
    if (mockBooking) return mockBooking;
    // Fall back to locally-saved CMT bookings
    const localEntry = getCMTLocalBookingById(id);
    if (localEntry) return cmtLocalBookingToBooking(localEntry);
    return undefined;
  };

  const selectedBooking = getBookingData();

  const BOOKING = useMemo<Booking>(() => selectedBooking ? {
    ...BOOKING_DATA,
    id: selectedBooking.bookingId,
    title: selectedBooking.program,
    status: selectedBooking.status,
    date: selectedBooking.bookingDate,
    time: selectedBooking.bookingTime,
    program: selectedBooking.program,
    trainingMode: selectedBooking.trainingMode,
    briefingRoom: "Briefing Room A",
    sectionType: (selectedBooking.isCMT || selectedBooking.isCMTCTT) ? "Compartment Selection" : (selectedBooking.sectionType ?? "Standalone"),
    courseware: selectedBooking.courseware,
    traineesCount: selectedBooking.trainees ?? 32,
    trainingType: selectedBooking.trainingType,
    assignmentId: selectedBooking.assignmentId,
    atmsFile: "202412231456",
    isIntegrated: false,
    isCMT: selectedBooking.isCMT ?? false,
    isCMTCTT: selectedBooking.isCMTCTT ?? false,
  } : {
    ...BOOKING_DATA,
    id: "#111024-KC0004",
    title: "SWT Training for Unit 19",
    status: "Upcoming",
    date: "10 January 2025",
    time: "08:00 AM – 06:00 PM (Full Day)",
    program: "SWT Training",
    trainingMode: "Marksmanship",
    briefingRoom: "Briefing Room",
    sectionType: "Standalone",
    courseware: "Component Type Training B",
    traineesCount: 32,
    trainingType: "Group",
    assignmentId: "-",
    atmsFile: "202412231456",
    isIntegrated: false,
    isCMT: false,
  }, [selectedBooking]);

  const tabs: DetailTab[] = BOOKING.isCMT
    ? ["Booking Details", "Nominal Rolls", "Cabin Configuration", "Detail List"]
    : ["Booking Details", "Nominal Rolls", "Lane Configuration", "Detail List"];

  useEffect(() => {
    setBooking(BOOKING);
  }, [BOOKING, setBooking]);

  const isCMTCTT = BOOKING.isCMTCTT ?? false;

  if (showOnboarding) {
    if (BOOKING.isCMTCTT) return <CMTCTTOnboardingFlow onClose={() => setShowOnboarding(false)} />;
    return BOOKING.isCMT
      ? <CMTOnboardingFlow onClose={() => setShowOnboarding(false)} />
      : <OnboardingFlow    onClose={() => setShowOnboarding(false)} />;
  }

  return (
    <>
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 md:p-6">
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-1 gap-3">
            <div>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <h1 className="text-xl font-semibold text-brand-primary">{BOOKING.title}</h1>
                <StatusBadge status={BOOKING.status} size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{BOOKING.id}</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} className="text-gray-400 flex-shrink-0" />
                  {BOOKING.date}
                </span>
                {(() => {
                  const raw = BOOKING.time ?? "";
                  const timeMatch = raw.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)).*?[-–].*?(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
                  const labelMatch = raw.match(/\(([^)]+(?:Schedule|Session|Day))\)/i);
                  return (
                    <>
                      {timeMatch && (
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock size={12} className="text-gray-400 flex-shrink-0" />
                          {timeMatch[1]} – {timeMatch[2]}
                        </span>
                      )}
                      {labelMatch && (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[11px] font-medium">
                          {labelMatch[1]}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Issue Assets dropdown — hidden for CMT Upcoming (no asset management for CMT) */}
              {BOOKING.status !== "Overdue" && !(BOOKING.isCMT && BOOKING.status === "Upcoming") && (
                <div className="relative">
                  <Button
                    type="outline"
                    onClick={() => setIssueDropOpen(!issueDropOpen)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 w-auto border border-gray-300"
                  >
                    Issue Assets
                    {issueDropOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </Button>
                  {issueDropOpen && (
                    <div className="absolute right-0 mt-1 w-68 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      <button type="button" onClick={() => { setIssueDropOpen(false); window.location.href = `/system-hardware/assignments/new?bookingId=${selectedBooking?.id}&fromBooking=true`; }}
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
              )}

              {/* Onboarding for CMT+CTT */}
              {["Ongoing", "Upcoming"].includes(BOOKING.status) && isCMTCTT && (
                <Button
                  onClick={() => setShowOnboarding(true)}
                  className="px-5 py-2.5 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  {BOOKING.status === "Ongoing" ? "Continue Session" : "Start Onboarding"}
                </Button>
              )}

              {/* Standalone CMT — buttons appear only after Detail List is generated */}
              {BOOKING.isCMT && !isCMTCTT && cmtDetailListGenerated && (() => {
                const hasChanges = nominalRollChanged || cabinConfigChanged;

                return hasChanges ? (
                  /* Data changed → show Cancel + Confirm */
                  <>
                    <button
                      type="button"
                      onClick={() => { setNominalRollChanged(false); setCabinConfigChanged(false); }}
                      className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <Button
                      onClick={() => setShowSyncConfirm(true)}
                      className="px-5 py-2.5 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
                    >
                      Confirm
                    </Button>
                  </>
                ) : (
                  /* No changes → show Sync (hidden once synced) */
                  !isSynced && (
                    <Button
                      type="outline"
                      onClick={() => setShowSyncApproval(true)}
                      className="px-5 py-2.5 text-sm font-semibold w-auto border border-gray-300 text-gray-700"
                    >
                      Sync
                    </Button>
                  )
                );
              })()}

              {/* Start Onboarding — appears after user explicitly clicks Sync */}
              {BOOKING.isCMT && !isCMTCTT && isSynced && !(nominalRollChanged || cabinConfigChanged) && (
                <Button
                  onClick={() => setShowOnboarding(true)}
                  className="px-5 py-2.5 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  Start Onboarding
                </Button>
              )}

              <div className="relative" ref={dotMenuRef}>
                <Button
                  type="outline"
                  onClick={() => setShowDotMenu(v => !v)}
                  className="h-9 w-auto p-0 flex items-center justify-center border border-gray-200 text-gray-500 aspect-square"
                >
                  <MoreVertical size={16} />
                </Button>

                {showDotMenu && isCMTCTT && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
                    {[
                      { label: "Cancel", danger: true },
                      { label: "Reschedule" },
                      { label: "Return Assets" },
                      { label: "Manual Issue Assets" },
                    ].map(({ label, danger }: { label: string; danger?: boolean }) => (
                      <button key={label} type="button"
                        onClick={() => setShowDotMenu(false)}
                        className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                          danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50")}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}

                {showDotMenu && !isCMTCTT && BOOKING.status === "Ongoing" && (
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
                    {[
                      { icon: <Plus size={15} className="text-gray-600" />, label: "Top up assets" },
                      { icon: <Check size={15} className="text-gray-400" />, label: "Ready for return assets" },
                      { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>, label: "Return assets" },
                      { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Reschedule" },
                      { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Assign briefing Room" },
                      { icon: <X size={15} className="text-gray-400" />, label: "Cancel", danger: true },
                    ].map(({ icon, label, danger }: any) => (
                      <button key={label} type="button"
                        onClick={() => setShowDotMenu(false)}
                        className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                          danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50")}>
                        <span className={cn("flex-shrink-0", danger ? "text-red-400" : "text-gray-400")}>{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mt-5 border-b border-gray-200 mb-6">
            {isCMTCTT
              ? ["Booking Details", "Nominal Roll", "Cabin Configuration", "Cluster Configuration", "Assignment List"].map((tab) => (
                  <button key={tab} type="button" onClick={() => setCmtcttActiveTab(tab)}
                    className={cn("px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                      cmtcttActiveTab === tab
                        ? "border-brand-primary text-brand-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700")}>
                    {tab}
                  </button>
                ))
              : tabs.map((tab: any) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)}
                className={cn("px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  activeTab === tab
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700")}>
                {tab}
              </button>
            ))}
          </div>

          {/* ── CMT+CTT tab content ─────────────────────────────────────────── */}
          {isCMTCTT && cmtcttActiveTab === "Booking Details" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-3 gap-0 divide-x divide-gray-200">
                {/* CMT Column */}
                <div className="pr-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">CMT</h3>
                  {[
                    ["Booking Type", "Entire Cabin"],
                    ["Main IOS", "Main IOS 3"],
                    ["Slave IOS", "-"],
                  ].map(([label, value]) => (
                    <Field key={label} label={label} value={value} />
                  ))}
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Cabin</dt>
                    {["Cabin 1","Cabin 2","Cabin 4","Cabin 6"].map(c => (
                      <dd key={c} className="text-sm font-semibold text-gray-800">{c}</dd>
                    ))}
                  </div>
                  {[
                    ["Vehicle Type", "ICV (TERREX)"],
                    ["Weapon Variant", "40AGL (2), 50HMG (2)"],
                  ].map(([label, value]) => (
                    <Field key={label} label={label} value={value} />
                  ))}
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Roles</dt>
                    {["VO","VC","TC","SO"].map(r => (
                      <dd key={r} className="text-sm font-semibold text-gray-800">{r}</dd>
                    ))}
                  </div>
                </div>

                {/* CTT Column */}
                <div className="px-6 space-y-4">
                  <h3 className="text-sm font-bold text-gray-800">CTT</h3>
                  {[
                    ["Main IOS", "Main IOS 3"],
                    ["Slave IOS", "Main IOS 2"],
                  ].map(([label, value]) => (
                    <Field key={label} label={label} value={value} />
                  ))}
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Vehicle Type</dt>
                    {["ICV (TERREX)","Engineer (BRONCO)"].map(v => (
                      <dd key={v} className="text-sm font-semibold text-gray-800">{v}</dd>
                    ))}
                  </div>
                  {[["Vehicle Variant", "TERREX (COMMANDER)"]].map(([label, value]) => (
                    <Field key={label} label={label} value={value} />
                  ))}
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Weapon Variant</dt>
                    {["40AGL","50HMG","MORTAL"].map(v => (
                      <dd key={v} className="text-sm font-semibold text-gray-800">{v}</dd>
                    ))}
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Roles</dt>
                    {["VO","VC","TC","SO","SC"].map(r => (
                      <dd key={r} className="text-sm font-semibold text-gray-800">{r}</dd>
                    ))}
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Cluster</dt>
                    {Array.from({length:16},(_,i)=>`Cluster ${i+1}`).map(c => (
                      <dd key={c} className="text-sm font-semibold text-gray-800">{c}</dd>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="pl-6 space-y-4">
                  <Field label="Briefing Room" value="Briefing Room A" />
                  <Field label="Trainee(s)" value="32 Trainee(s)" />
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Cabin</dt>
                    {["Cabin 1","Cabin 2","Cabin 4","Cabin 6"].map(c => (
                      <dd key={c} className="text-sm font-semibold text-gray-800">{c}</dd>
                    ))}
                  </div>
                  <Field label="ATMS File" value="202412231456" />
                  <Field label="Instructor Name" value="Marvin Marched" />
                  <Field label="Unit Contact Details" value="+65 662 222 2323 • delblugg@gmail.com" />
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Operator Name</dt>
                    <dd className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-semibold flex-shrink-0">JJ</div>
                      <span className="text-sm font-semibold text-gray-800">Jake Jelanski</span>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isCMTCTT && cmtcttActiveTab !== "Booking Details" && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
              {cmtcttActiveTab} content
            </div>
          )}

          {/* Tab: Booking Details */}
          {!isCMTCTT && activeTab === "Booking Details" && (() => {
            const sessionLabel = BOOKING.time?.match(/\(([^)]+)\)/)?.[1] ?? "—";
            const platformTypes = selectedBooking?.weapon ?? "—";
            return (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h2 className="text-sm font-bold text-gray-700 mb-5">Training Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Section Type</dt>
                    <dd className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{BOOKING.sectionType}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Training Mode</dt>
                    <dd className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{BOOKING.trainingMode}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-400 mb-0.5">Training Type</dt>
                    <dd className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{BOOKING.trainingType}</dd>
                  </div>
                  <Field label="Program" value={BOOKING.program} />
                  <Field label="Briefing Room" value={BOOKING.briefingRoom} />
                  <Field label="Courseware" value={BOOKING.courseware} />
                  <Field label="Trainee" value={`${BOOKING.traineesCount} Trainee(s)`} />
                  <Field label="Assignment ID" value={<span className="text-gray-400">—</span>} />
                  <Field label="ATMS File" value={BOOKING.atmsFile} />
                </dl>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h2 className="text-sm font-bold text-gray-700 mb-5">Training Schedule</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                  <Field label="Schedule Type" value="Fixed Schedule" />
                  <Field label="Training Date" value={BOOKING.date} />
                  <Field label="Training Time" value={BOOKING.time} />
                  <Field label="Session Type" value={sessionLabel} />
                </dl>
              </div>

              {BOOKING.isCMT ? (
                <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                  <h2 className="text-sm font-bold text-gray-700 mb-5">Platform Configuration</h2>
                  <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                    <Field label="Booking Type" value="Compartment Selection" />
                    <Field label="Vehicle Type" value="ICV (TERREX)" />
                    <div>
                      <dt className="text-xs text-gray-400 mb-1">Platform Type</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {platformTypes.split(",").map((p: string) => (
                          <span key={p.trim()} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                            {p.trim()}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <Field label="Base Station" value="BMS1ForceSide" />
                  </dl>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                    <h2 className="text-sm font-bold text-gray-700 mb-4">
                      Weapon List ({BOOKING.weapons.reduce((a, w) => a + w.units, 0)} Units)
                    </h2>
                    <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      {BOOKING.weapons.map((w: any) => (
                        <div key={w.type}>
                          <dt className="text-xs text-gray-400 mb-0.5">Weapon Type</dt>
                          <dd className="text-sm font-semibold text-gray-800">{w.type} ({w.units} Units)</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-sm font-bold text-gray-700 mb-4">Base Station ({BOOKING.baseStations.length} Stations)</h2>
                      <dl className="space-y-3">
                        {BOOKING.baseStations.map((s: any, i: any) => (
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
                        {BOOKING.cShapedStations.map((s: any, i: any) => (
                          <div key={i}>
                            <dt className="text-xs text-gray-400 mb-0.5">{s.label}</dt>
                            <dd className="text-sm font-semibold text-gray-800">{s.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </>
              )}
            </div>
            );
          })()}

          {/* Tab: Nominal Rolls */}
          {!isCMTCTT && activeTab === "Nominal Rolls" && (
            BOOKING.isCMT ? (
              /* CMT — use the same table as the create-booking flow */
              <CMTNominalRollDetail
                onDataChange={() => {
                  if (cmtDetailListGenerated) { setNominalRollChanged(true); setIsSynced(false); }
                }}
              />
            ) : (
              /* Non-CMT — original nominal roll table */
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
                  <div className="relative">
                    <select className="appearance-none text-sm text-gray-700 border border-gray-200 rounded-lg pl-3 pr-8 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary cursor-pointer min-w-[220px]">
                      <option>{BOOKING.courseware || "Night Test for SAR21/M16 BTP"}</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {BOOKING.status === "Upcoming" && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="outline"
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
                      >
                        <Upload size={14} /> Upload List
                      </Button>
                      <Button
                        onClick={() => setShowAddTrainee(true)}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
                      >
                        <Plus size={14} /> Add Trainee
                      </Button>
                    </div>
                  )}
                </div>
                <NominalRollTable trainees={BOOKING.trainees} status={BOOKING.status} />
              </div>
            )
          )}

          {showAddTrainee && (
            <AddTraineeModal
              isOpen={showAddTrainee}
              onClose={() => setShowAddTrainee(false)}
              onSubmit={(vals) => console.log(vals)}
              unitName={BOOKING.title?.replace(/IMT Group Training for Unit */i, "") ?? ""}
            />
          )}

          {/* Tab: Lane Configuration */}
          {!isCMTCTT && activeTab === "Lane Configuration" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-700">Lane Configuration</h2>
                <p className="text-xs text-gray-400 mt-0.5">SWT-01 — {BOOKING.courseware}</p>
              </div>
              <LaneConfigTable laneConfig={BOOKING.laneConfig} />
            </div>
          )}

          {!isCMTCTT && activeTab === "Cabin Configuration" && (() => {
            // Load cabin + IOS data from localStorage for locally-created CMT bookings
            const localData = selectedBooking?.id?.startsWith("cmt-local-")
              ? getCMTLocalBookingById(selectedBooking.id)
              : undefined;
            return (
              <CMTCabinConfigStep
                bookingDetails={null}
                gridCols="grid-cols-[70%_30%]"
                initialCabins={localData?.cabins ?? DETAIL_DEMO_CABINS}
                initialIosList={localData?.iosList}
                lastUpdated="17 Jan 2025 09:29 AM"
                onUserEdit={() => {
                  if (cmtDetailListGenerated) { setCabinConfigChanged(true); setIsSynced(false); }
                }}
              />
            );
          })()}

          {!isCMTCTT && activeTab === "Detail List" && (
            BOOKING.isCMT
              ? <CMTDetailListTab status={BOOKING.status} isGenerated={cmtDetailListGenerated} onGenerated={() => setCmtDetailListGenerated(true)} />
              : (
                <BookingDetailListTab
                  bookingTitle={BOOKING.title}
                  bookingId={BOOKING.id}
                  unitName={BOOKING.program}
                  courseware={BOOKING.courseware ?? "—"}
                  status={BOOKING.status}
                />
              )
          )}
        </div>
      </div>

      {showReissue && <ReissueModal open={showReissue} onClose={() => setShowReissue(false)} />}

      {/* Sync confirm popup */}
      {showSyncConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[440px] p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Confirm Update</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Are you sure you want to confirm these changes? The Detail List will reflect your updated data.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowSyncConfirm(false)}
                className="py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  // Confirm changes — go back to Sync state (detail list stays generated)
                  setNominalRollChanged(false);
                  setCabinConfigChanged(false);
                  setShowSyncConfirm(false);
                }}
                className="py-2.5 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync approval popup */}
      {showSyncApproval && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl w-[440px] p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="M21.5 2v6h-6"/><path d="M2.5 12a9 9 0 0 1 15-6.7L21.5 8"/>
                  <path d="M2.5 22v-6h6"/><path d="M21.5 12a9 9 0 0 1-15 6.7L2.5 16"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">Confirm Sync</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Are you sure you want to sync? This will finalise the current Detail List and enable onboarding.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowSyncApproval(false)}
                className="py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setIsSynced(true); setShowSyncApproval(false); }}
                className="py-2.5 text-sm font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                Yes, Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {showCoursewarePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 px-8 py-8 text-center relative">
            <Button
              onClick={() => setShowCoursewarePopup(false)}
              className="absolute top-4 right-4 p-1 w-auto bg-transparent text-gray-400 hover:text-gray-600 hover:bg-transparent"
            >
              <X size={18} />
            </Button>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Select Courseware</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Choose the courseware you want to begin training with.<br />
              You can only select one course to proceed.
            </p>
            <div className="relative mb-6 text-left">
              <select
                defaultValue={BOOKING.courseware || "Night Test for SAR21/M16 BTP"}
                className="w-full appearance-none text-sm text-gray-800 border-2 border-gray-800 rounded-xl px-4 py-3 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20 font-medium"
              >
                <option>{BOOKING.courseware || "Night Test for SAR21/M16 BTP"}</option>
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>
            <Button
              onClick={() => {
                setShowCoursewarePopup(false);
                setShowOnboarding(true);
              }}
              className="w-full py-3 bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-hover"
            >
              Onboard Trainees
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
