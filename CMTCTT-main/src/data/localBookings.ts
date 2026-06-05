import type { CabinRow, IosEntry } from "@/pages-tsx/booking/create/components/CMTCabinConfigStep";
import type { CMTBookingDetailsValues } from "@/pages-tsx/booking/create/components/CMTBookingDetailsStep";
import type { Booking } from "@/data/mock";

// ── Stored booking shape ───────────────────────────────────────────────────────

export interface CMTLocalBooking {
  id:             string;    // e.g. "cmt-local-1749034..."
  bookingId:      string;    // display ID, e.g. "#260604-CMT001"
  bookingDetails: CMTBookingDetailsValues;
  cabins:         CabinRow[];
  iosList:        IosEntry[];
  createdAt:      number;    // Date.now() at time of save
}

const LS_KEY = "cmt_bookings";

// ── CRUD helpers ──────────────────────────────────────────────────────────────

export function getCMTLocalBookings(): CMTLocalBooking[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as CMTLocalBooking[]) : [];
  } catch {
    return [];
  }
}

export function saveCMTLocalBooking(
  bookingDetails: CMTBookingDetailsValues,
  cabins:         CabinRow[],
  iosList:        IosEntry[],
): CMTLocalBooking {
  const all  = getCMTLocalBookings();
  const now  = Date.now();
  const id   = `cmt-local-${now}`;

  // Derive date from selectedDate (if set) or now
  const dateVal = bookingDetails.selectedDate;
  const d = dateVal ? new Date(dateVal as unknown as string) : new Date(now);
  const yy  = String(d.getFullYear()).slice(2);
  const mm  = String(d.getMonth() + 1).padStart(2, "0");
  const dd  = String(d.getDate()).padStart(2, "0");
  const seq = String(all.length + 1).padStart(3, "0");
  const bookingId = `#${yy}${mm}${dd}-CMT${seq}`;

  const entry: CMTLocalBooking = { id, bookingId, bookingDetails, cabins, iosList, createdAt: now };
  all.push(entry);
  localStorage.setItem(LS_KEY, JSON.stringify(all));
  return entry;
}

export function getCMTLocalBookingById(id: string): CMTLocalBooking | undefined {
  return getCMTLocalBookings().find(b => b.id === id);
}

// ── Conversion to the shared Booking interface ────────────────────────────────

export function cmtLocalBookingToBooking(b: CMTLocalBooking): Booking {
  const dateVal = b.bookingDetails.selectedDate;
  const d = dateVal ? new Date(dateVal as unknown as string) : new Date(b.createdAt);
  const dateStr = d.toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  }).replace(",", "");

  // Build time label
  const { scheduleType, scheduleSection } = b.bookingDetails;
  let timeLabel = "";
  if (scheduleType === "AM/PM") {
    if      (scheduleSection === "AM") timeLabel = "08:00 AM - 12:00 PM (AM Session)";
    else if (scheduleSection === "PM") timeLabel = "12:00 PM - 05:00 PM (PM Session)";
    else                               timeLabel = "AM/PM Schedule";
  } else if (scheduleType === "Full Day") {
    timeLabel = "08:00 AM - 06:00 PM (Full Day)";
  } else if (scheduleType) {
    timeLabel = scheduleType;
  }

  const unitName = b.bookingDetails.unitName || "Unknown Unit";
  const weapon   = (b.bookingDetails.platformVariants ?? [])
    .filter(v => v.selected)
    .map(v => v.label)
    .join(", ") || "—";

  return {
    id:           b.id,
    bookingId:    b.bookingId,
    program:      `CMT Group Training for ${unitName}`,
    trainingType: "Group",
    bookingTime:  `${dateStr}\n${timeLabel}`,
    bookingDate:  dateStr,
    status:       "Upcoming",
    trainingMode: "Simulation",
    courseware:   "Component Type Training",
    assignmentId: "-",
    unitName,
    weapon,
    assetIssued:  false,
    isCMT:        true,
    sectionType:  "Standalone",
    trainees:     0,
  };
}
