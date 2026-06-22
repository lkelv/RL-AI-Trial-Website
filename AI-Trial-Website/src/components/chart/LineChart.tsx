import { useEffect, useRef, useState } from "react";
import type { ParentChart } from "../../types";

/** Measure a container so the SVG renders at exact pixel size (no viewBox
 *  distortion — circles stay round, text stays crisp, it fills the box). */
function useSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      setSize({ w: Math.round(cr.width), h: Math.round(cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export function LineChart({ data, className = "" }: { data: ParentChart; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { w, h } = useSize(ref);
  const n = data.xLabels.length;

  const padL = 34;
  const padR = 16;
  const padT = 14;
  const padB = 26;
  const plotW = Math.max(0, w - padL - padR);
  const plotH = Math.max(0, h - padT - padB);

  const x = (i: number) => padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => padT + (1 - v / 100) * plotH;
  const grid = [0, 25, 50, 75, 100];

  const ready = w > 20 && h > 20;

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* legend */}
      <div className="mb-2 flex flex-wrap items-center gap-x-5 gap-y-1">
        {data.series.map((s) => {
          const latest = (s.displayPoints ?? s.points)[n - 1];
          return (
            <div key={s.label} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.colorVar }} />
              <span className="text-xs text-ink-dim">{s.label}</span>
              <span className="font-mono text-xs font-semibold" style={{ color: s.colorVar }}>
                {latest}
                {s.unit}
              </span>
            </div>
          );
        })}
      </div>

      <div ref={ref} className="relative min-h-0 flex-1">
        {ready && (
          <svg width={w} height={h} role="img" aria-label="Student progress over the term">
            <defs>
              {data.series.map((s, si) => (
                <linearGradient key={si} id={`rl-grad-${si}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.colorVar} stopOpacity="0.16" />
                  <stop offset="90%" stopColor={s.colorVar} stopOpacity="0" />
                </linearGradient>
              ))}
            </defs>

            {/* gridlines */}
            {grid.map((g) => (
              <g key={g}>
                <line
                  x1={padL}
                  x2={w - padR}
                  y1={y(g)}
                  y2={y(g)}
                  stroke="var(--color-line)"
                  strokeOpacity={g === 0 ? 0.9 : 0.4}
                  strokeDasharray={g === 0 ? "0" : "3 4"}
                />
                <text
                  x={padL - 8}
                  y={y(g) + 3}
                  textAnchor="end"
                  className="font-mono"
                  fontSize="9"
                  fill="var(--color-ink-faint)"
                >
                  {g}
                </text>
              </g>
            ))}

            {/* x labels */}
            {data.xLabels.map((lab, i) => (
              <text
                key={lab}
                x={x(i)}
                y={h - 8}
                textAnchor="middle"
                fontSize="9"
                fill="var(--color-ink-faint)"
              >
                {lab}
              </text>
            ))}

            {/* series */}
            {data.series.map((s, si) => {
              const line = s.points.map((v, i) => `${x(i)},${y(v)}`).join(" ");
              const area = `M ${x(0)},${y(0)} L ${s.points
                .map((v, i) => `${x(i)},${y(v)}`)
                .join(" L ")} L ${x(n - 1)},${y(0)} Z`;
              return (
                <g key={s.label}>
                  <path d={area} fill={`url(#rl-grad-${si})`} />
                  <polyline
                    points={line}
                    fill="none"
                    stroke={s.colorVar}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      strokeDasharray: 3000,
                      strokeDashoffset: 3000,
                      animation: `rl-draw 1.5s var(--ease-out-soft) forwards`,
                      animationDelay: `${200 + si * 250}ms`,
                    }}
                  />
                  {s.points.map((v, i) => (
                    <circle
                      key={i}
                      cx={x(i)}
                      cy={y(v)}
                      r={i === n - 1 ? 4 : 2.6}
                      fill={i === n - 1 ? s.colorVar : "var(--color-base)"}
                      stroke={s.colorVar}
                      strokeWidth="2"
                      className="rl-fade-in"
                      style={{ animationDelay: `${600 + i * 60}ms` }}
                    />
                  ))}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
