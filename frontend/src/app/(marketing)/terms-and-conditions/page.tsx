import type { Metadata } from "next";
import { TermsAndConditionsView } from "@/components/legal/TermsAndConditionsView";

export const metadata: Metadata = {
  title: "Appnix Technologies Terms & Conditions",
  description: "Terms and Conditions governing use of the Appnix Technologies SaaS platform.",
  alternates: {
    canonical: "https://appnix.co.in/terms-and-conditions",
  },
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
    title: "Appnix Technologies Terms & Conditions",
    description: "Terms and Conditions governing use of the Appnix Technologies SaaS platform.",
    url: "https://appnix.co.in/terms-and-conditions",
    siteName: "Appnix Technologies",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Appnix Technologies Terms & Conditions",
    description: "Terms and Conditions governing use of the Appnix Technologies SaaS platform.",
  },
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsView />;
}
