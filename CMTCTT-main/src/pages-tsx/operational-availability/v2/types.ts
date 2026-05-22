import type { OAMonth } from "@/data/operationalAvailability";

export interface DateRange {
  fromYear: number;
  fromMonth: number;
  toYear: number;
  toMonth: number;
}

export interface MonthPickerProps {
  value: DateRange | null;
  onChange: (r: DateRange | null) => void;
  onClose: () => void;
}

export interface DeviceCellProps {
  deviceId: string;
  deviceName: string;
  total: string;
  laneValues: string[];
  laneNames: string[];
  highlight: "uptime" | "downtime";
}

export interface BookingRowsProps {
  record: OAMonth;
}
