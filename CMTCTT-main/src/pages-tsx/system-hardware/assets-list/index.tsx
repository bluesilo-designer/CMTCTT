import { useState } from "react";
import { assets } from "@/data/systemHardware";
import { Button } from "@/components/button";
import { AssetsToolbar } from "./components/AssetsToolbar";
import { AssetsTable } from "./components/AssetsTable";
import { FilterDrawer } from "./components/FilterDrawer";
import { EditAssetModal } from "./modals/EditAssetModal";
import { TAB_STATUS_MAP, type Tab } from "./types";
import type { Asset } from "@/data/systemHardware";

export function AssetsList({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("Overall");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const tabFiltered =
    activeTab === "Overall" || activeTab === "No RFI"
      ? assets
      : assets.filter((a) => a.status === TAB_STATUS_MAP[activeTab]);

  const filtered = tabFiltered.filter(
    (a) =>
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
        />
      )}

      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-5 gap-3">
          <h1 className="text-xl font-semibold text-brand-primary">Asset List</h1>
          <Button
            onClick={() => onNavigate?.("/system-hardware/asset-creation")}
            className="flex items-center w-fit gap-1.5 px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-semibold shadow-sm transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Add Asset
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <AssetsToolbar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onOpenFilters={() => setShowFilters(true)}
            allAssets={assets}
          />

          <AssetsTable
            data={filtered}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onEdit={(asset) => setEditingAsset(asset)}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <FilterDrawer isOpen={showFilters} onClose={() => setShowFilters(false)} />
    </div>
  );
}
