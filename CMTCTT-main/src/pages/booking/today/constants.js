export const SUMMARY_CARDS = [
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
export const BOOKINGS_DATA = [
    {
        id: "BK-001",
        program: "SWT Marksmanship (SAR21)",
        bookingId: "#260424-PTC002-01",
        time: "08:00 AM - 05:00 PM",
        status: "Upcoming",
        startHour: 8,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
    },
    {
        id: "BK-002",
        program: "IMT Training for Unit 2SIR",
        bookingId: "#260424-PTC001-01",
        time: "01:00 PM - 05:00 PM",
        status: "Completed",
        startHour: 13,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
    },
    {
        id: "BK-003",
        program: "IMT Training for Unit 1SIR",
        bookingId: "#260424-PTC003-01",
        time: "05:00 PM - 06:00 PM",
        status: "Upcoming",
        startHour: 17,
        startMinute: 0,
        endHour: 18,
        endMinute: 0,
    },
];
// Hours displayed in the timeline: 8 AM to 5 PM
export const TIMELINE_HOURS = Array.from({ length: 10 }, (_, i) => i + 8);
