import { useMemo, useState } from "react";
import type { LogEntry, LogKind, LogSeverity } from "../../types";
import { StatTile } from "../ui/StatTile";
import { Badge } from "../ui/Badge";
import { LineChart } from "../chart/LineChart";
import {
  IconAlert,
  IconCheck,
  IconHeart,
  IconMegaphone,
  IconStar,
  IconTest,
} from "../ui/Icons";
import { stagger } from "../../lib/format";
import { DEFAULT_RANGE, MONTHS, buildDashboard } from "../../data/performanceData";

const KIND_ICON: Record<LogKind, typeof IconAlert> = {
  attendance: IconAlert,
  "sick-confirmed": IconHeart,
  test: IconTest,
  announcement: IconMegaphone,
  praise: IconStar,
  homework: IconCheck,
};

const SEVERITY: Record<LogSeverity, { color: string; tint: string }> = {
  info: { color: "var(--color-info)", tint: "color-mix(in srgb, var(--color-info) 14%, transparent)" },
  warn: { color: "var(--color-warn)", tint: "color-mix(in srgb, var(--color-warn) 14%, transparent)" },
  good: { color: "var(--color-good)", tint: "color-mix(in srgb, var(--color-good) 14%, transparent)" },
};

function LogRow({ entry }: { entry: LogEntry }) {
  const Icon = KIND_ICON[entry.kind];
  const s = SEVERITY[entry.severity];
  return (
    <div
      className="flex gap-3 border border-line/60 bg-base p-3"
      style={{ borderLeft: `3px solid ${s.color}` }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center"
        style={{ color: s.color }}
      >
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold text-ink">{entry.title}</span>
          <span className="shrink-0 font-mono text-[0.68rem] text-ink-faint">{entry.timeLabel}</span>
        </div>
        <p className="mt-0.5 text-xs leading-snug text-ink-dim">{entry.detail}</p>
      </div>
    </div>
  );
}

/** Mono select for one month boundary, matching the brutalist aesthetic. */
function MonthSelect({
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  value: number;
  onChange: (i: number) => void;
  "aria-label": string;
}) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="cursor-pointer rounded-none border border-line bg-base px-2 py-1 font-mono text-xs text-ink outline-none transition-colors hover:border-mint focus:border-mint"
    >
      {MONTHS.map((m, i) => (
        <option key={m.key} value={i} className="bg-base text-ink">
          {m.short}
        </option>
      ))}
    </select>
  );
}

/** From/To month range picker. Keeps `from <= to` by nudging the partner. */
function MonthRangeSelect({
  from,
  to,
  onChange,
}: {
  from: number;
  to: number;
  onChange: (from: number, to: number) => void;
}) {
  return (
    <div className="ml-auto flex items-center gap-2">
      <span className="font-mono text-[0.7rem] text-ink-faint">range</span>
      <MonthSelect
        aria-label="Range start month"
        value={from}
        onChange={(i) => onChange(i, Math.max(i, to))}
      />
      <span className="font-mono text-xs text-ink-faint">→</span>
      <MonthSelect
        aria-label="Range end month"
        value={to}
        onChange={(i) => onChange(Math.min(from, i), i)}
      />
    </div>
  );
}

/** The progress dashboard shared by the Parent portal and the student's
 *  "Performance" page. Designed to fill an AppShell `fill` main: the page
 *  never scrolls; only the log scrolls internally.
 *
 *  The data is derived from a selectable month range (see
 *  `data/performanceData.ts`): changing the range recomputes the stat tiles
 *  and the chart. */
export function PerformanceDashboard() {
  const [[from, to], setRange] = useState<[number, number]>(DEFAULT_RANGE);
  const data = useMemo(() => buildDashboard(from, to), [from, to]);

  return (
    <div
      className="grid h-full gap-3 px-4 py-3 sm:px-6 sm:py-4"
      style={{ gridTemplateRows: "auto auto auto minmax(0, 1fr)" }}
    >
      {/* header */}
      <div className="rl-reveal flex flex-wrap items-center gap-x-3 gap-y-2">
        <h1 className="text-2xl text-ink sm:text-3xl">{data.studentName}</h1>
        <Badge color="mint" dot>
          {data.term}
        </Badge>
        <MonthRangeSelect
          from={from}
          to={to}
          onChange={(f, t) => setRange([f, t])}
        />
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {data.stats.map((stat, i) => (
          <div key={stat.id} className="rl-reveal" style={stagger(i, 60, 40)}>
            <StatTile stat={stat} />
          </div>
        ))}
      </div>

      {/* chart */}
      <div
        className="rl-reveal flex flex-col border border-line bg-raised p-4"
        style={{ height: "clamp(160px, 26vh, 250px)", animationDelay: "260ms" }}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-display text-base text-ink">Progress over time</h2>
          <span className="text-xs text-ink-faint">Homework score &amp; obedience by week</span>
        </div>
        <div className="min-h-0 flex-1">
          <LineChart data={data.chart} />
        </div>
      </div>

      {/* log - scrolls internally only */}
      <div
        className="rl-reveal flex min-h-0 flex-col border border-line bg-raised"
        style={{ animationDelay: "340ms" }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-line/60 px-4 py-3">
          <h2 className="font-display text-base text-ink">Announcements &amp; log</h2>
          <Badge color="amber">{data.log.length} updates</Badge>
        </div>
        <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-4">
          {data.log.map((entry) => (
            <LogRow key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}
