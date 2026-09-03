"use client";

import { useState } from "react";
import { FRAMEWORKS, type FrameworkId } from "@/frameworks";
import { BIAS_FAMILIES, getBias, summarizeBiases, type BiasFinding } from "@/biases";
import { DotMeter, MicroLabel } from "@/components/ui";
import type { FrameworkAlternative } from "./analyze-utils";

interface Props {
  findings: BiasFinding[];
  // Current framework id, so we don't offer it as an antidote to itself.
  currentFramework?: FrameworkId;
  // Called when the user marks a finding as (not) applicable.
  onChange?: (next: BiasFinding[]) => void;
  // Called when the user picks an antidote framework. Reuses the app's
  // "try a different angle" switch.
  onTryFramework?: (alt: FrameworkAlternative) => void;
}

const RISK_LABEL = { low: "low", medium: "worth a look", high: "high" } as const;

function familyName(family: string): string {
  return (BIAS_FAMILIES as Record<string, { name: string } | undefined>)[family]?.name ?? family;
}

// "Where your thinking may tilt": the cognitive biases the model spotted in
// the user's write-up, each with evidence, effect, a counter-move and the
// framework that structurally counters it. The user can strike out any
// finding that doesn't apply; the recommendation can then be regenerated.
export function BiasPanel({ findings, currentFramework, onChange, onTryFramework }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  if (findings.length === 0) return null;

  const summary = summarizeBiases(findings);
  const toggle = (id: string) => {
    if (!onChange) return;
    onChange(findings.map((f) => (f.id === id ? { ...f, dismissed: !f.dismissed } : f)));
  };

  return (
    <aside
      data-testid="bias-panel"
      className="border border-rule bg-paper rounded-sm mt-10 animate-arrive"
      style={{ boxShadow: "var(--shadow-letter)" }}
    >
      {/* Head */}
      <div className="px-4 sm:px-[52px] pt-8 sm:pt-10 pb-6 border-b border-rule">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div className="font-code text-[11px] tracking-[0.22em] uppercase text-vermilion">
            Where your thinking may tilt
          </div>
          <div className="font-code text-[11px] tracking-[0.22em] uppercase text-ink-muted" data-testid="bias-panel-summary">
            {summary.active.length} in play
            {summary.dismissed > 0 ? ` · ${summary.dismissed} set aside` : ""}
            {" · risk "}
            <span className={summary.risk === "high" ? "text-vermilion font-medium" : "text-ink"}>
              {RISK_LABEL[summary.risk]}
            </span>
          </div>
        </div>
        <p className="font-serif italic text-ink-muted text-[17px] leading-[28px] mt-3 max-w-[62ch]">
          Patterns in how you described this that could tip the call before the
          evidence does. The note below already takes them into account. Strike
          out any that don&rsquo;t fit.
        </p>
      </div>

      {/* Findings */}
      <ol className="list-none m-0 p-0">
        {findings.map((f, i) => {
          const def = getBias(f.id);
          const antidote = def?.antidotes.find((id) => id !== currentFramework);
          const antidoteMeta = antidote ? FRAMEWORKS.find((fw) => fw.id === antidote) : undefined;
          const open = expanded[f.id] ?? false;
          const off = Boolean(f.dismissed);

          return (
            <li
              key={f.id}
              data-testid={`bias-finding-${i}`}
              className={`px-4 sm:px-[52px] py-6 border-b border-rule last:border-b-0 transition-opacity duration-200 ${off ? "opacity-45" : ""} ${!off && f.severity >= 4 ? "bg-vermilion/5" : ""}`}
            >
              <div className="grid grid-cols-[28px_1fr] sm:grid-cols-[28px_1fr_auto] gap-x-4 gap-y-2 items-start">
                {/* Applies toggle */}
                <button
                  type="button"
                  onClick={() => toggle(f.id)}
                  data-testid={`bias-toggle-${i}`}
                  aria-pressed={!off}
                  aria-label={off ? `Mark ${f.name} as applicable` : `Set aside ${f.name}`}
                  className={`mt-1 w-5 h-5 border font-code text-[12px] flex items-center justify-center cursor-pointer ${off ? "border-rule bg-transparent text-transparent" : "border-vermilion bg-vermilion text-paper"}`}
                >
                  ✓
                </button>

                {/* Title block */}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className={`font-serif text-[21px] font-medium leading-tight ${off ? "line-through text-ink-muted" : "text-ink"}`}>
                      {f.name}
                    </span>
                    <MicroLabel>{familyName(f.family)}</MicroLabel>
                  </div>
                  <p className="font-serif italic text-[16px] leading-[26px] text-ink-muted mt-1.5 max-w-[62ch]">
                    &ldquo;{f.evidence}&rdquo;
                  </p>
                </div>

                {/* Severity */}
                <div className="col-start-2 sm:col-start-3 flex items-center gap-3 sm:mt-1.5">
                  <MicroLabel>Pull</MicroLabel>
                  <DotMeter value={f.severity} max={5} variant="bar" size="xs" accent={!off} ariaLabel={`severity ${f.severity} of 5`} />
                </div>

                {/* Body */}
                <div className="col-start-2 sm:col-span-2 mt-2 space-y-3 max-w-[66ch]">
                  <p className="font-serif text-[17px] leading-[28px] text-ink">{f.effect}</p>
                  <div className="border-l-2 border-vermilion pl-4">
                    <MicroLabel accent bold>Counter-move</MicroLabel>
                    <p className="font-serif text-[17px] leading-[28px] text-ink mt-1">{f.counter}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap pt-1 print:hidden">
                    {def && (
                      <button
                        type="button"
                        onClick={() => setExpanded((e) => ({ ...e, [f.id]: !open }))}
                        aria-expanded={open}
                        className="font-serif italic text-sm text-ink-muted hover:text-ink border-b border-transparent hover:border-ink bg-transparent p-0 cursor-pointer transition-colors duration-200"
                      >
                        {open ? "Less about this bias" : "More about this bias"}
                      </button>
                    )}
                    {antidoteMeta && onTryFramework && (
                      <button
                        type="button"
                        data-testid={`bias-antidote-${i}`}
                        onClick={() => onTryFramework({ id: antidoteMeta.id, name: antidoteMeta.name, reason: `counters ${f.name.toLowerCase()}` })}
                        className="font-serif text-sm text-ink hover:text-paper hover:bg-ink border border-rule hover:border-ink rounded-sm px-3 py-1.5 cursor-pointer transition-colors duration-200 bg-transparent"
                      >
                        Re-run with <span className="font-medium">{antidoteMeta.name}</span> →
                      </button>
                    )}
                  </div>

                  {open && def && (
                    <div className="border-t border-rule pt-4 mt-2 space-y-3 animate-stack-in">
                      <p className="font-serif text-[16px] leading-[26px] text-ink-muted">{def.description}</p>
                      <p className="font-serif italic text-[16px] leading-[26px] text-ink">Ask yourself: {def.question}</p>
                      <ul className="font-serif text-[15px] leading-[24px] text-ink-muted list-disc pl-5 space-y-1">
                        {def.counters.map((c, j) => <li key={j}>{c}</li>)}
                      </ul>
                      {def.source && <MicroLabel>{def.source}</MicroLabel>}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
