import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { IconArrowRight, IconChart, IconClassroom, IconSparkles } from "../../components/ui/Icons";
import type { AccentName } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { CLASSES } from "../../data";
import { ACCENT_COLOR, stagger } from "../../lib/format";

function Tile({
  to,
  accent,
  icon,
  title,
  desc,
  cta,
  large = false,
}: {
  to: string;
  accent: AccentName;
  icon: ReactNode;
  title: string;
  desc: string;
  cta: string;
  large?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`group flex flex-col bg-raised transition-colors duration-150 hover:bg-raised-2 ${
        large ? "p-7 sm:col-span-2 sm:row-span-2 sm:p-9" : "p-6"
      }`}
      style={{ ["--rc" as string]: ACCENT_COLOR[accent] }}
    >
      <span className="text-[var(--rc)]">{icon}</span>
      <div className={`mt-auto ${large ? "pt-16" : "pt-12"}`}>
        <h2 className={`font-display text-ink ${large ? "text-3xl sm:text-4xl" : "text-xl"}`}>
          {title}
        </h2>
        <p className={`mt-2 leading-relaxed text-ink-dim ${large ? "max-w-md text-base" : "text-sm"}`}>
          {desc}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-ink-faint transition-colors group-hover:text-[var(--rc)]">
          {cta}
          <IconArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function StudentHome() {
  const { user } = useAuth();
  const firstName = user?.displayName.split(" ")[0] ?? "there";

  const myClasses = CLASSES.filter((c) => user?.enrolledClassIds?.includes(c.id));
  const tasksDue = myClasses
    .flatMap((c) => c.tasks)
    .filter((t) => t.status === "assigned" || t.status === "missing").length;

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14 @container">
        <h1 className="rl-reveal text-4xl text-ink sm:text-5xl" style={stagger(0)}>
          Welcome back, <span className="text-mint">{firstName}</span>.
        </h1>
        <p className="rl-reveal mt-3 font-mono text-sm text-ink-dim" style={stagger(1)}>
          student / {myClasses.length} {myClasses.length === 1 ? "class" : "classes"} / {tasksDue} due
        </p>

        {/* asymmetric module grid — hairline gaps expose structure */}
        <div
          className="rl-reveal mt-10 grid gap-px border border-line bg-line sm:grid-cols-3 sm:grid-rows-2"
          style={stagger(2)}
        >
          <Tile
            large
            to="/student/ai"
            accent="mint"
            icon={<IconSparkles size={36} />}
            title="AI Features"
            desc="Generate practice papers, get instant AI marking, and ask the AI tutor any question — your personal maths tutor on demand."
            cta="open ai tools"
          />
          <Tile
            to="/student/classroom"
            accent="info"
            icon={<IconClassroom size={24} />}
            title="Classroom"
            desc="Announcements, tasks, materials and classmates."
            cta="open classroom"
          />
          <Tile
            to="/student/performance"
            accent="amber"
            icon={<IconChart size={24} />}
            title="Performance"
            desc="Scores, attendance and obedience trends."
            cta="view performance"
          />
        </div>

        {/* status ledger */}
        <div
          className="rl-reveal mt-4 grid border border-line font-mono text-xs sm:grid-cols-3"
          style={stagger(3)}
        >
          <span className="flex items-center gap-2.5 border-line px-4 py-3 text-ink-dim sm:border-r">
            <span className="h-2 w-2 bg-info" />
            {myClasses.length} active {myClasses.length === 1 ? "class" : "classes"}
          </span>
          <span className="flex items-center gap-2.5 border-line px-4 py-3 text-ink-dim sm:border-r">
            <span className="h-2 w-2 bg-amber" />
            {tasksDue} {tasksDue === 1 ? "task" : "tasks"} due
          </span>
          <span className="flex items-center gap-2.5 px-4 py-3 text-ink-dim">
            <span className="h-2 w-2 bg-mint" style={{ animation: "rl-pulse-glow 1.8s ease-in-out infinite" }} />
            AI tutor online
          </span>
        </div>
      </div>
    </AppShell>
  );
}
