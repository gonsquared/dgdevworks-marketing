import type { PricingData } from "./types";

/**
 * PLACEHOLDER PRICING — derived from public freelance-rate market data
 * (see spec's Pricing section), not yet confirmed by Daryll. Flagged as an
 * "Open Item" in the design spec; replace before public launch.
 */
export const pricing: PricingData = {
  hourlyRate: 50,
  packages: [
    {
      slug: "marketing-sites",
      name: "Marketing / Landing Site",
      priceLabel: "$2,500–$3,500",
      timeframe: "1–2 weeks",
      rangeNote:
        "Scales with page count and content complexity. Roughly 40 to 70 hours at the hourly rate.",
    },
    {
      slug: "mvp-development",
      name: "MVP / Product Build",
      priceLabel: "Starting at $8,400",
      timeframe: "4–8 weeks",
      rangeNote:
        "The floor for a lean, single-core-feature MVP. Scope calls typically land above the floor once integrations and auth are factored in.",
    },
    {
      slug: "modernization",
      name: "Legacy Modernization / Migration",
      priceLabel: "Starting at $5,600 (custom quote)",
      timeframe: "Varies by scope",
      rangeNote:
        "Migration scope varies too much for a fixed range. Every quote follows a technical audit of the existing system.",
    },
    {
      slug: "fractional",
      name: "Fractional / Embedded Software Engineer",
      priceLabel: "$2,450–$4,900/mo",
      timeframe: "Ongoing, month to month",
      rangeNote:
        "Reflects roughly 10 to 20 hours a week at the hourly rate, scoped to your team's cadence, not a fixed headcount contract.",
    },
  ],
};

export default pricing;
