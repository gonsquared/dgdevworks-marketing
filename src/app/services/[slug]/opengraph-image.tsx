import { ImageResponse } from "next/og";
import { services, getServiceBySlug } from "@/data/services";

// Required for static export (`output: 'export'`) — forces build-time generation.
export const dynamic = "force-static";

export const alt = "DG DevWorks service overview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  const title = service?.title ?? "DG DevWorks";
  const priceLabel = service?.priceLabel ?? "";

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
          <span style={{ fontFamily: "monospace", fontSize: 24, color: "#FF6A45" }}>[DG] DevWorks</span>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 52, fontWeight: 600, lineHeight: 1.15 }}>
          {title}
        </div>
        {priceLabel && (
          <div style={{ display: "flex", marginTop: 24, fontSize: 32, fontFamily: "monospace", color: "#FF6A45" }}>
            {priceLabel}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
