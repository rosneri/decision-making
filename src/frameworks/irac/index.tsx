"use client";
import { useState } from "react";
import { z } from "zod";

const BLOCKS = ["I", "R", "A", "C"] as const;
type Block = (typeof BLOCKS)[number];

export const meta = {
  id: "irac",
  name: "IRAC",
  category: "Legal & judicial",
  blurb: "Issue, Rule, Application, Conclusion — the legal-analysis spine.",
} as const;

export const schema = z.object({
  framework: z.literal("irac"),
  category: z.string(),
  title: z.string(),
  blocks: z.object({
    I: z.string(), R: z.string(), A: z.string(), C: z.string(),
  }),
  recommendation: z.string(),
});
export type Irac = z.infer<typeof schema>;

export const sample: Irac = {
  framework: "irac",
  category: meta.category,
  title: "Can my client take the competing job offer?",
  blocks: {
    I: "is the non-compete enforceable in CA?",
    R: "Cal. Bus. & Prof. § 16600 — void with narrow exceptions",
    A: "no sale-of-business exception · employee in CA · trade-secret carve-out NPE",
    C: "likely unenforceable · advise client to proceed",
  },
  recommendation: "Proceed with the new offer; document the carve-out limits and brief the client on trade-secret hygiene.",
};

const META: Record<Block, { word: string }> = {
  I: { word: "Issue" }, R: { word: "Rule" }, A: { word: "Application" }, C: { word: "Conclusion" },
};

export function View({ data, onUpdate }: { data: Irac; onUpdate?: (d: Irac) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Irac) => { setS(n); onUpdate?.(n); };
  const set = (k: Block, v: string) => upd({ ...s, blocks: { ...s.blocks, [k]: v } });

  return (
    <div className="border border-ink bg-paper divide-y divide-rule">
      {BLOCKS.map((k) => {
        const isApplication = k === "A";
        return (
          <div key={k} data-testid={`irac-${k}`}
            className={`flex items-stretch ${isApplication ? "bg-vermilion/5" : ""}`}>
            <div className={`w-14 grid place-items-center font-serif font-medium text-[28px] text-paper ${isApplication ? "bg-vermilion" : "bg-ink"}`}>
              {k}
            </div>
            <div className="flex-1 p-4">
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isApplication ? "text-vermilion" : "text-ink-muted"}`}>
                {META[k].word}
              </span>
              <textarea value={s.blocks[k]} onChange={(e) => set(k, e.target.value)}
                className="block w-full mt-1 font-serif text-[15px] bg-transparent border-none outline-none resize-none text-ink"
                rows={2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
