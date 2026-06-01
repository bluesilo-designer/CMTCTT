import { useState, useEffect, useRef } from "react";
import { GripVertical } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const NAV_KEY = "trms_nav";
const POS_KEY = "trms_nav_pos";
export type NavVer = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";

function clamp(x: number, y: number) {
  return {
    x: Math.max(0, Math.min(window.innerWidth  - 130, x)),
    y: Math.max(0, Math.min(window.innerHeight -  44, y)),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function NavSwitcher() {
  const [current, setCurrent] = useState<NavVer>(
    () => (localStorage.getItem(NAV_KEY) as NavVer) ?? "v2"
  );
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ x: number; y: number }>({ x: 80, y: -1 });

  const posRef   = useRef<{ x: number; y: number }>({ x: 80, y: -1 });
  const dragging = useRef(false);
  const dragOff  = useRef({ dx: 0, dy: 0 });

  // ── Sync with external nav change events ───────────────────────────────────
  useEffect(() => {
    const handler = () => setCurrent((localStorage.getItem(NAV_KEY) as NavVer) ?? "v2");
    window.addEventListener("trms_nav_change", handler);
    return () => window.removeEventListener("trms_nav_change", handler);
  }, []);

  // ── Init position ───────────────────────────────────────────────────────────
  useEffect(() => {
    let init: { x: number; y: number };
    try {
      const raw = localStorage.getItem(POS_KEY);
      init = raw ? JSON.parse(raw) : { x: 80, y: window.innerHeight - 72 };
    } catch {
      init = { x: 80, y: window.innerHeight - 72 };
    }
    const clamped = clamp(init.x, init.y);
    posRef.current = clamped;
    setPos(clamped);
  }, []);

  // ── Close on outside click ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const el = document.getElementById("nav-switcher-root");
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // ── Global drag events ──────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const c = clamp(e.clientX - dragOff.current.dx, e.clientY - dragOff.current.dy);
      posRef.current = c;
      setPos({ ...c });
    };
    const onUp = () => {
      if (dragging.current) {
        dragging.current = false;
        localStorage.setItem(POS_KEY, JSON.stringify(posRef.current));
      }
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",   onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onUp);
    };
  }, []);

  // ── Clamp on resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      setPos(prev => {
        const c = clamp(prev.x, prev.y);
        posRef.current = c;
        return c;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const select = (v: NavVer) => {
    localStorage.setItem(NAV_KEY, v);
    window.dispatchEvent(new CustomEvent("trms_nav_change"));
    setOpen(false);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    dragOff.current  = { dx: e.clientX - posRef.current.x, dy: e.clientY - posRef.current.y };
    setOpen(false);
    e.preventDefault();
    e.stopPropagation();
  };

  const options: { value: NavVer; label: string; color: string }[] = [
    { value: "v1", label: "Classic",    color: "bg-gray-400"  },
    { value: "v2", label: "Dark",       color: "bg-[#1C1C2E]" },
    { value: "v3", label: "Brand Red",  color: "bg-[#7A1515]" },
    { value: "v4", label: "Brand Navy", color: "bg-[#1A3A6B]" },
    { value: "v5", label: "Forest",     color: "bg-[#1E4A2E]" },
    { value: "v6", label: "Slate",      color: "bg-[#334155]" },
    { value: "v7", label: "Midnight",   color: "bg-[#0F172A]" },
  ];

  const openUpward = pos.y > window.innerHeight * 0.55;

  if (pos.y === -1) return null;

  return (
    <div
      id="nav-switcher-root"
      className="fixed z-50 flex items-center gap-1 select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* ── Drag handle ── */}
      <button
        type="button"
        onMouseDown={handleDragStart}
        className="flex items-center justify-center w-5 h-8 rounded text-gray-300 hover:text-gray-400 cursor-grab active:cursor-grabbing transition-colors"
        title="Drag to reposition"
        tabIndex={-1}
      >
        <GripVertical size={13} />
      </button>

      {/* ── Toggle button + dropdown ── */}
      <div className="relative">
        {open && (
          <div
            className={`absolute left-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden w-44 z-10 ${
              openUpward ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
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
                  <span className="ml-auto text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded font-bold">
                    ON
                  </span>
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
            <rect x="3"  y="3"  width="7" height="18" rx="1"/>
            <rect x="14" y="3"  width="7" height="5"  rx="1"/>
            <rect x="14" y="12" width="7" height="5"  rx="1"/>
          </svg>
          <span className="text-xs uppercase">{current}</span>
        </button>
      </div>
    </div>
  );
}
