export interface AssetCreationFormValues {
  assetName: string;
  assetCategory: string;
  serialNumber: string;
  assetType: string;
  assetTagId: string;
  status: string;
  site: string;
  layers: string;
  remarks: string;
}

export interface AssetCreationProps {
  onNavigate?: (path: string) => void;
}
