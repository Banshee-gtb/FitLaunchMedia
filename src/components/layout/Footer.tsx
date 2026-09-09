import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram, Linkedin, Facebook } from "lucide-react";
import Logo from "@/components/features/Logo";
import { useStore } from "@/lib/store";

const FOOTER_LINKS = {
  Services: [
    { label: "Website Development", href: "/services" },
    { label: "Booking Systems", href: "/services" },
    { label: "Lead Generation", href: "/services" },
    { label: "Membership Experiences", href: "/services" },
    { label: "Sports Platforms", href: "/services" },
  ],
  Industries: [
    { label: "Gyms", href: "/gyms" },
    { label: "Boxing Clubs", href: "/boxing-clubs" },
    { label: "Fitness Studios", href: "/fitness-studios" },
    { label: "Football Academies", href: "/football-academies" },
    { label: "Sports Organisations", href: "/sports-organisations" },
  ],
  Company: [
    { label: "Our Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  const { settings } = useStore();

  return (
    <footer className="bg-obsidian border-t border-white/5" role="contentinfo">
      {/* CTA Band */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-label-light mb-2">READY TO BUILD?</p>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-off-white">
              {settings.contactCta || "Ready to build your digital home?"}
            </h2>
          </div>
          <Link to="/contact" className="btn-primary whitespace-nowrap">
            START A PROJECT <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <Logo size="sm" className="mb-6" />
            <p className="text-muted-slate text-sm leading-relaxed max-w-xs">{settings.footerDescription}</p>
            {settings.primaryEmail && (
              <a href={`mailto:${settings.primaryEmail}`} className="inline-block mt-4 text-mint text-sm font-heading font-semibold hover:underline">
                {settings.primaryEmail}
              </a>
            )}
            <div className="flex gap-3 mt-6">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="p-2 glass-panel rounded-lg hover:border-mint/30 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4 text-muted-slate hover:text-mint" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 glass-panel rounded-lg hover:border-mint/30 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 text-muted-slate hover:text-mint" />
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="p-2 glass-panel rounded-lg hover:border-mint/30 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4 text-muted-slate hover:text-mint" />
                </a>
              )}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="section-label-light mb-5 text-[10px]">{heading}</h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-muted-slate text-sm hover:text-off-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-slate text-xs font-body">© {new Date().getFullYear()} FitLaunch Media. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/faq" className="text-muted-slate text-xs hover:text-off-white transition-colors">FAQ</Link>
            <Link to="/contact" className="text-muted-slate text-xs hover:text-off-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
