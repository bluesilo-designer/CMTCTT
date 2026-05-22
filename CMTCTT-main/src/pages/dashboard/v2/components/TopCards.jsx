import { cn } from "@/lib/utils";
export function TopCards() {
    return (<div className="grid grid-cols-2 gap-4 mb-4">
      {/* Today's Bookings */}
      <div className="bg-white rounded-xl border border-red-50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Bookings</span>
          <span className="text-xs font-semibold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">83% done</span>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-3">
          {[
            { label: "Total", value: 24, color: "text-gray-700" },
            { label: "Done", value: 20, color: "text-emerald-500" },
            { label: "Ongoing", value: 8, color: "text-amber-500" },
            { label: "Awaiting", value: 4, color: "text-red-400" },
        ].map(({ label, value, color }) => (<div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className={cn("text-3xl font-bold", color)}>{value}</p>
            </div>))}
        </div>
        <div className="h-1 rounded-full bg-gray-100 overflow-hidden flex gap-0.5">
          <div className="bg-emerald-300 rounded-full" style={{ width: "83%" }}/>
          <div className="bg-amber-200 rounded-full" style={{ width: "10%" }}/>
          <div className="bg-red-200 rounded-full" style={{ width: "7%" }}/>
        </div>
      </div>

      {/* Asset Overview */}
      <div className="bg-white rounded-xl border border-red-50 p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Asset Overview</span>
          <span className="text-xs font-semibold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">83% returned</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-3">
          {[
            { label: "Total Issued", value: 24, color: "text-gray-700" },
            { label: "Returned", value: 20, color: "text-emerald-500" },
            { label: "Pending Return", value: 8, color: "text-amber-500" },
        ].map(({ label, value, color }) => (<div key={label}>
              <p className="text-xs text-gray-400 mb-0.5">{label}</p>
              <p className={cn("text-3xl font-bold", color)}>{value}</p>
            </div>))}
        </div>
        <div className="h-1 rounded-full bg-gray-100 overflow-hidden flex gap-0.5">
          <div className="bg-emerald-300 rounded-full" style={{ width: "83%" }}/>
          <div className="bg-amber-200 rounded-full" style={{ width: "17%" }}/>
        </div>
      </div>
    </div>);
}
