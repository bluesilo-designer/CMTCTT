// ── User List ─────────────────────────────────────────────────────────────────
export type AccountStatus = "Active" | "Inactive" | "Archived";
export type UserRoleType = "System Admin" | "Operator" | "Instructor" | "Maintainer";

export interface User {
  id: string;
  userId: string;
  rank: string;
  name: string;
  nric: string;
  unitName: string;
  userRole: UserRoleType;
  accountStatus: AccountStatus;
}

export const users: User[] = [
  { id: "1", userId: "250101-USR199", rank: "REC", name: "Mia Murphy",       nric: "*****341A", unitName: "SAR1", userRole: "System Admin", accountStatus: "Active" },
  { id: "2", userId: "250101-USR008", rank: "REC", name: "Lucas Oliveira",   nric: "*****826M", unitName: "SAR8", userRole: "Maintainer",   accountStatus: "Active" },
  { id: "3", userId: "250101-USR007", rank: "REC", name: "Amara Singh",      nric: "*****264U", unitName: "SAR7", userRole: "Maintainer",   accountStatus: "Active" },
  { id: "4", userId: "250101-USR006", rank: "REC", name: "Noah Kim",         nric: "*****518U", unitName: "SAR6", userRole: "Instructor",   accountStatus: "Active" },
  { id: "5", userId: "250101-USR005", rank: "REC", name: "Isabella Rossi",   nric: "*****295T", unitName: "SAR5", userRole: "Instructor",   accountStatus: "Active" },
  { id: "6", userId: "250101-USR004", rank: "REC", name: "Liam Johansson",   nric: "*****812G", unitName: "SAR4", userRole: "Operator",     accountStatus: "Active" },
  { id: "7", userId: "250101-USR003", rank: "REC", name: "Sofia Moretti",    nric: "*****232I", unitName: "SAR3", userRole: "Operator",     accountStatus: "Active" },
  { id: "8", userId: "250101-USR002", rank: "REC", name: "Ethan Murphy",     nric: "*****336A", unitName: "SAR2", userRole: "System Admin", accountStatus: "Active" },
  { id: "9", userId: "250101-USR001", rank: "REC", name: "Olivia Carter",    nric: "*****101B", unitName: "SAR1", userRole: "System Admin", accountStatus: "Active" },
];

// ── User Role ─────────────────────────────────────────────────────────────────
export interface UserRole {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdBy: string;
  createdByRole: string;
  createdOn: string;
}

export const userRoles: UserRole[] = [
  { id: "1", name: "System Admin", status: "Active", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:41 PM" },
  { id: "2", name: "Operator",     status: "Active", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:41 PM" },
  { id: "3", name: "Maintainer",   status: "Active", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:41 PM" },
  { id: "4", name: "Instructor",   status: "Active", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:41 PM" },
];

// ── Role Permission ────────────────────────────────────────────────────────────
export interface PermissionGroup {
  module: string;
  subModule: string;
  permissions: string[];
}

export const permissionGroups: PermissionGroup[] = [
  {
    module: "Activity Log",
    subModule: "Activity Log",
    permissions: ["Read All Activity Log"],
  },
  {
    module: "Antenna Location Listing",
    subModule: "Antenna Location Listing",
    permissions: [
      "Create Antenna Location Listing",
      "Delete Antenna Location Listing",
      "Delete Many Antenna Location Listing",
      "Read All Antenna Location Listing",
      "Update Antenna Location Listing",
    ],
  },
  {
    module: "Asset Category",
    subModule: "Asset Category",
    permissions: [
      "Check Exist Asset Category",
      "Create Asset Category",
      "Delete Asset Category",
      "Read All Asset Category",
      "Update Asset Category",
    ],
  },
  {
    module: "Asset Management",
    subModule: "Asset Management",
    permissions: [
      "Create Asset",
      "Delete Asset",
      "Read All Asset",
      "Update Asset",
    ],
  },
  {
    module: "Booking",
    subModule: "Booking",
    permissions: [
      "Create Booking",
      "Cancel Booking",
      "Read All Booking",
      "Update Booking",
    ],
  },
];

// Roles checked for System Admin (always checked + disabled)
export const systemAdminPerms: Record<string, boolean> = {};
// By default System Admin has all perms checked
permissionGroups.forEach((g) =>
  g.permissions.forEach((p) => {
    systemAdminPerms[`${g.module}::${p}`] = true;
  })
);

// Operator default perms
export const operatorDefaultPerms: Record<string, boolean> = {
  "Activity Log::Read All Activity Log": true,
  "Antenna Location Listing::Create Antenna Location Listing": true,
  "Antenna Location Listing::Delete Antenna Location Listing": true,
  "Antenna Location Listing::Delete Many Antenna Location Listing": true,
  "Antenna Location Listing::Read All Antenna Location Listing": true,
  "Antenna Location Listing::Update Antenna Location Listing": true,
  "Asset Category::Check Exist Asset Category": true,
  "Asset Category::Create Asset Category": true,
  "Asset Category::Read All Asset Category": true,
};

// ── Rank ──────────────────────────────────────────────────────────────────────
export interface Rank {
  id: string;
  sequence: number;
  rank: string;
  createdBy: string;
  createdByRole: string;
  createdOn: string;
}

export const ranks: Rank[] = [
  { id:  "1", sequence:  1, rank: "REC", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "2", sequence:  2, rank: "PFC", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "3", sequence:  3, rank: "LCP", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "4", sequence:  4, rank: "CPL", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "5", sequence:  5, rank: "CFC", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "6", sequence:  6, rank: "SCT", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "7", sequence:  7, rank: "3SG", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "8", sequence:  8, rank: "2SG", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id:  "9", sequence:  9, rank: "1SG", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "10", sequence: 10, rank: "SSG", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "11", sequence: 11, rank: "MSG", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "12", sequence: 12, rank: "3WO", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "13", sequence: 13, rank: "2WO", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "14", sequence: 14, rank: "1WO", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "15", sequence: 15, rank: "MWO", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "16", sequence: 16, rank: "SWO", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "17", sequence: 17, rank: "CWO", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "18", sequence: 18, rank: "2LT", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "19", sequence: 19, rank: "LTA", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "20", sequence: 20, rank: "CPT", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "21", sequence: 21, rank: "MAJ", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "22", sequence: 22, rank: "LTC", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "23", sequence: 23, rank: "SLTC", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "24", sequence: 24, rank: "COL", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "25", sequence: 25, rank: "BG",  createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "26", sequence: 26, rank: "MG",  createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "27", sequence: 27, rank: "LG",  createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
  { id: "28", sequence: 28, rank: "GEN", createdBy: "Admin", createdByRole: "System-Admin", createdOn: "21 Apr 2026\n01:17:42 PM" },
];
