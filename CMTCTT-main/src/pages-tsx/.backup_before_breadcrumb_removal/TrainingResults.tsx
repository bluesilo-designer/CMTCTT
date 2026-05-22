import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { trainingResults } from "@/data/mock";
import { Search, SlidersHorizontal, Eye, ArrowUpDown } from "lucide-react";

const PER_PAGE = 10;

export function TrainingResults({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = trainingResults.filter(
    (r) =>
      !searchQuery ||
      r.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Training Results"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Training Results</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 font-medium">
              Select Date
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 font-medium">
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-12">
                    No
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    Program
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <div className="flex items-center gap-1">
                      Training Type
                      <Search size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    <div className="flex items-center gap-1">
                      Booking Date
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    Training Mode
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    ATMS File ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((result, idx) => (
                  <tr
                    key={result.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {(currentPage - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-5 py-3.5 text-sm">
                      <div className="font-medium text-gray-800">{result.program}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Booking ID - {result.bookingId}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{result.trainingType}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-pre-line">
                      {result.bookingDate}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{result.trainingMode}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{result.atmsFileId}</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => onNavigate?.("/training-results/detail")} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye size={16} />
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
