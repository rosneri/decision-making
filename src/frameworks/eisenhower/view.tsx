"use client";

import { useState } from "react";
import { QuadrantBoard, InlineText, RemoveButton, AddButton, type Quadrant } from "@/components/ui";
import type { Eisenhower } from "./schema";

interface Props {
  data: Eisenhower;
  onUpdate?: (d: Eisenhower) => void;
}

type Task = Eisenhower["tasks"][number];

interface EQuadrant extends Quadrant {
  urgent: boolean;
  important: boolean;
}

const QUADRANTS: EQuadrant[] = [
  { key: "do",       roman: "I",   label: "Do First",  sub: "urgent · important",     urgent: true,  important: true,  position: 0, placeholder: "What can't wait." },
  { key: "schedule", roman: "II",  label: "Schedule",  sub: "important · not urgent", urgent: false, important: true,  position: 1, placeholder: "What deserves time." },
  { key: "delegate", roman: "III", label: "Delegate",  sub: "urgent · not important", urgent: true,  important: false, position: 2, placeholder: "What someone else can do." },
  { key: "delete",   roman: "IV",  label: "Eliminate", sub: "neither",                urgent: false, important: false, position: 3, placeholder: "What to drop." },
];

export function View({ data, onUpdate }: Props) {
  const [state, setState] = useState(data);

  const update = (next: Eisenhower) => {
    setState(next);
    onUpdate?.(next);
  };

  const updateTask = (idx: number, patch: Partial<Task>) =>
    update({ ...state, tasks: state.tasks.map((t, i) => (i === idx ? { ...t, ...patch } : t)) });

  const removeTask = (idx: number) =>
    update({ ...state, tasks: state.tasks.filter((_, i) => i !== idx) });

  const addTask = (urgent: boolean, important: boolean) =>
    update({ ...state, tasks: [...state.tasks, { text: "", urgent, important }] });

  const toggleClasses = (on: boolean) =>
    `font-code text-[10px] font-medium w-[20px] h-[20px] border rounded-sm p-0 transition-colors duration-150 ${
      on ? "bg-vermilion text-paper border-vermilion" : "border-rule text-ink-muted hover:border-ink hover:text-ink"
    }`;

  return (
    <QuadrantBoard
      axes={{ top: "Urgent", bottom: "Not Urgent", left: "Important", right: "Not Important" }}
      quadrants={QUADRANTS}
      renderBody={(q) => {
        const eq = q as EQuadrant;
        const items = state.tasks
          .map((t, i) => ({ t, i }))
          .filter(({ t }) => t.urgent === eq.urgent && t.important === eq.important);
        return (
          <>
            <ul className="list-none p-0 m-0 flex flex-col">
              {items.map(({ t, i }, n) => (
                <li
                  key={i}
                  data-testid={`task-${i}`}
                  className={`flex gap-3 items-center py-2.5 ${n > 0 ? "border-t border-rule" : "pt-1"} group`}
                >
                  <span className="font-code text-[11px] text-ink-muted flex-shrink-0 w-[18px]">
                    ·{String(n + 1).padStart(2, "0")}
                  </span>
                  <InlineText
                    value={t.text}
                    onChange={(v) => updateTask(i, { text: v })}
                    {...(eq.placeholder ? { placeholder: eq.placeholder } : {})}
                  />
                  <span className="flex gap-1 shrink-0">
                    <button
                      onClick={() => updateTask(i, { urgent: !t.urgent })}
                      aria-label="toggle urgent"
                      aria-pressed={t.urgent}
                      className={toggleClasses(t.urgent)}
                    >
                      U
                    </button>
                    <button
                      onClick={() => updateTask(i, { important: !t.important })}
                      aria-label="toggle important"
                      aria-pressed={t.important}
                      className={toggleClasses(t.important)}
                    >
                      I
                    </button>
                    <RemoveButton onClick={() => removeTask(i)} ariaLabel="remove task" />
                  </span>
                </li>
              ))}
            </ul>
            <AddButton onClick={() => addTask(eq.urgent, eq.important)} className="mt-auto pt-3 self-start">
              + add
            </AddButton>
          </>
        );
      }}
    />
  );
}
