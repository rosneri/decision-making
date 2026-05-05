"use client";

import { useState } from "react";
import type { DecisionMatrix } from "./schema";

interface Props {
  data: DecisionMatrix;
  onUpdate?: (d: DecisionMatrix) => void;
}

export function View({ data, onUpdate }: Props) {
  const [state, setState] = useState(data);

  const update = (next: DecisionMatrix) => {
    setState(next);
    onUpdate?.(next);
  };

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

  return (
    <div className="border-t-2 border-ink border-b border-b-ink">
      {/* Criteria & weights */}
      <div className="flex items-baseline gap-8 py-4 border-b border-rule flex-wrap">
        <span className="folio">Criteria · weights</span>
        {state.criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 font-serif text-sm">
            <span className="italic text-ink-muted">{c.name}</span>
            <input
              type="range" min="1" max="10" step="1"
              value={c.weight}
              onChange={(e) => setWeight(i, Number(e.target.value))}
              className="w-20 h-px appearance-none bg-ink-muted outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-vermilion [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-vermilion [&::-moz-range-thumb]:border-none"
            />
            <span className="font-code text-[13px] font-medium text-vermilion min-w-[28px] text-right">
              {Math.round((c.weight / totalW) * 100)}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted font-medium px-3.5 py-3.5 text-left border-b border-rule align-bottom">
              Option
            </th>
            {state.criteria.map((c, i) => (
              <th key={i} className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted font-medium px-3.5 py-3.5 text-center border-b border-rule align-bottom">
                {c.name}
                <span className="block mt-1 text-vermilion text-[11px] tracking-[0.06em]">
                  ·{Math.round((c.weight / totalW) * 100)}
                </span>
              </th>
            ))}
            <th className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted font-medium px-3.5 py-3.5 text-right border-b border-rule align-bottom w-24">
              Score
            </th>
            <th className="w-8 border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {state.options.map((o, oi) => {
            const isWinner = oi === winner;
            return (
              <tr key={oi}>
                <td className="font-serif text-[17px] px-3.5 py-[18px] border-b border-rule last:border-b-0 align-middle">
                  <div className="flex items-center gap-2">
                    {isWinner && <span className="text-vermilion text-sm flex-shrink-0">▸</span>}
                    <input
                      type="text"
                      value={o.name}
                      onChange={(e) => setName(oi, e.target.value)}
                      className="flex-1 min-w-0 italic border-none bg-transparent outline-none font-serif text-[17px] text-ink border-b border-transparent focus:border-vermilion transition-colors duration-200 py-0"
                    />
                  </div>
                </td>
                {o.scores.map((s, ci) => (
                  <td key={ci} className="px-3.5 py-[18px] border-b border-rule text-center align-middle">
                    <div className="inline-flex flex-col items-center gap-1">
                      <input
                        type="number" min="0" max="10"
                        value={s}
                        onChange={(e) => setScore(oi, ci, Number(e.target.value))}
                        onMouseDown={onScoreDrag(oi, ci)}
                        className={`font-code text-base font-medium text-center w-10 border-none bg-transparent outline-none py-0.5 border-b border-transparent hover:border-vermilion focus:border-vermilion transition-colors duration-200 cursor-ns-resize [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${isWinner ? "text-vermilion" : "text-ink"}`}
                        title="Drag up/down to adjust"
                      />
                      <div className="w-9 h-0.5 bg-rule relative">
                        <div
                          className={`score-bar-fill ${isWinner ? "bg-vermilion" : "bg-ink"}`}
                          style={{ transform: `scaleX(${s / 10})` }}
                        />
                      </div>
                    </div>
                  </td>
                ))}
                <td className={`px-3.5 py-[18px] border-b border-rule text-right font-code text-lg font-medium tracking-[-0.01em] w-24 align-middle ${isWinner ? "text-vermilion" : "text-ink"}`}>
                  {(totals[oi] ?? 0).toFixed(2)}
                </td>
                <td className="py-[18px] pr-1 text-right border-b border-rule align-middle">
                  {state.options.length > 2 && (
                    <button
                      onClick={() => removeOption(oi)}
                      className="text-ink-muted hover:text-vermilion text-base px-1 cursor-pointer"
                      title="Remove"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={addOption}
        className="font-serif italic text-sm text-ink-muted hover:text-vermilion cursor-pointer px-3.5 py-3.5 border-t border-rule inline-block transition-colors duration-200 bg-transparent border-x-0 border-b-0"
      >
        + another option
      </button>
    </div>
  );
}
