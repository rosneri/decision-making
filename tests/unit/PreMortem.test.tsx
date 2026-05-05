import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pre-mortem";

describe("<PreMortem />", () => {
  it("flags risks where likelihood × impact ≥ 12", () => {
    render(<View data={sample} />);
    // sample[1] = 3*5 = 15 → danger
    expect(screen.getByTestId("risk-1-danger")).toBeInTheDocument();
    // sample[3] = 5*3 = 15 → danger
    expect(screen.getByTestId("risk-3-danger")).toBeInTheDocument();
  });

  it("dropping likelihood removes the danger flag", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("risk-1-likelihood"), { target: { value: "1" } });
    expect(screen.queryByTestId("risk-1-danger")).not.toBeInTheDocument();
  });
});
