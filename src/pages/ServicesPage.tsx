import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Monitor, CalendarCheck, TrendingUp,
  Users, Trophy, BarChart2, CheckCircle2
} from "lucide-react";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Monitor, CalendarCheck, TrendingUp, Users, Trophy, BarChart2,
};

export default function ServicesPage() {
  const { services } = useStore();
  const visible = services.filter(s => s.status === "PUBLISHED" || s.status === "APPROVED").sort((a, b) => a.order - b.order);

  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />

      {/* Hero */}
      <section className="py-20 bg-obsidian relative">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-2xl">
            <p className="section-label-light mb-4">WHAT WE BUILD</p>
            <h1 className="section-heading text-off-white mb-6">
              OUR <span className="text-mint">SERVICES</span>
            </h1>
            <p className="text-muted-slate text-lg leading-relaxed max-w-lg">
              Every service we offer is built around the reality of running a sports business — not generic digital agency thinking.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services grid — light */}
      <section className="py-24 bg-light-bg">
        <div className="absolute inset-0 bg-grid-light pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visible.map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.icon] || Monitor;
              return (
                <ScrollReveal key={svc.id} delay={i * 80}>
                  <div className="card-light p-10 h-full flex flex-col group">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="p-4 bg-mint-dark/8 rounded-2xl group-hover:bg-mint-dark/15 transition-colors duration-300 flex-shrink-0">
                        <Icon className="w-6 h-6 text-mint-dark" />
                      </div>
                      <div>
                        <h2 className="font-heading font-extrabold text-ink text-2xl mb-2 group-hover:text-mint-dark transition-colors duration-300">
                          {svc.title}
                        </h2>
                        <p className="text-light-muted leading-relaxed">{svc.shortDescription}</p>
                      </div>
                    </div>
                    {svc.longDescription && (
                      <p className="text-light-muted text-sm leading-relaxed mb-6 border-t border-ink/5 pt-6">
                        {svc.longDescription}
                      </p>
                    )}
                    {svc.features.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8 flex-1">
                        {svc.features.map(f => (
                          <li key={f} className="flex items-center gap-2 text-sm text-light-muted">
                            <CheckCircle2 className="w-4 h-4 text-mint-dark flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-display font-bold tracking-wider text-mint-dark hover:gap-4 transition-all duration-200 uppercase">
                      {svc.ctaLabel || "Learn More"} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — Dark */}
      <section className="py-20 bg-deep-slate">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-heading text-off-white mb-6">
              READY TO BUILD YOUR<br /><span className="text-mint">DIGITAL HOME?</span>
            </h2>
            <Link to="/contact" className="btn-primary">
              START A PROJECT <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
