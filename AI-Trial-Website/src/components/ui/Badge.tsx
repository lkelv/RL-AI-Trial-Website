import type { ReactNode } from "react";
import type { AccentName } from "../../types";
import { ACCENT_COLOR, accentTint } from "../../lib/format";

interface BadgeProps {
  children: ReactNode;
  color?: AccentName;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, color = "mint", className = "", dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[0.7rem] font-medium ${className}`}
      style={{
        background: accentTint(color, 14),
        color: ACCENT_COLOR[color],
        border: `1px solid ${accentTint(color, 30)}`,
      }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5"
          style={{ background: ACCENT_COLOR[color] }}
        />
      )}
      {children}
    </span>
  );
}
