import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ab-testing";
import { stats } from "@/frameworks/ab-testing/data";

describe("<AbTesting />", () => {
  it("renders both arms and verdict", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("ab-control")).toBeInTheDocument();
    expect(screen.getByTestId("ab-treatment")).toBeInTheDocument();
    expect(screen.getByTestId("ab-verdict")).toHaveTextContent("ship");
  });

  it("editing N fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("ab-treatment-n"), { target: { value: "9000" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].treatment.n).toBe(9000);
  });

  it("stats() flags non-significant when arms are equal", () => {
    const equal = { ...sample, treatment: { n: 8400, conversions: 168 } };
    expect(stats(equal).significant).toBe(false);
  });
});
