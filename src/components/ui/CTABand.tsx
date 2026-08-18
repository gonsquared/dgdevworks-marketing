import { Button } from "./Button";
import { Section } from "./Section";
import { getBookingUrl } from "@/lib/env";

export interface CTABandProps {
  heading?: string;
  subheading?: string;
  className?: string;
}

/**
 * Dual-CTA band: primary "Book a call" (external booking URL) + secondary
 * "Send a message" (/contact). Used at the end of Home and every Service
 * detail page per the spec.
 */
export function CTABand({
  heading = "Ready to talk about your project?",
  subheading = "Book a call directly, or send a message and I'll reply within 1–2 business days.",
  className,
}: CTABandProps) {
  const bookingUrl = getBookingUrl();

  return (
    <Section className={className}>
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center md:px-12">
        <h2 className="heading-h2">{heading}</h2>
        <p className="text-body text-text-secondary mt-3 max-w-2xl mx-auto">{subheading}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href={bookingUrl} external variant="solid" size="lg">
            Book a call
          </Button>
          <Button href="/contact" variant="outline" size="lg">
            Send a message
          </Button>
        </div>
      </div>
    </Section>
  );
}
