import clsx from "clsx";
import { Button } from "./Button";
import { Section } from "./Section";
import { business } from "@/data/business";
import { getBookingUrl } from "@/lib/env";

export interface ClosingRecordProps {
  heading?: string;
  subheading?: string;
  className?: string;
}

/**
 * Closing call to action: a single raised panel on the page background,
 * left-aligned, with the primary "Book a call" button, the secondary "Send a
 * message" button and the direct email. Used at the end of Home and every
 * Service detail / Pricing page.
 */
export function ClosingRecord({
  heading = "Ready to scope your project?",
  subheading = "Book a call and walk away with a clear plan and a firm quote. Prefer email? Send a message instead.",
  className,
}: ClosingRecordProps) {
  const bookingUrl = getBookingUrl();

  return (
    <Section size="default" className={clsx("pt-8 md:pt-12", className)}>
      <div className="relative overflow-hidden rounded-[28px] bg-accent p-8 text-accent-on-fill md:p-16">
        <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="heading-display">{heading}</h2>
            <p className="text-body-lead mt-5 max-w-md opacity-85">{subheading}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                href={bookingUrl}
                external
                variant="solid"
                size="lg"
                className="!bg-accent-on-fill !text-accent shadow-none hover:!bg-accent-on-fill/90"
              >
                Book a call
              </Button>
              <Button
                href="/contact"
                variant="ghost"
                size="lg"
                className="!text-accent-on-fill hover:!bg-accent-on-fill/10"
              >
                Send a message
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-3 lg:col-span-4">
            <a
              href={`mailto:${business.contactEmail}`}
              className="text-ui link-underline w-fit text-accent-on-fill"
            >
              {business.contactEmail}
            </a>
            <p className="text-ui opacity-80">Replies within 1–2 business days.</p>
            <p className="text-ui opacity-80">{business.trustLine}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
