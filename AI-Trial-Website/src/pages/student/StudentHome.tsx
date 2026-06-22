import { AppShell } from "../../components/layout/AppShell";
import { RoleCard } from "../../components/ui/RoleCard";
import { IconChart, IconClassroom, IconSparkles } from "../../components/ui/Icons";
import { useAuth } from "../../context/AuthContext";
import { CLASSES } from "../../data";
import { stagger } from "../../lib/format";

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
        <p
          className="rl-reveal font-mono text-xs uppercase tracking-[0.28em] text-mint"
          style={stagger(0)}
        >
          Student portal
        </p>
        <h1 className="rl-reveal mt-3 text-4xl text-ink sm:text-5xl" style={stagger(1)}>
          Welcome back, <span className="text-mint">{firstName}</span>.
        </h1>
        <p className="rl-reveal mt-3 text-ink-dim" style={stagger(2)}>
          Jump into a classroom, track your performance, or let the AI tutor do the heavy lifting.
        </p>

        <div className="mt-10 grid auto-rows-fr grid-cols-1 gap-5 @2xl:grid-cols-2">
          <div className="rl-reveal h-full" style={stagger(3)}>
            <RoleCard
              title="Classroom"
              description="Your enrolled classes — announcements, tasks, materials and classmates, all in one place."
              icon={<IconClassroom size={28} />}
              to="/student/classroom"
              accent="info"
              cta="Open classroom"
            />
          </div>
          <div className="rl-reveal h-full" style={stagger(4)}>
            <RoleCard
              title="AI Features"
              description="Generate practice papers, get instant AI marking, and ask the AI tutor any question."
              icon={<IconSparkles size={28} />}
              to="/student/ai"
              accent="mint"
              cta="Open AI tools"
            />
          </div>
          <div className="rl-reveal" style={stagger(5)}>
            <RoleCard
              title="Performance"
              description="See your scores, attendance and obedience trends — the same live dashboard your parents see."
              icon={<IconChart size={28} />}
              to="/student/performance"
              accent="amber"
              cta="View performance"
            />
          </div>
        </div>

        <div
          className="rl-reveal mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-dim"
          style={stagger(6)}
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-info" />
            {myClasses.length} active {myClasses.length === 1 ? "class" : "classes"}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber" />
            {tasksDue} {tasksDue === 1 ? "task" : "tasks"} due
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-mint" style={{ animation: "rl-pulse-glow 1.8s ease-in-out infinite" }} />
            AI tutor online
          </span>
        </div>
      </div>
    </AppShell>
  );
}
