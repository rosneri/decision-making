import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/policy-cycle";

describe("<PolicyCycle />", () => {
  it("renders all five stages", () => {
    render(<View data={sample} />);
    for (const k of ["agenda", "formulation", "adoption", "implementation", "evaluation"]) {
      expect(screen.getByTestId(`pc-${k}`)).toBeInTheDocument();
    }
  });

  it("clicking a stage sets current", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.click(screen.getByTestId("pc-evaluation"));
    expect(onUpdate.mock.calls.at(-1)?.[0].current).toBe("evaluation");
  });
});
