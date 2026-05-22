import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { baseStations } from "@/data/mock";
import type { BookingStatus } from "@/data/mock";
import { ChevronDown, ChevronUp, BookOpen, Eye, MoreVertical, FileText, ArrowUp } from "lucide-react";

const summaryCards = [
  {
    label: "Total Booking(s)",
    value: 14,
    unit: "Booking(s)",
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    label: "Group Bookings (Group)",
    value: 14,
    unit: "Booking(s)",
    color: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Individual Booking(s)",
    value: 0,
    unit: "Booking(s)",
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Assignments (Issued)",
    value: 6,
    unit: "Assignment(s)",
    color: "bg-red-100",
    iconColor: "text-red-600",
  },
];

export function TodaysBooking({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (name: string) => {
    setExpandedRows((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Today's Bookings"]} />
        </div>

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Today's Booking</h1>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate("/bookings/list")}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              View All Bookings
            </button>
            <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
              Issue Assets
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center flex-shrink-0`}
              >
                <BookOpen size={20} className={card.iconColor} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{card.label}</div>
                <div className="text-2xl font-bold text-gray-800">
                  {card.value}{" "}
                  <span className="text-sm font-normal text-gray-500">{card.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-red-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-1/4">
                  Base Station(s)
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-1/6">
                  Booking(s)
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-1/5">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-1/5">
                  Active Lane(s)
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary">
                  Assignment(s)
                </th>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {baseStations.map((station) => (
                <>
                  <tr
                    key={station.name}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleRow(station.name)}
                  >
                    <td className="px-5 py-3.5 text-sm text-gray-700">{station.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{station.bookings || 0}</td>
                    <td className="px-5 py-3.5">
                      {station.statuses.length > 0 ? (
                        <div className="flex flex-col items-start gap-1">
                          {station.statuses.map((s: BookingStatus) => (
                            <StatusBadge key={s} status={s} size="sm" />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{station.activeLanes}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">
                      {station.assignments === "-" ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        station.assignments
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-gray-400">
                      {expandedRows[station.name] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </td>
                  </tr>

                  {expandedRows[station.name] && (
                    <tr key={`${station.name}-detail`}>
                      <td colSpan={6} className="px-4 py-3 bg-red-50/40">
                        <div className="rounded-md border border-gray-200 overflow-hidden bg-white">
                          {/* Inner table header */}
                          <table className="w-full">
                            <thead>
                              <tr className="bg-red-50 border-b border-gray-100">
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary w-12">No</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary min-w-[240px]">Booking ID</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary min-w-[100px]">Training Type</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary min-w-[200px]">
                                  <div className="flex items-center gap-1">
                                    Booking Time <ArrowUp size={11} className="text-gray-400" />
                                  </div>
                                </th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary min-w-[110px]">Status</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary min-w-[120px]">Assignment ID</th>
                                <th className="text-left px-4 py-2.5 text-xs font-semibold text-brand-primary w-20">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {station.details && station.details.length > 0 ? (
                                station.details.map((d, idx) => (
                                  <tr key={d.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                                    <td className="px-4 py-3 text-sm">
                                      <div className="font-medium text-gray-800">{d.program}</div>
                                      <div className="text-xs text-gray-400 mt-0.5">Booking ID - {d.bookingId}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{d.trainingType}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                      <div>{d.bookingDate}</div>
                                      <div className="text-xs text-gray-500 mt-0.5">{d.bookingTime}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <StatusBadge status={d.status as BookingStatus} size="sm" />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">
                                      {d.assignmentId === "-" ? <span className="text-gray-400">-</span> : d.assignmentId}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <button onClick={() => onNavigate("/bookings/detail")} className="text-gray-400 hover:text-gray-600 transition-colors">
                                          <Eye size={15} />
                                        </button>
                                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                          <MoreVertical size={15} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={7} className="py-10">
                                    <div className="flex flex-col items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <FileText size={18} className="text-gray-400" />
                                      </div>
                                      <div className="text-center">
                                        <p className="text-sm font-semibold text-gray-600">No data to show right now!</p>
                                        <p className="text-xs text-gray-400 mt-0.5">This table will be automatically updated once users take action in the IMT system.</p>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
