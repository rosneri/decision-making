import { z } from "zod";


export const meta = {
  id: "ach",
  name: "Analysis of Competing Hypotheses",
  category: "Military & intelligence",
  blurb: "Score every piece of evidence against every hypothesis; favor the one with fewest contradictions.",
} as const;

export const schema = z.object({
  framework: z.literal("ach"),
  category: z.string(),
  title: z.string(),
  hypotheses: z.array(z.string()).min(2).max(8),
  evidence: z.array(z.object({
    text: z.string(),
    consistency: z.array(z.enum(["+", "-", "?"])),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Ach = z.infer<typeof schema>;

export const sample: Ach = {
  framework: "ach",
  category: meta.category,
  title: "Who breached the network last weekend?",
  hypotheses: ["state actor", "insider leak", "careless vendor", "random opportunist"],
  evidence: [
    { text: "log timestamps off-hours", consistency: ["+", "+", "-", "+"] },
    { text: "exfil to known C2", consistency: ["+", "-", "-", "-"] },
    { text: "no ransom demand", consistency: ["+", "+", "-", "-"] },
    { text: "credentials valid", consistency: ["+", "+", "+", "-"] },
    { text: "trace from Azerbaijan", consistency: ["+", "-", "-", "+"] },
  ],
  recommendation: "State actor has fewest inconsistencies. Treat as working hypothesis, not conclusion — keep collecting signals.",
};

export const cycle = (v: "+" | "-" | "?"): "+" | "-" | "?" => v === "+" ? "-" : v === "-" ? "?" : "+";
