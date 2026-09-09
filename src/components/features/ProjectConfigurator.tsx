import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";

const BUSINESS_TYPES = ["Gym", "Boxing Club", "Fitness Studio", "Football Academy", "Sports Club", "Sports Organisation", "Other"];
const NEEDS = ["Bookings", "Memberships", "Events", "Lead Generation", "Team Profiles", "Coach Profiles", "News", "Results", "Ecommerce", "Payments", "SEO", "Analytics"];
const PRIORITIES = ["Lead Generation", "Bookings", "Brand Perception", "Membership Growth", "Information", "Events", "Community"];

export default function ProjectConfigurator() {
  const { addEnquiry } = useStore();
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [priority, setPriority] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleNeed = (n: string) => setNeeds(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setLoading(true);
    await addEnquiry({
      name: form.name || "Configurator Lead",
      email: form.email,
      type: "PROJECT_ENQUIRY",
      services: needs,
      configuratorChoices: { businessType, needs, priority },
      goals: `Priority: ${priority}. ${form.message}`,
      source: "configurator",
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="configurator" className="py-24 bg-deep-slate relative overflow-hidden" aria-label="Project configurator">
      <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-12">
          <p className="section-label-light mb-4">CONFIGURE YOUR PROJECT</p>
          <h2 className="section-heading text-off-white mb-4">
            BUILD YOUR IDEAL <span className="text-mint">WEBSITE</span>
          </h2>
          <p className="text-muted-slate">Answer three quick questions to outline your requirements.</p>
        </ScrollReveal>

        {submitted ? (
          <ScrollReveal>
            <div className="glass-panel rounded-3xl p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-mint mx-auto mb-4" />
              <h3 className="font-heading font-extrabold text-off-white text-2xl mb-3">Configuration sent!</h3>
              <p className="text-muted-slate mb-8">We'll review your requirements and be in touch. This is an enquiry only — not a confirmed engagement.</p>
              <Link to="/contact" className="btn-primary">VIEW FULL CONTACT PAGE <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </ScrollReveal>
        ) : (
          <div className="glass-panel rounded-3xl p-8 md:p-12">
            {/* Progress */}
            <div className="flex gap-2 mb-10">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? "bg-mint" : "bg-white/10"}`} />
              ))}
            </div>

            {/* Step 0 */}
            {step === 0 && (
              <div>
                <h3 className="font-heading font-bold text-off-white text-xl mb-6">What type of business do you run?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {BUSINESS_TYPES.map(t => (
                    <button key={t} onClick={() => { setBusinessType(t); setStep(1); }}
                      className={`px-4 py-3 rounded-xl border text-sm font-heading font-semibold transition-all duration-200 text-left ${
                        businessType === t ? "bg-mint/15 border-mint/40 text-mint" : "bg-elevated border-white/8 text-muted-slate hover:border-white/20 hover:text-off-white"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h3 className="font-heading font-bold text-off-white text-xl mb-6">What features do you need?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {NEEDS.map(n => (
                    <button key={n} onClick={() => toggleNeed(n)}
                      className={`px-4 py-3 rounded-xl border text-sm font-heading font-semibold transition-all duration-200 text-left ${
                        needs.includes(n) ? "bg-mint/15 border-mint/40 text-mint" : "bg-elevated border-white/8 text-muted-slate hover:border-white/20 hover:text-off-white"
                      }`}>
                      {needs.includes(n) && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" />}{n}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary-dark text-xs">BACK</button>
                  <button onClick={() => setStep(2)} disabled={needs.length === 0} className="btn-primary text-xs disabled:opacity-40">NEXT STEP</button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h3 className="font-heading font-bold text-off-white text-xl mb-6">What's your top priority?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                  {PRIORITIES.map(p => (
                    <button key={p} onClick={() => { setPriority(p); setStep(3); }}
                      className={`px-4 py-3 rounded-xl border text-sm font-heading font-semibold transition-all duration-200 text-left ${
                        priority === p ? "bg-mint/15 border-mint/40 text-mint" : "bg-elevated border-white/8 text-muted-slate hover:border-white/20 hover:text-off-white"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} className="btn-secondary-dark text-xs">BACK</button>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div>
                <h3 className="font-heading font-bold text-off-white text-xl mb-2">Your configuration</h3>
                <div className="bg-elevated rounded-2xl p-6 mb-6 space-y-2">
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-slate">Business:</span>
                    <span className="text-off-white font-heading font-semibold">{businessType}</span>
                  </div>
                  <div className="flex gap-4 text-sm flex-wrap">
                    <span className="text-muted-slate">Features:</span>
                    <span className="text-off-white font-heading font-semibold">{needs.join(", ")}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-slate">Priority:</span>
                    <span className="text-off-white font-heading font-semibold">{priority}</span>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="section-label-light text-[10px] block mb-2">YOUR NAME</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Optional"
                        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none" />
                    </div>
                    <div>
                      <label className="section-label-light text-[10px] block mb-2">EMAIL *</label>
                      <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="section-label-light text-[10px] block mb-2">ANYTHING ELSE?</label>
                    <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none resize-none" />
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="btn-secondary-dark text-xs">BACK</button>
                    <button type="submit" disabled={loading || !form.email} className="btn-primary text-xs disabled:opacity-40">
                      {loading ? "SENDING..." : <>SEND ENQUIRY <ArrowRight className="w-3.5 h-3.5" /></>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
