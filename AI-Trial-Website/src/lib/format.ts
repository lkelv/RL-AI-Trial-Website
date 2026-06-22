import type { CSSProperties } from "react";
import type { AccentName } from "../types";

/** Two-letter initials for an avatar. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Accent token name → CSS color variable. */
export const ACCENT_COLOR: Record<AccentName, string> = {
  mint: "var(--color-mint)",
  amber: "var(--color-amber)",
  pine: "var(--color-pine-soft)",
  info: "var(--color-info)",
  ink: "var(--color-ink-dim)",
};

/** Translucent tint of an accent, for chip/avatar/badge backgrounds. */
export function accentTint(name: AccentName, pct = 16): string {
  return `color-mix(in srgb, ${ACCENT_COLOR[name]} ${pct}%, transparent)`;
}

/** Inline animation-delay style for staggered reveals. */
export function stagger(index: number, step = 70, base = 60): CSSProperties {
  return { animationDelay: `${base + index * step}ms` };
}
