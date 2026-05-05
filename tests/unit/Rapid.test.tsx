import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/rapid";

describe("<Rapid />", () => {
  it("renders one row per assignment", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.assignments.length; i++) {
      expect(screen.getByTestId(`rapid-row-${i}`)).toBeInTheDocument();
    }
  });

  it("warns when there isn't exactly one Decide", () => {
    const noDecide = {
      ...sample,
      assignments: sample.assignments.map((a) => a.role === "decide" ? { ...a, role: "input" as const } : a),
    };
    render(<View data={noDecide} />);
    expect(screen.getByTestId("rapid-warning")).toHaveTextContent(/exactly one Decide/i);
  });

  it("changing the role updates onUpdate", () => {
    const onUpdate = (() => {
      let last: typeof sample | null = null;
      return Object.assign((d: typeof sample) => { last = d; }, { get: () => last });
    })();
    render(<View data={sample} onUpdate={onUpdate} />);
    const select = screen.getByLabelText(/role for row 0/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "decide" } });
    expect(onUpdate.get()?.assignments[0]?.role).toBe("decide");
  });
});
