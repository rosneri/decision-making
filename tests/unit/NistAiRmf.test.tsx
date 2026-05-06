import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/nist-ai-rmf";

describe("<NistAiRmf />", () => {
  it("renders all four functions", () => {
    render(<View data={sample} />);
    for (const f of ["GOVERN", "MAP", "MEASURE", "MANAGE"]) {
      expect(screen.getByTestId(`rmf-fn-${f}`)).toBeInTheDocument();
    }
  });

  it("clicking a risk button updates state", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("rmf-risk-low"));
    expect(onUpdate.mock.calls.at(-1)?.[0].riskLevel).toBe("low");
  });
});
