import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Search, Upload, ArrowUpDown, Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";

type Tab = "Booking Details" | "Leaderboard";

const PER_PAGE = 10;

export function DataImport() {
  const [activeTab, setActiveTab] = useState<Tab>("Booking Details");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Data Management", "Data Import"]} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-5">Data Import</h1>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(["Booking Details", "Leaderboard"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
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
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-700">{activeTab}</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search file name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500">
                <Upload size={15} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[300px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      File Name
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[200px]">Upload By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[180px]">
                    <div className="flex items-center gap-1">
                      Upload Date
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Database size={22} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-600">No data to show right now!</p>
                      <p className="text-xs text-gray-400 text-center max-w-xs">
                        This table will be automatically updated once users take action in the IMT system.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Pagination
            current={1}
            total={1}
            perPage={PER_PAGE}
            totalItems={0}
            onPageChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
