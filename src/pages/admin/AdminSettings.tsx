import React, { useState, useRef, useCallback } from "react";
import { Save, Upload, X, ImageIcon, Loader2 } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import type { SiteSetting } from "@/types";
import heroAthleteImg from "@/assets/hero-athlete.jpg";

export default function AdminSettings() {
  const isAuth = useAdminGuard();
  const { settings, updateSettings, uploadHeroImage } = useStore();
  const [form, setForm] = useState<SiteSetting>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(settings.heroImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAuth) return null;

  const update = (field: keyof SiteSetting, value: string) => setForm(f => ({ ...f, [field]: value }));

  const save = async () => {
    setSaving(true);
    await updateSettings(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image must be under 10MB.");
      return;
    }
    setUploadError("");
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const url = await uploadHeroImage(file);
      setPreviewUrl(url);
      setForm(f => ({ ...f, heroImageUrl: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }, [uploadHeroImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const clearHeroImage = () => {
    setPreviewUrl("");
    setForm(f => ({ ...f, heroImageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const effectivePreview = previewUrl || heroAthleteImg;

  return (
    <AdminLayout title="Site Settings">
      <div className="max-w-3xl space-y-8">

        {/* Hero Section */}
        <Section title="HERO SECTION">
          <div className="space-y-4">
            <div>
              <label className="section-label text-[10px] block mb-2">HERO HEADING (use \n for line breaks)</label>
              <textarea rows={3} value={form.heroHeading} onChange={e => update("heroHeading", e.target.value)}
                className="admin-input resize-none" />
            </div>
            <F label="HERO PARAGRAPH" value={form.heroParagraph} onChange={v => update("heroParagraph", v)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <F label="CTA 1 LABEL" value={form.heroCta1Label} onChange={v => update("heroCta1Label", v)} />
              <F label="CTA 1 LINK" value={form.heroCta1Link} onChange={v => update("heroCta1Link", v)} />
              <F label="CTA 2 LABEL" value={form.heroCta2Label} onChange={v => update("heroCta2Label", v)} />
              <F label="CTA 2 LINK" value={form.heroCta2Link} onChange={v => update("heroCta2Link", v)} />
            </div>

            {/* Hero Image Upload */}
            <div>
              <label className="section-label text-[10px] block mb-3">HERO IMAGE</label>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
                  ${dragOver ? "border-mint/60 bg-mint/5" : "border-white/15 hover:border-mint/30 hover:bg-white/2"}
                  ${uploading ? "pointer-events-none" : ""}`}
                style={{ minHeight: 180 }}
                role="button"
                tabIndex={0}
                aria-label="Upload hero image"
                onKeyDown={e => e.key === "Enter" && fileInputRef.current?.click()}
              >
                {effectivePreview ? (
                  <>
                    <img
                      src={effectivePreview}
                      alt="Hero preview"
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-obsidian/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-mint mx-auto mb-2" />
                        <p className="text-mint text-xs font-display font-bold tracking-wider">REPLACE IMAGE</p>
                      </div>
                    </div>
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${previewUrl && form.heroImageUrl ? "bg-mint/20 text-mint border border-mint/30" : "bg-elevated text-muted-slate border border-white/10"}`}>
                        {previewUrl && form.heroImageUrl ? "CUSTOM UPLOAD" : "DEFAULT IMAGE"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-44 text-center px-6">
                    <ImageIcon className="w-8 h-8 text-muted-slate mb-3" />
                    <p className="text-off-white text-sm font-display font-bold tracking-wider mb-1">DROP IMAGE HERE</p>
                    <p className="text-muted-slate text-xs">or click to browse · JPG, PNG, WebP · max 10MB</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-obsidian/70 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-mint animate-spin" />
                    <p className="text-mint text-xs font-display font-bold tracking-wider">UPLOADING TO CLOUD...</p>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              {/* Actions */}
              <div className="flex items-center gap-3 mt-3">
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-elevated border border-white/10 rounded-xl text-xs font-display font-bold text-off-white hover:border-mint/30 hover:text-mint transition-all disabled:opacity-40">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? "UPLOADING..." : "UPLOAD NEW IMAGE"}
                </button>
                {(previewUrl || form.heroImageUrl) && (
                  <button type="button" onClick={clearHeroImage} disabled={uploading}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-display font-bold text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40">
                    <X className="w-3.5 h-3.5" />
                    REMOVE (USE DEFAULT)
                  </button>
                )}
              </div>
              {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
              <p className="text-muted-slate text-[10px] mt-2">Removing the hero image will revert to the default FitLaunch athlete photograph.</p>
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section title="CONTACT INFORMATION">
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="PRIMARY EMAIL" value={form.primaryEmail} onChange={v => update("primaryEmail", v)} />
            <F label="SECONDARY EMAIL" value={form.secondaryEmail || ""} onChange={v => update("secondaryEmail", v)} />
            <F label="PHONE" value={form.phone || ""} onChange={v => update("phone", v)} />
            <F label="LOCATION" value={form.location || ""} onChange={v => update("location", v)} />
            <F label="BUSINESS HOURS" value={form.businessHours || ""} onChange={v => update("businessHours", v)} />
            <F label="CONTACT CTA TEXT" value={form.contactCta || ""} onChange={v => update("contactCta", v)} />
          </div>
        </Section>

        {/* Social */}
        <Section title="SOCIAL LINKS">
          <div className="grid sm:grid-cols-2 gap-4">
            <F label="INSTAGRAM URL" value={form.instagram || ""} onChange={v => update("instagram", v)} />
            <F label="LINKEDIN URL" value={form.linkedin || ""} onChange={v => update("linkedin", v)} />
            <F label="FACEBOOK URL" value={form.facebook || ""} onChange={v => update("facebook", v)} />
            <F label="TIKTOK URL" value={form.tiktok || ""} onChange={v => update("tiktok", v)} />
            <F label="X / TWITTER URL" value={form.twitter || ""} onChange={v => update("twitter", v)} />
            <F label="YOUTUBE URL" value={form.youtube || ""} onChange={v => update("youtube", v)} />
          </div>
        </Section>

        {/* Footer */}
        <Section title="FOOTER">
          <div className="space-y-4">
            <F label="FOOTER DESCRIPTION" value={form.footerDescription} onChange={v => update("footerDescription", v)} />
            <F label="FOOTER CTA LABEL" value={form.footerCta || ""} onChange={v => update("footerCta", v)} />
          </div>
        </Section>

        <div className="flex items-center gap-4">
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "SAVING..." : "SAVE SETTINGS"}
          </button>
          {saved && <span className="text-mint text-sm font-heading font-semibold">✓ Settings saved</span>}
        </div>
      </div>
    </AdminLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-elevated p-8">
      <h2 className="font-display font-bold text-sm text-off-white tracking-wider uppercase mb-6 pb-4 border-b border-white/5">{title}</h2>
      {children}
    </div>
  );
}

function F({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="section-label text-[10px] block mb-2">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="admin-input" />
    </div>
  );
}
