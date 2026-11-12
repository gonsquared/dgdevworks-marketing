import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CaseStudyLead } from "@/components/CaseStudyLead";
import { getCaseStudyBySlug } from "@/data/caseStudies";
import type { CaseStudy } from "@/data/types";

describe("CaseStudyLead (BROADSHEET, one dominant case study block)", () => {
  it("renders the headline stat, title, challenge, and a link to the case study", () => {
    const caseStudy = getCaseStudyBySlug("n8n-reservation-automation")!;
    render(<CaseStudyLead caseStudy={caseStudy} />);
    expect(screen.getByText(caseStudy.headlineStat!.value)).toBeInTheDocument();
    expect(screen.getByText(caseStudy.headlineStat!.label)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(caseStudy.title);
    expect(screen.getByText(caseStudy.challenge)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read the record/ })).toHaveAttribute(
      "href",
      "/work/n8n-reservation-automation"
    );
  });

  it("gracefully omits the stat block when headlineStat is absent", () => {
    const withoutStat: CaseStudy = {
      slug: "moments-cafe-wordpress",
      title: "Test Case Study",
      challenge: "A test challenge.",
      approach: "A test approach.",
      impact: ["Something happened"],
      relatedServiceSlugs: ["fractional"],
      context: "Test context",
      tags: ["Test"],
      fullCaseStudyUrl: "https://www.dgdevworks.com/projects/moments-cafe-wordpress",
    };
    render(<CaseStudyLead caseStudy={withoutStat} />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Test Case Study");
    expect(screen.queryByText("7")).not.toBeInTheDocument();
  });

  it("renders the title as an h3 by default, or an h2 when headingLevel={2} is set", () => {
    const caseStudy = getCaseStudyBySlug("n8n-reservation-automation")!;
    const { rerender } = render(<CaseStudyLead caseStudy={caseStudy} />);
    expect(screen.getByRole("heading", { level: 3, name: caseStudy.title })).toBeInTheDocument();

    rerender(<CaseStudyLead caseStudy={caseStudy} headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: caseStudy.title })).toBeInTheDocument();
  });

  it("hides the decorative arrow from the link's accessible name and disambiguates it by title", () => {
    const caseStudy = getCaseStudyBySlug("n8n-reservation-automation")!;
    render(<CaseStudyLead caseStudy={caseStudy} />);
    const link = screen.getByRole("link", { name: `Read the record for ${caseStudy.title}` });
    expect(link).toHaveAttribute("href", "/work/n8n-reservation-automation");
  });
});
