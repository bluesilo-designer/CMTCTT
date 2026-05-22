import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { assignments } from "@/data/systemHardware";
import type { AssignmentStatus } from "@/data/systemHardware";
import { Search, ChevronDown, MoreVertical, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

const TABS = ["Overall", "Issued", "Pending Return", "Returned", "Not Returned", "Missing"] as const;
type Tab = (typeof TABS)[number];

const TAB_STATUS_MAP: Partial<Record<Tab, AssignmentStatus>> = {
  Issued: "Issued",
  "Pending Return": "Pending Return",
  Returned: "Returned",
  "Not Returned": "Not Returned",
  Missing: "Missing",
};

function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  const styles: Record<AssignmentStatus, string> = {
    Issued:          "bg-purple-50 text-purple-600 border-purple-200",
    Returned:        "bg-green-50 text-green-600 border-green-200",
    "Pending Return":"bg-orange-50 text-orange-500 border-orange-200",
    "Not Returned":  "bg-red-50 text-red-500 border-red-200",
    Missing:         "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5", styles[status])}>
      {status}
    </span>
  );
}

export function AssignmentList() {
  const [activeTab, setActiveTab] = useState<Tab>("Overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const tabFiltered = activeTab === "Overall"
    ? assignments
    : assignments.filter((a) => a.status === TAB_STATUS_MAP[activeTab]);

  const filtered = tabFiltered.filter(
    (a) => !searchQuery || a.assignmentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["System Hardware Management", "Assignment List"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Assignment List</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium">
              Ready for Return Assets
            </button>
            <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
              Issue Assets
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                  activeTab === tab
                    ? "text-brand-primary border-brand-primary"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center px-5 py-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-12">No</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Assignment ID
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[140px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Assignment Type
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">Booking(s)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[130px]">Assignment Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[150px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Base Station(s)
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[100px]">Asset Qty</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((asgn, idx) => (
                  <>
                    <tr key={asgn.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-sm text-gray-700">
                        {(currentPage - 1) * PER_PAGE + idx + 1}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{asgn.assignmentId}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{asgn.assignmentType}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">
                        {asgn.bookings.join(", ")}
                      </td>
                      <td className="px-4 py-3.5">
                        <AssignmentStatusBadge status={asgn.status} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">
                        {asgn.baseStations.join(", ")}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-700">{asgn.assetQty}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleExpand(asgn.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <ChevronDown
                              size={16}
                              className={cn("transition-transform", expanded.has(asgn.id) && "rotate-180")}
                            />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded.has(asgn.id) && (
                      <tr key={`${asgn.id}-detail`} className="bg-gray-50 border-b border-gray-100">
                        <td colSpan={8} className="px-8 py-3">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Bookings:</span>{" "}
                            {asgn.bookings.map((b) => (
                              <span key={b} className="inline-block bg-blue-50 text-blue-600 border border-blue-100 rounded px-2 py-0.5 text-xs mr-1">
                                {b}
                              </span>
                            ))}
                            <span className="ml-4 font-medium">Base Stations:</span>{" "}
                            {asgn.baseStations.map((bs) => (
                              <span key={bs} className="inline-block bg-gray-100 text-gray-700 rounded px-2 py-0.5 text-xs mr-1">
                                {bs}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            current={currentPage}
            total={totalPages}
            perPage={PER_PAGE}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
