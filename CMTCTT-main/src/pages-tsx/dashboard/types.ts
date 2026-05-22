export type ViewMode = "Day" | "Week" | "Month";
export type SessionType = "AM" | "PM" | "Full" | "Hr" | "Ad";
export type BookingStatus = "Completed" | "Ongoing" | "Upcoming";

export interface WeekCell {
  type: SessionType;
  status: BookingStatus;
}

export interface DayBooking {
  station: string;
  unitName: string;
  sessionType: SessionType;
  startHour: number; // 0-based from 7AM (so 0=7AM, 1=8AM, ...)
  durationHours: number;
  status: BookingStatus;
  timeLabel: string;
}

export interface WeekStationRow {
  station: string;
  bookingCount: number;
  Mon: WeekCell[];
  Tue: WeekCell[];
  Wed: WeekCell[];
  Thu: WeekCell[];
  Fri: WeekCell[];
  Sat: WeekCell[];
  Sun: WeekCell[];
}
