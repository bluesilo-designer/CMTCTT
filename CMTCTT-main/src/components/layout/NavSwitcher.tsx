import { useState, useEffect } from "react";

const NAV_KEY = "trms_nav";
export type NavVer = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";

export function NavSwitcher() {
  const [current, setCurrent] = useState<NavVer>(
    () => (localStorage.getItem(NAV_KEY) as NavVer) ?? "v2"
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setCurrent((localStorage.getItem(NAV_KEY) as NavVer) ?? "v2");
    window.addEventListener("trms_nav_change", handler);
    return () => window.removeEventListener("trms_nav_change", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const el = document.getElementById("nav-switcher-root");
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const select = (v: NavVer) => {
    localStorage.setItem(NAV_KEY, v);
    window.dispatchEvent(new CustomEvent("trms_nav_change"));
    setOpen(false);
  };

  const options: { value: NavVer; label: string; color: string }[] = [
    { value: "v1", label: "Classic",      color: "bg-gray-400"    },
    { value: "v2", label: "Dark",         color: "bg-[#1C1C2E]"   },
    { value: "v3", label: "Brand Red",    color: "bg-[#7A1515]"   },
    { value: "v4", label: "Brand Navy",   color: "bg-[#1A3A6B]"   },
    { value: "v5", label: "Forest",       color: "bg-[#1E4A2E]"   },
    { value: "v6", label: "Slate",        color: "bg-[#334155]"   },
    { value: "v7", label: "Midnight",     color: "bg-[#0F172A]"   },
  ];

  return (
    <div id="nav-switcher-root" className="fixed bottom-8 left-20 z-50">
      {open && (
        <div className="mb-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden w-44">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Navbar Style</p>
          </div>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                current === opt.value
                  ? "bg-brand-primary/10 text-brand-primary font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className={`w-4 h-4 rounded flex-shrink-0 ${opt.color}`} />
              {opt.label}
              {current === opt.value && (
                <span className="ml-auto text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded font-bold">ON</span>
              )}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        title="Switch navbar"
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-md border text-sm font-semibold transition-all ${
          open
            ? "bg-brand-primary text-white border-brand-primary"
            : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="18" rx="1"/>
          <rect x="14" y="3" width="7" height="5" rx="1"/>
          <rect x="14" y="12" width="7" height="5" rx="1"/>
        </svg>
        <span className="text-xs uppercase">{current}</span>
      </button>
    </div>
  );
}
