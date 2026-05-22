import { useState } from "react";
import { Calendar } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { TableCustom } from "@/components/table";
import { InputCustom } from "@/components/input";
import { Pagination } from "@/components/ui/Pagination";
import { SortIcon, nextSort, sortBy } from "@/lib/sortUtils";

const PER_PAGE = 10;

const activityLogs = [
  { id: "l1",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:36 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l2",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:31 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l3",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:26 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l4",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:21 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l5",  name: "Olivia Carter", role: "System Admin", module: "SHM", date: "23 Apr 2026\n02:28:18 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been acknowledge and turn off" },
  { id: "l6",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:16 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l7",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:11 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l8",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:06 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l9",  name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:28:01 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l10", name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:27:56 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l11", name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:27:50 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
  { id: "l12", name: "System",        role: "System",       module: "SHM", date: "23 Apr 2026\n02:27:44 AM", description: "Reader ID - 250101-RFR001 : Siren notification has been turn on" },
];

const TOTAL_ITEMS = 7783;

const columnHelper = createColumnHelper();

export function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (field) => {
    const s = nextSort(sortField, field, sortDir);
    setSortField(s.field);
    setSortDir(s.dir);
    setCurrentPage(1);
  };

  const filtered = activityLogs.filter(
    (l) => !searchQuery || l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = sortField ? sortBy(filtered, sortField, sortDir) : filtered;
  const totalPages = Math.ceil(TOTAL_ITEMS / PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const columns = [
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => (
        <div onClick={() => {}}>
          <div className="text-gray-800 font-medium">{info.getValue()}</div>
          <div className="text-gray-400 text-xs">{info.row.original.role}</div>
        </div>
      ),
      minWidth: "160px",
    }),
    columnHelper.accessor("module", {
      header: () => "Module",
      cell: (info) => (
        <div onClick={() => {}}>
          <span className="inline-flex items-center rounded-full text-xs font-semibold px-2.5 py-1 bg-pink-100 text-pink-600">
            {info.getValue()}
          </span>
        </div>
      ),
      minWidth: "120px",
    }),
    columnHelper.accessor("date", {
      header: () => (
        <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-brand-primary-hover transition-colors">
          Date <SortIcon active={sortField === "date"} dir={sortDir} />
        </button>
      ),
      cell: (info) => <div className="text-sm text-gray-700 whitespace-pre-line">{info.getValue()}</div>,
      minWidth: "160px",
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
      cell: (info) => <div className="text-sm text-gray-700">{info.getValue()}</div>,
    }),
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-brand-primary">Activity Log</h1>
            <div className="flex items-center gap-3">
              <InputCustom
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-3 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-56 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
              <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50">
                <Calendar size={14} />
                Select Date
              </button>
            </div>
          </div>

          {/* Table */}
          <TableCustom columns={columns} data={paginated} autoScrollTable={true} />

          <Pagination
            currentPage={currentPage}
            itemsPerPage={PER_PAGE}
            totalItems={TOTAL_ITEMS}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
