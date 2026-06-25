import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AccentName, ErrorQuestion, ErrorType, PracticePrefill } from "../../types";
import { ERROR_QUESTIONS, ERROR_TYPES } from "../../data";
import { AppShell } from "../../components/layout/AppShell";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { TypingDots } from "../../components/feedback/TypingDots";
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconFile,
  IconFilter,
  IconImage,
  IconSparkles,
  IconTag,
  IconTrash,
  IconUpload,
} from "../../components/ui/Icons";
import { QuestionSnapshot } from "../../components/ui/QuestionSnapshot";
import { ACCENT_COLOR, accentTint, stagger } from "../../lib/format";

// Placeholder marking result — swapped for the real script later.
const REATTEMPT_RESULT =
  "[Placeholder] Reattempt marked correct — full marks awarded. Your method is " +
  "now complete and the earlier mistake is fixed. Nicely done!";

/** Accent per error category — shared by the tag chips and the page filter. */
const ERROR_TYPE_COLOR: Record<ErrorType, AccentName> = {
  careless: "info",
  "knowledge-gap": "amber",
};

const ERROR_TYPE_LABEL: Record<ErrorType, string> = Object.fromEntries(
  ERROR_TYPES.map((t) => [t.id, t.label]),
) as Record<ErrorType, string>;

type RowStatus = "idle" | "open" | "checking";

/* ------------------------------------------------------------------
   Multi-select dropdown — tag a question with one or more error types.
   ------------------------------------------------------------------ */
function ErrorTypeSelect({
  selected,
  onChange,
  onOpenChange,
}: {
  selected: ErrorType[];
  onChange: (next: ErrorType[]) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Let the parent row lift its z-index while the menu is open (each rl-reveal
  // row is its own stacking context, so the popover must be elevated with it).
  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  function toggle(id: ErrorType) {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  const summary =
    selected.length === 0
      ? "Tag error type"
      : selected.length === 1
        ? ERROR_TYPE_LABEL[selected[0]]
        : `${selected.length} error types`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 border border-info/30 bg-info/10 px-3 py-1.5 text-sm text-info outline-none transition-colors hover:border-info/55 hover:bg-info/20 focus:border-info/70"
      >
        <IconTag size={14} className="text-info/80" />
        <span className={selected.length ? "text-info" : "text-info/70"}>{summary}</span>
        <IconChevronDown
          size={14}
          className={`text-info/80 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1.5 w-60 border border-line bg-raised p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.85)]">
          {ERROR_TYPES.map((t) => {
            const on = selected.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggle(t.id)}
                className="flex w-full items-start gap-3 px-2.5 py-2 text-left transition-colors hover:bg-base/70"
              >
                <span
                  className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors ${
                    on ? "border-mint bg-mint text-night" : "border-line text-transparent"
                  }`}
                >
                  {on && <IconCheck size={12} />}
                </span>
                <span>
                  <span className={`block text-sm ${on ? "text-ink" : "text-ink-dim"}`}>{t.label}</span>
                  {t.hint && <span className="block text-[0.7rem] text-ink-faint">{t.hint}</span>}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Top-right visibility filter — show only questions tagged with the
   selected error type(s). No selection = show everything.
   ------------------------------------------------------------------ */
function ErrorTypeFilter({
  filter,
  onToggle,
  onClear,
}: {
  filter: Set<ErrorType>;
  onToggle: (id: ErrorType) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] text-ink-faint">
        <IconFilter size={13} /> show
      </span>
      {ERROR_TYPES.map((t) => {
        const on = filter.has(t.id);
        const color = ERROR_TYPE_COLOR[t.id];
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle(t.id)}
            aria-pressed={on}
            className="border px-2.5 py-1 font-mono text-[0.72rem] transition-colors"
            style={
              on
                ? {
                    background: accentTint(color, 16),
                    color: ACCENT_COLOR[color],
                    borderColor: accentTint(color, 45),
                  }
                : undefined
            }
          >
            <span className={on ? "" : "text-ink-dim"}>{t.label}</span>
          </button>
        );
      })}
      {filter.size > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="font-mono text-[0.7rem] text-ink-faint underline-offset-2 transition-colors hover:text-amber hover:underline"
        >
          clear
        </button>
      )}
    </div>
  );
}

function ErrorRow({
  q,
  index,
  resolved,
  onResolved,
  tags,
  onTagsChange,
  onZoom,
  onDelete,
}: {
  q: ErrorQuestion;
  index: number;
  resolved: boolean;
  onResolved: () => void;
  tags: ErrorType[];
  onTagsChange: (next: ErrorType[]) => void;
  onZoom: () => void;
  onDelete: () => void;
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<RowStatus>("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const canSubmit = answer.trim().length > 0 || fileName !== null;

  function submit() {
    if (!canSubmit || status === "checking") return;
    setStatus("checking");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onResolved();
      setStatus("idle");
    }, 1400);
  }

  // The AI infers subject / topic / difficulty from the question the student
  // got wrong, and lands them on the wizard's "paper type" step (1–3 prefilled).
  function generatePractice() {
    const prefill: PracticePrefill = {
      subjectId: q.subjectId,
      topics: [{ overall: q.topic, subs: [q.subTopic] }],
      difficulties: [{ id: q.difficulty, percent: 100 }],
      step: 4,
    };
    navigate("/student/ai/practice", { state: { practicePrefill: prefill } });
  }

  const open = status === "open" || status === "checking";

  return (
    <div
      className={`rl-reveal relative border-b border-l-2 border-line py-5 pl-3 transition-colors ${
        menuOpen ? "z-30" : ""
      }`}
      style={{
        borderLeftColor: resolved ? "var(--color-mint)" : "var(--color-amber)",
        ...stagger(index),
      }}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 sm:gap-x-6">
        <div className="flex flex-col items-center gap-2.5">
          <span className="font-mono text-2xl leading-none text-ink-faint sm:text-3xl">
            {String(index + 1).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete question from booklet"
            title="Delete from booklet"
            className="flex h-7 w-7 items-center justify-center border border-line text-ink-faint transition-colors hover:border-danger/60 hover:bg-danger/10 hover:text-danger"
          >
            <IconTrash size={15} />
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="info">{q.topic}</Badge>
            <span className="font-mono text-[0.7rem] text-ink-faint">{q.subTopic}</span>
            <span className="font-mono text-[0.7rem] text-ink-faint">· {q.source}</span>
          </div>

          <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink">{q.prompt}</p>

          {!resolved ? (
            <div className="mt-2 flex items-start gap-2 text-xs text-ink-dim">
              <IconAlert size={14} className="mt-0.5 shrink-0 text-amber" />
              <span>
                <span className="font-mono text-ink-faint">{q.marksLabel}</span> · {q.yourError}
              </span>
            </div>
          ) : (
            <div className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-mint">
              <IconCheck size={14} className="mt-0.5 shrink-0" />
              <span>{REATTEMPT_RESULT}</span>
            </div>
          )}

          {/* AI snapshot of the captured attempt — click to enlarge */}
          <button
            type="button"
            onClick={onZoom}
            className="group mt-3.5 flex items-center gap-3 text-left"
          >
            <span className="block w-[150px] shrink-0 overflow-hidden border border-line transition-colors group-hover:border-mint/60">
              <QuestionSnapshot
                prompt={q.prompt}
                attempt={q.attempt}
                marksLabel={q.marksLabel}
                className="block w-full"
              />
            </span>
            <span className="inline-flex flex-wrap items-center gap-x-1.5 font-mono text-[0.66rem] text-ink-faint transition-colors group-hover:text-ink-dim">
              <IconImage size={13} /> AI snapshot of your attempt
              <span className="text-ink-faint/70">· click to enlarge</span>
            </span>
          </button>
        </div>

        {/* per-question actions (top-right): generate targeted practice, the
            reattempt control, then the error-type tag dropdown on the far right */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="mintSoft" size="sm" onClick={generatePractice}>
              <IconSparkles size={14} /> Generate practice
            </Button>
            {!resolved && status === "idle" && (
              <Button variant="amberSoft" size="sm" onClick={() => setStatus("open")}>
                Reattempt
                <IconChevronDown size={15} />
              </Button>
            )}
            <ErrorTypeSelect
              selected={tags}
              onChange={onTagsChange}
              onOpenChange={setMenuOpen}
            />
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {tags.map((id) => (
                <Badge key={id} color={ERROR_TYPE_COLOR[id]}>
                  {ERROR_TYPE_LABEL[id]}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* reattempt panel */}
      {!resolved && open && (
        <div className="mt-4 ml-0 border border-line bg-base p-4 sm:ml-[calc(2rem+1.5rem)]">
          {status === "checking" ? (
            <div className="flex items-center gap-2.5 py-2">
              <TypingDots />
              <span className="font-mono text-xs text-ink-faint">
                Marking your reattempt…
              </span>
            </div>
          ) : (
            <>
              <label className="font-mono text-[0.7rem] text-ink-dim">Your reattempt</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={3}
                placeholder="Type your working and final answer here…"
                className="mt-1.5 w-full resize-none border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-mint/60"
              />

              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  setFileName(e.target.files?.[0]?.name ?? null);
                  e.target.value = "";
                }}
              />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <IconUpload size={15} /> Upload working
                </Button>
                {fileName && (
                  <span className="inline-flex items-center gap-1.5 border border-mint/40 bg-mint/10 px-2 py-1 font-mono text-xs text-ink">
                    <IconFile size={13} className="text-mint" />
                    {fileName}
                  </span>
                )}
                <Button
                  variant="amber"
                  size="sm"
                  className="ml-auto"
                  disabled={!canSubmit}
                  onClick={submit}
                >
                  Submit reattempt <IconArrowRight size={15} />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Lightbox — enlarges the AI snapshot for clarity. Closes on backdrop
   click or Escape.
   ------------------------------------------------------------------ */
function SnapshotModal({ q, onClose }: { q: ErrorQuestion; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="rl-fade-in fixed inset-0 z-50 flex items-center justify-center bg-night/85 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl border border-line bg-raised p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-xs text-ink-dim">
            <IconImage size={14} className="text-mint" />
            snapshot · {q.topic} — {q.subTopic}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center border border-line text-ink-faint transition-colors hover:border-amber/60 hover:text-amber"
            aria-label="Close snapshot"
          >
            ✕
          </button>
        </div>
        <QuestionSnapshot
          prompt={q.prompt}
          attempt={q.attempt}
          marksLabel={q.marksLabel}
          className="block w-full"
        />
        <p className="mt-2.5 font-mono text-[0.68rem] text-ink-faint">
          Captured automatically during AI Marking · illustrative for this demo.
        </p>
      </div>
    </div>
  );
}

export default function ErrorBooklet() {
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const [tags, setTags] = useState<Record<string, ErrorType[]>>({});
  const [filter, setFilter] = useState<Set<ErrorType>>(new Set());
  const [deleted, setDeleted] = useState<Set<string>>(new Set());
  const [zoomed, setZoomed] = useState<ErrorQuestion | null>(null);

  const remaining = ERROR_QUESTIONS.filter((q) => !deleted.has(q.id));
  const total = remaining.length;
  const doneCount = remaining.filter((q) => resolved.has(q.id)).length;

  const visible = remaining.filter((q) => {
    if (filter.size === 0) return true;
    return (tags[q.id] ?? []).some((t) => filter.has(t));
  });

  function toggleFilter(id: ErrorType) {
    setFilter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <AppShell back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:py-14">
        <div className="rl-reveal flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">Error Data Booklet</h1>
            <p className="mt-2 font-mono text-sm text-ink-dim">
              Every question you got wrong, in one place to reattempt
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Badge color="amber" dot>
              {doneCount} / {total} reattempted
            </Badge>
            <ErrorTypeFilter
              filter={filter}
              onToggle={toggleFilter}
              onClear={() => setFilter(new Set())}
            />
          </div>
        </div>

        {/* ledger note — explains where this comes from (auto-collected) */}
        <div
          className="rl-reveal mt-8 border-l-2 border-mint bg-raised/40 px-4 py-3"
          style={{ animationDelay: "80ms" }}
        >
          <p className="text-sm leading-relaxed text-ink-dim">
            These questions are collected automatically from your{" "}
            <span className="text-ink">AI Marking</span> submissions — whenever a
            question is marked incorrect, it lands here for you to retry. Tag each
            one with the type of mistake you made, then hit{" "}
            <span className="text-ink">Generate practice</span> to get a targeted
            paper on that exact topic.
          </p>
        </div>

        <div className="mt-8 border-t border-line">
          {visible.length === 0 ? (
            filter.size > 0 ? (
              <div className="rl-reveal flex flex-col items-start gap-3 py-12">
                <p className="font-mono text-sm text-ink-dim">
                  No questions tagged{" "}
                  {[...filter].map((t) => ERROR_TYPE_LABEL[t]).join(" or ")} yet.
                </p>
                <button
                  type="button"
                  onClick={() => setFilter(new Set())}
                  className="font-mono text-xs text-mint underline-offset-2 transition-opacity hover:opacity-80 hover:underline"
                >
                  clear filter to see all questions
                </button>
              </div>
            ) : (
              <div className="rl-reveal py-12">
                <p className="font-mono text-sm text-ink-dim">
                  Your error booklet is empty — every question has been deleted.
                </p>
              </div>
            )
          ) : (
            visible.map((q, i) => (
              <ErrorRow
                key={q.id}
                q={q}
                index={i}
                resolved={resolved.has(q.id)}
                onResolved={() => setResolved((prev) => new Set(prev).add(q.id))}
                tags={tags[q.id] ?? []}
                onTagsChange={(next) =>
                  setTags((prev) => ({ ...prev, [q.id]: next }))
                }
                onZoom={() => setZoomed(q)}
                onDelete={() =>
                  setDeleted((prev) => new Set(prev).add(q.id))
                }
              />
            ))
          )}
        </div>
      </div>

      {zoomed && <SnapshotModal q={zoomed} onClose={() => setZoomed(null)} />}
    </AppShell>
  );
}
