import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { AccentName } from "../../types";
import { ACCENT_COLOR, accentTint } from "../../lib/format";
import { Badge } from "./Badge";
import { IconArrowRight } from "./Icons";

interface RoleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  to: string;
  accent: AccentName;
  comingSoon?: boolean;
  cta?: string;
  tag?: string;
}

export function RoleCard({
  title,
  description,
  icon,
  to,
  accent,
  comingSoon = false,
  cta = "Enter portal",
  tag,
}: RoleCardProps) {
  return (
    <Link
      to={to}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-raised/40 p-6 transition-all duration-300 ease-out hover:-translate-y-1 ${
        comingSoon ? "border-line/60 opacity-80 hover:opacity-100" : "border-line/70"
      }`}
      style={{ ["--rc" as string]: ACCENT_COLOR[accent] }}
    >
      {/* top accent rule */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-50"
        style={{ background: ACCENT_COLOR[accent] }}
      />

      <span
        className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{
          background: accentTint(accent, 16),
          color: ACCENT_COLOR[accent],
          border: `1px solid ${accentTint(accent, 34)}`,
        }}
      >
        {icon}
      </span>

      <div className="relative flex items-center gap-2">
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        {comingSoon ? (
          <Badge color="amber" className="ml-auto">
            Coming soon
          </Badge>
        ) : (
          tag && (
            <Badge color={accent} className="ml-auto">
              {tag}
            </Badge>
          )
        )}
      </div>

      <p className="relative mt-2 text-sm leading-relaxed text-ink-dim">{description}</p>

      <div className="relative mt-auto pt-6 flex items-center gap-2 text-sm font-semibold" style={{ color: ACCENT_COLOR[accent] }}>
        <span>{comingSoon ? "Preview" : cta}</span>
        <IconArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
