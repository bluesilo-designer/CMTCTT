import { useState, useRef, useEffect } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Pagination } from "@/components/ui/Pagination";
import { users } from "@/data/userManagement";
import type { UserRoleType, AccountStatus } from "@/data/userManagement";
import { Search, Eye, MoreVertical, ArrowUpDown, X, ChevronDown, Eye as EyeIcon, EyeOff, User, Shield, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type TabType = "Overall" | UserRoleType | "Archived";
const tabs: TabType[] = ["Overall", "System Admin", "Operator", "Instructor", "Maintainer", "Archived"];

const RANKS = ["REC", "PTE", "LCP", "CPL", "CFC", "3SG", "2SG", "1SG", "SSG", "MSG", "3WO", "2WO", "1WO", "MWO", "SWO", "CWO", "2LT", "LTA", "CPT", "MAJ", "LTC", "SLTC", "COL", "BG", "MG", "LG"];
const ROLES: UserRoleType[] = ["System Admin", "Operator", "Instructor", "Maintainer"];

const PER_PAGE = 10;

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(pw: string) {
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  return checks.filter(Boolean).length;
}

// ── Custom Dropdown ───────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, options, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; placeholder: string; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div ref={ref} className="relative">
        <button type="button" onClick={() => setOpen(!open)}
          className={cn("w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white transition-colors",
            open ? "border-brand-primary ring-1 ring-brand-primary/20" : "border-gray-200 hover:border-gray-300",
            value ? "text-gray-800" : "text-gray-400")}>
          <span>{value || placeholder}</span>
          <ChevronDown size={14} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-52 overflow-y-auto">
            {options.map((opt) => (
              <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <span>{opt}</span>
                {value === opt && <Check size={13} className="text-brand-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add User Drawer ───────────────────────────────────────────────────────────
function AddUserDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [nric, setNric] = useState("");
  const [unitName, setUnitName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const strength = getStrength(password);
  const strengthLabel = ["", "Weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const pwChecks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
    { label: "One number", ok: /\d/.test(password) },
    { label: "One special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const canSubmit = name && rank && nric && unitName && role && strength >= 4;

  const reset = () => { setName(""); setRank(""); setNric(""); setUnitName(""); setRole(""); setPassword(""); setShowPw(false); };

  const handleClose = () => { reset(); onClose(); };

  return (
    <>
      {/* Backdrop */}
      <div className={cn("fixed inset-0 bg-black/30 z-40 transition-opacity duration-200", open ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={handleClose} />

      {/* Drawer */}
      <div className={cn("fixed top-0 right-0 h-full w-[480px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full")}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Add New User</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fill in the user information below</p>
          </div>
          <button type="button" onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
              <User size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Profile Photo</p>
              <p className="text-xs text-gray-400 mt-0.5">Optional · JPG, PNG up to 2MB</p>
              <button type="button" className="mt-1.5 text-xs text-brand-primary hover:underline font-medium">Upload photo</button>
            </div>
          </div>

          {/* Section: Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-brand-primary/10 flex items-center justify-center">
                <User size={11} className="text-brand-primary" />
              </div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Personal Information</span>
            </div>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-400" />
              </div>

              {/* Rank + NRIC */}
              <div className="grid grid-cols-2 gap-3">
                <SelectField label="Rank" value={rank} onChange={setRank} options={RANKS} placeholder="Select rank" required />
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    NRIC <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={nric} onChange={(e) => setNric(e.target.value)}
                    placeholder="e.g. S1234567A"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-400" />
                </div>
              </div>

              {/* Unit Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Unit Name <span className="text-red-500">*</span>
                </label>
                <input type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)}
                  placeholder="e.g. SAR1, SAR8"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-400" />
              </div>
            </div>
          </div>

          {/* Section: Account Settings */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-brand-primary/10 flex items-center justify-center">
                <Shield size={11} className="text-brand-primary" />
              </div>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Account Settings</span>
            </div>
            <div className="space-y-4">
              <SelectField label="User Role" value={role} onChange={setRole} options={ROLES} placeholder="Select role" required />

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary placeholder-gray-400" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={15} /> : <EyeIcon size={15} />}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="mt-2.5">
                    {/* Strength bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i <= strength ? strengthColor : "bg-gray-200")} />
                        ))}
                      </div>
                      <span className={cn("text-xs font-semibold",
                        strength <= 2 ? "text-red-500" : strength === 3 ? "text-yellow-500" : strength === 4 ? "text-blue-500" : "text-green-600")}>
                        {strengthLabel}
                      </span>
                    </div>
                    {/* Checks */}
                    <div className="grid grid-cols-2 gap-1">
                      {pwChecks.map((c) => (
                        <div key={c.label} className={cn("flex items-center gap-1.5 text-xs", c.ok ? "text-green-600" : "text-gray-400")}>
                          <Check size={11} className={c.ok ? "text-green-500" : "text-gray-300"} />
                          {c.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
          <button type="button" onClick={handleClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="button" disabled={!canSubmit}
            className={cn("flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors",
              canSubmit ? "bg-brand-primary hover:bg-brand-primary-hover" : "bg-gray-200 cursor-not-allowed text-gray-400")}>
            Create User
          </button>
        </div>
      </div>
    </>
  );
}

// ── User List ─────────────────────────────────────────────────────────────────
export function UserList({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [activeTab, setActiveTab] = useState<TabType>("Overall");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = users.filter((u) => {
    const matchesTab =
      activeTab === "Overall"
        ? u.accountStatus !== "Archived"
        : activeTab === "Archived"
        ? u.accountStatus === "Archived"
        : u.userRole === (activeTab as UserRoleType);
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const handleTabChange = (tab: TabType) => { setActiveTab(tab); setCurrentPage(1); };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["User List"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">User List</h1>
          <button onClick={() => setDrawerOpen(true)}
            className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
            Add User
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tabs + Search */}
          <div className="flex items-center justify-between px-5 border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button key={tab} onClick={() => handleTabChange(tab)}
                  className={cn("px-4 py-3.5 text-sm font-medium transition-colors relative whitespace-nowrap",
                    activeTab === tab ? "text-brand-primary" : "text-gray-500 hover:text-gray-700")}>
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-red-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-10">No</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[160px]">
                    <div className="flex items-center gap-1">User ID <ArrowUpDown size={12} className="text-gray-400" /></div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[80px]">
                    <div className="flex items-center gap-1"><Search size={12} className="text-gray-400" />Rank</div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[140px]">
                    <div className="flex items-center gap-1"><Search size={12} className="text-gray-400" />Name</div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[110px]">NRIC</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[110px]">
                    <div className="flex items-center gap-1"><Search size={12} className="text-gray-400" />Unit Name</div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[120px]">
                    <div className="flex items-center gap-1"><Search size={12} className="text-gray-400" />User Role</div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary min-w-[110px]">Account S...</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user, idx) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-700">{(currentPage - 1) * PER_PAGE + idx + 1}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{user.userId}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{user.rank}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-800 font-medium">{user.name}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{user.nric}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{user.unitName}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{user.userRole}</td>
                    <td className="px-5 py-3.5"><AccountStatusBadge status={user.accountStatus} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onNavigate?.("/user-management/user-detail")} className="text-gray-400 hover:text-gray-600">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination current={currentPage} total={totalPages} perPage={PER_PAGE} totalItems={filtered.length} onPageChange={setCurrentPage} />
        </div>
      </div>

      <AddUserDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}

function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border text-xs font-medium px-2.5 py-0.5",
      status === "Active" ? "bg-green-50 text-green-600 border-green-200"
        : status === "Inactive" ? "bg-gray-100 text-gray-500 border-gray-200"
        : "bg-yellow-50 text-yellow-600 border-yellow-200")}>
      {status}
    </span>
  );
}
