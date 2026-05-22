import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { ranks } from "@/data/userManagement";
import { Search, Trash2, MoreVertical, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const PER_PAGE = 10;

export function RankPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = ranks.filter(
    (r) => !searchQuery || r.rank.toLowerCase().includes(searchQuery.toLowerCase())
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
          <Breadcrumb items={["Rank"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Rank</h1>
          <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
            Add Rank
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">
                    <div className="flex items-center gap-1">
                      Sequence
                      <ArrowUpDown size={12} className="text-gray-400" />
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <Search size={12} className="text-gray-400" />
                      Rank
                    </div>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">Created By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">Created On</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-primary w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((rank) => (
                  <tr key={rank.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(rank.id)}
                        onChange={() => toggleSelect(rank.id)}
                        className="rounded border-gray-300 accent-brand-primary"
                      />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{rank.sequence}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-800 font-medium">{rank.rank}</td>
                    <td className="px-4 py-3.5 text-sm">
                      <div className="text-gray-800">{rank.createdBy}</div>
                      <div className="text-gray-400 text-xs">{rank.createdByRole}</div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 whitespace-pre-line">
                      {rank.createdOn}
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
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
