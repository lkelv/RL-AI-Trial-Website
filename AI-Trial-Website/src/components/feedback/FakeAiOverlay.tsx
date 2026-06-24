import { useEffect, useRef, useState } from "react";
import { IconCheck, IconSparkles } from "../ui/Icons";

interface FakeAiOverlayProps {
  phases: string[];
  onComplete: () => void;
  title?: string;
  subtitle?: string;
  /** ms each phase stays "active" before advancing (deterministic). */
  phaseDuration?: number;
}

/** Full-cover, deterministic "AI is working" animation. Drop inside any
 *  `relative` container. Cleans up its timers on unmount (StrictMode-safe). */
export function FakeAiOverlay({
  phases,
  onComplete,
  title = "RL AI is working…",
  subtitle,
  phaseDuration = 850,
}: FakeAiOverlayProps) {
  const [active, setActive] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 1; i < phases.length; i++) {
      timers.push(window.setTimeout(() => setActive(i), i * phaseDuration));
    }
    timers.push(
      window.setTimeout(() => onCompleteRef.current(), phases.length * phaseDuration + 500),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, [phases.length, phaseDuration]);

  const progress = ((active + 1) / phases.length) * 100;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-night/95 p-6 rl-fade-in">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-6 h-20 w-20">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div
            className="absolute inset-1.5 rounded-full border border-dashed border-mint/50"
            style={{ animation: "rl-spin 3.5s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-mint">
            <IconSparkles size={30} />
          </div>
        </div>

        <h3 className="font-display text-xl text-ink">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-ink-dim">{subtitle}</p>}

        <div className="mt-5 h-1.5 w-full overflow-hidden border border-line bg-raised">
          <div
            className="h-full bg-mint transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="mx-auto mt-5 max-w-xs space-y-2 text-left">
          {phases.map((p, i) => {
            const done = i < active;
            const cur = i === active;
            return (
              <li
                key={p}
                className={`flex items-center gap-2.5 text-sm transition-opacity duration-300 ${
                  i <= active ? "opacity-100" : "opacity-35"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border ${
                    done
                      ? "border-mint/60 bg-mint/15 text-mint"
                      : cur
                        ? "border-mint text-mint"
                        : "border-line text-ink-faint"
                  }`}
                >
                  {done ? (
                    <IconCheck size={12} />
                  ) : cur ? (
                    <span
                      className="h-1.5 w-1.5 bg-mint"
                      style={{ animation: "rl-pulse-glow 1s ease-in-out infinite" }}
                    />
                  ) : null}
                </span>
                <span className={done || cur ? "text-ink" : "text-ink-faint"}>{p}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
