import Link from "next/link";
import { Surface } from "@/components/ui/Surface";
import { AbstractVisual } from "@/components/AbstractVisual";
import type { CaseStudy } from "@/data/types";

export interface CaseStudyCardProps {
  caseStudy: CaseStudy;
}

/** Usage: <CaseStudyCard caseStudy={caseStudy} /> */
export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  return (
    <Surface variant="panel" className="flex h-full flex-col overflow-hidden p-0">
      <div className="aspect-[5/3]">
        <AbstractVisual variant={caseStudy.slug} label={`${caseStudy.title} illustrative graphic`} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="heading-h3">{caseStudy.title}</h3>
        <p className="text-body text-text-secondary mt-2 line-clamp-2 flex-1">{caseStudy.challenge}</p>
        <Link
          href={`/work/${caseStudy.slug}`}
          className="text-ui text-accent mt-4 inline-block hover:text-accent-hover"
        >
          Read case study →
        </Link>
      </div>
    </Surface>
  );
}
