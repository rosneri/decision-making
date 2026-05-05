import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ria";

describe("<Ria />", () => {
  it("computes net benefit summing all stakeholder impacts", () => {
    const sum = sample.stakeholders.reduce((a, x) => a + x.netImpact, 0);
    render(<View data={sample} />);
    const net = screen.getByTestId("ria-net").textContent ?? "";
    expect(net.replace("+", "")).toBe(String(sum));
  });

  it("flags negative-impact + high-power stakeholders for mitigation", () => {
    render(<View data={sample} />);
    const text = screen.getByTestId("ria-mitigate").textContent ?? "";
    expect(text).toContain("small biz");
    expect(text).toContain("utilities");
  });
});
