"use client";

import { useState } from "react";
import type { Swot } from "@/lib/schemas";

const QUADS = [
  {
    key: "strengths",
    label: "Strengths",
    sub: "Internal · Positive",
    color:
      "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-900",
  },
  {
    key: "weaknesses",
    label: "Weaknesses",
    sub: "Internal · Negative",
    color: "bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900",
  },
  {
    key: "opportunities",
    label: "Opportunities",
    sub: "External · Positive",
    color: "bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-900",
  },
  {
    key: "threats",
    label: "Threats",
    sub: "External · Negative",
    color:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-900",
  },
] as const;

export function SwotView({ data }: { data: Swot }) {
  const [state, setState] = useState(data);

  const update = (key: (typeof QUADS)[number]["key"], i: number, v: string) => {
    setState((s) => ({
      ...s,
      [key]: s[key].map((item, idx) => (idx === i ? v : item)),
    }));
  };

  const add = (key: (typeof QUADS)[number]["key"]) => {
    setState((s) => ({ ...s, [key]: [...s[key], ""] }));
  };

  const remove = (key: (typeof QUADS)[number]["key"], i: number) => {
    setState((s) => ({ ...s, [key]: s[key].filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{state.title}</h2>
        <p className="text-sm text-neutral-500 mt-1">
          SWOT Analysis — edit, add, or remove items in each quadrant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADS.map((q) => (
          <div key={q.key} className={`rounded-lg border p-4 ${q.color}`}>
            <div className="flex items-baseline justify-between mb-3">
              <div className="font-semibold">{q.label}</div>
              <div className="text-xs text-neutral-500">{q.sub}</div>
            </div>
            <ul className="space-y-2">
              {state[q.key].map((item, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <input
                    value={item}
                    onChange={(e) => update(q.key, i, e.target.value)}
                    className="flex-1 text-sm bg-white/70 dark:bg-black/30 rounded px-2 py-1 border border-neutral-200 dark:border-neutral-800"
                  />
                  <button
                    onClick={() => remove(q.key, i)}
                    className="text-xs text-neutral-500 hover:text-rose-600"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => add(q.key)}
              className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 hover:underline"
            >
              + add item
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
