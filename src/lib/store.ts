import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {
  Service, Industry, Project, Testimonial, FAQ,
  Enquiry, MediaAsset, SiteSetting, ActivityLog
} from "@/types";
import { generateId, now } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_SERVICES, DEFAULT_INDUSTRIES, DEFAULT_PROJECTS,
  DEFAULT_TESTIMONIALS, DEFAULT_FAQS, DEFAULT_SETTINGS
} from "@/constants/siteData";

interface StoreState {
  services: Service[];
  industries: Industry[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  enquiries: Enquiry[];
  mediaAssets: MediaAsset[];
  settings: SiteSetting;
  activityLogs: ActivityLog[];
  loaded: boolean;
}

interface StoreActions {
  upsertService: (s: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  upsertIndustry: (i: Industry) => Promise<void>;
  deleteIndustry: (id: string) => Promise<void>;
  upsertProject: (p: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  upsertTestimonial: (t: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  upsertFaq: (f: FAQ) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  addEnquiry: (e: Omit<Enquiry, "id" | "timestamp" | "updatedAt" | "status">) => Promise<void>;
  updateEnquiryStatus: (id: string, status: Enquiry["status"], notes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  addMediaAsset: (a: Omit<MediaAsset, "id" | "uploadedAt" | "updatedAt">) => Promise<void>;
  updateMediaAsset: (id: string, updates: Partial<MediaAsset>) => Promise<void>;
  deleteMediaAsset: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<SiteSetting>) => Promise<void>;
  uploadHeroImage: (file: File) => Promise<string>;
  logActivity: (action: string, entity: string, entityId?: string, details?: string) => void;
  refetch: () => Promise<void>;
}

type StoreContextType = StoreState & StoreActions;
const StoreContext = createContext<StoreContextType | null>(null);

// Map DB row → Service
function mapService(r: Record<string, unknown>): Service {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    icon: r.icon as string,
    shortDescription: (r.short_description as string) || "",
    longDescription: (r.long_description as string) || "",
    features: (r.features as string[]) || [],
    ctaLabel: (r.cta_label as string) || "Learn More",
    ctaLink: (r.cta_link as string) || "/services",
    image: r.image as string | undefined,
    status: (r.status as Service["status"]) || "DRAFT",
    order: (r.sort_order as number) || 0,
    seoTitle: r.seo_title as string | undefined,
    seoDescription: r.seo_description as string | undefined,
    updatedAt: r.updated_at as string,
  };
}

function mapIndustry(r: Record<string, unknown>): Industry {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    icon: (r.icon as string) || "Dumbbell",
    description: (r.description as string) || "",
    features: (r.features as string[]) || [],
    image: r.image as string | undefined,
    status: (r.status as Industry["status"]) || "DRAFT",
    order: (r.sort_order as number) || 0,
    seoTitle: r.seo_title as string | undefined,
    seoDescription: r.seo_description as string | undefined,
    updatedAt: r.updated_at as string,
  };
}

function mapProject(r: Record<string, unknown>): Project {
  return {
    id: r.id as string,
    title: r.title as string,
    slug: r.slug as string,
    industry: (r.industry as string) || "",
    services: (r.services as string[]) || [],
    summary: (r.summary as string) || "",
    approvedResults: (r.approved_results as string) || "",
    coverImage: r.cover_image as string | undefined,
    galleryImages: (r.gallery_images as string[]) || [],
    liveUrl: r.live_url as string | undefined,
    testimonial: r.testimonial as string | undefined,
    testimonialAuthor: r.testimonial_author as string | undefined,
    publishDate: (r.publish_date as string) || "",
    status: (r.status as Project["status"]) || "DEMO",
    featured: (r.featured as boolean) || false,
    order: (r.sort_order as number) || 0,
    updatedAt: r.updated_at as string,
  };
}

function mapTestimonial(r: Record<string, unknown>): Testimonial {
  return {
    id: r.id as string,
    name: r.name as string,
    organisation: (r.organisation as string) || "",
    industry: (r.industry as string) || "",
    role: (r.role as string) || "",
    text: r.text as string,
    rating: (r.rating as number) || 5,
    avatar: r.avatar as string | undefined,
    date: (r.date as string) || "",
    featured: (r.featured as boolean) || false,
    status: (r.status as Testimonial["status"]) || "DEMO",
    source: r.source as string | undefined,
    order: (r.sort_order as number) || 0,
    updatedAt: r.updated_at as string,
  };
}

function mapFaq(r: Record<string, unknown>): FAQ {
  return {
    id: r.id as string,
    question: r.question as string,
    answer: r.answer as string,
    category: (r.category as string) || "General",
    order: (r.sort_order as number) || 0,
    status: (r.status as FAQ["status"]) || "DRAFT",
    updatedAt: r.updated_at as string,
  };
}

function mapEnquiry(r: Record<string, unknown>): Enquiry {
  return {
    id: r.id as string,
    name: r.name as string,
    organisation: r.organisation as string | undefined,
    email: r.email as string,
    phone: r.phone as string | undefined,
    type: (r.type as Enquiry["type"]) || "PROJECT_ENQUIRY",
    services: (r.services as string[]) || [],
    configuratorChoices: r.configurator_choices as Enquiry["configuratorChoices"],
    goals: r.goals as string | undefined,
    targetDate: r.target_date as string | undefined,
    budget: r.budget as string | undefined,
    notes: r.notes as string | undefined,
    bookingDate: r.booking_date as string | undefined,
    bookingTime: r.booking_time as string | undefined,
    timestamp: r.timestamp as string,
    source: (r.source as string) || "website",
    status: (r.status as Enquiry["status"]) || "NEW",
    adminNotes: r.admin_notes as string | undefined,
    updatedAt: r.updated_at as string,
  };
}

function mapSettings(r: Record<string, unknown>): SiteSetting {
  return {
    heroHeading: (r.hero_heading as string) || DEFAULT_SETTINGS.heroHeading,
    heroParagraph: (r.hero_paragraph as string) || DEFAULT_SETTINGS.heroParagraph,
    heroCta1Label: (r.hero_cta1_label as string) || DEFAULT_SETTINGS.heroCta1Label,
    heroCta1Link: (r.hero_cta1_link as string) || DEFAULT_SETTINGS.heroCta1Link,
    heroCta2Label: (r.hero_cta2_label as string) || DEFAULT_SETTINGS.heroCta2Label,
    heroCta2Link: (r.hero_cta2_link as string) || DEFAULT_SETTINGS.heroCta2Link,
    heroImageUrl: r.hero_image_url as string | undefined,
    primaryEmail: (r.primary_email as string) || "",
    secondaryEmail: r.secondary_email as string | undefined,
    phone: r.phone as string | undefined,
    location: r.location as string | undefined,
    businessHours: r.business_hours as string | undefined,
    contactCta: r.contact_cta as string | undefined,
    bookingDestination: r.booking_destination as string | undefined,
    instagram: r.instagram as string | undefined,
    linkedin: r.linkedin as string | undefined,
    facebook: r.facebook as string | undefined,
    tiktok: r.tiktok as string | undefined,
    twitter: r.twitter as string | undefined,
    youtube: r.youtube as string | undefined,
    footerDescription: (r.footer_description as string) || DEFAULT_SETTINGS.footerDescription,
    footerCta: r.footer_cta as string | undefined,
    globalSeoTitle: r.global_seo_title as string | undefined,
    globalSeoDescription: r.global_seo_description as string | undefined,
    ogImage: r.og_image as string | undefined,
    updatedAt: (r.updated_at as string) || now(),
  };
}

async function seedDefaults() {
  // Only seed if tables are empty
  const [{ count: svcCount }, { count: indCount }, { count: projCount }, { count: testCount }, { count: faqCount }] = await Promise.all([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("industries").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
  ]);

  if (!svcCount) {
    await supabase.from("services").insert(DEFAULT_SERVICES.map(s => ({
      id: s.id, title: s.title, slug: s.slug, icon: s.icon,
      short_description: s.shortDescription, long_description: s.longDescription,
      features: s.features, cta_label: s.ctaLabel, cta_link: s.ctaLink,
      status: s.status, sort_order: s.order,
    })));
  }
  if (!indCount) {
    await supabase.from("industries").insert(DEFAULT_INDUSTRIES.map(i => ({
      id: i.id, title: i.title, slug: i.slug, icon: i.icon,
      description: i.description, features: i.features,
      status: i.status, sort_order: i.order,
    })));
  }
  if (!projCount) {
    await supabase.from("projects").insert(DEFAULT_PROJECTS.map(p => ({
      id: p.id, title: p.title, slug: p.slug, industry: p.industry,
      services: p.services, summary: p.summary, approved_results: p.approvedResults,
      cover_image: p.coverImage, gallery_images: p.galleryImages,
      status: p.status, featured: p.featured, sort_order: p.order, publish_date: p.publishDate,
    })));
  }
  if (!testCount) {
    await supabase.from("testimonials").insert(DEFAULT_TESTIMONIALS.map(t => ({
      id: t.id, name: t.name, organisation: t.organisation, industry: t.industry,
      role: t.role, text: t.text, rating: t.rating, date: t.date,
      featured: t.featured, status: t.status, sort_order: t.order,
    })));
  }
  if (!faqCount) {
    await supabase.from("faqs").insert(DEFAULT_FAQS.map(f => ({
      id: f.id, question: f.question, answer: f.answer, category: f.category,
      sort_order: f.order, status: f.status,
    })));
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>({
    services: [], industries: [], projects: [], testimonials: [],
    faqs: [], enquiries: [], mediaAssets: [], settings: DEFAULT_SETTINGS,
    activityLogs: [], loaded: false,
  });

  const fetchAll = useCallback(async () => {
    await seedDefaults();
    const [
      { data: svcs }, { data: inds }, { data: projs }, { data: tests },
      { data: faqsData }, { data: enqs }, { data: media }, { data: setts },
    ] = await Promise.all([
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("industries").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("testimonials").select("*").order("sort_order"),
      supabase.from("faqs").select("*").order("sort_order"),
      supabase.from("enquiries").select("*").order("timestamp", { ascending: false }),
      supabase.from("media_assets").select("*").order("uploaded_at", { ascending: false }),
      supabase.from("site_settings").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single(),
    ]);

    setState(s => ({
      ...s,
      services: (svcs ?? []).map(mapService),
      industries: (inds ?? []).map(mapIndustry),
      projects: (projs ?? []).map(mapProject),
      testimonials: (tests ?? []).map(mapTestimonial),
      faqs: (faqsData ?? []).map(mapFaq),
      enquiries: (enqs ?? []).map(mapEnquiry),
      mediaAssets: (media ?? []).map(r => ({
        id: r.id, filename: r.filename, url: r.url, altText: r.alt_text || "",
        title: r.title || "", type: r.type, size: r.size, usage: r.usage || "",
        featured: r.featured || false, status: r.status,
        uploadedAt: r.uploaded_at, updatedAt: r.updated_at,
      })),
      settings: setts ? mapSettings(setts as Record<string, unknown>) : DEFAULT_SETTINGS,
      loaded: true,
    }));
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const logActivity = useCallback((action: string, entity: string, entityId?: string, details?: string) => {
    const log: ActivityLog = { id: generateId(), action, entity, entityId, timestamp: now(), details };
    setState(s => ({ ...s, activityLogs: [log, ...s.activityLogs].slice(0, 100) }));
  }, []);

  // Services
  const upsertService = useCallback(async (svc: Service) => {
    const row = {
      id: svc.id, title: svc.title, slug: svc.slug, icon: svc.icon,
      short_description: svc.shortDescription, long_description: svc.longDescription,
      features: svc.features, cta_label: svc.ctaLabel, cta_link: svc.ctaLink,
      image: svc.image || null, status: svc.status, sort_order: svc.order,
      seo_title: svc.seoTitle || null, seo_description: svc.seoDescription || null,
      updated_at: now(),
    };
    await supabase.from("services").upsert(row);
    setState(s => {
      const exists = s.services.find(x => x.id === svc.id);
      return { ...s, services: exists ? s.services.map(x => x.id === svc.id ? { ...svc, updatedAt: now() } : x) : [...s.services, { ...svc, updatedAt: now() }] };
    });
    logActivity("UPSERT", "Service", svc.id, svc.title);
  }, [logActivity]);

  const deleteService = useCallback(async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    setState(s => ({ ...s, services: s.services.filter(x => x.id !== id) }));
    logActivity("DELETE", "Service", id);
  }, [logActivity]);

  // Industries
  const upsertIndustry = useCallback(async (ind: Industry) => {
    const row = {
      id: ind.id, title: ind.title, slug: ind.slug, icon: ind.icon,
      description: ind.description, features: ind.features, image: ind.image || null,
      status: ind.status, sort_order: ind.order,
      seo_title: ind.seoTitle || null, seo_description: ind.seoDescription || null, updated_at: now(),
    };
    await supabase.from("industries").upsert(row);
    setState(s => {
      const exists = s.industries.find(x => x.id === ind.id);
      return { ...s, industries: exists ? s.industries.map(x => x.id === ind.id ? { ...ind, updatedAt: now() } : x) : [...s.industries, { ...ind, updatedAt: now() }] };
    });
    logActivity("UPSERT", "Industry", ind.id, ind.title);
  }, [logActivity]);

  const deleteIndustry = useCallback(async (id: string) => {
    await supabase.from("industries").delete().eq("id", id);
    setState(s => ({ ...s, industries: s.industries.filter(x => x.id !== id) }));
    logActivity("DELETE", "Industry", id);
  }, [logActivity]);

  // Projects
  const upsertProject = useCallback(async (proj: Project) => {
    const row = {
      id: proj.id, title: proj.title, slug: proj.slug, industry: proj.industry,
      services: proj.services, summary: proj.summary, approved_results: proj.approvedResults,
      cover_image: proj.coverImage || null, gallery_images: proj.galleryImages,
      live_url: proj.liveUrl || null, testimonial: proj.testimonial || null,
      testimonial_author: proj.testimonialAuthor || null, publish_date: proj.publishDate,
      status: proj.status, featured: proj.featured, sort_order: proj.order, updated_at: now(),
    };
    await supabase.from("projects").upsert(row);
    setState(s => {
      const exists = s.projects.find(x => x.id === proj.id);
      return { ...s, projects: exists ? s.projects.map(x => x.id === proj.id ? { ...proj, updatedAt: now() } : x) : [...s.projects, { ...proj, updatedAt: now() }] };
    });
    logActivity("UPSERT", "Project", proj.id, proj.title);
  }, [logActivity]);

  const deleteProject = useCallback(async (id: string) => {
    await supabase.from("projects").delete().eq("id", id);
    setState(s => ({ ...s, projects: s.projects.filter(x => x.id !== id) }));
    logActivity("DELETE", "Project", id);
  }, [logActivity]);

  // Testimonials
  const upsertTestimonial = useCallback(async (t: Testimonial) => {
    const row = {
      id: t.id, name: t.name, organisation: t.organisation, industry: t.industry,
      role: t.role, text: t.text, rating: t.rating, avatar: t.avatar || null,
      date: t.date, featured: t.featured, status: t.status, source: t.source || null,
      sort_order: t.order, updated_at: now(),
    };
    await supabase.from("testimonials").upsert(row);
    setState(s => {
      const exists = s.testimonials.find(x => x.id === t.id);
      return { ...s, testimonials: exists ? s.testimonials.map(x => x.id === t.id ? { ...t, updatedAt: now() } : x) : [...s.testimonials, { ...t, updatedAt: now() }] };
    });
    logActivity("UPSERT", "Testimonial", t.id, t.name);
  }, [logActivity]);

  const deleteTestimonial = useCallback(async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    setState(s => ({ ...s, testimonials: s.testimonials.filter(x => x.id !== id) }));
    logActivity("DELETE", "Testimonial", id);
  }, [logActivity]);

  // FAQs
  const upsertFaq = useCallback(async (f: FAQ) => {
    const row = { id: f.id, question: f.question, answer: f.answer, category: f.category, sort_order: f.order, status: f.status, updated_at: now() };
    await supabase.from("faqs").upsert(row);
    setState(s => {
      const exists = s.faqs.find(x => x.id === f.id);
      return { ...s, faqs: exists ? s.faqs.map(x => x.id === f.id ? { ...f, updatedAt: now() } : x) : [...s.faqs, { ...f, updatedAt: now() }] };
    });
    logActivity("UPSERT", "FAQ", f.id);
  }, [logActivity]);

  const deleteFaq = useCallback(async (id: string) => {
    await supabase.from("faqs").delete().eq("id", id);
    setState(s => ({ ...s, faqs: s.faqs.filter(x => x.id !== id) }));
    logActivity("DELETE", "FAQ", id);
  }, [logActivity]);

  // Enquiries
  const addEnquiry = useCallback(async (e: Omit<Enquiry, "id" | "timestamp" | "updatedAt" | "status">) => {
    const row = {
      name: e.name, organisation: e.organisation || null, email: e.email, phone: e.phone || null,
      type: e.type, services: e.services, configurator_choices: e.configuratorChoices || null,
      goals: e.goals || null, target_date: e.targetDate || null, budget: e.budget || null,
      notes: e.notes || null, booking_date: e.bookingDate || null, booking_time: e.bookingTime || null,
      source: e.source || "website", status: "NEW",
    };
    const { data } = await supabase.from("enquiries").insert(row).select().single();
    if (data) {
      setState(s => ({ ...s, enquiries: [mapEnquiry(data as Record<string, unknown>), ...s.enquiries] }));
    }
    logActivity("CREATE", "Enquiry", undefined, e.name);
  }, [logActivity]);

  const updateEnquiryStatus = useCallback(async (id: string, status: Enquiry["status"], notes?: string) => {
    await supabase.from("enquiries").update({ status, admin_notes: notes, updated_at: now() }).eq("id", id);
    setState(s => ({
      ...s,
      enquiries: s.enquiries.map(x => x.id === id ? { ...x, status, adminNotes: notes ?? x.adminNotes, updatedAt: now() } : x),
    }));
    logActivity("UPDATE_STATUS", "Enquiry", id, status);
  }, [logActivity]);

  const deleteEnquiry = useCallback(async (id: string) => {
    await supabase.from("enquiries").delete().eq("id", id);
    setState(s => ({ ...s, enquiries: s.enquiries.filter(x => x.id !== id) }));
    logActivity("DELETE", "Enquiry", id);
  }, [logActivity]);

  // Media
  const addMediaAsset = useCallback(async (a: Omit<MediaAsset, "id" | "uploadedAt" | "updatedAt">) => {
    const row = { filename: a.filename, url: a.url, alt_text: a.altText, title: a.title, type: a.type, size: a.size || null, usage: a.usage, featured: a.featured, status: a.status };
    const { data } = await supabase.from("media_assets").insert(row).select().single();
    if (data) {
      const asset: MediaAsset = { ...a, id: data.id, uploadedAt: data.uploaded_at, updatedAt: data.updated_at };
      setState(s => ({ ...s, mediaAssets: [asset, ...s.mediaAssets] }));
    }
    logActivity("CREATE", "MediaAsset", undefined, a.filename);
  }, [logActivity]);

  const updateMediaAsset = useCallback(async (id: string, updates: Partial<MediaAsset>) => {
    await supabase.from("media_assets").update({ alt_text: updates.altText, title: updates.title, usage: updates.usage, featured: updates.featured, updated_at: now() }).eq("id", id);
    setState(s => ({ ...s, mediaAssets: s.mediaAssets.map(x => x.id === id ? { ...x, ...updates, updatedAt: now() } : x) }));
    logActivity("UPDATE", "MediaAsset", id);
  }, [logActivity]);

  const deleteMediaAsset = useCallback(async (id: string) => {
    await supabase.from("media_assets").delete().eq("id", id);
    setState(s => ({ ...s, mediaAssets: s.mediaAssets.filter(x => x.id !== id) }));
    logActivity("DELETE", "MediaAsset", id);
  }, [logActivity]);

  // Settings
  const updateSettings = useCallback(async (updates: Partial<SiteSetting>) => {
    const row: Record<string, unknown> = { updated_at: now() };
    if (updates.heroHeading !== undefined) row.hero_heading = updates.heroHeading;
    if (updates.heroParagraph !== undefined) row.hero_paragraph = updates.heroParagraph;
    if (updates.heroCta1Label !== undefined) row.hero_cta1_label = updates.heroCta1Label;
    if (updates.heroCta1Link !== undefined) row.hero_cta1_link = updates.heroCta1Link;
    if (updates.heroCta2Label !== undefined) row.hero_cta2_label = updates.heroCta2Label;
    if (updates.heroCta2Link !== undefined) row.hero_cta2_link = updates.heroCta2Link;
    if (updates.heroImageUrl !== undefined) row.hero_image_url = updates.heroImageUrl || null;
    if (updates.primaryEmail !== undefined) row.primary_email = updates.primaryEmail;
    if (updates.secondaryEmail !== undefined) row.secondary_email = updates.secondaryEmail || null;
    if (updates.phone !== undefined) row.phone = updates.phone || null;
    if (updates.location !== undefined) row.location = updates.location || null;
    if (updates.businessHours !== undefined) row.business_hours = updates.businessHours || null;
    if (updates.contactCta !== undefined) row.contact_cta = updates.contactCta || null;
    if (updates.bookingDestination !== undefined) row.booking_destination = updates.bookingDestination || null;
    if (updates.instagram !== undefined) row.instagram = updates.instagram || null;
    if (updates.linkedin !== undefined) row.linkedin = updates.linkedin || null;
    if (updates.facebook !== undefined) row.facebook = updates.facebook || null;
    if (updates.tiktok !== undefined) row.tiktok = updates.tiktok || null;
    if (updates.twitter !== undefined) row.twitter = updates.twitter || null;
    if (updates.youtube !== undefined) row.youtube = updates.youtube || null;
    if (updates.footerDescription !== undefined) row.footer_description = updates.footerDescription;
    if (updates.footerCta !== undefined) row.footer_cta = updates.footerCta || null;
    if (updates.globalSeoTitle !== undefined) row.global_seo_title = updates.globalSeoTitle || null;
    if (updates.globalSeoDescription !== undefined) row.global_seo_description = updates.globalSeoDescription || null;
    if (updates.ogImage !== undefined) row.og_image = updates.ogImage || null;

    await supabase.from("site_settings").update(row).eq("id", "00000000-0000-0000-0000-000000000001");
    setState(s => ({ ...s, settings: { ...s.settings, ...updates, updatedAt: now() } }));
    logActivity("UPDATE", "Settings");
  }, [logActivity]);

  // Hero image upload via Supabase Storage
  const uploadHeroImage = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `hero/hero-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("fitlaunch-media").upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw new Error(error.message);
    const { data: urlData } = supabase.storage.from("fitlaunch-media").getPublicUrl(path);
    return urlData.publicUrl;
  }, []);

  const value: StoreContextType = {
    ...state,
    upsertService, deleteService,
    upsertIndustry, deleteIndustry,
    upsertProject, deleteProject,
    upsertTestimonial, deleteTestimonial,
    upsertFaq, deleteFaq,
    addEnquiry, updateEnquiryStatus, deleteEnquiry,
    addMediaAsset, updateMediaAsset, deleteMediaAsset,
    updateSettings, uploadHeroImage, logActivity, refetch: fetchAll,
  };

  return React.createElement(StoreContext.Provider, { value }, children);
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
