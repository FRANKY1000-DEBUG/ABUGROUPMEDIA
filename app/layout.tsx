import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ActivityTracker from "@/components/ActivityTracker";
import { optimizedLogoUrl } from "@/lib/brand";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope"
});

export const metadata: Metadata = {
  title: "AGM — Plateforme média",
  description: "Actualités, reportages, interviews, émissions, documentaires, culture et sport en vidéo.",
  icons: { icon: optimizedLogoUrl(64), apple: optimizedLogoUrl(180) }
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
