import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  // Fixes: "metadataBase property in metadata export is not set..." warning.
  // Used to resolve relative URLs (like /og-image.png below) into absolute
  // URLs for Open Graph / Twitter cards. Falls back to appnix.com if
  // NEXT_PUBLIC_SITE_URL isn't set in the environment.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://appnix.co.in"),
  title: {
    default: "Appnix - Unified Business Messaging & Marketing Platform",
    template: "%s | Appnix",
  },
  description: "WhatsApp Business API, RCS, Instagram, Facebook Marketing - White-Label SaaS Platform",
  keywords: [
    "WhatsApp Business API",
    "RCS",
    "Instagram Marketing",
    "Facebook Marketing",
    "White-label SaaS",
    "Business Messaging",
    "Omnichannel Communication",
    "Chatbot Builder",
    "Campaign Management",
  ],
  authors: [{ name: "Appnix Technologies" }],
  creator: "Appnix Technologies",
  publisher: "Appnix Technologies",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://appnix.co.in",
    siteName: "Appnix",
    title: "Appnix - Unified Business Messaging & Marketing Platform",
    description: "WhatsApp Business API, RCS, Instagram, Facebook Marketing - White-Label SaaS Platform",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Appnix Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Appnix - Unified Business Messaging & Marketing Platform",
    description: "WhatsApp Business API, RCS, Instagram, Facebook Marketing - White-Label SaaS Platform",
    images: ["/og-image.png"],
    creator: "@appnixtech",
  },
  icons: {
    icon: "/logo-favicon.png",
    shortcut: "/logo-favicon.png",
    apple: "/logo-favicon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}