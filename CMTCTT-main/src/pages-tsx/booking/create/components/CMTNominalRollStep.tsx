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

const PER_PAGE = 10;

type Trainee = typeof CMT_TRAINEES[number];

// ── Component ─────────────────────────────────────────────────────────────────

export function CMTNominalRollStep({ onNext }: { onNext: () => void }) {
  const [trainees]         = useState(CMT_TRAINEES);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [showUpload,   setShowUpload]   = useState(false);
  const [showReview,   setShowReview]   = useState(false);

  // ── Filtering & pagination ────────────────────────────────────────────────
  const filtered = useMemo(
    () => trainees.filter(t =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nric.includes(searchQuery)
    ),
    [trainees, searchQuery],
  );
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<Trainee, any>[]>(() => [
    {
      id:     "select",
      header: () => <Checkbox size={16} />,
      cell:   () => <Checkbox size={16} />,
    },
    {
      id:     "no",
      header: () => "No",
      cell:   ({ row }: any) => (
        <span className="text-sm text-gray-700">
          {(currentPage - 1) * PER_PAGE + row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "rank",
      header:      () => "Rank",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      accessorKey: "name",
      header:      () => "Name",
      cell:        ({ getValue }: any) => (
        <span className="text-sm font-medium text-gray-800">{getValue()}</span>
      ),
    },
    {
      accessorKey: "nric",
      header:      () => "NRIC",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      accessorKey: "battalion",
      header:      () => "Battalion",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      accessorKey: "company",
      header:      () => "Company",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      accessorKey: "section",
      header:      () => "Section",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      accessorKey: "appointment",
      header:      () => "Appointment",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-400">{getValue()}</span>,
    },
    {
      accessorKey: "platoon",
      header:      () => "Platoon Number",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      accessorKey: "roles",
      header:      () => "Roles",
      cell:        ({ getValue }: any) => <span className="text-sm text-gray-700">{getValue()}</span>,
    },
    {
      id:     "lastUpdated",
      header: () => "Last Updated On",
      cell:   () => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          17 January 2025
          <br />
          <span className="text-xs">09.29.33 AM</span>
        </span>
      ),
    },
    {
      id:     "actions",
      header: () => "",
      cell:   () => (
        <div className="flex items-center gap-2">
          <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
            <Pencil size={14} />
          </button>
          <button type="button" className="text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ], [currentPage]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">

      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800">
          Nominal Roll{" "}
          <span className="font-normal text-gray-500">({trainees.length} Trainees)</span>
        </h2>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <InputCustom
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search"
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-52 focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* Filter */}
          <Button
            type="outline"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
          >
            <Filter size={14} /> Filter
          </Button>

          {/* Upload List */}
          <Button
            type="outline"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
          >
            <Upload size={14} /> Upload List
          </Button>

          {/* Add Trainee */}
          <Button className="flex items-center gap-2 px-4 py-2 text-sm font-medium w-auto bg-brand-primary text-white hover:bg-brand-primary-hover">
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
          totalTrainees={trainees.length}
          bookingType="Entire Cabin"
          cabin={5}
          vehicleType="ICV (TERREX)"
          weaponVariant="40AGL (3), 50HMG (2)"
          role="All Roles"
          instructor="Allen Ritchson"
          unitContact="+65 232 232 2323"
          trainingSchedule="PM Session (12:00 PM - 5:00 PM)"
          briefingRoom="Briefing Room A"
          trainingDate="16 January 2025"
          onCancel={() => setShowReview(false)}
          onConfirm={() => { setShowReview(false); onNext(); }}
        />
      )}

    </div>
  );
}
