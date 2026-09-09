import React, { useState } from "react";
import { Save, Globe } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";

export default function AdminSEO() {
  const isAuth = useAdminGuard();
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({
    globalSeoTitle: settings.globalSeoTitle || "",
    globalSeoDescription: settings.globalSeoDescription || "",
    ogImage: settings.ogImage || "",
  });
  const [saved, setSaved] = useState(false);

  if (!isAuth) return null;

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const save = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout title="SEO Settings">
      <div className="max-w-2xl space-y-8">
        <div className="card-elevated p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <Globe className="w-5 h-5 text-mint" />
            <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase">GLOBAL SEO</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="section-label text-[10px] block mb-2">GLOBAL SITE TITLE</label>
              <input value={form.globalSeoTitle} onChange={e => update("globalSeoTitle", e.target.value)}
                className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none transition-colors" />
              <p className="text-[10px] text-muted-slate mt-1">{form.globalSeoTitle.length}/60 characters recommended</p>
            </div>
            <div>
              <label className="section-label text-[10px] block mb-2">GLOBAL META DESCRIPTION</label>
              <textarea rows={3} value={form.globalSeoDescription} onChange={e => update("globalSeoDescription", e.target.value)}
                className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none resize-none" />
              <p className="text-[10px] text-muted-slate mt-1">{form.globalSeoDescription.length}/160 characters recommended</p>
            </div>
            <div>
              <label className="section-label text-[10px] block mb-2">OG / SOCIAL SHARE IMAGE URL</label>
              <input value={form.ogImage} onChange={e => update("ogImage", e.target.value)} placeholder="https://..."
                className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div className="card-elevated p-8">
          <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase mb-4">SEARCH PREVIEW</h2>
          <div className="bg-elevated rounded-xl p-4 border border-white/5">
            <div className="text-[11px] text-muted-slate mb-1">fitlaunchmedia.com</div>
            <div className="text-blue-400 text-sm font-heading font-semibold mb-1 truncate">{form.globalSeoTitle || "FitLaunch Media"}</div>
            <div className="text-xs text-muted-slate leading-relaxed line-clamp-2">{form.globalSeoDescription || "No description set."}</div>
          </div>
        </div>

        <div className="card-elevated p-8">
          <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase mb-4">SEO NOTES</h2>
          <ul className="space-y-2 text-sm text-muted-slate">
            <li className="flex items-start gap-2"><span className="text-mint">•</span> Every FitLaunch website is built search-ready by default — semantic HTML, fast loading, mobile-first.</li>
            <li className="flex items-start gap-2"><span className="text-mint">•</span> Per-page SEO metadata can be managed here as individual pages are added to the system.</li>
            <li className="flex items-start gap-2"><span className="text-mint">•</span> The robots.txt and sitemap are available at /robots.txt and /sitemap.xml.</li>
          </ul>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={save} className="btn-primary">
            <Save className="w-4 h-4" /> SAVE SEO SETTINGS
          </button>
          {saved && <span className="text-mint text-sm font-heading font-semibold">✓ Saved</span>}
        </div>
      </div>
    </AdminLayout>
  );
}
