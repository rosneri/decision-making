import { z } from "zod";


export const meta = {
  id: "five_whys",
  name: "5 Whys",
  category: "Operations & quality",
  blurb: "Drill from symptom to root cause by asking 'why' five times.",
} as const;

export const schema = z.object({
  framework: z.literal("five_whys"),
  category: z.string(),
  title: z.string(),
  problem: z.string(),
  whys: z.array(z.string()).min(1).max(8),
  recommendation: z.string(),
});
export type FiveWhys = z.infer<typeof schema>;

export const sample: FiveWhys = {
  framework: "five_whys",
  category: meta.category,
  title: "Why did production go down on Tuesday?",
  problem: "the deploy broke production",
  whys: [
    "the migration ran twice",
    "no idempotency check",
    "the script was copy-pasted from staging",
    "we have no shared deploy lib",
    "nobody owns infra tooling",
  ],
  recommendation: "Stop adding migration patches. Assign infra-tooling ownership and ship a shared deploy lib in Q3.",
};

export function getMetrics(d: FiveWhys) {
  const root = d.whys[d.whys.length - 1] ?? "—";
  return [
    { k: "Whys", v: String(d.whys.length) },
    { k: "Root", v: root.length > 40 ? root.slice(0, 40) + "…" : root },
  ];
}
