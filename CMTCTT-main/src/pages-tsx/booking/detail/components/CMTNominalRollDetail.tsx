import { useState, useMemo } from "react";
import { Search, Upload, Plus, Pencil, Trash2, Filter } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/button";
import { InputCustom } from "@/components/input";
import { Checkbox } from "@/components/checkbox";
import { TableCustom } from "@/components/table";
import { Pagination } from "@/components/ui/Pagination";
import { CMTUploadListModal } from "../../create/modals/CMTUploadListModal";

// ── Mock data (same as in CMTNominalRollStep) ─────────────────────────────────

const CMT_TRAINEES = [
  { rank: "REC", name: "Roger Botosh",     nric: "*****212A", roles: "VO" },
  { rank: "REC", name: "Davis Culhane",    nric: "*****212A", roles: "VC" },
  { rank: "REC", name: "Kadin Torff",      nric: "*****212A", roles: "TC" },
  { rank: "REC", name: "Craig Septimus",   nric: "*****212A", roles: "VO" },
  { rank: "REC", name: "Roger Septimus",   nric: "*****212A", roles: "SC" },
  { rank: "REC", name: "Jaxson Donin",     nric: "*****212A", roles: "TC" },
  { rank: "REC", name: "James Lubin",      nric: "*****212A", roles: "SO" },
  { rank: "REC", name: "Jakob Vaccaro",    nric: "*****212A", roles: "SC" },
  { rank: "REC", name: "Ruben Calzoni",    nric: "*****212A", roles: "TC" },
  { rank: "REC", name: "Tyrone Whitfield", nric: "*****212B", roles: "VO" },
  { rank: "REC", name: "Marcus Chen",      nric: "*****212B", roles: "VC" },
  { rank: "REC", name: "Alvin Tan",        nric: "*****212B", roles: "TC" },
  { rank: "REC", name: "Wei Ming Lim",     nric: "*****212B", roles: "SC" },
  { rank: "REC", name: "Iskandar Shah",    nric: "*****212B", roles: "SO" },
  { rank: "REC", name: "Rahul Patel",      nric: "*****212B", roles: "TC" },
  { rank: "REC", name: "Dylan Ong",        nric: "*****212C", roles: "VO" },
  { rank: "REC", name: "Brandon Lee",      nric: "*****212C", roles: "VC" },
  { rank: "REC", name: "Justin Koh",       nric: "*****212C", roles: "TC" },
  { rank: "REC", name: "Nathan Yeo",       nric: "*****212C", roles: "SC" },
  { rank: "REC", name: "Ethan Ho",         nric: "*****212C", roles: "SO" },
  { rank: "REC", name: "Samuel Ng",        nric: "*****212D", roles: "TC" },
  { rank: "REC", name: "Aaron Lim",        nric: "*****212D", roles: "VO" },
  { rank: "REC", name: "Zachary Tan",      nric: "*****212D", roles: "VC" },
  { rank: "REC", name: "Gabriel Wong",     nric: "*****212D", roles: "TC" },
  { rank: "REC", name: "Caleb Chan",       nric: "*****212D", roles: "SC" },
];

const PER_PAGE = 10;

type Trainee = typeof CMT_TRAINEES[number];

// ── Component ─────────────────────────────────────────────────────────────────

export function CMTNominalRollDetail() {
  const [trainees]                        = useState(CMT_TRAINEES);
  const [searchQuery, setSearchQuery]     = useState("");
  const [currentPage, setCurrentPage]     = useState(1);
  const [showUpload,  setShowUpload]      = useState(false);

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
  type Col = ColumnDef<Trainee, any> & { width?: string; minWidth?: string; maxWidth?: string };

  const columns = useMemo<Col[]>(() => [
    {
      id:     "select",
      header: () => <Checkbox size={16} />,
      cell:   () => <Checkbox size={16} />,
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
    <>
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
              className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-44 focus:ring-1 focus:ring-brand-primary"
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

      {/* Upload modal */}
      {showUpload && <CMTUploadListModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
