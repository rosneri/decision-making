"use client";

import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "eisenhower",
  name: "Eisenhower Matrix",
  category: "Speed & prioritization",
  blurb:
    "Sort tasks by urgent vs. important. Best when overwhelmed by many things to do.",
} as const;

export const schema = z.object({
  framework: z.literal("eisenhower"),
  category: z
    .string()
    .describe(
      "The category this framework belongs to, e.g. 'Speed & prioritization'"
    ),
  title: z.string(),
  tasks: z
    .array(
      z.object({
        text: z.string(),
        urgent: z.boolean(),
        important: z.boolean(),
      })
    )
    .min(3)
    .max(12),
  recommendation: z
    .string()
    .describe("Prioritized plan referencing each quadrant, 2-5 sentences"),
});

export type Eisenhower = z.infer<typeof schema>;

export const sample: Eisenhower = {
  framework: "eisenhower",
  category: meta.category,
  title: "This week's tasks",
  tasks: [
    { text: "Fix production bug", urgent: true, important: true },
    { text: "Plan Q3 roadmap", urgent: false, important: true },
    { text: "Reply to recruiter spam", urgent: true, important: false },
    { text: "Browse Twitter", urgent: false, important: false },
    { text: "1:1 with manager", urgent: false, important: true },
    { text: "Order office snacks", urgent: true, important: false },
  ],
  recommendation:
    "Do the production bug now, schedule deep work on the roadmap, delegate the snack run, and stop scrolling.",
};

const QUADRANTS = [
  {
    key: "do",
    label: "Do First",
    sub: "Urgent · Important",
    urgent: true,
    important: true,
    color: "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900",
  },
  {
    key: "schedule",
    label: "Schedule",
    sub: "Not Urgent · Important",
    urgent: false,
    important: true,
    color:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900",
  },
  {
    key: "delegate",
    label: "Delegate",
    sub: "Urgent · Not Important",
    urgent: true,
    important: false,
    color: "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-900",
  },
  {
    key: "delete",
    label: "Eliminate",
    sub: "Not Urgent · Not Important",
    urgent: false,
    important: false,
    color:
      "bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800",
  },
] as const;

export function View({ data }: { data: Eisenhower }) {
  const [tasks, setTasks] = useState(data.tasks);

  const toggle = (i: number, field: "urgent" | "important") => {
    setTasks((t) =>
      t.map((task, idx) =>
        idx === i ? { ...task, [field]: !task[field] } : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{data.title}</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Eisenhower Matrix — click a task to toggle urgent / important.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANTS.map((q) => {
          const items = tasks
            .map((t, i) => ({ t, i }))
            .filter(
              ({ t }) => t.urgent === q.urgent && t.important === q.important
            );
          return (
            <div
              key={q.key}
              className={`rounded-lg border p-4 min-h-[160px] ${q.color}`}
            >
              <div className="flex items-baseline justify-between mb-3">
                <div className="font-semibold">{q.label}</div>
                <div className="text-xs text-neutral-500">{q.sub}</div>
              </div>
              <ul className="space-y-2">
                {items.length === 0 && (
                  <li className="text-sm text-neutral-400 italic">No tasks</li>
                )}
                {items.map(({ t, i }) => (
                  <li
                    key={i}
                    className="text-sm bg-white/70 dark:bg-black/30 rounded px-3 py-2 flex items-start justify-between gap-2"
                  >
                    <span>{t.text}</span>
                    <span className="flex gap-1 shrink-0">
                      <button
                        onClick={() => toggle(i, "urgent")}
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          t.urgent
                            ? "bg-rose-500 text-white border-rose-500"
                            : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        U
                      </button>
                      <button
                        onClick={() => toggle(i, "important")}
                        className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          t.important
                            ? "bg-amber-500 text-white border-amber-500"
                            : "border-neutral-300 dark:border-neutral-700"
                        }`}
                      >
                        I
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
