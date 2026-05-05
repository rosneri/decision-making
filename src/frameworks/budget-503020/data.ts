import { z } from "zod";


export const meta = {
  id: "budget_503020",
  name: "50/30/20 Budgeting",
  category: "Personal finance",
  blurb: "Needs · wants · save/debt — a starting heuristic, not a law.",
} as const;

export const schema = z.object({
  framework: z.literal("budget_503020"),
  category: z.string(),
  title: z.string(),
  income: z.number().min(0),
  actuals: z.object({
    needs: z.number().min(0),
    wants: z.number().min(0),
    save: z.number().min(0),
  }),
  recommendation: z.string(),
});
export type Budget = z.infer<typeof schema>;

export const sample: Budget = {
  framework: "budget_503020",
  category: meta.category,
  title: "Take-home is $4,800/mo. How do I split it?",
  income: 4800,
  actuals: { needs: 2688, wants: 1536, save: 576 },
  recommendation: "Wants are 32% (target 30%); save/debt is 12% (target 20%). Move ~$400/mo from wants to savings.",
};

export function getMetrics(d: Budget) {
  const inc = d.income || 1;
  const pct = (n: number) => `${Math.round((n / inc) * 100)}%`;
  return [
    { k: "Needs", v: pct(d.actuals.needs) },
    { k: "Wants", v: pct(d.actuals.wants) },
    { k: "Save", v: pct(d.actuals.save) },
  ];
}
