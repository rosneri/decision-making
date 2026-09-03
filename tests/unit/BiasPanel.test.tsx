import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { BiasPanel } from "@/components/BiasPanel";
import type { BiasFinding } from "@/biases";

const findings: BiasFinding[] = [
  { id: "sunk_cost_fallacy", name: "Sunk cost fallacy", family: "stability", severity: 4, evidence: "two years in", effect: "keeps you going", counter: "cross it out" },
  { id: "optimism_bias", name: "Optimism bias", family: "action", severity: 2, evidence: "should be fine", effect: "hides the downside", counter: "write the bad case" },
];

describe("<BiasPanel />", () => {
  it("renders nothing without findings", () => {
    const { container } = render(<BiasPanel findings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one row per finding with evidence and summary", () => {
    render(<BiasPanel findings={findings} />);
    expect(screen.getByTestId("bias-finding-0")).toHaveTextContent("Sunk cost fallacy");
    expect(screen.getByTestId("bias-finding-0")).toHaveTextContent("two years in");
    expect(screen.getByTestId("bias-finding-1")).toHaveTextContent("Optimism bias");
    expect(screen.getByTestId("bias-panel-summary")).toHaveTextContent("2 in play");
    expect(screen.getByTestId("bias-panel-summary")).toHaveTextContent("high");
  });

  it("striking out a finding reports dismissed and updates the summary", () => {
    const onChange = vi.fn();
    render(<BiasPanel findings={findings} onChange={onChange} />);
    fireEvent.click(screen.getByTestId("bias-toggle-0"));
    const next = onChange.mock.calls[0]?.[0] as BiasFinding[];
    expect(next[0]?.dismissed).toBe(true);
    expect(next[1]?.dismissed).toBeUndefined();
  });

  it("offers an antidote framework that isn't the current one", () => {
    const onTry = vi.fn();
    render(<BiasPanel findings={findings} currentFramework="sunk_cost" onTryFramework={onTry} />);
    fireEvent.click(screen.getByTestId("bias-antidote-0"));
    const alt = onTry.mock.calls[0]?.[0] as { id: string; name: string };
    expect(alt.id).not.toBe("sunk_cost");
    expect(alt.id).toBe("inversion");
  });

  it("expands catalog detail on demand", () => {
    render(<BiasPanel findings={findings} />);
    fireEvent.click(screen.getAllByRole("button", { name: /More about this bias/ })[0]!);
    expect(screen.getByText(/Ask yourself:/)).toBeInTheDocument();
  });
});
