import type { Cluster, ClusterStatus } from "@/pages-tsx/cluster-management/types";

const UPDATED = "10 January 2025\n08:00:00 AM";

const STATUS_MAP: Record<string, ClusterStatus> = {
  "cluster-01": "Available",
  "cluster-02": "Unavailable",
  "cluster-03": "Available",
  "cluster-04": "Degraded",
  "cluster-05": "Available",
  "cluster-06": "Available",
  "cluster-07": "Degraded",
  "cluster-08": "Available",
  "cluster-09": "Unavailable",
  "cluster-10": "Available",
  "cluster-11": "Degraded",
  "cluster-12": "Available",
};

function statusFor(id: string): ClusterStatus {
  return STATUS_MAP[id] ?? "Available";
}

export const clusters: Cluster[] = [
  {
    id: "cluster-01",
    name: "CTT-CLUSTER-01",
    status: statusFor("cluster-01"),
    blackoutDates: [
      { label: "8 Jan 2025" },
      { label: "9 Feb 2025" },
      { label: "10 Feb 2025" },
      { label: "11 Mar 2025" },
    ],
    updatedOn: UPDATED,
  },
  {
    id: "cluster-02",
    name: "CTT-CLUSTER-02",
    status: statusFor("cluster-02"),
    blackoutDates: [{ label: "8 Jan 2025" }],
    updatedOn: UPDATED,
  },
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 3;
    const id = `cluster-${String(num).padStart(2, "0")}`;
    return {
      id,
      name: `CTT-CLUSTER-${String(num).padStart(2, "0")}`,
      status: statusFor(id),
      blackoutDates: [],
      updatedOn: UPDATED,
    };
  }),
];
