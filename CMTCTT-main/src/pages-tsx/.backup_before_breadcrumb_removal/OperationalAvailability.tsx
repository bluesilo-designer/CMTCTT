import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { Search, ChevronDown, Calendar, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

interface OARecord {
  id: string;
  no: number;
  month: string;
  operationTime: string;
  downTime: string;
  availability: string;
}

const oaData: OARecord[] = [
  { id: "oa1", no: 1, month: "April 2026",   operationTime: "930m 13s",  downTime: "140m 36s", availability: "86.87%" },
  { id: "oa2", no: 2, month: "March 2026",   operationTime: "1440m 00s", downTime: "72m 15s",  availability: "95.00%" },
  { id: "oa3", no: 3, month: "February 2026",operationTime: "1300m 45s", downTime: "195m 10s", availability: "85.00%" },
  { id: "oa4", no: 4, month: "January 2026", operationTime: "1480m 00s", downTime: "44m 24s",  availability: "97.00%" },
];

export function OperationalAvailability() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = oaData.filter(
    (r) => !searchQuery || r.month.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Operational Availability"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Operational Availability</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
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
            <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
              <Calendar size={14} />
              Select Date
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-12">No</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Month
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[240px]">
                    Total Activity Operation Time (OT)
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[220px]">
                    Total Activity Down Time (DT)
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[200px]">
                    Operational Availability (AO)
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((record) => (
                  <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-700">{record.no}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{record.month}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{record.operationTime}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{record.downTime}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-medium">{record.availability}</td>
                    <td className="px-4 py-3.5">
                      <button className={cn(
                        "flex items-center gap-1 text-sm border border-gray-200 rounded px-2 py-1 hover:bg-gray-50"
                      )}>
                        <ChevronDown size={13} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
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
