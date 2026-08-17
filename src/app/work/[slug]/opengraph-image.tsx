import { ImageResponse } from "next/og";
import { caseStudies, getCaseStudyBySlug } from "@/data/caseStudies";

// Required for static export (`output: 'export'`) — forces build-time generation.
export const dynamic = "force-static";

export const alt = "DG DevWorks case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ slug: caseStudy.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  const title = caseStudy?.title ?? "DG DevWorks case study";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0D1420",
          color: "#EDEFF3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "monospace", fontSize: 24, color: "#FF6A45" }}>[DG] DevWorks — CASE STUDY</span>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 48, fontWeight: 600, lineHeight: 1.15 }}>
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
