import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "mark";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FitLaunchMark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: 28, md: 36, lg: 48 };
  const s = sizes[size];
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("flex-shrink-0", className)}
      aria-label="FitLaunch Media mark"
    >
      {/* Outer diamond sweeping lines */}
      <path d="M60 8 L108 35 L108 85 L60 112 L12 85 L12 35 Z" stroke="#00F5A0" strokeWidth="1.5" fill="none" strokeLinejoin="round" opacity="0.6"/>
      {/* Hexagon */}
      <path d="M60 22 L90 39 L90 73 L60 90 L30 73 L30 39 Z" stroke="#00F5A0" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      {/* Infinity / data flow */}
      <path d="M38 56 Q44 46 56 56 Q68 66 74 56 Q80 46 86 56 Q80 66 74 56 Q68 46 56 56 Q44 66 38 56 Z" fill="none" stroke="url(#mintGrad)" strokeWidth="3" strokeLinecap="round"/>
      {/* Sweeping wings */}
      <path d="M12 35 L30 39" stroke="#00F5A0" strokeWidth="1.5" opacity="0.5"/>
      <path d="M12 85 L30 73" stroke="#00F5A0" strokeWidth="1.5" opacity="0.5"/>
      <path d="M108 35 L90 39" stroke="#00F5A0" strokeWidth="1.5" opacity="0.5"/>
      <path d="M108 85 L90 73" stroke="#00F5A0" strokeWidth="1.5" opacity="0.5"/>
      <defs>
        <linearGradient id="mintGrad" x1="38" y1="56" x2="86" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F5A0"/>
          <stop offset="50%" stopColor="#00e090"/>
          <stop offset="100%" stopColor="#00F5A0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({ variant = "full", className, size = "md" }: LogoProps) {
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-xl" };
  const mediaSizes = { sm: "text-[8px]", md: "text-[10px]", lg: "text-xs" };

  if (variant === "mark") {
    return <FitLaunchMark className={className} size={size} />;
  }

  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="FitLaunch Media">
      <FitLaunchMark size={size} />
      <div className="flex flex-col leading-none">
        <div className={cn("font-display font-black tracking-widest uppercase", textSizes[size])}>
          <span className="text-mint">FIT</span>
          <span className="text-off-white">LAUNCH</span>
        </div>
        <div className={cn("font-display font-bold tracking-[0.25em] uppercase text-muted-slate", mediaSizes[size])}>
          — MEDIA —
        </div>
      </div>
    </div>
  );
}
