import { useState } from "react";
import { Trash2, Search } from "lucide-react";
import { assetTypes as initialAssetTypes } from "@/data/systemHardware";
import { Button } from "@/components/button";
import { nextSort, sortBy, type SortDir } from "@/lib/sortUtils";
import { AssetTypeTable } from "./components/AssetTypeTable";
import { AddAssetTypeModal } from "./modals/AddAssetTypeModal";
import type { AssetTypeData } from "./types";

export function AssetType() {
  const [assetTypeList, setAssetTypeList] = useState<AssetTypeData[]>(initialAssetTypes);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSort = (field: string) => {
    const s = nextSort(sortField, field, sortDir);
    setSortField(s.field);
    setSortDir(s.dir);
    setCurrentPage(1);
  };

  const filtered = assetTypeList.filter(
    (t) => !searchQuery || t.assetType.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = sortField ? sortBy(filtered, sortField as keyof AssetTypeData, sortDir) : filtered;

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    const PER_PAGE = 10;
    const pageRows = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
    if (pageRows.length > 0 && pageRows.every((t) => selected.has(t.id))) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pageRows.map((t) => t.id)));
    }
  };

  const handleAdd = (t: AssetTypeData) => {
    setAssetTypeList((prev) => [...prev, { ...t, no: prev.length + 1 }]);
  };

  const handleDeleteSelected = () => {
    setAssetTypeList((prev) => prev.filter((t) => !selected.has(t.id)));
    setSelected(new Set());
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-brand-primary">Asset Type</h1>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <Button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 size={14} />
                Delete ({selected.size})
              </Button>
            )}
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-semibold shadow-sm transition-colors"
            >
              <span className="text-base leading-none">+</span>
              Add Asset Type
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center px-5 py-4 border-b border-gray-100">
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
          </div>

          <AssetTypeTable
            data={sorted}
            currentPage={currentPage}
            selected={selected}
            sortField={sortField}
            sortDir={sortDir}
            onPageChange={setCurrentPage}
            onSort={handleSort}
            onToggleSelect={toggleSelect}
            onToggleAll={toggleAll}
          />
        </div>
      </div>

      {/* Modals — parent controls mounting */}
      {showAddModal && (
        <AddAssetTypeModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}
    </div>
  );
}
