import { useState } from "react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  "Notification Setting",
  "Auto-Archive Setting",
  "IP Whitelisting",
  "Briefing Room",
  "Location",
  "HUMS Interval",
  "RFID Transition Rules",
  "Armskote Transition Rules",
  "Individual Booking",
  "Mask NRIC",
  "System Version",
] as const;

type MenuItem = (typeof MENU_ITEMS)[number];

type NotifTab = "Booking" | "Asset" | "Training" | "User";

const BOOKING_OPTIONS = ["New Booking", "Booking Assignment", "Cancel Booking"];

function NotificationSetting() {
  const [activeTab, setActiveTab] = useState<NotifTab>("Booking");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    "New Booking": true,
    "Booking Assignment": true,
    "Cancel Booking": true,
  });

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-4">Notification Setting</h2>

      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(["Booking", "Asset", "Training", "User"] as NotifTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "text-brand-primary border-brand-primary"
                : "text-gray-400 border-transparent hover:text-gray-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Booking" && (
        <div className="space-y-5">
          {BOOKING_OPTIONS.map((option) => (
            <div key={option}>
              <p className="text-sm font-medium text-gray-700 mb-2">{option}</p>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name={option}
                    checked={enabled[option] === true}
                    onChange={() => setEnabled((p) => ({ ...p, [option]: true }))}
                    className="accent-brand-primary"
                  />
                  Enable
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name={option}
                    checked={enabled[option] === false}
                    onChange={() => setEnabled((p) => ({ ...p, [option]: false }))}
                    className="accent-brand-primary"
                  />
                  Disable
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab !== "Booking" && (
        <div className="py-12 text-center text-gray-400 text-sm">{activeTab} notification settings — coming soon</div>
      )}
    </div>
  );
}

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="py-16 text-center text-gray-400 text-sm">{title} — coming soon</div>
  );
}

export function Settings() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>("Notification Setting");

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Settings"]} />
        </div>

        <div className="flex gap-5">
          {/* Left panel */}
          <div className="w-56 flex-shrink-0 bg-white rounded-lg border border-gray-200 py-2">
            <p className="px-4 py-2 text-sm font-semibold text-gray-800">Settings</p>
            {MENU_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveMenu(item)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-colors",
                  activeMenu === item
                    ? "bg-brand-primary text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right panel */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
            {activeMenu === "Notification Setting" && <NotificationSetting />}
            {activeMenu !== "Notification Setting" && <PlaceholderContent title={activeMenu} />}
          </div>
        </div>
      </div>
    </div>
  );
}
