import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "Mbalire Henry — Graphic Designer | Portfolio",
  description: "Professional graphic designer and visual artist specializing in brand identity, print design, and digital experiences. Based in Kampala, Uganda, working globally.",
  keywords: ["graphic design", "brand identity", "visual artist", "portfolio", "Kampala", "Uganda", "freelance designer"],
  authors: [{ name: "Mbalire Henry" }],
  openGraph: {
    title: "Mbalire Henry — Graphic Designer",
    description: "Crafting compelling visual identities and brand systems that make brands unforgettable.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbalire Henry — Graphic Designer",
    description: "Professional graphic designer specializing in brand identity and visual storytelling.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
