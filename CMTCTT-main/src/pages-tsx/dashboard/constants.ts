import type { ViewMode, SessionType, BookingStatus, WeekCell, DayBooking } from "./types";

export const STATIONS = ["IMT-01", "IMT-02", "IMT-03", "IMT-04", "IMT-05", "IMT-06"];

export const weekData: Record<string, Record<string, WeekCell[]>> = {
  "IMT-01": {
    Mon: [{ type: "Full", status: "Completed" }],
    Tue: [{ type: "AM", status: "Upcoming" }, { type: "PM", status: "Upcoming" }],
    Wed: [{ type: "AM", status: "Ongoing" }, { type: "PM", status: "Ongoing" }],
    Thu: [{ type: "Full", status: "Upcoming" }],
    Fri: [{ type: "AM", status: "Upcoming" }],
    Sat: [],
    Sun: [],
  },
  "IMT-02": {
    Mon: [{ type: "AM", status: "Upcoming" }],
    Tue: [{ type: "Full", status: "Completed" }],
    Wed: [{ type: "Full", status: "Ongoing" }],
    Thu: [{ type: "PM", status: "Upcoming" }],
    Fri: [{ type: "Full", status: "Completed" }],
    Sat: [{ type: "AM", status: "Upcoming" }],
    Sun: [],
  },
  "IMT-03": {
    Mon: [],
    Tue: [{ type: "Hr", status: "Upcoming" }],
    Wed: [{ type: "Hr", status: "Ongoing" }, { type: "Hr", status: "Upcoming" }],
    Thu: [{ type: "AM", status: "Upcoming" }, { type: "PM", status: "Upcoming" }],
    Fri: [],
    Sat: [],
    Sun: [],
  },
  "IMT-04": {
    Mon: [{ type: "Ad", status: "Upcoming" }],
    Tue: [{ type: "Ad", status: "Upcoming" }],
    Wed: [{ type: "Ad", status: "Upcoming" }],
    Thu: [],
    Fri: [{ type: "PM", status: "Upcoming" }],
    Sat: [],
    Sun: [],
  },
  "IMT-05": {
    Mon: [],
    Tue: [{ type: "AM", status: "Upcoming" }],
    Wed: [{ type: "AM", status: "Ongoing" }],
    Thu: [],
    Fri: [{ type: "Full", status: "Completed" }],
    Sat: [],
    Sun: [],
  },
  "IMT-06": {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [{ type: "AM", status: "Upcoming" }],
    Fri: [],
    Sat: [],
    Sun: [],
  },
};

export const weekDailyCounts = [3, 6, 7, 5, 4, 1, 0];

export const dayBookings: DayBooking[] = [
  { station: "IMT-01", unitName: "3 SIR", sessionType: "AM", startHour: 1, durationHours: 4, status: "Completed", timeLabel: "AM · 8:00–12:00 · completed" },
  { station: "IMT-01", unitName: "1 Guards", sessionType: "PM", startHour: 6, durationHours: 4, status: "Ongoing", timeLabel: "PM · 1:00–5:00 · ongoing" },
  { station: "IMT-02", unitName: "2 CDO", sessionType: "Full", startHour: 1, durationHours: 9, status: "Ongoing", timeLabel: "Full · 8:00–5:00 · ongoing" },
  { station: "IMT-03", unitName: "4 SIR", sessionType: "Hr", startHour: 2, durationHours: 2.5, status: "Completed", timeLabel: "Hr · Per hour · completed" },
  { station: "IMT-03", unitName: "2 PDF", sessionType: "Hr", startHour: 5, durationHours: 2.5, status: "Upcoming", timeLabel: "Hr · Per hour · upcoming" },
  { station: "IMT-04", unitName: "5 SIR", sessionType: "Ad", startHour: 0, durationHours: 5.5, status: "Ongoing", timeLabel: "Ad · 7 Apr PM → 9 Apr AM · ongoing" },
  { station: "IMT-05", unitName: "Guards HQ", sessionType: "AM", startHour: 1, durationHours: 4, status: "Completed", timeLabel: "AM · 8:00–12:00 · completed" },
];

// Month calendar data — bookings per day for April 2026
export const aprilBookings: Record<number, number> = {
  1: 3, 2: 5, 3: 4, 4: 2, 5: 6,
  8: 1, 9: 7, 10: 3, 11: 5, 12: 2,
  13: 1, 15: 3, 16: 4, 17: 2, 18: 1, 19: 5,
  22: 2, 23: 3, 24: 4, 25: 1, 26: 3,
  27: 1, 29: 2, 30: 3,
};

export const sessionColors: Record<SessionType, { bg: string; text: string; dot: string }> = {
  AM: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  PM: { bg: "bg-orange-50", text: "text-orange-500", dot: "bg-orange-400" },
  Full: { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-500" },
  Hr: { bg: "bg-purple-50", text: "text-purple-500", dot: "bg-purple-400" },
  Ad: { bg: "bg-red-50", text: "text-red-500", dot: "bg-red-400" },
};

export const statusDot: Record<BookingStatus, string> = {
  Completed: "bg-green-400",
  Ongoing: "bg-yellow-400",
  Upcoming: "bg-blue-300",
};

export const TOP_CARDS_DATA: Record<ViewMode, {
  bookingLabel: string;
  booking: { total: number; done: number; ongoing: number; awaiting: number };
  asset: { issued: number; returned: number; pending: number };
}> = {
  Day: {
    bookingLabel: "Today's Bookings",
    booking: { total: 24, done: 20, ongoing: 8, awaiting: 4 },
    asset:   { issued: 24, returned: 20, pending: 8 },
  },
  Week: {
    bookingLabel: "This Week's Bookings",
    booking: { total: 86, done: 62, ongoing: 14, awaiting: 10 },
    asset:   { issued: 86, returned: 60, pending: 26 },
  },
  Month: {
    bookingLabel: "This Month's Bookings",
    booking: { total: 312, done: 248, ongoing: 0, awaiting: 64 },
    asset:   { issued: 312, returned: 280, pending: 32 },
  },
};

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const WEEK_DATES = [7, 8, 9, 10, 11, 12, 13] as const;
export const TODAY_IDX = 2; // Wed 9

export const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
export const CURRENT_HOUR = 16.5; // 4:30 PM → offset from 7AM = 9.5
