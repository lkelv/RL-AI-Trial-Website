import { Link } from "react-router-dom";
import { Logo } from "../components/ui/Logo";
import { Badge } from "../components/ui/Badge";
import { IconArrowRight } from "../components/ui/Icons";
import { ACCENT_COLOR, stagger } from "../lib/format";
import type { AccentName } from "../types";

const ROLES: {
  title: string;
  description: string;
  to: string;
  accent: AccentName;
  comingSoon?: boolean;
}[] = [
  {
    title: "Students",
    description:
      "Join your classroom, generate AI practice papers, get instant marking and ask the AI tutor anything.",
    to: "/login?role=student",
    accent: "mint",
  },
  {
    title: "Parents",
    description:
      "Track your child's scores, attendance and progress with live updates from the RL team.",
    to: "/login?role=parent",
    accent: "info",
  },
  {
    title: "Teacher",
    description:
      "Upload homework, record scores and manage your classes — the tutor workspace.",
    to: "/teacher",
    accent: "amber",
    comingSoon: true,
  },
  {
    title: "Admin",
    description:
      "Full oversight of students, classes and announcements across the whole platform.",
    to: "/admin",
    accent: "pine",
    comingSoon: true,
  },
];

export default function Landing() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-10">
        <Logo />
        <span className="font-mono text-xs text-ink-faint">VCE · IB — tutoring platform</span>
      </header>

      <main className="flex-1 px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* masthead — deliberately asymmetric: headline left-heavy, lede dropped to baseline */}
          <div className="grid gap-x-12 gap-y-6 pt-16 pb-14 sm:pt-24 lg:grid-cols-12">
            <h1
              className="rl-reveal font-display text-6xl leading-[0.92] text-ink sm:text-7xl lg:col-span-8"
              style={stagger(0)}
            >
              The future of tutoring,{" "}
              <span className="italic text-mint">today.</span>
            </h1>
            <p
              className="rl-reveal self-end text-base leading-relaxed text-ink-dim lg:col-span-4 lg:pb-2"
              style={stagger(1)}
            >
              AI-generated practice, instant paper marking, and live progress
              tracking — purpose-built for VCE&nbsp;&amp;&nbsp;IB students, their
              parents, and tutors.
            </p>
          </div>

          {/* portal directory — a bordered index, not a card grid */}
          <nav className="border-t border-line pb-20">
            {ROLES.map((role, i) => (
              <Link
                key={role.title}
                to={role.to}
                className="rl-reveal group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-1 border-b border-l-2 border-l-transparent border-line py-6 pl-4 pr-1 transition-[background-color,border-color,padding] duration-150 hover:bg-raised/50 hover:pl-6 sm:grid-cols-[3.5rem_1fr_auto]"
                style={{ ["--rc" as string]: ACCENT_COLOR[role.accent], ...stagger(2 + i) }}
              >
                <span className="font-mono text-sm text-[var(--rc)] sm:text-base">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="font-display text-2xl text-ink sm:text-3xl">{role.title}</h2>
                    {role.comingSoon && <Badge color="amber">soon</Badge>}
                  </div>
                  <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-dim">
                    {role.description}
                  </p>
                </div>
                <span className="flex items-center gap-2 justify-self-end font-mono text-xs text-ink-faint transition-colors group-hover:text-[var(--rc)] sm:text-sm">
                  <span className="hidden sm:inline">{role.comingSoon ? "preview" : "enter"}</span>
                  <IconArrowRight
                    size={18}
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}
