import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderOpen, Star, Inbox, Settings,
  Image, HelpCircle, Globe, LogOut, Menu, X, ChevronRight,
  Wrench, Building2
} from "lucide-react";
import Logo from "@/components/features/Logo";
import { clearAdminSession } from "@/lib/adminAuth";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Services", href: "/admin/services", icon: Wrench },
  { label: "Industries", href: "/admin/industries", icon: Building2 },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Enquiries", href: "/admin/bookings", icon: Inbox },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "SEO", href: "/admin/seo", icon: Globe },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <Logo size="sm" />
        <p className="text-[9px] font-display font-bold tracking-widest text-mint/60 uppercase mt-1 ml-1">CMS ADMIN</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" role="navigation" aria-label="Admin navigation">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-heading font-medium transition-all duration-200",
                active
                  ? "bg-mint/10 text-mint border border-mint/15"
                  : "text-muted-slate hover:text-off-white hover:bg-elevated"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-muted-slate hover:text-off-white hover:bg-elevated transition-colors">
          <Globe className="w-4 h-4" />
          View Public Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-muted-slate hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-deep-slate border-r border-white/5 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 bg-deep-slate border-r border-white/5 z-50 transition-transform duration-300 lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-muted-slate hover:text-off-white" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-deep-slate border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-muted-slate hover:text-off-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-off-white tracking-wider uppercase text-sm">{title}</h1>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 text-xs text-muted-slate hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT
          </button>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
