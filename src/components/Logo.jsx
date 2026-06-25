
export function LogoIcon({ className = "", ...props }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className}`}>
      <img
        src="/logo.jpg"
        alt="Slayzi"
        className="w-full h-full object-contain blend-logo p-0.5"
        {...props}
      />
    </div>
  );
}

export default function Logo({ className = "flex items-center", iconSize = "h-9" }) {
  return (
    <div className={className}>
      <img
        src="/logo.jpg"
        alt="SLAYZI"
        className={`w-auto object-contain blend-logo ${iconSize}`}
      />
    </div>
  );
}
