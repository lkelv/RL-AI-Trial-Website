import type { SelectHTMLAttributes } from "react";
import { IconChevronDown } from "./Icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = "", children, ...props }: SelectProps) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-ink-dim">{label}</span>}
      <div className="relative">
        <select
          className={`w-full cursor-pointer appearance-none rounded-md border border-line bg-base px-3.5 py-2.5 pr-10 text-sm text-ink outline-none transition-colors focus:border-mint/60 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint"
        />
      </div>
    </label>
  );
}
