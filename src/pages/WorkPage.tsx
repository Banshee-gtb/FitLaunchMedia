import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { FitLaunchMark } from "@/components/features/Logo";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "LIVE", APPROVED: "APPROVED", DEMO: "CONCEPT", DRAFT: "DRAFT",
};

export default function WorkPage() {
  const { projects } = useStore();
  const [filter, setFilter] = useState("ALL");
  const visible = projects.filter(p => p.status !== "DRAFT").sort((a, b) => a.order - b.order);
  const industries = ["ALL", ...Array.from(new Set(visible.map(p => p.industry)))];
  const filtered = filter === "ALL" ? visible : visible.filter(p => p.industry === filter);

  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-light pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-3xl mb-12">
            <p className="section-label mb-4">SELECTED PROJECTS</p>
            <h1 className="section-heading text-ink mb-6">
              OUR <span className="text-mint-dark">WORK</span>
            </h1>
            <p className="text-light-muted text-lg leading-relaxed">
              Projects marked CONCEPT are FitLaunch concept/demo projects and do not represent real client engagements.
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap gap-2 mb-12">
            {industries.map(ind => (
              <button key={ind} onClick={() => setFilter(ind)}
                className={`px-4 py-2 rounded-full border text-xs font-display font-bold tracking-wider uppercase transition-all duration-200 ${
                  filter === ind ? "bg-mint-dark/10 border-mint-dark/30 text-mint-dark" : "bg-white border-ink/10 text-light-muted hover:border-ink/20 hover:text-ink"
                }`}>
                {ind}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((proj, i) => (
              <ScrollReveal key={proj.id} delay={i * 70}>
                <div className="card-light overflow-hidden group h-full flex flex-col">
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                    {proj.coverImage ? (
                      <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-light-bg flex items-center justify-center" style={{ minHeight: 160 }}>
                        <FitLaunchMark size="lg" className="opacity-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="text-[10px] font-display font-bold tracking-wider px-2 py-1 rounded bg-white/80 text-ink/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-[9px] font-display font-bold tracking-wider px-2 py-1 rounded-full border ${
                        proj.status === "DEMO" ? "border-ink/10 bg-white/60 text-ink/40" : "border-mint-dark/30 bg-mint-dark/8 text-mint-dark"
                      }`}>
                        {STATUS_LABELS[proj.status]}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="section-label mb-2 text-[10px]">{proj.industry}</div>
                    <h2 className="font-heading font-extrabold text-ink text-xl mb-3 group-hover:text-mint-dark transition-colors duration-200">{proj.title}</h2>
                    <p className="text-light-muted text-sm leading-relaxed flex-1">{proj.summary}</p>
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-ink/5">
                      {proj.services.slice(0, 2).map(s => (
                        <span key={s} className="text-[10px] font-display font-bold tracking-wider px-2 py-1 rounded-full bg-light-bg border border-ink/8 text-light-muted">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-light-muted">No projects found for this filter.</p>
            </div>
          )}

          <ScrollReveal className="mt-20 text-center">
            <p className="text-light-muted text-sm mb-6">Ready to become a FitLaunch client?</p>
            <Link to="/contact" className="btn-primary">START A PROJECT <ArrowRight className="w-4 h-4" /></Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
