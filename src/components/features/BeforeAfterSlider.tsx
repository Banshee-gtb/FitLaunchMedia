import React, { useRef, useState, useCallback } from "react";
import ScrollReveal from "@/components/features/ScrollReveal";
import athlete2Img from "@/assets/athlete-2.jpg";
import athlete3Img from "@/assets/athlete-3.jpg";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(45);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPct((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const handleMove = (ev: MouseEvent) => { if (dragging.current) move(ev.clientX); };
    const handleUp = () => { dragging.current = false; window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  const onTouchMove = (e: React.TouchEvent) => move(e.touches[0].clientX);

  return (
    <section className="py-24 bg-white" aria-label="Before and after">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="section-label mb-4">TRANSFORMATION</p>
          <h2 className="section-heading text-ink mb-4">
            BEFORE <span className="text-mint-dark">&</span> AFTER
          </h2>
          <p className="text-light-muted max-w-md mx-auto">
            Drag the slider to compare. <span className="text-ink/40 text-xs font-display font-bold">FITLAUNCH DEMO — not a real client project.</span>
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            ref={containerRef}
            className="relative rounded-3xl overflow-hidden select-none cursor-col-resize shadow-xl border border-ink/8"
            style={{ aspectRatio: "16/7" }}
            onMouseDown={onMouseDown}
            onTouchMove={onTouchMove}
            onTouchStart={e => move(e.touches[0].clientX)}
            role="img"
            aria-label="Before and after comparison slider"
          >
            {/* AFTER */}
            <div className="absolute inset-0">
              <img src={athlete3Img} alt="After — FitLaunch demo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-obsidian/40 to-transparent" />
              <div className="absolute bottom-6 right-6 glass-panel rounded-xl px-4 py-2">
                <span className="text-mint text-xs font-display font-bold tracking-wider">AFTER — FITLAUNCH</span>
              </div>
            </div>

            {/* BEFORE */}
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
              <img src={athlete2Img} alt="Before — demo" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / pct}%`, maxWidth: "none" }} />
              <div className="absolute inset-0 bg-gradient-to-br from-obsidian/60 via-obsidian/20 to-transparent" style={{ filter: "saturate(0.3)" }} />
              <div className="absolute bottom-6 left-6 glass-panel rounded-xl px-4 py-2">
                <span className="text-muted-slate text-xs font-display font-bold tracking-wider">BEFORE</span>
              </div>
            </div>

            {/* Handle */}
            <div
              className="absolute top-0 bottom-0 z-10 flex items-center justify-center"
              style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
            >
              <div className="w-px h-full bg-white/50" />
              <div className="absolute w-10 h-10 rounded-full bg-white shadow-xl border-2 border-white/80 flex items-center justify-center cursor-col-resize">
                <svg viewBox="0 0 20 20" className="w-5 h-5 text-ink">
                  <path d="M7 4L3 10l4 6M13 4l4 6-4 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
