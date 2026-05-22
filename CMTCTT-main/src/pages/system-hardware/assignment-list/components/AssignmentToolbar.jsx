import { Search, Calendar } from "lucide-react";
import { InputCustom } from "@/components/input";
import { cn } from "@/lib/utils";
import { TABS, TAB_STATUS_MAP } from "../types";
export function AssignmentToolbar({ activeTab, onTabChange, searchQuery, onSearchChange, allAssignments, }) {
    const tabCounts = TABS.reduce((acc, tab) => {
        acc[tab] =
            tab === "Overall"
                ? allAssignments.length
                : allAssignments.filter((a) => a.status === TAB_STATUS_MAP[tab]).length;
        return acc;
    }, {});
    return (<div className="flex items-center justify-between border-b border-gray-100 px-5">
      {/* Tab buttons */}
      <div className="flex overflow-x-auto">
        {TABS.map((tab) => {
            const count = tabCounts[tab] ?? 0;
            return (<button key={tab} onClick={() => onTabChange(tab)} className={cn("flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative", activeTab === tab ? "text-brand-primary" : "text-gray-500 hover:text-gray-700")}>
              {tab}
              {count > 0 && (<span className={cn("inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold", activeTab === tab ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500")}>
                  {count}
                </span>)}
              {activeTab === tab && (<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full"/>)}
            </button>);
        })}
      </div>

      {/* Search + Date filter */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <InputCustom type="text" placeholder="Search" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-48 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"/>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 whitespace-nowrap">
          <Calendar size={14} className="text-gray-400"/>
          Select Date
        </button>
      </div>
    </div>);
}
