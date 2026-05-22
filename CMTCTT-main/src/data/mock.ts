export type BookingStatus =
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Cancelled"
  | "Overdue"
  | "Return Assets";

export type TrainingType = "Group" | "Individual";
export type TrainingMode = "Marksmanship" | "Simulation" | "CQB";

export interface Weapon {
  type: string;
  quantity: number;
}

export interface Booking {
  id: string;
  bookingId: string;
  program: string;
  trainingType: TrainingType;
  bookingTime: string;
  bookingDate: string;
  status: BookingStatus;
  trainingMode: TrainingMode;
  courseware: string;
  assignmentId: string;
  unitName: string;
  weapon: string;
  assetIssued: boolean;
  sectionType?: "Standalone" | "Group";
  assignedStations?: string[];
  trainees?: number;
  weaponList?: Weapon[];
}

export interface BaseStation {
  name: string;
  bookings: number;
  statuses: BookingStatus[];
  activeLanes: string;
  assignments: number | string;
  details?: BookingDetail[];
}

export interface BookingDetail {
  id: string;
  program: string;
  bookingId: string;
  trainingType: TrainingType;
  bookingDate: string;
  bookingTime: string;
  assignmentId: string;
  status: BookingStatus;
  // legacy fields kept for compatibility
  unitName?: string;
  trainingMode?: string;
  courseware?: string;
  pax?: number;
}

export interface TrainingResult {
  id: string;
  program: string;
  bookingId: string;
  trainingType: TrainingType;
  bookingDate: string;
  trainingMode: TrainingMode;
  atmsFileId: number;
}

export interface AssetMovement {
  no: number;
  assignmentId: string;
  assetName: string;
  assetTagId: string;
  assetType: string;
  assetCategory: string;
  timePeriod: string;
  date: string;
}

// Today's Booking data
export const baseStations: BaseStation[] = [
  {
    name: "base by daniel",
    bookings: 0,
    statuses: [],
    activeLanes: "0/0",
    assignments: "-",
    details: [],
  },
  {
    name: "base by daniel 2",
    bookings: 0,
    statuses: [],
    activeLanes: "0/0",
    assignments: "-",
    details: [],
  },
  {
    name: "IMT-01",
    bookings: 1,
    statuses: ["Upcoming"],
    activeLanes: "10/10",
    assignments: "-",
    details: [
      {
        id: "1",
        program: "IMT Group Training For Unit 0002",
        bookingId: "#260423-PTC002",
        trainingType: "Group",
        bookingDate: "23 Apr 2026",
        bookingTime: "08:00 AM - 12:00 PM (AM Session)",
        assignmentId: "-",
        status: "Upcoming",
      },
    ],
  },
  {
    name: "IMT-02",
    bookings: 3,
    statuses: ["Upcoming", "Ongoing", "Overdue"],
    activeLanes: "9/10",
    assignments: 2,
    details: [],
  },
  {
    name: "IMT-03",
    bookings: 1,
    statuses: ["Completed"],
    activeLanes: "9/10",
    assignments: 1,
    details: [],
  },
  {
    name: "IMT-04",
    bookings: 0,
    statuses: [],
    activeLanes: "10/10",
    assignments: "-",
    details: [],
  },
  {
    name: "IMT-05",
    bookings: 0,
    statuses: [],
    activeLanes: "10/10",
    assignments: "-",
    details: [],
  },
];

// Booking List data
export const bookings: Booking[] = [
  {
    id: "1",
    bookingId: "#260422-PTC009",
    program: "IMT Group Training for Unit 3SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n(22 Apr) 8:00 AM - (22 Apr) 9:00 AM (Ad-Hoc Schedule)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "3SIR",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "2",
    bookingId: "#260422-PTC010",
    program: "IMT Group Training for Unit 3SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n(22 Apr) 9:00 AM - (22 Apr) 10:00 AM (Ad-Hoc Schedule)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "3SIR",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "3",
    bookingId: "#260422-PTC005",
    program: "IMT Group Training for Unit Aldi 22 APR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Completed",
    trainingMode: "Marksmanship",
    courseware: "Night Test For SAR21/M16 BTP",
    assignmentId: "#260422-AT004",
    unitName: "Aldi 22 APR",
    weapon: "SAR21, LMG",
    assetIssued: false,
  },
  {
    id: "4",
    bookingId: "#260422-PTC008",
    program: "IMT Group Training for Unit 3SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n(22 Apr) 10:00 AM - (22 Apr) 11:00 AM (Ad-Hoc Schedule)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "3SIR",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "5",
    bookingId: "#260422-PTC006",
    program: "IMT Group Training for Unit 3SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n(22 Apr) 8:00 AM - (22 Apr) 9:00 AM (Ad-Hoc Schedule)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "3SIR",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "6",
    bookingId: "#260422-PTC004",
    program: "IMT Group Training for Unit SR1",
    trainingType: "Group",
    bookingTime: "22, 23 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "22, 23 Apr 2026",
    status: "Ongoing",
    trainingMode: "Marksmanship",
    courseware: "Night Test For SAR21/M16 BTP",
    assignmentId: "#260422-AT003",
    unitName: "SR1",
    weapon: "SAR21",
    assetIssued: false,
    sectionType: "Standalone",
    assignedStations: ["SWT-01", "SWT-02", "SWT-04", "SWT-05"],
    trainees: 30,
    weaponList: [
      { type: "SAR21", quantity: 1 },
      { type: "SPIKE SR", quantity: 2 },
      { type: "GPMG", quantity: 1 },
      { type: "MATADOR", quantity: 2 },
      { type: "SPIKE LR", quantity: 1 },
    ],
  },
  {
    id: "7",
    bookingId: "#260428-PTC007",
    program: "IMT Group Training for Unit 3SIR",
    trainingType: "Group",
    bookingTime: "28 Apr 2026\n(28 Apr) 13:00 - 17:00 (PM Session)",
    bookingDate: "28 Apr 2026",
    status: "Upcoming",
    trainingMode: "Marksmanship",
    courseware: "Night Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "3SIR",
    weapon: "SAR21",
    assetIssued: false,
    sectionType: "Standalone",
    assignedStations: ["SWT-01", "SWT-02", "SWT-04", "SWT-05"],
    trainees: 30,
    weaponList: [
      { type: "SAR21", quantity: 1 },
      { type: "SPIKE SR", quantity: 2 },
      { type: "GPMG", quantity: 1 },
      { type: "MATADOR", quantity: 2 },
      { type: "SPIKE LR", quantity: 1 },
    ],
  },
  {
    id: "8",
    bookingId: "#260422-PTC003",
    program: "IMT Group Training for Unit t",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Completed",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "#260422-AT002",
    unitName: "Unit t",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "9",
    bookingId: "#260422-PTC002",
    program: "IMT Group Training for Unit 22 APR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n08:00 AM - 12:00 PM (AM Session)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "22 APR",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "10",
    bookingId: "#260422-PTC001",
    program: "IMT Group Training for Unit t",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Completed",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "#260422-AT001",
    unitName: "Unit t",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "11",
    bookingId: "#260423-PTC001",
    program: "IMT Group Training for Unit Alpha",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n08:00 AM - 12:00 PM (AM Session)",
    bookingDate: "23 Apr 2026",
    status: "Upcoming",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "Alpha",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "12",
    bookingId: "#260423-PTC002",
    program: "IMT Group Training for Unit Bravo",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "23 Apr 2026",
    status: "Upcoming",
    trainingMode: "Marksmanship",
    courseware: "Night Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "Bravo",
    weapon: "LMG",
    assetIssued: false,
  },
  {
    id: "13",
    bookingId: "#260423-PTC003",
    program: "IMT Group Training for Unit Charlie",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n08:00 AM - 12:00 PM (AM Session)",
    bookingDate: "23 Apr 2026",
    status: "Cancelled",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "-",
    unitName: "Charlie",
    weapon: "SAR21",
    assetIssued: false,
  },
  {
    id: "14",
    bookingId: "#260422-PTC011",
    program: "IMT Group Training for Unit Delta",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Return Assets",
    trainingMode: "Marksmanship",
    courseware: "Night Test For SAR21/M16 BTP",
    assignmentId: "#260422-AT005",
    unitName: "Delta",
    weapon: "LMG",
    assetIssued: false,
  },
  {
    id: "15",
    bookingId: "#280426-PTC015",
    program: "IMT Group Training for Unit Bravo Team",
    trainingType: "Group",
    bookingTime: "28 Apr 2026\n08:00 AM - 12:00 PM (AM Session)",
    bookingDate: "28 Apr 2026",
    status: "Ongoing",
    trainingMode: "Marksmanship",
    courseware: "Day Test For SAR21/M16 BTP",
    assignmentId: "#260422-AT004",
    unitName: "Bravo",
    weapon: "SAR21",
    assetIssued: true,
  },
  {
    id: "16",
    bookingId: "#290426-PTC016",
    program: "IMT Group Training for Unit Charlie Squad",
    trainingType: "Group",
    bookingTime: "29 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    bookingDate: "29 Apr 2026",
    status: "Ongoing",
    trainingMode: "Marksmanship",
    courseware: "Advanced SAR21 Training Module",
    assignmentId: "#260422-AT006",
    unitName: "Charlie",
    weapon: "GPMG",
    assetIssued: false,
  },
];

// Training Results
export const trainingResults: TrainingResult[] = [
  {
    id: "1",
    program: "IMT Group Training for Unit Aldi 22 APR",
    bookingId: "#260422-PTC005",
    trainingType: "Group",
    bookingDate: "22 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    trainingMode: "Marksmanship",
    atmsFileId: 1,
  },
  {
    id: "2",
    program: "IMT Group Training for Unit SR1",
    bookingId: "#260422-PTC004",
    trainingType: "Group",
    bookingDate: "22, 23 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    trainingMode: "Marksmanship",
    atmsFileId: 1,
  },
  {
    id: "3",
    program: "IMT Group Training for Unit t",
    bookingId: "#260422-PTC001",
    trainingType: "Group",
    bookingDate: "22 Apr 2026\n01:00 PM - 05:00 PM (PM Session)",
    trainingMode: "Marksmanship",
    atmsFileId: 1,
  },
];

// Asset Movement
export const assetMovements: AssetMovement[] = [
  {
    no: 1,
    assignmentId: "260422-AT001",
    assetName: "SAR21 (C)",
    assetTagId: "250101-SAR21003",
    assetType: "SAR21",
    assetCategory: "Weapon",
    timePeriod: "11:08:42 AM",
    date: "22 Apr 2026",
  },
  {
    no: 2,
    assignmentId: "260422-AT002",
    assetName: "LMG (B)",
    assetTagId: "250101-LMG002",
    assetType: "LMG",
    assetCategory: "Weapon",
    timePeriod: "11:14:38 AM",
    date: "22 Apr 2026",
  },
  {
    no: 3,
    assignmentId: "260422-AT003",
    assetName: "Asset by Daniel",
    assetTagId: "260422-LEL001",
    assetType: "Lenovo Laptop",
    assetCategory: "Laptop Computer Device",
    timePeriod: "11:46:06 AM",
    date: "22 Apr 2026",
  },
  {
    no: 4,
    assignmentId: "260422-AT004",
    assetName: "LMG (E)",
    assetTagId: "250101-LMG005",
    assetType: "LMG",
    assetCategory: "Weapon",
    timePeriod: "01:04:01 PM",
    date: "22 Apr 2026",
  },
  {
    no: 5,
    assignmentId: "260422-AT002",
    assetName: "LMG (B)",
    assetTagId: "250101-LMG002",
    assetType: "LMG",
    assetCategory: "Weapon",
    timePeriod: "02:25:45 PM",
    date: "22 Apr 2026",
  },
  {
    no: 6,
    assignmentId: "260422-AT005",
    assetName: "Lenovo Legion 5 (A)",
    assetTagId: "250101-LEL001",
    assetType: "Lenovo Laptop",
    assetCategory: "Laptop Computer Device",
    timePeriod: "02:35:48 PM",
    date: "22 Apr 2026",
  },
  {
    no: 7,
    assignmentId: "260422-AT006",
    assetName: "Lenovo Legion 5 (A)",
    assetTagId: "250101-LEL001",
    assetType: "Lenovo Laptop",
    assetCategory: "Laptop Computer Device",
    timePeriod: "03:23:45 PM",
    date: "22 Apr 2026",
  },
  {
    no: 8,
    assignmentId: "260422-AT005",
    assetName: "Lenovo Legion 5 (A)",
    assetTagId: "250101-LEL001",
    assetType: "Lenovo Laptop",
    assetCategory: "Laptop Computer Device",
    timePeriod: "03:23:45 PM",
    date: "22 Apr 2026",
  },
  {
    no: 9,
    assignmentId: "260422-AT007",
    assetName: "SAR21 (A)",
    assetTagId: "250101-SAR21001",
    assetType: "SAR21",
    assetCategory: "Weapon",
    timePeriod: "04:15:22 PM",
    date: "22 Apr 2026",
  },
  {
    no: 10,
    assignmentId: "260422-AT008",
    assetName: "LMG (C)",
    assetTagId: "250101-LMG003",
    assetType: "LMG",
    assetCategory: "Weapon",
    timePeriod: "04:45:10 PM",
    date: "22 Apr 2026",
  },
];
