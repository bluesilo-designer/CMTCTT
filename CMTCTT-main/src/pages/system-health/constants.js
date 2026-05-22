import { overallOf } from "./utils";
export const LAST_UPDATE = "29 Apr 2026 09:24:54 PM";
export const BIT_TRMS_SECTIONS = [
    {
        id: "trms-network", title: "Network", infoTitle: "Network Information", overallStatus: "Failed",
        items: [
            { label: "MQTT", status: "Passed", info: { description: "MQTT Broker", errorMessage: "" } },
            { label: "Connectivity with InVeris System", status: "Passed", info: { description: "InVeris integration service", errorMessage: "" } },
            { label: "Connectivity with RFID Antennas", status: "Failed", info: { description: "RFID antenna network", errorMessage: "Connection timed out after 30s" } },
        ],
    },
    {
        id: "trms-microservices", title: "Microservices", infoTitle: "Microservices Information", overallStatus: "Passed",
        items: [
            { label: "System Hardware Management (SHM)", status: "Passed", info: { description: "SHM service", errorMessage: "" } },
            { label: "Booking", status: "Passed", info: { description: "Booking service", errorMessage: "" } },
            { label: "User", status: "Passed", info: { description: "User service", errorMessage: "" } },
            { label: "Trainee", status: "Passed", info: { description: "Trainee service", errorMessage: "" } },
            { label: "System Settings", status: "Passed", info: { description: "Settings service", errorMessage: "" } },
            { label: "Site Management & Operational", status: "Passed", info: { description: "Site management service", errorMessage: "" } },
            { label: "Gateway", status: "Passed", info: { description: "API gateway", errorMessage: "" } },
        ],
    },
    {
        id: "trms-database", title: "Database", infoTitle: "Database Information", overallStatus: "Passed",
        items: [
            { label: "Personnel", status: "Passed", info: { description: "Personnel database", errorMessage: "" } },
            { label: "SHMS", status: "Passed", info: { description: "SHM database", errorMessage: "" } },
            { label: "Training Results", status: "Passed", info: { description: "Training results database", errorMessage: "" } },
            { label: "Resource", status: "Passed", info: { description: "Resource database", errorMessage: "" } },
            { label: "System Settings", status: "Passed", info: { description: "Settings database", errorMessage: "" } },
        ],
    },
];
export const BIT_IMT_ITEMS = [
    { label: "battery", status: "Running", info: { description: "Battery unit", errorMessage: "" } },
    { label: "Bio Device", status: "Battery Low", info: { description: "Biometric device", errorMessage: "Battery level at 12%" } },
    { label: "CPU", status: "Unknown", info: { description: "Central processing unit", errorMessage: "Unable to retrieve CPU status" } },
    { label: "Critical Software", status: "Not Running", info: { description: "Critical software stack", errorMessage: "Process not responding" } },
    { label: "envSensor", status: "Running", info: { description: "Environmental sensor", errorMessage: "" } },
    { label: "Graphic Card", status: "Unknown", info: { description: "GPU", errorMessage: "Driver communication error" } },
    { label: "Hard Drive", status: "Unknown", info: { description: "Primary HDD", errorMessage: "SMART status unavailable" } },
    { label: "Hit Detect Camera", status: "Ok", info: { description: "HD camera unit", errorMessage: "" } },
    { label: "Joystick", status: "Not Found", info: { description: "Input joystick", errorMessage: "Device not detected" } },
    { label: "Keyboard", status: "Unknown", info: { description: "Keyboard", errorMessage: "HID status unknown" } },
    { label: "Monitor", status: "Unknown", info: { description: "Display monitor", errorMessage: "EDID read error" } },
    { label: "Motherboard", status: "Ok", info: { description: "Motherboard", errorMessage: "" } },
    { label: "Mouse", status: "Not Found", info: { description: "Input mouse", errorMessage: "Device not detected" } },
    { label: "Network Card", status: "Unknown", info: { description: "NIC", errorMessage: "Link status unavailable" } },
    { label: "Printer", status: "Jammed", info: { description: "Laser printer", errorMessage: "Paper jam detected in tray 1" } },
    { label: "Projector", status: "Shutting Down", info: { description: "Room projector", errorMessage: "Lamp thermal shutdown initiated" } },
    { label: "Sound Card", status: "Not Found", info: { description: "Audio device", errorMessage: "Device not detected" } },
    { label: "System Memory", status: "Low", info: { description: "RAM", errorMessage: "Available memory below threshold (2 GB)" } },
];
export const HUMS_ITEMS = [
    { label: "Temperature Sensor", status: "Ok", info: { description: "Ambient temperature sensor", errorMessage: "" } },
    { label: "Humidity Sensor", status: "Ok", info: { description: "Humidity sensor", errorMessage: "" } },
    { label: "Air Quality", status: "Unknown", info: { description: "Air quality monitor", errorMessage: "Sensor read timeout" } },
    { label: "Ventilation", status: "Running", info: { description: "HVAC ventilation system", errorMessage: "" } },
    { label: "Fire Sensor", status: "Ok", info: { description: "Fire detection sensor", errorMessage: "" } },
];
export const NAV_TREE = [
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
export function getSectionData(sectionId) {
    const trms = BIT_TRMS_SECTIONS.find((s) => s.id === sectionId);
    if (trms)
        return { items: trms.items, title: trms.infoTitle, overallStatus: trms.overallStatus };
    if (sectionId === "bit-imt")
        return { items: BIT_IMT_ITEMS, title: "IMT Hardware Information", overallStatus: overallOf(BIT_IMT_ITEMS) };
    if (sectionId === "hums-imt")
        return { items: HUMS_ITEMS, title: "HUMS (IMT) Information", overallStatus: overallOf(HUMS_ITEMS) };
    return null;
}
