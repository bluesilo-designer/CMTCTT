export interface TodaysBookingProps {
  onNavigate: (path: string) => void;
}

export type BookingStatus = "Upcoming" | "Completed" | "Overdue";

export interface Booking {
  id: string;
  program: string;
  bookingId: string;
  time: string;
  status: BookingStatus;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface SummaryCard {
  label: string;
  value: number;
  unit: string;
  color: string;
  iconColor: string;
}
