export type ContentStatus = "DRAFT" | "DEMO" | "APPROVED" | "PUBLISHED";

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  ctaLabel: string;
  ctaLink: string;
  image?: string;
  status: ContentStatus;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}

export interface Industry {
  id: string;
  title: string;
  slug: string;
  icon: string;
  description: string;
  features: string[];
  image?: string;
  status: ContentStatus;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  industry: string;
  services: string[];
  summary: string;
  approvedResults: string;
  coverImage?: string;
  galleryImages: string[];
  liveUrl?: string;
  testimonial?: string;
  testimonialAuthor?: string;
  publishDate: string;
  status: ContentStatus;
  featured: boolean;
  order: number;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  organisation: string;
  industry: string;
  role: string;
  text: string;
  rating: number;
  avatar?: string;
  date: string;
  featured: boolean;
  status: ContentStatus;
  source?: string;
  order: number;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: ContentStatus;
  updatedAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  organisation?: string;
  email: string;
  phone?: string;
  type: "PROJECT_ENQUIRY" | "BOOKING_REQUEST" | "GENERAL";
  services: string[];
  configuratorChoices?: ConfiguratorData;
  goals?: string;
  targetDate?: string;
  budget?: string;
  notes?: string;
  bookingDate?: string;
  bookingTime?: string;
  timestamp: string;
  source: string;
  status: "NEW" | "IN_REVIEW" | "CONTACTED" | "BOOKED" | "COMPLETED" | "ARCHIVED";
  adminNotes?: string;
  updatedAt: string;
}

export interface ConfiguratorData {
  businessType: string;
  needs: string[];
  priority: string;
  name?: string;
  email?: string;
  message?: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  altText: string;
  title: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  size?: number;
  usage: string;
  featured: boolean;
  status: ContentStatus;
  uploadedAt: string;
  updatedAt: string;
}

export interface SiteSetting {
  heroHeading: string;
  heroParagraph: string;
  heroCta1Label: string;
  heroCta1Link: string;
  heroCta2Label: string;
  heroCta2Link: string;
  heroImageId?: string;
  heroImageUrl?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  phone?: string;
  location?: string;
  businessHours?: string;
  contactCta?: string;
  bookingDestination?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
  youtube?: string;
  footerDescription: string;
  footerCta?: string;
  globalSeoTitle?: string;
  globalSeoDescription?: string;
  ogImage?: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  timestamp: string;
  details?: string;
}
