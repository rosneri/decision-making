"use client";
import { useState } from "react";
import { z } from "zod";

const LENSES = ["rational", "organizational", "political"] as const;
type Lens = (typeof LENSES)[number];

export const meta = {
  id: "allison_lenses",
  name: "Allison's Three Lenses",
  category: "Diplomatic & geopolitical",
  blurb: "Rational actor, organizational process, governmental politics — all happening at once.",
} as const;

export const schema = z.object({
  framework: z.literal("allison_lenses"),
  category: z.string(),
  title: z.string(),
  lenses: z.object({
    rational: z.object({ explanation: z.string(), weight: z.number().int().min(1).max(5) }),
    organizational: z.object({ explanation: z.string(), weight: z.number().int().min(1).max(5) }),
    political: z.object({ explanation: z.string(), weight: z.number().int().min(1).max(5) }),
  }),
  recommendation: z.string(),
});
export type AllisonLenses = z.infer<typeof schema>;

export const sample: AllisonLenses = {
  framework: "allison_lenses",
  category: meta.category,
  title: "Why did the country impose the export ban?",
  lenses: {
    rational: { explanation: "leverage in trade talks", weight: 3 },
    organizational: { explanation: "ministry's standard playbook", weight: 5 },
    political: { explanation: "hardliners won the internal fight", weight: 4 },
  },
  recommendation: "Lens II (organizational) is loudest. Their next move likely follows the same playbook — anticipate it.",
};

const META: Record<Lens, { roman: string; label: string; q: string }> = {
  rational: { roman: "I", label: "Rational Actor", q: "what's the strategic gain?" },
  organizational: { roman: "II", label: "Organizational", q: "what bureaucratic routine?" },
  political: { roman: "III", label: "Governmental Politics", q: "who won the internal fight?" },
};

export function View({ data, onUpdate }: { data: AllisonLenses; onUpdate?: (d: AllisonLenses) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: AllisonLenses) => { setS(n); onUpdate?.(n); };
  const set = (l: Lens, patch: Partial<AllisonLenses["lenses"][Lens]>) =>
    upd({ ...s, lenses: { ...s.lenses, [l]: { ...s.lenses[l]!, ...patch } } });

  const loudest = LENSES.reduce((w, l) => (s.lenses[l]!.weight > s.lenses[w]!.weight ? l : w), LENSES[0]);

  return (
    <div className="border border-ink bg-paper divide-y divide-rule">
      {LENSES.map((l) => {
        const lens = s.lenses[l]!;
        const isLoud = l === loudest;
        return (
          <div key={l} data-testid={`allison-${l}`}
            className={`p-4 grid grid-cols-[60px_1fr_140px] gap-3 items-center ${isLoud ? "bg-vermilion/5" : ""}`}>
            <span className={`font-serif font-medium text-[28px] ${isLoud ? "text-vermilion" : "text-ink"}`}>{META[l].roman}.</span>
            <div>
              <div className="font-serif text-[16px] font-medium text-ink">{META[l].label}</div>
              <div className="font-serif italic text-[12px] text-ink-muted">{META[l].q}</div>
              <input value={lens.explanation} onChange={(e) => set(l, { explanation: e.target.value })}
                className={`block w-full mt-1 font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion ${isLoud ? "text-vermilion" : "text-ink"}`} />
            </div>
            <div>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Weight</span>
              <input type="range" min={1} max={5} value={lens.weight}
                onChange={(e) => set(l, { weight: Number(e.target.value) })}
                data-testid={`allison-${l}-weight`}
                aria-label={`weight ${l}`} className="block w-full" />
            </div>
          </div>
        );
      })}
      <div className="p-4 bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Loudest lens</span>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="allison-loudest">{META[loudest].label}</span>
      </div>
    </div>
  );
}
