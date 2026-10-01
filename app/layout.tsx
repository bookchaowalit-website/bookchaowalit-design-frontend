import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Design Specs | Bookchaowalit",
  description: "A browser-local star-atlas catalogue of visual work: titles, regions, tools, and review status.",
  keywords: ["design", "portfolio"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Design Specs | Bookchaowalit",
    description: "A browser-local star-atlas catalogue of visual work: titles, regions, tools, and review status.",
    siteName: "Bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* THESIS: Design Specs is a star atlas for visual work, refusing a generic item tracker. OWN-WORLD: abyssal navy, paper-white signals, cyan coordinates, amber stars, and thin constellation lines. STORY: visitors search the catalogue, plot a new work point, and read its tools as nearby bodies. FIRST VIEWPORT: field legend, oversized atlas title, coordinates, then the observation field. FORM: celestial notation atlas, assigned grounded direction 3, seed ff8c96c1. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
