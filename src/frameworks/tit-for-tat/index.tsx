"use client";
import { useState } from "react";
import { Card, MicroLabel, AddButton } from "@/components/ui";
import { meta, schema, sample, type TitForTat, strategy } from "./data";
export { meta, schema, sample };
export type { TitForTat };

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
    <Card>
      <div className="p-4 border-b border-rule">
        <MicroLabel>10 rounds · C = cooperate · D = defect</MicroLabel>
      </div>
      <div className="p-4 space-y-3">
        <Row label="them (click to flip)" data-testid="tft-them" cells={them} onCell={toggle} />
        <Row label="you (mirror)" data-testid="tft-you" cells={you} readonly />
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <AddButton onClick={add}>+ round</AddButton>
        <AddButton onClick={() => s.rounds.length > 1 && rm(s.rounds.length - 1)}>− last round</AddButton>
      </div>
      <div className="grid grid-cols-2 border-t border-rule">
        <div className="p-4">
          <MicroLabel>Your score</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-ink mt-1" data-testid="tft-your-score">{yourPts}</div>
        </div>
        <div className="p-4 border-l border-rule">
          <MicroLabel>Their score</MicroLabel>
          <div className="font-serif font-medium text-[28px] text-ink mt-1">{theirPts}</div>
        </div>
      </div>
    </Card>
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
          <button
            key={i}
            onClick={() => onCell?.(i)}
            disabled={readonly}
            aria-label={`round ${i + 1}: ${c}`}
            className={`w-7 h-7 border ${c === "D" ? "bg-vermilion/15 border-vermilion text-vermilion" : "border-ink text-ink"} font-code text-[12px] font-medium ${readonly ? "cursor-default" : "cursor-pointer hover:bg-paper-deep"}`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
