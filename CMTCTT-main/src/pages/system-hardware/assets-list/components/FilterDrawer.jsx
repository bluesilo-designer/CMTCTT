import { useState } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/components/checkbox";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { ASSET_TYPES, ASSET_CATEGORIES } from "../constants";
export function FilterDrawer({ isOpen, onClose }) {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const toggleType = (type) => {
        setSelectedTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]);
    };
    const toggleCategory = (cat) => {
        setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
    };
    const totalSelected = selectedTypes.length + selectedCategories.length;
    const allTypesSelected = selectedTypes.length === ASSET_TYPES.length;
    const someTypesSelected = selectedTypes.length > 0 && selectedTypes.length < ASSET_TYPES.length;
    const allCategoriesSelected = selectedCategories.length === ASSET_CATEGORIES.length;
    const someCategoriesSelected = selectedCategories.length > 0 &&
        selectedCategories.length < ASSET_CATEGORIES.length;
    return (<>
      {isOpen && (<div className="fixed inset-0 bg-black/20 z-40" onClick={onClose}/>)}
      <div className={cn("fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg transform transition-transform z-50", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 border-b border-gray-200 gap-3">
          <h2 className="text-lg font-bold text-gray-800">Filters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Total Selected - {totalSelected}
            </h3>
          </div>

          {/* Asset Types */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Asset Types</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={allTypesSelected} indeterminate={someTypesSelected} onChange={() => setSelectedTypes(allTypesSelected ? [] : [...ASSET_TYPES])} size={16}/>
                <span className="text-sm text-gray-700">All</span>
              </label>
              {ASSET_TYPES.map((type) => (<label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedTypes.includes(type)} onChange={() => toggleType(type)} size={16}/>
                  <span className="text-sm text-gray-700">{type}</span>
                </label>))}
            </div>
          </div>

          {/* Asset Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Asset Categories
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={allCategoriesSelected} indeterminate={someCategoriesSelected} onChange={() => setSelectedCategories(allCategoriesSelected ? [] : [...ASSET_CATEGORIES])} size={16}/>
                <span className="text-sm text-gray-700">All</span>
              </label>
              {ASSET_CATEGORIES.map((cat) => (<label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} size={16}/>
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row gap-3">
          <Button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 bg-white">
            Clear
          </Button>
          <Button onClick={onClose} className="flex-1 py-2.5 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover">
            Apply Filters
          </Button>
        </div>
      </div>
    </>);
}
