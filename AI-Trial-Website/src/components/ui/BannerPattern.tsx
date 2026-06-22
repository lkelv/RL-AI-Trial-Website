import type { AccentName, ClassRoom } from "../../types";
import { ACCENT_COLOR } from "../../lib/format";

/** Decorative low-opacity pattern overlay for class banners. */
export function BannerPattern({
  pattern,
  color,
}: {
  pattern: ClassRoom["bannerPattern"];
  color: AccentName;
}) {
  const c = ACCENT_COLOR[color];

  if (pattern === "grid") {
    return (
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />
    );
  }
  if (pattern === "dots") {
    return (
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(${c} 1.5px, transparent 1.6px)`,
          backgroundSize: "18px 18px",
        }}
      />
    );
  }
  if (pattern === "waves") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 200 80">
        <path d="M0 50 Q 25 30 50 50 T 100 50 T 150 50 T 200 50" fill="none" stroke={c} strokeWidth="2" />
        <path d="M0 64 Q 25 44 50 64 T 100 64 T 150 64 T 200 64" fill="none" stroke={c} strokeWidth="2" />
      </svg>
    );
  }
  // rings
  return (
    <svg className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30" width="160" height="160" viewBox="0 0 160 160">
      {[20, 40, 60, 75].map((r) => (
        <circle key={r} cx="120" cy="80" r={r} fill="none" stroke={c} strokeWidth="2" />
      ))}
    </svg>
  );
}
