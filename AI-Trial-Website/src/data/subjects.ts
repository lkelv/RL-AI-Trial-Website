import type { Subject } from "../types";

/**
 * The 8 selectable subjects. MM34 carries the full topic taxonomy from the
 * brief (every listed topic is present, organised into overall → sub-topics).
 * The scripted demo path uses MM34 → Differentiation.
 * The remaining subjects carry lighter, representative topic lists.
 */
export const SUBJECTS: Subject[] = [
  {
    id: "MM34",
    label: "Maths Methods — Units 3 & 4",
    short: "Methods 3 & 4",
    family: "VCE",
    topics: [
      {
        overall: "Functions and Relations",
        unit: 3,
        subs: [
          "Type of relation",
          "Sketching Graphs",
          "Domain and Range",
          "Equations of Circle",
          "Implied Domain (Max. Domain)",
          "Transformation",
          "Hybrid Function",
          "Composite Function",
          "Addition of Ordinate",
        ],
      },
      {
        overall: "Inverse Functions",
        unit: 3,
        subs: ["Function Notation", "Finding Inverse"],
      },
      {
        overall: "Polynomial Functions",
        unit: 3,
        subs: [
          "Linear",
          "The number of roots for two linear equations",
          "Quadratic",
          "Solving Inequation",
          "Cubic function",
          "Sketching Polynomial (Interception form)",
        ],
      },
      {
        overall: "Exponential & Logarithmic Functions",
        unit: 3,
        subs: [
          "Exponential and Logarithmic Function",
          "Solving the Exponential Equation",
        ],
      },
      {
        overall: "Circular (Trigonometric) Functions",
        unit: 3,
        subs: [
          "Identity Rule",
          "Special Angle",
          "Solving Circular Equation",
          "General Solution",
          "Circular Graph",
        ],
      },
      {
        overall: "Differentiation",
        unit: 3,
        subs: [
          "Derivative of polynomials",
          "Chain Rule",
          "Derivatives of Exponential",
          "Derivatives of Log",
          "Derivatives of circular function",
          "Product Rule",
          "Quotient Rule",
          "Continuity",
          "Gradient Graph",
          "Differentiation of Hybrid Function",
          "Tangent and Normal",
          "Stationary Point",
          "Absolute Maximum & Minimum",
          "Maximum and Minimum problem",
          "Rate of Change",
          "Newton's method",
          "Anti-differentiation / Integration",
        ],
      },
      {
        overall: "Integration",
        unit: 4,
        subs: [
          "Integrating Exponential",
          "Integrating 1/x",
          "Integrating circular function",
          "Integration by recognition",
          "Definite Integrals",
          "Finding Area by Integration",
          "Application of Integration",
          "Finding area using trapeziums",
          "Average value of a function",
        ],
      },
      {
        overall: "Probability & Statistics",
        unit: 4,
        subs: [
          "Discrete random variable",
          "Probability Distributions",
          "Binomial Distribution",
          "Continuous Random variables",
          "Probability density function",
          "Normal Distribution",
          "Statistics",
          "Population sample",
          "Confidence Intervals",
          "Margin of error",
        ],
      },
    ],
  },
  {
    id: "MM12",
    label: "Maths Methods — Units 1 & 2",
    short: "Methods 1 & 2",
    family: "VCE",
    topics: [
      { overall: "Functions and Graphs", unit: 1, subs: ["Linear", "Quadratic", "Cubic", "Power Functions"] },
      { overall: "Algebra", unit: 1, subs: ["Indices", "Simultaneous Equations", "Factorising"] },
      { overall: "Probability", unit: 2, subs: ["Sample Spaces", "Conditional Probability"] },
      { overall: "Introductory Calculus", unit: 2, subs: ["Rates of Change", "First Principles"] },
    ],
  },
  {
    id: "SM34",
    label: "Specialist Maths — Units 3 & 4",
    short: "Specialist 3 & 4",
    family: "VCE",
    topics: [
      { overall: "Complex Numbers", unit: 3, subs: ["Cartesian Form", "Polar Form", "Regions & Loci"] },
      { overall: "Vectors", unit: 3, subs: ["Vector Operations", "Vector Calculus", "Applications"] },
      { overall: "Differential Equations", unit: 4, subs: ["First Order", "Second Order", "Slope Fields"] },
      { overall: "Kinematics", unit: 4, subs: ["Velocity & Acceleration", "Projectiles"] },
    ],
  },
  {
    id: "SM12",
    label: "Specialist Maths — Units 1 & 2",
    short: "Specialist 1 & 2",
    family: "VCE",
    topics: [
      { overall: "Number Systems", unit: 1, subs: ["Proof", "Sequences & Series"] },
      { overall: "Trigonometry", unit: 1, subs: ["Identities", "Circular Functions"] },
      { overall: "Matrices", unit: 2, subs: ["Operations", "Transformations"] },
    ],
  },
  {
    id: "IB11SL",
    label: "Year 11 IB — Mathematics SL",
    short: "IB SL (Yr 11)",
    family: "IB",
    topics: [
      { overall: "Number & Algebra", subs: ["Sequences & Series", "Exponents & Logs"] },
      { overall: "Functions", subs: ["Linear & Quadratic", "Transformations"] },
      { overall: "Statistics & Probability", subs: ["Descriptive Statistics", "Probability"] },
    ],
  },
  {
    id: "IB11HL",
    label: "Year 11 IB — Mathematics HL",
    short: "IB HL (Yr 11)",
    family: "IB",
    topics: [
      { overall: "Algebra", subs: ["Binomial Theorem", "Complex Numbers"] },
      { overall: "Functions", subs: ["Rational Functions", "Polynomials"] },
      { overall: "Calculus", subs: ["Limits", "Differentiation"] },
    ],
  },
  {
    id: "IB12HL",
    label: "Year 12 IB — Mathematics HL",
    short: "IB HL (Yr 12)",
    family: "IB",
    topics: [
      { overall: "Calculus", subs: ["Integration Techniques", "Differential Equations", "Maclaurin Series"] },
      { overall: "Vectors", subs: ["Lines & Planes", "Vector Products"] },
      { overall: "Probability Distributions", subs: ["Binomial", "Normal", "Poisson"] },
    ],
  },
  {
    id: "IBAL",
    label: "IB — Applications & Interpretation",
    short: "IB AL",
    family: "IB",
    topics: [
      { overall: "Modelling", subs: ["Linear Models", "Exponential Models"] },
      { overall: "Statistics", subs: ["Regression", "Chi-squared Tests"] },
      { overall: "Geometry", subs: ["Trigonometry", "Voronoi Diagrams"] },
    ],
  },
];

export const getSubject = (id: string | null): Subject | undefined =>
  SUBJECTS.find((s) => s.id === id);
