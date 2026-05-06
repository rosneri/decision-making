"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type StrictScrutiny, TIERS, TIER_META } from "./data";
export { meta, schema, sample };
export type { StrictScrutiny };

const PRONG_LABEL: Record<keyof StrictScrutiny["prongs"], { label: string; q: string }> = {
  interest: { label: "1. Government interest", q: "compelling? important? legitimate?" },
  tailoring: { label: "2. Tailoring", q: "narrow / substantial / rational?" },
  leastRestrictive: { label: "3. Means", q: "least restrictive alternative available?" },
};

export function View({ data, onUpdate }: { data: StrictScrutiny; onUpdate?: (d: StrictScrutiny) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: StrictScrutiny) => { setS(n); onUpdate?.(n); };
  const ok = s.prongs.interest.satisfied && s.prongs.tailoring.satisfied && s.prongs.leastRestrictive.satisfied;

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Law / classification</MicroLabel>
        <InlineText value={s.law} onChange={(v) => upd({ ...s, law: v })} className="block w-full mt-1 font-serif text-[16px]" />
        <div className="mt-3 flex gap-2">
          {TIERS.map((t) => (
            <button
              key={t}
              data-testid={`scrutiny-tier-${t}`}
              onClick={() => upd({ ...s, tier: t })}
              className={`font-code text-[10px] tracking-[0.22em] uppercase px-3 py-1 border ${s.tier === t ? "border-vermilion text-vermilion bg-vermilion/5" : "border-rule text-ink-muted"}`}
            >
              {TIER_META[t].label}
            </button>
          ))}
        </div>
        <p className="mt-2 font-serif italic text-[12px] text-ink-muted">{TIER_META[s.tier].note}</p>
      </div>
      <div className="divide-y divide-rule">
        {(Object.keys(s.prongs) as Array<keyof typeof s.prongs>).map((k) => {
          const p = s.prongs[k];
          return (
            <div key={k} data-testid={`scrutiny-${k}`} className={`p-4 ${p.satisfied ? "" : "bg-vermilion/5"}`}>
              <div className="flex items-center justify-between">
                <MicroLabel bold>{PRONG_LABEL[k].label}</MicroLabel>
                <button
                  onClick={() => upd({ ...s, prongs: { ...s.prongs, [k]: { ...p, satisfied: !p.satisfied } } })}
                  data-testid={`scrutiny-toggle-${k}`}
                  className={`font-code text-[10px] tracking-[0.22em] uppercase px-3 py-1 border ${p.satisfied ? "border-rule text-ink-muted" : "border-vermilion text-vermilion bg-vermilion/10"}`}
                >
                  {p.satisfied ? "satisfied" : "fails"}
                </button>
              </div>
              <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{PRONG_LABEL[k].q}</p>
              <textarea
                value={p.analysis}
                onChange={(e) => upd({ ...s, prongs: { ...s.prongs, [k]: { ...p, analysis: e.target.value } } })}
                className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                rows={3}
              />
            </div>
          );
        })}
      </div>
      <div className="border-t border-rule p-4 text-center">
        <span data-testid="scrutiny-verdict" className={`font-serif font-medium text-[24px] ${ok ? "text-vermilion" : "text-ink-muted"}`}>
          {ok ? "Law survives" : "Law fails"}
        </span>
      </div>
    </Card>
  );
}
