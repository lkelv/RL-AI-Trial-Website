interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 36, withWordmark = true, className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="16" fill="#202830" />
        <rect
          x="1.5"
          y="1.5"
          width="61"
          height="61"
          rx="14.5"
          stroke="#74be9c"
          strokeOpacity="0.45"
          strokeWidth="3"
        />
        <path
          d="M19 46V18h11.2c5.3 0 8.6 3 8.6 7.8 0 3.6-1.9 6.2-5.2 7.2L40 46h-6.4l-5.6-11.6H24.8V46H19Zm5.8-16.2h4.8c2.4 0 3.9-1.4 3.9-3.6s-1.5-3.5-3.9-3.5h-4.8v7.1Z"
          fill="#74be9c"
        />
        <path d="M41 46V18h5.8v23h9.2v5H41Z" fill="#f4a52e" />
      </svg>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink">
            RL Black Magic
          </span>
          <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-ink-faint">
            AI Tutoring
          </span>
        </span>
      )}
    </span>
  );
}
