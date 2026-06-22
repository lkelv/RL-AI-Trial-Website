import type { PracticeSelection } from "../../../types";
import { DIFFICULTIES, PAPER_TYPES_BY_FAMILY, PRACTICE_PDFS, getSubject } from "../../../data";
import { PdfViewer } from "../../../components/pdf/PdfViewer";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { IconCheck, IconSparkles } from "../../../components/ui/Icons";

function summaryChips(s: PracticeSelection): string[] {
  const subject = getSubject(s.subjectId);
  const difficulty = DIFFICULTIES.find((d) => d.id === s.difficulty)?.label;
  const family = subject?.family ?? "VCE";
  const paper = PAPER_TYPES_BY_FAMILY[family].find((t) => t.id === s.paperType)?.label;
  const topic =
    s.overallTopic && s.subTopic && s.subTopic !== "All sub-topics"
      ? `${s.overallTopic} · ${s.subTopic}`
      : (s.overallTopic ?? "");
  return [
    subject?.short ?? "",
    topic,
    difficulty ?? "",
    paper ?? "",
    `${s.questionCount} questions`,
    `${s.vcaaCount} VCAA · ${s.modifiedCount} modified`,
  ].filter(Boolean);
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
