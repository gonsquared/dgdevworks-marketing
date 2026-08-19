import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PricingTable } from "@/components/PricingTable";
import { pricing } from "@/data/pricing";

describe("PricingTable (BROADSHEET, replaces PricingCard)", () => {
  it("renders every package as a row linking to its matching service, with name/price/timeframe visible", () => {
    render(<PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />);
    for (const pkg of pricing.packages) {
      const link = screen.getByRole("link", { name: new RegExp(pkg.name) });
      expect(link).toHaveAttribute("href", `/services/${pkg.slug}`);
      expect(screen.getByText(pkg.priceLabel)).toBeInTheDocument();
      expect(screen.getByText(pkg.timeframe)).toBeInTheDocument();
    }
  });

  it("marks the recommended row with a visible text label, not color alone (WCAG 1.4.1)", () => {
    render(<PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />);
    const recommendedLink = screen.getByRole("link", { name: /MVP \/ Product Build/ });
    expect(recommendedLink).toHaveTextContent("RECOMMENDED");
    const otherLink = screen.getByRole("link", { name: /Marketing \/ Landing Site/ });
    expect(otherLink).not.toHaveTextContent("RECOMMENDED");
  });

  it("gives each link a non-concatenated accessible name (name, recommendation, price, and timeframe separated)", () => {
    render(<PricingTable packages={pricing.packages} recommendedSlug="mvp-development" />);
    for (const pkg of pricing.packages) {
      const recommended = pkg.slug === "mvp-development";
      const expectedName = [pkg.name, recommended ? "recommended" : null, pkg.priceLabel, pkg.timeframe]
        .filter(Boolean)
        .join(", ");
      const link = screen.getByRole("link", { name: expectedName });
      expect(link).toHaveAttribute("href", `/services/${pkg.slug}`);
    }
  });
});
