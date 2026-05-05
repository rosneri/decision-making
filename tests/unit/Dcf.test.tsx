import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/dcf";

describe("<Dcf />", () => {
  it("computes a positive sum PV greater than the asking price for the sample", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("dcf-verdict")).toHaveTextContent(/buy/i);
  });

  it("raising asking price flips verdict to pass", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("dcf-asking"), { target: { value: "9999" } });
    expect(screen.getByTestId("dcf-verdict")).toHaveTextContent(/pass/i);
  });
});
