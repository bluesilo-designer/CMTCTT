// ── Types & Interfaces for Settings ──────────────────────────────────────────

import { MENU_ITEMS } from "./constants";

export type MenuItem = (typeof MENU_ITEMS)[number];

export type NotifTab = "Booking" | "Asset" | "Training" | "User";

export interface IPEntry {
  id: string;
  name: string;
  ipAddress: string;
  description: string;
  startIp: string;
  endIp: string;
}

export interface RoomEntry {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  description: string;
}

export interface VersionEntry {
  id: string;
  version: string;
  date: string;
  patchNotes: string[];
}
