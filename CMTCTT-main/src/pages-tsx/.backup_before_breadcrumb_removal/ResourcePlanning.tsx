import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
const WEAPONS = ["SAR21", "SAR21+M203", "MATADOR", "LMG", "M110", "GPMG", "SPIKE SR", "SPIKE LR", "Comd Bino", "Claymore", "PSLAM", "Drone"] as const;
type Weapon = typeof WEAPONS[number];
type Resource = "pax" | "ports" | "igs" | "monitors";

interface TeamData {
  team: string;
  weapons: Partial<Record<Weapon, number>>;
}

const TEAMS: TeamData[] = [
  { team: "M110 Team (SNIPERS)",  weapons: { M110: 2 } },
  { team: "F.O / OC",             weapons: { "Comd Bino": 1 } },
  { team: "GPMG Team (STEELNET)", weapons: { GPMG: 1, Drone: 2 } },
  { team: "SPIKE SR (MPAT)",      weapons: { "SPIKE SR": 2 } },
  { team: "SPIKE LR (ATGM)",      weapons: { "SPIKE LR": 1 } },
  { team: "MATADOR",              weapons: { MATADOR: 2 } },
  { team: "SECTION Commander",    weapons: { SAR21: 1, Claymore: 1 } },
  { team: "LMG",                  weapons: { LMG: 2 } },
  { team: "SAR21 GUNNER",         weapons: { SAR21: 1 } },
  { team: "M203",                 weapons: { "SAR21+M203": 1, Claymore: 2 } },
  { team: "PSLAM (PIONEER)",      weapons: { PSLAM: 1 } },
];

const SWT_STATIONS = ["SWT1", "SWT2", "SWT3", "SWT4", "SWT5"] as const;
type Station = typeof SWT_STATIONS[number];

// Default weapon-to-resource mapping from Excel table
const DEFAULT_WEAPON_MAPPING: Record<Weapon, Partial<Record<Resource, number>>> = {
  "SAR21": { pax: 1, ports: 1 },
  "SAR21+M203": { pax: 1, ports: 1 },
  "MATADOR": { pax: 1, ports: 1 },
  "LMG": { pax: 1, ports: 1 },
  "M110": { pax: 1, ports: 1 },
  "GPMG": { pax: 1, ports: 1 },
  "SPIKE SR": { pax: 1, ports: 0 },
  "SPIKE LR": { pax: 1, ports: 0 },
  "Comd Bino": { pax: 0, ports: 0, igs: 1 },
  "Claymore": { pax: 0, ports: 1 },
  "PSLAM": { pax: 1, ports: 1 },
  "Drone": { pax: 0, ports: 1, igs: 0, monitors: 1 },
};

// ── Main Component ────────────────────────────────────────────────────────────
export function ResourcePlanning() {
  const [activeStation, setActiveStation] = useState<Station>("SWT1");
  const [stationLimits, setStationLimits] = useState<Record<Station, Record<Resource, number>>>({
    SWT1: { pax: 15, ports: 20, igs: 7, monitors: 2 },
    SWT2: { pax: 15, ports: 20, igs: 7, monitors: 2 },
    SWT3: { pax: 15, ports: 20, igs: 7, monitors: 2 },
    SWT4: { pax: 15, ports: 20, igs: 7, monitors: 2 },
    SWT5: { pax: 15, ports: 20, igs: 7, monitors: 2 },
  });

  const [weaponMapping, setWeaponMapping] = useState<Record<Weapon, Partial<Record<Resource, number>>>>(DEFAULT_WEAPON_MAPPING);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const [teamWeaponCounts, setTeamWeaponCounts] = useState<Record<string, Partial<Record<Weapon, number>>>>({});

  // Calculate resource needs based on selected teams and weapon mapping
  const calculateResourceNeeds = () => {
    const needs: Record<Resource, number> = { pax: 0, ports: 0, igs: 0, monitors: 0 };

    selectedTeams.forEach((teamName) => {
      const team = TEAMS.find((t) => t.team === teamName);
      if (!team) return;

      const weaponCounts = teamWeaponCounts[teamName] || team.weapons;

      Object.entries(weaponCounts).forEach(([weaponName, count]) => {
        const weapon = weaponName as Weapon;
        const mapping = weaponMapping[weapon] || {};

        Object.entries(mapping).forEach(([resource, impact]) => {
          const resourceKey = resource as Resource;
          needs[resourceKey] += (impact || 0) * (count || 0);
        });
      });
    });

    return needs;
  };

  const resourceNeeds = calculateResourceNeeds();
  const limits = stationLimits[activeStation];

  const handleLimitChange = (resource: Resource, value: number) => {
    setStationLimits((prev) => ({
      ...prev,
      [activeStation]: { ...prev[activeStation], [resource]: value },
    }));
  };

  const handleWeaponMappingChange = (weapon: Weapon, resource: Resource, value: number) => {
    setWeaponMapping((prev) => ({
      ...prev,
      [weapon]: { ...prev[weapon], [resource]: value },
    }));
  };

  const toggleTeam = (teamName: string) => {
    setSelectedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(teamName)) {
        next.delete(teamName);
        const newCounts = { ...teamWeaponCounts };
        delete newCounts[teamName];
        setTeamWeaponCounts(newCounts);
      } else {
        next.add(teamName);
        const team = TEAMS.find((t) => t.team === teamName);
        if (team) {
          setTeamWeaponCounts((prev) => ({ ...prev, [teamName]: { ...team.weapons } }));
        }
      }
      return next;
    });
  };

  const handleWeaponCountChange = (teamName: string, weapon: Weapon, count: number) => {
    setTeamWeaponCounts((prev) => ({
      ...prev,
      [teamName]: { ...prev[teamName], [weapon]: count },
    }));
  };

  const isOverLimit =
    resourceNeeds.pax > limits.pax ||
    resourceNeeds.ports > limits.ports ||
    resourceNeeds.igs > limits.igs ||
    resourceNeeds.monitors > limits.monitors;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6 max-w-[1600px]">
        <div className="mb-4">
          <Breadcrumb items={["Resource Planning"]} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-1">Collective Resource Planning</h1>
        <p className="text-sm text-gray-500 mb-5">Configure resource limits and weapon-to-resource mapping per station</p>

        {/* ── Station Selector ── */}
        <div className="mb-6 flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4">
          <label className="text-sm font-semibold text-gray-700">Select Station:</label>
          <select
            value={activeStation}
            onChange={(e) => setActiveStation(e.target.value as Station)}
            className="flex-1 max-w-xs px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          >
            {SWT_STATIONS.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-3 gap-5">
          {/* Left: System Limits Configuration */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">System Limits ({activeStation})</h2>
            <div className="space-y-4">
              {(["pax", "ports", "igs", "monitors"] as Resource[]).map((resource) => (
                <div key={resource}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1 capitalize">
                    {resource === "monitors" ? "Monitors for Drones" : resource.toUpperCase()}
                  </label>
                  <input
                    type="number"
                    value={limits[resource]}
                    onChange={(e) => handleLimitChange(resource, parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Weapon × Resources Mapping */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 overflow-auto max-h-[600px]">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Weapon × Resources</h2>
            <div className="space-y-4">
              {WEAPONS.map((weapon) => (
                <div key={weapon} className="border border-gray-100 rounded-lg p-3 bg-gray-50">
                  <div className="font-semibold text-xs text-gray-800 mb-2">{weapon}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(["pax", "ports", "igs", "monitors"] as Resource[]).map((resource) => (
                      <div key={resource} className="flex flex-col">
                        <label className="text-[10px] text-gray-500 mb-0.5 capitalize">
                          {resource === "monitors" ? "Mon" : resource}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={weaponMapping[weapon]?.[resource] || 0}
                          onChange={(e) => handleWeaponMappingChange(weapon, resource, parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Team Selection & Resource Display */}
          <div className="space-y-5">
            {/* Resource Status */}
            <div className={cn("rounded-xl p-4 border", isOverLimit ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200")}>
              <div className="flex items-center gap-2 mb-2">
                {isOverLimit ? (
                  <AlertTriangle size={16} className="text-red-500" />
                ) : (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                <span className={cn("text-sm font-bold", isOverLimit ? "text-red-700" : "text-green-700")}>
                  {isOverLimit ? "Exceeds Limits" : "Within Limits"}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {isOverLimit
                  ? `Resource usage exceeds station ${activeStation} limits`
                  : `${selectedTeams.size} team(s) selected — all resources within limits`}
              </p>
            </div>

            {/* Resource Usage */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Resource Usage</h3>
              <div className="space-y-2">
                {(["pax", "ports", "igs", "monitors"] as Resource[]).map((resource) => {
                  const used = resourceNeeds[resource];
                  const limit = limits[resource];
                  const pct = Math.min(100, (used / limit) * 100);
                  const over = used > limit;
                  return (
                    <div key={resource}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-600 capitalize">
                          {resource === "monitors" ? "Monitors" : resource.toUpperCase()}
                        </span>
                        <span className={cn("text-xs font-bold", over ? "text-red-600" : "text-gray-700")}>
                          {used} / {limit}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", over ? "bg-red-500" : "bg-green-500")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Teams List */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 max-h-[400px] overflow-y-auto">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Teams ({selectedTeams.size})</h3>
              <div className="space-y-2">
                {TEAMS.map((team) => {
                  const isSelected = selectedTeams.has(team.team);
                  return (
                    <div key={team.team} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleTeam(team.team)}
                        className="w-4 h-4 accent-brand-primary"
                      />
                      <label className={cn("text-xs font-medium flex-1 cursor-pointer", isSelected ? "text-brand-primary font-semibold" : "text-gray-700")}>
                        {team.team}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Team Weapon Configuration ── */}
        {selectedTeams.size > 0 && (
          <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Configure Team Weapons</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Team</th>
                    {WEAPONS.map((weapon) => (
                      <th key={weapon} className="text-center px-3 py-2 font-semibold text-gray-700">{weapon}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(selectedTeams).map((teamName) => {
                    const team = TEAMS.find((t) => t.team === teamName);
                    if (!team) return null;
                    const counts = teamWeaponCounts[teamName] || team.weapons;

                    return (
                      <tr key={teamName} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-800">{teamName}</td>
                        {WEAPONS.map((weapon) => (
                          <td key={weapon} className="text-center px-3 py-2">
                            <input
                              type="number"
                              min="0"
                              value={counts[weapon] || 0}
                              onChange={(e) => handleWeaponCountChange(teamName, weapon, parseInt(e.target.value) || 0)}
                              className="w-12 px-2 py-1 border border-gray-200 rounded text-center text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
