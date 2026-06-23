import { useRef, useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { PdfViewer } from "../../components/pdf/PdfViewer";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { FakeAiOverlay } from "../../components/feedback/FakeAiOverlay";
import {
  IconCheck,
  IconFile,
  IconMarking,
  IconUpload,
} from "../../components/ui/Icons";
import { MARKED_PDF } from "../../data";

const MARK_PHASES = [
  "Reading your submission",
  "Recognising handwriting & working",
  "Checking each step",
  "Assigning marks",
  "Writing personalised feedback",
];

type Phase = "upload" | "marking" | "result";

export default function AiMarking() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function pickFile(file: File | undefined) {
    if (!file) return;
    // We only read the name for display - the content is never processed.
    setFileName(file.name);
  }

  return (
    <AppShell back={{ to: "/student/ai", label: "AI Features" }}>
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="rl-reveal">
          <h1 className="text-2xl text-ink sm:text-3xl">AI Marking Paper</h1>
          <p className="mt-2 font-mono text-sm text-ink-dim">
            upload your worked solutions and get them marked instantly
          </p>
        </div>

        {phase !== "result" && (
          <div className="relative mt-8">
            {/* dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              className={`rl-reveal flex flex-col items-center justify-center border-2 border-dashed p-12 text-center transition-colors ${
                dragging ? "border-mint bg-mint/10" : "border-line bg-raised"
              }`}
            >
              <span className="mb-4 inline-flex items-center justify-center text-mint">
                <IconUpload size={40} />
              </span>
              <p className="font-display text-lg text-ink">
                Drag &amp; drop your PDF here
              </p>
              <p className="mt-1 text-sm text-ink-dim">or click to browse, any worked-solutions PDF</p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? undefined)}
              />
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => inputRef.current?.click()}
              >
                <IconFile size={16} /> Choose file
              </Button>

              {fileName && (
                <div className="mt-6 flex items-center gap-2 border border-mint/40 bg-mint/10 px-3 py-2 text-sm text-ink">
                  <IconCheck size={16} className="text-mint" />
                  <span className="font-mono">{fileName}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="max-w-sm text-xs text-ink-faint">
                Your file stays on your device. This demo returns a pre-marked
                sample so you can preview the experience.
              </p>
              <Button
                variant="amber"
                size="lg"
                disabled={!fileName}
                onClick={() => setPhase("marking")}
              >
                <IconMarking size={18} /> Mark with AI
              </Button>
            </div>

            {phase === "marking" && (
              <FakeAiOverlay
                phases={MARK_PHASES}
                phaseDuration={750}
                title="Marking your paper…"
                subtitle="RL AI is reviewing your working"
                onComplete={() => setPhase("result")}
              />
            )}
          </div>
        )}

        {phase === "result" && (
          <div className="mt-8">
            {/* score banner */}
            <div className="rl-reveal flex flex-wrap items-center gap-4 border border-mint/40 bg-mint/10 p-5">
              <span className="inline-flex items-center justify-center text-mint">
                <IconCheck size={34} />
              </span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-semibold text-ink">18</span>
                  <span className="font-mono text-lg text-ink-dim">/ 20</span>
                  <Badge color="mint" className="ml-1">
                    90%
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-dim">
                  Strong work, clear method throughout. Watch your notation in Q4
                  and show one more line of working in Q6.
                </p>
              </div>
              <Button variant="outline" onClick={() => { setPhase("upload"); setFileName(null); }}>
                <IconUpload size={16} /> Mark another
              </Button>
            </div>

            <div className="rl-reveal mt-5" style={{ animationDelay: "120ms" }}>
              <PdfViewer
                href={MARKED_PDF.href}
                downloadName={MARKED_PDF.downloadName}
                label="AI-marked paper, with feedback"
                className="h-[70vh] min-h-[480px]"
              />
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
