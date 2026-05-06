import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/second-order";

describe("<SecondOrder />", () => {
  it("renders all three order columns", () => {
    render(<View data={sample} />);
    for (const t of ["order-1", "order-2", "order-3"]) {
      expect(screen.getByTestId(t)).toBeInTheDocument();
    }
  });
});
