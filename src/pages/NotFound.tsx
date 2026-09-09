import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FitLaunchMark } from "@/components/features/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-light-bg flex items-center justify-center px-6 pt-24">
      <div className="text-center max-w-md">
        <FitLaunchMark size="lg" className="mx-auto mb-8 opacity-40" />
        <h1 className="font-heading font-extrabold text-ink text-3xl mb-4">PAGE NOT FOUND</h1>
        <p className="text-light-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">
          BACK TO HOME <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
