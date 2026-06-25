import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---- roles ---- */
export const IconStudent = (p: IconProps) => (
  <Base {...p}>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
    <path d="M22 10v5" />
  </Base>
);
export const IconParent = (p: IconProps) => (
  <Base {...p}>
    <circle cx="8" cy="8" r="3" />
    <circle cx="17" cy="9.5" r="2.3" />
    <path d="M2.5 20c0-3 2.6-5 5.5-5s5.5 2 5.5 5" />
    <path d="M15 20c.2-2.4 1.6-4 3.4-4 1.6 0 2.9 1.2 3.1 3" />
  </Base>
);
export const IconTeacher = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
    <path d="M7 21h10M12 17v4" />
    <path d="M6.5 12.5 9.5 9l2 2 4-4.5" />
  </Base>
);
export const IconAdmin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 2.5 4 6v5.5c0 4.5 3.2 8 8 9.5 4.8-1.5 8-5 8-9.5V6l-8-3.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
);

/* ---- AI tools / nav ---- */
export const IconSparkles = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 13.7 9 19 10.5 13.7 12 12 17.5 10.3 12 5 10.5 10.3 9 12 3.5Z" />
    <path d="M18.5 4v3M20 5.5h-3M5.5 16v2.5M6.75 17.25h-2.5" />
  </Base>
);
export const IconMarking = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 4.5h12l4 4V20H4V4.5Z" />
    <path d="M15 4.5V9h4" />
    <path d="m8 13.5 2 2 4-4.5" />
  </Base>
);
export const IconChat = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 5h16v11H9l-4 3.5V16H4V5Z" />
    <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" />
  </Base>
);
export const IconClassroom = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 5.5h7a2 2 0 0 1 2 2V20a1.8 1.8 0 0 0-1.8-1.8H3V5.5Z" />
    <path d="M21 5.5h-7a2 2 0 0 0-2 2V20a1.8 1.8 0 0 1 1.8-1.8H21V5.5Z" />
  </Base>
);
export const IconBook = IconClassroom;

/* ---- stats ---- */
export const IconScore = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="0.6" fill="currentColor" />
  </Base>
);
export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 2.5 2.5L16 9" />
  </Base>
);
export const IconTest = (p: IconProps) => (
  <Base {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <path d="M9 3.5h6v3H9zM8.5 11h3M8.5 15h7" />
  </Base>
);
export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
  </Base>
);
export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 2.5 4 6v5.5c0 4.5 3.2 8 8 9.5 4.8-1.5 8-5 8-9.5V6l-8-3.5Z" />
  </Base>
);
export const IconChart = (p: IconProps) => (
  <Base {...p}>
    <path d="M3.5 20h17" />
    <path d="M7 20v-5M11 20v-9M15 20v-4M19 20v-12" />
  </Base>
);

/* ---- file kinds ---- */
export const IconFile = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 3.5h8l4 4V20.5H6V3.5Z" />
    <path d="M13 3.5V8h4" />
  </Base>
);
export const IconLink = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.5 14.5 14.5 9.5" />
    <path d="M8 11 6 13a3 3 0 0 0 4.2 4.2l2-2" />
    <path d="M16 13l2-2A3 3 0 0 0 13.8 6.8l-2 2" />
  </Base>
);
export const IconVideo = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="6" width="13" height="12" rx="2" />
    <path d="m16 10 5-2.5v9L16 14" />
  </Base>
);
export const IconSlides = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="4" width="17" height="12" rx="1.5" />
    <path d="M12 16v3M9 21h6" />
  </Base>
);

/* ---- actions / misc ---- */
export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Base>
);
export const IconDownload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v10m0 0 4-4m-4 4-4-4" />
    <path d="M5 18.5h14" />
  </Base>
);
export const IconExternal = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4h6v6M20 4l-8 8" />
    <path d="M18 14v5.5H4.5V6H10" />
  </Base>
);
export const IconUpload = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 16V6m0 0 4 4m-4-4-4 4" />
    <path d="M5 18.5h14" />
  </Base>
);
export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);
export const IconMinus = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14" />
  </Base>
);
export const IconChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
);
export const IconImage = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="m4 17 5-5 4 4 3-2.5 4 3.5" />
  </Base>
);
export const IconTrash = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 6.5h16" />
    <path d="M9 6.5V4h6v2.5" />
    <path d="m6 6.5 1 13.5h10l1-13.5" />
    <path d="M10 10.5v6M14 10.5v6" />
  </Base>
);
export const IconTag = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 3.5h7.2L20 13.3l-6.7 6.7L3.5 10.7V3.5Z" />
    <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
  </Base>
);
export const IconFilter = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 5h18l-7 8v6l-4-2.5V13L3 5Z" />
  </Base>
);
export const IconPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 3.5h6l-1 5 3 3v2H7v-2l3-3-1-5Z" />
    <path d="M12 13.5V20" />
  </Base>
);
export const IconAlert = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 21 19H3L12 3.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </Base>
);
export const IconStar = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8L12 4Z" />
  </Base>
);
export const IconHeart = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.6 12 20 12 20Z" />
  </Base>
);
export const IconMegaphone = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 10v3l9 4V6l-9 4Z" />
    <path d="M13 7.5c2 0 4 1.5 4 4s-2 4-4 4M6 13.5V18h3v-3" />
  </Base>
);
export const IconLogout = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4.5H6v15h8" />
    <path d="M11 12h9m0 0-3.5-3.5M20 12l-3.5 3.5" />
  </Base>
);
