import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { assets } from "@/data/systemHardware";
import type { AssetStatus } from "@/data/systemHardware";
import { Search, Trash2, Eye, MoreVertical, ArrowUpDown, Filter, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

const TABS = ["Overall", "Issued", "Maintenance", "Overdue", "Pending Return", "Not Returned", "Missing", "No RFI"] as const;
type Tab = (typeof TABS)[number];

const TAB_STATUS_MAP: Partial<Record<Tab, AssetStatus>> = {
  Issued: "Issued",
  Maintenance: "Maintenance",
  Overdue: "Overdue",
  "Pending Return": "Pending Return",
  "Not Returned": "Not Returned",
  Missing: "Missing",
};

function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const styles: Record<AssetStatus, string> = {
    Available:       "bg-green-50 text-green-600 border-green-200",
    Issued:          "bg-purple-50 text-purple-600 border-purple-200",
    "Pending Return":"bg-orange-50 text-orange-500 border-orange-200",
    "Not Returned":  "bg-red-50 text-red-500 border-red-200",
    Missing:         "bg-gray-100 text-gray-600 border-gray-200",
    Maintenance:     "bg-yellow-50 text-yellow-600 border-yellow-200",
    Overdue:         "bg-red-100 text-red-700 border-red-300",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5", styles[status])}>
      {status}
    </span>
  );
}

export function AssetsList() {
  const [activeTab, setActiveTab] = useState<Tab>("Overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tabFiltered = activeTab === "Overall" || activeTab === "No RFI"
    ? assets
    : assets.filter((a) => a.status === TAB_STATUS_MAP[activeTab]);

  const filtered = tabFiltered.filter(
    (a) => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["System Hardware Management", "Assets List"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Asset List</h1>
          <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
            Add Asset
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-200 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={cn(
                  "px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors rounded",
                  activeTab === tab
                    ? "border border-brand-primary text-brand-primary"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
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
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
                <Calendar size={14} />
                Select Date
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
                <Filter size={14} />
                Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-12">No</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[180px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Asset
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Asset Serial Number
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[140px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Asset Type
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[140px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Asset Category
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[130px]">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">Issued Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((asset, idx) => (
                  <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {(currentPage - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{asset.name}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{asset.serialNumber}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{asset.assetType}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{asset.assetCategory}</td>
                    <td className="px-4 py-3.5">
                      <AssetStatusBadge status={asset.status} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{asset.issuedDate}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
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
