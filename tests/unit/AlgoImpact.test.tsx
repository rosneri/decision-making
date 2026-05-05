import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/algo-impact";

describe("<AlgoImpact />", () => {
  it("blocks shipping when an open severity-4+ risk exists", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("ai-verdict")).toHaveTextContent(/do not ship/i);
  });

  it("closing all severe open risks unblocks shipping", () => {
    render(<View data={sample} />);
    // Close gender (i=0), race (i=1), explainability (i=3)
    fireEvent.click(screen.getByTestId("ai-status-0"));
    fireEvent.click(screen.getByTestId("ai-status-1"));
    fireEvent.click(screen.getByTestId("ai-status-3"));
    expect(screen.getByTestId("ai-verdict")).toHaveTextContent(/ok to ship/i);
  });
});
