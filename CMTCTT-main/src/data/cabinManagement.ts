import type { Cabin, CabinStatus } from "@/pages-tsx/cabin-management/types";

const UPDATED = "10 January 2025\n08:00:00 AM";

// Spread statuses: Available (majority), a few Degraded, a few Unavailable
const STATUS_MAP: Record<string, CabinStatus> = {
  "cabin-01": "Available",
  "cabin-02": "Unavailable",
  "cabin-03": "Available",
  "cabin-04": "Degraded",
  "cabin-05": "Available",
  "cabin-06": "Available",
  "cabin-07": "Degraded",
  "cabin-08": "Available",
  "cabin-09": "Unavailable",
  "cabin-10": "Available",
  "cabin-11": "Degraded",
};

function statusFor(id: string): CabinStatus {
  return STATUS_MAP[id] ?? "Available";
}

export const cabins: Cabin[] = [
  {
    id: "cabin-01",
    name: "CTT-CLUSTER-01",
    status: statusFor("cabin-01"),
    blackoutDates: [
      { label: "8 Jan 2025" },
      { label: "9 Feb 2025" },
      { label: "10 Feb 2025" },
      { label: "11 Mar 2025" },
      { label: "12 Apr 2025" },
      { label: "13 May 2025" },
      { label: "14 Jun 2025" },
      { label: "15 Jul 2025" },
      { label: "16 Aug 2025" },
      { label: "17 Sep 2025" },
    ],
    updatedOn: UPDATED,
  },
  {
    id: "cabin-02",
    name: "CTT-CLUSTER-02",
    status: statusFor("cabin-02"),
    blackoutDates: [{ label: "8 Jan 2025" }],
    updatedOn: UPDATED,
  },
  ...Array.from({ length: 5 }, (_, i) => {
    const id = `cabin-0${i + 3}`;
    return {
      id,
      name: `CTT-CLUSTER-0${i + 3}`,
      status: statusFor(id),
      blackoutDates: [],
      updatedOn: UPDATED,
    };
  }),
  {
    id: "cabin-08",
    name: "CTT-CLUSTER-08",
    status: statusFor("cabin-08"),
    blackoutDates: [{ label: "8 Jan 2025" }],
    updatedOn: UPDATED,
  },
  ...Array.from({ length: 3 }, (_, i) => {
    const id = `cabin-0${i + 9}`;
    return {
      id,
      name: `CTT-CLUSTER-0${i + 9}`,
      status: statusFor(id),
      blackoutDates: [],
      updatedOn: UPDATED,
    };
  }),
  ...Array.from({ length: 33 }, (_, i) => {
    const id = `cabin-${i + 12}`;
    return {
      id,
      name: `CTT-CLUSTER-${String(i + 12).padStart(2, "0")}`,
      status: statusFor(id),
      blackoutDates: [],
      updatedOn: UPDATED,
    };
  }),
];
