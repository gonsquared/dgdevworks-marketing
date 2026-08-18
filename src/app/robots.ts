import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

// Required for static export (`output: 'export'`) — forces build-time generation.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
