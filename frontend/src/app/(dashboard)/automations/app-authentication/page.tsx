import { AppAuthenticationView } from "@/components/automations/app-authentication/app-authentication-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "App Authentication & Credentials | Appnix Automations",
  description: "Securely connect third-party apps and manage API credentials used in automated workflows.",
};

export default function AppAuthenticationPage() {
  return <AppAuthenticationView />;
}
