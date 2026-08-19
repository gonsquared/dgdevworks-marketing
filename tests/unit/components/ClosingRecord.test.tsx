import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClosingRecord } from "@/components/ui/ClosingRecord";
import { business } from "@/data/business";

describe("ClosingRecord (BROADSHEET, replaces CTABand)", () => {
  it("renders the default heading/subheading and a tiered dual CTA", () => {
    render(<ClosingRecord />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Ready to talk about your project?");
    const bookLink = screen.getByRole("link", { name: "Book a call" });
    expect(bookLink).toHaveAttribute("target", "_blank");
    expect(bookLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "Send a message" })).toHaveAttribute("href", "/contact");
  });

  it("accepts custom heading/subheading, matching CTABand's prior API", () => {
    render(<ClosingRecord heading="Custom heading" subheading="Custom subheading" />);
    expect(screen.getByText("Custom heading")).toBeInTheDocument();
    expect(screen.getByText("Custom subheading")).toBeInTheDocument();
  });

  it("renders the contact email and trust line in the mono contact block", () => {
    render(<ClosingRecord />);
    expect(screen.getByRole("link", { name: business.contactEmail })).toHaveAttribute(
      "href",
      `mailto:${business.contactEmail}`
    );
    expect(screen.getByText(business.trustLine)).toBeInTheDocument();
  });
});
