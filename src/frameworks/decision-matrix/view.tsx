"use client";

import { useFrameworkData } from "@/components/DecisionContext";
import { Card, MicroLabel, Range, InlineText, InlineNumber, AddButton, RemoveButton } from "@/components/ui";
import type { DecisionMatrix } from "./schema";

interface Props {
  data: DecisionMatrix;
  onUpdate?: (d: DecisionMatrix) => void;
}

export function View({ data, onUpdate }: Props) {
  const [state, update] = useFrameworkData<DecisionMatrix>(data, onUpdate);

  const totalW = state.criteria.reduce((s, c) => s + c.weight, 0) || 1;
  const totals = state.options.map((o) =>
    o.scores.reduce((sum, s, j) => sum + s * ((state.criteria[j]?.weight ?? 0) / totalW), 0)
  );
  const winner = totals.reduce((bi, t, i) => (t > (totals[bi] ?? 0) ? i : bi), 0);

  const setWeight = (idx: number, w: number) =>
    update({ ...state, criteria: state.criteria.map((c, i) => i === idx ? { ...c, weight: Number(w) } : c) });

  const setScore = (oi: number, ci: number, v: number) => {
    const val = Math.max(0, Math.min(10, Number(v) || 0));
    update({ ...state, options: state.options.map((o, i) =>
      i === oi ? { ...o, scores: o.scores.map((s, j) => j === ci ? val : s) } : o
    )});
  };

  const setName = (oi: number, name: string) =>
    update({ ...state, options: state.options.map((o, i) => i === oi ? { ...o, name } : o) });

  const addOption = () =>
    update({ ...state, options: [...state.options, { name: "Another option", scores: state.criteria.map(() => 5) }] });

  const removeOption = (oi: number) => {
    if (state.options.length <= 2) return;
    update({ ...state, options: state.options.filter((_, i) => i !== oi) });
  };

  const onScoreDrag = (oi: number, ci: number) => (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startV = state.options[oi]?.scores[ci] ?? 5;
    const move = (ev: MouseEvent) =>
      setScore(oi, ci, Math.max(0, Math.min(10, Math.round(startV + (startY - ev.clientY) / 12))));
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const head = "px-3.5 py-3.5 border-b border-rule align-bottom";
  const cell = "px-3.5 py-[18px] border-b border-rule align-middle";

  return (
    <Card variant="ruled">
      <div className="flex items-baseline gap-8 py-4 border-b border-rule flex-wrap">
        <span className="folio">Criteria · weights</span>
        {state.criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 font-serif text-sm">
            <span className="italic text-ink-muted">{c.name}</span>
            <Range value={c.weight} onChange={(v) => setWeight(i, v)} min={1} max={10} step={1} className="w-20" ariaLabel={`${c.name} weight`} />
            <span className="font-code text-[13px] font-medium text-vermilion min-w-[28px] text-right">
              {Math.round((c.weight / totalW) * 100)}
            </span>
          </div>
        ))}
      </div>

      <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th className={`${head} text-left`}><MicroLabel bold>Option</MicroLabel></th>
            {state.criteria.map((c, i) => (
              <th key={i} className={`${head} text-center`}>
                <MicroLabel bold>{c.name}</MicroLabel>
                <span className="block mt-1 text-vermilion text-[11px] tracking-[0.06em]">
                  ·{Math.round((c.weight / totalW) * 100)}
                </span>
              </th>
            ))}
            <th className={`${head} text-right w-24`}><MicroLabel bold>Score</MicroLabel></th>
            <th className="w-8 border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {state.options.map((o, oi) => {
            const isWinner = oi === winner;
            return (
              <tr key={oi}>
                <td className={`font-serif text-[17px] ${cell} last:border-b-0`}>
                  <div className="flex items-center gap-2">
                    {isWinner && <span className="text-vermilion text-sm flex-shrink-0">▸</span>}
                    <InlineText value={o.name} onChange={(v) => setName(oi, v)} italic size="lg" />
                  </div>
                </td>
                {o.scores.map((sc, ci) => (
                  <td key={ci} className={`${cell} text-center`}>
                    <div className="inline-flex flex-col items-center gap-1">
                      <InlineNumber
                        value={sc}
                        onChange={(v) => setScore(oi, ci, v)}
                        onMouseDown={onScoreDrag(oi, ci)}
                        min={0}
                        max={10}
                        accent={isWinner}
                        size="lg"
                        width="w-10"
                        className="hover:border-b hover:border-vermilion focus:border-b focus:border-vermilion cursor-ns-resize py-0.5"
                        title="Drag up/down to adjust"
                      />
                      <div className="w-9 h-0.5 bg-rule relative">
                        <div
                          className={`score-bar-fill ${isWinner ? "bg-vermilion" : "bg-ink"}`}
                          style={{ transform: `scaleX(${sc / 10})` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
                <td className={`${cell} text-right font-code text-lg font-medium tracking-[-0.01em] w-24 ${isWinner ? "text-vermilion" : "text-ink"}`}>
                  {(totals[oi] ?? 0).toFixed(2)}
                </td>
                <td className="py-[18px] pr-1 text-right border-b border-rule align-middle">
                  {state.options.length > 2 && (
                    <RemoveButton onClick={() => removeOption(oi)} title="Remove" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AddButton onClick={addOption} className="px-3.5 py-3.5 border-t border-rule inline-block text-sm">
        + another option
      </AddButton>
    </Card>
  );
}
