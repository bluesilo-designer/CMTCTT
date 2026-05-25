// ── CMT Onboarding trainees ───────────────────────────────────────────────────
export interface CMTTraineeRow {
  rank: string; name: string; nric: string;
  battalion: string; company: string; section: string;
  appointment: string; platoon: string; roles: string;
}

export const CMT_ONBOARDING_TRAINEES: CMTTraineeRow[] = [
  { rank: "REC", name: "Roger Botosh",     nric: "*****212A", battalion: "1st", company: "AA", section: "1", appointment: "-", platoon: "Platoon 1", roles: "VO" },
  { rank: "REC", name: "Davis Culhane",    nric: "*****212A", battalion: "2nd", company: "BB", section: "2", appointment: "-", platoon: "Platoon 1", roles: "VC" },
  { rank: "REC", name: "Kadin Torff",      nric: "*****212A", battalion: "3rd", company: "CC", section: "3", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "Craig Septimus",   nric: "*****212A", battalion: "5th", company: "DD", section: "4", appointment: "-", platoon: "Platoon 1", roles: "VO" },
  { rank: "REC", name: "Roger Septimus",   nric: "*****212A", battalion: "8th", company: "AA", section: "5", appointment: "-", platoon: "Platoon 1", roles: "SC" },
  { rank: "REC", name: "Jaxson Donin",     nric: "*****212A", battalion: "9th", company: "BB", section: "1", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "James Lubin",      nric: "*****212A", battalion: "1st", company: "CC", section: "2", appointment: "-", platoon: "Platoon 1", roles: "SO" },
  { rank: "REC", name: "Jakob Vaccaro",    nric: "*****212A", battalion: "2nd", company: "DD", section: "3", appointment: "-", platoon: "Platoon 1", roles: "SC" },
  { rank: "REC", name: "Ruben Calzoni",    nric: "*****212A", battalion: "3rd", company: "AA", section: "4", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "Jake Pascal",      nric: "*****212A", battalion: "3rd", company: "AA", section: "4", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "Tyrone Whitfield", nric: "*****212B", battalion: "1st", company: "BB", section: "5", appointment: "-", platoon: "Platoon 2", roles: "VO" },
  { rank: "REC", name: "Marcus Chen",      nric: "*****212B", battalion: "2nd", company: "CC", section: "1", appointment: "-", platoon: "Platoon 2", roles: "VC" },
  { rank: "REC", name: "Alvin Tan",        nric: "*****212B", battalion: "3rd", company: "DD", section: "2", appointment: "-", platoon: "Platoon 2", roles: "TC" },
  { rank: "REC", name: "Wei Ming Lim",     nric: "*****212B", battalion: "5th", company: "AA", section: "3", appointment: "-", platoon: "Platoon 2", roles: "SC" },
  { rank: "REC", name: "Iskandar Shah",    nric: "*****212B", battalion: "8th", company: "BB", section: "4", appointment: "-", platoon: "Platoon 2", roles: "SO" },
  { rank: "REC", name: "Rahul Patel",      nric: "*****212B", battalion: "9th", company: "CC", section: "5", appointment: "-", platoon: "Platoon 2", roles: "TC" },
  { rank: "REC", name: "Dylan Ong",        nric: "*****212C", battalion: "1st", company: "DD", section: "1", appointment: "-", platoon: "Platoon 3", roles: "VO" },
  { rank: "REC", name: "Brandon Lee",      nric: "*****212C", battalion: "2nd", company: "AA", section: "2", appointment: "-", platoon: "Platoon 3", roles: "VC" },
  { rank: "REC", name: "Justin Koh",       nric: "*****212C", battalion: "3rd", company: "BB", section: "3", appointment: "-", platoon: "Platoon 3", roles: "TC" },
  { rank: "REC", name: "Nathan Yeo",       nric: "*****212C", battalion: "5th", company: "CC", section: "4", appointment: "-", platoon: "Platoon 3", roles: "SC" },
  { rank: "REC", name: "Ethan Ho",         nric: "*****212C", battalion: "8th", company: "DD", section: "5", appointment: "-", platoon: "Platoon 3", roles: "SO" },
  { rank: "REC", name: "Samuel Ng",        nric: "*****212D", battalion: "9th", company: "AA", section: "1", appointment: "-", platoon: "Platoon 4", roles: "TC" },
  { rank: "REC", name: "Aaron Lim",        nric: "*****212D", battalion: "1st", company: "BB", section: "2", appointment: "-", platoon: "Platoon 4", roles: "VO" },
  { rank: "REC", name: "Zachary Tan",      nric: "*****212D", battalion: "2nd", company: "CC", section: "3", appointment: "-", platoon: "Platoon 4", roles: "VC" },
  { rank: "REC", name: "Gabriel Wong",     nric: "*****212D", battalion: "3rd", company: "DD", section: "4", appointment: "-", platoon: "Platoon 4", roles: "TC" },
];

// ── SWT bookings mock ─────────────────────────────────────────────────────────
export const MOCK_ASSIGNMENTS = [
  { id: "#260422-AT001", courseware: "Component Type Training A" },
  { id: "#260422-AT002", courseware: "Component Type Training B" },
  { id: "#260422-AT003", courseware: "Component Type Training C" },
];

export const WEAPON_OPTIONS = ["SAR21", "LMG", "M203", "GPMG", "M110", "SPIKE SR", "SPIKE LR", "MATADOR"];
export const PER_PAGE = 10;

export const CASE2_NAMES = [
  "Roger Botosh","Davis Culhane","Kadin Torff","Kelvin Lamon","Roger Septimus",
  "Jaxson Donin","James Lubin","Jakob Vaccaro","Ruben Calzoni","Jake Pascal",
  "Marcus Levin","Ethan Clarke","Noah Briggs","Liam Foster","Oliver Kent",
  "Aiden Walsh","Samuel Reed","Elijah Shaw","Henry Grant","Lucas Webb",
  "Benjamin Cole","Mason Hart","Caleb Moore","Daniel Cross","Evan Stone",
  "Jordan Bell","Tyler Brooks","Nathan Kim","Ryan Park","Connor Lee",
  "Dylan Chen","Brandon Wu",
];

export const CASE2_STATUSES = [
  "Registered (Present)","Non-registered (Present)","Registered (Present)",
  "Registered (Absent)","Registered (Present)","Non-registered (Present)",
  "Non-registered (Present)","Registered (Present)","Registered (Present)",
  "Registered (Present)","Registered (Present)","Non-registered (Present)",
  "Registered (Absent)","Registered (Present)","Non-registered (Present)",
  "Registered (Present)","Registered (Present)","Registered (Absent)",
  "Registered (Present)","Non-registered (Present)","Registered (Present)",
  "Registered (Present)","Registered (Absent)","Registered (Present)",
  "Registered (Present)","Non-registered (Present)","Registered (Present)",
  "Registered (Present)","Registered (Present)","Registered (Absent)",
  "Registered (Present)","Non-registered (Present)",
];

export const CASE2_TRAINEES = CASE2_NAMES.map((name, i) => ({
  no: i + 1, rank: "REC", name,
  nric: "*****212A", platoon: "Platoon 1", weaponType: "SAR21",
  attendanceStatus: CASE2_STATUSES[i] ?? "Registered (Present)",
  lastUpdated: "17 January 2025\n09:29:33 AM",
}));

export const BOOKING_DATA = {
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

export const ONBOARDING_STATIONS = [
  { id: "PLC-IMT-01", label: "PLC-IMT-01" },
  { id: "PLC-IMT-02", label: "PLC-IMT-02" },
];

export interface OnboardingLaneState { on: boolean; weaponType: string; closed: boolean; }

export const makeOnboardingLanes = (): OnboardingLaneState[] =>
  Array.from({ length: 10 }, (_, i) => ({
    on: i !== 3 && i !== 5 && i !== 9,
    weaponType: (i !== 3 && i !== 5 && i !== 9) ? "SAR21" : "",
    closed: i === 9,
  }));

export const DETAIL_GROUPS = [
  {
    station: "PLC-IMT-01",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-01", trainees: 8, status: "Pending" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-01", trainees: 8, status: "Pending" },
    ],
  },
  {
    station: "PLC-IMT-02",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-03", trainees: 8, status: "Pending" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-IMT-02", trainees: 8, status: "Pending" },
    ],
  },
];

export type LaneRow =
  | { type: "trainee"; rank: string; name: string; nric: string }
  | { type: "closed" }
  | { type: "available" };

const LANE_TRAINEES: LaneRow[] = [
  { type: "trainee", rank: "REC", name: "Ken Chow",       nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Brant Chow",     nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Jake Chow",      nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Kelvin Mars",    nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Holland Tomz",   nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Sam Porter",     nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Krake Bell",     nric: "S8237272D" },
  { type: "closed" },
  { type: "trainee", rank: "REC", name: "Vaniz Martin",   nric: "S8237272D" },
  { type: "trainee", rank: "REC", name: "Louis Hamilton", nric: "S8237272D" },
];

export const EDIT_DETAILS: { label: string; lanes: LaneRow[] }[] = [
  { label: "Detail 1", lanes: LANE_TRAINEES },
  { label: "Detail 2", lanes: LANE_TRAINEES },
  { label: "Detail 3", lanes: LANE_TRAINEES },
  {
    label: "Detail 4",
    lanes: [
      { type: "trainee", rank: "REC", name: "Ken Chow",       nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Brant Chow",     nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Jake Chow",      nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Kelvin Mars",    nric: "S8237272D" },
      { type: "trainee", rank: "REC", name: "Holland Tomz",   nric: "S8237272D" },
      { type: "available" },
      { type: "available" },
      { type: "closed" },
      { type: "available" },
      { type: "trainee", rank: "REC", name: "Louis Hamilton", nric: "S8237272D" },
    ],
  },
];

export const LIVE_DETAIL_GROUPS = [
  {
    station: "PLC-IMT-01",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-01", trainees: 8, status: "Completed" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-01", trainees: 8, status: "In Queue" },
    ],
  },
  {
    station: "PLC-IMT-02",
    details: [
      { label: "Detail 1 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-02", trainees: 8, status: "Completed" },
      { label: "Detail 2 (Stage A,Stage B,Stage C)", assignedStation: "PLC-SWT-02", trainees: 8, status: "Ready" },
    ],
  },
];

export const STATIONS_FOR_RESULTS = ["PLC-IMT-01","PLC-IMT-01","PLC-IMT-01","PLC-IMT-01","PLC-IMT-02","PLC-IMT-02","PLC-IMT-02","PLC-IMT-02"];

export const createLiveResults = (trainees: any[]) => trainees.map((t: any, i: any) => ({
  ...t,
  weapon: "SAR21",
  station: STATIONS_FOR_RESULTS[Math.floor(i / 4) % 8] ?? "PLC-IMT-01",
  detail: `Detail ${Math.floor(i / 8) + 1}`,
  lane: `Lane ${(i % 8) + 1}`,
  stageA: { score: 16, total: 25, pass: true },
  stageB: { score: 24, total: 25, pass: true },
  stageC: { score: 24, total: 25, pass: true },
  courseScore: 64, courseTotalScore: 75, pass: true,
  attempts: [
    { a: 8,  b: 8,  c: 8,  pass: false },
    { a: 11, b: 16, c: 14, pass: false },
    { a: 16, b: 24, c: 24, pass: true  },
  ],
}));

export const BASE_STATION_OPTIONS = ["PLC-IMT-01","PLC-IMT-02","PLC-IMT-03","PLC-IMT-04","PLC-SWT-01","PLC-SWT-02"];
export const RESULTS_PER_PAGE = 7;
export const STAGE_OPTIONS = ["Stage A","Stage B","Stage C","Stage D","Stage E"] as const;
export const NEW_DETAIL_LANES: { lane: number; state: "available" | "closed" | "off" }[] = [
  { lane: 1, state: "available" }, { lane: 2, state: "available" }, { lane: 3, state: "available" },
  { lane: 4, state: "off" },       { lane: 5, state: "available" }, { lane: 6, state: "off" },
  { lane: 7, state: "available" }, { lane: 8, state: "available" }, { lane: 9, state: "available" },
  { lane: 10, state: "closed" },
];
