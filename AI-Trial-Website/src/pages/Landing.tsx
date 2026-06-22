import { Logo } from "../components/ui/Logo";
import { RoleCard } from "../components/ui/RoleCard";
import { Badge } from "../components/ui/Badge";
import {
  IconAdmin,
  IconParent,
  IconStudent,
  IconTeacher,
} from "../components/ui/Icons";
import { stagger } from "../lib/format";

const ROLES = [
  {
    title: "Students",
    description: "Join your classroom, generate AI practice papers, get instant marking and ask the AI tutor anything.",
    icon: <IconStudent size={28} />,
    to: "/login?role=student",
    accent: "mint" as const,
  },
  {
    title: "Parents",
    description: "Track your child's scores, attendance and progress at a glance, with live updates from the RL team.",
    icon: <IconParent size={28} />,
    to: "/login?role=parent",
    accent: "info" as const,
  },
  {
    title: "Teacher",
    description: "Upload homework, record scores and manage your classes — the tutor workspace.",
    icon: <IconTeacher size={28} />,
    to: "/teacher",
    accent: "amber" as const,
    comingSoon: true,
  },
  {
    title: "Admin",
    description: "Full oversight of students, classes and announcements across the whole platform.",
    icon: <IconAdmin size={28} />,
    to: "/admin",
    accent: "pine" as const,
    comingSoon: true,
  },
];

export default function Landing() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo />
        <Badge color="mint" dot className="rl-fade-in">
          Live demo
        </Badge>
      </header>

      <main className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p
            className="rl-reveal font-mono text-xs uppercase tracking-[0.32em] text-mint"
            style={stagger(0)}
          >
            RL Education · AI Tutoring Platform
          </p>
          <h1
            className="rl-reveal mt-4 max-w-3xl text-balance text-5xl leading-[1.02] text-ink sm:text-6xl"
            style={stagger(1)}
          >
            The future of tutoring,{" "}
            <span className="italic text-mint">today.</span>
          </h1>
          <p
            className="rl-reveal mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim"
            style={stagger(2)}
          >
            AI-generated practice, instant paper marking, and live progress
            tracking — purpose-built for VCE&nbsp;&amp;&nbsp;IB students, their
            parents, and tutors.
          </p>

          <p
            className="rl-reveal mt-12 mb-5 text-sm font-medium uppercase tracking-[0.18em] text-ink-faint"
            style={stagger(3)}
          >
            Choose your portal
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map((role, i) => (
              <div key={role.title} className="rl-reveal" style={stagger(4 + i)}>
                <RoleCard {...role} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-ink-faint sm:px-10">
        Demonstration build · All students, scores and data shown are illustrative.
      </footer>
    </div>
  );
}
