import React, { useState } from "react";
import ScrollReveal from "@/components/features/ScrollReveal";

const TABS = [
  { id: "gym", label: "GYM" },
  { id: "boxing", label: "BOXING CLUB" },
  { id: "studio", label: "FITNESS STUDIO" },
  { id: "academy", label: "FOOTBALL ACADEMY" },
  { id: "org", label: "SPORTS ORG" },
];

const DEMOS: Record<string, { sections: { label: string; value: string }[]; scheduleItems: string[] }> = {
  gym: {
    sections: [
      { label: "Members", value: "2,400+" },
      { label: "Classes/Week", value: "56" },
      { label: "Personal Trainers", value: "12" },
      { label: "Facilities", value: "3 Floors" },
    ],
    scheduleItems: ["6:00 — Early Strength", "9:00 — HIIT Cardio", "12:00 — Lunchtime Lift", "18:00 — Evening HIIT"],
  },
  boxing: {
    sections: [
      { label: "Active Members", value: "340" },
      { label: "Sessions/Week", value: "24" },
      { label: "Coaches", value: "6" },
      { label: "Age Groups", value: "Junior–Senior" },
    ],
    scheduleItems: ["07:00 — Bag Work & Conditioning", "17:30 — Junior Squad", "19:00 — Senior Sparring", "20:30 — Fitness Boxing"],
  },
  studio: {
    sections: [
      { label: "Active Clients", value: "180" },
      { label: "Classes/Week", value: "30" },
      { label: "Instructors", value: "8" },
      { label: "Disciplines", value: "Pilates · Yoga · HIIT" },
    ],
    scheduleItems: ["07:00 — Reformer Pilates", "10:00 — Vinyasa Flow", "17:00 — Barre Fusion", "19:00 — Evening HIIT"],
  },
  academy: {
    sections: [
      { label: "Players", value: "220" },
      { label: "Age Groups", value: "U8–U18" },
      { label: "Coaches", value: "14" },
      { label: "Season Fixtures", value: "64" },
    ],
    scheduleItems: ["U10 — Sat 09:00", "U12 — Sat 11:00", "U14 — Sun 10:00", "U18 — Sun 14:00"],
  },
  org: {
    sections: [
      { label: "Member Clubs", value: "32" },
      { label: "Competitions", value: "12" },
      { label: "Registered Athletes", value: "4,200" },
      { label: "Seasons/Year", value: "2" },
    ],
    scheduleItems: ["League Cup — Round 1", "Premiership — Matchday 6", "National Cup — QF", "Sprint Series — Round 3"],
  },
};

export default function DemoExplorer() {
  const [active, setActive] = useState("gym");
  const demo = DEMOS[active];

  return (
    <section className="py-24 bg-light-bg" aria-label="Demo explorer">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="section-label mb-4">DEMO EXPLORER</p>
          <h2 className="section-heading text-ink mb-4">
            SEE WHAT YOUR <span className="text-mint-dark">MEMBERS SEE</span>
          </h2>
          <p className="text-light-muted max-w-md mx-auto text-sm">
            Interactive previews for each industry. <span className="text-ink/40 font-display font-bold text-xs">FITLAUNCH DEMO — illustrative only.</span>
          </p>
        </ScrollReveal>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`px-5 py-2.5 rounded-full border text-xs font-display font-bold tracking-wider uppercase transition-all duration-200 ${
                active === tab.id ? "bg-mint-dark/10 border-mint-dark/30 text-mint-dark" : "bg-white border-ink/10 text-light-muted hover:text-ink hover:border-ink/20"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Demo UI */}
        <ScrollReveal>
          <div className="card-light overflow-hidden">
            {/* Mock browser chrome */}
            <div className="bg-light-bg border-b border-ink/5 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                {["bg-red-300", "bg-amber-300", "bg-green-300"].map((c, i) => <div key={i} className={`w-3 h-3 rounded-full ${c}`} />)}
              </div>
              <div className="flex-1 ml-2 bg-white rounded-full px-4 py-1 text-xs text-light-muted border border-ink/5 text-center">
                fitlaunchdemo.com · FITLAUNCH DEMO
              </div>
            </div>

            {/* Demo content */}
            <div className="p-6 md:p-8">
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {demo.sections.map(item => (
                  <div key={item.label} className="bg-light-bg rounded-2xl p-5 border border-ink/5">
                    <div className="text-ink text-xl font-heading font-extrabold mb-1">{item.value}</div>
                    <div className="text-light-muted text-xs font-display font-bold tracking-wider uppercase">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div className="bg-light-bg rounded-2xl p-6 border border-ink/5">
                <h3 className="font-display font-bold text-sm text-ink tracking-wider uppercase mb-4">SCHEDULE</h3>
                <div className="space-y-3">
                  {demo.scheduleItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-ink/5 last:border-0">
                      <span className="text-sm text-ink font-heading font-semibold">{item}</span>
                      <span className="text-xs font-display font-bold tracking-wider px-3 py-1.5 rounded-full bg-mint-dark/8 border border-mint-dark/15 text-mint-dark cursor-default">
                        BOOK
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
