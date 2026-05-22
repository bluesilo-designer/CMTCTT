export type AssetStatus =
  | "Available"
  | "Issued"
  | "Pending Return"
  | "Not Returned"
  | "Missing"
  | "Maintenance"
  | "Overdue";

export type AssignmentStatus = "Issued" | "Returned" | "Pending Return" | "Not Returned" | "Missing";

export type AssetTypeStatus = "Active" | "Inactive";

export interface Asset {
  id: string;
  no: number;
  name: string;
  serialNumber: string;
  assetType: string;
  assetCategory: string;
  status: AssetStatus;
  issuedDate: string;
  assetTagId?: string;
  createdDate?: string;
  createdBy?: string;
  createdByRole?: string;
  issuanceCycle?: number;
  rfidTag1Status?: string;
  rfidTag2Status?: string;
  rfidTag1Id?: string;
  rfidTag2Id?: string;
  rfidUniqueId?: string;
  rfidLocation?: string;
  lastCheckedOn?: string;
}

export interface Assignment {
  id: string;
  no: number;
  assignmentId: string;
  assignmentType: string;
  bookings: string[];
  status: AssignmentStatus;
  baseStations: string[];
  assetQty: number;
  issuedDate?: string;
  returnedDate?: string;
}

export interface AssetType {
  id: string;
  no: number;
  assetType: string;
  assetCategory: string;
  code: string;
  status: AssetTypeStatus;
  createdBy: string;
  createdByRole: string;
  lastUpdatedOn: string;
}

export interface AssetCategory {
  id: string;
  no: number;
  assetCategory: string;
  alert: string;
  status: AssetTypeStatus;
  createdBy: string;
  createdByRole: string;
  lastUpdatedOn: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

export const assetStats = {
  total: 18,
  available: 12,
  issued: 5,
  pendingReturn: 1,
  notReturned: 0,
  missing: 0,
  maintenance: 0,
  overdue: 0,
};

export const assetsByCategory = [
  { label: "RFID Reader", value: 16, percentage: 88.9, color: "#1a3a6b" },
  { label: "Siren", value: 2, percentage: 11.1, color: "#22c55e" },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Reader Siren Notification",
    description: "Asset SN-0041 has been issued to Booking #BK-2024-001",
    timestamp: "22 Apr 2026, 09:15 AM",
    isRead: false,
  },
  {
    id: "n2",
    title: "Reader Siren Notification",
    description: "Asset SN-0038 pending return from Base Station Alpha",
    timestamp: "22 Apr 2026, 08:30 AM",
    isRead: false,
  },
  {
    id: "n3",
    title: "Reader Siren Notification",
    description: "Asset SN-0022 successfully returned and verified",
    timestamp: "21 Apr 2026, 05:00 PM",
    isRead: true,
  },
];

export const assets: Asset[] = [
  {
    id: "a1",
    no: 1,
    name: "trst",
    serialNumber: "XAERRWR43R34R",
    assetType: "SAR21",
    assetCategory: "Weapon",
    status: "Available",
    issuedDate: "—",
    assetTagId: "260427-SAR21003",
    createdDate: "27 Apr 2026 11:21:05 AM",
    createdBy: "Olivia Carter",
    createdByRole: "System Admin",
    issuanceCycle: 0,
    rfidTag1Status: "Connected",
    rfidTag2Status: "No RFID",
    rfidTag1Id: "260427-RFI002",
    rfidTag2Id: "—",
    rfidUniqueId: "001",
    rfidLocation: "No Location Found",
    lastCheckedOn: "—"
  },
  { id: "a2",  no: 2,  name: "RFID Reader Unit B",  serialNumber: "SN-0002", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a3",  no: 3,  name: "RFID Reader Unit C",  serialNumber: "SN-0003", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a4",  no: 4,  name: "RFID Reader Unit D",  serialNumber: "SN-0004", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a5",  no: 5,  name: "RFID Reader Unit E",  serialNumber: "SN-0005", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a6",  no: 6,  name: "RFID Reader Unit F",  serialNumber: "SN-0006", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a7",  no: 7,  name: "RFID Reader Unit G",  serialNumber: "SN-0007", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a8",  no: 8,  name: "RFID Reader Unit H",  serialNumber: "SN-0008", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a9",  no: 9,  name: "RFID Reader Unit I",  serialNumber: "SN-0009", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a10", no: 10, name: "RFID Reader Unit J",  serialNumber: "SN-0010", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a11", no: 11, name: "RFID Reader Unit K",  serialNumber: "SN-0011", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a12", no: 12, name: "RFID Reader Unit L",  serialNumber: "SN-0012", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Available",     issuedDate: "—" },
  { id: "a13", no: 13, name: "Siren Unit Alpha",    serialNumber: "SN-0013", assetType: "Siren",       assetCategory: "Siren",       status: "Issued",        issuedDate: "15 Apr 2026" },
  { id: "a14", no: 14, name: "Siren Unit Beta",     serialNumber: "SN-0014", assetType: "Siren",       assetCategory: "Siren",       status: "Issued",        issuedDate: "15 Apr 2026" },
  { id: "a15", no: 15, name: "RFID Reader Unit M",  serialNumber: "SN-0015", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Issued",        issuedDate: "18 Apr 2026" },
  { id: "a16", no: 16, name: "RFID Reader Unit N",  serialNumber: "SN-0016", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Issued",        issuedDate: "18 Apr 2026" },
  { id: "a17", no: 17, name: "RFID Reader Unit O",  serialNumber: "SN-0017", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Issued",        issuedDate: "20 Apr 2026" },
  { id: "a18", no: 18, name: "RFID Reader Unit P",  serialNumber: "SN-0018", assetType: "RFID Reader", assetCategory: "RFID Reader", status: "Pending Return",issuedDate: "10 Apr 2026" },
];

export const assignments: Assignment[] = [
  {
    id: "as1", no: 1,
    assignmentId: "ASGN-2026-001",
    assignmentType: "Single Booking",
    bookings: ["BK-2026-001", "BK-2026-002"],
    status: "Issued",
    baseStations: ["IMT-01", "IMT-02"],
    assetQty: 6,
    issuedDate: "10:35:58 PM\n28 Apr 2026",
    returnedDate: undefined,
  },
  {
    id: "as2", no: 2,
    assignmentId: "ASGN-2026-002",
    assignmentType: "Single Booking",
    bookings: ["BK-2026-003"],
    status: "Issued",
    baseStations: ["IMT-03"],
    assetQty: 4,
    issuedDate: "04:13:16 PM\n28 Apr 2026",
    returnedDate: undefined,
  },
  {
    id: "as3", no: 3,
    assignmentId: "ASGN-2026-003",
    assignmentType: "Single Booking",
    bookings: ["BK-2026-004"],
    status: "Returned",
    baseStations: ["IMT-02"],
    assetQty: 11,
    issuedDate: "02:47:56 PM\n28 Apr 2026",
    returnedDate: "05:14:58 PM\n28 Apr 2026",
  },
  {
    id: "as4", no: 4,
    assignmentId: "ASGN-2026-004",
    assignmentType: "Single Booking",
    bookings: ["BK-2026-005", "BK-2026-006"],
    status: "Issued",
    baseStations: ["IMT-05"],
    assetQty: 1,
    issuedDate: "02:44:11 PM\n28 Apr 2026",
    returnedDate: undefined,
  },
  {
    id: "as5", no: 5,
    assignmentId: "ASGN-2026-005",
    assignmentType: "Single Booking",
    bookings: ["BK-2026-007"],
    status: "Returned",
    baseStations: ["IMT-01"],
    assetQty: 1,
    issuedDate: "02:38:53 PM\n28 Apr 2026",
    returnedDate: "04:44:29 PM\n28 Apr 2026",
  },
  {
    id: "as6", no: 6,
    assignmentId: "ASGN-2026-006",
    assignmentType: "Single Booking",
    bookings: ["BK-2026-008"],
    status: "Returned",
    baseStations: ["IMT-02"],
    assetQty: 1,
    issuedDate: "12:06:50 PM\n28 Apr 2026",
    returnedDate: "02:38:16 PM\n28 Apr 2026",
  },
  {
    id: "as7", no: 7,
    assignmentId: "ASGN-2026-007",
    assignmentType: "Base Station",
    bookings: ["BK-2026-009"],
    status: "Issued",
    baseStations: ["IMT-01"],
    assetQty: 1,
    issuedDate: "12:01:48 PM\n28 Apr 2026",
    returnedDate: undefined,
  },
];

export const assetTypes: AssetType[] = [
  {
    id: "at1", no: 1,
    assetType: "RFID Reader",
    assetCategory: "RFID Reader",
    code: "RFID-RDR",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "01 Jan 2026\n09:00 AM",
  },
  {
    id: "at2", no: 2,
    assetType: "Siren",
    assetCategory: "Siren",
    code: "SRN-001",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "01 Jan 2026\n09:00 AM",
  },
  {
    id: "at3", no: 3,
    assetType: "Antenna",
    assetCategory: "RFID Reader",
    code: "ANT-001",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "15 Jan 2026\n10:30 AM",
  },
  {
    id: "at4", no: 4,
    assetType: "Power Supply Unit",
    assetCategory: "Siren",
    code: "PSU-001",
    status: "Inactive",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "20 Feb 2026\n02:15 PM",
  },
  {
    id: "at5", no: 5,
    assetType: "Cable Assembly",
    assetCategory: "RFID Reader",
    code: "CBL-001",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "10 Mar 2026\n11:00 AM",
  },
];

export const assetCategories: AssetCategory[] = [
  {
    id: "ac1", no: 1,
    assetCategory: "RFID Reader",
    alert: "Low Stock",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "01 Jan 2026\n09:00 AM",
  },
  {
    id: "ac2", no: 2,
    assetCategory: "Siren",
    alert: "—",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "01 Jan 2026\n09:00 AM",
  },
  {
    id: "ac3", no: 3,
    assetCategory: "Antenna",
    alert: "—",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "15 Jan 2026\n10:30 AM",
  },
  {
    id: "ac4", no: 4,
    assetCategory: "Power Supply",
    alert: "Maintenance Due",
    status: "Inactive",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "20 Feb 2026\n02:15 PM",
  },
  {
    id: "ac5", no: 5,
    assetCategory: "Cable & Accessories",
    alert: "—",
    status: "Active",
    createdBy: "Admin User",
    createdByRole: "System Admin",
    lastUpdatedOn: "10 Mar 2026\n11:00 AM",
  },
];

// Operators for issue assets
export const operators = [
  "Ken Chow",
  "Liam Johansson",
  "Sarah Mitchell",
  "David Chen",
];

// Armskote Personnel Operators
export const armskokePersonnelOperators = [
  "Patrick Ta",
  "Sofia Moretti",
  "James Rodriguez",
  "Emma Thompson",
];

// Assignment types
export const assignmentTypes = [
  "Single Booking",
  "Multiple Bookings",
  "Base Station",
  "Maintenance",
  "Administration",
];

// Base stations
export const baseStations = [
  "SWT-01",
  "SWT-02",
  "SWT-04",
  "SWT-05",
  "IMT-01",
  "IMT-02",
  "IMT-03",
];

// Mapping of base stations to available bookings (uses actual booking IDs from mock.ts)
export const baseStationBookings: Record<string, string[]> = {
  "SWT-01": ["6", "7"],
  "SWT-02": ["6", "7"],
  "SWT-04": ["7"],
  "SWT-05": ["6"],
  "IMT-01": ["1", "2", "4", "5"],
  "IMT-02": ["3", "8"],
  "IMT-03": ["9"],
};
