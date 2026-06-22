import { Link } from "react-router-dom";
import { Logo } from "../../components/ui/Logo";
import { Badge } from "../../components/ui/Badge";
import { LinkButton } from "../../components/ui/Button";
import {
  IconAdmin,
  IconArrowRight,
  IconCheck,
  IconTeacher,
} from "../../components/ui/Icons";
import { stagger } from "../../lib/format";

const VARIANTS = {
  teacher: {
    title: "Teacher Workspace",
    icon: <IconTeacher size={30} />,
    accent: "amber" as const,
    blurb:
      "The tutor's command centre — upload homework, record and release scores, and run your classes.",
    features: [
      "Create & assign homework with due dates",
      "Record marks and release results to students",
      "Manage class rosters & post announcements",
      "Track submissions and flag missing work",
    ],
  },
  admin: {
    title: "Admin Console",
    icon: <IconAdmin size={30} />,
    accent: "pine" as const,
    blurb:
      "Full oversight across the whole RL platform — for keeping everything running smoothly.",
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

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="px-6 py-5 sm:px-10">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg text-center">
          <span
            className="rl-reveal-scale mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-raised/60 text-mint"
            style={{ color: `var(--color-${v.accent === "pine" ? "mint" : v.accent})` }}
          >
            {v.icon}
          </span>

          <div className="rl-reveal" style={stagger(1)}>
            <Badge color="amber" className="mb-4">
              In development
            </Badge>
            <h1 className="font-display text-4xl text-ink">{v.title}</h1>
            <p className="mx-auto mt-3 max-w-md text-ink-dim">{v.blurb}</p>
          </div>

          <ul className="rl-reveal mx-auto mt-8 max-w-sm space-y-2.5 text-left" style={stagger(2)}>
            {v.features.map((f) => (
              <li key={f} className="flex items-center gap-3 rounded-xl border border-line/60 bg-raised/30 px-4 py-2.5 text-sm text-ink-dim">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint/12 text-mint">
                  <IconCheck size={14} />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="rl-reveal mt-8 flex items-center justify-center gap-3" style={stagger(3)}>
            <LinkButton to="/" variant="outline">
              ← Back to home
            </LinkButton>
            <LinkButton to="/login?role=student">
              Try the Student demo <IconArrowRight size={16} />
            </LinkButton>
          </div>
        </div>
      </main>
    </div>
  );
}
