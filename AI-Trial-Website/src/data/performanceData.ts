import type {
  AccentName,
  ParentChart,
  ParentDashboardData,
  StatCard,
  StatIcon,
} from "../types";
import base from "./parentDashboard.json";

/* ------------------------------------------------------------------
   Monthly performance snapshots.

   The dashboard lets you pick a month range; the stats + chart are
   derived deterministically from these snapshots (no random, no live
   data). Selecting the whole range reproduces the term-long picture.
   ------------------------------------------------------------------ */

export interface MonthSnapshot {
  key: string; // "2026-04"
  short: string; // "Apr"
  label: string; // "April 2026"
  /** four weekly readings within the month */
  weeks: { homework: number[]; obedience: number[] }; // obedience on /10
  /** month-level rollups used for the multi-month chart + stat tiles */
  stats: {
    hwScore: number;
    completion: number;
    testScore: number;
    attendance: number;
    obedience: number; // /10
  };
}

export const MONTHS: MonthSnapshot[] = [
  {
    key: "2026-02",
    short: "Feb",
    label: "February 2026",
    weeks: { homework: [60, 63, 65, 64], obedience: [6, 6, 6, 7] },
    stats: { hwScore: 63, completion: 85, testScore: 70, attendance: 92, obedience: 6 },
  },
  {
    key: "2026-03",
    short: "Mar",
    label: "March 2026",
    weeks: { homework: [66, 68, 67, 70], obedience: [7, 6, 7, 7] },
    stats: { hwScore: 68, completion: 88, testScore: 74, attendance: 93, obedience: 7 },
  },
  {
    key: "2026-04",
    short: "Apr",
    label: "April 2026",
    weeks: { homework: [68, 71, 73, 78], obedience: [6, 7, 7, 7] },
    stats: { hwScore: 73, completion: 90, testScore: 77, attendance: 94, obedience: 7 },
  },
  {
    key: "2026-05",
    short: "May",
    label: "May 2026",
    weeks: { homework: [80, 83, 82, 86], obedience: [8, 8, 8, 9] },
    stats: { hwScore: 83, completion: 93, testScore: 81, attendance: 96, obedience: 8 },
  },
  {
    key: "2026-06",
    short: "Jun",
    label: "June 2026",
    weeks: { homework: [86, 88, 89, 91], obedience: [9, 9, 9, 10] },
    stats: { hwScore: 89, completion: 95, testScore: 86, attendance: 97, obedience: 9 },
  },
];

/** Default selection: the full available range. */
export const DEFAULT_RANGE: [number, number] = [0, MONTHS.length - 1];

interface StatTemplate {
  id: string;
  label: string;
  unit: StatCard["unit"];
  accent: AccentName;
  icon: StatIcon;
  caption: string; // suffix, e.g. "avg score"
  pick: (s: MonthSnapshot["stats"]) => number;
}

const STAT_TEMPLATE: StatTemplate[] = [
  { id: "hw-score", label: "Avg Homework Score", unit: "%", accent: "mint", icon: "score", caption: "avg score", pick: (s) => s.hwScore },
  { id: "hw-completion", label: "Homework Completion", unit: "%", accent: "pine", icon: "check", caption: "on-time rate", pick: (s) => s.completion },
  { id: "test-score", label: "Avg Test Score", unit: "%", accent: "amber", icon: "test", caption: "test average", pick: (s) => s.testScore },
  { id: "attendance", label: "Class Attendance", unit: "%", accent: "info", icon: "calendar", caption: "attendance", pick: (s) => s.attendance },
  { id: "obedience", label: "Obedience Score", unit: "/10", accent: "mint", icon: "shield", caption: "tutor rated", pick: (s) => s.obedience },
];

const round = (n: number) => Math.round(n);
const avg = (nums: number[]) => round(nums.reduce((a, b) => a + b, 0) / nums.length);

function rangeLabel(range: MonthSnapshot[]): string {
  return range.length === 1
    ? range[0].short
    : `${range[0].short}–${range[range.length - 1].short}`;
}

function buildStats(fromIdx: number, range: MonthSnapshot[]): StatCard[] {
  const span = rangeLabel(range);
  return STAT_TEMPLATE.map((t) => {
    const value = avg(range.map((m) => t.pick(m.stats)));
    // Trend: change across the selected range; for a single month, vs. the
    // month before it (or 0 when none exists).
    let trend: number;
    if (range.length === 1) {
      const prev = MONTHS[fromIdx - 1];
      trend = prev ? t.pick(range[0].stats) - t.pick(prev.stats) : 0;
    } else {
      trend = t.pick(range[range.length - 1].stats) - t.pick(range[0].stats);
    }
    return {
      id: t.id,
      label: t.label,
      value,
      unit: t.unit,
      caption: `${t.caption} · ${span}`,
      trend,
      accent: t.accent,
      icon: t.icon,
    };
  });
}

function buildChart(range: MonthSnapshot[]): ParentChart {
  // Always weekly: concatenate every month's weekly readings so a wider range
  // simply yields a denser, more detailed line (up to ~52 points across a
  // year). Only the first week of each month is labelled, keeping month
  // boundaries legible without crowding the axis.
  const xLabels: string[] = [];
  const homework: number[] = [];
  const obedience: number[] = []; // /10

  for (const m of range) {
    m.weeks.homework.forEach((hw, i) => {
      xLabels.push(i === 0 ? m.short : "");
      homework.push(hw);
      obedience.push(m.weeks.obedience[i]);
    });
  }

  return {
    xLabels,
    series: [
      {
        label: "Homework Score",
        colorVar: "var(--color-amber)",
        points: homework,
        displayPoints: homework,
        unit: "%",
      },
      {
        label: "Obedience",
        colorVar: "var(--color-mint)",
        points: obedience.map((v) => v * 10), // plot on 0–100
        displayPoints: obedience,
        unit: "/10",
      },
    ],
  };
}

/** Derive a full dashboard payload for the inclusive month range. */
export function buildDashboard(fromIdx: number, toIdx: number): ParentDashboardData {
  const lo = Math.max(0, Math.min(fromIdx, MONTHS.length - 1));
  const hi = Math.max(lo, Math.min(toIdx, MONTHS.length - 1));
  const range = MONTHS.slice(lo, hi + 1);

  return {
    studentName: base.studentName,
    term: `${rangeLabel(range)} · 2026`,
    stats: buildStats(lo, range),
    chart: buildChart(range),
    log: base.log as ParentDashboardData["log"],
  };
}
