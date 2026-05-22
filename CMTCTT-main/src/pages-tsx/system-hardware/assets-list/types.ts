import type { AssetStatus } from "@/data/systemHardware";

export const TABS = [
  "Overall",
  "Issued",
  "Maintenance",
  "Overdue",
  "Pending Return",
  "Not Returned",
  "Missing",
  "No RFI",
] as const;
export type Tab = (typeof TABS)[number];

export const TAB_STATUS_MAP: Partial<Record<Tab, AssetStatus>> = {
  Issued: "Issued",
  Maintenance: "Maintenance",
  Overdue: "Overdue",
  "Pending Return": "Pending Return",
  "Not Returned": "Not Returned",
  Missing: "Missing",
};

export interface AssetsListProps {
  onNavigate?: (path: string) => void;
}
