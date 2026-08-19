import { getBookingUrl } from "@/lib/env";
import type { BusinessInfo } from "./types";

/**
 * Brand, positioning, and contact facts — single source of truth consumed by
 * Nav, Footer, Home, About, and the sitewide Person/ProfessionalService
 * JSON-LD (see src/lib/seo.ts).
 */
export const business: BusinessInfo = {
  brandName: "DG DevWorks",
  tagline: "Bank-grade engineering discipline, delivered at founder speed.",
  positioningCopy:
    "DG DevWorks is a one-person senior engineering practice: no subcontracting, no account-manager layer, no junior developer cutting their teeth on your codebase. I've spent years shipping production software for regulated banks and global hardware brands. Founders get that same discipline, at the speed an early-stage company actually needs.",
  bookingUrl: getBookingUrl(),
  contactEmail: "hello@dgdevworks.com",
  socialLinks: {
    linkedin: "https://linkedin.com/in/gonsquared",
    github: "https://github.com/gonsquared",
    portfolio: "https://gonsquared.dev",
  },
  trustLine:
    "Your info is only used to respond to your inquiry. No spam, no third parties.",
  footerTrustLine:
    "One senior engineer, start to finish. No subcontracting, no hand-offs.",
};

export default business;
