import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

const INDUSTRY_IMAGES: Record<string, string> = {
  gyms: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&h=600&fit=crop&q=80",
  "boxing-clubs": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=900&h=600&fit=crop&q=80",
  "fitness-studios": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=600&fit=crop&q=80",
  "football-academies": "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=900&h=600&fit=crop&q=80",
  "sports-clubs": "https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=900&h=600&fit=crop&q=80",
  "sports-organisations": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&h=600&fit=crop&q=80",
};

export default function IndustryPage() {
  const { "*": slug } = useParams();
  const { industries } = useStore();

  // Resolve from URL path segment
  const pathSlug = window.location.pathname.replace("/", "");
  const industry = industries.find(i => i.slug === pathSlug || i.slug === slug);

  if (!industry) {
    return (
      <main className="pt-24 min-h-screen bg-light-bg flex items-center justify-center px-6">
        <PageBackground blur={80} opacity={0.04} />
        <div className="text-center">
          <p className="text-light-muted mb-4">Industry page not found.</p>
          <Link to="/industries" className="btn-primary">VIEW ALL INDUSTRIES</Link>
        </div>
      </main>
    );
  }

  const img = industry.image || INDUSTRY_IMAGES[industry.slug] || INDUSTRY_IMAGES.gyms;

  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />

      {/* Hero — Dark */}
      <section className="py-20 bg-obsidian relative">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="section-label-light mb-4">INDUSTRY</p>
              <h1 className="section-heading text-off-white mb-6">
                <span className="text-mint">{industry.title}</span><br />WEBSITES
              </h1>
              <p className="text-muted-slate text-lg leading-relaxed mb-8">{industry.description}</p>
              <ul className="space-y-3 mb-10">
                {industry.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-off-white/80">
                    <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary">
                BUILD FOR {industry.title.toUpperCase()} <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="rounded-3xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <img src={img} alt={industry.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features — Light */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">WHAT WE BUILD</p>
            <h2 className="section-heading text-ink mb-4">
              YOUR <span className="text-mint-dark">{industry.title.toUpperCase()}</span> DIGITAL PLATFORM
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industry.features.map(f => (
              <ScrollReveal key={f}>
                <div className="card-light p-6 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-mint-dark flex-shrink-0 mt-0.5" />
                  <p className="text-ink font-heading font-semibold text-sm">{f}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-deep-slate">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-heading text-off-white mb-6">
              READY TO BUILD YOUR<br /><span className="text-mint">{industry.title.toUpperCase()} WEBSITE?</span>
            </h2>
            <Link to="/contact" className="btn-primary">START A PROJECT <ArrowRight className="w-4 h-4" /></Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
