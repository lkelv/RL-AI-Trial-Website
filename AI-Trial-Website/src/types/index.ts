/* ============================================================
   Shared types for the RL AI Tutoring demo.
   (No runtime values here - all interfaces / string-literal unions,
   safe under verbatimModuleSyntax + erasableSyntaxOnly.)
   ============================================================ */

/* ---------- Auth / users ---------- */
export type Role = "student" | "parent" | "teacher" | "admin";

export interface Account {
  id: string;
  username: string;
  password: string; // fake plaintext - DEMO ONLY
  role: Role;
  displayName: string;
  avatarColor: AccentName;
  tagline?: string;
  enrolledClassIds?: string[]; // student
  childStudentName?: string; // parent
}

/** Logged-in user stored in context (password stripped). */
export type SessionUser = Omit<Account, "password">;

/* ---------- Accent palette names (map to CSS tokens) ---------- */
export type AccentName = "mint" | "amber" | "pine" | "info" | "ink";

/* ---------- Subjects + nested topics ---------- */
export type SubjectFamily = "VCE" | "IB";

export interface SubjectTopic {
  overall: string; // e.g. "Differentiation"
  subs: string[]; // e.g. ["Chain Rule", "Product Rule", ...]
  unit?: number; // e.g. 3 or 4 - drives the "All Unit N topics" presets
}

export interface Subject {
  id: string; // "MM34"
  label: string; // "Maths Methods Units 3 & 4"
  short: string; // "Methods 3&4"
  family: SubjectFamily; // drives the Type step options
  topics: SubjectTopic[];
}

/* ---------- Practice wizard ---------- */
export type Difficulty = "easy" | "normal" | "intermediate" | "challenging";

export type PaperType =
  | "exam1"
  | "exam2"
  | "mc"
  | "exam2-extended" // VCE
  | "tech-active"
  | "tech-free"; // IB

export interface OptionItem<T extends string = string> {
  id: T;
  label: string;
  hint?: string;
}

export interface DifficultyMix {
  id: Difficulty;
  percent: number;
}

export interface TopicSelection {
  overall: string;
  subs: string[]; // empty = the whole topic (all sub-topics)
}

export interface PracticeSelection {
  subjectId: string | null;
  topics: TopicSelection[]; // multi-select; each topic may carry chosen sub-topics
  difficulties: DifficultyMix[]; // selected levels + their % split (sums to 100)
  paperType: PaperType | null;
  questionCount: number;
  vcaaCount: number;
  modifiedCount: number;
}

export interface PracticePdf {
  label: string;
  kind: "questions" | "solutions";
  href: string;
  downloadName: string;
}

/* ---------- Classroom ---------- */
export interface Person {
  id: string;
  name: string;
  role: "teacher" | "student";
  avatarColor: AccentName;
  email?: string;
}

export interface Announcement {
  id: string;
  authorName: string;
  authorRole: "teacher" | "admin";
  authorColor: AccentName;
  postedAt: string; // human label, faked
  body: string;
  pinned?: boolean;
  attachment?: { name: string; kind: ClassFileKind };
}

export type TaskStatus = "assigned" | "submitted" | "graded" | "missing";

export interface ClassTask {
  id: string;
  title: string;
  detail?: string;
  dueLabel: string;
  status: TaskStatus;
  points?: number;
  grade?: string;
}

export type ClassFileKind = "pdf" | "doc" | "slides" | "sheet" | "link" | "video";

export interface ClassFile {
  id: string;
  name: string;
  kind: ClassFileKind;
  meta?: string; // "1.2 MB" / "12 slides"
  href?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  section: string;
  subjectId: string;
  room?: string;
  themeColor: AccentName;
  bannerPattern: "grid" | "waves" | "dots" | "rings";
  teacherName: string;
  upcomingCount: number;
  announcements: Announcement[];
  tasks: ClassTask[];
  files: ClassFile[];
  people: Person[];
}

/* ---------- Parent dashboard ---------- */
export interface StatCard {
  id: string;
  label: string;
  value: number;
  unit: "%" | "/10" | "pts";
  caption: string;
  trend: number; // +/- delta
  accent: AccentName;
  icon: StatIcon;
}

export type StatIcon = "score" | "check" | "test" | "calendar" | "shield";

export interface ChartSeries {
  label: string;
  colorVar: string; // CSS var() string
  /** values already on a 0–100 scale for plotting */
  points: number[];
  /** optional display values (e.g. obedience /10) */
  displayPoints?: number[];
  unit: string;
}

export interface ParentChart {
  xLabels: string[];
  series: ChartSeries[];
}

export type LogKind =
  | "attendance"
  | "sick-confirmed"
  | "test"
  | "announcement"
  | "praise"
  | "homework";

export type LogSeverity = "info" | "warn" | "good";

export interface LogEntry {
  id: string;
  kind: LogKind;
  title: string;
  detail: string;
  timeLabel: string;
  severity: LogSeverity;
}

export interface ParentDashboardData {
  studentName: string;
  term: string;
  stats: StatCard[];
  chart: ParentChart;
  log: LogEntry[];
}

/* ---------- Error data booklet ---------- */
/** A question the student previously got wrong (in theory harvested from the
 *  AI Marking page), surfaced here so they can reattempt it. */
export interface ErrorQuestion {
  id: string;
  subject: string; // "Methods 3 & 4"
  topic: string; // overall topic, e.g. "Differentiation"
  subTopic: string; // e.g. "Chain Rule"
  source: string; // provenance label, e.g. "AI Marking · 14 Jun"
  prompt: string; // the question text (plain notation, no KaTeX)
  marksLabel: string; // e.g. "1 / 3 marks"
  yourError: string; // short note on what went wrong first time
}

/* ---------- Ask AI (fake chat) ---------- */
export interface AskAiStep {
  title: string;
  body: string;
}

export interface AskAiAnswer {
  summary: string;
  steps: AskAiStep[];
  result: string;
}

export interface AskAiSuggestion {
  id: string;
  subject: string;
  question: string;
  answer: AskAiAnswer;
}

/** A (faked) AI-generated video lesson the tutor "renders" in reply. */
export interface AskAiVideo {
  src: string; // served path, e.g. /videos/integration-exponential.mp4
  label: string; // header label shown on the player
  downloadName: string;
  summary: string; // intro line shown above the player
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text?: string; // user message
  answer?: AskAiAnswer; // assistant structured answer
  video?: AskAiVideo; // assistant rendered-video answer
}
