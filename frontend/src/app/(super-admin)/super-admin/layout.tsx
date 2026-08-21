import { SuperAdminLayout } from "@/super-admin/layouts/SuperAdminLayout";

export const metadata = {
  title: "Super Admin Console — Appnix",
  description: "Appnix Platform Super Admin Management Console",
};

export default function RootSuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}
