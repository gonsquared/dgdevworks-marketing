import { Button } from "@/components/ui/Button";
import { AbstractVisual } from "@/components/AbstractVisual";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { getBookingUrl } from "@/lib/env";
import { business } from "@/data/business";

/** Home page hero: positioning statement, primary CTA, signature abstract graphic. */
export function Hero() {
  const bookingUrl = getBookingUrl();

  return (
    <div className="grid grid-cols-1 items-center gap-10 py-16 md:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
      <div>
        <SpecLabel>FIG. 01 — DG DEVWORKS</SpecLabel>
        <h1 className="heading-display mt-4">I build your product — and the marketing site that sells it.</h1>
        <p className="text-body-lead text-text-secondary mt-6 max-w-xl">{business.positioningCopy}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href={bookingUrl} external variant="solid" size="lg">
            Book a call
          </Button>
          <Button href="/work" variant="outline" size="lg">
            See the work
          </Button>
        </div>
      </div>
      <div className="card-bracket aspect-[4/3] w-full overflow-hidden rounded-xl border border-border">
        <AbstractVisual variant="home-hero" label="Abstract system diagram representing full-stack engineering" />
      </div>
    </div>
  );
}
