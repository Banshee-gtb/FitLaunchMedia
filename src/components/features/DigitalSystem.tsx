import React from "react";
import ScrollReveal from "@/components/features/ScrollReveal";
import { FitLaunchMark } from "@/components/features/Logo";

const NODES = [
  { id: "WEBSITE", x: 10, y: 50, label: "WEBSITE" },
  { id: "DISCOVERY", x: 28, y: 22, label: "DISCOVERY" },
  { id: "ENQUIRY", x: 46, y: 50, label: "ENQUIRY" },
  { id: "BOOKING", x: 64, y: 22, label: "BOOKING" },
  { id: "MEMBERSHIP", x: 82, y: 50, label: "MEMBERSHIP" },
  { id: "RETENTION", x: 90, y: 75, label: "RETENTION" },
];

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
];

export default function DigitalSystem() {
  return (
    <section className="py-24 bg-obsidian relative overflow-hidden" aria-label="Digital system">
      <div className="absolute inset-0 bg-grid-dark opacity-25 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,245,160,0.04) 0%, transparent 70%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <p className="section-label-light mb-4">THE SYSTEM</p>
          <h2 className="section-heading text-off-white mb-4">
            YOUR WEBSITE IS <span className="text-mint">THE START</span>
          </h2>
          <p className="text-muted-slate max-w-xl mx-auto text-base leading-relaxed">
            FitLaunch doesn't just build attractive pages. We build digital systems that move visitors from discovery to long-term membership.
          </p>
        </ScrollReveal>

        {/* SVG flow diagram */}
        <ScrollReveal>
          <div className="relative w-full overflow-x-auto">
            <svg viewBox="0 0 100 100" className="w-full" style={{ height: "clamp(200px, 30vw, 320px)" }} aria-hidden="true">
              {/* Connection lines */}
              {CONNECTIONS.map(([from, to], i) => {
                const a = NODES[from];
                const b = NODES[to];
                return (
                  <line
                    key={i}
                    x1={`${a.x}%`} y1={`${a.y}%`}
                    x2={`${b.x}%`} y2={`${b.y}%`}
                    stroke="rgba(0,245,160,0.2)"
                    strokeWidth="0.3"
                    strokeDasharray="1.5 0.8"
                  />
                );
              })}
              {/* Nodes */}
              {NODES.map((node, i) => (
                <g key={node.id}>
                  <circle cx={`${node.x}%`} cy={`${node.y}%`} r="3.5" fill="rgba(0,245,160,0.08)" stroke="rgba(0,245,160,0.4)" strokeWidth="0.4" />
                  <circle cx={`${node.x}%`} cy={`${node.y}%`} r="1.2" fill="#00F5A0" />
                  <text
                    x={`${node.x}%`}
                    y={`${node.y + 7}%`}
                    textAnchor="middle"
                    fill="rgba(154,163,159,0.8)"
                    style={{ fontSize: "2.5px", fontFamily: "Barlow, sans-serif", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </ScrollReveal>

        {/* Nodes explanation */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
          {NODES.map((node, i) => (
            <ScrollReveal key={node.id} delay={i * 60}>
              <div className="text-center p-4 rounded-2xl bg-elevated border border-white/5 hover:border-mint/15 transition-colors duration-300">
                <div className="w-8 h-8 rounded-full bg-mint/8 border border-mint/15 flex items-center justify-center mx-auto mb-3">
                  <FitLaunchMark size="sm" className="w-4 h-4 opacity-70" />
                </div>
                <p className="text-mint text-[10px] font-display font-bold tracking-wider">{node.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
