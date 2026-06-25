import type { ErrorQuestion, ErrorType, OptionItem } from "../types";

/* ------------------------------------------------------------------
   Error Data Booklet — the questions the student previously got wrong.

   In the real product these are harvested automatically from the AI
   Marking page (every question marked incorrect is collected here), and
   the booklet also surfaces questions from topics the student is weak at
   — inferred from their error history. That inference is a backend
   feature and isn't demonstrable, so it isn't implemented here; this is a
   fixed, pre-made set for the walkthrough.

   `subjectId` + `difficulty` let the "Generate practice" button pre-fill
   the practice wizard (subject / topic / difficulty) for that question.
   ------------------------------------------------------------------ */

/** The two error categories the student can tag a question with. */
export const ERROR_TYPES: OptionItem<ErrorType>[] = [
  { id: "careless", label: "Careless Mistake", hint: "Knew the method — slipped on execution" },
  { id: "knowledge-gap", label: "Knowledge Gap", hint: "Didn't know the concept or method" },
];

export const ERROR_QUESTIONS: ErrorQuestion[] = [
  {
    id: "eq-1",
    subject: "Methods 3 & 4",
    subjectId: "MM34",
    topic: "Differentiation",
    subTopic: "Chain Rule",
    difficulty: "normal",
    source: "AI Marking · 14 Jun",
    prompt: "Differentiate f(x) = (3x² − 5)⁴ with respect to x.",
    marksLabel: "1 / 3 marks",
    yourError: "Forgot to multiply by the derivative of the inner function (3x² − 5).",
    attempt: ["f(x) = (3x² − 5)⁴", "f '(x) = 4(3x² − 5)³"],
  },
  {
    id: "eq-2",
    subject: "Methods 3 & 4",
    subjectId: "MM34",
    topic: "Differentiation",
    subTopic: "Product Rule",
    difficulty: "normal",
    source: "AI Marking · 14 Jun",
    prompt: "Find the derivative of f(x) = x² · e^(2x).",
    marksLabel: "1 / 3 marks",
    yourError: "Applied the product rule but mis-differentiated e^(2x) as e^(2x) instead of 2e^(2x).",
    attempt: ["f '(x) = 2x·e^(2x) + x²·e^(2x)"],
  },
  {
    id: "eq-3",
    subject: "Methods 3 & 4",
    subjectId: "MM34",
    topic: "Differentiation",
    subTopic: "Tangent and Normal",
    difficulty: "intermediate",
    source: "AI Marking · 14 Jun",
    prompt:
      "Find the equation of the tangent to y = ln(x) at the point where x = e.",
    marksLabel: "2 / 4 marks",
    yourError: "Correct gradient, but used the wrong point — substituted x = 1 instead of x = e.",
    attempt: ["dy/dx = 1/x → m = 1/e", "y − 0 = (1/e)(x − 1)"],
  },
  {
    id: "eq-4",
    subject: "Methods 3 & 4",
    subjectId: "MM34",
    topic: "Integration",
    subTopic: "Integrating Exponential",
    difficulty: "intermediate",
    source: "AI Marking · 31 May",
    prompt: "Evaluate the definite integral of 6e^(3x) from x = 0 to x = 1.",
    marksLabel: "1 / 4 marks",
    yourError: "Antiderivative off by a factor of 3; missed dividing by the coefficient of x.",
    attempt: ["∫ 6e^(3x) dx = [6e^(3x)]₀¹", "= 6e³ − 6"],
  },
  {
    id: "eq-5",
    subject: "Methods 3 & 4",
    subjectId: "MM34",
    topic: "Circular (Trigonometric) Functions",
    subTopic: "Solving Circular Equation",
    difficulty: "easy",
    source: "AI Marking · 31 May",
    prompt: "Solve 2sin(x) = 1 for x over the domain [0, 2π].",
    marksLabel: "1 / 2 marks",
    yourError: "Found x = π/6 but missed the second solution x = 5π/6 in the domain.",
    attempt: ["sin(x) = 1/2", "x = π/6"],
  },
];
