import type {
  Account,
  ClassRoom,
  ParentDashboardData,
  PracticePdf,
} from "../types";
import accountsRaw from "./accounts.json";
import classesRaw from "./classes.json";
import parentDashboardRaw from "./parentDashboard.json";

/* JSON is cast to the strict app types (string-literal unions widen to string
   on import, so we route through `unknown`). */
export const ACCOUNTS = accountsRaw as unknown as Account[];
export const CLASSES = classesRaw as unknown as ClassRoom[];
export const PARENT_DASHBOARD =
  parentDashboardRaw as unknown as ParentDashboardData;

export const getClass = (id: string | undefined): ClassRoom | undefined =>
  CLASSES.find((c) => c.id === id);

/* Premade PDF outputs (live in /public/pdfs). The same files are returned
   regardless of selection - the demo outcome is fixed and bulletproof. */
export const PRACTICE_PDFS: PracticePdf[] = [
  {
    label: "Question Paper",
    kind: "questions",
    href: "/pdfs/practice-questions.pdf",
    downloadName: "RL-MM34-Differentiation-Questions.pdf",
  },
  {
    label: "Worked Solutions",
    kind: "solutions",
    href: "/pdfs/practice-solutions.pdf",
    downloadName: "RL-MM34-Differentiation-Solutions.pdf",
  },
];

export const MARKED_PDF = {
  href: "/pdfs/ai-marked-sample.pdf",
  downloadName: "RL-AI-Marked-Paper.pdf",
};

export { ERROR_QUESTIONS } from "./errorBooklet";
export { SUBJECTS, getSubject } from "./subjects";
export {
  DIFFICULTIES,
  PAPER_TYPES_BY_FAMILY,
  QUESTION_COUNT_PRESETS,
  SOURCE_LABELS,
} from "./practiceOptions";
export {
  ASK_AI_SUGGESTIONS,
  ASK_AI_VIDEO_SUGGESTION,
  FALLBACK_ANSWER,
  INTEGRATION_VIDEO,
  isIntegrationExponentialQuery,
} from "./askAiScript";
