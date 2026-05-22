export type Status =
  | "Passed" | "Failed"
  | "Running" | "Unknown" | "Battery Low" | "Not Found"
  | "Not Running" | "Ok" | "Jammed" | "Shutting Down" | "Low"
  | "Connected";

export interface CheckItem {
  label: string;
  status: Status;
  info?: { description: string; errorMessage: string };
}

export interface SectionData {
  id: string;
  title: string;
  infoTitle: string;
  overallStatus: Status;
  items: CheckItem[];
}

export type NavNode = {
  id: string;
  label: string;
  status?: Status;
  sectionId?: string;
  children?: NavNode[];
};
