export type CabinStatus = "Available" | "Degraded" | "Unavailable";

export interface BlackoutDate {
  label: string;
}

export interface Cabin {
  id: string;
  name: string;
  status: CabinStatus;
  blackoutDates: BlackoutDate[];
  updatedOn: string;
}
