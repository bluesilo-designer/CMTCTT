import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const LAST_UPDATE = "22 Apr 2026 12:13:33 PM";

type CheckStatus = "Passed" | "Failed" | "Running";

interface CheckItem {
  label: string;
  status: CheckStatus;
}

const networkChecks: CheckItem[] = [
  { label: "MQTT",                           status: "Passed" },
  { label: "Connectivity with InVeris System",status: "Passed" },
  { label: "Connectivity with RFID Antennas", status: "Failed" },
];

const microserviceChecks: CheckItem[] = [
  { label: "System Hardware Management (SHM)", status: "Passed" },
  { label: "Booking",                          status: "Passed" },
  { label: "User",                             status: "Passed" },
  { label: "Trainee",                          status: "Passed" },
  { label: "System Settings",                  status: "Passed" },
  { label: "Site Management & Operational",    status: "Passed" },
  { label: "Gateway",                          status: "Passed" },
];

const databaseChecks: CheckItem[] = [
  { label: "Personnel",       status: "Passed" },
  { label: "SHMS",            status: "Passed" },
  { label: "Training Results",status: "Passed" },
  { label: "Resource",        status: "Passed" },
  { label: "System Settings", status: "Passed" },
];

const imtChecks: CheckItem[] = [
  { label: "battery",          status: "Running" },
  { label: "CPU",              status: "Running" },
  { label: "Critical Software",status: "Running" },
  { label: "envSensor",        status: "Running" },
  { label: "Graphic Card",     status: "Running" },
  { label: "Joystick",         status: "Running" },
  { label: "Keyboard",         status: "Running" },
  { label: "Monitor",          status: "Running" },
  { label: "Motherboard",      status: "Running" },
  { label: "Mouse",            status: "Running" },
  { label: "Printer",          status: "Running" },
  { label: "Sound Card",       status: "Running" },
  { label: "System Memory",    status: "Running" },
  { label: "UPS",              status: "Running" },
];

function overallStatus(items: CheckItem[]): CheckStatus {
  if (items.some((i) => i.status === "Failed")) return "Failed";
  if (items.some((i) => i.status === "Running")) return "Running";
  return "Passed";
}

function StatusText({ status }: { status: CheckStatus }) {
  return (
    <span className={cn(
      "text-sm font-semibold",
      status === "Passed"  ? "text-green-600"
      : status === "Failed"  ? "text-red-500"
      : "text-green-600"
    )}>
      {status}
    </span>
  );
}

function CheckRow({ label, status }: CheckItem) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-700">{label}</span>
      <StatusText status={status} />
    </div>
  );
}

function SectionCard({
  title,
  items,
}: {
  title: string;
  items: CheckItem[];
}) {
  const overall = overallStatus(items);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1 min-w-[240px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-800">{title}</span>
        <div className="flex items-center gap-1">
          <StatusText status={overall} />
          <ChevronRight size={14} className={cn(overall === "Failed" ? "text-red-500" : "text-green-600")} />
        </div>
      </div>
      {items.map((item) => (
        <CheckRow key={item.label} {...item} />
      ))}
    </div>
  );
}

const IMT_COLS = 3;

export function SystemHealth() {
  const cols: CheckItem[][] = [[], [], []];
  imtChecks.forEach((item, i) => cols[i % IMT_COLS].push(item));

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["System Health"]} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-5">System Health</h1>

        {/* BIT TRMS */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-gray-800">BIT (Built-In Test)</h2>
            <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
              Re-run BIT
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">BIT (TRMS)</h3>
              <span className="text-xs text-gray-400">Last Update: {LAST_UPDATE}</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <SectionCard title="Network"      items={networkChecks} />
              <SectionCard title="Microservices" items={microserviceChecks} />
              <SectionCard title="Database"     items={databaseChecks} />
            </div>
          </div>

          {/* BIT IMT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">BIT (IMT)</h3>
            <div className="flex gap-4">
              {cols.map((col, ci) => (
                <div key={ci} className="flex-1 bg-white rounded-lg border border-gray-200 p-4">
                  {col.map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-gray-700">{item.label}</span>
                      <div className="flex items-center gap-1">
                        <StatusText status={item.status} />
                        <ChevronRight size={14} className="text-green-600" />
                      </div>
                    </div>
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
