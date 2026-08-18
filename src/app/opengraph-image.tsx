import { ImageResponse } from "next/og";
import { business } from "@/data/business";

// Required for static export (`output: 'export'`) — forces build-time generation.
export const dynamic = "force-static";

export const alt = `${business.brandName} — ${business.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 28,
              letterSpacing: 2,
              color: "#00D4FF",
            }}
          >
            [DG]
          </span>
          <span style={{ fontSize: 28, fontWeight: 600 }}>DevWorks</span>
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 56, fontWeight: 600, lineHeight: 1.1 }}>
          I build your product — and the marketing site that sells it.
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "#94A0B4" }}>
          {business.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
