import clsx from "clsx";
import { Button } from "./Button";
import { Section } from "./Section";
import { BracketMark } from "@/components/layout/BracketMark";
import { business } from "@/data/business";
import { getBookingUrl } from "@/lib/env";

export interface ClosingRecordProps {
  heading?: string;
  subheading?: string;
  className?: string;
}

/**
 * Full-bleed, left-aligned, inverted closing band: primary "Book a call" +
 * secondary "Send a message" CTA, plus a mono contact block. Replaces
 * CTABand's centered dual-button box. Used at the end of Home and every
 * Service detail / Pricing page.
 */
export function ClosingRecord({
  heading = "Ready to talk about your project?",
  subheading = "Book a call directly, or send a message and I'll reply within 1–2 business days.",
  className,
}: ClosingRecordProps) {
  const bookingUrl = getBookingUrl();

  return (
    <Section bleed rule="top" size="loose" className={clsx("relative overflow-hidden bg-surface-sunken", className)}>
      <BracketMark className="text-border-strong pointer-events-none absolute -bottom-8 -right-4 h-32 w-48 opacity-40 md:h-40 md:w-60" />
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="heading-h2">{heading}</h2>
          <p className="text-body-lead text-text-secondary mt-4 max-w-md">{subheading}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href={bookingUrl} external variant="solid" size="lg">
              Book a call
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Send a message
            </Button>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <p className="font-mono-annotation text-text-secondary">CONTACT</p>
          <a
            href={`mailto:${business.contactEmail}`}
            className="text-ui text-accent mt-2 block hover:text-accent-hover"
          >
            {business.contactEmail}
          </a>
          <p className="text-ui text-text-secondary mt-4">Replies within 1–2 business days.</p>
          <p className="text-ui text-text-secondary mt-4">{business.trustLine}</p>
        </div>
      </div>
    </Section>
  );
}
