import { Button } from "@/components/ui/Button";
import { getBookingUrl } from "@/lib/env";

const FACTS = [
  { label: "Practice", value: "One engineer, no subcontracting" },
  { label: "Stack", value: "Next.js, TypeScript, Node, Postgres" },
  { label: "Engagements", value: "MVP, marketing site, modernization, fractional" },
  { label: "Response", value: "1–2 business days" },
];

/**
 * Home hero. The headline is the design: three display-weight lines that rise
 * into place on load (the one orchestrated page-load moment — CSS only, so it
 * runs before hydration), a short positioning lead with the booking CTA, and
 * the practice facts as a quiet definition list in the right-hand column.
 */
export function Masthead() {
  const bookingUrl = getBookingUrl();

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-12">
      <div className="lg:col-span-9">
        <h1 className="heading-masthead">
          <span className="line-mask" style={{ "--line": 0 } as React.CSSProperties}>
            <span>Production software, </span>
          </span>
          <span className="line-mask" style={{ "--line": 1 } as React.CSSProperties}>
            <span>built by one </span>
          </span>
          <span className="line-mask" style={{ "--line": 2 } as React.CSSProperties}>
            <span>senior engineer.</span>
          </span>
        </h1>

        <div className="fade-in-late mt-10 max-w-xl md:mt-12" style={{ "--line": 3 } as React.CSSProperties}>
          <p className="text-body-lead text-text-secondary">
            DG DevWorks is a one-person engineering practice: no subcontracting, no account-manager
            layer, no junior developer learning on your codebase. I&apos;ve shipped for regulated banks
            and global hardware brands, where a bad release is a compliance incident.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href={bookingUrl} external variant="solid" size="lg">
              Book a call
            </Button>
            <Button href="/work" variant="ghost" size="lg" className="-ml-3 lg:ml-0">
              See the work
            </Button>
          </div>
        </div>
      </div>

      <dl
        className="fade-in-late grid grid-cols-1 gap-x-6 gap-y-5 self-end sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1"
        style={{ "--line": 4 } as React.CSSProperties}
      >
        {FACTS.map((fact) => (
          <div key={fact.label} className="border-l-2 border-accent-soft pl-4">
            <dt className="text-ui text-text-tertiary">{fact.label}</dt>
            <dd className="text-ui text-text-primary mt-0.5">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
