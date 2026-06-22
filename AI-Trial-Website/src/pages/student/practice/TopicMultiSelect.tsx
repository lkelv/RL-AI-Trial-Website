import { useEffect, useRef, useState } from "react";
import type { SubjectTopic, TopicSelection } from "../../../types";
import { IconCheck, IconChevronDown, IconMinus } from "../../../components/ui/Icons";

interface TopicMultiSelectProps {
  topics: SubjectTopic[];
  selected: TopicSelection[];
  onChange: (next: TopicSelection[]) => void;
}

type TriState = "all" | "some" | "none";

/* ---- pure selection helpers ---- */
const find = (sels: TopicSelection[], overall: string) =>
  sels.find((s) => s.overall === overall);

function overallState(sels: TopicSelection[], topic: SubjectTopic): TriState {
  const sel = find(sels, topic.overall);
  if (!sel) return "none";
  if (sel.subs.length === 0) return "all";
  if (topic.subs.length > 0 && sel.subs.length === topic.subs.length) return "all";
  return "some";
}
function subSelected(sels: TopicSelection[], topic: SubjectTopic, sub: string): boolean {
  const sel = find(sels, topic.overall);
  if (!sel) return false;
  if (sel.subs.length === 0) return true;
  return sel.subs.includes(sub);
}

function Checkbox({ state }: { state: TriState }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded border transition-colors ${
        state === "none" ? "border-line text-transparent" : "border-mint bg-mint text-night"
      }`}
      style={{ height: 18, width: 18 }}
    >
      {state === "all" ? <IconCheck size={12} /> : state === "some" ? <IconMinus size={12} /> : null}
    </span>
  );
}

export function TopicMultiSelect({ topics, selected, onChange }: TopicMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const order = topics.map((t) => t.overall);
  const reorder = (sels: TopicSelection[]) =>
    order.map((name) => sels.find((s) => s.overall === name)).filter(Boolean) as TopicSelection[];

  const units = [
    ...new Set(topics.map((t) => t.unit).filter((u): u is number => u != null)),
  ].sort((a, b) => a - b);

  function toggleOverall(topic: SubjectTopic) {
    if (overallState(selected, topic) === "none") {
      onChange(reorder([...selected, { overall: topic.overall, subs: [] }]));
    } else {
      onChange(selected.filter((s) => s.overall !== topic.overall));
    }
  }

  function toggleSub(topic: SubjectTopic, sub: string) {
    const sel = find(selected, topic.overall);
    let current: string[];
    if (!sel) current = [];
    else if (sel.subs.length === 0) current = [...topic.subs];
    else current = [...sel.subs];

    current = current.includes(sub) ? current.filter((x) => x !== sub) : [...current, sub];
    current = topic.subs.filter((x) => current.includes(x)); // normalise order

    const others = selected.filter((s) => s.overall !== topic.overall);
    if (current.length === 0) {
      onChange(reorder(others));
    } else if (current.length === topic.subs.length) {
      onChange(reorder([...others, { overall: topic.overall, subs: [] }]));
    } else {
      onChange(reorder([...others, { overall: topic.overall, subs: current }]));
    }
  }

  function setGroup(group: SubjectTopic[], on: boolean) {
    const names = new Set(group.map((t) => t.overall));
    let next = selected.filter((s) => !names.has(s.overall));
    if (on) next = [...next, ...group.map((t) => ({ overall: t.overall, subs: [] as string[] }))];
    onChange(reorder(next));
  }
  const groupFull = (group: SubjectTopic[]) =>
    group.length > 0 && group.every((t) => overallState(selected, t) === "all");

  const expand = (name: string) =>
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(name) ? n.delete(name) : n.add(name);
      return n;
    });

  // summary
  const allFull = topics.length > 0 && topics.every((t) => overallState(selected, t) === "all");
  let summary: string;
  if (selected.length === 0) summary = "Select topics…";
  else if (allFull) summary = "All topics";
  else if (selected.length === 1) {
    const s = selected[0];
    summary = s.subs.length === 0 ? s.overall : `${s.overall} (${s.subs.length})`;
  } else summary = `${selected.length} topics selected`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-base/70 px-3.5 py-2.5 text-sm outline-none transition-colors hover:border-mint/40 focus:border-mint/60"
      >
        <span className={selected.length ? "text-ink" : "text-ink-faint"}>{summary}</span>
        <IconChevronDown size={16} className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-xl border border-line bg-raised shadow-[0_20px_50px_-18px_rgba(0,0,0,0.9)]">
          <div className="max-h-80 overflow-y-auto p-1.5">
            {/* presets */}
            <button
              type="button"
              onClick={() => setGroup(topics, !groupFull(topics))}
              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-mint transition-colors hover:bg-base/70"
            >
              <Checkbox state={groupFull(topics) ? "all" : "none"} />
              All topics
            </button>
            {units.map((u) => {
              const group = topics.filter((t) => t.unit === u);
              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setGroup(group, !groupFull(group))}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-mint transition-colors hover:bg-base/70"
                >
                  <Checkbox state={groupFull(group) ? "all" : "none"} />
                  All Unit {u} topics
                </button>
              );
            })}

            <div className="my-1.5 h-px bg-line/70" />

            {/* topics + sub-topics */}
            {topics.map((t) => {
              const state = overallState(selected, t);
              const isOpen = expanded.has(t.overall);
              return (
                <div key={t.overall}>
                  <div className="flex items-center rounded-lg transition-colors hover:bg-base/70">
                    <button
                      type="button"
                      onClick={() => toggleOverall(t)}
                      className="flex flex-1 items-center gap-3 px-2.5 py-2 text-left text-sm text-ink"
                    >
                      <Checkbox state={state} />
                      <span className="flex-1">{t.overall}</span>
                      {state === "some" && (
                        <span className="font-mono text-[0.66rem] text-mint">
                          {find(selected, t.overall)?.subs.length}/{t.subs.length}
                        </span>
                      )}
                      {t.unit && <span className="font-mono text-[0.66rem] text-ink-faint">Unit {t.unit}</span>}
                    </button>
                    {t.subs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => expand(t.overall)}
                        className="mr-1 flex h-8 w-8 items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-raised hover:text-ink"
                        aria-label={isOpen ? "Collapse" : "Expand"}
                      >
                        <IconChevronDown size={15} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {isOpen && t.subs.length > 0 && (
                    <div className="mb-1 ml-5 border-l border-line/60 pl-2">
                      {t.subs.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => toggleSub(t, sub)}
                          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-1.5 text-left text-[0.82rem] text-ink-dim transition-colors hover:bg-base/70"
                        >
                          <Checkbox state={subSelected(selected, t, sub) ? "all" : "none"} />
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((s) => (
            <span
              key={s.overall}
              className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-xs text-ink"
            >
              {s.overall}
              {s.subs.length > 0 && <span className="font-mono text-[0.66rem] text-mint">·{s.subs.length}</span>}
              <button
                type="button"
                onClick={() => onChange(selected.filter((x) => x.overall !== s.overall))}
                className="text-ink-faint transition-colors hover:text-amber"
                aria-label={`Remove ${s.overall}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
