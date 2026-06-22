import type { PracticeSelection } from "../../../types";
import {
  DIFFICULTIES,
  PAPER_TYPES_BY_FAMILY,
  PRACTICE_PDFS,
  SOURCE_LABELS,
  getSubject,
} from "../../../data";
import { PdfViewer } from "../../../components/pdf/PdfViewer";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { IconCheck, IconSparkles } from "../../../components/ui/Icons";

function diffLabel(id: string): string {
  return DIFFICULTIES.find((d) => d.id === id)?.label ?? id;
}

function summaryChips(s: PracticeSelection): string[] {
  const subject = getSubject(s.subjectId);
  const family = subject?.family ?? "VCE";
  const paper = PAPER_TYPES_BY_FAMILY[family].find((t) => t.id === s.paperType)?.label;

  const allNames = subject?.topics.map((t) => t.overall) ?? [];
  const allFull =
    allNames.length > 0 &&
    s.topics.length === allNames.length &&
    s.topics.every((t) => t.subs.length === 0);
  const topicLabel = (t: (typeof s.topics)[number]) =>
    t.subs.length === 0 ? t.overall : `${t.overall} (${t.subs.length})`;
  let topicChip = "";
  if (s.topics.length === 0) topicChip = "";
  else if (allFull) topicChip = "All topics";
  else if (s.topics.length <= 2) topicChip = s.topics.map(topicLabel).join(", ");
  else topicChip = `${s.topics.length} topics`;

  const chips: string[] = [];
  if (subject?.short) chips.push(subject.short);
  if (topicChip) chips.push(topicChip);
  if (s.difficulties.length === 1) {
    chips.push(diffLabel(s.difficulties[0].id));
  } else {
    s.difficulties.forEach((d) => chips.push(`${diffLabel(d.id)} ${d.percent}%`));
  }
  if (paper) chips.push(paper);
  chips.push(`${s.questionCount} questions`);
  chips.push(`${s.vcaaCount} ${SOURCE_LABELS.vcaa.title} · ${s.modifiedCount} ${SOURCE_LABELS.modified.title}`);
  return chips;
}

export function PracticeResult({
  selection,
  onReset,
}: {
  selection: PracticeSelection;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="rl-reveal flex flex-wrap items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-mint/15 text-mint">
          <IconCheck size={24} />
        </span>
        <div>
          <h1 className="text-2xl text-ink sm:text-3xl">Your papers are ready</h1>
          <p className="text-sm text-ink-dim">
            RL AI generated a question paper and full worked solutions.
          </p>
        </div>
        <Button variant="outline" onClick={onReset} className="ml-auto">
          <IconSparkles size={16} /> Generate another
        </Button>
      </div>

      <div className="rl-reveal mt-5 flex flex-wrap gap-2" style={{ animationDelay: "80ms" }}>
        {summaryChips(selection).map((c) => (
          <Badge key={c} color="mint">
            {c}
          </Badge>
        ))}
      </div>

      <div className="rl-reveal mt-6 grid gap-5 lg:grid-cols-2" style={{ animationDelay: "160ms" }}>
        {PRACTICE_PDFS.map((pdf) => (
          <PdfViewer
            key={pdf.kind}
            href={pdf.href}
            downloadName={pdf.downloadName}
            label={pdf.label}
            className="h-[68vh] min-h-[460px]"
          />
        ))}
      </div>
    </div>
  );
}
