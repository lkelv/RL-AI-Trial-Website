import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = "", interactive = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-line bg-raised ${
        interactive
          ? "cursor-pointer transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-mint/45 hover:bg-raised-2"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
