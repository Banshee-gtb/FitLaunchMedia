import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

export default function IndustriesPage() {
  const { industries } = useStore();
  const visible = industries.filter(i => i.status === "PUBLISHED" || i.status === "APPROVED").sort((a, b) => a.order - b.order);

  const industryImages: Record<string, string> = {
    gyms: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&q=80",
    "boxing-clubs": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&h=400&fit=crop&q=80",
    "fitness-studios": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop&q=80",
    "football-academies": "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&h=400&fit=crop&q=80",
    "sports-clubs": "https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=600&h=400&fit=crop&q=80",
    "sports-organisations": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80",
  };

  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />

      {/* Hero — Dark */}
      <section className="py-20 bg-obsidian relative">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-2xl">
            <p className="section-label-light mb-4">WHO WE BUILD FOR</p>
            <h1 className="section-heading text-off-white mb-6">
              BUILT FOR <span className="text-mint">YOUR SPORT</span>
            </h1>
            <p className="text-muted-slate text-lg leading-relaxed max-w-lg">
              We work with a range of sports businesses, bringing industry-specific knowledge to every project.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Industries grid — light */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map((ind, i) => {
              const img = ind.image || industryImages[ind.slug] || industryImages.gyms;
              return (
                <ScrollReveal key={ind.id} delay={i * 60}>
                  <Link to={`/${ind.slug}`} className="block card-light overflow-hidden group h-full">
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <img src={img} alt={ind.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                    </div>
                    <div className="p-6">
                      <h2 className="font-heading font-extrabold text-ink text-xl mb-3 group-hover:text-mint-dark transition-colors duration-200">{ind.title}</h2>
                      <p className="text-light-muted text-sm leading-relaxed mb-4">{ind.description}</p>
                      {ind.features.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {ind.features.slice(0, 3).map(f => (
                            <li key={f} className="text-xs text-light-muted flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-mint-dark flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="inline-flex items-center gap-1.5 text-mint-dark text-xs font-display font-bold tracking-wider uppercase group-hover:gap-3 transition-all duration-200">
                        EXPLORE <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-deep-slate">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-heading text-off-white mb-6">
              DON'T SEE YOUR SPORT?<br /><span className="text-mint">GET IN TOUCH.</span>
            </h2>
            <Link to="/contact" className="btn-primary">START A PROJECT <ArrowRight className="w-4 h-4" /></Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
