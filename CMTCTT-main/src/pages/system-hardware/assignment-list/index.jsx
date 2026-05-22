import { useState } from "react";
import { assignments } from "@/data/systemHardware";
import { Button } from "@/components/button";
import { AssignmentToolbar } from "./components/AssignmentToolbar";
import { AssignmentTable } from "./components/AssignmentTable";
import { ReadyForReturnModal } from "./modals/ReadyForReturnModal";
import { TAB_STATUS_MAP } from "./types";
export function AssignmentList({ onNavigate }) {
    const [activeTab, setActiveTab] = useState("Overall");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const returnCandidates = assignments.filter((a) => a.status === "Issued" || a.status === "Pending Return");
    const tabFiltered = activeTab === "Overall"
        ? assignments
        : assignments.filter((a) => a.status === TAB_STATUS_MAP[activeTab]);
    const filtered = tabFiltered.filter((a) => !searchQuery || a.assignmentId.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };
    const handleSearchChange = (q) => {
        setSearchQuery(q);
        setCurrentPage(1);
    };
    return (<div className="flex-1 overflow-auto bg-gray-50">
      {showReturnModal && (<ReadyForReturnModal candidates={returnCandidates} onClose={() => setShowReturnModal(false)}/>)}

      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-3">
          <h1 className="text-xl font-semibold text-brand-primary">Assignment List</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {returnCandidates.length > 0 && (<Button onClick={() => setShowReturnModal(true)} className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-semibold transition-colors bg-white">
                Ready for Return Assets
              </Button>)}
            <Button onClick={() => onNavigate?.("/system-hardware/create-assignment")} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 font-semibold shadow-sm transition-colors">
              <span className="text-base leading-none">+</span>
              Issue Assets
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <AssignmentToolbar activeTab={activeTab} onTabChange={handleTabChange} searchQuery={searchQuery} onSearchChange={handleSearchChange} allAssignments={assignments}/>

          <AssignmentTable data={filtered} currentPage={currentPage} onPageChange={setCurrentPage}/>
        </div>
      </div>
    </div>);
}
