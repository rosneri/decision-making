import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pdca";

describe("<Pdca />", () => {
  it("renders all four phases", () => {
    render(<View data={sample} />);
    for (const k of ["P", "D", "C", "A"]) {
      expect(screen.getByTestId(`pdca-phase-${k}`)).toBeInTheDocument();
    }
  });

  it("advance from A wraps back to P and increments cycle", () => {
    render(<View data={{ ...sample, current: "A", cycleNumber: 3 }} />);
    fireEvent.click(screen.getByTestId("pdca-advance"));
    expect(screen.getByTestId("pdca-cycle-number")).toHaveTextContent("4");
  });
});
