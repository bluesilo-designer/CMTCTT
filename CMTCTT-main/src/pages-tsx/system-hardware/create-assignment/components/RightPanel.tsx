import type { RightPanelProps } from "../types";

export function RightPanel({ bookingData }: RightPanelProps) {
  const bd = bookingData;
  if (!bd) return null;

  const weapons: any[] = bd.weaponList || [];
  const totalUnits = weapons.reduce((s: number, w: any) => s + w.quantity, 0);

  return (
    <div className="w-1/2 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <p className="text-sm font-bold text-gray-800">Weapons to Withdraw</p>
          {weapons.length > 0 && (
            <p className="text-xs text-gray-400 mt-0.5">
              {weapons.length} weapon type{weapons.length > 1 ? "s" : ""} &middot;{" "}
              {totalUnits} unit{totalUnits !== 1 ? "s" : ""} total
            </p>
          )}
        </div>

        {/* Weapon cards */}
        <div className="p-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
          {weapons.length === 0 ? (
            <div className="py-8 flex flex-col items-center text-center text-gray-400">
              <svg
                className="w-8 h-8 mb-2 text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-xs">No weapon data</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {weapons.map((w: any, i: number) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 overflow-hidden"
                >
                  {/* Weapon name bar */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#7A1515"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-gray-800 truncate">{w.type}</span>
                  </div>
                  {/* Qty to withdraw */}
                  <div className="px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Qty</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-brand-primary leading-none">
                        {w.quantity}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        unit{w.quantity !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
