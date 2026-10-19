import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PortfolioDisclosureModal } from "@/components/layout/PortfolioDisclosureModal";
import { JsonLd } from "@/components/JsonLd";
import { themeInitScript } from "@/lib/theme";
import { personProfessionalServiceJsonLd } from "@/lib/seo";
import { getGaId, getGoogleVerification, getSiteUrl } from "@/lib/env";
import { business } from "@/data/business";

// Display: Bricolage Grotesque, variable with an optical-size axis so large
// headings get the tight display cut and small ones stay open and legible.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// Text and UI: Instrument Sans, variable weight.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
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
      className={`${bricolage.variable} ${instrumentSans.variable} h-full antialiased`}
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
        <PortfolioDisclosureModal />
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
