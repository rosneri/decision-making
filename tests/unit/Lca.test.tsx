import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/lca";

describe("<Lca />", () => {
  it("identifies the largest stage as the hotspot", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("lca-hotspot")).toHaveTextContent("raw materials");
  });

  it("changing impact moves the hotspot", () => {
    render(<View data={sample} />);
    // Make 'use' (index 3) huge
    fireEvent.change(screen.getByTestId("lca-impact-3"), { target: { value: "999" } });
    expect(screen.getByTestId("lca-hotspot")).toHaveTextContent("use");
  });
});
