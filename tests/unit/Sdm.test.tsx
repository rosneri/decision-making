import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/sdm";

describe("<Sdm />", () => {
  it("highlights the option with best survival × QoL ÷ burden", () => {
    render(<View data={sample} />);
    // Active surveillance: 99 * 5 / 1 = 495 (highest)
    expect(screen.getByTestId("sdm-best")).toHaveTextContent("Active surveillance");
  });
});
