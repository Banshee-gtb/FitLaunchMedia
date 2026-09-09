import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, StarOff, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { generateId, now, formatDate } from "@/lib/utils";
import type { Project, ContentStatus } from "@/types";

const EMPTY: Omit<Project, "id" | "updatedAt"> = {
  title: "", slug: "", industry: "", services: [], summary: "", approvedResults: "",
  coverImage: "", galleryImages: [], liveUrl: "", testimonial: "", testimonialAuthor: "",
  publishDate: new Date().toISOString().split("T")[0], status: "DRAFT", featured: false, order: 0,
};

export default function AdminProjects() {
  const isAuth = useAdminGuard();
  const { projects, upsertProject, deleteProject } = useStore();
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!isAuth) return null;

  const sorted = [...projects].sort((a, b) => a.order - b.order);

  const openNew = () => {
    setEditing({ ...EMPTY, id: generateId(), updatedAt: now(), order: projects.length + 1 });
    setShowForm(true);
  };

  const openEdit = (p: Project) => { setEditing({ ...p }); setShowForm(true); };

  const save = () => {
    if (!editing) return;
    upsertProject(editing);
    setShowForm(false);
    setEditing(null);
  };

  const del = (id: string) => {
    deleteProject(id);
    setConfirmDelete(null);
  };

  const toggle = (p: Project, field: "status") => {
    const next: ContentStatus = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    upsertProject({ ...p, status: next, updatedAt: now() });
  };

  const toggleFeatured = (p: Project) => upsertProject({ ...p, featured: !p.featured, updatedAt: now() });

  return (
    <AdminLayout title="Projects">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-slate text-sm">{projects.length} projects total</p>
          <button onClick={openNew} className="btn-primary text-xs">
            <Plus className="w-3.5 h-3.5" /> ADD PROJECT
          </button>
        </div>

        {/* Table */}
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Order</th>
                  <th className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Industry</th>
                  <th className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Updated</th>
                  <th className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(proj => (
                  <tr key={proj.id} className="border-b border-white/5 hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3 text-muted-slate text-xs">{proj.order}</td>
                    <td className="px-4 py-3">
                      <div className="font-heading font-semibold text-off-white text-sm">{proj.title}</div>
                      {proj.featured && <span className="text-[9px] text-mint">★ FEATURED</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{proj.industry}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${
                        proj.status === "PUBLISHED" ? "bg-mint/10 text-mint" :
                        proj.status === "DEMO" ? "bg-blue-500/10 text-blue-400" :
                        proj.status === "APPROVED" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-elevated text-muted-slate border border-white/5"
                      }`}>{proj.status}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{formatDate(proj.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(proj)} className="p-1.5 text-muted-slate hover:text-mint transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => toggle(proj, "status")} className="p-1.5 text-muted-slate hover:text-mint transition-colors" title="Toggle publish">
                          {proj.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => toggleFeatured(proj)} className="p-1.5 text-muted-slate hover:text-yellow-400 transition-colors" title="Toggle featured">
                          {proj.featured ? <Star className="w-3.5 h-3.5 text-yellow-400" /> : <StarOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => setConfirmDelete(proj.id)} className="p-1.5 text-muted-slate hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {projects.length === 0 && (
              <div className="text-center py-12 text-muted-slate text-sm">No projects yet. Click ADD PROJECT to create one.</div>
            )}
          </div>
        </div>

        {/* Edit form modal */}
        {showForm && editing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
            <div className="glass-panel rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-display font-bold text-off-white tracking-wider uppercase mb-6">
                {editing.title ? `EDIT: ${editing.title}` : "NEW PROJECT"}
              </h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="TITLE" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : e)} />
                  <Field label="SLUG" value={editing.slug} onChange={v => setEditing(e => e ? { ...e, slug: v } : e)} />
                  <Field label="INDUSTRY" value={editing.industry} onChange={v => setEditing(e => e ? { ...e, industry: v } : e)} />
                  <Field label="COVER IMAGE URL" value={editing.coverImage || ""} onChange={v => setEditing(e => e ? { ...e, coverImage: v } : e)} />
                  <Field label="LIVE URL" value={editing.liveUrl || ""} onChange={v => setEditing(e => e ? { ...e, liveUrl: v } : e)} />
                  <Field label="PUBLISH DATE" type="date" value={editing.publishDate} onChange={v => setEditing(e => e ? { ...e, publishDate: v } : e)} />
                  <Field label="ORDER" type="number" value={String(editing.order)} onChange={v => setEditing(e => e ? { ...e, order: parseInt(v) || 0 } : e)} />
                  <div>
                    <label className="section-label text-[10px] block mb-2">STATUS</label>
                    <select
                      value={editing.status}
                      onChange={ev => setEditing(e => e ? { ...e, status: ev.target.value as ContentStatus } : e)}
                      className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none"
                    >
                      {["DRAFT", "DEMO", "APPROVED", "PUBLISHED"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <TextArea label="SERVICES (one per line)" value={editing.services.join("\n")} onChange={v => setEditing(e => e ? { ...e, services: v.split("\n").filter(Boolean) } : e)} />
                <TextArea label="SUMMARY" value={editing.summary} onChange={v => setEditing(e => e ? { ...e, summary: v } : e)} />
                <TextArea label="APPROVED RESULTS" value={editing.approvedResults} onChange={v => setEditing(e => e ? { ...e, approvedResults: v } : e)} />
                <TextArea label="TESTIMONIAL" value={editing.testimonial || ""} onChange={v => setEditing(e => e ? { ...e, testimonial: v } : e)} />
                <Field label="TESTIMONIAL AUTHOR" value={editing.testimonialAuthor || ""} onChange={v => setEditing(e => e ? { ...e, testimonialAuthor: v } : e)} />
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={editing.featured} onChange={ev => setEditing(e => e ? { ...e, featured: ev.target.checked } : e)} className="accent-mint w-4 h-4" />
                  <label htmlFor="featured" className="text-sm text-off-white/80">Featured on homepage</label>
                </div>
              </div>
              <div className="flex gap-3 mt-8 justify-end">
                <button onClick={() => setShowForm(false)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={save} className="btn-primary text-xs">SAVE PROJECT</button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete Project?</h3>
              <p className="text-muted-slate text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => del(confirmDelete)} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold tracking-wider hover:bg-red-500/30 transition-colors">DELETE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none transition-colors"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none transition-colors resize-none"
      />
    </div>
  );
}
