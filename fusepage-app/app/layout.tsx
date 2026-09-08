import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/store";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Fusepage — Your mini-site, beautifully linkable",
    template: "%s — Fusepage",
  },
  description:
    "Fusepage helps creators, freelancers, small businesses, and professionals build a polished mini-site and link-in-bio portfolio from one dashboard. Publish, share, and track engagement.",
  keywords: [
    "link in bio",
    "mini site",
    "portfolio",
    "link page",
    "creator page",
    "freelancer portfolio",
  ],
  authors: [{ name: "Fusepage" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fusepage",
    title: "Fusepage — Your mini-site, beautifully linkable",
    description:
      "Build a polished mini-site and link-in-bio page from one dashboard. Share it everywhere and track what matters.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@fusepage",
    title: "Fusepage — Your mini-site, beautifully linkable",
    description:
      "Build a polished mini-site and link-in-bio page from one dashboard. Share it everywhere and track what matters.",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-[var(--bg)] text-[var(--ink)] antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
