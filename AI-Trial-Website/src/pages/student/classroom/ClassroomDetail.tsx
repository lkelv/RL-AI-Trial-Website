import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import type { ClassFileKind, TaskStatus } from "../../../types";
import { getClass } from "../../../data";
import { useAuth } from "../../../context/AuthContext";
import { AppShell } from "../../../components/layout/AppShell";
import { Avatar } from "../../../components/ui/Avatar";
import { Badge } from "../../../components/ui/Badge";
import { BannerPattern } from "../../../components/ui/BannerPattern";
import {
  IconCheck,
  IconFile,
  IconLink,
  IconPin,
  IconSlides,
  IconTest,
  IconVideo,
} from "../../../components/ui/Icons";
import { ACCENT_COLOR } from "../../../lib/format";

type Tab = "stream" | "tasks" | "files" | "people";
const TABS: { id: Tab; label: string }[] = [
  { id: "stream", label: "Stream" },
  { id: "tasks", label: "Tasks" },
  { id: "files", label: "Files" },
  { id: "people", label: "People" },
];

const STATUS_STYLE: Record<TaskStatus, { label: string; color: "mint" | "amber" | "info" | "ink" }> = {
  assigned: { label: "Assigned", color: "info" },
  submitted: { label: "Submitted", color: "amber" },
  graded: { label: "Graded", color: "mint" },
  missing: { label: "Missing", color: "ink" },
};

function FileIcon({ kind }: { kind: ClassFileKind }) {
  if (kind === "link") return <IconLink size={18} />;
  if (kind === "video") return <IconVideo size={18} />;
  if (kind === "slides") return <IconSlides size={18} />;
  return <IconFile size={18} />;
}

export default function ClassroomDetail() {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const cls = getClass(classId);
  const [tab, setTab] = useState<Tab>("stream");

  if (!cls || !user?.enrolledClassIds?.includes(cls.id)) {
    return <Navigate to="/student/classroom" replace />;
  }

  const c = ACCENT_COLOR[cls.themeColor];
  const announcements = [...cls.announcements].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  const teachers = cls.people.filter((p) => p.role === "teacher");
  const students = cls.people.filter((p) => p.role === "student");

  return (
    <AppShell back={{ to: "/student/classroom", label: "Classroom" }}>
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        {/* banner */}
        <div
          className="rl-reveal relative overflow-hidden p-6"
          style={{ background: `color-mix(in srgb, ${c} 28%, var(--color-night))` }}
        >
          <BannerPattern pattern={cls.bannerPattern} color={cls.themeColor} />
          <div className="relative">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">{cls.name}</h1>
            <p className="mt-1 text-ink/80">{cls.section}</p>
            <div className="mt-4 flex items-center gap-2">
              <Avatar name={cls.teacherName} color={cls.themeColor} size={32} />
              <span className="text-sm text-ink/90">{cls.teacherName}</span>
              <span className="text-ink/50">·</span>
              <span className="text-sm text-ink/70">{cls.room}</span>
            </div>
          </div>
        </div>

        {/* tabs */}
        <div className="mt-6 flex gap-1 border-b border-line/70">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id ? "text-ink" : "text-ink-faint hover:text-ink-dim"
              }`}
            >
              {t.label}
              {t.id === "tasks" && cls.upcomingCount > 0 && (
                <span className="ml-1.5 bg-amber/20 px-1.5 py-0.5 font-mono text-[10px] text-amber">
                  {cls.upcomingCount}
                </span>
              )}
              {tab === t.id && (
                <span className="absolute inset-x-3 -bottom-px h-0.5 bg-mint" />
              )}
            </button>
          ))}
        </div>

        {/* panels */}
        <div className="mt-6">
          {tab === "stream" && (
            <div className="space-y-4">
              {announcements.map((a, i) => (
                <div
                  key={a.id}
                  className="rl-reveal border border-line bg-raised p-4"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={a.authorName} color={a.authorColor} size={38} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{a.authorName}</span>
                        <Badge color={a.authorRole === "admin" ? "pine" : "amber"}>
                          {a.authorRole}
                        </Badge>
                        {a.pinned && <IconPin size={14} className="text-mint" />}
                      </div>
                      <span className="text-xs text-ink-faint">{a.postedAt}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-dim">{a.body}</p>
                  {a.attachment && (
                    <div className="mt-3 inline-flex items-center gap-2 border border-line bg-base px-3 py-2 text-sm text-ink-dim">
                      <IconFile size={16} className="text-mint" />
                      {a.attachment.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "tasks" && (
            <div className="space-y-3">
              {cls.tasks.map((t, i) => {
                const st = STATUS_STYLE[t.status];
                return (
                  <div
                    key={t.id}
                    className="rl-reveal flex items-center gap-4 border border-line bg-raised p-4"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center text-mint">
                      <IconTest size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-ink">{t.title}</div>
                      {t.detail && <div className="truncate text-xs text-ink-faint">{t.detail}</div>}
                      <div className="mt-0.5 text-xs text-ink-dim">{t.dueLabel}</div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <Badge color={st.color}>{st.label}</Badge>
                      <span className="font-mono text-xs text-ink-faint">
                        {t.grade ?? (t.points ? `${t.points} pts` : "")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "files" && (
            <div className="space-y-2">
              {cls.files.map((f, i) => (
                <a
                  key={f.id}
                  href={f.href ?? "#"}
                  onClick={(e) => !f.href && e.preventDefault()}
                  className="rl-reveal flex items-center gap-3 border border-line bg-raised p-3 transition-colors hover:border-mint/40"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center text-mint">
                    <FileIcon kind={f.kind} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{f.name}</div>
                    {f.meta && <div className="text-xs text-ink-faint">{f.meta}</div>}
                  </div>
                  <span className="font-mono text-xs text-ink-faint">{f.kind}</span>
                </a>
              ))}
            </div>
          )}

          {tab === "people" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 border-b border-line/60 pb-2 font-display text-lg text-ink">
                  Teachers
                </h3>
                <div className="space-y-2">
                  {teachers.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 border border-line bg-raised p-3">
                      <Avatar name={p.name} color={p.avatarColor} size={40} />
                      <div>
                        <div className="text-sm font-medium text-ink">{p.name}</div>
                        {p.email && <div className="text-xs text-ink-faint">{p.email}</div>}
                      </div>
                      <IconCheck size={16} className="ml-auto text-mint" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 flex items-center justify-between border-b border-line/60 pb-2 font-display text-lg text-ink">
                  Classmates
                  <span className="font-sans text-sm font-normal text-ink-faint">{students.length} students</span>
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {students.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 border border-line bg-raised p-3">
                      <Avatar name={p.name} color={p.avatarColor} size={36} />
                      <span className="text-sm text-ink">{p.name}</span>
                      {p.id === user?.id && <Badge color="mint" className="ml-auto">You</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
