import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { generateId, now, formatDate } from "@/lib/utils";
import type { Industry, ContentStatus } from "@/types";

const EMPTY: Omit<Industry, "id" | "updatedAt"> = {
  title: "", slug: "", icon: "Building2", description: "",
  features: [], status: "DRAFT", order: 0,
};

export default function AdminIndustries() {
  const isAuth = useAdminGuard();
  const { industries, upsertIndustry, deleteIndustry } = useStore();
  const [editing, setEditing] = useState<Industry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isAuth) return null;

  const sorted = [...industries].sort((a, b) => a.order - b.order);

  const save = () => {
    if (!editing) return;
    upsertIndustry(editing);
    setShowForm(false);
    setEditing(null);
  };

  const toggleStatus = (i: Industry) => {
    const next: ContentStatus = i.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    upsertIndustry({ ...i, status: next, updatedAt: now() });
  };

  return (
    <AdminLayout title="Industries">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-slate text-sm">{industries.length} industries</p>
          <button onClick={() => { setEditing({ ...EMPTY, id: generateId(), updatedAt: now(), order: industries.length + 1 }); setShowForm(true); }} className="btn-primary text-xs">
            <Plus className="w-3.5 h-3.5" /> ADD INDUSTRY
          </button>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["#","Title","Slug","Status","Updated","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(ind => (
                  <tr key={ind.id} className="border-b border-white/5 hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3 text-muted-slate text-xs">{ind.order}</td>
                    <td className="px-4 py-3 font-heading font-semibold text-off-white">{ind.title}</td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{ind.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${ind.status === "PUBLISHED" ? "bg-mint/10 text-mint" : "bg-elevated text-muted-slate border border-white/5"}`}>{ind.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{formatDate(ind.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing({ ...ind }); setShowForm(true); }} className="p-1.5 text-muted-slate hover:text-mint transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toggleStatus(ind)} className="p-1.5 text-muted-slate hover:text-mint transition-colors">
                          {ind.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setConfirmDelete(ind.id)} className="p-1.5 text-muted-slate hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
            <div className="glass-panel rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-display font-bold text-off-white tracking-wider uppercase mb-6">{editing.title || "NEW INDUSTRY"}</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <F label="TITLE" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : e)} />
                  <F label="SLUG" value={editing.slug} onChange={v => setEditing(e => e ? { ...e, slug: v } : e)} />
                  <F label="ICON NAME" value={editing.icon} onChange={v => setEditing(e => e ? { ...e, icon: v } : e)} />
                  <div>
                    <label className="section-label text-[10px] block mb-2">STATUS</label>
                    <select value={editing.status} onChange={ev => setEditing(e => e ? { ...e, status: ev.target.value as ContentStatus } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                      {["DRAFT","APPROVED","PUBLISHED"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <F label="ORDER" type="number" value={String(editing.order)} onChange={v => setEditing(e => e ? { ...e, order: parseInt(v)||0 } : e)} />
                </div>
                <TA label="DESCRIPTION" value={editing.description} onChange={v => setEditing(e => e ? { ...e, description: v } : e)} />
                <TA label="FEATURES (one per line)" value={editing.features.join("\n")} onChange={v => setEditing(e => e ? { ...e, features: v.split("\n").filter(Boolean) } : e)} rows={6} />
              </div>
              <div className="flex gap-3 mt-8 justify-end">
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={save} className="btn-primary text-xs">SAVE</button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete Industry?</h3>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { deleteIndustry(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold hover:bg-red-500/30 transition-colors">DELETE</button>
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
