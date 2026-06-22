import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = "", interactive = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line/70 bg-raised/45 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_18px_40px_-28px_rgba(0,0,0,0.8)] ${
        interactive
          ? "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-mint/45 hover:bg-raised/70"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
