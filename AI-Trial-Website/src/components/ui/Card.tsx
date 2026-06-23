import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = "", interactive = false }: CardProps) {
  return (
    <div
      className={`border border-line bg-raised ${
        interactive
          ? "cursor-pointer transition-colors duration-150 hover:border-mint hover:bg-raised-2"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
