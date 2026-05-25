import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Search, Upload, Plus, Filter, Pencil, Trash2, ArrowUp } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { InputCustom } from "@/components/input";
import { Checkbox } from "@/components/checkbox";
import { TableCustom } from "@/components/table";
import { Pagination } from "@/components/ui/Pagination";
import { UploadModal } from "../modals/UploadModal";
import { CMT_ONBOARDING_TRAINEES, type CMTTraineeRow, PER_PAGE } from "../constants";

const columnHelper = createColumnHelper<CMTTraineeRow>();

// ── Shared column builder ─────────────────────────────────────────────────────

function buildColumns(currentPage: number, showStatus: boolean) {
  return [
    columnHelper.display({
      id:     "select",
      header: () => <Checkbox size={16} />,
      cell:   () => <Checkbox size={16} />,
    }),
    columnHelper.display({
      id:     "no",
      header: () => "No",
      cell:   ({ row }) => (
        <span className="text-sm text-gray-700">
          {(currentPage - 1) * PER_PAGE + row.index + 1}
        </span>
      ),
    }),
    columnHelper.accessor("rank", {
      header: () => "Rank",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell:   ({ getValue }) => <span className="text-sm font-medium text-gray-800">{getValue()}</span>,
    }),
    columnHelper.accessor("nric", {
      header: () => "NRIC",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    columnHelper.accessor("battalion", {
      header: () => "Battalion",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    columnHelper.accessor("company", {
      header: () => "Company",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    columnHelper.accessor("section", {
      header: () => "Section",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    columnHelper.accessor("appointment", {
      header: () => "Appointment",
      cell:   ({ getValue }) => <span className="text-sm text-gray-400">{getValue()}</span>,
    }),
    columnHelper.accessor("platoon", {
      header: () => "Platoon Number",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    columnHelper.accessor("roles", {
      header: () => "Roles",
      cell:   ({ getValue }) => <span className="text-sm text-gray-700">{getValue()}</span>,
    }),
    ...(showStatus ? [
      columnHelper.display({
        id:     "status",
        header: () => (
          <span className="flex items-center gap-1">
            Status <ArrowUp size={12} className="text-gray-400" />
          </span>
        ),
        cell: () => (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">
            Registered (Present)
          </span>
        ),
      }),
    ] : []),
    columnHelper.display({
      id:     "lastUpdated",
      header: () => "Last Updated On",
      cell:   () => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          17 January 2025
          <br />
          <span className="text-xs">09.29.33 AM</span>
        </span>
      ),
    }),
    ...(showStatus ? [
      columnHelper.display({
        id:   "actions",
        header: () => "",
        cell: () => (
          <div className="flex items-center gap-2">
            <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
              <Pencil size={14} />
            </button>
            <button type="button" className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        ),
      }),
    ] : []),
  ];
}

// ── Empty clipboard icon ──────────────────────────────────────────────────────

function EmptyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  );
}

// ── Final Nominal Roll sub-view ───────────────────────────────────────────────

function CMTFinalNominalRoll({
  trainees,
  onBack,
  onConfirm,
}: {
  trainees: CMTTraineeRow[];
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpload,  setShowUpload]  = useState(false);

  const filtered = useMemo(
    () => trainees.filter(t =>
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nric.includes(searchQuery)
    ),
    [trainees, searchQuery],
  );
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const columns   = useMemo(() => buildColumns(currentPage, true), [currentPage]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between flex-shrink-0 gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Final Nominal Roll</h2>
          <p className="text-xs text-gray-400 mt-0.5">Please confirm your final nominal roll list submitted is correct.</p>
        </div>
        <div className="flex gap-3">
          <Button
            type="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 w-auto border border-gray-200"
          >
            <ArrowLeft size={14} /> Back
          </Button>
          <Button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
          >
            Confirm Nominal Roll <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-gray-100 gap-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Nominal Roll{" "}
              <span className="font-normal text-gray-400">({trainees.length} Trainees)</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2">
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
              >
                <Filter size={14} /> Filter
              </Button>
              {/* Upload */}
              <Button
                type="outline"
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
              >
                <Upload size={14} /> Upload Final Nominal Roll
              </Button>
              {/* Scan ID */}
              <Button
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
              >
                <Plus size={13} /> Scan ID
              </Button>
            </div>
          </div>

          <TableCustom<CMTTraineeRow>
            columns={columns}
            data={paginated}
            autoScrollTable={false}
          />
          <Pagination
            currentPage={currentPage}
            itemsPerPage={PER_PAGE}
            totalItems={filtered.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {showUpload && (
        <UploadModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUpload={() => setShowUpload(false)}
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CMTAttendanceStep({
  onBack,
  onConfirm,
}: {
  onBack: () => void;
  onConfirm: () => void;
}) {
  const [trainees,     setTrainees]     = useState<CMTTraineeRow[]>([]);
  const [showFinalRoll, setShowFinalRoll] = useState(false);
  const [showUpload,   setShowUpload]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [currentPage,  setCurrentPage]  = useState(1);

  const hasData = trainees.length > 0;

  const handleUpload = () => {
    setTrainees(CMT_ONBOARDING_TRAINEES);
    setShowUpload(false);
    setShowFinalRoll(true);
  };

  const handleScanID = () => {
    setTrainees(CMT_ONBOARDING_TRAINEES);
    setShowFinalRoll(true);
  };

  // ── Final Nominal Roll sub-view ─────────────────────────────────────────────
  if (showFinalRoll) {
    return (
      <CMTFinalNominalRoll
        trainees={trainees}
        onBack={() => { setShowFinalRoll(false); setTrainees([]); }}
        onConfirm={onConfirm}
      />
    );
  }

  // ── Confirm Attendance view ─────────────────────────────────────────────────
  const filtered  = trainees.filter(t =>
    !searchQuery ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nric.includes(searchQuery)
  );
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const columns   = useMemo(() => buildColumns(currentPage, false), [currentPage]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">

      {/* Sub-header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between flex-shrink-0 gap-3">
        <div>
          <h2 className="text-sm font-bold text-gray-800">Confirm Attendance for the training</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Please check the attendance of the trainees by scanning or uploading final nominal roll.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="outline"
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 w-auto border border-gray-200"
          >
            <ArrowLeft size={14} /> Back
          </Button>
          <Button
            disabled={!hasData}
            onClick={hasData ? () => setShowFinalRoll(true) : undefined}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 text-sm font-semibold w-auto",
              hasData
                ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
                : "bg-brand-primary/30 text-white cursor-not-allowed"
            )}
          >
            Next <ArrowRight size={14} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-gray-100 gap-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Nominal Roll{" "}
              <span className="font-normal text-gray-400">({trainees.length} Trainees)</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2">
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
              {/* Upload */}
              <Button
                type="outline"
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 w-auto border border-gray-200"
              >
                <Upload size={14} /> Upload Final Nominal Roll
              </Button>
              {/* Scan ID */}
              <Button
                onClick={handleScanID}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
              >
                <Plus size={13} /> Scan ID
              </Button>
            </div>
          </div>

          {/* Empty state or table */}
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <EmptyIcon />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No trainees to show right now!</p>
              <p className="text-xs text-gray-400 mb-6">
                Clicks on " Upload List" or " Scan ID" to create a nominal roll list in the system.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="outline"
                  onClick={() => setShowUpload(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 w-auto border border-gray-300"
                >
                  <Upload size={14} /> Upload Final Nominal Roll
                </Button>
                <Button
                  onClick={handleScanID}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold w-auto bg-brand-primary text-white hover:bg-brand-primary-hover"
                >
                  <Plus size={13} /> Scan ID
                </Button>
              </div>
            </div>
          ) : (
            <TableCustom<CMTTraineeRow>
              columns={columns}
              data={paginated}
              autoScrollTable={false}
            />
          )}

          <Pagination
            currentPage={currentPage}
            itemsPerPage={PER_PAGE}
            totalItems={filtered.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {showUpload && (
        <UploadModal
          open={showUpload}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}
