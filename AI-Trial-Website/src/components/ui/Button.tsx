import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export type ButtonVariant =
  | "primary"
  | "amber"
  | "outline"
  | "ghost"
  | "mintSoft"
  | "amberSoft"
  | "infoSoft";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-mint text-night font-semibold border border-transparent hover:bg-mint-soft",
  amber:
    "bg-amber text-night font-semibold border border-transparent hover:bg-amber-soft",
  outline:
    "bg-raised text-ink border border-line hover:border-mint/50 hover:bg-raised-2",
  ghost: "bg-transparent text-ink-dim border border-transparent hover:text-ink hover:bg-raised",
  // tinted accent buttons — flat surface, accent text + hairline, colour-flip hover
  mintSoft:
    "bg-mint/10 text-mint border border-mint/30 hover:bg-mint/20 hover:border-mint/55",
  amberSoft:
    "bg-amber/10 text-amber border border-amber/30 hover:bg-amber/20 hover:border-amber/55",
  infoSoft:
    "bg-info/10 text-info border border-info/30 hover:bg-info/20 hover:border-info/55",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

const base =
  "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-0";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function LinkButton({
  to,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link to={to} className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}>
      {children}
    </Link>
  );
}
