import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { generateId, now, formatDate } from "@/lib/utils";
import type { Testimonial, ContentStatus } from "@/types";

const EMPTY: Omit<Testimonial, "id" | "updatedAt"> = {
  name: "", organisation: "", industry: "", role: "", text: "",
  rating: 5, avatar: "", date: new Date().toISOString().split("T")[0],
  featured: false, status: "DEMO", source: "", order: 0,
};

export default function AdminReviews() {
  const isAuth = useAdminGuard();
  const { testimonials, upsertTestimonial, deleteTestimonial } = useStore();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isAuth) return null;

  const sorted = [...testimonials].sort((a, b) => a.order - b.order);

  const openNew = () => {
    setEditing({ ...EMPTY, id: generateId(), updatedAt: now(), order: testimonials.length + 1 });
    setShowForm(true);
  };

  const save = () => {
    if (!editing) return;
    upsertTestimonial(editing);
    setShowForm(false);
    setEditing(null);
  };

  const toggleStatus = (t: Testimonial) => {
    const next: ContentStatus = t.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    upsertTestimonial({ ...t, status: next, updatedAt: now() });
  };

  const toggleFeatured = (t: Testimonial) => upsertTestimonial({ ...t, featured: !t.featured, updatedAt: now() });

  return (
    <AdminLayout title="Reviews">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-slate text-sm">{testimonials.length} reviews — reviews marked DEMO are placeholder content</p>
          <button onClick={openNew} className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> ADD REVIEW</button>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["#", "Name", "Organisation", "Industry", "Rating", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(t => (
                  <tr key={t.id} className="border-b border-white/5 hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3 text-muted-slate text-xs">{t.order}</td>
                    <td className="px-4 py-3">
                      <div className="font-heading font-semibold text-off-white text-sm">{t.name}</div>
                      {t.featured && <span className="text-[9px] text-yellow-400">★ FEATURED</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{t.organisation}</td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{t.industry}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < t.rating ? "text-mint fill-mint" : "text-muted-slate"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${
                        t.status === "PUBLISHED" ? "bg-mint/10 text-mint" :
                        t.status === "DEMO" ? "bg-blue-500/10 text-blue-400" :
                        "bg-elevated text-muted-slate border border-white/5"
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditing({ ...t }); setShowForm(true); }} className="p-1.5 text-muted-slate hover:text-mint transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toggleStatus(t)} className="p-1.5 text-muted-slate hover:text-mint transition-colors">
                          {t.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => toggleFeatured(t)} className="p-1.5 text-muted-slate hover:text-yellow-400 transition-colors">
                          <Star className={`w-3.5 h-3.5 ${t.featured ? "text-yellow-400 fill-yellow-400" : ""}`} />
                        </button>
                        <button onClick={() => setConfirmDelete(t.id)} className="p-1.5 text-muted-slate hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {testimonials.length === 0 && <div className="text-center py-12 text-muted-slate text-sm">No reviews yet.</div>}
          </div>
        </div>

        {showForm && editing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div className="glass-panel rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-display font-bold text-off-white tracking-wider uppercase mb-6">
                {editing.name ? `EDIT: ${editing.name}` : "NEW REVIEW"}
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <F label="NAME" value={editing.name} onChange={v => setEditing(e => e ? { ...e, name: v } : e)} />
                  <F label="ORGANISATION" value={editing.organisation} onChange={v => setEditing(e => e ? { ...e, organisation: v } : e)} />
                  <F label="INDUSTRY" value={editing.industry} onChange={v => setEditing(e => e ? { ...e, industry: v } : e)} />
                  <F label="ROLE" value={editing.role} onChange={v => setEditing(e => e ? { ...e, role: v } : e)} />
                  <F label="DATE" type="date" value={editing.date} onChange={v => setEditing(e => e ? { ...e, date: v } : e)} />
                  <div>
                    <label className="section-label text-[10px] block mb-2">RATING</label>
                    <select value={editing.rating} onChange={ev => setEditing(e => e ? { ...e, rating: Number(ev.target.value) } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="section-label text-[10px] block mb-2">STATUS</label>
                    <select value={editing.status} onChange={ev => setEditing(e => e ? { ...e, status: ev.target.value as ContentStatus } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                      {["DRAFT","DEMO","APPROVED","PUBLISHED"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <F label="ORDER" type="number" value={String(editing.order)} onChange={v => setEditing(e => e ? { ...e, order: parseInt(v)||0 } : e)} />
                </div>
                <div>
                  <label className="section-label text-[10px] block mb-2">REVIEW TEXT</label>
                  <textarea rows={4} value={editing.text} onChange={ev => setEditing(e => e ? { ...e, text: ev.target.value } : e)}
                    className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="rfeat" checked={editing.featured} onChange={ev => setEditing(e => e ? { ...e, featured: ev.target.checked } : e)} className="accent-mint w-4 h-4" />
                  <label htmlFor="rfeat" className="text-sm text-off-white/80">Featured</label>
                </div>
              </div>
              <div className="flex gap-3 mt-8 justify-end">
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={save} className="btn-primary text-xs">SAVE REVIEW</button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete Review?</h3>
              <p className="text-muted-slate text-sm mb-6">This cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { deleteTestimonial(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold hover:bg-red-500/30 transition-colors">DELETE</button>
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
