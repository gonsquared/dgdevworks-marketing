import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Static export cannot use the default Next.js image optimizer
    // (no server runtime). All images in this project are either
    // generated SVG/gradients or served unoptimized.
    unoptimized: true,
  },
};

export default nextConfig;
