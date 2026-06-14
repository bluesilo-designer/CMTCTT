import { useState } from "react";
import { RefreshCw, Activity, CheckCircle2, AlertTriangle, Server, Thermometer, ChevronRight, MonitorPlay, Target, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import type { Status } from "./types";
import type { CheckItem } from "./types";
import {
  BIT_TRMS_SECTIONS, BIT_IMT_ITEMS, HUMS_ITEMS, LAST_UPDATE,
  PLATFORM_TABS, type PlatformTab,
  BIT_CMT_CABINS, BIT_CMT_IOS, BIT_CMT_NETWORK,
  BIT_CTT_CLUSTERS, BIT_CTT_IOS, BIT_CTT_NETWORK,
  BIT_SWT_STATIONS, BIT_SWT_RFID, BIT_SWT_NETWORK,
} from "./constants";
import { isGood, isWarn, statusColor, statusDot } from "./utils";
import { SectionCard } from "./components/SectionCard";
import { ImtCard } from "./components/ImtCard";
import { OverallIcon } from "./components/OverallIcon";
import { SystemInformation } from "./components/SystemInformation";

// ── Per-platform hardware groups ──────────────────────────────────────────────

interface HardwareGroup {
  label: string;
  sectionKey: string;
  items: CheckItem[];
}

const PLATFORM_HARDWARE: Record<PlatformTab, { groups: HardwareGroup[] }> = {
  "CMT": {
    groups: [
      { label: "Cabins",        sectionKey: "bit-cmt-cabins",  items: BIT_CMT_CABINS },
      { label: "IOS Stations",  sectionKey: "bit-cmt-ios",     items: BIT_CMT_IOS },
      { label: "Network & Servers", sectionKey: "bit-cmt-net", items: BIT_CMT_NETWORK },
    ],
  },
  "CMT CTT": {
    groups: [
      { label: "CMT Cabins",    sectionKey: "bit-cmt-cabins",  items: BIT_CMT_CABINS },
      { label: "CMT IOS",       sectionKey: "bit-cmt-ios",     items: BIT_CMT_IOS },
      { label: "CTT Clusters",  sectionKey: "bit-ctt-clusters",items: BIT_CTT_CLUSTERS },
      { label: "CTT IOS",       sectionKey: "bit-ctt-ios",     items: BIT_CTT_IOS },
      { label: "Network & Servers", sectionKey: "bit-ctt-net", items: [...BIT_CMT_NETWORK, ...BIT_CTT_NETWORK] },
    ],
  },
  "SWT": {
    groups: [
      { label: "Weapon Stations", sectionKey: "bit-swt-stations", items: BIT_SWT_STATIONS },
      { label: "RFID",            sectionKey: "bit-swt-rfid",     items: BIT_SWT_RFID },
      { label: "Network & Servers", sectionKey: "bit-swt-net",    items: BIT_SWT_NETWORK },
    ],
  },
};

function platformIcon(tab: PlatformTab) {
  if (tab === "CMT")     return <MonitorPlay size={14} className="text-gray-400" />;
  if (tab === "CMT CTT") return <Layers size={14} className="text-gray-400" />;
  return <Target size={14} className="text-gray-400" />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SystemHealth() {
  const [detailSection, setDetailSection] = useState<string | null>(null);
  const [rerunning, setRerunning] = useState(false);
  const [platformTab, setPlatformTab] = useState<PlatformTab>("CMT");

  if (detailSection !== null) {
    return <SystemInformation initialSection={detailSection} onBack={() => setDetailSection(null)} />;
  }

  const imtCols: CheckItem[][] = [[], [], []];
  BIT_IMT_ITEMS.forEach((item, idx) => imtCols[idx % 3].push(item));

  const humsCols: CheckItem[][] = [[], [], []];
  HUMS_ITEMS.forEach((item, idx) => humsCols[idx % 3].push(item));

  // Summary stats — include active platform hardware
  const platformItems = PLATFORM_HARDWARE[platformTab].groups.flatMap((g) => g.items);
  const allItems    = [...BIT_TRMS_SECTIONS.flatMap((s) => s.items), ...platformItems, ...HUMS_ITEMS];
  const passedCount = allItems.filter((item) => isGood(item.status)).length;
  const failedCount = allItems.filter((item) => item.status === "Failed").length;
  const warnCount   = allItems.filter((item) => isWarn(item.status)).length;
  const overallPct  = Math.round((passedCount / allItems.length) * 100);
  const systemStatus: Status = failedCount > 0 ? "Failed" : warnCount > 0 ? "Unknown" : "Passed";

  const handleRerun = () => {
    setRerunning(true);
    setTimeout(() => setRerunning(false), 1800);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 space-y-5">

        {/* Page header + summary */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-brand-primary">System Health</h1>
            <p className="text-xs text-gray-400 mt-0.5">Built-In Test &amp; Health Monitor Status</p>
          </div>
          <Button
            onClick={handleRerun}
            disabled={rerunning}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm bg-brand-primary text-white rounded-lg font-semibold transition-all hover:bg-brand-primary/90 shadow-sm w-auto",
              rerunning && "opacity-70 cursor-wait"
            )}
          >
            <RefreshCw size={14} className={cn(rerunning && "animate-spin")} />
            Re-run BIT
          </Button>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            {
              label: "System Status",
              value: systemStatus,
              icon: <OverallIcon status={systemStatus} />,
              bg: systemStatus === "Passed" ? "bg-green-50 border-green-200" : systemStatus === "Failed" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200",
              valClass: statusColor(systemStatus),
            },
            {
              label: "Overall Health",
              value: `${overallPct}%`,
              icon: <Activity size={16} className="text-blue-500" />,
              bg: "bg-blue-50 border-blue-200",
              valClass: "text-blue-600",
            },
            {
              label: "Passed Checks",
              value: passedCount.toString(),
              icon: <CheckCircle2 size={16} className="text-green-500" />,
              bg: "bg-green-50 border-green-200",
              valClass: "text-green-600",
            },
            {
              label: "Issues Found",
              value: (failedCount + warnCount).toString(),
              icon: <AlertTriangle size={16} className="text-red-500" />,
              bg: "bg-red-50 border-red-200",
              valClass: "text-red-600",
            },
          ].map((card) => (
            <div key={card.label} className={cn("rounded-xl border p-4 flex items-center gap-3", card.bg)}>
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                {card.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className={cn("text-xl font-bold leading-tight", card.valClass)}>{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BIT (Built-In Test) section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <Activity size={16} className="text-brand-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">BIT (Built-In Test)</h2>
                <p className="text-xs text-gray-400">Last Update: {LAST_UPDATE}</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">

            {/* ── Platform tab selector ─────────────────────────────────── */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5 w-fit">
                {PLATFORM_TABS.map((tab) => {
                  const active = platformTab === tab;
                  // count issues for this tab
                  const tabItems = PLATFORM_HARDWARE[tab].groups.flatMap((g) => g.items);
                  const tabIssues = tabItems.filter((it) => it.status === "Failed" || isWarn(it.status)).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => setPlatformTab(tab)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none",
                        active
                          ? "bg-white text-gray-800 shadow-sm"
                          : "text-gray-400 hover:text-gray-600 hover:bg-gray-50/80",
                      )}
                    >
                      {tab}
                      {tabIssues > 0 && (
                        <span className={cn(
                          "inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold",
                          active ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-500"
                        )}>
                          {tabIssues}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs text-gray-400">
                {PLATFORM_HARDWARE[platformTab].groups.flatMap((g) => g.items).length} components monitored
              </span>
            </div>

            {/* BIT (TRMS) — shared backend checks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Server size={14} className="text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">BIT (TRMS)</h3>
                <span className="text-xs text-gray-400 ml-1">— Shared backend services</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {BIT_TRMS_SECTIONS.map((section) => (
                  <SectionCard key={section.id} section={section} onDetail={setDetailSection} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* BIT (Platform hardware) — changes per tab */}
            {PLATFORM_HARDWARE[platformTab].groups.map((group, gi) => {
              const cols: CheckItem[][] = [[], [], []];
              group.items.forEach((item, idx) => cols[idx % 3].push(item));
              const issueCount = group.items.filter((it) => !isGood(it.status)).length;

              return (
                <div key={group.sectionKey}>
                  {gi > 0 && <div className="border-t border-gray-50 mb-5" />}
                  <div className="flex items-center gap-2 mb-3">
                    {platformIcon(platformTab)}
                    <h3 className="text-sm font-semibold text-gray-700">
                      BIT ({platformTab}) — {group.label}
                    </h3>
                    <span className="ml-auto text-xs text-gray-400">{group.items.length} components</span>
                    {issueCount > 0 && (
                      <span className="text-xs font-semibold text-amber-500">
                        {issueCount} issue{issueCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {cols.map((col, ci) =>
                      col.length > 0 ? (
                        <ImtCard key={ci} items={col} onDetail={setDetailSection} />
                      ) : null
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HUMS section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Thermometer size={16} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">HUMS</h2>
              <p className="text-xs text-gray-400">Hardware Utilization &amp; Monitoring System</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex gap-3">
              {humsCols.map((col, ci) => (
                <div key={ci} className="flex-1 bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {col.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setDetailSection("hums-imt")}
                      className="w-full flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full flex-shrink-0", statusDot(item.status))} />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={cn("text-xs font-semibold", statusColor(item.status))}>{item.status}</span>
                        <ChevronRight size={13} className="text-gray-300" />
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
