/* ------------------------------------------------------------------
   QuestionSnapshot — a faked "photo" of the student's handwritten attempt,
   as if captured by the AI Marking camera. Pure inline SVG (no external
   image files) so it always renders on camera and stays deterministic.

   Renders the printed question on ruled paper, the captured working in a
   handwriting face (system cursive on the recording machine, falling back
   to generic `cursive`), and the teacher's red pen marks.
   ------------------------------------------------------------------ */

const PAPER = "#f3efe5";
const PAPER_EDGE = "#d9d1c0";
const RULE = "#b9cadb";
const MARGIN = "#d98b80";
const PRINT = "#33322e";
const PEN = "#243a57";
const RED = "#cf4636";

const HAND = '18px "Segoe Print","Bradley Hand","Comic Sans MS",cursive';

/** Greedy word wrap so the printed question fits the paper width. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (next.length > max && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

interface QuestionSnapshotProps {
  prompt: string;
  attempt: string[];
  marksLabel: string;
  className?: string;
}

export function QuestionSnapshot({
  prompt,
  attempt,
  marksLabel,
  className = "",
}: QuestionSnapshotProps) {
  const qLines = wrap(prompt, 36).slice(0, 3);
  const score = marksLabel.replace(/\s*marks?\s*/i, "");

  const qTop = 24;
  const qLineH = 16;
  const attemptTop = qTop + qLines.length * qLineH + 24;
  const attemptLineH = 28;
  const lastY = attemptTop + (attempt.length - 1) * attemptLineH;

  return (
    <svg
      viewBox="0 0 360 250"
      className={className}
      role="img"
      aria-label="AI snapshot of the attempted question"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <clipPath id="rl-snap-clip">
          <rect x="0" y="0" width="360" height="250" />
        </clipPath>
      </defs>

      <g clipPath="url(#rl-snap-clip)">
        <rect x="0" y="0" width="360" height="250" fill={PAPER} />

        {/* ruled lines under the working */}
        {Array.from({ length: 6 }).map((_, i) => {
          const y = attemptTop - 8 + i * attemptLineH;
          return (
            <line key={i} x1="0" x2="360" y1={y} y2={y} stroke={RULE} strokeWidth="1" opacity="0.55" />
          );
        })}
        {/* red margin rule */}
        <line x1="34" x2="34" y1="0" y2="250" stroke={MARGIN} strokeWidth="1" opacity="0.7" />

        {/* printed question */}
        {qLines.map((line, i) => (
          <text
            key={i}
            x="14"
            y={qTop + i * qLineH}
            fill={PRINT}
            style={{ font: "600 12px var(--font-sans)" }}
          >
            {i === 0 ? `Q.  ${line}` : line}
          </text>
        ))}

        {/* handwritten attempt */}
        {attempt.map((line, i) => (
          <text key={i} x="44" y={attemptTop + i * attemptLineH} fill={PEN} style={{ font: HAND }}>
            {line}
          </text>
        ))}

        {/* red pen: ringed score, top-right */}
        <ellipse
          cx="322"
          cy="26"
          rx="30"
          ry="16"
          fill="none"
          stroke={RED}
          strokeWidth="2"
          transform="rotate(-7 322 26)"
        />
        <text
          x="322"
          y="31"
          fill={RED}
          textAnchor="middle"
          style={{ font: '700 14px "Segoe Print","Comic Sans MS",cursive' }}
        >
          {score}
        </text>

        {/* red pen: margin cross against the wrong line */}
        <g stroke={RED} strokeWidth="2.4" strokeLinecap="round">
          <line x1="330" y1={lastY - 11} x2="345" y2={lastY + 3} />
          <line x1="345" y1={lastY - 11} x2="330" y2={lastY + 3} />
        </g>
      </g>

      {/* photo edge */}
      <rect
        x="0.75"
        y="0.75"
        width="358.5"
        height="248.5"
        fill="none"
        stroke={PAPER_EDGE}
        strokeWidth="1.5"
      />
    </svg>
  );
}
