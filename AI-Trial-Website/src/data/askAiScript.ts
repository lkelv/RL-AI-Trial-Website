import type { AskAiAnswer, AskAiSuggestion } from "../types";

/**
 * Pre-scripted Q&A for the (faked) "Ask AI" chat. Suggestion chips map to
 * specific answers; any free-typed question resolves to FALLBACK_ANSWER so the
 * live demo is always deterministic.
 */
export const ASK_AI_SUGGESTIONS: AskAiSuggestion[] = [
  {
    id: "q-product",
    subject: "Differentiation · Product Rule",
    question: "Differentiate y = x³·sin(x)",
    answer: {
      summary:
        "y is a product of two functions, so we apply the product rule: (uv)′ = u′v + uv′.",
      steps: [
        {
          title: "Name the two factors",
          body: "Let u = x³ and v = sin(x). We'll need the derivative of each.",
        },
        {
          title: "Differentiate each factor",
          body: "u′ = 3x²   and   v′ = cos(x).",
        },
        {
          title: "Apply the product rule",
          body: "dy/dx = u′v + uv′ = 3x²·sin(x) + x³·cos(x).",
        },
      ],
      result: "dy/dx = 3x²·sin(x) + x³·cos(x) = x²(3 sin x + x cos x)",
    },
  },
  {
    id: "q-tangent",
    subject: "Differentiation · Tangent & Normal",
    question: "Find the tangent to y = x² at x = 3",
    answer: {
      summary:
        "Use the derivative to get the gradient, find the point, then use point–gradient form.",
      steps: [
        {
          title: "Differentiate to get the gradient",
          body: "dy/dx = 2x, so at x = 3 the gradient is m = 2(3) = 6.",
        },
        {
          title: "Find the point of contact",
          body: "When x = 3, y = 3² = 9, so the tangent touches at (3, 9).",
        },
        {
          title: "Use y − y₁ = m(x − x₁)",
          body: "y − 9 = 6(x − 3)  →  y = 6x − 18 + 9.",
        },
      ],
      result: "y = 6x − 9",
    },
  },
  {
    id: "q-log",
    subject: "Exponential & Log · Solving",
    question: "Solve 2ˣ = 10 for x",
    answer: {
      summary: "Take logarithms of both sides to bring the power x down.",
      steps: [
        {
          title: "Log both sides",
          body: "log(2ˣ) = log(10)  →  x·log 2 = 1   (using base-10 logs).",
        },
        {
          title: "Make x the subject",
          body: "x = 1 ÷ log 2.",
        },
        {
          title: "Evaluate",
          body: "x ≈ 1 ÷ 0.30103 ≈ 3.32.",
        },
      ],
      result: "x = log₂10 ≈ 3.32",
    },
  },
];

export const FALLBACK_ANSWER: AskAiAnswer = {
  summary:
    "That's a composite function — a function inside another — so we use the chain rule. Here's the method on a worked example, y = (2x + 1)⁵.",
  steps: [
    {
      title: "Identify the inner and outer functions",
      body: "Outer: ( · )⁵.   Inner: u = 2x + 1.",
    },
    {
      title: "Differentiate each part",
      body: "d/du (u⁵) = 5u⁴   and   du/dx = 2.",
    },
    {
      title: "Multiply (chain) them together",
      body: "dy/dx = 5u⁴ · 2 = 10(2x + 1)⁴.",
    },
  ],
  result: "dy/dx = 10(2x + 1)⁴",
};
