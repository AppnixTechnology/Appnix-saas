import type { Metadata } from "next";
import { PrivacyPolicyView } from "@/components/legal/PrivacyPolicyView";

export const metadata: Metadata = {
  title: "Appnix Technologies Privacy Policy",
  description: "Privacy Policy for Appnix Technologies and its WhatsApp Business communication SaaS platform.",
  alternates: {
    canonical: "https://www.appnix.co.in/privacy-policy",
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
    title: "Appnix Technologies Privacy Policy",
    description: "Privacy Policy for Appnix Technologies and its WhatsApp Business communication SaaS platform.",
    url: "https://www.appnix.co.in/privacy-policy",
    siteName: "Appnix Technologies",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Appnix Technologies Privacy Policy",
    description: "Privacy Policy for Appnix Technologies and its WhatsApp Business communication SaaS platform.",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
