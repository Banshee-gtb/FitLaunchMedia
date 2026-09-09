import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/features/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "INDUSTRIES", href: "/industries" },
  { label: "PROCESS", href: "/process" },
  { label: "ABOUT", href: "/about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled ? "glass-nav shadow-lg" : "bg-transparent"
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" aria-label="FitLaunch Media home">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-[11px] font-display font-bold tracking-[0.12em] uppercase transition-colors duration-200",
                  location.pathname === link.href
                    ? "text-mint"
                    : "text-off-white/70 hover:text-off-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/faq" className="text-[11px] font-display font-bold tracking-[0.12em] text-off-white/50 hover:text-off-white uppercase transition-colors">FAQ</Link>
            <Link to="/contact" className="btn-primary text-xs px-5 py-2.5">
              START A PROJECT <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-off-white hover:text-mint transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 lg:hidden transition-all duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
        <nav
          className={cn(
            "absolute top-0 right-0 h-full w-80 max-w-full bg-deep-slate flex flex-col transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <Logo size="sm" />
            <button onClick={() => setMobileOpen(false)} className="p-2 text-muted-slate hover:text-off-white" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block py-3 px-4 rounded-xl text-base font-display font-bold tracking-wider uppercase transition-all duration-200",
                  location.pathname === link.href
                    ? "text-mint bg-mint/8 border border-mint/15"
                    : "text-off-white/80 hover:text-off-white hover:bg-white/4"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/faq" className="block py-3 px-4 rounded-xl text-base font-display font-bold tracking-wider uppercase text-off-white/80 hover:text-off-white hover:bg-white/4 transition-all">FAQ</Link>
          </div>
          <div className="px-6 pb-8">
            <Link to="/contact" className="btn-primary w-full justify-center">
              START A PROJECT <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
