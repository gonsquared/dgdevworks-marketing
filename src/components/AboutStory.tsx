import { business } from "@/data/business";

/** Narrative bio for /about — sourced from business.ts + page-level copy. */
export function AboutStory() {
  return (
    <div className="max-w-3xl">
      <p className="text-voice border-rule border-l-2 pl-6 text-2xl md:text-3xl">{business.tagline}</p>

      <p className="text-body text-text-secondary mt-6">
        I&apos;m Daryll, a senior full-stack engineer who spent years shipping production software
        for regulated banks, global hardware brands, and fast-moving product teams. DG DevWorks is where
        that same discipline gets applied
        to founder-scale projects: spec-first, systematic, and built to hand off cleanly rather than
        create a dependency on me.
      </p>

      <p className="text-body text-text-secondary mt-4">
        I work with startup founders specifically, not agencies looking to subcontract and not local
        businesses that need a brochure site. Founders come to me with a product that needs to get built,
        a legacy system that&apos;s become the bottleneck, or a team that needs a senior engineer&apos;s
        judgment without a full-time senior hire yet. That&apos;s the work I&apos;m built for.
      </p>

      <p className="text-body text-text-secondary mt-4">
        Every engagement is me, directly. No subcontracting, no account-manager layer between you and
        the person writing the code. If you want to see the deeper technical history behind this
        practice (full project history, stack details, and code samples), the{" "}
        <a
          href={business.socialLinks.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:text-accent-hover"
        >
          personal portfolio
          <span className="sr-only"> (opens in new tab)</span>
        </a>{" "}
        goes deeper than this site does.
      </p>
    </div>
  );
}
