import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { ProofStrip } from "@/components/ProofStrip";
import { caseStudies } from "@/data/caseStudies";

describe("ProofStrip (BROADSHEET home trust layer)", () => {
  it("renders one figure/label cell per case study, each linking to its case study", () => {
    render(<ProofStrip />);
    // Find each link by its href first, then scope the value/label text
    // assertions to that link. Matching by accessible-name regex isn't safe
    // here: two case studies legitimately share the same headlineStat.value
    // ("2"), and one label ("markets localized (Arabic RTL + Spanish)")
    // contains regex metacharacters that break a naive new RegExp(label).
    const links = screen.getAllByRole("link");
    for (const cs of caseStudies) {
      const link = links.find((a) => a.getAttribute("href") === `/work/${cs.slug}`);
      expect(link, `no link found for /work/${cs.slug}`).toBeDefined();
      expect(within(link!).getByText(cs.headlineStat!.value)).toBeInTheDocument();
      expect(within(link!).getByText(cs.headlineStat!.label)).toBeInTheDocument();
    }
  });
});
