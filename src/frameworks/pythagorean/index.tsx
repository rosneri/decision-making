"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "pythagorean",
  name: "Pythagorean Expectation",
  category: "Sports analytics",
  blurb: "Expected W% = PF² ÷ (PF² + PA²). Records far above this regress.",
} as const;

export const schema = z.object({
  framework: z.literal("pythagorean"),
  category: z.string(),
  title: z.string(),
  pointsFor: z.number().min(0),
  pointsAgainst: z.number().min(0),
  actualWins: z.number().int().min(0),
  actualLosses: z.number().int().min(0),
  exponent: z.number().min(1).max(5),
  recommendation: z.string(),
});
export type Pythagorean = z.infer<typeof schema>;

export const sample: Pythagorean = {
  framework: "pythagorean",
  category: meta.category,
  title: "Are the team's 12-4 record real, or lucky?",
  pointsFor: 412,
  pointsAgainst: 356,
  actualWins: 12,
  actualLosses: 4,
  exponent: 2,
  recommendation: "Expected ~9.6 wins; actual is 12. They're +2.4 above expectation — expect regression. Don't pay them like a 12-win team.",
};

export function View({ data, onUpdate }: { data: Pythagorean; onUpdate?: (d: Pythagorean) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Pythagorean) => { setS(n); onUpdate?.(n); };

  const games = s.actualWins + s.actualLosses || 1;
  const expWPct = s.pointsFor === 0 && s.pointsAgainst === 0
    ? 0.5
    : Math.pow(s.pointsFor, s.exponent) / (Math.pow(s.pointsFor, s.exponent) + Math.pow(s.pointsAgainst, s.exponent));
  const expWins = expWPct * games;
  const actualPct = s.actualWins / games;
  const luck = s.actualWins - expWins;

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 bg-paper-deep border-b border-rule font-code text-[12px] text-ink-muted">
        expected W% = PF<sup>{s.exponent}</sup> ÷ (PF<sup>{s.exponent}</sup> + PA<sup>{s.exponent}</sup>)
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {[
          { l: "Points for", k: "pointsFor" as const, v: s.pointsFor },
          { l: "Points against", k: "pointsAgainst" as const, v: s.pointsAgainst },
          { l: "Wins", k: "actualWins" as const, v: s.actualWins },
          { l: "Losses", k: "actualLosses" as const, v: s.actualLosses },
        ].map((f) => (
          <label key={f.k} className="p-3 block">
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{f.l}</span>
            <input type="number" min={0} value={f.v}
              onChange={(e) => upd({ ...s, [f.k]: Math.max(0, Number(e.target.value) || 0) })}
              data-testid={`pyth-${f.k}`}
              className="block w-full mt-1 font-serif font-medium text-[20px] bg-transparent border-b border-rule outline-none text-ink" />
          </label>
        ))}
      </div>
      <div className="p-4 border-t border-rule grid grid-cols-2 gap-4">
        <div>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Actual</span>
          <div className="font-serif font-medium text-[24px] text-ink mt-1">
            {s.actualWins} – {s.actualLosses} · .{(actualPct * 1000).toFixed(0).padStart(3, "0")}
          </div>
        </div>
        <div className="bg-vermilion/5 border-l border-vermilion pl-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Expected</span>
          <div className="font-serif font-medium text-[24px] text-vermilion mt-1" data-testid="pyth-expected">
            {expWins.toFixed(1)} – {(games - expWins).toFixed(1)} · .{(expWPct * 1000).toFixed(0).padStart(3, "0")}
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-rule font-code text-[11px] text-ink-muted text-center" data-testid="pyth-luck">
        luck = {luck > 0 ? "+" : ""}{luck.toFixed(1)} wins
      </div>
    </div>
  );
}
