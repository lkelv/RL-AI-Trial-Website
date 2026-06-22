import { AppShell } from "../../components/layout/AppShell";
import { RoleCard } from "../../components/ui/RoleCard";
import { Badge } from "../../components/ui/Badge";
import {
  IconChat,
  IconMarking,
  IconSparkles,
} from "../../components/ui/Icons";
import { stagger } from "../../lib/format";

export default function AiFeaturesHub() {
  return (
    <AppShell back={{ to: "/student", label: "Student home" }}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
        <div className="rl-reveal flex items-center gap-3" style={stagger(0)}>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-mint/15 text-mint">
            <IconSparkles size={24} />
          </span>
          <div>
            <h1 className="text-3xl text-ink sm:text-4xl">AI Features</h1>
            <p className="text-sm text-ink-dim">Your personal AI maths tutor, on demand.</p>
          </div>
          <Badge color="mint" dot className="ml-auto hidden sm:inline-flex">
            Powered by RL AI
          </Badge>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rl-reveal" style={stagger(1)}>
            <RoleCard
              title="Practice"
              description="Build a custom VCAA-style paper in 6 quick steps — questions and worked solutions, generated instantly."
              icon={<IconSparkles size={26} />}
              to="/student/ai/practice"
              accent="mint"
              cta="Start practice"
            />
          </div>
          <div className="rl-reveal" style={stagger(2)}>
            <RoleCard
              title="AI Marking Paper"
              description="Upload your worked solutions and get them marked instantly, with feedback and a score."
              icon={<IconMarking size={26} />}
              to="/student/ai/marking"
              accent="amber"
              cta="Mark a paper"
            />
          </div>
          <div className="rl-reveal" style={stagger(3)}>
            <RoleCard
              title="Ask AI Question"
              description="Stuck on a problem? Ask the AI tutor and get a clear, step-by-step worked answer."
              icon={<IconChat size={26} />}
              to="/student/ai/ask"
              accent="info"
              cta="Ask a question"
              tag="Preview"
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
