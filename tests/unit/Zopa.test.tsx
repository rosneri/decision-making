import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/zopa";
import { zopa } from "@/frameworks/zopa/data";

describe("<Zopa />", () => {
  it("computes overlap when buyer max >= seller min", () => {
    expect(zopa(sample).exists).toBe(true);
  });

  it("renders ZOPA zone bar", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("zopa-zone")).toBeInTheDocument();
  });

  it("reports no deal when buyer max < seller min", () => {
    const noDeal = { ...sample, buyer: { ...sample.buyer, walkaway: 1_500_000 } };
    expect(zopa(noDeal).exists).toBe(false);
  });
});
