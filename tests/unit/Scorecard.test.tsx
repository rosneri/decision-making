import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/scorecard";

describe("<Scorecard />", () => {
  it("renders mission, outcomes, competencies", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("scorecard-mission")).toHaveValue(sample.mission);
    for (const o of sample.outcomes) expect(screen.getByDisplayValue(o)).toBeInTheDocument();
    for (const c of sample.competencies) expect(screen.getByDisplayValue(c)).toBeInTheDocument();
  });

  it("editing the mission fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("scorecard-mission"), { target: { value: "new mission" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].mission).toBe("new mission");
  });
});
