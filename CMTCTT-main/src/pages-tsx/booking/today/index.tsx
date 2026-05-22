import { useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { BOOKINGS_DATA, SUMMARY_CARDS, TIMELINE_HOURS } from "./constants";
import { BookingDetailModal } from "./components/BookingDetailModal";
import type { Booking, TodaysBookingProps } from "./types";

function getBookingPosition(booking: Booking) {
  const startMinutes = booking.startHour * 60 + booking.startMinute;
  const endMinutes = booking.endHour * 60 + booking.endMinute;
  const duration = endMinutes - startMinutes;

  const topPercent = ((booking.startHour - 8) * 60 + booking.startMinute) / (11 * 60); // 8 AM to 7 PM
  const heightPercent = duration / (11 * 60);

  return { topPercent: topPercent * 100, heightPercent: heightPercent * 100 };
}

function getStatusColor(status: string) {
  switch (status) {
    case "Upcoming":
      return "bg-blue-100 border-blue-200 text-blue-700";
    case "Completed":
      return "bg-green-100 border-green-200 text-green-700";
    case "Overdue":
      return "bg-red-100 border-red-200 text-red-700";
    default:
      return "bg-gray-100 border-gray-200 text-gray-700";
  }
}

export function TodaysBooking({ onNavigate }: TodaysBookingProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-3">
          <h1 className="text-xl font-semibold text-brand-primary">Today's Booking</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="outline"
              onClick={() => onNavigate("/bookings/list")}
              className="px-4 py-2 text-sm font-medium w-auto"
            >
              View All Bookings
            </Button>
            <Button
              type="default"
              className="px-4 py-2 text-sm font-medium bg-brand-primary hover:bg-brand-primary-hover w-auto"
            >
              Issue Assets
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6">
          {SUMMARY_CARDS.map((card) => (
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

        {/* Calendar view */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="relative" style={{ minWidth: "960px" }}>
              {/* Time labels and grid */}
              <div className="flex">
                {/* Time column */}
                <div className="w-24 flex-shrink-0 border-r border-gray-200">
                  <div className="h-12 border-b border-gray-200" />
                  {TIMELINE_HOURS.map((hour) => (
                    <div key={hour} className="h-24 border-b border-gray-100 flex items-start justify-center pt-2">
                      <span className="text-xs text-gray-500 font-medium">
                        {hour % 12 === 0 ? 12 : hour % 12} {hour < 12 ? "AM" : "PM"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Booking slots */}
                <div className="flex-1 relative">
                  {/* Header */}
                  <div className="h-12 border-b border-gray-200 px-4 flex items-center">
                    <h3 className="text-sm font-semibold text-gray-700">Booking Schedule</h3>
                  </div>

                  {/* Grid background */}
                  <div className="relative">
                    {TIMELINE_HOURS.map((hour) => (
                      <div key={hour} className="h-24 border-b border-gray-100" />
                    ))}

                    {/* Bookings overlay */}
                    <div className="absolute inset-0 px-4 pt-0">
                      {BOOKINGS_DATA.map((booking) => {
                        const { topPercent, heightPercent } = getBookingPosition(booking);
                        return (
                          <div
                            key={booking.id}
                            onClick={() => setSelectedBooking(booking)}
                            className={cn(
                              "absolute left-4 right-4 border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md",
                              getStatusColor(booking.status)
                            )}
                            style={{
                              top: `${topPercent}%`,
                              height: `${heightPercent}%`,
                            }}
                          >
                            <div className="text-xs font-bold text-gray-800 truncate">
                              {booking.program}
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5 truncate">
                              {booking.bookingId}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {booking.time}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
