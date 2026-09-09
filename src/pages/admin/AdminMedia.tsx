import React, { useState, useRef } from "react";
import { Upload, Trash2, Edit2, Search, Image } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { MediaAsset } from "@/types";

export default function AdminMedia() {
  const isAuth = useAdminGuard();
  const { mediaAssets, addMediaAsset, updateMediaAsset, deleteMediaAsset } = useStore();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<MediaAsset | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [altInput, setAltInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuth) return null;

  const filtered = mediaAssets.filter(a =>
    !search || a.filename.toLowerCase().includes(search.toLowerCase()) || a.altText.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        addMediaAsset({
          filename: file.name,
          url,
          altText: file.name.replace(/\.[^/.]+$/, ""),
          title: file.name,
          type: "IMAGE",
          size: file.size,
          usage: "",
          featured: false,
          status: "APPROVED",
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    addMediaAsset({
      filename: urlInput.split("/").pop() || "image",
      url: urlInput.trim(),
      altText: altInput || "Image",
      title: titleInput || urlInput.split("/").pop() || "Image",
      type: "IMAGE",
      usage: "",
      featured: false,
      status: "APPROVED",
    });
    setUrlInput(""); setAltInput(""); setTitleInput("");
    setShowAddUrl(false);
  };

  return (
    <AdminLayout title="Media Library">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-slate" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..."
              className="w-full bg-elevated border border-white/8 rounded-xl pl-10 pr-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none" />
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary text-xs">
            <Upload className="w-3.5 h-3.5" /> UPLOAD FILES
          </button>
          <button onClick={() => setShowAddUrl(true)} className="btn-secondary text-xs">ADD URL</button>
        </div>

        {showAddUrl && (
          <div className="card-elevated p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-off-white tracking-wider uppercase">ADD IMAGE BY URL</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3"><F label="IMAGE URL" value={urlInput} onChange={setUrlInput} /></div>
              <F label="ALT TEXT" value={altInput} onChange={setAltInput} />
              <F label="TITLE" value={titleInput} onChange={setTitleInput} />
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddUrl} className="btn-primary text-xs">ADD IMAGE</button>
              <button onClick={() => setShowAddUrl(false)} className="btn-secondary text-xs">CANCEL</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(asset => (
            <div key={asset.id} className="card-elevated overflow-hidden group">
              <div className="relative" style={{ aspectRatio: "1" }}>
                <img src={asset.url} alt={asset.altText}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-obsidian/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <button onClick={() => setEditing(asset)} className="p-2 bg-elevated rounded-lg text-mint hover:bg-mint/20 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmDelete(asset.id)} className="p-2 bg-elevated rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-off-white/70 truncate font-heading">{asset.title}</p>
                <p className="text-[10px] text-muted-slate truncate mt-0.5">{asset.altText}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 card-elevated">
            <Image className="w-12 h-12 text-muted-slate/20 mx-auto mb-4" />
            <p className="text-muted-slate text-sm">No media assets yet. Upload files or add image URLs.</p>
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditing(null); }}>
            <div className="glass-panel rounded-3xl p-8 w-full max-w-md">
              <h2 className="font-display font-bold text-off-white tracking-wider uppercase mb-6">EDIT ASSET</h2>
              {editing.url && <img src={editing.url} alt={editing.altText} className="w-full rounded-xl mb-4 object-cover max-h-40" />}
              <div className="space-y-4">
                <F label="TITLE" value={editing.title} onChange={v => setEditing(e => e ? { ...e, title: v } : e)} />
                <F label="ALT TEXT" value={editing.altText} onChange={v => setEditing(e => e ? { ...e, altText: v } : e)} />
                <F label="USAGE" value={editing.usage} onChange={v => setEditing(e => e ? { ...e, usage: v } : e)} />
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button onClick={() => setEditing(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { updateMediaAsset(editing.id, editing); setEditing(null); }} className="btn-primary text-xs">SAVE</button>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete Asset?</h3>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { deleteMediaAsset(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold hover:bg-red-500/30 transition-colors">DELETE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none transition-colors" />
    </div>
  );
}
