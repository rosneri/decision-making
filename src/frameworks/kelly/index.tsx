"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "kelly",
  name: "Kelly Criterion",
  category: "Financial & investment",
  blurb: "Optimal bet sizing: f* = (bp − q) / b. Most pros bet half-Kelly to survive variance.",
} as const;

export const schema = z.object({
  framework: z.literal("kelly"),
  category: z.string(),
  title: z.string(),
  bankroll: z.number().min(0),
  oddsToOne: z.number().min(0),
  pWin: z.number().min(0).max(1),
  fraction: z.number().min(0).max(1),
  recommendation: z.string(),
});
export type Kelly = z.infer<typeof schema>;

export const sample: Kelly = {
  framework: "kelly",
  category: meta.category,
  title: "Friend offers a bet. How much do I wager?",
  bankroll: 10000,
  oddsToOne: 2,
  pWin: 0.55,
  fraction: 0.5,
  recommendation: "Full Kelly says ~32%. Cut to half-Kelly to absorb a losing streak. Wager ~$1,625.",
};

export function View({ data, onUpdate }: { data: Kelly; onUpdate?: (d: Kelly) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Kelly) => { setS(n); onUpdate?.(n); };

  const b = s.oddsToOne;
  const p = s.pWin;
  const q = 1 - p;
  const fStar = b > 0 ? Math.max(0, (b * p - q) / b) : 0;
  const wager = Math.max(0, s.bankroll * fStar * s.fraction);
  const pctOfBankroll = s.bankroll > 0 ? (wager / s.bankroll) * 100 : 0;

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 bg-paper-deep border-b border-rule font-code text-[12px] text-ink-muted">
        f* = (b·p − q) / b · b={b} · p={p.toFixed(2)} · q={q.toFixed(2)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {[
          { l: "Bankroll", v: s.bankroll, k: "bankroll" as const, min: 0 },
          { l: "Odds (b)", v: s.oddsToOne, k: "oddsToOne" as const, min: 0 },
          { l: "P(win)", v: s.pWin, k: "pWin" as const, min: 0, max: 1, step: 0.01 },
          { l: "Fraction", v: s.fraction, k: "fraction" as const, min: 0, max: 1, step: 0.01 },
        ].map((f) => (
          <label key={f.k} className="p-3 block">
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{f.l}</span>
            <input type="number" min={f.min} max={f.max} step={f.step} value={f.v}
              onChange={(e) => {
                const n = Number(e.target.value) || 0;
                const clamped = f.max != null ? Math.max(f.min!, Math.min(f.max, n)) : Math.max(f.min!, n);
                upd({ ...s, [f.k]: clamped });
              }}
              data-testid={`kelly-${f.k}`}
              className="block w-full mt-1 font-code text-[16px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
          </label>
        ))}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Bankroll · ${s.bankroll.toLocaleString()}</span>
        <div className="mt-3 h-12 border-2 border-ink flex" data-testid="kelly-bar">
          <div className="bg-vermilion grid place-items-center text-paper font-code text-[11px]"
            style={{ width: `${Math.min(100, pctOfBankroll)}%` }}>
            ${wager.toFixed(0)}
          </div>
          <div className="flex-1 grid place-items-center font-serif italic text-[12px] text-ink-muted">keep dry</div>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Full Kelly</span>
          <div className="font-serif font-medium text-[24px] text-ink mt-1" data-testid="kelly-full">{(fStar * 100).toFixed(1)}%</div>
        </div>
        <div className="p-4 bg-vermilion/5 border-l border-vermilion">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Wager ({(s.fraction * 100).toFixed(0)}% Kelly)</span>
          <div className="font-serif font-medium text-[24px] text-vermilion mt-1" data-testid="kelly-wager">${wager.toFixed(0)}</div>
        </div>
      </div>
    </div>
  );
}
