import { Button } from "@/components/ui/Button";
import { getBookingUrl } from "@/lib/env";
import { business } from "@/data/business";

const INFO_ITEMS = [
  { label: "PRACTICE", value: "One senior engineer, no subcontracting" },
  { label: "STACK", value: "Next.js · TypeScript · Node · Postgres" },
  { label: "ENGAGEMENT", value: "MVP · Modernization · Fractional" },
  { label: "RESPONSE", value: "1–2 business days" },
];

/**
 * Home page masthead: mono dateline, giant serif headline with an italic
 * personal clause, a positioning paragraph paired with a mono practice-facts
 * list, and a tiered (one solid button + one ghost text-style link) CTA.
 * Replaces Hero — no more AbstractVisual graphic box.
 */
export function Masthead() {
  const bookingUrl = getBookingUrl();

  return (
    <div className="flex flex-col">
      <div className="border-b border-rule pb-4">
        <p className="font-mono-annotation text-text-secondary">
          DG DEVWORKS · SENIOR FULL-STACK ENGINEERING · AVAILABLE FOR NEW WORK
        </p>
      </div>

      <h1 className="heading-masthead mt-8 max-w-4xl">
        I build your product, <span className="text-voice">and the marketing site that sells it.</span>
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-10 border-t border-rule pt-8 lg:grid-cols-12">
        <p className="text-body-lead text-text-secondary lg:col-span-7">{business.positioningCopy}</p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 lg:col-span-4 lg:col-start-9">
          {INFO_ITEMS.map((item) => (
            <div key={item.label}>
              <dt className="font-mono-annotation text-text-secondary">{item.label}</dt>
              <dd className="text-ui text-text-primary mt-1">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-10 flex items-center gap-6 border-t border-rule pt-8">
        <Button href={bookingUrl} external variant="solid" size="lg">
          Book a call
        </Button>
        <Button href="/work" variant="ghost" size="lg">
          See the work →
        </Button>
      </div>
    </div>
  );
}
