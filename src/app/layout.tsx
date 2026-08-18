import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/JsonLd";
import { themeInitScript } from "@/lib/theme";
import { personProfessionalServiceJsonLd } from "@/lib/seo";
import { getGaId, getGoogleVerification, getSiteUrl } from "@/lib/env";
import { business } from "@/data/business";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();
const googleVerification = getGoogleVerification();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.brandName} | ${business.tagline}`,
    template: `%s | ${business.brandName}`,
  },
  description: business.positioningCopy,
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = getGaId();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking theme-init script: sets data-theme before first paint to
            avoid a flash of incorrect theme. Static constant string, not
            user-controlled — see src/lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={personProfessionalServiceJsonLd()} />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <Nav />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
