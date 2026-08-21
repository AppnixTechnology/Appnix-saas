import { redirect } from "next/navigation";

export default function DepartmentIndexPage() {
  redirect("/department/departments");
}