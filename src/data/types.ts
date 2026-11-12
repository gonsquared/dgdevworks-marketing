/**
 * Shared content-layer types. These mirror the canonical shapes documented
 * in docs/api-contract.md ("Shared Models") — keep both in sync.
 */

export type ServiceSlug =
  | "mvp-development"
  | "marketing-sites"
  | "modernization"
  | "fractional";

/** Mirrors the portfolio project slugs (portfolio/src/app/projects/*) so URLs match across both sites. */
export type CaseStudySlug = "dg-devteam" | "n8n-reservation-automation" | "moments-cafe-wordpress";

export interface Service {
  slug: ServiceSlug;
  title: string;
  summary: string;
  /** First-person framing of idealClient, for the services-index situational
   * chooser. Optional and additive. */
  situation?: string;
  includes: string[];
  process: string[];
  idealClient: string;
  priceLabel: string;
  relatedCaseStudySlugs: CaseStudySlug[];
}

export interface CaseStudy {
  slug: CaseStudySlug;
  title: string;
  challenge: string;
  approach: string;
  impact: string[];
  /** A single quantified figure pulled from impact[], for the home page
   * proof strip and the case-study index/lead rendering. Optional and
   * additive — never fabricated beyond what impact[] already states. */
  headlineStat?: { value: string; label: string };
  relatedServiceSlugs: ServiceSlug[];
  /** Short project type line, e.g. "n8n automation". */
  context: string;
  /** Stack / technique tags, shown on the detail page. */
  tags: string[];
  /** Lead image, served from /public/work/<slug>/. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Absolute URL of the full write-up on the personal portfolio. */
  fullCaseStudyUrl: string;
}

export interface PricingPackage {
  slug: string;
  name: string;
  priceLabel: string;
  timeframe: string;
  rangeNote: string;
}

export interface PricingData {
  hourlyRate: number;
  packages: PricingPackage[];
}

export interface BusinessInfo {
  brandName: string;
  tagline: string;
  positioningCopy: string;
  bookingUrl: string;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
  };
  trustLine: string;
  footerTrustLine: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface DiscordWebhookEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordWebhookEmbed {
  title?: string;
  color?: number;
  fields: DiscordWebhookEmbedField[];
  timestamp?: string;
}

export interface DiscordWebhookPayload {
  username?: string;
  embeds: DiscordWebhookEmbed[];
}

export interface PortfolioDisclosureCopy {
  eyebrow: string;
  heading: string;
  body: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  closeButtonAriaLabel: string;
}
