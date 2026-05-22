import type { Lane, BaseStation } from "@/pages-tsx/site-management/types";
export type {
  LaneStatus,
  StationStatus,
  Lane,
  BlackoutDate,
  BaseStation,
} from "@/pages-tsx/site-management/types";

function makeLanes(count: number, inactiveIdx: number[] = []): Lane[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Lane ${i + 1}`,
    status: inactiveIdx.includes(i + 1) ? "Inactive" : "Active",
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  }));
}

export const baseStations: BaseStation[] = [
  {
    id: "1",
    name: "Base By Daniel",
    status: "Active",
    lanes: [],
    blackoutDates: [
      { label: "26 Apr 2026" },
      { label: "29 Apr 2026" },
      { label: "Mon, Tue, Wed, Thu, Fri, Sat, Sun (30 Apr - 1 May 2026)" },
    ],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "2",
    name: "Base By Daniel 2",
    status: "Active",
    lanes: [],
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "3",
    name: "IMT-01",
    status: "Active",
    lanes: makeLanes(10),
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "4",
    name: "IMT-02",
    status: "Active",
    lanes: makeLanes(10, [10]),
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "5",
    name: "IMT-03",
    status: "Active",
    lanes: makeLanes(10, [10]),
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "6",
    name: "IMT-04",
    status: "Active",
    lanes: makeLanes(10),
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "7",
    name: "IMT-05",
    status: "Active",
    lanes: makeLanes(10),
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
  {
    id: "8",
    name: "IMT-06",
    status: "Active",
    lanes: makeLanes(10),
    blackoutDates: [],
    lastUpdatedOn: "21 Apr 2026\n01:17:41 PM",
  },
];
