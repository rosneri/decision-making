import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/daci";

describe("<Daci />", () => {
  it("renders all four role blocks", () => {
    render(<View data={sample} />);
    for (const k of ["driver", "approver", "contributors", "informed"]) {
      expect(screen.getByTestId(`daci-${k}`)).toBeInTheDocument();
    }
  });

  it("renders driver and approver names", () => {
    render(<View data={sample} />);
    expect(screen.getByDisplayValue(sample.driver)).toBeInTheDocument();
    expect(screen.getByDisplayValue(sample.approver)).toBeInTheDocument();
  });
});
