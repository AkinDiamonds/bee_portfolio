import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simeonakinrinola.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Simeon Akinrinola — Software Engineer & AI Architect",
    template: "%s | Simeon Akinrinola",
  },
  description:
    "Portfolio and technical engineering notes of Simeon Akinrinola. Full-Stack and AI Systems Engineer specializing in Next.js, Distributed Systems, and Autonomous AI Agents.",
  keywords: [
    "Simeon Akinrinola",
    "AkinDiamonds",
    "Software Engineer",
    "AI Engineer",
    "AI Architect",
    "Full Stack Developer",
    "Next.js Developer",
    "TypeScript",
    "LLM Engineering",
    "Autonomous Agents",
    "Generative AI",
  ],
  authors: [{ name: "Simeon Akinrinola", url: baseUrl }],
  creator: "Simeon Akinrinola",
  publisher: "Simeon Akinrinola",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Simeon Akinrinola Portfolio",
    title: "Simeon Akinrinola — Software Engineer & AI Architect",
    description:
      "Building better software, faster. Full-Stack and AI Systems Engineer specializing in Next.js, Distributed Systems, and Autonomous AI Agents.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simeon Akinrinola — Software Engineer & AI Architect",
    description:
      "Building better software, faster. Full-Stack and AI Systems Engineer specializing in Next.js, Distributed Systems, and Autonomous AI Agents.",
  },
  alternates: {
    canonical: baseUrl,
    types: {
      "text/markdown": `${baseUrl}/llms.txt`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
