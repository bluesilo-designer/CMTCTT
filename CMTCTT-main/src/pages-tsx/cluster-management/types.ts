export type ClusterStatus = "Available" | "Degraded" | "Unavailable";

export interface BlackoutDate {
  label: string;
}

export interface Cluster {
  id: string;
  name: string;
  status: ClusterStatus;
  blackoutDates: BlackoutDate[];
  updatedOn: string;
}
