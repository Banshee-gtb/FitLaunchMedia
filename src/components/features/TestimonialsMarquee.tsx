import React from "react";
import { useStore } from "@/lib/store";
import { FitLaunchMark } from "@/components/features/Logo";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 16 16" className={`w-3 h-3 ${i < count ? "text-mint-dark fill-mint-dark" : "text-ink/10 fill-ink/10"}`}>
          <path d="M8 12.173L3.236 14.764l.927-5.398L.326 5.736l5.418-.787L8 0l2.256 4.949 5.418.787-3.837 3.63.927 5.398z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsMarquee() {
  const { testimonials } = useStore();
  const visible = testimonials.filter(t => t.status === "PUBLISHED" || t.status === "DEMO").sort((a, b) => a.order - b.order);

  if (!visible.length) return null;

  // Duplicate for seamless loop
  const items = [...visible, ...visible];

  return (
    <section className="py-20 bg-light-bg overflow-hidden border-t border-ink/5" aria-label="Testimonials">
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <p className="section-label mb-2">WHAT CLIENTS SAY</p>
        <h2 className="section-heading text-ink">
          TESTIMONIALS <span className="text-mint-dark">—</span>
          <span className="text-ink/25"> DEMO</span>
        </h2>
      </div>
      <div className="flex animate-marquee whitespace-nowrap pause-on-hover" style={{ animationDuration: "40s" }}>
        {items.map((t, i) => (
          <div key={`${t.id}-${i}`} className="inline-block w-80 flex-shrink-0 mr-6 whitespace-normal">
            <div className="card-light p-6 h-full">
              {t.status === "DEMO" && (
                <div className="mb-3">
                  <span className="text-[9px] font-display font-bold px-2 py-0.5 rounded-full bg-ink/5 border border-ink/8 text-light-muted tracking-wider">
                    DEMO TESTIMONIAL
                  </span>
                </div>
              )}
              <Stars count={t.rating} />
              <p className="text-ink/80 text-sm leading-relaxed mt-3 mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-ink/5">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-mint-dark/10 border border-mint-dark/15 flex items-center justify-center flex-shrink-0">
                    <FitLaunchMark size="sm" className="w-4 h-4 opacity-50" />
                  </div>
                )}
                <div>
                  <div className="text-ink text-xs font-heading font-semibold">{t.name}</div>
                  <div className="text-light-muted text-[10px]">{t.role} — {t.organisation}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
