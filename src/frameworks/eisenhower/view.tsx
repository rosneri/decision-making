"use client";

import { useFrameworkData } from "@/components/DecisionContext";
import type { Eisenhower } from "./schema";

interface Props {
  data: Eisenhower;
  onUpdate?: (d: Eisenhower) => void;
}

type Task = Eisenhower["tasks"][number];

const QUADRANTS: {
  key: string;
  roman: string;
  label: string;
  sub: string;
  urgent: boolean;
  important: boolean;
  cls: string;
  placeholder: string;
}[] = [
  {
    key: "do",
    roman: "I",
    label: "Do First",
    sub: "urgent · important",
    urgent: true,
    important: true,
    cls: "border-b border-b-rule border-r border-r-rule",
    placeholder: "What can't wait.",
  },
  {
    key: "schedule",
    roman: "II",
    label: "Schedule",
    sub: "important · not urgent",
    urgent: false,
    important: true,
    cls: "border-b border-b-rule",
    placeholder: "What deserves time.",
  },
  {
    key: "delegate",
    roman: "III",
    label: "Delegate",
    sub: "urgent · not important",
    urgent: true,
    important: false,
    cls: "border-r border-r-rule",
    placeholder: "What someone else can do.",
  },
  {
    key: "delete",
    roman: "IV",
    label: "Eliminate",
    sub: "neither",
    urgent: false,
    important: false,
    cls: "",
    placeholder: "What to drop.",
  },
];

export function View({ data, onUpdate }: Props) {
  const [state, update] = useFrameworkData<Eisenhower>(data, onUpdate);

  const updateTask = (idx: number, patch: Partial<Task>) =>
    update({
      ...state,
      tasks: state.tasks.map((t, i) => (i === idx ? { ...t, ...patch } : t)),
    });

  const removeTask = (idx: number) =>
    update({ ...state, tasks: state.tasks.filter((_, i) => i !== idx) });

  const addTask = (urgent: boolean, important: boolean) =>
    update({
      ...state,
      tasks: [...state.tasks, { text: "", urgent, important }],
    });

  return (
    <div className="border border-ink grid grid-cols-2 bg-paper relative">
      {/* Axis labels */}
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 top-[-7px] left-1/2 -translate-x-1/2 whitespace-nowrap">
        Urgent
      </span>
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 bottom-[-7px] left-1/2 -translate-x-1/2 whitespace-nowrap">
        Not Urgent
      </span>
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap">
        Important
      </span>
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-90 origin-center whitespace-nowrap">
        Not Important
      </span>

      {QUADRANTS.map((q) => {
        const items = state.tasks
          .map((t, i) => ({ t, i }))
          .filter(
            ({ t }) => t.urgent === q.urgent && t.important === q.important
          );
        return (
          <div
            key={q.key}
            data-quadrant={q.key}
            className={`p-6 min-h-[220px] flex flex-col ${q.cls}`}
          >
            <div className="flex items-baseline gap-2.5 mb-3">
              <span className="font-serif font-medium text-[22px] text-vermilion">
                {q.roman}.
              </span>
              <span className="font-code text-[11px] tracking-[0.22em] uppercase font-medium text-ink">
                {q.label}
              </span>
              <span className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted ml-auto">
                {q.sub}
              </span>
            </div>

            <ul className="list-none p-0 m-0 flex flex-col">
              {items.map(({ t, i }, n) => (
                <li
                  key={i}
                  data-testid={`task-${i}`}
                  className={`flex gap-3 items-center py-2.5 ${
                    n > 0 ? "border-t border-rule" : "pt-1"
                  } group`}
                >
                  <span className="font-code text-[11px] text-ink-muted flex-shrink-0 w-[18px]">
                    ·{String(n + 1).padStart(2, "0")}
                  </span>
                  <input
                    type="text"
                    value={t.text}
                    onChange={(e) => updateTask(i, { text: e.target.value })}
                    placeholder={q.placeholder}
                    className="flex-1 min-w-0 border-none bg-transparent outline-none font-serif text-base text-ink border-b border-transparent focus:border-vermilion transition-colors duration-200 placeholder:text-ink-muted placeholder:italic py-0"
                  />
                  <span className="flex gap-1 shrink-0">
                    <button
                      onClick={() => updateTask(i, { urgent: !t.urgent })}
                      aria-label="toggle urgent"
                      aria-pressed={t.urgent}
                      className={`font-code text-[10px] font-medium w-[20px] h-[20px] border rounded-sm p-0 transition-colors duration-150 ${
                        t.urgent
                          ? "bg-vermilion text-paper border-vermilion"
                          : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                      }`}
                    >
                      U
                    </button>
                    <button
                      onClick={() => updateTask(i, { important: !t.important })}
                      aria-label="toggle important"
                      aria-pressed={t.important}
                      className={`font-code text-[10px] font-medium w-[20px] h-[20px] border rounded-sm p-0 transition-colors duration-150 ${
                        t.important
                          ? "bg-vermilion text-paper border-vermilion"
                          : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                      }`}
                    >
                      I
                    </button>
                    <button
                      onClick={() => removeTask(i)}
                      aria-label="remove task"
                      className="text-ink-muted hover:text-vermilion px-1.5 bg-transparent border-none cursor-pointer font-serif"
                    >
                      ×
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => addTask(q.urgent, q.important)}
              className="mt-auto pt-3 font-serif italic text-[13px] text-ink-muted hover:text-vermilion cursor-pointer self-start bg-transparent border-none transition-colors duration-200"
            >
              + add
            </button>
          </div>
        );
      })}
    </div>
  );
}
