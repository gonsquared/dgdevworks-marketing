import { Button } from "@/components/ui/Button";
import { BracketMark } from "@/components/layout/BracketMark";
import { getBookingUrl } from "@/lib/env";
import { business } from "@/data/business";

const INFO_ITEMS = [
  { label: "PRACTICE", value: "One engineer, no subcontracting" },
  { label: "STACK", value: "Next.js · TypeScript · Node · Postgres" },
  {
    label: "ENGAGEMENT",
    value: "MVP · Marketing site · Modernization · Fractional",
  },
  { label: "RESPONSE", value: "1–2 business days" },
];

/**
 * Home page masthead: mono dateline with the bracket mark, a contained serif
 * headline, a positioning paragraph paired with a bordered practice-facts
 * block, and a tiered (one solid button + one ghost text-style link) CTA.
 */
export function Masthead() {
  const bookingUrl = getBookingUrl();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b border-rule pb-4">
        <BracketMark className="text-accent h-3.5 w-5" />
        <p className="font-mono-annotation text-text-secondary">
          DG DEVWORKS · LET'S WORK TOGETHER
        </p>
      </div>

      <h1 className="heading-masthead mt-8 max-w-3xl">
        From Ideas to Solutions.
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-8 border-t border-rule pt-8 lg:grid-cols-12">
        <p className="text-body-lead text-text-secondary lg:col-span-7">
          {business.positioningCopy}
        </p>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-[3px] border border-border p-6 lg:col-span-4 lg:col-start-9">
          {INFO_ITEMS.map((item) => (
            <div key={item.label}>
              <dt className="font-mono-annotation text-text-secondary">
                {item.label}
              </dt>
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
          See the case studies →
        </Button>
      </div>
    </div>
  );
}
