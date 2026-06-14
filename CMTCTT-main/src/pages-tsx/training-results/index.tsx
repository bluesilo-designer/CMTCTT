import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, SlidersHorizontal, Calendar, Eye, ArrowUpDown } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { TableCustom } from "@/components/table";
import { InputCustom } from "@/components/input";
import { trainingResults } from "@/data/mock";
import type { TrainingResult, TrainingPlatform } from "@/data/mock";
import { cn } from "@/lib/utils";

import type { FilterState } from "./types";
import { PER_PAGE } from "./constants";
import { FilterPanel } from "./components/FilterPanel";

// ── Main page ─────────────────────────────────────────────────────────────────

const PLATFORM_TABS: TrainingPlatform[] = ["SWT", "CMT", "CMT CTT"];

export function TrainingResults({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [activePlatform, setActivePlatform] = useState<TrainingPlatform>("SWT");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterOpen, setFilterOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<FilterState>({});
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({});

  const handleFilterChange = (key: string, value: string) => {
    setPendingFilters((prev) => {
      const current = prev[key] ?? [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleApply = () => {
    setAppliedFilters(pendingFilters);
    setFilterOpen(false);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setPendingFilters({});
    setAppliedFilters({});
    setCurrentPage(1);
  };

  const openFilter = () => {
    setPendingFilters(appliedFilters);
    setFilterOpen(true);
  };

  const activeFilterCount = Object.values(appliedFilters).flat().length;

  const platformCounts = useMemo(() =>
    PLATFORM_TABS.reduce((acc, p) => {
      acc[p] = trainingResults.filter(r => r.platform === p).length;
      return acc;
    }, {} as Record<TrainingPlatform, number>),
  []);

  const filtered = useMemo(() => {
    let result = trainingResults.filter((r) => {
      if (r.platform !== activePlatform) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!r.program.toLowerCase().includes(q) && !r.bookingId.toLowerCase().includes(q))
          return false;
      }
      return true;
    });

    result = [...result].sort((a, b) =>
      sortDir === "desc"
        ? b.bookingDate.localeCompare(a.bookingDate)
        : a.bookingDate.localeCompare(b.bookingDate)
    );

    return result;
  }, [searchQuery, sortDir, appliedFilters, activePlatform]);

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // ── TanStack columns ──────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<TrainingResult, any>[]>(
    () => [
      {
        id: "no",
        width: 60,
        minWidth: 60,
        maxWidth: 60,
        header: () => "No",
        cell: (info: any) => (
          <div
            className="text-xs text-gray-400 font-medium cursor-pointer"
            onClick={() => onNavigate?.("/training-results/detail")}
          >
            {(currentPage - 1) * PER_PAGE + info.row.index + 1}
          </div>
        ),
      },
      {
        accessorKey: "program",
        header: () => "Program",
        cell: (info: any) => (
          <div
            className="cursor-pointer"
            onClick={() => onNavigate?.("/training-results/detail")}
          >
            <div className="font-semibold text-sm text-gray-800 hover:text-brand-primary transition-colors">
              {info.getValue()}
            </div>
            <div className="text-xs text-gray-400 font-mono mt-0.5">
              {info.row.original.bookingId}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "trainingType",
        header: () => "Type",
        cell: (info: any) => (
          <div
            className="cursor-pointer"
            onClick={() => onNavigate?.("/training-results/detail")}
          >
            <span
              className={cn(
                "px-2 py-0.5 rounded-md text-xs font-semibold",
                info.getValue() === "Group"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              )}
            >
              {info.getValue()}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "bookingDate",
        header: () => (
          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="flex items-center gap-1 hover:text-brand-primary-hover transition-colors"
          >
            Booking Date
            <ArrowUpDown size={11} className="text-gray-400" />
          </button>
        ),
        cell: (info: any) => (
          <div
            className="text-sm text-gray-600 whitespace-pre-line leading-snug cursor-pointer"
            onClick={() => onNavigate?.("/training-results/detail")}
          >
            {info.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "trainingMode",
        header: () => "Mode",
        cell: (info: any) => (
          <div
            className="text-sm text-gray-600 cursor-pointer"
            onClick={() => onNavigate?.("/training-results/detail")}
          >
            {info.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "atmsFileId",
        header: () => "ATMS File ID",
        cell: (info: any) => (
          <div
            className="text-sm text-gray-600 font-mono cursor-pointer"
            onClick={() => onNavigate?.("/training-results/detail")}
          >
            {info.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: () => null,
        cell: () => (
          <div className="text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.("/training-results/detail");
              }}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-brand-primary transition-all"
              title="View Results"
            >
              <Eye size={15} />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, sortDir, onNavigate],
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">

        {/* Platform tabs */}
        <div className="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1 mb-5 self-start w-fit">
          {PLATFORM_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActivePlatform(tab); setCurrentPage(1); setSearchQuery(""); }}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                activePlatform === tab
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
              <span className={cn(
                "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold",
                activePlatform === tab
                  ? "bg-brand-primary text-white"
                  : "bg-gray-200 text-gray-500"
              )}>
                {platformCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">
            {activePlatform} Results ({filtered.length} records)
          </span>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
              />
              <InputCustom
                type="text"
                placeholder="Search program or booking ID…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-56 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
              />
            </div>

            {/* Date button (icon-only toggle — raw button per IMT rule 3) */}
            <button
              title="Date"
              className="flex items-center justify-center w-8 h-8 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Calendar size={14} />
            </button>

            {/* Filters button (icon-only toggle — raw button per IMT rule 3) */}
            <button
              onClick={openFilter}
              title="Filters"
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors",
                activeFilterCount > 0
                  ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <TableCustom
            columns={columns}
            data={paginated}
            autoScrollTable={false}
            classThead="bg-red-50/70"
            classTheadTh="bg-red-50/70 text-brand-primary font-bold text-xs py-3 px-5"
            classTBodyTd="px-5 py-3.5"
          />

          <Pagination
            currentPage={currentPage}
            itemsPerPage={PER_PAGE}
            totalItems={filtered.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* Filter drawer */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={pendingFilters}
        onChange={handleFilterChange}
        onApply={handleApply}
        onClear={handleClear}
      />
    </div>
  );
}
