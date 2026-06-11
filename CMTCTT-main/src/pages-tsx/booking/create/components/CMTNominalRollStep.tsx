import { useState, useMemo } from "react";
import { Search, Upload, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/button";
import { InputCustom } from "@/components/input";
import { Checkbox } from "@/components/checkbox";
import { TableCustom } from "@/components/table";
import { Pagination } from "@/components/ui/Pagination";
import { CMTUploadListModal } from "../modals/CMTUploadListModal";
import { CMTReviewModal } from "../modals/CMTReviewModal";
import type { CMTBookingDetailsValues } from "./CMTBookingDetailsStep";
import type { IosEntry } from "./CMTCabinConfigStep";

// ── Mock data ─────────────────────────────────────────────────────────────────

const CMT_TRAINEES = [
  { rank: "REC", name: "Roger Botosh",    nric: "*****212A", battalion: "1st", company: "AA", section: "1", appointment: "-", platoon: "Platoon 1", roles: "VO" },
  { rank: "REC", name: "Davis Culhane",   nric: "*****212A", battalion: "2nd", company: "BB", section: "2", appointment: "-", platoon: "Platoon 1", roles: "VC" },
  { rank: "REC", name: "Kadin Torff",     nric: "*****212A", battalion: "3rd", company: "CC", section: "3", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "Craig Septimus",  nric: "*****212A", battalion: "5th", company: "DD", section: "4", appointment: "-", platoon: "Platoon 1", roles: "VO" },
  { rank: "REC", name: "Roger Septimus",  nric: "*****212A", battalion: "8th", company: "AA", section: "5", appointment: "-", platoon: "Platoon 1", roles: "SC" },
  { rank: "REC", name: "Jaxson Donin",    nric: "*****212A", battalion: "9th", company: "BB", section: "1", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "James Lubin",     nric: "*****212A", battalion: "1st", company: "CC", section: "2", appointment: "-", platoon: "Platoon 1", roles: "SO" },
  { rank: "REC", name: "Jakob Vaccaro",   nric: "*****212A", battalion: "2nd", company: "DD", section: "3", appointment: "-", platoon: "Platoon 1", roles: "SC" },
  { rank: "REC", name: "Ruben Calzoni",   nric: "*****212A", battalion: "3rd", company: "AA", section: "4", appointment: "-", platoon: "Platoon 1", roles: "TC" },
  { rank: "REC", name: "Tyrone Whitfield",nric: "*****212B", battalion: "1st", company: "BB", section: "5", appointment: "-", platoon: "Platoon 2", roles: "VO" },
  { rank: "REC", name: "Marcus Chen",     nric: "*****212B", battalion: "2nd", company: "CC", section: "1", appointment: "-", platoon: "Platoon 2", roles: "VC" },
  { rank: "REC", name: "Alvin Tan",       nric: "*****212B", battalion: "3rd", company: "DD", section: "2", appointment: "-", platoon: "Platoon 2", roles: "TC" },
  { rank: "REC", name: "Wei Ming Lim",    nric: "*****212B", battalion: "5th", company: "AA", section: "3", appointment: "-", platoon: "Platoon 2", roles: "SC" },
  { rank: "REC", name: "Iskandar Shah",   nric: "*****212B", battalion: "8th", company: "BB", section: "4", appointment: "-", platoon: "Platoon 2", roles: "SO" },
  { rank: "REC", name: "Rahul Patel",     nric: "*****212B", battalion: "9th", company: "CC", section: "5", appointment: "-", platoon: "Platoon 2", roles: "TC" },
  { rank: "REC", name: "Dylan Ong",       nric: "*****212C", battalion: "1st", company: "DD", section: "1", appointment: "-", platoon: "Platoon 3", roles: "VO" },
  { rank: "REC", name: "Brandon Lee",     nric: "*****212C", battalion: "2nd", company: "AA", section: "2", appointment: "-", platoon: "Platoon 3", roles: "VC" },
  { rank: "REC", name: "Justin Koh",      nric: "*****212C", battalion: "3rd", company: "BB", section: "3", appointment: "-", platoon: "Platoon 3", roles: "TC" },
  { rank: "REC", name: "Nathan Yeo",      nric: "*****212C", battalion: "5th", company: "CC", section: "4", appointment: "-", platoon: "Platoon 3", roles: "SC" },
  { rank: "REC", name: "Ethan Ho",        nric: "*****212C", battalion: "8th", company: "DD", section: "5", appointment: "-", platoon: "Platoon 3", roles: "SO" },
  { rank: "REC", name: "Samuel Ng",       nric: "*****212D", battalion: "9th", company: "AA", section: "1", appointment: "-", platoon: "Platoon 4", roles: "TC" },
  { rank: "REC", name: "Aaron Lim",       nric: "*****212D", battalion: "1st", company: "BB", section: "2", appointment: "-", platoon: "Platoon 4", roles: "VO" },
  { rank: "REC", name: "Zachary Tan",     nric: "*****212D", battalion: "2nd", company: "CC", section: "3", appointment: "-", platoon: "Platoon 4", roles: "VC" },
  { rank: "REC", name: "Gabriel Wong",    nric: "*****212D", battalion: "3rd", company: "DD", section: "4", appointment: "-", platoon: "Platoon 4", roles: "TC" },
  { rank: "REC", name: "Caleb Chan",      nric: "*****212D", battalion: "5th", company: "AA", section: "5", appointment: "-", platoon: "Platoon 4", roles: "SC" },
];

const PER_PAGE      = 10;
const DATA_SIZES    = [3, 5, 10, 15] as const;

type Trainee = typeof CMT_TRAINEES[number];

// ── Component ─────────────────────────────────────────────────────────────────

export function CMTNominalRollStep({
  onNext,
  bookingDetails,
  iosList,
}: {
  onNext: () => void;
  bookingDetails?: CMTBookingDetailsValues | null;
  iosList?: IosEntry[];
}) {
  const [trainees]         = useState(CMT_TRAINEES);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [showUpload,   setShowUpload]   = useState(false);
  const [showReview,   setShowReview]   = useState(false);
  const [dataCount,    setDataCount]    = useState<typeof DATA_SIZES[number]>(10);

  // ── Filtering & pagination ────────────────────────────────────────────────
  // Slice mock data first according to selected count, then apply search filter
  const activeTrainees = useMemo(() => trainees.slice(0, dataCount), [trainees, dataCount]);

  const filtered = useMemo(
    () => activeTrainees.filter(t =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nric.includes(searchQuery)
    ),
    [activeTrainees, searchQuery],
  );
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // ── Columns ───────────────────────────────────────────────────────────────
  type Col = ColumnDef<Trainee, any> & { width?: string; minWidth?: string; maxWidth?: string };

  const columns = useMemo<Col[]>(() => [
    {
      id:       "select",
      header:   () => <Checkbox size={16} />,
      cell:     () => <Checkbox size={16} />,
      width: "44px", minWidth: "44px", maxWidth: "44px",
    },
    {
      id:     "no",
      header: () => "No",
      cell:   ({ row }: any) => (
        <span className="text-sm text-gray-700">
          {(currentPage - 1) * PER_PAGE + row.index + 1}
        </span>
      ),
      width: "56px", minWidth: "56px", maxWidth: "56px",
    },
    {
      accessorKey: "rank",
      header:      () => "Rank",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
      width: "76px", minWidth: "76px", maxWidth: "76px",
    },
    {
      accessorKey: "name",
      header:      () => "Name",
      cell:        ({ getValue }: any) => (
        <span className="text-sm font-medium text-gray-800">{getValue()}</span>
      ),
      minWidth: "160px",
    },
    {
      accessorKey: "nric",
      header:      () => "NRIC",
      cell:        ({ getValue }: any) => (
        <span className="text-sm text-gray-700 font-mono">{getValue()}</span>
      ),
      width: "112px", minWidth: "112px", maxWidth: "112px",
    },
    {
      accessorKey: "roles",
      header:      () => "Role",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
      width: "72px", minWidth: "72px", maxWidth: "72px",
    },
    {
      id:     "lastUpdated",
      header: () => "Last Updated",
      cell:   () => (
        <div className="text-sm text-gray-500 whitespace-nowrap">
          17 Jan 2025
          <br />
          <span className="text-xs text-gray-400">09:29 AM</span>
        </div>
      ),
      width: "130px", minWidth: "130px", maxWidth: "130px",
    },
    {
      id:     "actions",
      header: () => "",
      cell:   () => (
        <div className="flex items-center gap-1.5">
          <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <Pencil size={13} />
          </button>
          <button type="button" className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <Trash2 size={13} />
          </button>
        </div>
      ),
      width: "64px", minWidth: "64px", maxWidth: "64px",
    },
  ], [currentPage]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">

      {/* Centered 65%-width container */}
      <div className="w-[65%] mx-auto">

        {/* Header bar */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">
            Nominal Roll{" "}
            <span className="font-normal text-gray-500">({activeTrainees.length} Trainees)</span>
          </h2>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <InputCustom
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search"
                className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-40 focus:ring-1 focus:ring-brand-primary"
              />
            </div>

            {/* Filter */}
            <Button
              type="outline"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
            >
              <Filter size={14} /> Filter
            </Button>

            {/* Upload List */}
            <Button
              type="outline"
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
            >
              <Upload size={14} /> Upload List
            </Button>

            {/* Add Trainee */}
            <Button className="flex items-center gap-2 px-3 py-2 text-sm font-medium w-auto bg-brand-primary text-white hover:bg-brand-primary-hover">
              <Plus size={14} /> Add Trainee
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <TableCustom<Trainee>
            columns={columns}
            data={paginated}
            autoScrollTable={true}
          />
          <Pagination
            currentPage={currentPage}
            itemsPerPage={PER_PAGE}
            totalItems={filtered.length}
            setCurrentPage={setCurrentPage}
          />
        </div>

      </div>{/* /centered container */}

      {/* Hidden trigger — called by CMTBookingForm's "Next" button on step 2 */}
      <button
        id="cmt-nominal-next-trigger"
        type="button"
        className="hidden"
        onClick={() => setShowReview(true)}
      />

      {/* Upload modal */}
      {showUpload && <CMTUploadListModal onClose={() => setShowUpload(false)} />}

      {/* Review modal */}
      {showReview && (
        <CMTReviewModal
          totalTrainees={activeTrainees.length}
          bookingType={bookingDetails?.bookingType ?? "Compartment Selection"}
          cabin={bookingDetails?.cabinAmount ?? 1}
          vehicleType={bookingDetails?.vehicleType ?? "ICV (TERREX)"}
          weaponVariant={(() => {
            if (!bookingDetails?.platformVariants) return "—";
            const isSingle = (bookingDetails.cabinAmount ?? 1) === 1;
            const selected = bookingDetails.platformVariants.filter(v => v.selected);
            if (selected.length === 0) return "—";
            return selected
              .map(v => isSingle ? v.label : `${v.label} (${v.qty})`)
              .join(", ");
          })()}
          role="All Roles"
          instructor={bookingDetails?.instructor ?? "—"}
          unitContact={bookingDetails?.unitContactDetails ?? "—"}
          trainingSchedule={(() => {
            if (!bookingDetails?.scheduleType) return "—";
            if (bookingDetails.scheduleType === "AM/PM") {
              if (bookingDetails.scheduleSection === "AM") return "AM Session (8:00 AM - 12:00 PM)";
              if (bookingDetails.scheduleSection === "PM") return "PM Session (12:00 PM - 5:00 PM)";
              return "AM/PM Schedule";
            }
            if (bookingDetails.scheduleType === "Full Day") return "Full Day Schedule";
            if (bookingDetails.scheduleType === "Ad-hoc") return "Ad-hoc Schedule";
            return bookingDetails.scheduleType;
          })()}
          briefingRoom={bookingDetails?.briefingRooms?.[0] ?? "—"}
          trainingDate={
            bookingDetails?.selectedDate
              ? bookingDetails.selectedDate.toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })
              : "—"
          }
          iosList={iosList}
          onCancel={() => setShowReview(false)}
          onConfirm={() => { setShowReview(false); onNext(); }}
        />
      )}

      {/* ── Floating data-count switcher (demo control) ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full shadow-lg px-3 py-1.5">
        <span className="text-[10px] text-gray-400 font-medium mr-0.5">Show</span>
        {DATA_SIZES.map(size => (
          <button
            key={size}
            type="button"
            onClick={() => { setDataCount(size); setCurrentPage(1); }}
            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all ${
              dataCount === size
                ? "bg-brand-primary text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {size}
          </button>
        ))}
      </div>

    </div>
  );
}
