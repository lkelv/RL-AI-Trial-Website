import type { ReactNode } from "react";
import { IconCheck } from "./Icons";

interface OptionTileProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
  icon?: ReactNode;
  className?: string;
}

export function OptionTile({
  selected,
  onClick,
  title,
  hint,
  icon,
  className = "",
}: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all duration-200 ${
        selected
          ? "border-mint/70 bg-mint/10 shadow-[0_0_0_1px_var(--color-mint)_inset]"
          : "border-line bg-raised hover:border-mint/40 hover:bg-raised-2"
      } ${className}`}
    >
      {icon && (
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            selected ? "bg-mint/20 text-mint" : "bg-base/60 text-ink-dim group-hover:text-ink"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`block font-semibold ${selected ? "text-ink" : "text-ink"}`}>{title}</span>
        {hint && <span className="mt-0.5 block text-xs leading-snug text-ink-dim">{hint}</span>}
      </span>
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
          selected ? "border-mint bg-mint text-night" : "border-line text-transparent"
        }`}
      >
        <IconCheck size={13} />
      </span>
    </button>
  );
}
