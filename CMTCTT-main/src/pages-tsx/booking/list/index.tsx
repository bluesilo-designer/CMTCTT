import { useState, useMemo } from "react";
import { bookings } from "@/data/mock";
import type { BookingStatus } from "@/data/mock";
import { Button } from "@/components/button";
import { PER_PAGE } from "./constants";
import type { BookingListProps, TabType } from "./types";
import { CalendarView } from "./components/CalendarView";
import { ListView } from "./components/ListView";

export function BookingList({ onNavigate, createPath = "/bookings/create" }: BookingListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Overall");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { Overall: bookings.length };
    for (const b of bookings) {
      counts[b.status] = (counts[b.status] ?? 0) + 1;
    }
    return counts;
  }, []);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let result = bookings.filter((b) => {
      const matchesTab = activeTab === "Overall" || b.status === (activeTab as BookingStatus);
      const matchesSearch =
        !searchQuery ||
        b.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.unitName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
    result = [...result].sort((a, b) => {
      const da = a.bookingDate;
      const db = b.bookingDate;
      return sortDir === "asc" ? da.localeCompare(db) : db.localeCompare(da);
    });
    return result;
  }, [activeTab, searchQuery, sortDir]);

  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleToggleSort = () => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 space-y-4">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-brand-primary">Booking List</h1>
          <Button
            onClick={() => onNavigate?.(createPath)}
            className="px-4 py-2 w-fit text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover font-semibold shadow-sm transition-colors"
          >
            + Create Booking
          </Button>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {viewMode === "calendar" ? (
            <CalendarView onSetViewMode={setViewMode} />
          ) : (
            <ListView
              activeTab={activeTab}
              tabCounts={tabCounts}
              filtered={filtered}
              paginated={paginated}
              currentPage={currentPage}
              searchQuery={searchQuery}
              sortDir={sortDir}
              onTabChange={handleTabChange}
              onSearchChange={handleSearchChange}
              onPageChange={setCurrentPage}
              onToggleSort={handleToggleSort}
              onSetViewMode={setViewMode}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
