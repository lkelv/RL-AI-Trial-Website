import { useEffect, useRef, useState } from "react";
import type { AskAiAnswer, AskAiVideo, ChatMessage } from "../../types";
import {
  ASK_AI_SUGGESTIONS,
  ASK_AI_VIDEO_SUGGESTION,
  FALLBACK_ANSWER,
  INTEGRATION_VIDEO,
  isIntegrationExponentialQuery,
} from "../../data";
import { AppShell } from "../../components/layout/AppShell";
import { TypingDots } from "../../components/feedback/TypingDots";
import { VideoPlayer } from "../../components/video/VideoPlayer";
import { IconArrowRight, IconSparkles, IconVideo } from "../../components/ui/Icons";

let idCounter = 0;
const nextId = () => `m-${idCounter++}`;

/** A resolved assistant reply: either a structured answer or a rendered video. */
type Reply = { answer?: AskAiAnswer; video?: AskAiVideo };

function resolveReply(text: string): Reply {
  const q = text.trim().toLowerCase();
  if (isIntegrationExponentialQuery(q)) return { video: INTEGRATION_VIDEO };
  const hit = ASK_AI_SUGGESTIONS.find((s) => s.question.toLowerCase() === q);
  return { answer: hit ? hit.answer : FALLBACK_ANSWER };
}

function AnswerBubble({ answer }: { answer: AskAiAnswer }) {
  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-dim">{answer.summary}</p>
      <ol className="space-y-2.5">
        {answer.steps.map((st, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-mint/40 bg-mint/10 font-mono text-[11px] font-semibold text-mint">
              {i + 1}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-ink">{st.title}</div>
              <div className="mt-0.5 font-mono text-sm text-ink-dim">{st.body}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-center gap-2 border border-mint/30 bg-mint/10 px-3 py-2">
        <span className="font-mono text-xs text-ink-faint">answer</span>
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
      text: "Hi Aisha 👋 I'm your RL AI tutor. Ask me any maths question, or try one of the examples below — I'll walk you through it step by step, or put together a short worked video.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, thinking]);

  useEffect(() => () => clearTimers(), []);

  function send(text: string, preset?: Reply) {
    const q = text.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text: q }]);
    setInput("");

    const reply = preset ?? resolveReply(q);
    clearTimers();
    setTyping(true);

    const finish = () => {
      setMessages((m) => [...m, { id: nextId(), role: "assistant", ...reply }]);
      setTyping(false);
      setThinking(null);
    };

    if (reply.video) {
      // Staged "thinking" sells the render. Fixed timers only — deterministic
      // for the on-camera demo (no Math.random / Date.now).
      setThinking("Reading your question…");
      timersRef.current.push(
        window.setTimeout(() => setThinking("Picking the clearest worked example…"), 1000),
        window.setTimeout(() => setThinking("Rendering your video…"), 2100),
        window.setTimeout(finish, 3200),
      );
    } else {
      setThinking(null);
      timersRef.current.push(window.setTimeout(finish, 1400));
    }
  }

  return (
    <AppShell fill back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4">
        {/* messages */}
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto py-6">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] border border-mint/30 bg-mint/10 px-4 py-2.5 text-sm text-ink">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-mint/40 bg-mint/10 text-mint">
                  <IconSparkles size={17} />
                </span>
                <div
                  className={`border border-line bg-raised px-4 py-3 ${m.video ? "w-full max-w-[92%] space-y-3" : "max-w-[85%]"}`}
                >
                  {m.video ? (
                    <>
                      <p className="text-sm leading-relaxed text-ink-dim">{m.video.summary}</p>
                      <VideoPlayer
                        src={m.video.src}
                        downloadName={m.video.downloadName}
                        label={m.video.label}
                      />
                    </>
                  ) : m.answer ? (
                    <AnswerBubble answer={m.answer} />
                  ) : (
                    <p className="text-sm leading-relaxed text-ink-dim">{m.text}</p>
                  )}
                </div>
              </div>
            ),
          )}

          {typing && (
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-mint/40 bg-mint/10 text-mint">
                <IconSparkles size={17} />
              </span>
              <div className="flex items-center gap-2.5 border border-line bg-raised px-4 py-3.5">
                <TypingDots />
                {thinking && (
                  <span className="font-mono text-xs text-ink-faint">{thinking}</span>
                )}
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
                onClick={() => send(s.question, { answer: s.answer })}
                className="border border-line bg-raised px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-mint/50 hover:text-ink disabled:opacity-40"
              >
                {s.question}
              </button>
            ))}
            <button
              key={ASK_AI_VIDEO_SUGGESTION.id}
              type="button"
              disabled={typing}
              onClick={() => send(ASK_AI_VIDEO_SUGGESTION.question, { video: INTEGRATION_VIDEO })}
              className="inline-flex items-center gap-1.5 border border-line bg-raised px-3 py-1.5 text-xs text-ink-dim transition-colors hover:border-mint/50 hover:text-ink disabled:opacity-40"
            >
              <IconVideo size={14} className="text-mint" />
              {ASK_AI_VIDEO_SUGGESTION.question}
            </button>
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
          <p className="mt-2 text-center text-[0.68rem] text-ink-faint">
            RL AI · Preview, responses are illustrative for this demo.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
