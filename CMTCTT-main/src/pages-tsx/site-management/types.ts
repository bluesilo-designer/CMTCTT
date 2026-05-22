export type LaneStatus = "Active" | "Inactive";
export type StationStatus = "Active" | "Inactive";

export interface Lane {
  id: string;
  name: string;
  status: LaneStatus;
  blackoutDates: string[];
  lastUpdatedOn: string;
}

export interface BlackoutDate {
  label: string;
}

export interface BaseStation {
  id: string;
  name: string;
  status: StationStatus;
  lanes: Lane[];
  blackoutDates: BlackoutDate[];
  lastUpdatedOn: string;
}
