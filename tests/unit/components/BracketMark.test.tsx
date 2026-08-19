import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { BracketMark } from "@/components/layout/BracketMark";

describe("BracketMark primitive (BROADSHEET chrome)", () => {
  it("renders as a decorative, aria-hidden SVG that accepts a className for scale", () => {
    const { container } = render(<BracketMark className="h-4 w-6" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveClass("h-4", "w-6");
  });
});
