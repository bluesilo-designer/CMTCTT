import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "TRMS" | "Data Archiving And Logs" | "Cron Jobs";

const TOTAL_GB = 76.45;

const hddUsed = 27.29;
const hddPct = (hddUsed / TOTAL_GB) * 100;

const databases = [
  { name: "Aims",                    usedMB: 0.34,  pct: "0.00043%" },
  { name: "User Detail (Encrypted)", usedMB: 0.16,  pct: "0.00020%" },
  { name: "User",                    usedMB: 0.11,  pct: "0.00014%" },
  { name: "Booking",                 usedMB: 0.24,  pct: "0.00031%" },
  { name: "Operation",               usedMB: 1.47,  pct: "0.00188%" },
  { name: "Trainee",                 usedMB: 0.14,  pct: "0.00018%" },
  { name: "System",                  usedMB: 0.32,  pct: "0.00041%" },
];

function StorageBar({ used, total, pct }: { used: number; total: number; pct: number }) {
  return (
    <div className="w-full">
      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-full"
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">{used} GB of {total} GB</p>
    </div>
  );
}

function DBStorageBar({ used, total, label }: { used: number; total: number; label: string }) {
  const pct = (used / (total * 1024)) * 100;
  return (
    <div className="w-full">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gray-300 rounded-full" style={{ width: `${Math.max(pct * 200, 2)}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">{used} MB of {total} GB ({label})</p>
    </div>
  );
}

export function SystemMaintenance() {
  const [activeTab, setActiveTab] = useState<Tab>("TRMS");

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["System Maintenance"]} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-5">System Maintenance</h1>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(["TRMS", "Data Archiving And Logs", "Cron Jobs"] as Tab[]).map((tab) => (
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

          <div className="p-6">
            {activeTab === "TRMS" && (
              <div className="space-y-8">
                {/* HDD */}
                <div>
                  <h2 className="text-base font-semibold text-gray-800 mb-4">HDD</h2>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">HDD</p>
                    <div className="flex items-start gap-4">
                      <Database size={36} className="text-gray-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <StorageBar used={hddUsed} total={TOTAL_GB} pct={hddPct} />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Database */}
                <div>
                  <h2 className="text-base font-semibold text-gray-800 mb-4">Database</h2>
                  <div className="grid grid-cols-3 gap-x-10 gap-y-6">
                    {databases.map((db) => (
                      <div key={db.name}>
                        <p className="text-sm font-medium text-gray-700 mb-3">{db.name}</p>
                        <div className="flex items-start gap-4">
                          <Database size={28} className="text-gray-400 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <DBStorageBar used={db.usedMB} total={TOTAL_GB} label={db.pct} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Data Archiving And Logs" && (
              <div className="text-center py-16 text-gray-400">Data Archiving And Logs — coming soon</div>
            )}

            {activeTab === "Cron Jobs" && (
              <div className="text-center py-16 text-gray-400">Cron Jobs — coming soon</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
