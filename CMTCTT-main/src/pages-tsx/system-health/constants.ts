import type { CheckItem, NavNode, SectionData, Status } from "./types";
import { overallOf } from "./utils";

export const LAST_UPDATE = "29 Apr 2026 09:24:54 PM";

export type PlatformTab = "CMT" | "CMT CTT" | "SWT";
export const PLATFORM_TABS: PlatformTab[] = ["CMT", "CMT CTT", "SWT"];

export const BIT_TRMS_SECTIONS: SectionData[] = [
  {
    id: "trms-network", title: "Network", infoTitle: "Network Information", overallStatus: "Failed",
    items: [
      { label: "MQTT",                             status: "Passed", info: { description: "MQTT Broker", errorMessage: "" } },
      { label: "Connectivity with InVeris System", status: "Passed", info: { description: "InVeris integration service", errorMessage: "" } },
      { label: "Connectivity with RFID Antennas",  status: "Failed", info: { description: "RFID antenna network", errorMessage: "Connection timed out after 30s" } },
    ],
  },
  {
    id: "trms-microservices", title: "Microservices", infoTitle: "Microservices Information", overallStatus: "Passed",
    items: [
      { label: "System Hardware Management (SHM)", status: "Passed", info: { description: "SHM service", errorMessage: "" } },
      { label: "Booking",                          status: "Passed", info: { description: "Booking service", errorMessage: "" } },
      { label: "User",                             status: "Passed", info: { description: "User service", errorMessage: "" } },
      { label: "Trainee",                          status: "Passed", info: { description: "Trainee service", errorMessage: "" } },
      { label: "System Settings",                  status: "Passed", info: { description: "Settings service", errorMessage: "" } },
      { label: "Site Management & Operational",    status: "Passed", info: { description: "Site management service", errorMessage: "" } },
      { label: "Gateway",                          status: "Passed", info: { description: "API gateway", errorMessage: "" } },
    ],
  },
  {
    id: "trms-database", title: "Database", infoTitle: "Database Information", overallStatus: "Passed",
    items: [
      { label: "Personnel",        status: "Passed", info: { description: "Personnel database", errorMessage: "" } },
      { label: "SHMS",             status: "Passed", info: { description: "SHM database", errorMessage: "" } },
      { label: "Training Results", status: "Passed", info: { description: "Training results database", errorMessage: "" } },
      { label: "Resource",         status: "Passed", info: { description: "Resource database", errorMessage: "" } },
      { label: "System Settings",  status: "Passed", info: { description: "Settings database", errorMessage: "" } },
    ],
  },
];

export const BIT_IMT_ITEMS: CheckItem[] = [
  { label: "battery",           status: "Running",       info: { description: "Battery unit",             errorMessage: "" } },
  { label: "Bio Device",        status: "Battery Low",   info: { description: "Biometric device",         errorMessage: "Battery level at 12%" } },
  { label: "CPU",               status: "Unknown",       info: { description: "Central processing unit",  errorMessage: "Unable to retrieve CPU status" } },
  { label: "Critical Software", status: "Not Running",   info: { description: "Critical software stack",  errorMessage: "Process not responding" } },
  { label: "envSensor",         status: "Running",       info: { description: "Environmental sensor",     errorMessage: "" } },
  { label: "Graphic Card",      status: "Unknown",       info: { description: "GPU",                      errorMessage: "Driver communication error" } },
  { label: "Hard Drive",        status: "Unknown",       info: { description: "Primary HDD",              errorMessage: "SMART status unavailable" } },
  { label: "Hit Detect Camera", status: "Ok",            info: { description: "HD camera unit",           errorMessage: "" } },
  { label: "Joystick",          status: "Not Found",     info: { description: "Input joystick",           errorMessage: "Device not detected" } },
  { label: "Keyboard",          status: "Unknown",       info: { description: "Keyboard",                 errorMessage: "HID status unknown" } },
  { label: "Monitor",           status: "Unknown",       info: { description: "Display monitor",          errorMessage: "EDID read error" } },
  { label: "Motherboard",       status: "Ok",            info: { description: "Motherboard",              errorMessage: "" } },
  { label: "Mouse",             status: "Not Found",     info: { description: "Input mouse",              errorMessage: "Device not detected" } },
  { label: "Network Card",      status: "Unknown",       info: { description: "NIC",                      errorMessage: "Link status unavailable" } },
  { label: "Printer",           status: "Jammed",        info: { description: "Laser printer",            errorMessage: "Paper jam detected in tray 1" } },
  { label: "Projector",         status: "Shutting Down", info: { description: "Room projector",           errorMessage: "Lamp thermal shutdown initiated" } },
  { label: "Sound Card",        status: "Not Found",     info: { description: "Audio device",             errorMessage: "Device not detected" } },
  { label: "System Memory",     status: "Low",           info: { description: "RAM",                      errorMessage: "Available memory below threshold (2 GB)" } },
];

// ── Platform-specific hardware: CMT ───────────────────────────────────────────

export const BIT_CMT_CABINS: CheckItem[] = [
  { label: "CMT01", status: "Running",   info: { description: "CMT Cabin 01", errorMessage: "" } },
  { label: "CMT02", status: "Running",   info: { description: "CMT Cabin 02", errorMessage: "" } },
  { label: "CMT03", status: "Unknown",   info: { description: "CMT Cabin 03", errorMessage: "Hardware self-test not responding" } },
  { label: "CMT04", status: "Running",   info: { description: "CMT Cabin 04", errorMessage: "" } },
  { label: "CMT05", status: "Running",   info: { description: "CMT Cabin 05", errorMessage: "" } },
  { label: "CMT06", status: "Not Running", info: { description: "CMT Cabin 06", errorMessage: "Display subsystem offline" } },
  { label: "CMT07", status: "Running",   info: { description: "CMT Cabin 07", errorMessage: "" } },
  { label: "CMT08", status: "Running",   info: { description: "CMT Cabin 08", errorMessage: "" } },
  { label: "CMT09", status: "Unknown",   info: { description: "CMT Cabin 09 (Maintenance)", errorMessage: "Under scheduled maintenance" } },
  { label: "CMT10", status: "Running",   info: { description: "CMT Cabin 10", errorMessage: "" } },
  { label: "CMT11", status: "Running",   info: { description: "CMT Cabin 11", errorMessage: "" } },
  { label: "CMT12", status: "Running",   info: { description: "CMT Cabin 12", errorMessage: "" } },
];

export const BIT_CMT_IOS: CheckItem[] = [
  { label: "CMTIOS01", status: "Running", info: { description: "IOS Station 01", errorMessage: "" } },
  { label: "CMTIOS02", status: "Running", info: { description: "IOS Station 02", errorMessage: "" } },
  { label: "CMTIOS03", status: "Unknown", info: { description: "IOS Station 03", errorMessage: "Network handshake failed" } },
  { label: "CMTIOS04", status: "Running", info: { description: "IOS Station 04", errorMessage: "" } },
];

export const BIT_CMT_NETWORK: CheckItem[] = [
  { label: "BMS1ForceSide", status: "Running", info: { description: "Base Station 1 — Force Side", errorMessage: "" } },
  { label: "BMS2ForceSide", status: "Running", info: { description: "Base Station 2 — Force Side", errorMessage: "" } },
  { label: "Scenario Server", status: "Running", info: { description: "Mission scenario server", errorMessage: "" } },
  { label: "After Action Review", status: "Unknown", info: { description: "AAR playback server", errorMessage: "Disk I/O timeout" } },
];

// ── Platform-specific hardware: CTT ───────────────────────────────────────────

export const BIT_CTT_CLUSTERS: CheckItem[] = [
  { label: "CTT01", status: "Running", info: { description: "CTT Cluster 01 (6 seats)", errorMessage: "" } },
  { label: "CTT02", status: "Running", info: { description: "CTT Cluster 02 (6 seats)", errorMessage: "" } },
  { label: "CTT03", status: "Unknown", info: { description: "CTT Cluster 03 (6 seats)", errorMessage: "Seat 4 display not detected" } },
  { label: "CTT04", status: "Running", info: { description: "CTT Cluster 04 (6 seats)", errorMessage: "" } },
];

export const BIT_CTT_IOS: CheckItem[] = [
  { label: "CTTIOS01", status: "Running", info: { description: "CTT IOS Station 01", errorMessage: "" } },
  { label: "CTTIOS02", status: "Running", info: { description: "CTT IOS Station 02", errorMessage: "" } },
];

export const BIT_CTT_NETWORK: CheckItem[] = [
  { label: "CTT Base Station",    status: "Running", info: { description: "CTT network hub", errorMessage: "" } },
  { label: "Instructor Console",  status: "Running", info: { description: "Master instructor console", errorMessage: "" } },
  { label: "Content Server",      status: "Ok",      info: { description: "Training content repository", errorMessage: "" } },
];

// ── Platform-specific hardware: SWT ───────────────────────────────────────────

export const BIT_SWT_STATIONS: CheckItem[] = [
  { label: "SWT Station 01", status: "Running",    info: { description: "Weapon station 01", errorMessage: "" } },
  { label: "SWT Station 02", status: "Running",    info: { description: "Weapon station 02", errorMessage: "" } },
  { label: "SWT Station 03", status: "Unknown",    info: { description: "Weapon station 03", errorMessage: "Trigger sensor calibration needed" } },
  { label: "SWT Station 04", status: "Running",    info: { description: "Weapon station 04", errorMessage: "" } },
  { label: "SWT Station 05", status: "Running",    info: { description: "Weapon station 05", errorMessage: "" } },
  { label: "SWT Station 06", status: "Not Running",info: { description: "Weapon station 06", errorMessage: "Power supply fault" } },
  { label: "SWT Station 07", status: "Running",    info: { description: "Weapon station 07", errorMessage: "" } },
  { label: "SWT Station 08", status: "Running",    info: { description: "Weapon station 08", errorMessage: "" } },
];

export const BIT_SWT_RFID: CheckItem[] = [
  { label: "RFID Reader 01",  status: "Running", info: { description: "RFID reader at armoury gate",   errorMessage: "" } },
  { label: "RFID Reader 02",  status: "Running", info: { description: "RFID reader at lane entry",     errorMessage: "" } },
  { label: "RFID Reader 03",  status: "Failed",  info: { description: "RFID reader at lane exit",      errorMessage: "Antenna 03 connection timed out" } },
  { label: "RFID Antenna 01", status: "Running", info: { description: "Gate antenna 01",               errorMessage: "" } },
  { label: "RFID Antenna 02", status: "Running", info: { description: "Gate antenna 02",               errorMessage: "" } },
  { label: "RFID Antenna 03", status: "Failed",  info: { description: "Gate antenna 03",               errorMessage: "No response from unit" } },
];

export const BIT_SWT_NETWORK: CheckItem[] = [
  { label: "SWT-01 Base Station", status: "Running", info: { description: "SWT primary network node", errorMessage: "" } },
  { label: "SWT-02 Base Station", status: "Running", info: { description: "SWT secondary network node", errorMessage: "" } },
  { label: "Range Control Server", status: "Running", info: { description: "Range management server", errorMessage: "" } },
  { label: "Scoring Server",       status: "Unknown", info: { description: "Live scoring processor", errorMessage: "High latency detected (>200ms)" } },
];

export const HUMS_ITEMS: CheckItem[] = [
  { label: "Temperature Sensor", status: "Ok",      info: { description: "Ambient temperature sensor", errorMessage: "" } },
  { label: "Humidity Sensor",    status: "Ok",      info: { description: "Humidity sensor",            errorMessage: "" } },
  { label: "Air Quality",        status: "Unknown", info: { description: "Air quality monitor",        errorMessage: "Sensor read timeout" } },
  { label: "Ventilation",        status: "Running", info: { description: "HVAC ventilation system",    errorMessage: "" } },
  { label: "Fire Sensor",        status: "Ok",      info: { description: "Fire detection sensor",      errorMessage: "" } },
];

export const NAV_TREE: NavNode[] = [
  {
    id: "hums-imt", label: "HUMS (IMT)",
    children: HUMS_ITEMS.map((it) => ({
      id: `hums-imt-${it.label}`, label: it.label, status: it.status, sectionId: "hums-imt",
    })),
  },
  { id: "hums-trms", label: "HUMS (TRMS)", children: [] },
  { id: "network-root", label: "Network", status: "Connected" },
  {
    id: "bit-trms", label: "BIT (TRMS)",
    children: BIT_TRMS_SECTIONS.map((s) => ({
      id: s.id, label: s.title, status: s.overallStatus, sectionId: s.id,
    })),
  },
  {
    id: "bit-imt", label: "BIT (IMT)",
    children: BIT_IMT_ITEMS.map((it) => ({
      id: `bit-imt-${it.label}`, label: it.label, status: it.status, sectionId: "bit-imt",
    })),
  },
];

export function getSectionData(sectionId: string): { items: CheckItem[]; title: string; overallStatus: Status } | null {
  const trms = BIT_TRMS_SECTIONS.find((s) => s.id === sectionId);
  if (trms) return { items: trms.items, title: trms.infoTitle, overallStatus: trms.overallStatus };
  if (sectionId === "bit-imt") return { items: BIT_IMT_ITEMS, title: "IMT Hardware Information", overallStatus: overallOf(BIT_IMT_ITEMS) };
  if (sectionId === "hums-imt") return { items: HUMS_ITEMS, title: "HUMS (IMT) Information", overallStatus: overallOf(HUMS_ITEMS) };
  return null;
}
