import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/four-percent";
import { fireMath } from "@/frameworks/four-percent/data";

describe("<FourPercent />", () => {
  it("computes target = spend / rate", () => {
    expect(fireMath(sample).target).toBe(60_000 / 0.04);
  });

  it("renders target dollars", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("fp-target")).toHaveTextContent("1,500,000");
  });

  it("years-to-FIRE shrinks with bigger contribution", () => {
    const baseline = fireMath(sample).years;
    const aggressive = fireMath({ ...sample, monthlyContribution: 5000 }).years;
    expect(aggressive).toBeLessThan(baseline);
  });
});
