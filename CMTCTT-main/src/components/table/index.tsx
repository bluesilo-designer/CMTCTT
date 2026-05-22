import React, { Fragment, useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { SaveAll, ChevronDown, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableCustomProps<TData> {
  data?: TData[];
  isLoading?: boolean;
  isFooter?: boolean;
  classThead?: string;
  classTheadTh?: string;
  classTBody?: string;
  classTBodyTd?: string;
  columns?: ColumnDef<TData, any>[];
  autoScrollTable?: boolean;
  className?: string;
  nestedComponentButtonCondition?: (row: any) => any;
  getNestedComponent?: (row: any) => React.ReactNode;
  serverSideSortFn?: (sorting: SortingState) => void;
  actionSticky?: boolean;
  outerClass?: string;
  shadowAction?: boolean;
  tableFixed?: boolean;
  freezeRowWhenExpand?: boolean;
  isNested?: boolean;
  virtualized?: boolean;
  virtualRowHeight?: number;
  virtualOverscan?: number;
}

export function TableCustom<TData>({
  data = [],
  isLoading = false,
  isFooter = false,
  classThead,
  classTheadTh,
  classTBody,
  classTBodyTd,
  columns = [],
  autoScrollTable = true,
  className,
  nestedComponentButtonCondition,
  getNestedComponent,
  serverSideSortFn,
  actionSticky = true,
  outerClass = "",
  shadowAction = true,
  tableFixed = false,
  freezeRowWhenExpand = false,
  virtualized = false,
  virtualRowHeight = 60,
  virtualOverscan = 8,
}: TableCustomProps<TData>) {
  const normalizedColumns = useMemo(() => {
    const usedIds = new Map<string, number>();
    return columns.map((col, index) => {
      // @ts-ignore
      const baseId = col.id || col.accessorKey || `col-${index}`;
      const seen = usedIds.get(baseId) || 0;
      usedIds.set(baseId, seen + 1);
      const uniqueId = seen === 0 ? baseId : `${baseId}-${seen}`;

      if (col.id === uniqueId) return col;
      return { ...col, id: uniqueId };
    });
  }, [columns]);

  const initialSortingState = useMemo(() => {
    return normalizedColumns
      // @ts-ignore
      .filter((col) => col.initialSort)
      .map((col) => ({
        // @ts-ignore
        id: col.accessorKey || col.id,
        // @ts-ignore
        desc: col.initialSort === "desc",
      }));
  }, [normalizedColumns]);

  const [sorting, setSorting] = useState<SortingState>(initialSortingState);
  const [sortedData, setSortedData] = useState<TData[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    columns: normalizedColumns,
    data: sortedData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: typeof serverSideSortFn === "function" ? undefined : getSortedRowModel(),
    onSortingChange: (sort) => {
      setSorting((oldValue) => {
        const newValue = typeof sort === "function" ? sort(oldValue) : sort;
        if (typeof serverSideSortFn === "function") {
          serverSideSortFn(newValue);
        }
        return newValue;
      });
    },
    manualSorting: typeof serverSideSortFn === "function",
    state: { sorting },
  });

  useEffect(() => {
    setSortedData(data);
  }, [data]);

  const isStickyAction = useCallback(
    (columnDef: any) => {
      return actionSticky && (
        columnDef.accessorKey === "action" || 
        columnDef.id === "action" || 
        columnDef.accessorKey === "actions" || 
        columnDef.id === "actions"
      );
    },
    [actionSticky],
  );

  const getCellStyles = useCallback(
    (column: any, customZIndex?: number) => {
      const { width, minWidth, maxWidth } = column.columnDef;
      const isAction = isStickyAction(column.columnDef);
      return {
        width: isAction ? "1%" : width,
        maxWidth: isAction ? "100px" : maxWidth,
        minWidth: isAction ? "60px" : (minWidth || width || "150px"),
        right: isAction ? 0 : "auto",
        zIndex: customZIndex,
      };
    },
    [isStickyAction],
  );

  const getStickyClass = useCallback(
    (columnDef: any) => {
      return isStickyAction(columnDef)
        ? "sticky right-0 shadow-[-4px_0_10px_rgba(0,0,0,0.2)]"
        : "";
    },
    [isStickyAction],
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;
  const isVirtualizationEnabled = virtualized && !getNestedComponent && !freezeRowWhenExpand;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => virtualRowHeight,
    overscan: virtualOverscan,
    enabled: isVirtualizationEnabled,
  });

  const virtualRows = isVirtualizationEnabled ? rowVirtualizer.getVirtualItems() : [];
  const virtualPaddingTop = isVirtualizationEnabled && virtualRows.length > 0 ? virtualRows[0].start : 0;
  const virtualPaddingBottom =
    isVirtualizationEnabled && virtualRows.length > 0
      ? rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
      : 0;

  return (
    <div className={cn(autoScrollTable && "overflow-auto w-full relative", className)}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-white/60">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#912018] rounded-full animate-spin" />
        </div>
      )}
      <div className="flex flex-col w-full h-full">
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex-1",
            autoScrollTable || freezeRowWhenExpand ? "overflow-auto" : "overflow-hidden h-full",
            outerClass,
          )}
        >
          <table
            className={cn(
              "w-full text-sm",
              !autoScrollTable && "h-full",
              tableFixed && "table-fixed",
              actionSticky && shadowAction ? " border-separate border-spacing-0" : " border-spacing-0",
            )}
          >
            <thead
              className={cn("bg-red-50 sticky top-0", getNestedComponent ? "z-[1112]" : "z-[1001]", classThead)}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "font-semibold text-left text-brand-primary py-4 whitespace-nowrap bg-red-50 border-b border-[#EAECF0]",
                        isStickyAction(header.column.columnDef) ? "px-4 text-center" : "px-7",
                        classTheadTh,
                        header.column.getCanSort() && "cursor-pointer select-none",
                        getStickyClass(header.column.columnDef),
                      )}
                      style={getCellStyles(header.column)}
                      onClick={(e: any) => {
                        if (e.target.type === undefined) header.column.getToggleSortingHandler()?.(e);
                      }}
                    >
                      {!header.isPlaceholder && (
                        <div className={cn("flex items-center gap-2", header.column.getCanSort() && "cursor-pointer select-none")}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            desc: <ArrowDown size={14} className="text-[#912018]" />,
                            asc: <ArrowDown size={14} className="text-[#912018] rotate-180" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={normalizedColumns.length} className="py-4 px-7">
                    <div className="text-center w-full sticky left-0">
                      <div className="flex flex-col items-center gap-4 py-8">
                        <div className="relative flex items-center justify-center min-w-12 w-12 h-12">
                          <div className="absolute w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="absolute w-8 h-8 bg-gray-100 rounded-full"></div>
                          <div className="z-10 text-gray-500">
                            <SaveAll width={24} />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-[#344054] font-semibold">No data to show right now!</div>
                          <div className="text-[#667085] text-sm mt-1">
                            This table will be automatically updated once users take action.
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {isVirtualizationEnabled && virtualPaddingTop > 0 && (
                <tr>
                  <td style={{ height: `${virtualPaddingTop}px` }} colSpan={normalizedColumns.length} />
                </tr>
              )}
              {isVirtualizationEnabled
                ? virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    const rowIndex = virtualRow.index;

                    return (
                      <tr key={row.id} className={cn("bg-white", classTBody)}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={cn(
                              "h-[60px] bg-white border-b border-[#EAECF0]",
                              isStickyAction(cell.column.columnDef) ? "px-4 text-center" : "px-7",
                              getStickyClass(cell.column.columnDef),
                              // @ts-ignore
                              cell.column.columnDef.normalWhitespace === "true" ? "" : "whitespace-nowrap",
                              classTBodyTd,
                            )}
                            style={getCellStyles(cell.column, (getNestedComponent ? 1111 : 1000) - rowIndex)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                : rows.map((row, rowIndex) => (
                    <Fragment key={row.id}>
                      <tr className={cn("bg-white hover:bg-gray-50 transition-colors", classTBody)}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={cn(
                              "h-[60px] bg-white border-b border-[#EAECF0]",
                              isStickyAction(cell.column.columnDef) ? "px-4 text-center" : "px-7",
                              freezeRowWhenExpand && expandedRows[row.id] && "sticky top-[56px] z-[200] bg-white border-b border-[#EAECF0]",
                              getStickyClass(cell.column.columnDef),
                              // @ts-ignore
                              cell.column.columnDef.normalWhitespace === "true" ? "" : "whitespace-nowrap",
                              classTBodyTd,
                            )}
                            style={{
                              ...(freezeRowWhenExpand
                                ? { right: isStickyAction(cell.column.columnDef) ? -10 : "auto" }
                                : getCellStyles(cell.column, (getNestedComponent ? 1111 : 1000) - rowIndex)),
                            }}
                          >
                            {/* @ts-ignore */}
                            {isStickyAction(cell.column.columnDef) && getNestedComponent ? (
                              <div className="flex">
                                <button
                                  {...(nestedComponentButtonCondition?.(row) || {})}
                                  className={cn("w-10 h-10 flex items-center justify-center transition-transform duration-300", expandedRows[row.id] && "rotate-180")}
                                  onClick={() => setExpandedRows((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                                >
                                  <ChevronDown size={18} className="text-gray-500" />
                                </button>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            ) : (
                              flexRender(cell.column.columnDef.cell, cell.getContext())
                            )}
                          </td>
                        ))}
                      </tr>
                      {expandedRows[row.id] && getNestedComponent && (
                        <tr>
                          <td colSpan={columns.length} className={freezeRowWhenExpand ? "sticky top-[60px] z-[150] bg-white" : ""}>
                            {getNestedComponent(row)}
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
              {isVirtualizationEnabled && virtualPaddingBottom > 0 && (
                <tr>
                  <td style={{ height: `${virtualPaddingBottom}px` }} colSpan={normalizedColumns.length} />
                </tr>
              )}
            </tbody>
            {isFooter && (
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(getStickyClass(header.column.columnDef), isStickyAction(header.column.columnDef) && "z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1]")}
                        style={{ right: isStickyAction(header.column.columnDef) ? -10 : "auto" }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
