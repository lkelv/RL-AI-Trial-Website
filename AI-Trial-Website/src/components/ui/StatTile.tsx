import type { StatCard, StatIcon } from "../../types";
import { ACCENT_COLOR, accentTint } from "../../lib/format";
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
    <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-raised p-4 @container">
      <div className="flex items-start justify-between">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: accentTint(stat.accent, 16), color, border: `1px solid ${accentTint(stat.accent, 32)}` }}
        >
          <Icon size={18} />
        </span>
        <span
          className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[0.68rem] font-semibold font-mono"
          style={{
            color: flat ? "var(--color-ink-faint)" : up ? "var(--color-good)" : "var(--color-warn)",
            background: flat ? "transparent" : accentTint(up ? "mint" : "amber", 12),
          }}
        >
          {flat ? "—" : `${up ? "▲" : "▼"} ${Math.abs(stat.trend)}`}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-[1.9rem] font-semibold leading-none tracking-tight text-ink">
            {stat.value}
          </span>
          <span className="font-mono text-sm text-ink-faint">{stat.unit}</span>
        </div>
        <div className="mt-1.5 text-[0.78rem] font-medium leading-tight text-ink-dim">
          {stat.label}
        </div>
        <div className="text-[0.68rem] text-ink-faint">{stat.caption}</div>
      </div>
    </div>
  );
}
