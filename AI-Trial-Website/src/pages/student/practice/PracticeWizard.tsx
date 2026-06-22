import { useReducer } from "react";
import type { Difficulty, PaperType, PracticeSelection } from "../../../types";
import {
  DIFFICULTIES,
  PAPER_TYPES_BY_FAMILY,
  QUESTION_COUNT_PRESETS,
  SOURCE_LABELS,
  SUBJECTS,
  getSubject,
} from "../../../data";
import { AppShell } from "../../../components/layout/AppShell";
import { StepIndicator } from "../../../components/ui/StepIndicator";
import { OptionTile } from "../../../components/ui/OptionTile";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { FakeAiOverlay } from "../../../components/feedback/FakeAiOverlay";
import {
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconSparkles,
} from "../../../components/ui/Icons";
import { PracticeResult } from "./PracticeResult";

const STEPS = [
  { label: "Subject", title: "Choose your subject", desc: "Which course are you practising for?" },
  { label: "Topic", title: "Pick a topic", desc: "Select an overall topic, then narrow to a sub-topic." },
  { label: "Difficulty", title: "Set the difficulty", desc: "How challenging should the questions be?" },
  { label: "Type", title: "Paper type", desc: "What kind of paper do you want to generate?" },
  { label: "Questions", title: "How many questions?", desc: "Choose how long your paper should be." },
  { label: "Source", title: "Where from?", desc: "Split your paper between authentic VCAA and RL-modified questions." },
];

const GEN_PHASES = [
  "Analysing topic & difficulty",
  "Selecting VCAA questions",
  "Generating modified questions",
  "Compiling worked solutions",
  "Finalising your papers",
];

type Phase = "wizard" | "generating" | "result";
interface State extends PracticeSelection {
  step: number;
  phase: Phase;
}

type Action =
  | { type: "patch"; patch: Partial<PracticeSelection> }
  | { type: "goto"; step: number }
  | { type: "next" }
  | { type: "back" }
  | { type: "generate" }
  | { type: "complete" }
  | { type: "reset" };

const INITIAL: State = {
  step: 1,
  phase: "wizard",
  subjectId: null,
  overallTopic: null,
  subTopic: null,
  difficulty: null,
  paperType: null,
  questionCount: 6,
  vcaaCount: 3,
  modifiedCount: 3,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "patch":
      return { ...state, ...action.patch };
    case "goto":
      return { ...state, step: action.step };
    case "next":
      return { ...state, step: Math.min(STEPS.length, state.step + 1) };
    case "back":
      return { ...state, step: Math.max(1, state.step - 1) };
    case "generate":
      return { ...state, phase: "generating" };
    case "complete":
      return { ...state, phase: "result" };
    case "reset":
      return { ...INITIAL };
    default:
      return state;
  }
}

function Stepper({
  value,
  onChange,
  min = 0,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  const btn =
    "flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-base/60 text-ink transition-colors hover:border-mint/50 hover:text-mint disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="inline-flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}>
        <IconMinus size={16} />
      </button>
      <span className="w-12 text-center font-mono text-2xl font-semibold text-ink">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>
        <IconPlus size={16} />
      </button>
    </div>
  );
}

export default function PracticeWizard() {
  const [s, dispatch] = useReducer(reducer, INITIAL);

  const subject = getSubject(s.subjectId);
  const topics = subject?.topics ?? [];
  const currentOverall = topics.find((t) => t.overall === s.overallTopic);
  const subs = currentOverall?.subs ?? [];
  const paperTypes = subject ? PAPER_TYPES_BY_FAMILY[subject.family] : [];

  const canProceed = (() => {
    switch (s.step) {
      case 1:
        return !!s.subjectId;
      case 2:
        return !!s.overallTopic;
      case 3:
        return !!s.difficulty;
      case 4:
        return !!s.paperType;
      case 5:
        return s.questionCount >= 1;
      case 6:
        return s.vcaaCount + s.modifiedCount === s.questionCount;
      default:
        return false;
    }
  })();

  const isLast = s.step === STEPS.length;
  const meta = STEPS[s.step - 1];

  function setCount(c: number) {
    const vcaa = Math.floor(c / 2);
    dispatch({ type: "patch", patch: { questionCount: c, vcaaCount: vcaa, modifiedCount: c - vcaa } });
  }

  if (s.phase === "result") {
    return (
      <AppShell back={{ to: "/student/ai", label: "AI Features" }}>
        <PracticeResult selection={s} onReset={() => dispatch({ type: "reset" })} />
      </AppShell>
    );
  }

  return (
    <AppShell back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto w-full max-w-3xl px-6 py-8">
        <div className="rl-reveal flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-mint/15 text-mint">
            <IconSparkles size={22} />
          </span>
          <div>
            <h1 className="text-2xl text-ink">Practice paper generator</h1>
            <p className="text-sm text-ink-dim">Step {s.step} of {STEPS.length} · {meta.label}</p>
          </div>
        </div>

        <div className="mt-6">
          <StepIndicator
            steps={STEPS.map((x) => x.label)}
            current={s.step}
            onStepClick={(n) => dispatch({ type: "goto", step: n })}
          />
        </div>

        <div className="relative mt-6">
          <div
            key={s.step}
            className="rl-reveal min-h-[380px] rounded-2xl border border-line/70 bg-raised/45 p-6 sm:p-7"
          >
            <h2 className="font-display text-xl text-ink">{meta.title}</h2>
            <p className="mt-1 text-sm text-ink-dim">{meta.desc}</p>

            <div className="mt-6">
              {/* STEP 1 — Subject */}
              {s.step === 1 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUBJECTS.map((subj) => (
                    <OptionTile
                      key={subj.id}
                      selected={s.subjectId === subj.id}
                      onClick={() =>
                        dispatch({
                          type: "patch",
                          patch: { subjectId: subj.id, overallTopic: null, subTopic: null, paperType: null },
                        })
                      }
                      title={subj.label}
                      hint={`${subj.family} · ${subj.topics.length} topic groups`}
                      icon={<span className="font-mono text-[11px] font-semibold">{subj.id}</span>}
                    />
                  ))}
                </div>
              )}

              {/* STEP 2 — Topic */}
              {s.step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select
                    label="Overall topic"
                    value={s.overallTopic ?? ""}
                    onChange={(e) =>
                      dispatch({
                        type: "patch",
                        patch: {
                          overallTopic: e.target.value || null,
                          subTopic: e.target.value ? "All sub-topics" : null,
                        },
                      })
                    }
                  >
                    <option value="">Select a topic…</option>
                    {topics.map((t) => (
                      <option key={t.overall} value={t.overall}>
                        {t.overall}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Sub-topic"
                    value={s.subTopic ?? ""}
                    disabled={!s.overallTopic || subs.length === 0}
                    onChange={(e) => dispatch({ type: "patch", patch: { subTopic: e.target.value } })}
                  >
                    {subs.length === 0 ? (
                      <option value="All sub-topics">All sub-topics</option>
                    ) : (
                      <>
                        <option value="All sub-topics">All sub-topics</option>
                        {subs.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>

                  {s.overallTopic && (
                    <p className="text-xs text-ink-faint sm:col-span-2">
                      {subs.length} sub-topics available in{" "}
                      <span className="text-ink-dim">{s.overallTopic}</span>.
                    </p>
                  )}
                </div>
              )}

              {/* STEP 3 — Difficulty */}
              {s.step === 3 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {DIFFICULTIES.map((d) => (
                    <OptionTile
                      key={d.id}
                      selected={s.difficulty === d.id}
                      onClick={() => dispatch({ type: "patch", patch: { difficulty: d.id as Difficulty } })}
                      title={d.label}
                      hint={d.hint}
                    />
                  ))}
                </div>
              )}

              {/* STEP 4 — Type */}
              {s.step === 4 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {paperTypes.map((t) => (
                    <OptionTile
                      key={t.id}
                      selected={s.paperType === t.id}
                      onClick={() => dispatch({ type: "patch", patch: { paperType: t.id as PaperType } })}
                      title={t.label}
                      hint={t.hint}
                    />
                  ))}
                </div>
              )}

              {/* STEP 5 — Questions */}
              {s.step === 5 && (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {QUESTION_COUNT_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCount(p)}
                        className={`rounded-lg border px-4 py-2 font-mono text-sm transition-colors ${
                          s.questionCount === p
                            ? "border-mint bg-mint/15 text-mint"
                            : "border-line bg-base/60 text-ink-dim hover:border-mint/40 hover:text-ink"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <span className="text-sm text-ink-dim">Or fine-tune:</span>
                    <Stepper value={s.questionCount} onChange={setCount} min={1} max={20} />
                  </div>
                </div>
              )}

              {/* STEP 6 — Source */}
              {s.step === 6 && (
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-line/70 bg-base/50 p-4">
                      <Badge color="mint">{SOURCE_LABELS.vcaa.title}</Badge>
                      <p className="mt-2 mb-4 text-xs leading-snug text-ink-dim">{SOURCE_LABELS.vcaa.blurb}</p>
                      <Stepper
                        value={s.vcaaCount}
                        min={0}
                        max={s.questionCount}
                        onChange={(v) =>
                          dispatch({
                            type: "patch",
                            patch: { vcaaCount: v, modifiedCount: s.questionCount - v },
                          })
                        }
                      />
                    </div>
                    <div className="rounded-xl border border-line/70 bg-base/50 p-4">
                      <Badge color="amber">{SOURCE_LABELS.modified.title}</Badge>
                      <p className="mt-2 mb-4 text-xs leading-snug text-ink-dim">{SOURCE_LABELS.modified.blurb}</p>
                      <Stepper
                        value={s.modifiedCount}
                        min={0}
                        max={s.questionCount}
                        onChange={(m) =>
                          dispatch({
                            type: "patch",
                            patch: { modifiedCount: m, vcaaCount: s.questionCount - m },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 font-mono text-sm">
                    <span className="text-mint">{s.vcaaCount} VCAA</span>
                    <span className="text-ink-faint">+</span>
                    <span className="text-amber">{s.modifiedCount} modified</span>
                    <span className="text-ink-faint">=</span>
                    <span className="text-ink">{s.vcaaCount + s.modifiedCount}</span>
                    <span className="text-ink-faint">/ {s.questionCount}</span>
                    {canProceed && <span className="text-good">✓</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* nav */}
          <div className="mt-5 flex items-center justify-between">
            <Button variant="ghost" onClick={() => dispatch({ type: "back" })} disabled={s.step === 1}>
              ← Back
            </Button>
            {isLast ? (
              <Button onClick={() => dispatch({ type: "generate" })} disabled={!canProceed} size="lg">
                <IconSparkles size={18} /> Generate papers
              </Button>
            ) : (
              <Button onClick={() => dispatch({ type: "next" })} disabled={!canProceed}>
                Next <IconArrowRight size={16} />
              </Button>
            )}
          </div>

          {s.phase === "generating" && (
            <FakeAiOverlay
              phases={GEN_PHASES}
              phaseDuration={700}
              title="Generating your practice paper…"
              subtitle="RL AI is assembling questions and solutions"
              onComplete={() => dispatch({ type: "complete" })}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
