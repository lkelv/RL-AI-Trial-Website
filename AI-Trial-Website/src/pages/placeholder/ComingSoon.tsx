import { Link } from "react-router-dom";
import type { AccentName } from "../../types";
import { Logo } from "../../components/ui/Logo";
import { Badge } from "../../components/ui/Badge";
import { LinkButton } from "../../components/ui/Button";
import {
  IconAdmin,
  IconArrowRight,
  IconTeacher,
} from "../../components/ui/Icons";
import { ACCENT_COLOR, stagger } from "../../lib/format";

const VARIANTS = {
  teacher: {
    title: "Teacher Workspace",
    kicker: "tutor tools",
    icon: <IconTeacher size={26} />,
    accent: "amber" as AccentName,
    blurb:
      "The tutor's command centre: upload homework, record and release scores, and run your classes.",
    features: [
      "Create & assign homework with due dates",
      "Record marks and release results to students",
      "Manage class rosters & post announcements",
      "Track submissions and flag missing work",
    ],
  },
  admin: {
    title: "Admin Console",
    kicker: "platform operations",
    icon: <IconAdmin size={26} />,
    accent: "mint" as AccentName,
    blurb:
      "Full oversight across the whole RL platform, for keeping everything running smoothly.",
    features: [
      "Manage all students, parents & tutors",
      "Edit any class, score or attendance record",
      "Broadcast platform-wide announcements",
      "Audit activity & resolve issues",
    ],
  },
};

export default function ComingSoon({ variant }: { variant: "teacher" | "admin" }) {
  const v = VARIANTS[variant];
  const color = ACCENT_COLOR[v.accent];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-6 py-5 sm:px-10">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center px-6 py-10 sm:px-10">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-x-14 gap-y-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* intro - left aligned, no hero centering */}
          <div>
            <div className="rl-reveal flex items-center gap-3" style={stagger(0)}>
              <span style={{ color }}>{v.icon}</span>
              <Badge color="amber" dot>
                In development
              </Badge>
            </div>

            <p
              className="rl-reveal mt-7 font-mono text-xs"
              style={{ color, ...stagger(1) }}
            >
              {v.kicker}
            </p>
            <h1 className="rl-reveal mt-3 text-4xl leading-[1.04] text-ink sm:text-5xl" style={stagger(2)}>
              {v.title}
            </h1>
            <p className="rl-reveal mt-4 max-w-md leading-relaxed text-ink-dim" style={stagger(3)}>
              {v.blurb}
            </p>

            <div className="rl-reveal mt-8 flex flex-wrap items-center gap-3" style={stagger(4)}>
              <LinkButton to="/login?role=student">
                Try the Student demo <IconArrowRight size={16} />
              </LinkButton>
              <LinkButton to="/" variant="outline">
                ← Back to home
              </LinkButton>
            </div>
          </div>

          {/* roadmap - a spec-sheet ledger of what's coming */}
          <div className="rl-reveal overflow-hidden border border-line bg-raised" style={stagger(3)}>
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="font-mono text-[0.7rem] text-ink-faint">on the roadmap</span>
              <span className="font-mono text-[0.7rem] text-ink-faint">
                {String(v.features.length).padStart(2, "0")} planned
              </span>
            </div>
            <ul>
              {v.features.map((f, i) => (
                <li
                  key={f}
                  className="flex items-start gap-4 border-b border-line/60 px-5 py-4 text-sm text-ink-dim last:border-b-0"
                >
                  <span className="font-mono text-xs tabular-nums" style={{ color }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
