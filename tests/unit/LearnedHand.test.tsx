import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/learned-hand";

describe("<LearnedHand />", () => {
  it("computes PL = P × L", () => {
    render(<View data={sample} />);
    // 0.06 * 300000 = 18000
    expect(screen.getByTestId("lh-pl")).toHaveTextContent("18,000");
  });

  it("flips verdict from negligent to safe when burden exceeds PL", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("lh-burden"), { target: { value: "30000" } });
    expect(screen.getByTestId("lh-comparator")).toHaveTextContent("≥");
    expect(screen.getByTestId("lh-verdict")).toHaveTextContent(/no negligence/i);
  });
});
