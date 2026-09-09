import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FitLaunchMark } from "@/components/features/Logo";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

const STEPS = [
  {
    num: "01", title: "DISCOVER", heading: "Understanding Your World",
    text: "We start every project by understanding your business, your audience, your goals and your competitive landscape. No templates, no assumptions — genuine discovery.",
    details: ["User and audience mapping", "Business goal definition", "Competitive landscape review", "Technical requirements scoping", "Content and functionality audit"],
  },
  {
    num: "02", title: "DESIGN", heading: "Your Visual System",
    text: "We create a visual system that reflects the ambition and identity of your sports business. Sport-appropriate, conversion-focused and built to last.",
    details: ["Brand-aligned visual direction", "UX architecture and wireframes", "Component and interaction design", "Mobile-first responsive design", "Design system documentation"],
  },
  {
    num: "03", title: "ENGINEER", heading: "Building Your Platform",
    text: "We build your digital platform with performance, accessibility and SEO as non-negotiable foundations. Every line of code serves a purpose.",
    details: ["Custom development (no templates)", "Performance-first architecture", "Accessibility compliance", "SEO-ready structure", "CMS integration", "Third-party integrations"],
  },
  {
    num: "04", title: "LAUNCH", heading: "Deployment & QA",
    text: "We test everything before a single user sees it. Structured quality assurance, real-device testing and performance validation precede every launch.",
    details: ["Cross-device and browser testing", "Performance benchmarking", "SEO pre-launch checks", "Content review and approval", "Staged deployment", "Go-live support"],
  },
  {
    num: "05", title: "GROW", heading: "Ongoing Improvement",
    text: "Digital success requires continuous improvement. We work with clients on an ongoing basis to optimise, evolve and grow their digital presence.",
    details: ["Performance monitoring", "Content updates and management", "Feature development", "Analytics and insight review", "Strategic digital support"],
  },
];

export default function ProcessPage() {
  return (
    <main className="pt-24 min-h-screen bg-light-bg">
      <PageBackground blur={80} opacity={0.04} />

      {/* Hero — Dark */}
      <section className="py-20 bg-obsidian relative">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-2xl">
            <p className="section-label-light mb-4">HOW WE WORK</p>
            <h1 className="section-heading text-off-white mb-6">
              THE <span className="text-mint">PROCESS</span>
            </h1>
            <p className="text-muted-slate text-lg leading-relaxed max-w-xl">
              Five stages. No shortcuts. Every FitLaunch project follows the same disciplined process — from discovery to growth.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Steps — alternating light/white */}
      {STEPS.map((step, i) => (
        <section key={step.num} className={`py-20 relative ${i % 2 === 0 ? "bg-light-bg" : "bg-white"}`} aria-label={`Step ${step.num}`}>
          <div className={`absolute inset-0 pointer-events-none ${i % 2 === 0 ? "bg-grid-light" : ""}`} />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
              <ScrollReveal direction={i % 2 === 0 ? "left" : "right"}>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-3xl bg-white border border-ink/8 shadow-md flex items-center justify-center mb-4">
                      <FitLaunchMark size="md" className="opacity-60" />
                    </div>
                    <div className="font-display font-black text-6xl text-mint-dark/15 leading-none">{step.num}</div>
                  </div>
                  <div>
                    <p className="section-label mb-2">{step.title}</p>
                    <h2 className="font-heading font-extrabold text-ink text-3xl mb-4">{step.heading}</h2>
                    <p className="text-light-muted leading-relaxed text-base mb-6">{step.text}</p>
                    <ul className="space-y-2">
                      {step.details.map(d => (
                        <li key={d} className="flex items-center gap-2 text-sm text-light-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint-dark flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction={i % 2 === 0 ? "right" : "left"} className={i % 2 === 1 ? "lg:col-start-1" : ""}>
                <div className="card-light p-10 text-center">
                  <div className="font-display font-black text-9xl text-mint-dark/8 leading-none mb-4">{step.num}</div>
                  <div className="font-display font-black text-3xl tracking-widest text-ink/20 uppercase">{step.title}</div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-deep-slate">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="section-heading text-off-white mb-6">
              READY TO START THE<br /><span className="text-mint">PROCESS?</span>
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
