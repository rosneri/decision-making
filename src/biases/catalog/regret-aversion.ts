import { defineBias } from "../types";

export const bias = defineBias({
  id: "regret_aversion",
  name: "Regret aversion",
  family: "stability",
  blurb: "Choosing to avoid future regret rather than to get the best outcome.",
  description:
    "The anticipated pain of 'I should have known' pulls people toward the choice that will be easiest to defend if it goes wrong, which is often the conventional one. It also freezes choice altogether: not deciding feels like it can't be regretted. Applied well, imagining regret is a useful tool; applied by reflex, it favours safety over value.",
  cues: [
    "The conventional option preferred because it will be easier to justify",
    "Fear of 'what if I'm wrong' dominating expected outcomes",
    "Indecision defended as prudence",
  ],
  question: "Am I choosing the best option, or the most defensible one?",
  counters: [
    "Imagine both regrets: the one from acting and the one from not acting, at age eighty.",
    "Decide on expected value first, then ask whether the regret risk changes anything material.",
    "Remember that not choosing is a choice you can also regret.",
  ],
  antidotes: ["regret_min", "odyssey", "stoic"],
  source: "Loomes & Sugden 1982; Zeelenberg 1999",
});
