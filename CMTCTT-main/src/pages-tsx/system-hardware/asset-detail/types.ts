export const TABS = ["RFID Information", "Activities", "Disposal List"] as const;
export type Tab = (typeof TABS)[number];

export interface AssetDetailProps {
  assetId?: string;
  onNavigate?: (path: string) => void;
}
