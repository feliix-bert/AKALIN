"use client";

import React, { useState } from "react";
import { Box } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showText = true,
}) => {
  const [imageError, setImageError] = useState(false);

  const dimensionClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Logo container using /logo.png directly */}
      <div
        className={`${dimensionClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 relative bg-stone-900 dark:bg-stone-100`}
      >
        {!imageError ? (
          <img
            src="/logo.png"
            alt="Akalin Logo"
            className="w-full h-full object-contain p-0.5"
            onError={() => setImageError(true)}
          />
        ) : (
          <Box className="w-5 h-5 text-emerald-400 dark:text-emerald-700" />
        )}
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-stone-100 leading-none font-heading">
            Akalin<span className="text-emerald-600">.</span>
          </span>
          <span className="text-[10px] text-stone-500 font-medium tracking-wide">
            Ruang Kos Cerdas
          </span>
        </div>
      )}
    </div>
  );
};
