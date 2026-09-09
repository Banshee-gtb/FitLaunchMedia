import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import ScrollReveal from "@/components/features/ScrollReveal";
import PageBackground from "@/components/features/PageBackground";
import { generateId, now } from "@/lib/utils";
import type { Enquiry } from "@/types";

export default function ContactPage() {
  const { settings, addEnquiry } = useStore();
  const [form, setForm] = useState({ name: "", organisation: "", email: "", phone: "", type: "PROJECT_ENQUIRY" as Enquiry["type"], goals: "", targetDate: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    await addEnquiry({ ...form, services: [], source: "contact-page" });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="pt-24 bg-light-bg min-h-screen flex items-center justify-center px-6">
        <PageBackground blur={80} opacity={0.04} />
        <ScrollReveal className="text-center max-w-lg">
          <div className="w-16 h-16 rounded-full bg-mint-dark/10 border border-mint-dark/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-mint-dark" />
          </div>
          <h1 className="font-heading font-extrabold text-ink text-3xl mb-4">ENQUIRY RECEIVED</h1>
          <p className="text-light-muted leading-relaxed mb-8">
            Thank you for reaching out. We'll review your enquiry and get back to you. This is a booking request only — not a confirmed engagement.
          </p>
          <Link to="/" className="btn-primary">BACK TO HOME <ArrowRight className="w-4 h-4" /></Link>
        </ScrollReveal>
      </main>
    );
  }

  return (
    <main className="pt-24 bg-light-bg min-h-screen">
      <PageBackground blur={80} opacity={0.04} />

      {/* Hero — Dark */}
      <section className="py-20 bg-obsidian relative">
        <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal className="max-w-2xl">
            <p className="section-label-light mb-4">GET IN TOUCH</p>
            <h1 className="section-heading text-off-white mb-6">
              START A <span className="text-mint">PROJECT</span>
            </h1>
            <p className="text-muted-slate text-lg leading-relaxed max-w-xl">
              Tell us about your sports business. We'll review your enquiry and get back to you.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form + Contact info — Light */}
      <section className="py-24 bg-light-bg relative">
        <div className="absolute inset-0 bg-grid-light pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Form */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="card-light p-10">
                  <h2 className="font-heading font-extrabold text-ink text-2xl mb-8">PROJECT ENQUIRY</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <LF label="YOUR NAME *" value={form.name} onChange={v => update("name", v)} required />
                      <LF label="ORGANISATION" value={form.organisation} onChange={v => update("organisation", v)} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <LF label="EMAIL *" type="email" value={form.email} onChange={v => update("email", v)} required />
                      <LF label="PHONE" type="tel" value={form.phone} onChange={v => update("phone", v)} />
                    </div>
                    <div>
                      <label className="section-label text-[10px] block mb-2">ENQUIRY TYPE</label>
                      <select value={form.type} onChange={e => update("type", e.target.value)}
                        className="w-full border border-ink/10 rounded-xl px-4 py-3 text-ink bg-white text-sm focus:border-mint-dark/40 focus:outline-none transition-colors">
                        <option value="PROJECT_ENQUIRY">New Website Project</option>
                        <option value="BOOKING_REQUEST">Booking Request / Call</option>
                        <option value="GENERAL">General Enquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="section-label text-[10px] block mb-2">YOUR GOALS</label>
                      <textarea rows={4} value={form.goals} onChange={e => update("goals", e.target.value)} placeholder="Tell us what you're looking to achieve..."
                        className="w-full border border-ink/10 rounded-xl px-4 py-3 text-ink bg-white text-sm focus:border-mint-dark/40 focus:outline-none resize-none transition-colors placeholder-light-muted" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <LF label="TARGET DATE" value={form.targetDate} onChange={v => update("targetDate", v)} placeholder="e.g. Q3 2026" />
                      <LF label="BUDGET RANGE" value={form.budget} onChange={v => update("budget", v)} placeholder="Optional" />
                    </div>
                    <div className="pt-2">
                      <button type="submit" disabled={loading || !form.name || !form.email} className="btn-primary w-full justify-center">
                        {loading ? "SENDING..." : <>SEND ENQUIRY <ArrowRight className="w-4 h-4" /></>}
                      </button>
                      <p className="text-center text-xs text-light-muted mt-3">This is an enquiry only — not a confirmed booking or engagement.</p>
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            </div>

            {/* Contact info */}
            <ScrollReveal direction="right">
              <div className="space-y-6">
                {settings.primaryEmail && (
                  <div className="card-light p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-4 h-4 text-mint-dark" />
                      <span className="section-label text-[10px]">EMAIL</span>
                    </div>
                    <a href={`mailto:${settings.primaryEmail}`} className="text-ink font-heading font-semibold hover:text-mint-dark transition-colors">
                      {settings.primaryEmail}
                    </a>
                  </div>
                )}
                {settings.phone && (
                  <div className="card-light p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-4 h-4 text-mint-dark" />
                      <span className="section-label text-[10px]">PHONE</span>
                    </div>
                    <a href={`tel:${settings.phone}`} className="text-ink font-heading font-semibold hover:text-mint-dark transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                )}
                {settings.location && (
                  <div className="card-light p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-4 h-4 text-mint-dark" />
                      <span className="section-label text-[10px]">LOCATION</span>
                    </div>
                    <p className="text-ink font-heading font-semibold">{settings.location}</p>
                  </div>
                )}
                {settings.businessHours && (
                  <div className="card-light p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-mint-dark" />
                      <span className="section-label text-[10px]">HOURS</span>
                    </div>
                    <p className="text-ink font-heading font-semibold">{settings.businessHours}</p>
                  </div>
                )}
                <div className="card-light p-6 border-mint-dark/15">
                  <p className="section-label mb-3 text-[10px]">WHAT HAPPENS NEXT</p>
                  <ul className="space-y-2">
                    {["We review your enquiry", "We get back within 2 business days", "We arrange an initial conversation", "We outline a tailored approach"].map((s, i) => (
                      <li key={s} className="flex items-center gap-2 text-sm text-light-muted">
                        <span className="w-5 h-5 rounded-full bg-mint-dark/10 text-mint-dark text-[10px] font-display font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </main>
  );
}

function LF({ label, value, onChange, type = "text", required = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="w-full border border-ink/10 rounded-xl px-4 py-3 text-ink bg-white text-sm focus:border-mint-dark/40 focus:outline-none transition-colors placeholder-light-muted" />
    </div>
  );
}
