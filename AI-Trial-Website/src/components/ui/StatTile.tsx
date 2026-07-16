import type { StatCard, StatIcon } from "../../types";
import { ACCENT_COLOR } from "../../lib/format";
import {
  IconCalendar,
  IconCheck,
  IconScore,
  IconShield,
  IconTest,
} from "./Icons";

const ICONS: Record<StatIcon, typeof IconScore> = {
  score: IconScore,
  check: IconCheck,
  test: IconTest,
  calendar: IconCalendar,
  shield: IconShield,
};

export function StatTile({ stat }: { stat: StatCard }) {
  const Icon = ICONS[stat.icon];
  const color = ACCENT_COLOR[stat.accent];
  const up = stat.trend > 0;
  const flat = stat.trend === 0;

  return (
    <div
      className="flex h-full flex-col justify-between border border-line bg-raised p-4 @container"
      style={{ borderTop: `2px solid ${color}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[0.8rem] leading-tight text-ink-dim">
          <Icon size={15} style={{ color }} />
          {stat.label}
        </span>
        <span
          className="shrink-0 font-mono text-[0.82rem] font-semibold tabular-nums"
          style={{
            color: flat ? "var(--color-ink-faint)" : up ? "var(--color-good)" : "var(--color-warn)",
          }}
        >
          {flat ? "0" : `${up ? "+" : "−"}${Math.abs(stat.trend)}`}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-[2.35rem] font-semibold leading-none tracking-tight text-ink tabular-nums">
            {stat.value}
          </span>
          <span className="font-mono text-base text-ink-faint">{stat.unit}</span>
        </div>
        <div className="mt-1.5 font-mono text-[0.76rem] text-ink-faint">{stat.caption}</div>
      </div>
    </div>
  );
}
