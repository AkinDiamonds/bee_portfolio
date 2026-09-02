import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TODO: Portfolio title",
    template: "%s | TODO: Portfolio title",
  },
  description: "TODO: Approved portfolio positioning statement.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    title: "TODO: Portfolio title",
    description: "TODO: Approved portfolio positioning statement.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TODO: Portfolio title",
    description: "TODO: Approved portfolio positioning statement.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
