import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { generateId, now, formatDate } from "@/lib/utils";
import type { Service, ContentStatus } from "@/types";

const EMPTY: Omit<Service, "id" | "updatedAt"> = {
  title: "", slug: "", icon: "Monitor", shortDescription: "", longDescription: "",
  features: [], ctaLabel: "Learn More", ctaLink: "/services",
  status: "DRAFT", order: 0, seoTitle: "", seoDescription: "",
};

const ICONS = ["Monitor","CalendarCheck","TrendingUp","Users","Trophy","BarChart2","Zap","Shield","Search","Globe","Smartphone","Star"];

export default function AdminServices() {
  const isAuth = useAdminGuard();
  const { services, upsertService, deleteService } = useStore();
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isAuth) return null;

  const sorted = [...services].sort((a, b) => a.order - b.order);

  const openNew = () => {
    setEditing({ ...EMPTY, id: generateId(), updatedAt: now(), order: services.length + 1 });
    setShowForm(true);
  };

  const save = () => {
    if (!editing) return;
    upsertService(editing);
    setShowForm(false);
    setEditing(null);
  };

  const toggleStatus = (s: Service) => {
    const next: ContentStatus = s.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    upsertService({ ...s, status: next, updatedAt: now() });
  };

  return (
    <AdminLayout title="Services">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-slate text-sm">{services.length} services</p>
          <button onClick={openNew} className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> ADD SERVICE</button>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["#","Title","Icon","Status","Updated","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(svc => (
                  <tr key={svc.id} className="border-b border-white/5 hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3 text-muted-slate text-xs">{svc.order}</td>
                    <td className="px-4 py-3">
                      <div className="font-heading font-semibold text-off-white">{svc.title}</div>
                      <div className="text-xs text-muted-slate truncate max-w-xs">{svc.shortDescription}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{svc.icon}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${svc.status === "PUBLISHED" ? "bg-mint/10 text-mint" : "bg-elevated text-muted-slate border border-white/5"}`}>{svc.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{formatDate(svc.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing({ ...svc }); setShowForm(true); }} className="p-1.5 text-muted-slate hover:text-mint transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toggleStatus(svc)} className="p-1.5 text-muted-slate hover:text-mint transition-colors">
                          {svc.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setConfirmDelete(svc.id)} className="p-1.5 text-muted-slate hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showForm && editing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div className="glass-panel rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-display font-bold text-off-white tracking-wider uppercase mb-6">
                {editing.title ? `EDIT: ${editing.title}` : "NEW SERVICE"}
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <F label="TITLE" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : e)} />
                  <F label="SLUG" value={editing.slug} onChange={v => setEditing(e => e ? { ...e, slug: v } : e)} />
                  <div>
                    <label className="section-label text-[10px] block mb-2">ICON</label>
                    <select value={editing.icon} onChange={ev => setEditing(e => e ? { ...e, icon: ev.target.value } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                      {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label text-[10px] block mb-2">STATUS</label>
                    <select value={editing.status} onChange={ev => setEditing(e => e ? { ...e, status: ev.target.value as ContentStatus } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                      {["DRAFT","APPROVED","PUBLISHED"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <F label="CTA LABEL" value={editing.ctaLabel} onChange={v => setEditing(e => e ? { ...e, ctaLabel: v } : e)} />
                  <F label="CTA LINK" value={editing.ctaLink} onChange={v => setEditing(e => e ? { ...e, ctaLink: v } : e)} />
                  <F label="ORDER" type="number" value={String(editing.order)} onChange={v => setEditing(e => e ? { ...e, order: parseInt(v)||0 } : e)} />
                </div>
                <TA label="SHORT DESCRIPTION" value={editing.shortDescription} onChange={v => setEditing(e => e ? { ...e, shortDescription: v } : e)} rows={2} />
                <TA label="LONG DESCRIPTION" value={editing.longDescription} onChange={v => setEditing(e => e ? { ...e, longDescription: v } : e)} rows={3} />
                <TA label="FEATURES (one per line)" value={editing.features.join("\n")} onChange={v => setEditing(e => e ? { ...e, features: v.split("\n").filter(Boolean) } : e)} rows={5} />
              </div>
              <div className="flex gap-3 mt-8 justify-end">
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={save} className="btn-primary text-xs">SAVE SERVICE</button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete Service?</h3>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { deleteService(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold hover:bg-red-500/30 transition-colors">DELETE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function F({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none transition-colors" />
    </div>
  );
}
function TA({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none resize-none" />
    </div>
  );
}
