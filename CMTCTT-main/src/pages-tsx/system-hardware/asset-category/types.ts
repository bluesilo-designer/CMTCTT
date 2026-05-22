import type { AssetCategory } from "@/data/systemHardware";

export interface EditTarget {
  name: string;
  status: string;
  alert: string;
}

export interface AssetCategoryRow extends AssetCategory {
  _idx: number;
}

export const STATUS_OPTIONS = ["Active", "Inactive"] as const;
export const ALERT_MODE_OPTIONS = ["Critical Component", "Non-Critical Component"] as const;

export type StatusOption = (typeof STATUS_OPTIONS)[number];
export type AlertModeOption = (typeof ALERT_MODE_OPTIONS)[number];
