/**
 * Shared content-layer types. These mirror the canonical shapes documented
 * in docs/api-contract.md ("Shared Models") — keep both in sync.
 */

export type ServiceSlug =
  | "mvp-development"
  | "marketing-sites"
  | "modernization"
  | "fractional";

export type CaseStudySlug =
  | "bank-platform-modernization"
  | "hardware-brand-partner-portals"
  | "retail-pos-platform"
  | "stock-exchange-data-migration";

export interface Service {
  slug: ServiceSlug;
  title: string;
  summary: string;
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
