import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { rfidReaders } from "@/data/rfidConfig";
import { Search, Trash2, Pencil, MoreVertical, ArrowUpDown, BellOff, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

export function RFIDReaderListing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = rfidReaders.filter(
    (r) => !searchQuery || r.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((r) => r.id)));
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["System Hardware Management", "RFID Reader Listing"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">RFID Reader Listing</h1>
          <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
            Add RFID Reader
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium">
                <BellOff size={14} />
                Alarm Off
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium">
                <Bell size={14} />
                Alarm On
              </button>
              <button
                className={cn(
                  "flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border transition-colors",
                  selected.size > 0
                    ? "text-red-500 border-red-200 hover:bg-red-50"
                    : "text-gray-400 border-gray-200 cursor-not-allowed"
                )}
                disabled={selected.size === 0}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selected.size === paginated.length && paginated.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-12">No</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Display Name
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[180px]">Reader MAC Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[100px]">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[100px]">Arm Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Serial Number
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[130px]">IP Address</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((reader, idx) => (
                  <tr key={reader.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(reader.id)}
                        onChange={() => toggleSelect(reader.id)}
                        className="rounded border-gray-300 accent-brand-primary"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{reader.displayName}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-mono">{reader.macAddress}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5 bg-green-50 text-green-600 border-green-200">
                        {reader.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5 bg-green-50 text-green-600 border-green-200">
                        {reader.armStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-mono">{reader.serialNumber}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-mono">{reader.ipAddress}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Pencil size={15} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            current={currentPage}
            total={totalPages}
            perPage={PER_PAGE}
            totalItems={filtered.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
