import type { PortfolioDisclosureCopy } from "./types";

/**
 * Copy for PortfolioDisclosureModal (docs/design-system.md §9). Single source
 * of truth for the sitewide, once-per-session disclosure that this site is a
 * self-built portfolio project — matches this project's "everything typed in
 * src/data/*.ts" convention rather than hardcoding copy in the component.
 */
export const portfolioDisclosureCopy: PortfolioDisclosureCopy = {
  eyebrow: "// PORTFOLIO NOTICE",
  heading: "You're looking at a portfolio project",
  body:
    "I'm Daryll. I designed and built this entire site myself as a self-directed portfolio piece, not a live storefront with an active client roster. The services, case studies, and pricing shown are real examples of how I work. If something here resonates, I'd genuinely like to hear from you.",
  primaryCtaLabel: "Get in touch",
  secondaryCtaLabel: "Continue browsing",
  closeButtonAriaLabel: "Close portfolio notice",
};

export default portfolioDisclosureCopy;
