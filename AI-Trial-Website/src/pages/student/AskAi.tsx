import { useEffect, useRef, useState } from "react";
import type { AskAiAnswer, ChatMessage } from "../../types";
import { ASK_AI_SUGGESTIONS, FALLBACK_ANSWER } from "../../data";
import { AppShell } from "../../components/layout/AppShell";
import { TypingDots } from "../../components/feedback/TypingDots";
import { IconArrowRight, IconSparkles } from "../../components/ui/Icons";

let idCounter = 0;
const nextId = () => `m-${idCounter++}`;

function matchAnswer(text: string): AskAiAnswer {
  const hit = ASK_AI_SUGGESTIONS.find(
    (s) => s.question.toLowerCase() === text.trim().toLowerCase(),
  );
  return hit ? hit.answer : FALLBACK_ANSWER;
}

function AnswerBubble({ answer }: { answer: AskAiAnswer }) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-dim">{answer.summary}</p>
      <ol className="space-y-2.5">
        {answer.steps.map((st, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint/15 font-mono text-[11px] font-semibold text-mint">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink">{st.title}</div>
              <div className="mt-0.5 font-mono text-sm text-ink-dim">{st.body}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-2 rounded-lg border border-mint/30 bg-mint/10 px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Answer</span>
        <span className="font-mono text-sm font-semibold text-mint">{answer.result}</span>
      </div>
    </div>
  );
}

export default function AskAi() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: "assistant",
      text: "Hi Aisha 👋 I'm your RL AI tutor. Ask me any maths question — or try one of the examples below — and I'll walk you through it step by step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  function send(text: string, preset?: AskAiAnswer) {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text: q }]);
    setInput("");
    setTyping(true);
    timerRef.current = window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: nextId(), role: "assistant", answer: preset ?? matchAnswer(q) },
      ]);
      setTyping(false);
    }, 1400);
  }

  return (
    <AppShell fill back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4">
        {/* messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto py-6">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm border border-mint/30 bg-mint/10 px-4 py-2.5 text-sm text-ink">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint">
                  <IconSparkles size={17} />
                </span>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-raised px-4 py-3">
                  {m.answer ? <AnswerBubble answer={m.answer} /> : (
                    <p className="text-sm leading-relaxed text-ink-dim">{m.text}</p>
                  )}
                </div>
              </div>
            ),
          )}

          {typing && (
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint">
                <IconSparkles size={17} />
              </span>
              <div className="rounded-2xl rounded-tl-sm border border-line bg-raised px-4 py-3.5">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* composer */}
        <div className="shrink-0 border-t border-line/60 bg-base/30 py-3">
          <div className="mb-2.5 flex flex-wrap gap-2">
            {ASK_AI_SUGGESTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                disabled={typing}
                onClick={() => send(s.question, s.answer)}
                className="rounded-md border border-line bg-raised px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-mint/50 hover:text-ink disabled:opacity-40"
              >
                {s.question}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the AI tutor a question…"
              className="flex-1 rounded-md border border-line bg-base px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-mint/60"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-mint text-night transition-colors hover:bg-mint-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconArrowRight size={20} />
            </button>
          </form>
          <p className="mt-2 text-center text-[0.68rem] text-ink-faint">
            RL AI · Preview — responses are illustrative for this demo.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
