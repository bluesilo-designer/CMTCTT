import { useState, useEffect, useRef } from "react";
import { GripVertical } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────

const ZOOM_LEVELS = [
  { value: 1,    label: "1×",    desc: "Normal"      },
  { value: 1.25, label: "1.25×", desc: "Large"       },
  { value: 1.5,  label: "1.5×",  desc: "Larger"      },
  { value: 2,    label: "2×",    desc: "Extra Large"  },
] as const;

type ZoomValue  = (typeof ZOOM_LEVELS)[number]["value"];
const ZOOM_KEY  = "trms_zoom";
const POS_KEY   = "trms_zoom_pos";

function clamp(x: number, y: number) {
  return {
    x: Math.max(0, Math.min(window.innerWidth  - 130, x)),
    y: Math.max(0, Math.min(window.innerHeight -  44, y)),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ZoomControl() {
  const [zoom, setZoom] = useState<ZoomValue>(() => {
    const saved = parseFloat(localStorage.getItem(ZOOM_KEY) ?? "1");
    return (ZOOM_LEVELS.find(z => z.value === saved)?.value ?? 1) as ZoomValue;
  });
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ x: number; y: number }>({ x: 16, y: -1 });

  const posRef   = useRef<{ x: number; y: number }>({ x: 16, y: -1 });
  const dragging = useRef(false);
  const dragOff  = useRef({ dx: 0, dy: 0 });

  // ── Init position from localStorage ────────────────────────────────────────
  useEffect(() => {
    let init: { x: number; y: number };
    try {
      const raw = localStorage.getItem(POS_KEY);
      init = raw ? JSON.parse(raw) : { x: 16, y: window.innerHeight - 72 };
    } catch {
      init = { x: 16, y: window.innerHeight - 72 };
    }
    const clamped = clamp(init.x, init.y);
    posRef.current = clamped;
    setPos(clamped);
  }, []);

  // ── Apply zoom to page ──────────────────────────────────────────────────────
  useEffect(() => {
    (document.documentElement.style as any).zoom = String(zoom);
    localStorage.setItem(ZOOM_KEY, String(zoom));
  }, [zoom]);

  // ── Close dropdown on outside click ────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const el = document.getElementById("zoom-control-root");
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  // ── Global drag events (no deps — uses refs only) ───────────────────────────
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

  // ── Clamp on window resize ──────────────────────────────────────────────────
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

  // ── Drag start ──────────────────────────────────────────────────────────────
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    dragOff.current  = { dx: e.clientX - posRef.current.x, dy: e.clientY - posRef.current.y };
    setOpen(false);
    e.preventDefault();
    e.stopPropagation();
  };

  const current    = ZOOM_LEVELS.find(z => z.value === zoom)!;
  const openUpward = pos.y > window.innerHeight * 0.55;

  if (pos.y === -1) return null;

  return (
    <div
      id="zoom-control-root"
      className="fixed z-50 flex items-center gap-1 select-none"
      style={{ left: pos.x, top: pos.y, zoom: String(1 / zoom) }}
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
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Text Size</p>
            </div>
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => { setZoom(level.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                  zoom === level.value
                    ? "bg-brand-primary/10 text-brand-primary font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{level.desc}</span>
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  zoom === level.value ? "bg-brand-primary text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  {level.label}
                </span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen(v => !v)}
          title="Text size"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-md border text-sm font-semibold transition-all ${
            open
              ? "bg-brand-primary text-white border-brand-primary"
              : "bg-white text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary"
          }`}
        >
          <span className="text-base leading-none font-bold">A</span>
          <span className="text-xs">{current.label}</span>
        </button>
      </div>
    </div>
  );
}
