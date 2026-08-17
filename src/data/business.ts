import { getBookingUrl } from "@/lib/env";
import type { BusinessInfo } from "./types";

/**
 * Brand, positioning, and contact facts — single source of truth consumed by
 * Nav, Footer, Home, About, and the sitewide Person/ProfessionalService
 * JSON-LD (see src/lib/seo.ts).
 */
export const business: BusinessInfo = {
  brandName: "DG DevWorks",
  tagline: "Built by Daryll, senior full-stack engineer for founders.",
  positioningCopy:
    "I build your product and the marketing site that sells it. DG DevWorks is a one-person senior engineering practice — no subcontracting, no account-manager layer — for startup founders who need a product built, modernized, or kept moving by someone who's shipped this before.",
  bookingUrl: getBookingUrl(),
  contactEmail: "hello@dgdevworks.com",
  socialLinks: {
    linkedin: "https://linkedin.com/in/gonsquared",
    github: "https://github.com/gonsquared",
    portfolio: "https://gonsquared.dev",
  },
  trustLine:
    "Your info is only used to respond to your inquiry — no spam, no third parties.",
  footerTrustLine:
    "One senior engineer, start to finish — no subcontracting, no hand-offs.",
};

export default business;
