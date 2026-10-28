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
  // Support both Logo.png and logo.png
  const [logoSrc, setLogoSrc] = useState("/Logo.png");
  const [imageError, setImageError] = useState(false);

  const dimensionClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const handleImageError = () => {
    if (logoSrc === "/Logo.png") {
      setLogoSrc("/logo.png");
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Logo container */}
      <div
        className={`${dimensionClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 relative bg-transparent`}
      >
        {!imageError ? (
          <img
            src={logoSrc}
            alt="Akalin Logo"
            className="w-full h-full object-contain"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full rounded-2xl bg-stone-900 dark:bg-stone-100 flex items-center justify-center text-white dark:text-stone-900 shadow-sm">
            <Box className="w-5 h-5 text-emerald-400 dark:text-emerald-700" />
          </div>
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
