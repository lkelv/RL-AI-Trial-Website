import { IconCheck } from "./Icons";

interface StepIndicatorProps {
  steps: string[];
  current: number; // 1-based
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, current, onStepClick }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-1.5 sm:gap-2">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        const clickable = done && !!onStepClick;
        return (
          <li key={label} className="flex flex-1 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={!clickable}
              onClick={clickable ? () => onStepClick(n) : undefined}
              className={`group flex items-center gap-2 ${clickable ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-semibold font-mono transition-colors ${
                  done
                    ? "border-mint/60 bg-mint/15 text-mint"
                    : active
                      ? "border-mint bg-mint text-night"
                      : "border-line bg-raised/40 text-ink-faint"
                }`}
              >
                {done ? <IconCheck size={15} /> : n}
              </span>
              <span
                className={`hidden whitespace-nowrap text-xs font-medium lg:inline ${
                  active ? "text-ink" : done ? "text-ink-dim group-hover:text-mint" : "text-ink-faint"
                }`}
              >
                {label}
              </span>
            </button>
            {n < steps.length && (
              <span
                className={`h-px flex-1 transition-colors ${
                  done ? "bg-mint/50" : "bg-line"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
