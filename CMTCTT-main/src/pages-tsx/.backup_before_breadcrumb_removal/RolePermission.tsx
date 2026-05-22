import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { permissionGroups, operatorDefaultPerms } from "@/data/userManagement";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = ["System Admin", "Operator", "Instructor", "Maintainer"] as const;
type Role = (typeof ROLES)[number];

type PermState = Record<string, Record<Role, boolean>>;

function buildInitialState(): PermState {
  const state: PermState = {};
  permissionGroups.forEach((g) => {
    g.permissions.forEach((p) => {
      const key = `${g.module}::${p}`;
      state[key] = {
        "System Admin": true,
        Operator: operatorDefaultPerms[key] ?? false,
        Instructor: false,
        Maintainer: false,
      };
    });
  });
  return state;
}

export function RolePermission() {
  const [perms, setPerms] = useState<PermState>(buildInitialState);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleModule = (module: string) =>
    setCollapsed((prev) => ({ ...prev, [module]: !prev[module] }));

  const togglePerm = (key: string, role: Role) => {
    if (role === "System Admin") return;
    setPerms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [role]: !prev[key][role] },
    }));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Permissions"]} />
        </div>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold text-gray-800">Role Permission</h1>
          <button className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-medium">
            Save
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-red-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-primary w-[220px]">
                    Modules
                  </th>
                  {ROLES.map((role) => (
                    <th
                      key={role}
                      className="text-left px-5 py-3 text-xs font-semibold text-brand-primary"
                    >
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionGroups.map((group) => (
                  <>
                    {/* Section header */}
                    <tr
                      key={`${group.module}-header`}
                      className="bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleModule(group.module)}
                    >
                      <td colSpan={5} className="px-5 py-2.5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                          {collapsed[group.module] ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronUp size={14} />
                          )}
                          {group.module}
                        </div>
                      </td>
                    </tr>

                    {/* Permission rows */}
                    {!collapsed[group.module] &&
                      group.permissions.map((perm) => {
                        const key = `${group.module}::${perm}`;
                        return (
                          <tr
                            key={key}
                            className="border-b border-gray-50 hover:bg-gray-50"
                          >
                            <td className="px-5 py-3 text-sm text-gray-600 align-top pt-3">
                              {/* submodule label on first perm only */}
                              {group.permissions.indexOf(perm) === 0
                                ? group.subModule
                                : ""}
                            </td>
                            {ROLES.map((role) => {
                              const checked = perms[key]?.[role] ?? false;
                              const isAdmin = role === "System Admin";
                              return (
                                <td key={role} className="px-5 py-3">
                                  <label
                                    className={cn(
                                      "flex items-center gap-2 text-sm cursor-pointer select-none",
                                      isAdmin
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-gray-700"
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      disabled={isAdmin}
                                      onChange={() => togglePerm(key, role)}
                                      className={cn(
                                        "rounded border-gray-300",
                                        isAdmin
                                          ? "accent-gray-300"
                                          : "accent-brand-primary"
                                      )}
                                    />
                                    {perm}
                                  </label>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
