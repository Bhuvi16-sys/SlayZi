import React from "react";

export function LogoIcon({ className = "h-8 w-8", ...props }) {
  return (
    <img
      src="/logo.jpg"
      alt="Slayzi"
      className={`${className} object-contain rounded-xl bg-white p-0.5 border border-white/15`}
      {...props}
    />
  );
}

export default function Logo({ className = "flex items-center", iconSize = "h-9" }) {
  return (
    <div className={className}>
      <img
        src="/logo.jpg"
        alt="SLAYZI"
        className={`${iconSize} w-auto object-contain rounded-xl border border-white/10 bg-white p-0.5`}
      />
    </div>
  );
}
