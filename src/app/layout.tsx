import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#DC2626",
};

export const metadata: Metadata = {
  title: "AETHRIZ — Intelligent Health, Personalized",
  description: "Next-generation healthcare intelligence platform by Aethriz AI Healthcare And Advanced Research Private Limited. Real-time multi-modal diagnostics, 3D anatomical exploration, and clinical telehealth.",
  icons: {
    icon: [
      { url: "/brand/aethriz-hero-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/aethriz-hero-logo.png", sizes: "any" },
    ],
    apple: [
      { url: "/brand/aethriz-hero-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F1F5F9] text-[#1D1F22] antialiased selection:bg-[#E3202B] selection:text-white">
        {children}
      </body>
    </html>
  );
}
