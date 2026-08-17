import type { PricingData } from "./types";

/**
 * PLACEHOLDER PRICING — derived from public freelance-rate market data
 * (see spec's Pricing section), not yet confirmed by Daryll. Flagged as an
 * "Open Item" in the design spec; replace before public launch.
 */
export const pricing: PricingData = {
  // $101/hr average senior SWE contract rate minus 10%, rounded.
  hourlyRate: 90,
  packages: [
    {
      slug: "marketing-sites",
      name: "Marketing / Landing Site",
      priceLabel: "$3,500–$6,500",
      timeframe: "1–2 weeks",
      rangeNote:
        "Scales with page count and content complexity — roughly 40–70 hours at the hourly rate.",
    },
    {
      slug: "mvp-development",
      name: "MVP / Product Build",
      priceLabel: "Starting at $12,000",
      timeframe: "4–8 weeks",
      rangeNote:
        "The floor for a lean, single-core-feature MVP. Scope calls typically land above the floor once integrations and auth are factored in.",
    },
    {
      slug: "modernization",
      name: "Legacy Modernization / Migration",
      priceLabel: "Starting at $8,000 — custom quote",
      timeframe: "Varies by scope",
      rangeNote:
        "Migration scope varies too much for a fixed range — every quote follows a technical audit of the existing system.",
    },
    {
      slug: "fractional",
      name: "Fractional / Embedded Senior Engineer",
      priceLabel: "$3,500–$7,000/mo",
      timeframe: "Ongoing, month to month",
      rangeNote:
        "Reflects roughly 10–20 hours/week at the hourly rate — scoped to your team's cadence, not a fixed headcount contract.",
    },
  ],
};

export default pricing;
