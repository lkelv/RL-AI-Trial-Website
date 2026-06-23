import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

export type ButtonVariant = "primary" | "amber" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-mint text-night font-semibold border border-transparent hover:bg-mint-soft",
  amber:
    "bg-amber text-night font-semibold border border-transparent hover:bg-amber-soft",
  outline:
    "bg-raised text-ink border border-line hover:border-mint/50 hover:bg-raised-2",
  ghost: "bg-transparent text-ink-dim border border-transparent hover:text-ink hover:bg-raised",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-sm rounded-md gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-md gap-2",
  lg: "px-7 py-3.5 text-base rounded-md gap-2.5",
};

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/60";

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
