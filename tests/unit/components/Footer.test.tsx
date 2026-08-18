import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { business } from "@/data/business";

describe("Footer (E1-F3-S3)", () => {
  it("renders as a landmark with role=contentinfo", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders contact email, LinkedIn, GitHub, and a personal portfolio link", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: business.contactEmail })).toHaveAttribute(
      "href",
      `mailto:${business.contactEmail}`
    );
    expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", business.socialLinks.linkedin);
    expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", business.socialLinks.github);
    expect(screen.getByRole("link", { name: /Personal portfolio/ })).toHaveAttribute(
      "href",
      business.socialLinks.portfolio
    );
  });

  it("all external links use target=_blank rel=noopener noreferrer (security requirement)", () => {
    render(<Footer />);
    for (const name of [/LinkedIn/, /GitHub/, /Personal portfolio/, /Book a call/]) {
      const link = screen.getByRole("link", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("renders the trust-signal line and a copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(business.footerTrustLine)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} DG DevWorks`))).toBeInTheDocument();
  });

  it("each footer link list is wrapped in its own labeled <nav aria-label>", () => {
    render(<Footer />);
    expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Connect" })).toBeInTheDocument();
  });
});
