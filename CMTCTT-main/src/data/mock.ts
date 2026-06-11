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
  isCMT?: boolean;
  isCMTCTT?: boolean;
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
    id: "cmtctt-1",
    bookingId: "#111024-KC0004",
    program: "CMT CTT Training for Unit 19",
    trainingType: "Group",
    bookingTime: "10 Jan 2025\n08:00 AM - 12:00 PM (AM Session)",
    bookingDate: "10 Jan 2025",
    status: "Upcoming",
    trainingMode: "Simulation",
    courseware: "Component Type Training B",
    assignmentId: "-",
    unitName: "Unit 19",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 32,
  },
  {
    id: "cmt-1",
    bookingId: "#260425-CMT001",
    program: "CMT Training for Unit 10",
    trainingType: "Group",
    bookingTime: "25 Apr 2026\n12:00 PM – 05:00 PM (PM Session)",
    bookingDate: "25 Apr 2026",
    status: "Upcoming",
    trainingMode: "Simulation",
    courseware: "Component Type Training B",
    assignmentId: "-",
    unitName: "Unit 10",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 25,
  },
  {
    id: "3",
    bookingId: "#260422-CMT003",
    program: "CMT Training for Unit 3SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n08:00 AM – 12:00 PM (AM Session)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "-",
    unitName: "3SIR",
    weapon: "40AGL",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 28,
  },
  {
    id: "4",
    bookingId: "#260422-CMT004",
    program: "CMT Training for Unit 2SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n09:00 AM – 01:00 PM (AM Session)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "-",
    unitName: "2SIR",
    weapon: "50HMG",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 24,
  },
  {
    id: "5",
    bookingId: "#260422-KC0005",
    program: "CMT CTT Training for Unit 1GDS",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Completed",
    trainingMode: "Simulation",
    courseware: "Component Type Training A",
    assignmentId: "#260422-AT004",
    unitName: "1GDS",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 32,
  },
  {
    id: "6",
    bookingId: "#260422-CMT006",
    program: "CMT Training for Unit 40SAR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n10:00 AM – 02:00 PM (AM Session)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Simulation",
    courseware: "Basic Crew Training Module 1",
    assignmentId: "-",
    unitName: "40SAR",
    weapon: "40AGL",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 20,
  },
  {
    id: "7",
    bookingId: "#260423-KC0007",
    program: "CMT CTT Training for Unit SR1",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "23 Apr 2026",
    status: "Ongoing",
    trainingMode: "Simulation",
    courseware: "Component Type Training B",
    assignmentId: "#260423-AT003",
    unitName: "SR1",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 30,
  },
  {
    id: "8",
    bookingId: "#260428-CMT008",
    program: "CMT Training for Unit 41SAR",
    trainingType: "Group",
    bookingTime: "28 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "28 Apr 2026",
    status: "Upcoming",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "-",
    unitName: "41SAR",
    weapon: "50HMG",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 22,
  },
  {
    id: "9",
    bookingId: "#260422-KC0009",
    program: "CMT CTT Training for Unit Foxtrot",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Completed",
    trainingMode: "Simulation",
    courseware: "Component Type Training A",
    assignmentId: "#260422-AT002",
    unitName: "Foxtrot",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 28,
  },
  {
    id: "10",
    bookingId: "#260422-CMT010",
    program: "CMT Training for Unit 1SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n08:00 AM – 12:00 PM (AM Session)",
    bookingDate: "22 Apr 2026",
    status: "Overdue",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "-",
    unitName: "1SIR",
    weapon: "40AGL",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 26,
  },
  {
    id: "11",
    bookingId: "#260422-CMT011",
    program: "CMT Training for Unit 5SIR",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Completed",
    trainingMode: "Simulation",
    courseware: "Basic Crew Training Module 2",
    assignmentId: "#260422-AT001",
    unitName: "5SIR",
    weapon: "50HMG",
    assetIssued: true,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 24,
  },
  {
    id: "12",
    bookingId: "#260423-CMT012",
    program: "CMT Training for Unit Alpha",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n08:00 AM – 12:00 PM (AM Session)",
    bookingDate: "23 Apr 2026",
    status: "Upcoming",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "-",
    unitName: "Alpha",
    weapon: "40AGL",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 18,
  },
  {
    id: "13",
    bookingId: "#260423-KC0013",
    program: "CMT CTT Training for Unit Bravo",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "23 Apr 2026",
    status: "Upcoming",
    trainingMode: "Simulation",
    courseware: "Component Type Training C",
    assignmentId: "-",
    unitName: "Bravo",
    weapon: "40AGL, 50HMG",
    assetIssued: false,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 32,
  },
  {
    id: "14",
    bookingId: "#260423-CMT014",
    program: "CMT Training for Unit Charlie",
    trainingType: "Group",
    bookingTime: "23 Apr 2026\n08:00 AM – 12:00 PM (AM Session)",
    bookingDate: "23 Apr 2026",
    status: "Cancelled",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "-",
    unitName: "Charlie",
    weapon: "40AGL",
    assetIssued: false,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 20,
  },
  {
    id: "15",
    bookingId: "#260422-KC0015",
    program: "CMT CTT Training for Unit Delta",
    trainingType: "Group",
    bookingTime: "22 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "22 Apr 2026",
    status: "Return Assets",
    trainingMode: "Simulation",
    courseware: "Component Type Training B",
    assignmentId: "#260422-AT005",
    unitName: "Delta",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 30,
  },
  {
    id: "16",
    bookingId: "#260428-CMT016",
    program: "CMT Training for Unit Bravo Team",
    trainingType: "Group",
    bookingTime: "28 Apr 2026\n08:00 AM – 12:00 PM (AM Session)",
    bookingDate: "28 Apr 2026",
    status: "Ongoing",
    trainingMode: "Simulation",
    courseware: "IOCC_2(TRX)",
    assignmentId: "#260428-AT004",
    unitName: "Bravo",
    weapon: "50HMG",
    assetIssued: true,
    isCMT: true,
    sectionType: "Standalone",
    trainees: 26,
  },
  {
    id: "17",
    bookingId: "#260429-KC0017",
    program: "CMT CTT Training for Unit Echo Squad",
    trainingType: "Group",
    bookingTime: "29 Apr 2026\n01:00 PM – 05:00 PM (PM Session)",
    bookingDate: "29 Apr 2026",
    status: "Ongoing",
    trainingMode: "Simulation",
    courseware: "Advanced CMT Training Module",
    assignmentId: "#260429-AT006",
    unitName: "Echo",
    weapon: "40AGL, 50HMG",
    assetIssued: true,
    isCMTCTT: true,
    sectionType: "Standalone",
    trainees: 32,
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
