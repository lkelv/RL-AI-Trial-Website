import type {
  Difficulty,
  OptionItem,
  PaperType,
  SubjectFamily,
} from "../types";

export const DIFFICULTIES: OptionItem<Difficulty>[] = [
  { id: "easy", label: "Easy", hint: "Build confidence with the fundamentals" },
  { id: "normal", label: "Normal", hint: "Standard exam-level questions" },
  { id: "intermediate", label: "Intermediate", hint: "Multi-step, applied problems" },
  { id: "challenging", label: "Challenging", hint: "Stretch & extension — top-band difficulty" },
];

export const PAPER_TYPES_BY_FAMILY: Record<SubjectFamily, OptionItem<PaperType>[]> = {
  VCE: [
    { id: "exam1", label: "Exam 1", hint: "Technology-free short answer" },
    { id: "exam2", label: "Exam 2", hint: "Technology-active" },
    { id: "mc", label: "Multiple Choice", hint: "Exam 2 Section A style" },
    { id: "exam2-extended", label: "Exam 2 — Extended Response", hint: "Long-form application" },
  ],
  IB: [
    { id: "tech-active", label: "Tech Active", hint: "Calculator permitted" },
    { id: "tech-free", label: "Tech Free", hint: "No calculator" },
  ],
};

/** Sensible question-count presets shown as quick chips. */
export const QUESTION_COUNT_PRESETS = [4, 6, 8, 10, 12];

export const SOURCE_LABELS = {
  vcaa: {
    title: "VCAA",
    blurb: "Authentic past exam questions sourced directly from VCAA papers.",
  },
  modified: {
    title: "RL Question Bank",
    blurb: "Exam-style questions written and curated by RL tutors.",
  },
};
