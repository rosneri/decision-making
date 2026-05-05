"use client";
import { useState } from "react";
import { Card, MicroLabel, BigNumber } from "@/components/ui";
import { meta, schema, sample, type Pythagorean } from "./data";
export { meta, schema, sample };
export type { Pythagorean };

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
    <Card>
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
            <MicroLabel>{f.l}</MicroLabel>
            <BigNumber
              value={f.v}
              onChange={(v) => upd({ ...s, [f.k]: Math.max(0, v) })}
              min={0}
              size="md"
              className="mt-1"
              testId={`pyth-${f.k}`}
            />
          </label>
        ))}
      </div>
      <div className="p-4 border-t border-rule grid grid-cols-2 gap-4">
        <div>
          <MicroLabel>Actual</MicroLabel>
          <div className="font-serif font-medium text-[24px] text-ink mt-1">
            {s.actualWins} – {s.actualLosses} · .{(actualPct * 1000).toFixed(0).padStart(3, "0")}
          </div>
        </div>
        <div className="bg-vermilion/5 border-l border-vermilion pl-4">
          <MicroLabel accent bold>Expected</MicroLabel>
          <div className="font-serif font-medium text-[24px] text-vermilion mt-1" data-testid="pyth-expected">
            {expWins.toFixed(1)} – {(games - expWins).toFixed(1)} · .{(expWPct * 1000).toFixed(0).padStart(3, "0")}
          </div>
        </div>
      </div>
      <div className="p-3 border-t border-rule font-code text-[11px] text-ink-muted text-center" data-testid="pyth-luck">
        luck = {luck > 0 ? "+" : ""}{luck.toFixed(1)} wins
      </div>
    </Card>
  );
}
