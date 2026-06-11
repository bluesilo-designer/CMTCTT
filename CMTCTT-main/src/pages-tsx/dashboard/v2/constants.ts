import type { SessionType, BookingStatus, WeekCell, DayBooking } from "./types";

// ── Station lists per booking type ────────────────────────────────────────────

export const CMT_STATIONS     = ["CMT01", "CMT02", "CMT04", "CMT06", "CMT08", "CMT09"];
export const SWT_STATIONS     = ["IMT-01", "IMT-02", "IMT-03", "IMT-04", "IMT-05", "IMT-06"];
export const CMTCTT_STATIONS  = ["CMT01", "CMT02", "CMT04", "CMT06", "CTT01", "CTT02", "CTT04"];

/** Cabins that are under maintenance — displayed differently in the grid */
export const UNAVAILABLE_STATIONS = new Set(["CMT09"]);

/** Legacy default (kept for backward compat) */
export const STATIONS = SWT_STATIONS;

// ── Week data — CMT ───────────────────────────────────────────────────────────

export const cmtWeekData: Record<string, Record<string, WeekCell[]>> = {
  CMT01: {
    Mon: [{ type: "Full", status: "Completed" }],
    Tue: [{ type: "AM",   status: "Upcoming"  }, { type: "PM", status: "Upcoming" }],
    Wed: [{ type: "AM",   status: "Ongoing"   }],
    Thu: [{ type: "Full", status: "Upcoming"  }],
    Fri: [{ type: "PM",   status: "Upcoming"  }],
    Sat: [], Sun: [],
  },
  CMT02: {
    Mon: [{ type: "AM",   status: "Upcoming"  }],
    Tue: [{ type: "Full", status: "Completed" }],
    Wed: [{ type: "Full", status: "Ongoing"   }],
    Thu: [{ type: "AM",   status: "Upcoming"  }],
    Fri: [{ type: "Full", status: "Completed" }],
    Sat: [], Sun: [],
  },
  CMT04: {
    Mon: [], Tue: [{ type: "AM", status: "Upcoming" }],
    Wed: [{ type: "AM",   status: "Ongoing"  }, { type: "PM", status: "Upcoming" }],
    Thu: [{ type: "PM",   status: "Upcoming" }],
    Fri: [], Sat: [], Sun: [],
  },
  CMT06: {
    Mon: [{ type: "PM",   status: "Upcoming"  }],
    Tue: [], Wed: [], Thu: [{ type: "Full", status: "Upcoming" }],
    Fri: [{ type: "AM",   status: "Upcoming"  }],
    Sat: [], Sun: [],
  },
  CMT08: {
    Mon: [],
    Tue: [{ type: "AM",   status: "Upcoming"  }],
    Wed: [], Thu: [], Fri: [{ type: "Full", status: "Completed" }],
    Sat: [{ type: "AM",   status: "Upcoming"  }], Sun: [],
  },
  CMT09: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] }, // Under maintenance
};

// ── Week data — SWT (existing IMT data) ──────────────────────────────────────

export const swtWeekData: Record<string, Record<string, WeekCell[]>> = {
  "IMT-01": {
    Mon: [{ type: "Full", status: "Completed" }],
    Tue: [{ type: "AM", status: "Upcoming" }, { type: "PM", status: "Upcoming" }],
    Wed: [{ type: "AM", status: "Ongoing"  }, { type: "PM", status: "Ongoing"  }],
    Thu: [{ type: "Full", status: "Upcoming" }],
    Fri: [{ type: "AM",   status: "Upcoming" }],
    Sat: [], Sun: [],
  },
  "IMT-02": {
    Mon: [{ type: "AM", status: "Upcoming" }],
    Tue: [{ type: "Full", status: "Completed" }],
    Wed: [{ type: "Full", status: "Ongoing"   }],
    Thu: [{ type: "PM",   status: "Upcoming"  }],
    Fri: [{ type: "Full", status: "Completed" }],
    Sat: [{ type: "AM",   status: "Upcoming"  }], Sun: [],
  },
  "IMT-03": {
    Mon: [], Tue: [{ type: "Hr", status: "Upcoming" }],
    Wed: [{ type: "Hr", status: "Ongoing" }, { type: "Hr", status: "Upcoming" }],
    Thu: [{ type: "AM", status: "Upcoming" }, { type: "PM", status: "Upcoming" }],
    Fri: [], Sat: [], Sun: [],
  },
  "IMT-04": {
    Mon: [{ type: "Ad", status: "Upcoming" }],
    Tue: [{ type: "Ad", status: "Upcoming" }],
    Wed: [{ type: "Ad", status: "Upcoming" }],
    Thu: [], Fri: [{ type: "PM", status: "Upcoming" }],
    Sat: [], Sun: [],
  },
  "IMT-05": {
    Mon: [], Tue: [{ type: "AM", status: "Upcoming" }],
    Wed: [{ type: "AM", status: "Ongoing" }],
    Thu: [], Fri: [{ type: "Full", status: "Completed" }],
    Sat: [], Sun: [],
  },
  "IMT-06": {
    Mon: [], Tue: [], Wed: [],
    Thu: [{ type: "AM", status: "Upcoming" }],
    Fri: [], Sat: [], Sun: [],
  },
};

// ── Week data — CMT CTT (combined cabins + CTT clusters) ─────────────────────

export const cmtcttWeekData: Record<string, Record<string, WeekCell[]>> = {
  CMT01: {
    Mon: [], Tue: [{ type: "Full", status: "Completed" }],
    Wed: [{ type: "AM", status: "Ongoing" }],
    Thu: [{ type: "Full", status: "Upcoming" }], Fri: [], Sat: [], Sun: [],
  },
  CMT02: {
    Mon: [{ type: "AM", status: "Upcoming" }], Tue: [],
    Wed: [{ type: "Full", status: "Ongoing" }],
    Thu: [], Fri: [{ type: "PM", status: "Upcoming" }], Sat: [], Sun: [],
  },
  CMT04: {
    Mon: [], Tue: [{ type: "AM", status: "Upcoming" }], Wed: [],
    Thu: [{ type: "Full", status: "Upcoming" }], Fri: [], Sat: [], Sun: [],
  },
  CMT06: {
    Mon: [{ type: "Full", status: "Completed" }], Tue: [], Wed: [],
    Thu: [], Fri: [{ type: "AM", status: "Upcoming" }], Sat: [], Sun: [],
  },
  CTT01: {
    Mon: [], Tue: [{ type: "AM", status: "Upcoming" }],
    Wed: [{ type: "Full", status: "Ongoing" }],
    Thu: [{ type: "PM", status: "Upcoming" }], Fri: [], Sat: [], Sun: [],
  },
  CTT02: {
    Mon: [], Tue: [], Wed: [{ type: "AM", status: "Upcoming" }],
    Thu: [], Fri: [{ type: "Full", status: "Upcoming" }], Sat: [], Sun: [],
  },
  CTT04: {
    Mon: [{ type: "PM", status: "Completed" }], Tue: [], Wed: [],
    Thu: [{ type: "AM", status: "Upcoming" }], Fri: [], Sat: [], Sun: [],
  },
};

// ── Combined weekData selector ────────────────────────────────────────────────

export const weekData = swtWeekData; // default (kept for DayView backward compat)

export const weekDataByType = {
  All:       swtWeekData,
  CMT:       cmtWeekData,
  SWT:       swtWeekData,
  "CMT CTT": cmtcttWeekData,
};

export const stationsByType = {
  All:       SWT_STATIONS,
  CMT:       CMT_STATIONS,
  SWT:       SWT_STATIONS,
  "CMT CTT": CMTCTT_STATIONS,
};

// ── Daily counts per type ─────────────────────────────────────────────────────

export const weekDailyCountsByType: Record<string, number[]> = {
  All:       [3, 6, 7, 5, 4, 1, 0],
  CMT:       [2, 4, 5, 3, 4, 1, 0],
  SWT:       [3, 6, 7, 5, 4, 1, 0],
  "CMT CTT": [2, 3, 5, 4, 2, 0, 0],
};

export const weekDailyCounts = weekDailyCountsByType["SWT"]; // default

// ── Stats per booking type (for TopCards) ────────────────────────────────────

export const bookingTypeStats = {
  CMT: {
    total: 12, ongoing: 3, upcoming: 6, completed: 3,
    color: "brand-primary", label: "CMT",
    desc: "Combat Mission Trainer",
  },
  SWT: {
    total: 24, ongoing: 8, upcoming: 8, completed: 8,
    color: "blue", label: "SWT",
    desc: "Shooter Weapon Trainer",
  },
  "CMT CTT": {
    total: 6, ongoing: 2, upcoming: 3, completed: 1,
    color: "violet", label: "CMT CTT",
    desc: "Combined Simulation",
  },
};

// ── Day view bookings ─────────────────────────────────────────────────────────

export const dayBookings: DayBooking[] = [
  { station: "IMT-01", unitName: "3 SIR",    sessionType: "AM",   startHour: 1, durationHours: 4,   status: "Completed", timeLabel: "AM · 8:00–12:00 · completed" },
  { station: "IMT-01", unitName: "1 Guards",  sessionType: "PM",   startHour: 6, durationHours: 4,   status: "Ongoing",   timeLabel: "PM · 1:00–5:00 · ongoing"    },
  { station: "IMT-02", unitName: "2 CDO",     sessionType: "Full", startHour: 1, durationHours: 9,   status: "Ongoing",   timeLabel: "Full · 8:00–5:00 · ongoing"   },
  { station: "IMT-03", unitName: "4 SIR",     sessionType: "Hr",   startHour: 2, durationHours: 2.5, status: "Completed", timeLabel: "Hr · Per hour · completed"    },
  { station: "IMT-03", unitName: "2 PDF",     sessionType: "Hr",   startHour: 5, durationHours: 2.5, status: "Upcoming",  timeLabel: "Hr · Per hour · upcoming"     },
  { station: "IMT-04", unitName: "5 SIR",     sessionType: "Ad",   startHour: 0, durationHours: 5.5, status: "Ongoing",   timeLabel: "Ad · 7 Apr PM → 9 Apr AM · ongoing" },
  { station: "IMT-05", unitName: "Guards HQ", sessionType: "AM",   startHour: 1, durationHours: 4,   status: "Completed", timeLabel: "AM · 8:00–12:00 · completed"  },
];

export const cmtDayBookings: DayBooking[] = [
  { station: "CMT01", unitName: "1SIR",  sessionType: "AM",   startHour: 1, durationHours: 4, status: "Completed", timeLabel: "AM · 8:00–12:00 · completed" },
  { station: "CMT01", unitName: "2SIR",  sessionType: "PM",   startHour: 6, durationHours: 4, status: "Ongoing",   timeLabel: "PM · 1:00–5:00 · ongoing"    },
  { station: "CMT02", unitName: "3SIR",  sessionType: "Full", startHour: 1, durationHours: 9, status: "Ongoing",   timeLabel: "Full · 8:00–5:00 · ongoing"   },
  { station: "CMT04", unitName: "40SAR", sessionType: "AM",   startHour: 2, durationHours: 4, status: "Upcoming",  timeLabel: "AM · 9:00–1:00 · upcoming"    },
  { station: "CMT06", unitName: "41SAR", sessionType: "PM",   startHour: 6, durationHours: 4, status: "Upcoming",  timeLabel: "PM · 1:00–5:00 · upcoming"    },
];

// ── Calendar heatmap ──────────────────────────────────────────────────────────

export const aprilBookings: Record<number, number> = {
  1: 3, 2: 5, 3: 4, 4: 2, 5: 6,
  8: 1, 9: 7, 10: 3, 11: 5, 12: 2,
  13: 1, 15: 3, 16: 4, 17: 2, 18: 1, 19: 5,
  22: 2, 23: 3, 24: 4, 25: 1, 26: 3,
  27: 1, 29: 2, 30: 3,
};

// ── Style constants ───────────────────────────────────────────────────────────

export const sessionColors: Record<SessionType, { bg: string; text: string; dot: string; border: string }> = {
  AM:   { bg: "bg-red-50/60",    text: "text-red-500",    dot: "bg-red-300",    border: "border-red-100"    },
  PM:   { bg: "bg-orange-50/70", text: "text-orange-500", dot: "bg-orange-300", border: "border-orange-100" },
  Full: { bg: "bg-rose-50/50",   text: "text-rose-600",   dot: "bg-rose-300",   border: "border-rose-100"   },
  Hr:   { bg: "bg-pink-50/60",   text: "text-pink-500",   dot: "bg-pink-300",   border: "border-pink-100"   },
  Ad:   { bg: "bg-red-100/40",   text: "text-red-400",    dot: "bg-red-200",    border: "border-red-100"    },
};

export const statusDot: Record<BookingStatus, string> = {
  Completed: "bg-emerald-300",
  Ongoing:   "bg-amber-300",
  Upcoming:  "bg-red-200",
};

export const WEEK_DAYS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const WEEK_DATES = [7, 8, 9, 10, 11, 12, 13] as const;
export const TODAY_IDX  = 2; // Wed 9

export const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
export const CURRENT_HOUR = 16.5;

export function getMonthIntensity(count: number): string {
  if (!count) return "bg-white";
  if (count <= 2) return "bg-red-50";
  if (count <= 4) return "bg-red-100";
  return "bg-red-200";
}
