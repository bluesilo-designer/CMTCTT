import { Users, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { CoursewareSection } from "./CoursewareSection";
import { DETAIL } from "../constants";
export function DetailListTab({ courseware, setCourseware }) {
    const passedCount = DETAIL.trainees.filter(t => t.resultLabel !== "FAILED").length;
    const failedCount = DETAIL.trainees.filter(t => t.resultLabel === "FAILED").length;
    return (<div className="p-6 space-y-4">
      <CoursewareSection courseware={courseware} setCourseware={setCourseware}/>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Users size={18} className="text-blue-500"/>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{DETAIL.totalTrainees}</div>
            <div className="text-xs text-gray-500">Total Trainees</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <CheckCircle size={18} className="text-green-500"/>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{passedCount}</div>
            <div className="text-xs text-gray-500">Passed (incl. Marksman)</div>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <XCircle size={18} className="text-red-500"/>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{failedCount}</div>
            <div className="text-xs text-gray-500">Failed</div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-3 gap-4">
        {DETAIL.details.map((detail, idx) => {
            const stationTrainees = DETAIL.trainees.filter((_, i) => Math.floor(i / 10) === idx);
            const stationPassed = stationTrainees.filter(t => t.resultLabel !== "FAILED").length;
            const passPct = Math.round((stationPassed / stationTrainees.length) * 100);
            return (<div key={detail.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Card header */}
              <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-xs font-black text-brand-primary">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{detail.id}</div>
                    <div className="text-xs text-gray-400">{detail.traineesCount} trainees</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-600 border border-green-100">
                  {passPct}% pass
                </span>
              </div>

              {/* Stats grid */}
              <div className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Weapon</div>
                    <div className="text-sm font-bold text-gray-700 mt-0.5">{detail.weapon}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Lane</div>
                    <div className="text-sm font-bold text-gray-700 mt-0.5">{detail.lane}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Avg Score</div>
                    <div className="text-sm font-bold text-gray-700 mt-0.5">{detail.avgScore}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Station</div>
                    <div className="text-sm font-bold text-gray-700 mt-0.5">{detail.id}</div>
                  </div>
                </div>

                {/* Pass rate bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-400 font-medium">Pass Rate</span>
                    <span className="text-[10px] font-bold text-green-600">{stationPassed}/{stationTrainees.length}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${passPct}%` }}/>
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 pb-5">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-primary text-brand-primary text-sm font-semibold hover:bg-brand-primary hover:text-white transition-all">
                  View Detail List
                  <ArrowRight size={14}/>
                </button>
              </div>
            </div>);
        })}
      </div>
    </div>);
}
