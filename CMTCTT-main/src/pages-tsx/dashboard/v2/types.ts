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
  startHour: number;
  durationHours: number;
  status: BookingStatus;
  timeLabel: string;
}
