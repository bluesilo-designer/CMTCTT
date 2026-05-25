import { useState, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Search, Download, Eye, Calendar } from "lucide-react";
import { Checkbox } from "@/components/checkbox";
import { TableCustom } from "@/components/table";
import { InputCustom } from "@/components/input";
import { Button } from "@/components/button";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cabins as initialCabins } from "@/data/cabinManagement";
import type { Cabin, CabinStatus } from "./types";
import { PER_PAGE } from "./constants";
import { StatusBadge } from "./components/StatusBadge";
import { CabinRowMenu } from "./components/CabinRowMenu";
import { AddCabinModal } from "./modals/AddCabinModal";
import { EditCabinModal } from "./modals/EditCabinModal";
import { DeleteConfirmModal } from "./modals/DeleteConfirmModal";
import { ViewCabinModal } from "./modals/ViewCabinModal";

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Shorten cluster names for table display.
 * e.g. "CTT-CLUSTER-01" → "CTT01"
 *      "CTT-CLUSTER-44" → "CTT44"
 * Falls back to the original name for anything not matching the pattern.
 */
function shortName(name: string): string {
  const match = name.match(/^([A-Z]+)-[A-Z]+-(\d+)$/);
  if (match) return `${match[1]}${match[2]}`;
  return name;
}

function nowStamp() {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date}\n${time}`;
}

function BlackoutCell({ dates }: { dates: Cabin["blackoutDates"] }) {
  if (dates.length === 0)
    return <span className="text-gray-400 text-sm">-</span>;
  const visible = dates.slice(0, 3);
  const extra = dates.length - 3;
  return (
    <span className="text-sm text-gray-700">
      {visible.map((d) => d.label).join(", ")}
      {extra > 0 && <span className="text-gray-400 ml-1">+{extra} more</span>}
    </span>
  );
}

// ── component ─────────────────────────────────────────────────────────────────

export function CabinManagement() {
  // ── state ──
  const [cabins, setCabins] = useState<Cabin[]>(initialCabins);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCabin, setEditingCabin] = useState<Cabin | null>(null);
  const [deletingCabin, setDeletingCabin] = useState<Cabin | null>(null);
  const [viewingCabin, setViewingCabin] = useState<Cabin | null>(null);

  // ── derived ──
  const filtered = useMemo(
    () =>
      cabins.filter(
        (c) =>
          !searchQuery ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [cabins, searchQuery]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const allSelected =
    paginated.length > 0 && paginated.every((c) => selected.has(c.id));
  const someSelected = paginated.some((c) => selected.has(c.id));

  // ── selection ──
  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(paginated.map((c) => c.id))
    );
  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ── CRUD handlers ──

  /** CREATE — add new cabin and jump to last page */
  const handleAdd = (name: string, status: CabinStatus) => {
    const newCabin: Cabin = {
      id: `cabin-${Date.now()}`,
      name,
      status,
      blackoutDates: [],
      updatedOn: nowStamp(),
    };
    setCabins((prev) => [...prev, newCabin]);
    // jump to last page so user sees the newly added row
    const newTotal = cabins.length + 1;
    setCurrentPage(Math.ceil(newTotal / PER_PAGE));
  };

  /** UPDATE — edit cabin name / status, refresh updatedOn */
  const handleEdit = (id: string, name: string, status: CabinStatus) => {
    setCabins((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name, status, updatedOn: nowStamp() } : c
      )
    );
  };

  /** DELETE — remove single cabin */
  const handleDelete = (id: string) => {
    setCabins((prev) => prev.filter((c) => c.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  /** BULK DELETE — remove all checked cabins */
  const handleBulkDelete = () => {
    setCabins((prev) => prev.filter((c) => !selected.has(c.id)));
    setSelected(new Set());
    setCurrentPage(1);
  };

  // ── columns ──
  const columns = useMemo<ColumnDef<Cabin, any>[]>(
    () => [
      {
        id: "select",
        header: () => (
          <Checkbox
            size={16}
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={toggleAll}
          />
        ),
        cell: ({ row }: any) => (
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              size={16}
              checked={selected.has(row.original.id)}
              onChange={() => toggleSelect(row.original.id)}
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: () => "Cabin",
        cell: ({ getValue }: any) => {
          const full = getValue() as string;
          const short = shortName(full);
          return (
            <div>
              <span className="text-sm font-semibold text-gray-800">
                {short}
              </span>
              {short !== full && (
                <div className="text-xs text-gray-400 mt-0.5">{full}</div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => "Status",
        cell: ({ getValue }: any) => <StatusBadge status={getValue()} />,
      },
      {
        id: "blackoutDates",
        header: () => "Blackout Date",
        cell: ({ row }: any) => (
          <BlackoutCell dates={row.original.blackoutDates} />
        ),
      },
      {
        id: "updatedOn",
        header: () => "Updated On",
        cell: ({ row }: any) => {
          const [date, time] = row.original.updatedOn.split("\n");
          return (
            <div>
              <div className="text-sm text-gray-800">{date}</div>
              <div className="text-xs text-gray-400">{time}</div>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => "",
        cell: ({ row }: any) => (
          <div
            className="flex items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* VIEW */}
            <button
              title="View detail"
              onClick={() => setViewingCabin(row.original)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-brand-primary hover:bg-gray-100 transition-colors"
            >
              <Eye size={15} />
            </button>

            {/* 3-dot menu → Edit | Delete */}
            <CabinRowMenu
              onEdit={() => setEditingCabin(row.original)}
              onDelete={() => setDeletingCabin(row.original)}
            />
          </div>
        ),
      },
    ],
    [allSelected, someSelected, selected]
  );

  // ── render ──
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Breadcrumb */}
      <div className="px-6 py-2.5 border-b border-gray-200 bg-white">
        <Breadcrumb items={["Cabin Management"]} />
      </div>

      <div className="p-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">
            Cabin Management
          </h1>
          <div className="flex items-center gap-3">
            <Button
              type="outline"
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold w-auto"
            >
              <Download size={14} /> Export Spreadsheet
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm bg-brand-primary text-white hover:bg-brand-primary-hover font-semibold w-auto shadow-sm"
            >
              Add New Cabin
            </Button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Card toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">
              Cabin{" "}
              <span className="text-gray-500 font-normal">
                ({filtered.length} Cabins)
              </span>
            </h2>
            <div className="flex items-center gap-3">
              {selected.size > 0 && (
                <Button
                  type="outline"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 border-0 w-auto px-0 py-0"
                >
                  Delete Selected ({selected.size})
                </Button>
              )}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <InputCustom
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search"
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                <Calendar size={13} className="text-gray-400" />
                <span>10 January 2025</span>
              </button>
            </div>
          </div>

          <TableCustom columns={columns} data={paginated} autoScrollTable={true} />

          <Pagination
            currentPage={safePage}
            itemsPerPage={PER_PAGE}
            totalItems={filtered.length}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Modals ── */}

      {/* CREATE */}
      {showAddModal && (
        <AddCabinModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* UPDATE */}
      {editingCabin && (
        <EditCabinModal
          cabin={editingCabin}
          onClose={() => setEditingCabin(null)}
          onSave={handleEdit}
        />
      )}

      {/* DELETE confirmation */}
      {deletingCabin && (
        <DeleteConfirmModal
          cabin={deletingCabin}
          onClose={() => setDeletingCabin(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* VIEW detail */}
      {viewingCabin && (
        <ViewCabinModal
          cabin={viewingCabin}
          onClose={() => setViewingCabin(null)}
          onEdit={(cabin) => setEditingCabin(cabin)}
        />
      )}
    </div>
  );
}
