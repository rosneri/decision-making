import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pareto";

describe("<Pareto />", () => {
  it("renders rows sorted by contribution", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("pareto-row-0")).toBeInTheDocument();
  });

  it("identifies vital few covering 80%", () => {
    render(<View data={sample} />);
    // billing(240)+imports(180) = 420/540 = 77.7% < 80% so vital = 3
    expect(screen.getByTestId("pareto-vital").textContent).toContain("3");
  });

  it("editing contribution fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("pareto-val-0"), { target: { value: "999" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].causes[0].contribution).toBe(999);
  });
});
