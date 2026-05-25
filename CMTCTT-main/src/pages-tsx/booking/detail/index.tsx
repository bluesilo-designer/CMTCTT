import { useState, useRef, useEffect, useMemo } from "react";
import type { Booking } from "./types";
import { useBookingStore } from "./store/useBookingStore";
import { NominalRollTable } from "./components/NominalRollTable";
import { LaneConfigTable } from "./components/LaneConfigTable";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { CMTOnboardingFlow } from "./components/CMTOnboardingFlow";
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

type DetailTab = "Booking Details" | "Nominal Rolls" | "Lane Configuration";

export function BookingDetail() {
  const [activeTab, setActiveTab] = useState<DetailTab>("Booking Details");
  const [issueDropOpen, setIssueDropOpen] = useState(false);
  const [showReissue, setShowReissue] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCoursewarePopup, setShowCoursewarePopup] = useState(false);
  const [showAddTrainee, setShowAddTrainee] = useState(false);
  const [showDotMenu, setShowDotMenu] = useState(false);
  const dotMenuRef = useRef<HTMLDivElement>(null);
  const setBooking = useBookingStore((s) => s.setBooking);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target as Node)) setShowDotMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const tabs: DetailTab[] = ["Booking Details", "Nominal Rolls", "Lane Configuration"];

  const getBookingData = () => {
    const params = new URLSearchParams(window.location.search);
    let bookingId = params.get("id");
    if (!bookingId) {
      const hashMatch = window.location.hash.match(/\?id=([^&]+)/);
      if (hashMatch) bookingId = hashMatch[1];
    }
    return bookings.find(b => b.id === (bookingId || "1"));
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
    briefingRoom: "Briefing Room",
    sectionType: "Standalone",
    courseware: selectedBooking.courseware,
    traineesCount: 32,
    trainingType: selectedBooking.trainingType,
    assignmentId: selectedBooking.assignmentId,
    atmsFile: "202412231456",
    isIntegrated: false,
    isCMT: true,
  } : {
    ...BOOKING_DATA,
    id: "#111024-KC0004",
    title: "CMT Training for Unit 10",
    status: "Upcoming",
    date: "10 January 2025",
    time: "08:00 AM – 06:00 PM (Full Day)",
    program: "CMT Training",
    trainingMode: "Collective",
    briefingRoom: "Briefing Room",
    sectionType: "Standalone",
    courseware: "Component Type Training B",
    traineesCount: 25,
    trainingType: "Group",
    assignmentId: "-",
    atmsFile: "202412231456",
    isIntegrated: false,
    isCMT: true,
  }, [selectedBooking]);

  useEffect(() => {
    setBooking(BOOKING);
  }, [BOOKING, setBooking]);

  if (showOnboarding) {
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
              {/* Issue Assets dropdown */}
              {BOOKING.status !== "Overdue" && (
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

              {["Ongoing", "Upcoming"].includes(BOOKING.status) && (
                <Button
                  onClick={() => selectedBooking?.assetIssued && setShowCoursewarePopup(true)}
                  disabled={!selectedBooking?.assetIssued}
                  className={cn("px-5 py-2.5 text-sm font-semibold w-auto",
                    selectedBooking?.assetIssued
                      ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed")}
                >
                  {BOOKING.status === "Ongoing" ? "Continue Session" : "Start Onboarding"}
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

                {showDotMenu && BOOKING.status === "Ongoing" && (
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
            {tabs.map((tab: any) => (
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
                  <Field label="Session Type" value="Full Day" />
                </dl>
              </div>

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
            </div>
          )}

          {/* Tab: Nominal Rolls */}
          {activeTab === "Nominal Rolls" && (
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
          {activeTab === "Lane Configuration" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-700">Lane Configuration</h2>
                <p className="text-xs text-gray-400 mt-0.5">SWT-01 — {BOOKING.courseware}</p>
              </div>
              <LaneConfigTable laneConfig={BOOKING.laneConfig} />
            </div>
          )}
        </div>
      </div>

      {showReissue && <ReissueModal open={showReissue} onClose={() => setShowReissue(false)} />}

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
