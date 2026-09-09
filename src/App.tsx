import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StoreProvider } from "@/lib/store";
import { getAdminSession } from "@/lib/adminAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FitLaunchAI from "@/components/features/FitLaunchAI";

// Public pages
import HomePage from "@/pages/HomePage";
import ServicesPage from "@/pages/ServicesPage";
import IndustriesPage from "@/pages/IndustriesPage";
import WorkPage from "@/pages/WorkPage";
import ProcessPage from "@/pages/ProcessPage";
import AboutPage from "@/pages/AboutPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import IndustryPage from "@/pages/IndustryPage";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminServices from "@/pages/admin/AdminServices";
import AdminIndustries from "@/pages/admin/AdminIndustries";
import AdminFAQ from "@/pages/admin/AdminFAQ";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminMedia from "@/pages/admin/AdminMedia";
import AdminSEO from "@/pages/admin/AdminSEO";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!getAdminSession()) {
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <FitLaunchAI />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
        <Route path="/industries" element={<PublicLayout><IndustriesPage /></PublicLayout>} />
        <Route path="/work" element={<PublicLayout><WorkPage /></PublicLayout>} />
        <Route path="/process" element={<PublicLayout><ProcessPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

        {/* Industry pages */}
        <Route path="/gyms" element={<PublicLayout><IndustryPage /></PublicLayout>} />
        <Route path="/boxing-clubs" element={<PublicLayout><IndustryPage /></PublicLayout>} />
        <Route path="/fitness-studios" element={<PublicLayout><IndustryPage /></PublicLayout>} />
        <Route path="/football-academies" element={<PublicLayout><IndustryPage /></PublicLayout>} />
        <Route path="/sports-clubs" element={<PublicLayout><IndustryPage /></PublicLayout>} />
        <Route path="/sports-organisations" element={<PublicLayout><IndustryPage /></PublicLayout>} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/projects" element={<AdminGuard><AdminProjects /></AdminGuard>} />
        <Route path="/admin/services" element={<AdminGuard><AdminServices /></AdminGuard>} />
        <Route path="/admin/industries" element={<AdminGuard><AdminIndustries /></AdminGuard>} />
        <Route path="/admin/reviews" element={<AdminGuard><AdminReviews /></AdminGuard>} />
        <Route path="/admin/bookings" element={<AdminGuard><AdminBookings /></AdminGuard>} />
        <Route path="/admin/media" element={<AdminGuard><AdminMedia /></AdminGuard>} />
        <Route path="/admin/faq" element={<AdminGuard><AdminFAQ /></AdminGuard>} />
        <Route path="/admin/seo" element={<AdminGuard><AdminSEO /></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />

        {/* 404 */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </StoreProvider>
  );
}
