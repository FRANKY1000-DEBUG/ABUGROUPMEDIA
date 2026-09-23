import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ActivityTracker from "@/components/ActivityTracker";
import { optimizedLogoUrl, BRAND_NAME, LEGAL } from "@/lib/brand";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope"
});

const SITE_DESCRIPTION = "Actualités, reportages, interviews, émissions, documentaires, culture et sport en vidéo.";

export const metadata: Metadata = {
  metadataBase: new URL(LEGAL.siteUrl),
  title: { default: `${BRAND_NAME} — Plateforme média`, template: `%s — ${BRAND_NAME}` },
  description: SITE_DESCRIPTION,
  icons: { icon: optimizedLogoUrl(64), apple: optimizedLogoUrl(180) },
  openGraph: {
    siteName: BRAND_NAME,
    type: "website",
    locale: "fr_FR",
    url: LEGAL.siteUrl,
    title: `${BRAND_NAME} — Plateforme média`,
    description: SITE_DESCRIPTION,
    images: [{ url: optimizedLogoUrl(630), width: 630, height: 630 }]
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Plateforme média`,
    description: SITE_DESCRIPTION,
    images: [optimizedLogoUrl(630)]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={manrope.variable}>
      <body className="font-sans antialiased">
        <ActivityTracker />
        {children}
      </body>
    </html>
  );
}
