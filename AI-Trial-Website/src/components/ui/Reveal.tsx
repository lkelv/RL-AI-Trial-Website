import type { CSSProperties, ReactNode } from "react";

type RevealVariant = "up" | "scale" | "fade";

const CLASS: Record<RevealVariant, string> = {
  up: "rl-reveal",
  scale: "rl-reveal-scale",
  fade: "rl-fade-in",
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
  style?: CSSProperties;
}

/** Single-element entrance animation (CSS only). */
export function Reveal({
  children,
  delay = 0,
  variant = "up",
  className = "",
  style,
}: RevealProps) {
  return (
    <div className={`${CLASS[variant]} ${className}`} style={{ animationDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}
