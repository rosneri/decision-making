import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/harvard-negotiation";

describe("<HarvardNegotiation />", () => {
  it("renders all four sections with their items", () => {
    render(<View data={sample} />);
    for (const sec of ["positions", "interests", "options", "criteria"] as const) {
      const node = screen.getByTestId(`hn-${sec}`);
      for (const item of sample[sec]) {
        expect(within(node).getByDisplayValue(item)).toBeInTheDocument();
      }
    }
  });
});
