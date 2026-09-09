import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FitLaunchMark } from "@/components/features/Logo";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

export default function AboutPage() {
  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />

      {/* Hero — Dark */}
      <section className="py-20 bg-obsidian relative">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-2xl">
            <p className="section-label-light mb-4">ABOUT</p>
            <h1 className="section-heading text-off-white mb-6">
              WE UNDERSTAND <span className="text-mint">SPORT.</span>
            </h1>
            <p className="text-muted-slate text-lg leading-relaxed max-w-xl">
              FitLaunch Media is a premium technology agency building websites and digital experiences for gyms, fitness brands and sports organisations.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* What we do — Light */}
      <section className="py-24 bg-light-bg relative">
        <div className="absolute inset-0 bg-grid-light pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="section-label mb-4">WHAT WE DO</p>
              <h2 className="font-heading font-extrabold text-ink text-3xl md:text-4xl mb-6 leading-tight">
                Digital homes for sports businesses that want to be taken seriously.
              </h2>
              <p className="text-light-muted leading-relaxed mb-6">
                We build high-performance websites and digital platforms that help gyms, fitness brands and sports organisations present professionally, attract attention and generate enquiries online.
              </p>
              <p className="text-light-muted leading-relaxed mb-8">
                Every project is built from scratch. No generic templates. No shortcuts. Just precise, sport-appropriate digital work that reflects the quality and ambition of the organisations we work with.
              </p>
              <Link to="/contact" className="btn-primary">
                START A PROJECT <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "MOBILE FIRST", text: "Every website is built for the device your members actually use." },
                  { label: "SPORT FOCUSED", text: "We understand how sports audiences think, browse and decide." },
                  { label: "CONVERSION DRIVEN", text: "Every layout decision serves a commercial purpose." },
                  { label: "SEARCH READY", text: "SEO-ready structure, semantic code and metadata from day one." },
                ].map(p => (
                  <div key={p.label} className="card-light p-6">
                    <p className="section-label mb-2 text-[10px]">{p.label}</p>
                    <p className="text-light-muted text-sm leading-relaxed">{p.text}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Brand statement — Dark */}
      <section className="py-24 bg-deep-slate relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-mint pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <div className="flex justify-center mb-8">
              <FitLaunchMark size="lg" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl mb-6 text-off-white">
              The website itself is the first FitLaunch Media case study.
            </h2>
            <p className="text-muted-slate text-base leading-relaxed max-w-2xl mx-auto">
              Every section of this website demonstrates what we build for our clients: clean architecture, sport-focused content, mobile-first experience, conversion-optimised flows and CMS-driven content management.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Values — White */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">HOW WE OPERATE</p>
            <h2 className="section-heading text-ink">
              OUR <span className="text-mint-dark">PRINCIPLES</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "No Templates", text: "Every FitLaunch project is designed and built from scratch. Your website is unique to your brand, your audience and your business goals." },
              { title: "No Invented Claims", text: "We don't invent metrics, client counts, awards or guarantees. If we can't support it with evidence, we don't say it." },
              { title: "No Generic Thinking", text: "Every decision — layout, copy, functionality — is grounded in how sports audiences actually think and behave online." },
            ].map(p => (
              <ScrollReveal key={p.title}>
                <div className="card-light p-8">
                  <h3 className="font-display font-bold text-mint-dark tracking-wider uppercase text-sm mb-4">{p.title}</h3>
                  <p className="text-light-muted leading-relaxed">{p.text}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
