import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { generateId, now } from "@/lib/utils";
import type { FAQ, ContentStatus } from "@/types";

const EMPTY: Omit<FAQ, "id" | "updatedAt"> = {
  question: "", answer: "", category: "General", order: 0, status: "DRAFT",
};

export default function AdminFAQ() {
  const isAuth = useAdminGuard();
  const { faqs, upsertFaq, deleteFaq } = useStore();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isAuth) return null;

  const sorted = [...faqs].sort((a, b) => a.order - b.order);
  const categories = Array.from(new Set(sorted.map(f => f.category)));

  const openNew = () => {
    setEditing({ ...EMPTY, id: generateId(), updatedAt: now(), order: faqs.length + 1 });
    setShowForm(true);
  };

  const save = () => {
    if (!editing) return;
    upsertFaq(editing);
    setShowForm(false);
    setEditing(null);
  };

  const toggleStatus = (f: FAQ) => {
    const next: ContentStatus = f.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    upsertFaq({ ...f, status: next, updatedAt: now() });
  };

  return (
    <AdminLayout title="FAQ Manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-slate text-sm">{faqs.length} FAQs — only PUBLISHED FAQs appear on the site and are used by the AI</p>
          <button onClick={openNew} className="btn-primary text-xs"><Plus className="w-3.5 h-3.5" /> ADD FAQ</button>
        </div>

        {categories.map(cat => (
          <div key={cat}>
            <p className="section-label mb-3">{cat}</p>
            <div className="card-elevated overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["#","Question","Status","Actions"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.filter(f => f.category === cat).map(faq => (
                      <tr key={faq.id} className="border-b border-white/5 hover:bg-elevated/50 transition-colors">
                        <td className="px-4 py-3 text-muted-slate text-xs">{faq.order}</td>
                        <td className="px-4 py-3">
                          <div className="font-heading font-medium text-off-white/90 text-sm max-w-md truncate">{faq.question}</div>
                          <div className="text-xs text-muted-slate truncate max-w-md mt-0.5">{faq.answer.substring(0, 80)}…</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${faq.status === "PUBLISHED" ? "bg-mint/10 text-mint" : "bg-elevated text-muted-slate border border-white/5"}`}>{faq.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditing({ ...faq }); setShowForm(true); }} className="p-1.5 text-muted-slate hover:text-mint transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => toggleStatus(faq)} className="p-1.5 text-muted-slate hover:text-mint transition-colors">
                              {faq.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button onClick={() => setConfirmDelete(faq.id)} className="p-1.5 text-muted-slate hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {showForm && editing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div className="glass-panel rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-display font-bold text-off-white tracking-wider uppercase mb-6">
                {editing.question ? "EDIT FAQ" : "NEW FAQ"}
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <F label="CATEGORY" value={editing.category} onChange={v => setEditing(e => e ? { ...e, category: v } : e)} />
                  <div>
                    <label className="section-label text-[10px] block mb-2">STATUS</label>
                    <select value={editing.status} onChange={ev => setEditing(e => e ? { ...e, status: ev.target.value as ContentStatus } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                      {["DRAFT","APPROVED","PUBLISHED"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <F label="ORDER" type="number" value={String(editing.order)} onChange={v => setEditing(e => e ? { ...e, order: parseInt(v)||0 } : e)} />
                </div>
                <TA label="QUESTION" value={editing.question} onChange={v => setEditing(e => e ? { ...e, question: v } : e)} rows={2} />
                <TA label="ANSWER" value={editing.answer} onChange={v => setEditing(e => e ? { ...e, answer: v } : e)} rows={5} />
              </div>
              <div className="flex gap-3 mt-8 justify-end">
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={save} className="btn-primary text-xs">SAVE FAQ</button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete FAQ?</h3>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { deleteFaq(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold hover:bg-red-500/30 transition-colors">DELETE</button>
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
