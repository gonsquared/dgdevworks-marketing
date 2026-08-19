import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseStudyLead } from "@/components/CaseStudyLead";
import { getCaseStudyBySlug } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/types";

describe("CaseStudyLead (BROADSHEET, one dominant case study block)", () => {
  it("renders the headline stat, title, challenge, and a link to the case study", () => {
    const caseStudy = getCaseStudyBySlug("stock-exchange-data-migration")!;
    render(<CaseStudyLead caseStudy={caseStudy} />);
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("faster query performance")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(caseStudy.title);
    expect(screen.getByText(caseStudy.challenge)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read the record/ })).toHaveAttribute(
      "href",
      "/work/stock-exchange-data-migration"
    );
  });

  it("gracefully omits the stat block when headlineStat is absent", () => {
    const withoutStat: CaseStudy = {
      slug: "bank-platform-modernization",
      title: "Test Case Study",
      challenge: "A test challenge.",
      approach: "A test approach.",
      impact: ["Something happened"],
      relatedServiceSlugs: ["fractional"],
    };
    render(<CaseStudyLead caseStudy={withoutStat} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Case Study");
    expect(screen.queryByText("40%")).not.toBeInTheDocument();
  });

  it("renders the title as an h3 by default, or an h2 when headingLevel={2} is set", () => {
    const caseStudy = getCaseStudyBySlug("stock-exchange-data-migration")!;
    const { rerender } = render(<CaseStudyLead caseStudy={caseStudy} />);
    expect(screen.getByRole("heading", { level: 3, name: caseStudy.title })).toBeInTheDocument();

    rerender(<CaseStudyLead caseStudy={caseStudy} headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: caseStudy.title })).toBeInTheDocument();
  });

  it("hides the decorative arrow from the link's accessible name and disambiguates it by title", () => {
    const caseStudy = getCaseStudyBySlug("stock-exchange-data-migration")!;
    render(<CaseStudyLead caseStudy={caseStudy} />);
    const link = screen.getByRole("link", { name: `Read the record for ${caseStudy.title}` });
    expect(link).toHaveAttribute("href", "/work/stock-exchange-data-migration");
  });
});
