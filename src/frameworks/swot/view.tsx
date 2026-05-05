"use client";

import { useFrameworkData } from "@/components/DecisionContext";
import type { Swot } from "./schema";

interface Props {
  data: Swot;
  onUpdate?: (d: Swot) => void;
}

type QuadKey = "strengths" | "weaknesses" | "opportunities" | "threats";

const QUADRANTS: { key: QuadKey; roman: string; name: string; gloss: string; cls: string; placeholder: string }[] = [
  { key: "strengths",     roman: "I",   name: "Strengths",     gloss: "internal · helpful", cls: "border-b border-b-rule border-r border-r-rule", placeholder: "What you bring." },
  { key: "weaknesses",    roman: "II",  name: "Weaknesses",    gloss: "internal · harmful", cls: "border-b border-b-rule",                        placeholder: "What you lack." },
  { key: "opportunities", roman: "III", name: "Opportunities", gloss: "external · helpful", cls: "border-r border-r-rule",                        placeholder: "What's open to you." },
  { key: "threats",       roman: "IV",  name: "Threats",       gloss: "external · harmful", cls: "",                                              placeholder: "What could go wrong." },
];

export function View({ data, onUpdate }: Props) {
  const [state, update] = useFrameworkData<Swot>(data, onUpdate);

  const updateItem = (key: QuadKey, idx: number, text: string) =>
    update({ ...state, [key]: state[key].map((t, i) => i === idx ? text : t) });

  const removeItem = (key: QuadKey, idx: number) =>
    update({ ...state, [key]: state[key].filter((_, i) => i !== idx) });

  const addItem = (key: QuadKey) =>
    update({ ...state, [key]: [...state[key], ""] });

  return (
    <div className="border border-ink grid grid-cols-2 bg-paper relative">
      {/* Horizontal axis labels (outside) */}
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 top-[-7px] left-1/2 -translate-x-1/2 whitespace-nowrap">Helpful</span>
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 bottom-[-7px] left-1/2 -translate-x-1/2 whitespace-nowrap">Harmful</span>
      {/* Internal / External labels on the horizontal center rule, rotated vertical */}
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90 origin-center whitespace-nowrap">Internal</span>
      <span className="absolute font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted bg-paper px-2 top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-90 origin-center whitespace-nowrap">External</span>

      {QUADRANTS.map((q) => (
        <div key={q.key} className={`p-6 min-h-[220px] flex flex-col ${q.cls}`}>
          <div className="flex items-baseline gap-2.5 mb-3">
            <span className="font-serif font-medium text-[22px] text-vermilion">{q.roman}.</span>
            <span className="font-code text-[11px] tracking-[0.22em] uppercase font-medium text-ink">{q.name}</span>
          </div>

          <ul className="list-none p-0 m-0 flex flex-col">
            {state[q.key].map((t, i) => (
              <li key={i} className={`flex gap-3 items-center py-2.5 ${i > 0 ? "border-t border-rule" : "pt-1"} group`}>
                <span className="font-code text-[11px] text-ink-muted flex-shrink-0 w-[18px]">
                  ·{String(i + 1).padStart(2, "0")}
                </span>
                <input
                  type="text"
                  value={t}
                  onChange={(e) => updateItem(q.key, i, e.target.value)}
                  placeholder={q.placeholder}
                  className="flex-1 min-w-0 border-none bg-transparent outline-none font-serif text-base text-ink border-b border-transparent focus:border-vermilion transition-colors duration-200 placeholder:text-ink-muted placeholder:italic py-0"
                />
                <button
                  onClick={() => removeItem(q.key, i)}
                  className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion px-1.5 transition-opacity duration-200 bg-transparent border-none cursor-pointer font-serif"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => addItem(q.key)}
            className="mt-auto pt-3 font-serif italic text-[13px] text-ink-muted hover:text-vermilion cursor-pointer self-start bg-transparent border-none transition-colors duration-200"
          >
            + add
          </button>
        </div>
      ))}
    </div>
  );
}
