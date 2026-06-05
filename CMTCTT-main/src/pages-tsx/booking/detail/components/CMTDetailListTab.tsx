import { useState, useEffect } from "react";
import {
  Clock, UserCheck, UserX,
  Download, Upload, FileText, CheckCircle2, Circle, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal-1";
import { cn } from "@/lib/utils";

// ── Mock cabin / cluster groups ────────────────────────────────────────────────

const CABIN_GROUPS: Array<{
  cabin:        string;
  platformType: string;
  callsign:     string;
  trainees:     Array<{
    role: string; name: string; nric: string; rank: string;
    callsign?: string; batch: string; course: string; unit: string;
  }>;
}> = [
  {
    cabin: "CMT01", platformType: "Terrex 50 HMG", callsign: "11Z",
    trainees: [
      { role: "VC",    name: "Lu Ling Hui",              nric: "T6535925H", rank: "CPL",                  batch: "06/26", course: "IOCC_2(TRX)", unit: "1SIR" },
      { role: "VO",    name: "Tong Yi Ling",              nric: "T5289849D", rank: "PTE",                  batch: "06/26", course: "IOCC_2(TRX)", unit: "1SIR" },
      { role: "TC/PC", name: "Liu Shu Qi",                nric: "T9309764A", rank: "MAJ", callsign: "11",  batch: "06/26", course: "IOCC_2(TRX)", unit: "1SIR" },
      { role: "SC",    name: "Choong Yi Min",             nric: "T6263693E", rank: "WO",                   batch: "06/26", course: "IOCC_2(TRX)", unit: "1SIR" },
      { role: "SO",    name: "Ang Jun De",                nric: "T8171256A", rank: "SGT", callsign: "11A", batch: "06/26", course: "IOCC_2(TRX)", unit: "1SIR" },
    ],
  },
  {
    cabin: "CMT02", platformType: "Terrex 40 AGL", callsign: "11SZ",
    trainees: [
      { role: "VC",    name: "Kwa Xuan Ming",             nric: "T8107085C", rank: "CPL",                  batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "VO",    name: "Tang Jia Hui",              nric: "T0042574A", rank: "PTE",                  batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "TC/PC", name: "Law Yong Rui",              nric: "T5348570C", rank: "MAJ", callsign: "11S", batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "SC",    name: "Guo Guo Qiang",             nric: "T1161476G", rank: "WO",                   batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "SO",    name: "Muhamad Hj Zul bin Sharin", nric: "F6537528K", rank: "SGT",                  batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
    ],
  },
  {
    cabin: "CTT01", platformType: "L2SG", callsign: "22Z",
    trainees: [
      { role: "VO", name: "Trainee6",  nric: "S7521418A", rank: "PTE", batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "VC", name: "Trainee7",  nric: "S9521418Z", rank: "MAJ", batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
    ],
  },
  {
    cabin: "CTT04", platformType: "PCSV Mortar", callsign: "14SZ",
    trainees: [
      { role: "VO", name: "Trainee13", nric: "T0192258G", rank: "PTE",                   batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "VC", name: "Trainee14", nric: "T0255758A", rank: "MAJ",                   batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "TC", name: "Trainee15", nric: "T0377737Z", rank: "MAJ", callsign: "14S",  batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
      { role: "SO", name: "Trainee16", nric: "T0488228Z", rank: "PTE", callsign: "14B",  batch: "06/26", course: "IOCC_2(TRX)", unit: "2SIR" },
    ],
  },
];

type CabinGroup = typeof CABIN_GROUPS[0];

const TOTAL_TRAINEES = CABIN_GROUPS.reduce((s, g) => s + g.trainees.length, 0);

// ── Role badge colours ─────────────────────────────────────────────────────────

const ROLE_COLOUR: Record<string, string> = {
  VC:      "bg-blue-100   text-blue-700",
  VO:      "bg-violet-100 text-violet-700",
  "TC/PC": "bg-orange-100 text-orange-700",
  TC:      "bg-orange-100 text-orange-700",
  SC:      "bg-emerald-100 text-emerald-700",
  SO:      "bg-gray-100   text-gray-600",
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide",
      ROLE_COLOUR[role] ?? "bg-gray-100 text-gray-600",
    )}>
      {role}
    </span>
  );
}

// ── Countdown timer ────────────────────────────────────────────────────────────

function useCountdown(initial: number) {
  const [secs, setSecs] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// ── Verification card ──────────────────────────────────────────────────────────

function VerificationCard({
  title, description, checked, onToggle,
}: {
  title: string; description: string; checked: boolean; onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-start gap-3 w-full text-left p-4 rounded-xl border-2 transition-all",
        checked
          ? "border-green-500 bg-green-50"
          : "border-gray-200 bg-white hover:border-gray-300",
      )}
    >
      {checked
        ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
        : <Circle      size={20} className="text-gray-300 flex-shrink-0 mt-0.5" />
      }
      <div>
        <p className={cn("text-sm font-semibold", checked ? "text-green-700" : "text-gray-700")}>
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ── Cabin detail modal ─────────────────────────────────────────────────────────

const DETAIL_GRID = "68px 1fr 108px 52px 68px 56px 116px 52px";

function CabinDetailModal({
  group,
  onClose,
}: {
  group: CabinGroup;
  onClose: () => void;
}) {
  const isCMT = group.cabin.startsWith("CMT");

  return (
    <Modal open onClose={onClose} width="820px">
      {/* Modal header */}
      <div className="flex items-center gap-4 mb-6 -mt-1">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold",
          isCMT ? "bg-red-100 text-brand-primary" : "bg-blue-100 text-blue-700",
        )}>
          {isCMT ? "CMT" : "CTT"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800">{group.cabin}</h3>
          <p className="text-sm text-gray-500">
            {group.platformType} &bull; Callsign: <span className="font-semibold text-gray-700">{group.callsign}</span>
          </p>
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {group.trainees.length} {group.trainees.length === 1 ? "Trainee" : "Trainees"}
        </span>
      </div>

      {/* Trainee table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div
          className="grid px-4 py-2.5 bg-gray-50 border-b border-gray-200"
          style={{ gridTemplateColumns: DETAIL_GRID }}
        >
          {["Role", "Name", "NRIC", "Rank", "Callsign", "Batch", "Course", "Unit"].map((h) => (
            <span key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {group.trainees.map((t, i) => (
          <div
            key={i}
            className="grid items-center px-4 py-2.5 border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
            style={{ gridTemplateColumns: DETAIL_GRID }}
          >
            <div><RoleBadge role={t.role} /></div>
            <span className="text-sm text-gray-800 pr-4">{t.name}</span>
            <span className="text-xs font-mono text-gray-600">{t.nric}</span>
            <span className="text-xs text-gray-700">{t.rank}</span>
            <span className="text-xs text-gray-600">{t.callsign ?? "—"}</span>
            <span className="text-xs text-gray-700">{t.batch}</span>
            <span className="text-xs text-gray-700">{t.course}</span>
            <span className="text-xs text-gray-700">{t.unit}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ── Cabin card ─────────────────────────────────────────────────────────────────

function CabinCard({
  group,
  onViewDetail,
}: {
  group: CabinGroup;
  onViewDetail: () => void;
}) {
  const isCMT = group.cabin.startsWith("CMT");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow">

      {/* Card top: type badge + cabin name */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-lg font-bold text-gray-900 leading-tight">{group.cabin}</p>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{group.platformType}</p>
        </div>
        <span className={cn(
          "text-[10px] font-bold px-2 py-1 rounded-md shrink-0",
          isCMT ? "bg-red-100 text-brand-primary" : "bg-blue-100 text-blue-700",
        )}>
          {isCMT ? "CMT" : "CTT"}
        </span>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Callsign</p>
          <p className="text-sm font-bold text-gray-800">{group.callsign}</p>
        </div>
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Trainees</p>
          <p className="text-sm font-bold text-gray-800">{group.trainees.length}</p>
        </div>
      </div>

      {/* Role badges */}
      <div className="flex flex-wrap gap-1.5">
        {group.trainees.map((t, i) => (
          <RoleBadge key={i} role={t.role} />
        ))}
      </div>

      {/* View Detail button */}
      <Button
        onClick={onViewDetail}
        className="mt-auto w-full py-2.5 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover"
      >
        View Detail
      </Button>

    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function CMTDetailListTab({
  status = "Upcoming",
}: {
  status?: string;
}) {
  const timer = useCountdown(20 * 60 + 18);

  const [nominalRollDone, setNominalRollDone] = useState(false);
  const [cabinConfigDone, setCabinConfigDone] = useState(false);
  const [confirmed,       setConfirmed]       = useState(false);
  const [isGenerated,     setIsGenerated]     = useState(false);
  const [uploadedFile,    setUploadedFile]    = useState<string | null>(null);
  const [selectedGroup,   setSelectedGroup]   = useState<CabinGroup | null>(null);

  const bothChecked = nominalRollDone && cabinConfigDone;
  const passCount   = 6;
  const failCount   = 3;
  const marksman    = 5;

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!isGenerated) {
    return (
      <div className="flex items-start justify-center pt-10 pb-16">
        <div className="w-full max-w-2xl space-y-5">

          <div className="text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-brand-primary" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Generate Detail List</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              Before generating the detail list, please verify that you have completed
              both Nominal Roll upload and Cabin Configuration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <VerificationCard
              title="Nominal Roll"
              description="Upload your trainee nominal roll data"
              checked={nominalRollDone}
              onToggle={() => { setNominalRollDone(v => !v); setConfirmed(false); }}
            />
            <VerificationCard
              title="Cabin Configuration"
              description="Complete the cabin assignment configuration"
              checked={cabinConfigDone}
              onToggle={() => { setCabinConfigDone(v => !v); setConfirmed(false); }}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Template &amp; Upload
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1 justify-center"
              >
                <Download size={15} className="text-gray-500" />
                Download Template
              </button>
              <label className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-brand-primary border border-brand-primary rounded-lg hover:bg-red-50 transition-colors flex-1 justify-center cursor-pointer">
                <Upload size={15} />
                {uploadedFile ?? "Upload File"}
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setUploadedFile(f.name);
                  }}
                />
              </label>
            </div>
            {uploadedFile && (
              <p className="text-xs text-green-600 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                File &ldquo;{uploadedFile}&rdquo; ready to upload
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!bothChecked}
            onClick={() => setConfirmed(v => !v)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all text-left",
              !bothChecked
                ? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
                : confirmed
                  ? "border-brand-primary bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300",
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
              confirmed ? "bg-brand-primary border-brand-primary" : "border-gray-300",
            )}>
              {confirmed && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className={cn(
              "text-sm font-medium",
              confirmed ? "text-brand-primary" : "text-gray-600",
            )}>
              Yes, I have completed the Nominal Roll upload and Cabin Configuration
            </span>
          </button>

          {confirmed && (
            <Button
              onClick={() => setIsGenerated(true)}
              className="w-full py-3 text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover flex items-center justify-center gap-2"
            >
              Generate Detail List
              <ChevronRight size={16} />
            </Button>
          )}

        </div>
      </div>
    );
  }

  // ── Generated state ────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-5">

        {/* Stats bar — only when training has started */}
        {["Ongoing", "Completed"].includes(status) && (
          <div className="bg-white rounded-xl border border-gray-200 flex items-center divide-x divide-gray-100 overflow-hidden">
            <div className="flex flex-col justify-center px-4 py-3 flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 leading-tight">CMT Training Session</p>
              <p className="text-xs text-gray-400 mt-0.5">{CABIN_GROUPS.length} Cabins / Clusters</p>
            </div>
            <div className="flex flex-col justify-center px-4 py-3 shrink-0">
              <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">Total Trainees</p>
              <p className="text-xs font-semibold text-gray-800">{TOTAL_TRAINEES}</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 shrink-0">
              <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <UserCheck size={13} className="text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Marksman (%)</p>
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                  {marksman} <span className="font-normal text-gray-500">/ {TOTAL_TRAINEES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 shrink-0">
              <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <UserCheck size={13} className="text-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Pass (%)</p>
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                  {passCount} <span className="font-normal text-gray-500">/ {TOTAL_TRAINEES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 shrink-0">
              <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <UserX size={13} className="text-red-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">Fail (%)</p>
                <p className="text-xs font-bold text-gray-800 whitespace-nowrap">
                  {failCount} <span className="font-normal text-gray-500">/ {TOTAL_TRAINEES}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center px-4 py-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                <Clock size={12} className="text-brand-primary flex-shrink-0" />
                <span className="text-xs font-bold text-brand-primary font-mono">{timer}</span>
              </div>
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Detail List{" "}
            <span className="text-gray-400 font-normal">
              ({CABIN_GROUPS.length} Cabins / Clusters &bull; {TOTAL_TRAINEES} Trainees)
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <Button
              type="outline"
              className="px-4 py-2 text-sm font-semibold w-auto border border-brand-primary text-brand-primary hover:bg-red-50"
            >
              Live Results
            </Button>
            <Button
              type="outline"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold w-auto border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <Download size={14} /> Export
            </Button>
          </div>
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-3 gap-4">
          {CABIN_GROUPS.map((group) => (
            <CabinCard
              key={group.cabin}
              group={group}
              onViewDetail={() => setSelectedGroup(group)}
            />
          ))}
        </div>

      </div>

      {/* Per-cabin detail modal */}
      {selectedGroup && (
        <CabinDetailModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}
    </>
  );
}
