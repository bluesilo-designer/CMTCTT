import { useState, useMemo } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { bookings } from "@/data/mock";
import type { BookingStatus } from "@/data/mock";
import {
  Search,
  List,
  Calendar,
  SlidersHorizontal,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabType =
  | "Overall"
  | "Upcoming"
  | "Ongoing"
  | "Return Assets"
  | "Completed"
  | "Cancelled"
  | "Overdue";

type CalendarMode = "Month" | "Weekly" | "Daily";

const tabs: TabType[] = [
  "Overall",
  "Upcoming",
  "Ongoing",
  "Return Assets",
  "Completed",
  "Cancelled",
  "Overdue",
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAY_ABBREVS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const PER_PAGE = 10;

const TODAY = new Date(2026, 3, 23); // April 23 2026

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function bookingDateKeys(dateStr: string): string[] {
  const MONTH_MAP: Record<string, number> = {
    Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12,
  };
  const ymMatch = dateStr.match(/([A-Za-z]{3})\s+(\d{4})/);
  if (!ymMatch) return [];
  const month = MONTH_MAP[ymMatch[1]];
  const year = parseInt(ymMatch[2]);
  const days = [...dateStr.matchAll(/\b(\d{1,2})\b/g)]
    .map((m) => parseInt(m[1]))
    .filter((d) => d >= 1 && d <= 31);
  return days.map(
    (d) => `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
  );
}

function extractTime(bookingTime: string): string {
  const m = bookingTime.match(
    /(\d{1,2}:\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/
  );
  return m ? `${m[1]} - ${m[2]}` : "";
}

function getCalendarWeeks(year: number, month: number): Date[][] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastDay = new Date(year, month, daysInMonth);
  const endDow = lastDay.getDay();
  const totalCells = startDow + daysInMonth + (6 - endDow);
  const numWeeks = Math.ceil(totalCells / 7);

  const weeks: Date[][] = [];
  const cur = new Date(year, month, 1 - startDow);
  for (let w = 0; w < numWeeks; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function CalendarEventCard({ booking }: { booking: (typeof bookings)[number] }) {
  const time = extractTime(booking.bookingTime);
  return (
    <div className="border-l-2 border-orange-400 bg-orange-50 rounded-sm px-1.5 py-0.5 mb-0.5 cursor-pointer hover:bg-orange-100 transition-colors">
      {time && (
        <div className="text-[10px] text-gray-500 leading-tight">{time}</div>
      )}
      <div className="text-[11px] text-gray-700 font-medium leading-tight truncate">
        {booking.program.replace("IMT Group Training for", "IMT Training for")}
      </div>
      <div className="text-[10px] text-gray-400 truncate">{booking.bookingId}</div>
    </div>
  );
}

export function BookingList({ onNavigate, createPath = "/bookings/create" }: { onNavigate?: (path: string) => void; createPath?: string }) {
  const [activeTab, setActiveTab] = useState<TabType>("Overall");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [calMode, setCalMode] = useState<CalendarMode>("Month");
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(3); // April
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // --- List view data ---
  const filtered = bookings.filter((b) => {
    const matchesTab =
      activeTab === "Overall" || b.status === (activeTab as BookingStatus);
    const matchesSearch =
      !searchQuery ||
      b.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // --- Calendar data ---
  const calWeeks = useMemo(
    () => getCalendarWeeks(calYear, calMonth),
    [calYear, calMonth]
  );

  // Pre-build a map: dateKey → bookings[]
  const bookingByDate = useMemo(() => {
    const map: Record<string, (typeof bookings)> = {};
    for (const b of bookings) {
      for (const k of bookingDateKeys(b.bookingDate)) {
        if (!map[k]) map[k] = [];
        map[k].push(b);
      }
    }
    return map;
  }, []);

  const navPrev = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  };
  const navNext = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  };
  const goToday = () => { setCalYear(2026); setCalMonth(3); };

  const todayKey = dateKey(TODAY);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Booking List"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Booking List</h1>
          <button
            onClick={() => onNavigate?.(createPath)}
            className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium"
          >
            Create Booking
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* ---- CALENDAR VIEW ---- */}
          {viewMode === "calendar" && (
            <>
              {/* Calendar controls bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 gap-3">
                {/* Left: Month/Weekly/Daily + Today */}
                <div className="flex items-center gap-3">
                  <div className="flex border border-gray-200 rounded-md overflow-hidden">
                    {(["Month","Weekly","Daily"] as CalendarMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setCalMode(m)}
                        className={cn(
                          "px-4 py-1.5 text-sm font-medium transition-colors",
                          calMode === m
                            ? "text-brand-primary border-b-2 border-brand-primary"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={goToday}
                    className="px-4 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 font-medium"
                  >
                    Today
                  </button>
                </div>

                {/* Center: Month navigator */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={navPrev}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={16} className="text-gray-600" />
                  </button>
                  <span className="text-sm font-semibold text-gray-800 min-w-[110px] text-center">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button
                    onClick={navNext}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={16} className="text-gray-600" />
                  </button>
                </div>

                {/* Right: List/Calendar toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <List size={15} />
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium bg-brand-primary text-white border border-brand-primary"
                  >
                    <Calendar size={15} />
                    Calendar View
                  </button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="overflow-x-auto">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b border-gray-200">
                  {DAY_ABBREVS.map((d) => (
                    <div
                      key={d}
                      className="py-2 text-center text-xs font-semibold text-gray-500 border-r border-gray-100 last:border-r-0"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Weeks */}
                {calWeeks.map((week, wi) => (
                  <div
                    key={wi}
                    className="grid grid-cols-7 border-b border-gray-100 last:border-b-0"
                    style={{ minHeight: "120px" }}
                  >
                    {week.map((day, di) => {
                      const key = dateKey(day);
                      const isCurrentMonth = day.getMonth() === calMonth;
                      const isToday = key === todayKey;
                      const dayBookings = bookingByDate[key] || [];

                      return (
                        <div
                          key={di}
                          className={cn(
                            "border-r border-gray-100 last:border-r-0 p-1.5 align-top",
                            !isCurrentMonth && "bg-gray-50",
                            isToday && "bg-blue-50/30"
                          )}
                        >
                          {/* Date number */}
                          <div className="flex justify-end mb-1">
                            <span
                              className={cn(
                                "w-6 h-6 flex items-center justify-center text-xs font-medium rounded-full",
                                isToday
                                  ? "bg-blue-500 text-white"
                                  : isCurrentMonth
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              )}
                            >
                              {day.getDate()}
                            </span>
                          </div>

                          {/* Events */}
                          {dayBookings.slice(0, 2).map((b) => (
                            <CalendarEventCard key={b.id} booking={b} />
                          ))}
                          {dayBookings.length > 2 && (
                            <div className="text-[10px] text-brand-primary font-medium px-1">
                              +{dayBookings.length - 2} more
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ---- LIST VIEW ---- */}
          {viewMode === "list" && (
            <>
              {/* Tabs + View Toggle */}
              <div className="flex items-center justify-between px-5 border-b border-gray-200">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={cn(
                        "px-4 py-3.5 text-sm font-medium transition-colors relative",
                        activeTab === tab
                          ? "text-brand-primary"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium bg-brand-primary text-white border border-brand-primary"
                  >
                    <List size={15} />
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode("calendar")}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md font-medium border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar size={15} />
                    Calendar View
                  </button>
                </div>
              </div>

              {/* Filters row */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">
                  {activeTab} Booking List ({filtered.length})
                </h2>
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

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-red-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-10">No</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[260px]">Booking ID</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[100px]">
                        <div className="flex items-center gap-1">
                          Training Type <Search size={12} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[220px]">
                        <div className="flex items-center gap-1">
                          Booking Time <ArrowUpDown size={12} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[110px]">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">Training Mode</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[200px]">Courseware</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[140px]">
                        <div className="flex items-center gap-1">
                          Assignment ID <Search size={12} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">
                        <div className="flex items-center gap-1">
                          Unit Name <Search size={12} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[100px]">
                        <div className="flex items-center gap-1">
                          Weapon <Search size={12} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((booking, idx) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-sm text-gray-700">
                          {(currentPage - 1) * PER_PAGE + idx + 1}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          <div className="font-medium text-gray-800">{booking.program}</div>
                          <div className="text-xs text-gray-400 mt-0.5">Booking ID - {booking.bookingId}</div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{booking.trainingType}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700 whitespace-pre-line">{booking.bookingTime}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{booking.trainingMode}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700 max-w-[180px]">{booking.courseware}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">
                          {booking.assignmentId === "-" ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            booking.assignmentId
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{booking.unitName}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">{booking.weapon}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => onNavigate?.("/bookings/detail")} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                total={totalPages || 1}
                perPage={PER_PAGE}
                totalItems={filtered.length}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
