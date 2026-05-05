"use client";
import { useState } from "react";
import { z } from "zod";

const STAGES = ["empathize", "define", "ideate", "prototype", "test"] as const;
type Stage = (typeof STAGES)[number];

export const meta = {
  id: "design_thinking",
  name: "Design Thinking",
  category: "Innovation & creativity",
  blurb: "Empathize, Define, Ideate, Prototype, Test. Diverge then converge — and loop back.",
} as const;

export const schema = z.object({
  framework: z.literal("design_thinking"),
  category: z.string(),
  title: z.string(),
  notes: z.object({
    empathize: z.string(),
    define: z.string(),
    ideate: z.string(),
    prototype: z.string(),
    test: z.string(),
  }),
  current: z.enum(STAGES),
  recommendation: z.string(),
});
export type DesignThinking = z.infer<typeof schema>;

export const sample: DesignThinking = {
  framework: "design_thinking",
  category: meta.category,
  title: "Why aren't seniors using our banking app?",
  notes: {
    empathize: "5 home interviews; eyesight + screen contrast keep coming up",
    define: "seniors avoid the app because anything financial that's hard to read feels unsafe",
    ideate: "huge text, audio confirms, simple home, side-cards by need",
    prototype: "",
    test: "",
  },
  current: "ideate",
  recommendation: "You've ideated long enough. Build one tiny prototype — 'audio confirm' — and watch 5 seniors use it.",
};

const META: Record<Stage, { label: string }> = {
  empathize: { label: "Empathize" },
  define: { label: "Define" },
  ideate: { label: "Ideate" },
  prototype: { label: "Prototype" },
  test: { label: "Test" },
};

export function View({ data, onUpdate }: { data: DesignThinking; onUpdate?: (d: DesignThinking) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: DesignThinking) => { setS(n); onUpdate?.(n); };

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-5 divide-x divide-rule">
        {STAGES.map((k, i) => {
          const isCurrent = s.current === k;
          return (
            <button key={k} onClick={() => upd({ ...s, current: k })}
              data-testid={`dt-tab-${k}`}
              className={`p-4 text-left ${isCurrent ? "bg-vermilion/5" : ""}`}>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isCurrent ? "text-vermilion" : "text-ink-muted"}`}>
                0{i + 1}
              </span>
              <div className={`font-serif text-[15px] font-medium mt-1 ${isCurrent ? "text-vermilion" : "text-ink"}`}>{META[k].label}</div>
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{META[s.current].label} notes</span>
        <textarea value={s.notes[s.current] ?? ""}
          onChange={(e) => upd({ ...s, notes: { ...s.notes, [s.current]: e.target.value } })}
          data-testid="dt-current-notes"
          className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
          rows={4} />
      </div>
    </div>
  );
}
