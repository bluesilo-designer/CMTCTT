import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage?: (n: number) => void;
  totalItems: number;
  isLoading?: boolean;
}

export function Pagination({ currentPage, setCurrentPage, itemsPerPage, totalItems, isLoading = false }: PaginationProps) {
  const total = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Entries per page</span>
        <span className="font-medium text-gray-700">{itemsPerPage}</span>
        <span className="ml-4">
          {from} - {to} of {totalItems} entries
        </span>
      </div>
      <div className="flex items-center gap-1">
        <PageBtn onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || isLoading}>
          <ChevronsLeft size={14} />
        </PageBtn>
        <PageBtn onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 || isLoading}>
          <ChevronLeft size={14} />
        </PageBtn>
        <span className="flex items-center gap-1 text-sm px-2">
          <span className="font-medium">{currentPage}</span>
          <span className="text-gray-400">of {total}</span>
        </span>
        <PageBtn onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === total || isLoading}>
          <ChevronRight size={14} />
        </PageBtn>
        <PageBtn onClick={() => setCurrentPage(total)} disabled={currentPage === total || isLoading}>
          <ChevronsRight size={14} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded border text-gray-500 transition-colors",
        disabled
          ? "opacity-30 cursor-not-allowed"
          : "hover:bg-gray-100 hover:border-gray-300"
      )}
    >
      {children}
    </button>
  );
}
