import type { ErrorQuestion } from "../types";

/* ------------------------------------------------------------------
   Error Data Booklet — the questions the student previously got wrong.

   In the real product these are harvested automatically from the AI
   Marking page (every question marked incorrect is collected here), and
   the booklet also surfaces questions from topics the student is weak at
   — inferred from their error history. That inference is a backend
   feature and isn't demonstrable, so it isn't implemented here; this is a
   fixed, pre-made set for the walkthrough.
   ------------------------------------------------------------------ */

export const ERROR_QUESTIONS: ErrorQuestion[] = [
  {
    id: "eq-1",
    subject: "Methods 3 & 4",
    topic: "Differentiation",
    subTopic: "Chain Rule",
    source: "AI Marking · 14 Jun",
    prompt: "Differentiate f(x) = (3x² − 5)⁴ with respect to x.",
    marksLabel: "1 / 3 marks",
    yourError: "Forgot to multiply by the derivative of the inner function (3x² − 5).",
  },
  {
    id: "eq-2",
    subject: "Methods 3 & 4",
    topic: "Differentiation",
    subTopic: "Product Rule",
    source: "AI Marking · 14 Jun",
    prompt: "Find the derivative of f(x) = x² · e^(2x).",
    marksLabel: "1 / 3 marks",
    yourError: "Applied the product rule but mis-differentiated e^(2x) as e^(2x) instead of 2e^(2x).",
  },
  {
    id: "eq-3",
    subject: "Methods 3 & 4",
    topic: "Differentiation",
    subTopic: "Tangent and Normal",
    source: "AI Marking · 14 Jun",
    prompt:
      "Find the equation of the tangent to y = ln(x) at the point where x = e.",
    marksLabel: "2 / 4 marks",
    yourError: "Correct gradient, but used the wrong point — substituted x = 1 instead of x = e.",
  },
  {
    id: "eq-4",
    subject: "Methods 3 & 4",
    topic: "Integration",
    subTopic: "Integrating Exponential",
    source: "AI Marking · 31 May",
    prompt: "Evaluate the definite integral of 6e^(3x) from x = 0 to x = 1.",
    marksLabel: "1 / 4 marks",
    yourError: "Antiderivative off by a factor of 3; missed dividing by the coefficient of x.",
  },
  {
    id: "eq-5",
    subject: "Methods 3 & 4",
    topic: "Circular (Trigonometric) Functions",
    subTopic: "Solving Circular Equation",
    source: "AI Marking · 31 May",
    prompt: "Solve 2sin(x) = 1 for x over the domain [0, 2π].",
    marksLabel: "1 / 2 marks",
    yourError: "Found x = π/6 but missed the second solution x = 5π/6 in the domain.",
  },
];
