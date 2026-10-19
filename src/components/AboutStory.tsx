import { business } from "@/data/business";

/** Narrative bio for /about — sourced from business.ts + page-level copy. */
export function AboutStory() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
      <p className="text-voice text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] lg:col-span-5">{business.tagline}</p>

      <div className="flex flex-col gap-6 lg:col-span-7">
        <p className="text-body text-text-secondary">
          I&apos;m Daryll, a software engineer who spent years shipping production software
          for regulated banks, global hardware brands, and fast-moving product teams. DG DevWorks is where
          that same discipline gets applied
          to client projects: spec-first, systematic, and built to hand off cleanly rather than
          create a dependency on me.
        </p>

        <p className="text-body text-text-secondary">
          I work with companies and teams that need production software built or fixed by someone
          senior, not agencies looking to subcontract the work out. They come to me with a product that
          needs to get built, a legacy system that&apos;s become the bottleneck, or a team that needs a
          software engineer&apos;s judgment without a full-time hire. That&apos;s the work I&apos;m built for.
        </p>

        <p className="text-body text-text-secondary">
          Every engagement is me, directly. No subcontracting, no account-manager layer between you and
          the person writing the code. If you want to see the deeper technical history behind this
          practice (full project history, stack details, and code samples), the{" "}
          <a
            href={business.socialLinks.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent link-underline"
          >
            personal portfolio
            <span className="sr-only"> (opens in new tab)</span>
          </a>{" "}
          goes deeper than this site does.
        </p>
      </div>
    </div>
  );
}
