/**
 * DemoSwitcher — floating data-count switcher for vibe-coding demos.
 *
 * Purpose: quickly toggle the number of dummy records shown (3 / 5 / 10 / 15)
 * so developers can verify UI behaviour at different data sizes.
 *
 * NOT a production feature — do not include in real booking flow requirements.
 */

import { cn } from "@/lib/utils";

export const DEMO_SIZES = [3, 5, 10, 15] as const;
export type  DemoSize   = typeof DEMO_SIZES[number];

export function DemoSwitcher({
  value,
  onChange,
}: {
  value:    DemoSize;
  onChange: (v: DemoSize) => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full shadow-lg px-3 py-1.5 select-none">
      <span className="text-[10px] text-gray-400 font-medium mr-0.5">Show</span>
      {DEMO_SIZES.map(size => (
        <button
          key={size}
          type="button"
          onClick={() => onChange(size)}
          className={cn(
            "px-2.5 py-1 text-xs font-bold rounded-full transition-all",
            value === size
              ? "bg-brand-primary text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
