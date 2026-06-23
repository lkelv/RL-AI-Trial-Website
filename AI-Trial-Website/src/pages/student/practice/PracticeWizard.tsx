import { useReducer } from "react";
import type {
  Difficulty,
  DifficultyMix,
  PaperType,
  PracticeSelection,
} from "../../../types";
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
import { TopicMultiSelect } from "./TopicMultiSelect";

const STEPS = [
  { label: "Subject", title: "Choose your subject", desc: "Which course are you practising for?" },
  { label: "Topics", title: "Pick your topics", desc: "Choose one or more topics, or grab a whole unit at once." },
  { label: "Difficulty", title: "Set the difficulty", desc: "Select one or more levels. We'll split the paper by the percentages you choose." },
  { label: "Type", title: "Paper type", desc: "What kind of paper do you want to generate?" },
  { label: "Questions", title: "How many questions?", desc: "Choose how long your paper should be." },
  { label: "Source", title: "Where from?", desc: "Split your paper between authentic VCAA papers and the RL Question Bank." },
];

const GEN_PHASES = [
  "Analysing topics & difficulty",
  "Selecting VCAA questions",
  "Pulling from the RL Question Bank",
  "Compiling worked solutions",
  "Finalising your papers",
];

const DIFF_COLOR: Record<Difficulty, string> = {
  easy: "var(--color-mint)",
  normal: "var(--color-info)",
  intermediate: "var(--color-amber)",
  challenging: "var(--color-danger)",
};
const DIFF_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  normal: "Normal",
  intermediate: "Intermediate",
  challenging: "Challenging",
};

/* ---- difficulty-mix helpers (percentages always sum to 100) ---- */
function evenSplit(ids: Difficulty[]): DifficultyMix[] {
  const n = ids.length;
  if (n === 0) return [];
  const base = Math.floor(100 / n);
  const rem = 100 - base * n;
  return ids.map((id, i) => ({ id, percent: base + (i < rem ? 1 : 0) }));
}
function toggleDifficulty(current: DifficultyMix[], id: Difficulty): DifficultyMix[] {
  const has = current.some((d) => d.id === id);
  const ids = has
    ? current.filter((d) => d.id !== id).map((d) => d.id)
    : [...current.map((d) => d.id), id];
  const ordered = DIFFICULTIES.map((d) => d.id).filter((x) => ids.includes(x));
  return evenSplit(ordered);
}
function setPercent(current: DifficultyMix[], id: Difficulty, value: number): DifficultyMix[] {
  const v = Math.max(0, Math.min(100, value));
  const others = current.filter((d) => d.id !== id);
  if (others.length === 0) return [{ id, percent: 100 }];
  const remaining = 100 - v;
  const base = Math.floor(remaining / others.length);
  const rem = remaining - base * others.length;
  let oi = 0;
  return current.map((d) => {
    if (d.id === id) return { id, percent: v };
    const p = base + (oi < rem ? 1 : 0);
    oi += 1;
    return { id: d.id, percent: p };
  });
}

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
  topics: [],
  difficulties: [],
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
  step = 1,
  suffix = "",
  compact = false,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  compact?: boolean;
}) {
  const btn =
    "flex h-9 w-9 items-center justify-center border border-line bg-base text-ink transition-colors hover:border-mint/50 hover:text-mint disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="inline-flex items-center gap-3">
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min}>
        <IconMinus size={16} />
      </button>
      <span
        className={
          compact
            ? "w-14 text-center font-mono text-base font-semibold text-ink"
            : "w-14 text-center font-mono text-2xl font-semibold text-ink"
        }
      >
        {value}
        {suffix}
      </span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max}>
        <IconPlus size={16} />
      </button>
    </div>
  );
}

export default function PracticeWizard() {
  const [s, dispatch] = useReducer(reducer, INITIAL);

  const subject = getSubject(s.subjectId);
  const topics = subject?.topics ?? [];
  const paperTypes = subject ? PAPER_TYPES_BY_FAMILY[subject.family] : [];
  const single = s.difficulties.length === 1;

  const canProceed = (() => {
    switch (s.step) {
      case 1:
        return !!s.subjectId;
      case 2:
        return s.topics.length >= 1;
      case 3:
        return s.difficulties.length >= 1;
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
        <div className="rl-reveal">
          <h1 className="text-2xl text-ink">Practice paper generator</h1>
          <p className="mt-2 font-mono text-sm text-ink-dim">
            step {s.step} / {STEPS.length} · {meta.label}
          </p>
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
            className="rl-reveal min-h-[380px] border border-line bg-raised p-6 sm:p-7"
          >
            <h2 className="font-display text-xl text-ink">{meta.title}</h2>
            <p className="mt-1 text-sm text-ink-dim">{meta.desc}</p>

            <div className="mt-6">
              {/* STEP 1 - Subject */}
              {s.step === 1 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {SUBJECTS.map((subj) => (
                    <OptionTile
                      key={subj.id}
                      selected={s.subjectId === subj.id}
                      onClick={() =>
                        dispatch({
                          type: "patch",
                          patch: { subjectId: subj.id, topics: [], paperType: null },
                        })
                      }
                      title={subj.label}
                      hint={`${subj.family} · ${subj.topics.length} topic groups`}
                      icon={<span className="font-mono text-[11px] font-semibold">{subj.id}</span>}
                    />
                  ))}
                </div>
              )}

              {/* STEP 2 - Topics (multi-select) */}
              {s.step === 2 && (
                <div>
                  <TopicMultiSelect
                    topics={topics}
                    selected={s.topics}
                    onChange={(next) => dispatch({ type: "patch", patch: { topics: next } })}
                  />
                  <p className="mt-3 text-xs text-ink-faint">
                    Tip: use “All Unit 3 topics”, “All Unit 4 topics” or “All topics” to select a whole set at once.
                  </p>
                </div>
              )}

              {/* STEP 3 - Difficulty (multi-select + % mix) */}
              {s.step === 3 && (
                <div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {DIFFICULTIES.map((d) => (
                      <OptionTile
                        key={d.id}
                        selected={s.difficulties.some((x) => x.id === d.id)}
                        onClick={() =>
                          dispatch({ type: "patch", patch: { difficulties: toggleDifficulty(s.difficulties, d.id) } })
                        }
                        title={d.label}
                        hint={d.hint}
                      />
                    ))}
                  </div>

                  {s.difficulties.length > 0 && (
                    <div className="mt-6 border border-line bg-base p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">
                          Difficulty mix {single && <span className="text-ink-faint">· 100%</span>}
                        </span>
                        {!single && (
                          <button
                            type="button"
                            onClick={() =>
                              dispatch({
                                type: "patch",
                                patch: { difficulties: evenSplit(s.difficulties.map((d) => d.id)) },
                              })
                            }
                            className="text-xs font-medium text-mint transition-opacity hover:opacity-80"
                          >
                            Reset to even split
                          </button>
                        )}
                      </div>

                      {/* segmented bar */}
                      <div className="mb-4 flex h-2.5 w-full overflow-hidden border border-line bg-base">
                        {s.difficulties.map((d) => (
                          <div
                            key={d.id}
                            style={{ width: `${d.percent}%`, background: DIFF_COLOR[d.id] }}
                            className="h-full transition-[width] duration-300"
                          />
                        ))}
                      </div>

                      <div className="space-y-2">
                        {s.difficulties.map((d) => (
                          <div key={d.id} className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 shrink-0" style={{ background: DIFF_COLOR[d.id] }} />
                            <span className="flex-1 text-sm text-ink">{DIFF_LABEL[d.id]}</span>
                            <Stepper
                              value={d.percent}
                              min={0}
                              max={100}
                              step={5}
                              suffix="%"
                              compact
                              onChange={(v) =>
                                dispatch({ type: "patch", patch: { difficulties: setPercent(s.difficulties, d.id, v) } })
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 - Type */}
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

              {/* STEP 5 - Questions */}
              {s.step === 5 && (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {QUESTION_COUNT_PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setCount(p)}
                        className={`border px-4 py-2 font-mono text-sm transition-colors ${
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

              {/* STEP 6 - Source */}
              {s.step === 6 && (
                <div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border border-line bg-base p-4">
                      <Badge color="mint">{SOURCE_LABELS.vcaa.title}</Badge>
                      <p className="mt-2 mb-4 text-xs leading-snug text-ink-dim">{SOURCE_LABELS.vcaa.blurb}</p>
                      <Stepper
                        value={s.vcaaCount}
                        min={0}
                        max={s.questionCount}
                        onChange={(v) =>
                          dispatch({ type: "patch", patch: { vcaaCount: v, modifiedCount: s.questionCount - v } })
                        }
                      />
                    </div>
                    <div className="border border-line bg-base p-4">
                      <Badge color="amber">{SOURCE_LABELS.modified.title}</Badge>
                      <p className="mt-2 mb-4 text-xs leading-snug text-ink-dim">{SOURCE_LABELS.modified.blurb}</p>
                      <Stepper
                        value={s.modifiedCount}
                        min={0}
                        max={s.questionCount}
                        onChange={(m) =>
                          dispatch({ type: "patch", patch: { modifiedCount: m, vcaaCount: s.questionCount - m } })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 font-mono text-sm">
                    <span className="text-mint">{s.vcaaCount} VCAA</span>
                    <span className="text-ink-faint">+</span>
                    <span className="text-amber">{s.modifiedCount} RL Question Bank</span>
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
