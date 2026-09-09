import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`card-light overflow-hidden transition-all duration-300 ${open ? "border-mint-dark/20 shadow-md" : ""}`}>
      <button
        className="w-full flex items-center justify-between p-6 md:p-8 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-ink text-base pr-6">{question}</span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full border border-ink/12 flex items-center justify-center transition-all duration-200 hover:border-mint-dark/30">
          {open ? <Minus className="w-4 h-4 text-mint-dark" /> : <Plus className="w-4 h-4 text-light-muted" />}
        </span>
      </button>
      {open && (
        <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-ink/5 pt-4">
          <p className="text-light-muted leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { faqs } = useStore();
  const published = faqs.filter(f => f.status === "PUBLISHED").sort((a, b) => a.order - b.order);
  const categories = Array.from(new Set(published.map(f => f.category)));

  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-grid-light opacity-100 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <ScrollReveal className="text-center mb-16">
            <p className="section-label mb-4">FAQ</p>
            <h1 className="section-heading text-ink mb-6">
              FREQUENTLY ASKED <span className="text-mint-dark">QUESTIONS</span>
            </h1>
            <p className="text-light-muted text-lg leading-relaxed">
              Common questions about FitLaunch Media, our services and how we work.
            </p>
          </ScrollReveal>

          {categories.map(cat => {
            const catFaqs = published.filter(f => f.category === cat);
            return (
              <div key={cat} className="mb-12">
                <ScrollReveal>
                  <p className="section-label mb-6">{cat}</p>
                </ScrollReveal>
                <div className="space-y-3">
                  {catFaqs.map((faq, i) => (
                    <ScrollReveal key={faq.id} delay={i * 50}>
                      <FAQItem question={faq.question} answer={faq.answer} />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            );
          })}

          <ScrollReveal className="mt-16 text-center glass-panel-light rounded-3xl p-10 border border-ink/5">
            <h2 className="font-heading font-bold text-ink text-xl mb-3">Still have questions?</h2>
            <p className="text-light-muted text-sm mb-6">Send us an enquiry and we'll get back to you.</p>
            <Link to="/contact" className="btn-primary">CONTACT US <ArrowRight className="w-4 h-4" /></Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
