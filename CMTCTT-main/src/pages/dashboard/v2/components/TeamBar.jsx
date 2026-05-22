import { Settings, Monitor, BookOpen, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
const roles = [
    { label: "ADMIN", count: 3, color: "text-red-500", Icon: Settings, bg: "bg-red-50/60 border-red-100" },
    { label: "OPERATOR", count: 3, color: "text-orange-500", Icon: Monitor, bg: "bg-orange-50/60 border-orange-100" },
    { label: "INSTRUCTOR", count: 3, color: "text-pink-500", Icon: BookOpen, bg: "bg-pink-50/60 border-pink-100" },
    { label: "MAINTAINER", count: 3, color: "text-amber-600", Icon: Wrench, bg: "bg-amber-50/60 border-amber-100" },
];
export function TeamBar() {
    return (<div className="bg-white rounded-xl border border-slate-100 px-5 py-3 mb-4 flex items-center gap-4">
      <div className="flex items-center gap-2 mr-2">
        <span className="text-xs font-semibold text-slate-400">TEAM</span>
        <span className="text-sm font-bold text-slate-700">12</span>
      </div>
      <div className="flex-1 grid grid-cols-4 gap-3">
        {roles.map(({ label, count, color, Icon, bg }) => (<div key={label} className={cn("flex items-center justify-between px-4 py-2 rounded-lg border", bg)}>
            <div className="flex items-center gap-2">
              <Icon size={13} className={color}/>
              <span className={cn("text-xs font-bold", color)}>{label}</span>
            </div>
            <span className={cn("text-sm font-bold", color)}>{count}</span>
          </div>))}
      </div>
    </div>);
}
