import React from "react";

export function LogoIcon({ className = "h-8 w-8 rounded-xl", ...props }) {
  return (
    <img
      src="/logo.jpg"
      alt="Slayzi"
      className={`object-contain bg-white p-0.5 border border-white/15 ${className}`}
      {...props}
    />
  );
}

export default function Logo({ className = "flex items-center", iconSize = "h-9 rounded-xl" }) {
  return (
    <div className={className}>
      <img
        src="/logo.jpg"
        alt="SLAYZI"
        className={`w-auto object-contain border border-white/10 bg-white p-0.5 ${iconSize}`}
      />
    </div>
  );
}
