import { Link } from "react-router-dom";
import type { ClassRoom } from "../../../types";
import { CLASSES } from "../../../data";
import { useAuth } from "../../../context/AuthContext";
import { AppShell } from "../../../components/layout/AppShell";
import { Avatar } from "../../../components/ui/Avatar";
import { BannerPattern } from "../../../components/ui/BannerPattern";
import { IconClassroom, IconFile, IconTest } from "../../../components/ui/Icons";
import { ACCENT_COLOR, stagger } from "../../../lib/format";

function ClassCard({ cls }: { cls: ClassRoom }) {
  const c = ACCENT_COLOR[cls.themeColor];
  return (
    <Link
      to={`/student/classroom/${cls.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line/70 bg-raised/45 transition-all duration-300 hover:-translate-y-1 hover:border-mint/40"
    >
      {/* banner */}
      <div
        className="relative h-28 overflow-hidden p-4"
        style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${c} 48%, var(--color-night)), color-mix(in srgb, ${c} 18%, var(--color-night)))` }}
      >
        <BannerPattern pattern={cls.bannerPattern} color={cls.themeColor} />
        <div className="relative">
          <h3 className="font-display text-xl text-ink drop-shadow">{cls.name}</h3>
          <p className="text-xs text-ink/80">{cls.section}</p>
        </div>
        <div className="absolute -bottom-5 right-4">
          <Avatar name={cls.teacherName} color={cls.themeColor} size={44} className="ring-4 ring-raised" />
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4 pt-6">
        <p className="text-sm text-ink-dim">{cls.teacherName}</p>
        <p className="mt-0.5 text-xs text-ink-faint">{cls.room}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-line/60 pt-3 text-xs text-ink-dim">
          <span className="flex items-center gap-1.5">
            <IconTest size={14} className="text-amber" /> {cls.upcomingCount} due
          </span>
          <span className="flex items-center gap-1.5">
            <IconFile size={14} className="text-mint" /> {cls.files.length} files
          </span>
          <span className="ml-auto font-medium text-mint opacity-0 transition-opacity group-hover:opacity-100">
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ClassroomList() {
  const { user } = useAuth();
  const myClasses = CLASSES.filter((c) => user?.enrolledClassIds?.includes(c.id));

  return (
    <AppShell back={{ to: "/student", label: "Student home" }}>
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="rl-reveal flex items-center gap-3" style={stagger(0)}>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-info/15 text-info">
            <IconClassroom size={24} />
          </span>
          <div>
            <h1 className="text-3xl text-ink sm:text-4xl">Classroom</h1>
            <p className="text-sm text-ink-dim">
              {myClasses.length} active {myClasses.length === 1 ? "class" : "classes"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((cls, i) => (
            <div key={cls.id} className="rl-reveal" style={stagger(i + 1)}>
              <ClassCard cls={cls} />
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
