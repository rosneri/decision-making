import type { FrameworkHelp } from "../help-types";

export const help: FrameworkHelp = {
  expandedName: "DACI (Driver, Approver, Contributors, Informed)",
  whatItIs:
    "An Atlassian-popularized clarity model for group decisions. The point is that exactly one person drives, exactly one approves, and everyone else is named — there are no anonymous vetoes.",
  howToUse: [
    "Name the decision crisply, with a deadline.",
    "Pick exactly one Driver (runs the process) and one Approver (final say).",
    "List Contributors who must be consulted; their input is required, not their consent.",
    "List Informed parties who learn the outcome but don't shape it.",
    "If you can't fit everyone into one role, you don't have a decision — you have a meeting.",
  ],
};
