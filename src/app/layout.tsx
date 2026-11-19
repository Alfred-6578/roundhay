import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// One open geometric sans for everything; mono only for numbers.
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });
// Only the wordmark uses this: wide and round, so the ring reads as its O. Unbounded (SIL Open Font License), Latin subset,
// served from this project rather than fetched from Google at build time.
const wordmark = localFont({ src: "./fonts/Unbounded-latin.woff2", variable: "--font-wordmark", weight: "200 900", display: "swap" });

export const metadata: Metadata = {
  title: "Roundhay — cast once, shoot forever",
  description: "AI video that remembers your characters, sets and style, so episode 40 looks like episode 1.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrains.variable} ${wordmark.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-night text-bone">{children}</body>
    </html>
  );
}
