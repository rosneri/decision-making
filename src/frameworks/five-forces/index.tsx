"use client";
import { useState } from "react";
import { z } from "zod";

const FORCES = ["rivalry", "newEntrants", "suppliers", "buyers", "substitutes"] as const;
type Force = (typeof FORCES)[number];

export const meta = {
  id: "five_forces",
  name: "Porter's Five Forces",
  category: "Strategy & business",
  blurb: "Five pressures decide how attractive a market really is.",
} as const;

export const schema = z.object({
  framework: z.literal("five_forces"),
  category: z.string(),
  title: z.string(),
  forces: z.record(z.enum(FORCES), z.object({
    level: z.number().int().min(1).max(5),
    note: z.string(),
  })),
  recommendation: z.string(),
});
export type FiveForces = z.infer<typeof schema>;

export const sample: FiveForces = {
  framework: "five_forces",
  category: meta.category,
  title: "How attractive is the streaming-audio market?",
  forces: {
    rivalry: { level: 4, note: "3 majors, price war forming" },
    newEntrants: { level: 2, note: "high content cost, label deals scarce" },
    suppliers: { level: 3, note: "labels concentrated, demand royalties" },
    buyers: { level: 4, note: "low switching cost between apps" },
    substitutes: { level: 2, note: "podcasts, YouTube, radio" },
  },
  recommendation: "Buyers are your real risk. Lock in with playlists and social — not features competitors will clone.",
};

const FORCE_META: Record<Force, { label: string }> = {
  rivalry: { label: "Industry rivalry" },
  newEntrants: { label: "New entrants" },
  suppliers: { label: "Supplier power" },
  buyers: { label: "Buyer power" },
  substitutes: { label: "Substitutes" },
};

export function View({ data, onUpdate }: { data: FiveForces; onUpdate?: (d: FiveForces) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FiveForces) => { setS(n); onUpdate?.(n); };
  const set = (f: Force, patch: Partial<FiveForces["forces"][Force]>) =>
    upd({ ...s, forces: { ...s.forces, [f]: { ...s.forces[f]!, ...patch } } });

  return (
    <div className="border border-ink bg-paper p-6">
      <ul className="space-y-3">
        {FORCES.map((f) => {
          const force = s.forces[f]!;
          const isCenter = f === "rivalry";
          return (
            <li key={f} data-testid={`force-${f}`}
              className={`flex items-center gap-4 p-3 border ${isCenter ? "border-vermilion bg-vermilion/5" : "border-rule"}`}>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium w-40 ${isCenter ? "text-vermilion" : "text-ink-muted"}`}>
                {FORCE_META[f].label}
              </span>
              <input value={force.note} onChange={(e) => set(f, { note: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none font-serif italic text-[14px] text-ink" />
              <div className="flex gap-1" role="group" aria-label={`level for ${f}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => set(f, { level: n })}
                    aria-label={`set level ${n}`}
                    className={`w-3 h-3 rounded-full border ${n <= force.level ? (isCenter ? "bg-vermilion border-vermilion" : "bg-ink border-ink") : (isCenter ? "border-vermilion" : "border-rule")}`} />
                ))}
              </div>
              <span className="font-code text-[13px] text-ink-muted w-6 text-right">{force.level}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
