import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mbalire Henry — Graphic Designer & Visual Artist | Portfolio",
  description: "Professional graphic designer and visual artist specializing in brand identity, print design, and digital art. Based in Kampala, Uganda, working globally.",
  keywords: ["graphic designer", "visual artist", "brand identity", "print design", "digital art", "portfolio", "Kampala", "Uganda", "freelance designer", "Adobe Creative Suite"],
  authors: [{ name: "Mbalire Henry" }],
  openGraph: {
    title: "Mbalire Henry — Graphic Designer & Visual Artist",
    description: "Creating stunning visual experiences through brand identity, print design, and digital art.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbalire Henry — Graphic Designer & Visual Artist",
    description: "Professional graphic designer specializing in brand identity, visual storytelling, and creative design solutions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        {children}
      </body>
    </html>
  );
}
