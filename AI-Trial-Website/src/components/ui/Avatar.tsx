import type { AccentName } from "../../types";
import { ACCENT_COLOR, accentTint, initials } from "../../lib/format";

interface AvatarProps {
  name: string;
  color?: AccentName;
  size?: number;
  className?: string;
}

export function Avatar({ name, color = "mint", size = 40, className = "" }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: accentTint(color, 18),
        color: ACCENT_COLOR[color],
        border: `1px solid ${accentTint(color, 42)}`,
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
