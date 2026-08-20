import { getBookingUrl } from "@/lib/env";
import type { BusinessInfo } from "./types";

/**
 * Brand, positioning, and contact facts — single source of truth consumed by
 * Nav, Footer, Home, About, and the sitewide Person/ProfessionalService
 * JSON-LD (see src/lib/seo.ts).
 */
export const business: BusinessInfo = {
  brandName: "DG DevWorks",
  tagline: "Solutions built with enterprise discipline.",
  positioningCopy:
    "DG DevWorks is a one-person engineering practice: no subcontracting, no account-manager layer, no junior developer learning on your codebase. I've spent years shipping production software for regulated banks and global hardware brands, where a bad release is a compliance incident rather than a quick patch. The same discipline applies whether you're building a first product, scaling one that's outgrown its architecture, modernizing a legacy system, or connecting tools that were never meant to talk to each other.",
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
