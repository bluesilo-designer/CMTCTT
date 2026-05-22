import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { TableCustom } from "@/components/table";
import { InputCustom } from "@/components/input";
import { Pagination } from "@/components/ui/Pagination";
import { CoursewareSection } from "./CoursewareSection";
import { DETAIL, NOMINAL_ROLL_PER_PAGE } from "../constants";
export function NominalRollTab({ courseware, setCourseware }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const filtered = DETAIL.trainees.filter((t) => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.nric.includes(searchQuery));
    const totalPages = Math.max(1, Math.ceil(filtered.length / NOMINAL_ROLL_PER_PAGE));
    const paginated = filtered.slice((page - 1) * NOMINAL_ROLL_PER_PAGE, page * NOMINAL_ROLL_PER_PAGE);
    const columns = useMemo(() => [
        {
            header: "#",
            accessorKey: "no",
            cell: (info) => <span className="text-xs text-gray-400">{info.getValue()}</span>,
        },
        {
            header: "Rank",
            accessorKey: "rank",
            cell: (info) => <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-semibold">{info.getValue()}</span>,
        },
        {
            header: "Name",
            accessorKey: "name",
            cell: (info) => <span className="text-sm font-semibold text-gray-800">{info.getValue()}</span>,
        },
        {
            header: "NRIC",
            accessorKey: "nric",
            cell: (info) => <span className="text-xs text-gray-500 font-mono">{info.getValue()}</span>,
        },
        {
            header: "Weapon",
            accessorKey: "weapon",
            cell: (info) => <span className="text-xs text-gray-600">{info.getValue()}</span>,
        },
        {
            header: "Detail",
            accessorKey: "detail",
            cell: (info) => <span className="text-xs text-gray-600">{info.getValue()}</span>,
        },
        {
            header: "Lane",
            accessorKey: "lane",
            cell: (info) => <span className="text-xs text-gray-600">{info.getValue()}</span>,
        },
        {
            header: "Best Attempt",
            accessorKey: "performance",
            cell: (info) => (<span className="text-sm font-semibold text-gray-800">
          {info.getValue()} <span className="text-xs text-gray-400 font-normal">(P)</span>
        </span>),
        },
        {
            header: "Course Results",
            accessorKey: "courseResults",
            cell: (info) => (<span className="text-sm font-bold text-brand-primary">
          {info.getValue()} <span className="text-xs font-normal text-gray-400">(M)</span>
        </span>),
        },
    ], []);
    return (<div className="p-6">
      <CoursewareSection courseware={courseware} setCourseware={setCourseware}/>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-800">
            Nominal Roll
            <span className="ml-2 text-xs font-normal text-gray-400">({DETAIL.totalTrainees} trainees)</span>
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10"/>
            <InputCustom type="text" placeholder="Search trainee…" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-44 focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"/>
          </div>
        </div>
        <TableCustom data={paginated} columns={columns} autoScrollTable={true} classThead="bg-red-50/70" classTheadTh="text-brand-primary text-xs font-bold py-3 px-4 whitespace-nowrap" classTBodyTd="px-4 py-3 h-auto"/>
        <Pagination currentPage={page} itemsPerPage={NOMINAL_ROLL_PER_PAGE} totalItems={filtered.length} setCurrentPage={setPage}/>
      </div>
    </div>);
}
