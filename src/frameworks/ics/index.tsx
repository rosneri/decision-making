"use client";
import { useState } from "react";
import { z } from "zod";

const SECTIONS = ["operations", "planning", "logistics", "finance"] as const;
type Section = (typeof SECTIONS)[number];

export const meta = {
  id: "ics",
  name: "Incident Command System",
  category: "Crisis & emergency",
  blurb: "Single Incident Commander; four sections; span of control 1:5.",
} as const;

export const schema = z.object({
  framework: z.literal("ics"),
  category: z.string(),
  title: z.string(),
  commander: z.string(),
  sections: z.record(z.enum(SECTIONS), z.object({
    chief: z.string(),
    note: z.string(),
  })),
  recommendation: z.string(),
});
export type Ics = z.infer<typeof schema>;

export const sample: Ics = {
  framework: "ics",
  category: meta.category,
  title: "Wildfire approaching three towns. Coordinate?",
  commander: "Chief Mendez · IC",
  sections: {
    operations: { chief: "Lt. Park", note: "the fight" },
    planning: { chief: "Capt. Yoon", note: "next 12h" },
    logistics: { chief: "Sgt. Roy", note: "people · stuff" },
    finance: { chief: "Garza", note: "the bill" },
  },
  recommendation: "All four section chiefs identified. Confirm operations divides A/B by quadrant before next briefing.",
};

const META: Record<Section, { label: string }> = {
  operations: { label: "Operations" },
  planning: { label: "Planning" },
  logistics: { label: "Logistics" },
  finance: { label: "Finance" },
};

export function View({ data, onUpdate }: { data: Ics; onUpdate?: (d: Ics) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ics) => { setS(n); onUpdate?.(n); };
  const set = (k: Section, patch: Partial<Ics["sections"][Section]>) =>
    upd({ ...s, sections: { ...s.sections, [k]: { ...s.sections[k]!, ...patch } } });

  const filled = SECTIONS.filter((k) => s.sections[k]?.chief.trim()).length;

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-vermilion bg-vermilion/5 text-center">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Incident commander · single point</span>
        <input value={s.commander} onChange={(e) => upd({ ...s, commander: e.target.value })}
          data-testid="ics-commander"
          className="block w-full mt-1 font-serif font-medium text-[20px] text-center bg-transparent border-none outline-none text-ink" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {SECTIONS.map((k) => {
          const sec = s.sections[k]!;
          const empty = !sec.chief.trim();
          return (
            <div key={k} data-testid={`ics-section-${k}`}
              className={`p-3 ${empty ? "bg-paper-deep" : ""}`}>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{META[k].label}</span>
              <input value={sec.chief} onChange={(e) => set(k, { chief: e.target.value })}
                placeholder="chief"
                className={`block w-full mt-1 font-serif font-medium text-[15px] bg-transparent border-b border-rule outline-none focus:border-vermilion ${empty ? "text-vermilion italic" : "text-ink"}`} />
              <input value={sec.note} onChange={(e) => set(k, { note: e.target.value })}
                className="block w-full mt-1 font-serif italic text-[12px] bg-transparent border-none outline-none text-ink-muted" />
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-rule font-code text-[11px] text-ink-muted text-center" data-testid="ics-completion">
        {filled} of {SECTIONS.length} sections staffed · span of control 1:{Math.max(1, filled)}
      </div>
    </div>
  );
}
