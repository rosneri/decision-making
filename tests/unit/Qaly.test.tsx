import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/qaly";

describe("<Qaly />", () => {
  it("flags interventions below the WTP threshold for funding", () => {
    render(<View data={sample} />);
    // 3 of 4 funded in default sample (MRI is too expensive)
    expect(screen.getByTestId("qaly-funded-count")).toHaveTextContent("3 of 4");
  });

  it("lowering the WTP threshold reduces the number of funded interventions", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("qaly-wtp"), { target: { value: "10" } });
    expect(screen.getByTestId("qaly-funded-count")).toHaveTextContent("1 of 4");
  });
});
