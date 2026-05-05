import { z } from "zod";


export const ROLES = ["recommend", "agree", "perform", "input", "decide"] as const;
export type Role = (typeof ROLES)[number];

export const meta = {
  id: "rapid",
  name: "RAPID",
  category: "Group & organizational",
  blurb: "Recommend, Agree, Perform, Input, Decide — assign exactly one Decider.",
} as const;

export const schema = z.object({
  framework: z.literal("rapid"),
  category: z.string(),
  title: z.string(),
  assignments: z.array(z.object({
    role: z.enum(ROLES),
    who: z.string(),
    note: z.string(),
  })).min(5).max(20),
  recommendation: z.string(),
});
export type Rapid = z.infer<typeof schema>;

export const sample: Rapid = {
  framework: "rapid",
  category: meta.category,
  title: "Who actually decides on the pricing change?",
  assignments: [
    { role: "recommend", who: "Priya · PM", note: "drafts the proposal" },
    { role: "agree", who: "Legal", note: "must say yes" },
    { role: "perform", who: "Eng team", note: "ships it" },
    { role: "input", who: "Sales · CS", note: "consulted" },
    { role: "decide", who: "Maya · VP", note: "single accountable" },
  ],
  recommendation: "Maya owns the call. Get Legal's sign-off before announcing; Sales/CS provide context, not vetoes.",
};

export const META: Record<Role, { letter: string; word: string }> = {
  recommend: { letter: "R", word: "Recommend" },
  agree: { letter: "A", word: "Agree" },
  perform: { letter: "P", word: "Perform" },
  input: { letter: "I", word: "Input" },
  decide: { letter: "D", word: "Decide" },
};

export function getMetrics(d: Rapid) {
  const decider = d.assignments.find((a) => a.role === "decide");
  return [{ k: "Decider", v: decider?.who ?? "—" }];
}
