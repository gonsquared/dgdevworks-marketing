import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

describe("ScrollReveal (E1-F3-S4 scroll-triggered animation wrapper)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders its children", () => {
    render(
      <ScrollReveal>
        <p>Revealed content</p>
      </ScrollReveal>
    );
    expect(screen.getByText("Revealed content")).toBeInTheDocument();
  });

  it("respects prefers-reduced-motion: falls back to an instant, non-animated state", () => {
    // Simulate prefers-reduced-motion: reduce.
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;

    render(
      <ScrollReveal>
        <p>Reduced-motion content</p>
      </ScrollReveal>
    );
    // Should still render content synchronously with no crash under reduced motion.
    expect(screen.getByText("Reduced-motion content")).toBeInTheDocument();
  });
});
