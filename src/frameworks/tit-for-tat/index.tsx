"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "tit_for_tat",
  name: "Tit-for-Tat",
  category: "Game theory & negotiation",
  blurb: "Cooperate first, mirror their move, forgive quickly. Wins repeated games.",
} as const;

export const schema = z.object({
  framework: z.literal("tit_for_tat"),
  category: z.string(),
  title: z.string(),
  rounds: z.array(z.object({
    them: z.enum(["C", "D"]),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type TitForTat = z.infer<typeof schema>;

export const sample: TitForTat = {
  framework: "tit_for_tat",
  category: meta.category,
  title: "My contractor underdelivered. Cooperate or punish?",
  rounds: [
    { them: "C" }, { them: "C" }, { them: "D" }, { them: "D" }, { them: "C" },
    { them: "C" }, { them: "C" }, { them: "D" }, { them: "D" }, { them: "D" },
  ],
  recommendation: "Mirror once, then re-offer cooperation. Persistent defection (3+ rounds) signals it's time to exit.",
};

function strategy(them: ("C" | "D")[]): ("C" | "D")[] {
  // start cooperating, then mirror their previous move
  return them.map((_, i) => i === 0 ? "C" : them[i - 1]!);
}

export function View({ data, onUpdate }: { data: TitForTat; onUpdate?: (d: TitForTat) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: TitForTat) => { setS(n); onUpdate?.(n); };
  const them = s.rounds.map((r) => r.them);
  const you = strategy(them);

  const toggle = (i: number) =>
    upd({ ...s, rounds: s.rounds.map((r, j) => j === i ? { them: r.them === "C" ? "D" : "C" } : r) });
  const add = () => upd({ ...s, rounds: [...s.rounds, { them: "C" }] });
  const rm = (i: number) => upd({ ...s, rounds: s.rounds.filter((_, j) => j !== i) });

  const score = (them: ("C" | "D")[], you: ("C" | "D")[]) => {
    let yourPts = 0, theirPts = 0;
    for (let i = 0; i < them.length; i++) {
      const yc = you[i] === "C", tc = them[i] === "C";
      if (yc && tc) { yourPts += 3; theirPts += 3; }
      else if (yc && !tc) { yourPts += 0; theirPts += 5; }
      else if (!yc && tc) { yourPts += 5; theirPts += 0; }
      else { yourPts += 1; theirPts += 1; }
    }
    return { yourPts, theirPts };
  };
  const { yourPts, theirPts } = score(them, you);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">10 rounds · C = cooperate · D = defect</span>
      </div>
      <div className="p-4 space-y-3">
        <Row label="them (click to flip)" data-testid="tft-them" cells={them} onCell={toggle} />
        <Row label="you (mirror)" data-testid="tft-you" cells={you} readonly />
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ round</button>
        <button onClick={() => s.rounds.length > 1 && rm(s.rounds.length - 1)}
          className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">− last round</button>
      </div>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Your score</span>
          <div className="font-serif font-medium text-[28px] text-ink mt-1" data-testid="tft-your-score">{yourPts}</div>
        </div>
        <div className="p-4 border-l border-rule">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Their score</span>
          <div className="font-serif font-medium text-[28px] text-ink mt-1">{theirPts}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, cells, onCell, readonly, ...rest }: {
  label: string;
  cells: ("C" | "D")[];
  onCell?: (i: number) => void;
  readonly?: boolean;
  [k: string]: unknown;
}) {
  return (
    <div className="flex items-center gap-2" {...rest}>
      <span className="font-code text-[11px] text-ink-muted w-32">{label}</span>
      <div className="flex gap-1 flex-wrap">
        {cells.map((c, i) => (
          <button key={i} onClick={() => onCell?.(i)} disabled={readonly} aria-label={`round ${i + 1}: ${c}`}
            className={`w-7 h-7 border ${c === "D" ? "bg-vermilion/15 border-vermilion text-vermilion" : "border-ink text-ink"} font-code text-[12px] font-medium ${readonly ? "cursor-default" : "cursor-pointer hover:bg-paper-deep"}`}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
