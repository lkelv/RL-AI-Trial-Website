import { useEffect, useRef, useState } from "react";
import type { ErrorQuestion } from "../../types";
import { ERROR_QUESTIONS } from "../../data";
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
  IconUpload,
} from "../../components/ui/Icons";
import { stagger } from "../../lib/format";

// Placeholder marking result — swapped for the real script later.
const REATTEMPT_RESULT =
  "[Placeholder] Reattempt marked correct — full marks awarded. Your method is " +
  "now complete and the earlier mistake is fixed. Nicely done!";

type RowStatus = "idle" | "open" | "checking";

function ErrorRow({
  q,
  index,
  resolved,
  onResolved,
}: {
  q: ErrorQuestion;
  index: number;
  resolved: boolean;
  onResolved: () => void;
}) {
  const [status, setStatus] = useState<RowStatus>("idle");
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

  const open = status === "open" || status === "checking";

  return (
    <div
      className="rl-reveal border-b border-l-2 border-line py-5 pl-3 transition-colors"
      style={{
        borderLeftColor: resolved ? "var(--color-mint)" : "var(--color-amber)",
        ...stagger(index),
      }}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4 sm:gap-x-6">
        <span className="font-mono text-2xl leading-none text-ink-faint sm:text-3xl">
          {String(index + 1).padStart(2, "0")}
        </span>

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
        </div>

        {!resolved && status === "idle" && (
          <Button variant="outline" size="sm" onClick={() => setStatus("open")}>
            Reattempt
            <IconChevronDown size={15} />
          </Button>
        )}
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
              <label className="font-mono text-[0.7rem] text-ink-dim">your reattempt</label>
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
              <p className="mt-2 text-[0.68rem] text-ink-faint">
                Placeholder feature · marking results are illustrative for this demo.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ErrorBooklet() {
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const total = ERROR_QUESTIONS.length;
  const doneCount = resolved.size;

  return (
    <AppShell back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:py-14">
        <div className="rl-reveal flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink sm:text-5xl">Error Data Booklet</h1>
            <p className="mt-2 font-mono text-sm text-ink-dim">
              every question you got wrong, in one place to reattempt
            </p>
          </div>
          <Badge color="amber" dot>
            {doneCount} / {total} reattempted
          </Badge>
        </div>

        {/* ledger note — explains where this comes from (auto-collected) */}
        <div
          className="rl-reveal mt-8 border-l-2 border-mint bg-raised/40 px-4 py-3"
          style={{ animationDelay: "80ms" }}
        >
          <p className="text-sm leading-relaxed text-ink-dim">
            These questions are collected automatically from your{" "}
            <span className="text-ink">AI Marking</span> submissions — whenever a
            question is marked incorrect, it lands here for you to retry. The
            booklet also targets topics you&apos;re weakest at, inferred from your
            error history, and surfaces extra practice on them.
          </p>
        </div>

        <div className="mt-8 border-t border-line">
          {ERROR_QUESTIONS.map((q, i) => (
            <ErrorRow
              key={q.id}
              q={q}
              index={i}
              resolved={resolved.has(q.id)}
              onResolved={() =>
                setResolved((prev) => new Set(prev).add(q.id))
              }
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
