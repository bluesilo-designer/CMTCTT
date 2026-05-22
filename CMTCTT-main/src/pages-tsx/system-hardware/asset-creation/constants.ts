import type { AssetCreationFormValues } from "./types";

export const ASSET_CATEGORIES = [
  "Weapon",
  "Laptop Computer Device",
  "RFID Reader",
  "Siren",
  "Network Equipment",
  "Other",
];

export const ASSET_TYPES = [
  "SAR21",
  "LMG",
  "M16",
  "M203",
  "GPMG",
  "M110",
  "Lenovo Laptop",
  "RFID Reader",
  "Siren Unit",
];

export const SITES = [
  "Pasir Laba Camp (PLC)",
  "Sembawang Camp",
  "Tengah Camp",
  "Maju Camp",
];

export const STATUS_OPTIONS = ["Available", "Maintenance", "Reserved"];

export const INITIAL_FORM_VALUES: AssetCreationFormValues = {
  assetName: "",
  assetCategory: "",
  serialNumber: "",
  assetType: "",
  assetTagId: "",
  status: "Available",
  site: "",
  layers: "",
  remarks: "",
};
