import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mbalire Henry — Web Developer & UI/UX Designer | Portfolio",
  description: "Professional web developer and UI/UX designer specializing in React, Next.js, and modern web technologies. Based in Kampala, Uganda, working globally.",
  keywords: ["web developer", "UI/UX designer", "React", "Next.js", "TypeScript", "portfolio", "Kampala", "Uganda", "freelance developer"],
  authors: [{ name: "Mbalire Henry" }],
  openGraph: {
    title: "Mbalire Henry — Web Developer & UI/UX Designer",
    description: "Creating beautiful, responsive, and user-friendly web experiences with modern technologies.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbalire Henry — Web Developer & UI/UX Designer",
    description: "Professional web developer specializing in React, Next.js, and creating exceptional user experiences.",
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
