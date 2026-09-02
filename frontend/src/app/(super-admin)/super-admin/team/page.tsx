"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StaffMember } from "@/super-admin/types";
import { staffService } from "@/super-admin/services";
import { AddStaffModal } from "@/super-admin/components/team/AddStaffModal";
import {
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Plus,
  Search,
  Mail,
  Clock,
  UserX,
  Edit2,
} from "lucide-react";

export default function SuperAdminTeamPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchStaff = () => {
    staffService.getAll().then(setStaffList);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staffList.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Team & Staff</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            <ShieldCheck className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Team & Operational Staff
          </h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Manage platform root administrators, support specialists, billing operators, and role-based permissions.
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full gap-1.5 bg-primary text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8.5 bg-background pl-8.5 text-xs"
          />
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Showing {filteredStaff.length} members
        </div>
      </div>

      {/* Staff Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 text-left">Staff Member</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Account Status</th>
                <th className="p-4 text-left">Last Active</th>
                <th className="p-4 text-left">Added</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b text-xs transition-colors last:border-0 hover:bg-muted/30"
                >
                  {/* Name & Avatar */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{staff.name}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {staff.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2 py-0.5 text-[10px] font-bold",
                        staff.role === "Super Admin" && "border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
                        staff.role === "Admin" && "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                        staff.role === "Developer" && "border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
                        staff.role === "Billing Manager" && "border-primary/30 bg-primary/10 text-primary",
                        staff.role === "Support Agent" && "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      )}
                    >
                      {staff.role}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] font-semibold",
                        staff.status === "Active" && "bg-primary/10 text-primary",
                        staff.status === "Inactive" && "bg-muted text-muted-foreground",
                        staff.status === "Suspended" && "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      )}
                    >
                      {staff.status}
                    </Badge>
                  </td>

                  {/* Last Active */}
                  <td className="whitespace-nowrap p-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      <span>{staff.lastActive}</span>
                    </div>
                  </td>

                  {/* Added Date */}
                  <td className="whitespace-nowrap p-4 text-muted-foreground">
                    {staff.createdAt}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => alert(`Editing permissions for ${staff.name}`)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => alert(`Deactivating account for ${staff.name}`)}
                        className="h-8 w-8 text-muted-foreground hover:text-rose-600"
                      >
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStaffAdded={(newStaff) => {
          staffService.create(newStaff).then(() => {
            fetchStaff();
            alert(`Staff member ${newStaff.name} created!`);
          });
        }}
      />
    </div>
  );
}