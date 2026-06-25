import { useEffect, useRef, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { PdfViewer } from "../../components/pdf/PdfViewer";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { FakeAiOverlay } from "../../components/feedback/FakeAiOverlay";
import { TypingDots } from "../../components/feedback/TypingDots";
import {
  IconArrowRight,
  IconCheck,
  IconFile,
  IconMarking,
  IconSparkles,
  IconUpload,
} from "../../components/ui/Icons";
import { MARKED_PDF } from "../../data";

const MARK_PHASES = [
  "Reading your submission",
  "Recognising handwriting & working",
  "Checking each step",
  "Assigning marks",
  "Writing personalised feedback",
];

type Phase = "upload" | "marking" | "result";

/* ---- Follow-up / reattempt check (placeholder demo content) ------------- */

interface FollowMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  file?: string; // attached filename, for reattempt submissions
}

let followIdCounter = 0;
const nextFollowId = () => `f-${followIdCounter++}`;

// Canned placeholder replies — swapped for the real script later.
const REATTEMPT_REPLY =
  "Thanks — I've compared your reattempt against your first submission. " +
  "[Placeholder] Q4 is now corrected: notation is right and full marks are awarded. " +
  "Q6 still needs one more line of working. Provisional updated score: 19 / 20.";
const QUESTION_REPLY =
  "[Placeholder response] Good question — in the full version I'll walk you through " +
  "this against your marked paper, step by step. For now this is illustrative demo text.";

const FOLLOW_SUGGESTIONS = [
  "Why did I lose marks on Q4?",
  "How should I show working in Q6?",
];

/** Below the marked paper: the student can ask follow-up questions or submit a
 *  reattempt (PDF/image) for the AI to re-mark and confirm whether their
 *  mistakes are now fixed. All responses here are placeholder demo content. */
function ReattemptFollowUp() {
  const [messages, setMessages] = useState<FollowMsg[]>([
    {
      id: nextFollowId(),
      role: "assistant",
      text:
        "Want to go further? Ask a follow-up about your feedback, or upload a " +
        "reattempt (PDF or photo) of the questions you missed and I'll re-mark " +
        "them to check you've fixed your mistakes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  function reply(text: string) {
    setTyping(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextFollowId(), role: "assistant", text }]);
      setTyping(false);
    }, 1300);
  }

  function sendQuestion(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { id: nextFollowId(), role: "user", text: q }]);
    setInput("");
    reply(QUESTION_REPLY);
  }

  function submitReattempt(file: File | undefined) {
    if (!file || typing) return;
    setMessages((m) => [
      ...m,
      { id: nextFollowId(), role: "user", text: "Submitted a reattempt", file: file.name },
    ]);
    reply(REATTEMPT_REPLY);
  }

  return (
    <div
      className="rl-reveal mt-5 border border-line bg-raised"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center justify-between border-b border-line/60 px-4 py-3">
        <h2 className="font-display text-base text-ink">Follow-up &amp; reattempt check</h2>
        <Badge color="amber">preview</Badge>
      </div>

      {/* thread */}
      <div ref={scrollRef} className="max-h-72 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[80%] border border-mint/30 bg-mint/10 px-4 py-2.5 text-sm text-ink">
                {m.file ? (
                  <span className="flex items-center gap-2">
                    <IconFile size={15} className="shrink-0 text-mint" />
                    <span className="font-mono">{m.file}</span>
                  </span>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-mint/40 bg-mint/10 text-mint">
                <IconSparkles size={17} />
              </span>
              <div className="max-w-[85%] border border-line bg-base px-4 py-3 text-sm leading-relaxed text-ink-dim">
                {m.text}
              </div>
            </div>
          ),
        )}

        {typing && (
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-mint/40 bg-mint/10 text-mint">
              <IconSparkles size={17} />
            </span>
            <div className="flex items-center border border-line bg-base px-4 py-3.5">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* composer */}
      <div className="border-t border-line/60 px-4 py-3">
        <div className="mb-2.5 flex flex-wrap gap-2">
          {FOLLOW_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={typing}
              onClick={() => sendQuestion(s)}
              className="border border-line bg-base px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-mint/50 hover:text-ink disabled:opacity-40"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf,image/*"
            className="hidden"
            onChange={(e) => {
              submitReattempt(e.target.files?.[0] ?? undefined);
              e.target.value = ""; // allow re-selecting the same file
            }}
          />
          <button
            type="button"
            disabled={typing}
            onClick={() => fileRef.current?.click()}
            title="Upload a reattempt (PDF or image)"
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-line bg-base text-ink-dim transition-colors hover:border-mint/60 hover:text-mint disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconUpload size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up about your feedback…"
            className="flex-1 border border-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-mint/60"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-mint text-night transition-colors hover:bg-mint-soft disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconArrowRight size={20} />
          </button>
        </form>
        <p className="mt-2 text-[0.68rem] text-ink-faint">
          Placeholder feature · responses are illustrative for this demo.
        </p>
      </div>
    </div>
  );
}

export default function AiMarking() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(file: File | undefined) {
    if (!file) return;
    // We only read the name for display - the content is never processed.
    setFileName(file.name);
  }

  return (
    <AppShell back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="rl-reveal">
          <h1 className="text-2xl text-ink sm:text-3xl">AI Marking Paper</h1>
          <p className="mt-2 font-mono text-sm text-ink-dim">
            upload your worked solutions and get them marked instantly
          </p>
        </div>

        {phase !== "result" && (
          <div className="relative mt-8">
            {/* dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={`rl-reveal flex flex-col items-center justify-center border-2 border-dashed p-12 text-center transition-colors ${
                dragging ? "border-mint bg-mint/10" : "border-line bg-raised"
              }`}
            >
              <span className="mb-4 inline-flex items-center justify-center text-mint">
                <IconUpload size={40} />
              </span>
              <p className="font-display text-lg text-ink">
                Drag &amp; drop your PDF here
              </p>
              <p className="mt-1 text-sm text-ink-dim">or click to browse, any worked-solutions PDF</p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? undefined)}
              />
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => inputRef.current?.click()}
              >
                <IconFile size={16} /> Choose file
              </Button>

              {fileName && (
                <div className="mt-6 flex items-center gap-2 border border-mint/40 bg-mint/10 px-3 py-2 text-sm text-ink">
                  <IconCheck size={16} className="text-mint" />
                  <span className="font-mono">{fileName}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="max-w-sm text-xs text-ink-faint">
                Your file stays on your device. This demo returns a pre-marked
                sample so you can preview the experience.
              </p>
              <Button
                variant="amber"
                size="lg"
                disabled={!fileName}
                onClick={() => setPhase("marking")}
              >
                <IconMarking size={18} /> Mark with AI
              </Button>
            </div>

            {phase === "marking" && (
              <FakeAiOverlay
                phases={MARK_PHASES}
                phaseDuration={750}
                title="Marking your paper…"
                subtitle="RL AI is reviewing your working"
                onComplete={() => setPhase("result")}
              />
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="mt-8">
            {/* score banner */}
            <div className="rl-reveal flex flex-wrap items-center gap-4 border border-mint/40 bg-mint/10 p-5">
              <span className="inline-flex items-center justify-center text-mint">
                <IconCheck size={34} />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-semibold text-ink">18</span>
                  <span className="font-mono text-lg text-ink-dim">/ 20</span>
                  <Badge color="mint" className="ml-1">
                    90%
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-dim">
                  Strong work, clear method throughout. Watch your notation in Q4
                  and show one more line of working in Q6.
                </p>
              </div>
              <Button variant="outline" onClick={() => { setPhase("upload"); setFileName(null); }}>
                <IconUpload size={16} /> Mark another
              </Button>
            </div>

            <div className="rl-reveal mt-5" style={{ animationDelay: "120ms" }}>
              <PdfViewer
                href={MARKED_PDF.href}
                downloadName={MARKED_PDF.downloadName}
                label="AI-marked paper, with feedback"
                className="h-[70vh] min-h-[480px]"
              />
            </div>

            <ReattemptFollowUp />
          </div>
        )}
      </div>
    </AppShell>
  );
}
