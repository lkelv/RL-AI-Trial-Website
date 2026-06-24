import { Link } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Badge } from "../../components/ui/Badge";
import { IconArrowRight } from "../../components/ui/Icons";
import type { AccentName } from "../../types";
import { ACCENT_COLOR, stagger } from "../../lib/format";

const FEATURES: {
  title: string;
  description: string;
  to: string;
  accent: AccentName;
  tag?: string;
}[] = [
  {
    title: "Practice",
    description:
      "Build a custom VCAA-style paper in six quick steps, with questions and full worked solutions, generated instantly.",
    to: "/student/ai/practice",
    accent: "mint",
  },
  {
    title: "AI Marking",
    description:
      "Upload your worked solutions and get them marked instantly, with feedback and a score.",
    to: "/student/ai/marking",
    accent: "amber",
  },
  {
    title: "Ask the Tutor",
    description:
      "Stuck on a problem? Ask the AI tutor and get a clear, step-by-step worked answer.",
    to: "/student/ai/ask",
    accent: "info",
    tag: "preview",
  },
];

export default function AiFeaturesHub() {
  return (
    <AppShell back={{ to: "/student", label: "Student home" }}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
        <div
          className="rl-reveal flex flex-wrap items-end justify-between gap-4"
          style={stagger(0)}
        >
          <div>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">AI Features</h1>
            <p className="mt-2 font-mono text-sm text-ink-dim">
              your personal AI maths tutor, on demand
            </p>
          </div>
          <Badge color="mint" dot>
            powered by RL AI
          </Badge>
        </div>

        {/* chapter index - oversized numerals, type-led */}
        <div className="mt-12 border-t border-line">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              to={f.to}
              className="rl-reveal group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 border-b border-l-2 border-l-transparent border-line py-8 pl-2 transition-[background-color,border-color,padding] duration-150 hover:bg-raised/40 hover:border-l-[var(--rc)] hover:pl-4 sm:gap-x-10 sm:py-10"
              style={{ ["--rc" as string]: ACCENT_COLOR[f.accent], ...stagger(1 + i) }}
            >
              <span className="font-mono text-3xl leading-none text-[var(--rc)] sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-3xl leading-[0.95] text-ink sm:text-5xl">
                    {f.title}
                  </h2>
                  {f.tag && <Badge color="info">{f.tag}</Badge>}
                </div>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink-dim">{f.description}</p>
              </div>
              <IconArrowRight
                size={22}
                className="mt-1.5 text-ink-faint transition-[transform,color] duration-150 group-hover:translate-x-1 group-hover:text-[var(--rc)]"
              />
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
