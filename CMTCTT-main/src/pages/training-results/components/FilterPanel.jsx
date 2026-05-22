import { useState } from "react";
import { X, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { FILTER_SECTIONS } from "../constants";
export function FilterPanel({ open, onClose, filters, onChange, onApply, onClear, }) {
    const [collapsed, setCollapsed] = useState({});
    const totalSelected = Object.values(filters).flat().length;
    const toggle = (key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));
    return (<>
      {/* Backdrop */}
      <div className={cn("fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} onClick={onClose}/>

      {/* Drawer panel */}
      <div className={cn("fixed top-0 right-0 h-full z-50 w-[340px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out", open ? "translate-x-0" : "translate-x-full")}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-gray-800">Filters</span>
            {totalSelected > 0 && (<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand-primary text-white text-[10px] font-bold">
                {totalSelected}
              </span>)}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={16}/>
          </button>
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto py-2">
          {FILTER_SECTIONS.map((section) => {
            const isCollapsed = collapsed[section.key];
            const selected = filters[section.key] ?? [];
            return (<div key={section.key} className="border-b border-gray-50 last:border-b-0">
                <button onClick={() => toggle(section.key)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{section.label}</span>
                    {selected.length > 0 && (<span className="px-1.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold">
                        {selected.length}
                      </span>)}
                  </div>
                  {isCollapsed ? (<ChevronDown size={14} className="text-gray-400"/>) : (<ChevronUp size={14} className="text-gray-400"/>)}
                </button>

                {!isCollapsed && (<div className="px-5 pb-4 space-y-1">
                    {section.options.map((opt) => {
                        const isChecked = selected.includes(opt);
                        return (<label key={opt} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                          <div onClick={() => onChange(section.key, opt)} className={cn("w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors", isChecked
                                ? "bg-brand-primary border-brand-primary"
                                : "border-gray-300 group-hover:border-brand-primary")}>
                            {isChecked && <Check size={10} className="text-white" strokeWidth={3}/>}
                          </div>
                          <span className={cn("text-sm transition-colors", isChecked ? "text-gray-800 font-medium" : "text-gray-600")}>
                            {opt}
                          </span>
                        </label>);
                    })}
                  </div>)}
              </div>);
        })}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={onClear} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Clear all
          </button>
          <button onClick={onApply} className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary-hover transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </>);
}
