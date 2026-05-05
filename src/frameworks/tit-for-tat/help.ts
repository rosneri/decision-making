import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
    whatItIs:
      "A repeated-game strategy: cooperate on the first move, then mirror whatever the other side did last. Forgive quickly after they cooperate again.",
    howToUse: [
      "Open with cooperation. Don't pre-emptively defect.",
      "On each later round, do what the other party did last round.",
      "If they go back to cooperating, forgive — return to cooperation immediately.",
      "Works best when the relationship is repeated and the other side can read your moves.",
    ],
  };
