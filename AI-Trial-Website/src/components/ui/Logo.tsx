import logoUrl from "../../../assets/RL-logo-with-text.png";

interface LogoProps {
  /** Rendered height of the logo image in pixels. */
  size?: number;
  className?: string;
}

export function Logo({ size = 54, className = "" }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="RL Black Magic · AI Tutoring"
      height={size}
      style={{ height: size }}
      className={`inline-block w-auto shrink-0 ${className}`}
    />
  );
}
