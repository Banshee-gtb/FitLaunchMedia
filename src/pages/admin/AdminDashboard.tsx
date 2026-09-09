import React from "react";
import { Link } from "react-router-dom";
import { FolderOpen, Star, Inbox, Image, ArrowRight, TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function AdminDashboard() {
  const isAuth = useAdminGuard();
  const { projects, testimonials, enquiries, mediaAssets, activityLogs, services, faqs } = useStore();

  if (!isAuth) return null;

  const publishedProjects = projects.filter(p => p.status === "PUBLISHED").length;
  const newEnquiries = enquiries.filter(e => e.status === "NEW").length;
  const publishedReviews = testimonials.filter(t => t.status === "PUBLISHED").length;

  const stats = [
    { label: "Total Projects", value: projects.length, sub: `${publishedProjects} published`, icon: FolderOpen, href: "/admin/projects" },
    { label: "Reviews", value: testimonials.length, sub: `${publishedReviews} published`, icon: Star, href: "/admin/reviews" },
    { label: "Enquiries", value: enquiries.length, sub: `${newEnquiries} new`, icon: Inbox, href: "/admin/bookings", alert: newEnquiries > 0 },
    { label: "Media Assets", value: mediaAssets.length, sub: "uploaded files", icon: Image, href: "/admin/media" },
  ];

  const recentEnquiries = enquiries.slice(0, 5);
  const recentActivity = activityLogs.slice(0, 8);

  const quickActions = [
    { label: "New Project", href: "/admin/projects" },
    { label: "Add Review", href: "/admin/reviews" },
    { label: "Update Hero", href: "/admin/settings" },
    { label: "Edit Services", href: "/admin/services" },
    { label: "Edit FAQ", href: "/admin/faq" },
    { label: "Upload Media", href: "/admin/media" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} to={stat.href} className="card-elevated p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl transition-colors duration-300 ${stat.alert ? "bg-red-500/10" : "bg-mint/8 group-hover:bg-mint/15"}`}>
                    <Icon className={`w-4 h-4 ${stat.alert ? "text-red-400" : "text-mint"}`} />
                  </div>
                  {stat.alert && (
                    <span className="flex items-center gap-1 text-[10px] font-display font-bold text-red-400">
                      <AlertCircle className="w-3 h-3" />
                      {newEnquiries} NEW
                    </span>
                  )}
                </div>
                <div className="font-display font-black text-3xl text-off-white mb-1">{stat.value}</div>
                <div className="font-heading font-medium text-xs text-off-white/70">{stat.label}</div>
                <div className="text-xs text-muted-slate mt-1">{stat.sub}</div>
              </Link>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Enquiries */}
          <div className="lg:col-span-2 card-elevated p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase">RECENT ENQUIRIES</h2>
              <Link to="/admin/bookings" className="text-xs text-mint flex items-center gap-1 hover:underline">VIEW ALL <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {recentEnquiries.length === 0 ? (
              <p className="text-muted-slate text-sm py-8 text-center">No enquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentEnquiries.map(enq => (
                  <div key={enq.id} className="flex items-center gap-4 p-3 bg-elevated rounded-xl">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-sm text-off-white truncate">{enq.name}</span>
                        {enq.status === "NEW" && <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />}
                      </div>
                      <div className="text-xs text-muted-slate truncate">{enq.organisation || enq.email}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${
                        enq.status === "NEW" ? "bg-mint/10 text-mint" :
                        enq.status === "CONTACTED" ? "bg-blue-500/10 text-blue-400" :
                        "bg-elevated text-muted-slate border border-white/5"
                      }`}>
                        {enq.status}
                      </div>
                      <div className="text-[10px] text-muted-slate mt-1">{formatDate(enq.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions + Activity */}
          <div className="space-y-6">
            <div className="card-elevated p-6">
              <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase mb-5">QUICK ACTIONS</h2>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map(action => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="px-3 py-2.5 text-xs font-display font-bold tracking-wider text-center rounded-xl bg-elevated border border-white/5 text-muted-slate hover:text-mint hover:border-mint/20 transition-all duration-200"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="card-elevated p-6">
              <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase mb-5">RECENT ACTIVITY</h2>
              {recentActivity.length === 0 ? (
                <p className="text-muted-slate text-xs">No activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map(log => (
                    <div key={log.id} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-mint/40 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-off-white/70">{log.action} {log.entity}</div>
                        <div className="text-[10px] text-muted-slate">{formatDate(log.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Status */}
        <div className="card-elevated p-6">
          <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase mb-5">CONTENT STATUS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Services", published: services.filter(s => s.status === "PUBLISHED").length, total: services.length, href: "/admin/services" },
              { label: "Projects", published: projects.filter(p => p.status === "PUBLISHED").length, total: projects.length, href: "/admin/projects" },
              { label: "Reviews", published: testimonials.filter(t => t.status === "PUBLISHED").length, total: testimonials.length, href: "/admin/reviews" },
              { label: "FAQs", published: faqs.filter(f => f.status === "PUBLISHED").length, total: faqs.length, href: "/admin/faq" },
            ].map(item => (
              <Link key={item.label} to={item.href} className="p-4 bg-elevated rounded-xl border border-white/5 hover:border-mint/20 transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-slate font-heading">{item.label}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-mint/50 group-hover:text-mint transition-colors" />
                </div>
                <div className="font-display font-black text-2xl text-off-white">{item.published}<span className="text-muted-slate text-base font-body">/{item.total}</span></div>
                <div className="text-[10px] text-muted-slate mt-1">published</div>
                <div className="mt-2 h-1 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-mint rounded-full transition-all" style={{ width: `${item.total > 0 ? (item.published / item.total) * 100 : 0}%` }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
