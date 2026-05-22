import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type DateRange = "Last month" | "Last 3 months" | "Last 6 months" | "Custom date range";

const DATE_RANGES: DateRange[] = ["Last month", "Last 3 months", "Last 6 months", "Custom date range"];

const DATA_TYPES = [
  "User data",       "Training result", "Trainee data",
  "Leaderboard data","SHM data",        "Operation data",
  "HUMS data",       "Booking data",    "Select all",
];

const EXPORT_FORMATS = ["CSV", "Excel", "JSON"];

export function DataExport() {
  const [dateRange, setDateRange] = useState<DateRange>("Last month");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState("");
  const [filename, setFilename] = useState("2026-04-22-csv-data-export");
  const [formatOpen, setFormatOpen] = useState(false);

  const toggleType = (type: string) => {
    if (type === "Select all") {
      if (selectedTypes.size === DATA_TYPES.length - 1) {
        setSelectedTypes(new Set());
      } else {
        setSelectedTypes(new Set(DATA_TYPES.filter((t) => t !== "Select all")));
      }
      return;
    }
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const isAllSelected = selectedTypes.size === DATA_TYPES.length - 1;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Data Management", "Data Export"]} />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
          <h1 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-100">Data Export</h1>

          {/* Date Range */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Select Date Range <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-6">
              {DATE_RANGES.map((range) => (
                <label key={range} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                  <input
                    type="radio"
                    name="dateRange"
                    checked={dateRange === range}
                    onChange={() => setDateRange(range)}
                    className="accent-brand-primary"
                  />
                  {range}
                </label>
              ))}
            </div>
          </div>

          {/* Data Type */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">Select Data Type</p>
            <div className="grid grid-cols-3 gap-x-6 gap-y-3">
              {DATA_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={type === "Select all" ? isAllSelected : selectedTypes.has(type)}
                    onChange={() => toggleType(type)}
                    className="rounded border-gray-300 accent-brand-primary"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">Select Export Format</p>
            <div className="relative w-64">
              <button
                onClick={() => setFormatOpen((v) => !v)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500 bg-white hover:border-gray-400"
              >
                <span className={format ? "text-gray-800" : "text-gray-400"}>
                  {format || "Select export format"}
                </span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {formatOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  {EXPORT_FORMATS.map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFormat(f); setFormatOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Export As */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-800 mb-3">Export As</p>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>

          {/* Export Button */}
          <button className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold py-3 rounded-md transition-colors">
            Export
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
