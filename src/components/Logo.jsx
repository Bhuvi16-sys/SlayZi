
export function LogoIcon({ className = "h-8 w-8 rounded-full", ...props }) {
  return (
    <img
      src="/logo.jpg"
      alt="Slayzi"
      className={`object-contain bg-[#09090E]/60 backdrop-blur-md border border-white/10 ${className}`}
      {...props}
    />
  );
}

export default function Logo({ className = "flex items-center", iconSize = "h-9 rounded-full" }) {
  return (
    <div className={className}>
      <img
        src="/logo.jpg"
        alt="SLAYZI"
        className={`w-auto object-contain border border-white/10 bg-[#09090E]/60 backdrop-blur-md ${iconSize}`}
      />
    </div>
  );
}
