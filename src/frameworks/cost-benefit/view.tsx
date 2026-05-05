"use client";

import { useState } from "react";
import type { CostBenefit } from "./schema";

interface Props {
  data: CostBenefit;
  onUpdate?: (d: CostBenefit) => void;
}

export function View({ data, onUpdate }: Props) {
  const [state, setState] = useState(data);
  const [newBen, setNewBen] = useState("");
  const [newBenW, setNewBenW] = useState(3);
  const [newCost, setNewCost] = useState("");
  const [newCostW, setNewCostW] = useState(3);

  const update = (next: CostBenefit) => {
    setState(next);
    onUpdate?.(next);
  };

  const benTotal  = state.benefits.reduce((s, x) => s + x.weight, 0);
  const costTotal = state.costs.reduce((s, x) => s + x.weight, 0);
  const diff = benTotal - costTotal;
  const tilt = Math.max(-10, Math.min(10, diff * 1.6));

  const verdict =
    Math.abs(diff) < 1 ? "Evenly weighted." :
    diff > 0 ? "The benefit side carries." :
               "The cost side carries.";

  const W = 720, H = 380;
  const beamY = 90, halfBeam = 240, cx = W / 2;
  const rad = (tilt * Math.PI) / 180;
  const leftX  = cx - halfBeam * Math.cos(rad);
  const leftY  = beamY + halfBeam * Math.sin(rad);
  const rightX = cx + halfBeam * Math.cos(rad);
  const rightY = beamY - halfBeam * Math.sin(rad);

  const updWeight = (side: "benefits" | "costs", idx: number, w: number) => {
    const list = [...state[side]];
    list[idx] = { ...list[idx]!, weight: Math.max(1, Math.min(9, Number(w) || 1)) };
    update({ ...state, [side]: list });
  };

  const remove = (side: "benefits" | "costs", idx: number) =>
    update({ ...state, [side]: state[side].filter((_, i) => i !== idx) });

  const addBenefit = () => {
    if (!newBen.trim()) return;
    update({ ...state, benefits: [...state.benefits, { text: newBen.trim(), weight: newBenW }] });
    setNewBen(""); setNewBenW(3);
  };

  const addCost = () => {
    if (!newCost.trim()) return;
    update({ ...state, costs: [...state.costs, { text: newCost.trim(), weight: newCostW }] });
    setNewCost(""); setNewCostW(3);
  };

  const onWeightDrag = (side: "benefits" | "costs", idx: number) => (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startV = state[side][idx]?.weight ?? 3;
    const move = (ev: MouseEvent) => {
      updWeight(side, idx, Math.round(startV + (startY - ev.clientY) / 16));
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const WEIGHTS = [1, 3, 5, 7, 9];

  return (
    <div className="relative pt-6">
      {/* Scale stage */}
      <div className="relative h-[380px] border-t-2 border-t-ink border-b border-b-ink bg-paper overflow-visible">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Ground */}
          <line x1="40" y1={H - 30} x2={W - 40} y2={H - 30} stroke="var(--rule)" strokeDasharray="2 4" strokeWidth="1" />
          {/* Stand */}
          <line x1={cx} y1={beamY} x2={cx} y2={H - 30} stroke="var(--ink)" strokeWidth="2" strokeLinecap="square" />
          <line x1={cx - 40} y1={H - 30} x2={cx + 40} y2={H - 30} stroke="var(--ink)" strokeWidth="2" strokeLinecap="square" />
          {/* Beam group — tilts */}
          <g style={{ transition: "transform 600ms cubic-bezier(0.2,0,0,1)", transform: `rotate(${tilt}deg)`, transformOrigin: `${cx}px ${beamY}px` }}>
            <line x1={cx - halfBeam} y1={beamY} x2={cx + halfBeam} y2={beamY} stroke="var(--ink)" strokeWidth="2" strokeLinecap="square" fill="none" />
            <line x1={cx - halfBeam} y1={beamY} x2={cx - halfBeam} y2={beamY + 40} stroke="var(--ink)" strokeWidth="1" strokeLinecap="square" fill="none" />
            <line x1={cx + halfBeam} y1={beamY} x2={cx + halfBeam} y2={beamY + 40} stroke="var(--ink)" strokeWidth="1" strokeLinecap="square" fill="none" />
            {/* Left pan */}
            <path
              d={`M ${cx - halfBeam - 110} ${beamY + 40} L ${cx - halfBeam + 110} ${beamY + 40} L ${cx - halfBeam + 90} ${beamY + 56} L ${cx - halfBeam - 90} ${beamY + 56} Z`}
              stroke="var(--ink)" fill="var(--paper-deep)" strokeWidth="1.5"
            />
            {/* Right pan */}
            <path
              d={`M ${cx + halfBeam - 110} ${beamY + 40} L ${cx + halfBeam + 110} ${beamY + 40} L ${cx + halfBeam + 90} ${beamY + 56} L ${cx + halfBeam - 90} ${beamY + 56} Z`}
              stroke="var(--ink)" fill="var(--paper-deep)" strokeWidth="1.5"
            />
          </g>
          {/* Pivot */}
          <circle cx={cx} cy={beamY} r="4" fill="var(--vermilion)" />
          {/* Labels */}
          <text x="60" y={H - 10} fill="var(--ink-muted)" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="9" letterSpacing="0.22em" textAnchor="start" style={{ textTransform: "uppercase" }}>Benefit</text>
          <text x={W - 60} y={H - 10} fill="var(--ink-muted)" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="9" letterSpacing="0.22em" textAnchor="end" style={{ textTransform: "uppercase" }}>Cost</text>
          <text x={cx} y={H - 10} fill="var(--vermilion)" fontFamily="var(--font-jetbrains-mono), monospace" fontSize="9" letterSpacing="0.22em" textAnchor="middle">
            {benTotal} ⟷ {costTotal}
          </text>
          <text x={cx} y="32" fill="var(--ink-muted)" fontFamily="var(--font-spectral), Georgia, serif" fontSize="13" fontStyle="italic" textAnchor="middle">{verdict}</text>
        </svg>

        {/* Benefit stack — left pan */}
        <div
          className="absolute w-60 flex flex-col-reverse gap-1 pointer-events-auto"
          style={{
            left: `calc(${(leftX / W) * 100}% - 120px)`,
            top:  `calc(${((leftY + 40) / H) * 100}% - 4px)`,
            transform: "translateY(-100%)",
            transition: "left 600ms cubic-bezier(0.2,0,0,1), top 600ms cubic-bezier(0.2,0,0,1)",
          }}
        >
          {state.benefits.map((b, i) => (
            <div key={`b${i}-${b.text}`} className="font-serif text-[13px] italic px-3 py-1.5 bg-paper border border-ink flex items-center gap-2.5 animate-stack-in">
              <input
                type="number" min="1" max="9"
                value={b.weight}
                onChange={(e) => updWeight("benefits", i, Number(e.target.value))}
                onMouseDown={onWeightDrag("benefits", i)}
                className="w-6 border-none bg-transparent font-code text-[11px] font-medium text-vermilion text-right outline-none cursor-ns-resize [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{b.text}</span>
              <button onClick={() => remove("benefits", i)} className="ml-auto text-ink-muted hover:text-vermilion px-1 font-serif text-sm">×</button>
            </div>
          ))}
        </div>

        {/* Cost stack — right pan */}
        <div
          className="absolute w-60 flex flex-col-reverse gap-1 pointer-events-auto"
          style={{
            left: `calc(${(rightX / W) * 100}% - 120px)`,
            top:  `calc(${((rightY + 40) / H) * 100}% - 4px)`,
            transform: "translateY(-100%)",
            transition: "left 600ms cubic-bezier(0.2,0,0,1), top 600ms cubic-bezier(0.2,0,0,1)",
          }}
        >
          {state.costs.map((c, i) => (
            <div key={`c${i}-${c.text}`} className="font-serif text-[13px] italic px-3 py-1.5 bg-paper border border-ink flex items-center gap-2.5 animate-stack-in">
              <input
                type="number" min="1" max="9"
                value={c.weight}
                onChange={(e) => updWeight("costs", i, Number(e.target.value))}
                onMouseDown={onWeightDrag("costs", i)}
                className="w-6 border-none bg-transparent font-code text-[11px] font-medium text-vermilion text-right outline-none cursor-ns-resize [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{c.text}</span>
              <button onClick={() => remove("costs", i)} className="ml-auto text-ink-muted hover:text-vermilion px-1 font-serif text-sm">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Add controls */}
      <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-rule">
        {/* Benefits column */}
        <div>
          <h4 className="font-code text-[11px] tracking-[0.22em] uppercase font-medium text-ink-muted mb-3">
            Benefit <span className="text-vermilion">— what you&apos;d gain</span>
          </h4>
          <div className="flex gap-2 border-t border-b border-rule py-2 items-center">
            <input
              type="text"
              placeholder="Add a benefit…"
              value={newBen}
              onChange={(e) => setNewBen(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addBenefit(); }}
              className="flex-1 border-none bg-transparent outline-none font-serif italic text-[15px] text-ink placeholder:text-ink-muted py-2"
            />
            <div className="flex gap-1">
              {WEIGHTS.map((w) => (
                <button
                  key={w}
                  onClick={() => setNewBenW(w)}
                  className={`font-code text-[11px] font-medium w-[22px] h-[22px] border rounded-sm p-0 transition-colors duration-150 ${
                    newBenW === w
                      ? "bg-vermilion text-paper border-vermilion"
                      : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <button
              onClick={addBenefit}
              className="font-serif text-sm font-medium px-3 py-1.5 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-150"
            >
              Add
            </button>
          </div>
        </div>

        {/* Costs column */}
        <div>
          <h4 className="font-code text-[11px] tracking-[0.22em] uppercase font-medium text-ink-muted mb-3">
            Cost <span className="text-vermilion">— what you&apos;d give up</span>
          </h4>
          <div className="flex gap-2 border-t border-b border-rule py-2 items-center">
            <input
              type="text"
              placeholder="Add a cost…"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addCost(); }}
              className="flex-1 border-none bg-transparent outline-none font-serif italic text-[15px] text-ink placeholder:text-ink-muted py-2"
            />
            <div className="flex gap-1">
              {WEIGHTS.map((w) => (
                <button
                  key={w}
                  onClick={() => setNewCostW(w)}
                  className={`font-code text-[11px] font-medium w-[22px] h-[22px] border rounded-sm p-0 transition-colors duration-150 ${
                    newCostW === w
                      ? "bg-vermilion text-paper border-vermilion"
                      : "border-rule text-ink-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
            <button
              onClick={addCost}
              className="font-serif text-sm font-medium px-3 py-1.5 rounded-sm border border-rule text-ink hover:border-ink transition-colors duration-150"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
