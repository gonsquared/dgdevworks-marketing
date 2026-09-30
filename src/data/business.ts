import { getBookingUrl } from "@/lib/env";
import type { BusinessInfo } from "./types";

/**
 * Brand, positioning, and contact facts — single source of truth consumed by
 * Nav, Footer, Home, About, and the sitewide Person/ProfessionalService
 * JSON-LD (see src/lib/seo.ts).
 */
export const business: BusinessInfo = {
  brandName: "DG DevWorks",
  tagline: "AI and software engineering, built with enterprise discipline.",
  positioningCopy:
    "DG DevWorks is a one-person engineering practice led by Daryll, a senior software engineer with 10+ years of experience across AI engineering, full-stack web applications, API platforms, and legacy modernization. No subcontracting, no account-manager layer, and no junior developer learning on your codebase. The same production discipline used for regulated banks and global hardware brands applies whether you're building a first product, securing and scaling an existing one, modernizing a legacy system, or connecting tools that were never meant to talk to each other.",
  bookingUrl: getBookingUrl(),
  contactEmail: "daryll@dgdevworks.com",
  socialLinks: {
    linkedin: "https://linkedin.com/in/gonsquared",
    github: "https://github.com/gonsquared",
    portfolio: "https://www.dgdevworks.com",
  },
  trustLine:
    "Your info is only used to respond to your inquiry. No spam, no third parties.",
  footerTrustLine:
    "One software engineer, start to finish. No subcontracting, no hand-offs.",
};

export default business;
