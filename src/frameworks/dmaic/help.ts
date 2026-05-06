import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "DMAIC (Six Sigma improvement cycle)",
  whatItIs:
    "A five-phase, data-driven structure for fixing an existing process. Define the problem, measure the baseline, analyze causes, improve with controlled experiments, and lock the gain with statistical process control.",
  howToUse: [
    "Define: scope tightly, name a sponsor, write a SMART goal.",
    "Measure: instrument the process; nothing improves what isn't measured.",
    "Analyze: don't jump to solutions. Find root causes (Pareto, fishbone, regression).",
    "Improve: test changes via DOE; only ship what moves the metric.",
    "Control: SPC chart with alarms — without Control the gain regresses.",
  ],
};
