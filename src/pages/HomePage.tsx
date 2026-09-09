import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Monitor, CalendarCheck, TrendingUp,
  Users, Trophy, BarChart2, CheckCircle2, Zap, Shield,
  Search, Globe, Smartphone
} from "lucide-react";
import heroAthleteImg from "@/assets/hero-athlete.jpg";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";
import DigitalSystem from "@/components/features/DigitalSystem";
import BeforeAfterSlider from "@/components/features/BeforeAfterSlider";
import DemoExplorer from "@/components/features/DemoExplorer";
import TestimonialsMarquee from "@/components/features/TestimonialsMarquee";
import ProjectConfigurator from "@/components/features/ProjectConfigurator";
import PageBackground from "@/components/features/PageBackground";
import { FitLaunchMark } from "@/components/features/Logo";

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Monitor, CalendarCheck, TrendingUp, Users, Trophy, BarChart2,
};

const WHY_POINTS = [
  { icon: TrendingUp, title: "DESIGNED FOR CONVERSION", text: "Every layout decision serves a commercial purpose. CTAs, forms and flows are engineered to generate enquiries." },
  { icon: Smartphone, title: "MOBILE FIRST", text: "Sport happens on mobile. Every FitLaunch website is built mobile-first and tested across all screen sizes." },
  { icon: Shield, title: "BUILT FOR SPORT", text: "We understand sports businesses. No generic agency thinking — every decision is grounded in how sports audiences behave." },
  { icon: Zap, title: "FAST BY DEFAULT", text: "Page speed is a ranking factor and a conversion factor. We optimise Core Web Vitals as standard." },
  { icon: Search, title: "SEARCH READY", text: "Semantic structure, metadata and on-page SEO are built in from day one — not bolted on at the end." },
  { icon: Globe, title: "SCALABLE", text: "Start with what you need. Add booking, membership, results and ecommerce as your business grows." },
];

const PROCESS_STEPS = [
  { num: "01", title: "DISCOVER", text: "We map your users, goals and requirements. No generic briefs — every project starts with genuine understanding." },
  { num: "02", title: "DESIGN", text: "We create your visual system and experience. Sport-appropriate, conversion-focused and brand-led." },
  { num: "03", title: "ENGINEER", text: "We build your digital platform. Performance, accessibility and SEO are built in from the ground up." },
  { num: "04", title: "LAUNCH", text: "We test, deploy and optimise. Structured QA, real-device testing and performance validation before go-live." },
  { num: "05", title: "GROW", text: "We continue improving your platform. Ongoing refinement, content updates and performance monitoring." },
];

export default function HomePage() {
  const { settings, services, projects, faqs } = useStore();
  const publishedServices = services.filter(s => s.status === "PUBLISHED" || s.status === "APPROVED").sort((a, b) => a.order - b.order);
  const featuredProjects = projects.filter(p => p.featured && p.status !== "DRAFT").sort((a, b) => a.order - b.order).slice(0, 3);
  const publishedFaqs = faqs.filter(f => f.status === "PUBLISHED").sort((a, b) => a.order - b.order).slice(0, 6);
  const heroLines = (settings.heroHeading || "WE BUILD\nDIGITAL HOMES\nFOR SPORT").split("\n");

  return (
    <main>
      {/* Ambient background image (hero page only – very subtle) */}
      <PageBackground image={settings.heroImageUrl || heroAthleteImg} blur={80} opacity={0.06} />

      {/* ===== HERO — Dark cinematic ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-obsidian pt-20" aria-label="Hero">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 65% 40%, rgba(0,245,160,0.06) 0%, transparent 60%)" }} />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[88vh]">
            {/* Left: Copy */}
            <div className="py-12 lg:py-0">
              <ScrollReveal direction="left">
                <div className="flex items-center gap-2 mb-6">
                  <FitLaunchMark size="sm" />
                  <span className="section-label-light text-[10px]">FITLAUNCH MEDIA / DIGITAL SPORTS SYSTEMS</span>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={80}>
                <h1 className="display-hero text-off-white mb-6" style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}>
                  {heroLines.map((line, i) => (
                    <span key={i} className="block">
                      {i === 1 ? <><span className="text-mint">DIGITAL</span> HOMES</> : line}
                    </span>
                  ))}
                </h1>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={160}>
                <p className="text-muted-slate text-base md:text-lg leading-relaxed max-w-md mb-8">{settings.heroParagraph}</p>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={240}>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link to={settings.heroCta1Link || "/contact"} className="btn-primary">
                    {settings.heroCta1Label || "START A PROJECT"} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to={settings.heroCta2Link || "/work"} className="btn-secondary-dark">
                    {settings.heroCta2Label || "VIEW OUR WORK"}
                  </Link>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="left" delay={320}>
                <div className="flex flex-wrap gap-2">
                  {["Mobile-First", "Sport-Focused", "Conversion-Driven", "Search-Ready"].map(chip => (
                    <span key={chip} className="text-[11px] font-display font-bold tracking-wider px-3 py-1.5 rounded-full bg-elevated border border-white/8 text-muted-slate uppercase">
                      {chip}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Image */}
            <ScrollReveal direction="right" delay={100} className="relative">
              <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <img
                  src={settings.heroImageUrl || heroAthleteImg}
                  alt="Elite athlete training"
                  className="w-full h-full object-cover object-top scale-105 hover:scale-100 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-obsidian/20" />
                <div className="absolute bottom-6 left-6 glass-panel rounded-2xl p-4">
                  <div className="section-label-light mb-1 text-[10px]">YOUR DIGITAL HOME</div>
                  <div className="text-off-white font-heading font-bold text-sm">Engineered for sport.</div>
                </div>
                <div className="absolute top-0 right-0 w-px h-full" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,245,160,0.3) 40%, transparent)" }} />
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 opacity-15">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5 L95 28 L95 72 L50 95 L5 72 L5 28 Z" stroke="#00F5A0" strokeWidth="1.5"/>
                </svg>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-mint" />
          <span className="section-label-light text-[9px]">SCROLL</span>
        </div>
      </section>

      {/* ===== POSITIONING STRIP ===== */}
      <section className="py-6 bg-deep-slate border-y border-white/5 overflow-hidden" aria-label="Positioning">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 4 }).flatMap((_, gi) =>
            ["MOBILE-FIRST", "SPORT-FOCUSED", "PERFORMANCE-DRIVEN", "SEARCH-READY", "CONVERSION-FOCUSED", "SPORT-BUILT"].map(item => (
              <span key={`${gi}-${item}`} className="inline-flex items-center gap-6 mr-12">
                <span className="font-display font-black text-sm tracking-[0.15em] text-muted-slate/60 uppercase">{item}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-mint/40 flex-shrink-0" />
              </span>
            ))
          )}
        </div>
      </section>

      {/* ===== DIGITAL SYSTEM ===== */}
      <DigitalSystem />

      {/* ===== SERVICES — Light ===== */}
      <section className="py-24 bg-light-bg relative" aria-label="Services">
        <div className="absolute inset-0 bg-grid-light opacity-100 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">WHAT WE BUILD</p>
            <h2 className="section-heading text-ink mb-4">
              OUR <span className="text-mint-dark">SERVICES</span>
            </h2>
            <p className="text-light-muted max-w-lg mx-auto text-base">
              Focused digital services for sports businesses. Every capability we offer is built around how gyms, clubs and organisations operate.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedServices.map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.icon] || Monitor;
              return (
                <ScrollReveal key={svc.id} delay={i * 80}>
                  <div className="card-light p-8 h-full flex flex-col group">
                    <div className="p-3 bg-mint-dark/8 rounded-2xl w-fit mb-6 group-hover:bg-mint-dark/15 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-mint-dark" />
                    </div>
                    <h3 className="font-heading font-extrabold text-ink text-xl mb-3 group-hover:text-mint-dark transition-colors duration-300">
                      {svc.title}
                    </h3>
                    <p className="text-light-muted text-sm leading-relaxed flex-1 mb-6">{svc.shortDescription}</p>
                    <ul className="space-y-2 mb-6">
                      {svc.features.slice(0, 3).map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-light-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-mint-dark flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to={svc.ctaLink} className="inline-flex items-center gap-2 text-xs font-display font-bold tracking-wider text-mint-dark hover:gap-3 transition-all duration-200 uppercase">
                      {svc.ctaLabel} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES — White ===== */}
      <section className="py-24 bg-white relative" aria-label="Industries">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">WHO WE BUILD FOR</p>
            <h2 className="section-heading text-ink mb-4">
              BUILT FOR <span className="text-mint-dark">YOUR SPORT</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Gyms", slug: "gyms", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop&q=80", desc: "Membership-driven digital experiences for modern gyms." },
              { title: "Boxing Clubs", slug: "boxing-clubs", img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=500&h=300&fit=crop&q=80", desc: "Disciplined, identity-led websites for boxing." },
              { title: "Fitness Studios", slug: "fitness-studios", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=300&fit=crop&q=80", desc: "Boutique studio platforms that communicate methodology." },
              { title: "Football Academies", slug: "football-academies", img: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=500&h=300&fit=crop&q=80", desc: "Academy platforms for trials, programmes and coaches." },
              { title: "Sports Clubs", slug: "sports-clubs", img: "https://images.unsplash.com/photo-1540747913346-19212a4cf528?w=500&h=300&fit=crop&q=80", desc: "Club websites for fixtures, results and community." },
              { title: "Sports Organisations", slug: "sports-organisations", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop&q=80", desc: "Scalable platforms for governing bodies and leagues." },
            ].map((ind, i) => (
              <ScrollReveal key={ind.slug} delay={i * 60}>
                <Link to={`/${ind.slug}`} className="block card-light overflow-hidden group h-full">
                  <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
                    <img src={ind.img} alt={ind.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-extrabold text-ink text-lg mb-2 group-hover:text-mint-dark transition-colors duration-200">{ind.title}</h3>
                    <p className="text-light-muted text-sm leading-relaxed">{ind.desc}</p>
                    <div className="inline-flex items-center gap-1.5 mt-4 text-mint-dark text-xs font-display font-bold tracking-wider uppercase group-hover:gap-3 transition-all duration-200">
                      EXPLORE <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED WORK — Slate ===== */}
      {featuredProjects.length > 0 && (
        <section className="py-24 bg-light-bg relative" aria-label="Featured work">
          <div className="absolute inset-0 bg-grid-light opacity-100 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <ScrollReveal className="flex items-end justify-between mb-16 flex-wrap gap-6">
              <div>
                <p className="section-label mb-4">SELECTED WORK</p>
                <h2 className="section-heading text-ink">
                  RECENT <span className="text-mint-dark">PROJECTS</span>
                </h2>
              </div>
              <Link to="/work" className="btn-secondary">VIEW ALL WORK</Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredProjects.map((proj, i) => (
                <ScrollReveal key={proj.id} delay={i * 100}>
                  <div className="card-light overflow-hidden group h-full flex flex-col">
                    <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                      {proj.coverImage ? (
                        <img src={proj.coverImage} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-light-bg flex items-center justify-center" style={{ minHeight: 200 }}>
                          <FitLaunchMark size="lg" className="opacity-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="text-[10px] font-display font-bold tracking-wider px-2 py-1 rounded bg-white/80 text-ink/60">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {proj.status === "DEMO" && (
                          <span className="text-[9px] font-display font-bold tracking-wider px-2 py-1 rounded-full border border-ink/15 bg-white/70 text-ink/50">
                            CONCEPT
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="section-label mb-2 text-[10px]">{proj.industry}</div>
                      <h3 className="font-heading font-extrabold text-ink text-xl mb-3 group-hover:text-mint-dark transition-colors duration-200">{proj.title}</h3>
                      <p className="text-light-muted text-sm leading-relaxed flex-1">{proj.summary}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {proj.services.slice(0, 2).map(s => (
                          <span key={s} className="text-[10px] font-display font-bold tracking-wider px-2 py-1 rounded-full bg-light-bg border border-ink/8 text-light-muted">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== BEFORE/AFTER ===== */}
      <BeforeAfterSlider />

      {/* ===== DEMO EXPLORER ===== */}
      <DemoExplorer />

      {/* ===== WHY FITLAUNCH — Off-white ===== */}
      <section className="py-24 bg-white relative" aria-label="Why FitLaunch">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">THE FITLAUNCH DIFFERENCE</p>
            <h2 className="section-heading text-ink">
              WHY CHOOSE <span className="text-mint-dark">FITLAUNCH</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <ScrollReveal key={point.title} delay={i * 80}>
                  <div className="card-light p-8 group">
                    <div className="w-10 h-10 rounded-2xl bg-mint-dark/8 flex items-center justify-center mb-6 group-hover:bg-mint-dark/15 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-mint-dark" />
                    </div>
                    <h3 className="font-display font-bold text-sm text-mint-dark tracking-wider uppercase mb-3">{point.title}</h3>
                    <p className="text-light-muted text-sm leading-relaxed">{point.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BIG STATEMENT — Dark ===== */}
      <section className="py-32 bg-obsidian relative overflow-hidden" aria-label="Statement">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(0,245,160,0.05) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <h2 className="display-large text-off-white leading-none" style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}>
              YOUR MEMBERS<br />
              <span className="text-mint">LIVE ONLINE.</span><br />
              YOUR WEBSITE<br />
              <span className="text-off-white/25">SHOULD TOO.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-12">
              <Link to="/contact" className="btn-primary text-base px-8 py-4">
                START A PROJECT <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PROCESS — Light ===== */}
      <section className="py-24 bg-light-bg relative" aria-label="Process">
        <div className="absolute inset-0 bg-grid-light opacity-100 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">HOW WE WORK</p>
            <h2 className="section-heading text-ink mb-4">
              THE <span className="text-mint-dark">PROCESS</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80} className="relative">
                <div className="text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-ink/8 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:border-mint-dark/30 group-hover:shadow-md transition-all duration-300">
                    <FitLaunchMark size="sm" className="opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>
                  <div className="font-display font-black text-4xl text-mint-dark/15 mb-2">{step.num}</div>
                  <h3 className="font-display font-bold text-sm tracking-wider text-ink mb-2 uppercase">{step.title}</h3>
                  <p className="text-light-muted text-xs leading-relaxed">{step.text}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-ink/8 to-transparent -translate-y-1/2" />
                )}
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="text-center mt-12">
            <Link to="/process" className="btn-secondary">
              FULL PROCESS DETAILS <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <TestimonialsMarquee />

      {/* ===== CONFIGURATOR ===== */}
      <ProjectConfigurator />

      {/* ===== FAQ — White ===== */}
      <section className="py-24 bg-white" aria-label="FAQ">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="section-label mb-4">FAQ</p>
            <h2 className="section-heading text-ink mb-4">
              COMMON <span className="text-mint-dark">QUESTIONS</span>
            </h2>
          </ScrollReveal>
          <div className="space-y-3">
            {publishedFaqs.map((faq, i) => (
              <ScrollReveal key={faq.id} delay={i * 50}>
                <FAQItem question={faq.question} answer={faq.answer} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal className="text-center mt-10">
            <Link to="/faq" className="btn-secondary">VIEW ALL FAQs <ArrowRight className="w-4 h-4" /></Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== FINAL CTA — Dark ===== */}
      <section className="py-24 bg-deep-slate relative overflow-hidden" aria-label="Final CTA">
        <div className="absolute inset-0 bg-radial-mint pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <p className="section-label-light mb-6">READY?</p>
            <h2 className="section-heading text-off-white mb-6">
              LET'S BUILD YOUR<br />
              <span className="text-mint">DIGITAL HOME</span>
            </h2>
            <p className="text-muted-slate text-base leading-relaxed mb-10 max-w-lg mx-auto">
              Tell us about your sports business and let's discuss what you need.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-primary text-sm px-8 py-4">
                START A PROJECT <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/work" className="btn-secondary-dark text-sm px-8 py-4">VIEW OUR WORK</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={`card-light overflow-hidden transition-all duration-300 ${open ? "border-mint-dark/20" : ""}`}>
      <button className="w-full flex items-center justify-between p-6 text-left" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="font-heading font-semibold text-ink pr-4">{question}</span>
        <span className={`text-mint-dark flex-shrink-0 text-lg font-light transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-ink/5 pt-4">
          <p className="text-light-muted text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
