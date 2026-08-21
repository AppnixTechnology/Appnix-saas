"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ShieldCheck,
  Plus,
  Users,
  KeyRound,
  Lock,
  Check,
  X,
  Search,
  CheckCircle2,
  Shield,
  Edit2,
  Trash2,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  badgeTone: "purple" | "blue" | "green" | "amber" | "slate";
}

const initialRoles: Role[] = [
  {
    id: "super-admin",
    name: "Super Administrator",
    description: "Full root access to all modules, billing, security, and global workspace settings.",
    userCount: 3,
    badgeTone: "purple",
  },
  {
    id: "dept-manager",
    name: "Department Manager",
    description: "Can manage department units, allocate members, view full analytics, and assign workloads.",
    userCount: 8,
    badgeTone: "blue",
  },
  {
    id: "team-lead",
    name: "Team Lead / Supervisor",
    description: "Supervises live chats, assigns tickets, creates botflows, and monitors SLA performance.",
    userCount: 16,
    badgeTone: "green",
  },
  {
    id: "agent",
    name: "Operations Agent",
    description: "Can interact with live chats, dispatch approved campaigns, and manage assigned contacts.",
    userCount: 64,
    badgeTone: "amber",
  },
  {
    id: "viewer",
    name: "Read-Only Viewer",
    description: "Audit and reporting access with strictly no edit or execution permissions.",
    userCount: 12,
    badgeTone: "slate",
  },
];

interface ModulePermission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  admin: boolean;
}

const defaultPermissions: Record<string, ModulePermission[]> = {
  "super-admin": [
    { module: "Dashboard & Analytics", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "Channels & Integrations", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "CRM & Contacts", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "Bulk Campaigns", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "Live Chat & Inbox", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "Chatbots & Automations", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "Department Management", view: true, create: true, edit: true, delete: true, admin: true },
    { module: "Workspace & Security", view: true, create: true, edit: true, delete: true, admin: true },
  ],
  "dept-manager": [
    { module: "Dashboard & Analytics", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Channels & Integrations", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "CRM & Contacts", view: true, create: true, edit: true, delete: true, admin: false },
    { module: "Bulk Campaigns", view: true, create: true, edit: true, delete: true, admin: false },
    { module: "Live Chat & Inbox", view: true, create: true, edit: true, delete: true, admin: false },
    { module: "Chatbots & Automations", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Department Management", view: true, create: true, edit: true, delete: false, admin: true },
    { module: "Workspace & Security", view: true, create: false, edit: false, delete: false, admin: false },
  ],
  "team-lead": [
    { module: "Dashboard & Analytics", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Channels & Integrations", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "CRM & Contacts", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Bulk Campaigns", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Live Chat & Inbox", view: true, create: true, edit: true, delete: true, admin: false },
    { module: "Chatbots & Automations", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Department Management", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Workspace & Security", view: false, create: false, edit: false, delete: false, admin: false },
  ],
  agent: [
    { module: "Dashboard & Analytics", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Channels & Integrations", view: false, create: false, edit: false, delete: false, admin: false },
    { module: "CRM & Contacts", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Bulk Campaigns", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Live Chat & Inbox", view: true, create: true, edit: true, delete: false, admin: false },
    { module: "Chatbots & Automations", view: false, create: false, edit: false, delete: false, admin: false },
    { module: "Department Management", view: false, create: false, edit: false, delete: false, admin: false },
    { module: "Workspace & Security", view: false, create: false, edit: false, delete: false, admin: false },
  ],
  viewer: [
    { module: "Dashboard & Analytics", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Channels & Integrations", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "CRM & Contacts", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Bulk Campaigns", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Live Chat & Inbox", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Chatbots & Automations", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Department Management", view: true, create: false, edit: false, delete: false, admin: false },
    { module: "Workspace & Security", view: false, create: false, edit: false, delete: false, admin: false },
  ],
};

export default function DepartmentRolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<string>("dept-manager");
  const [permissionsMap, setPermissionsMap] = useState<Record<string, ModulePermission[]>>(defaultPermissions);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const activePerms = permissionsMap[selectedRole] || defaultPermissions["agent"];

  const togglePerm = (moduleIndex: number, field: keyof Omit<ModulePermission, "module">) => {
    setPermissionsMap((prev) => {
      const currentList = [...(prev[selectedRole] || defaultPermissions["agent"])];
      const target = { ...currentList[moduleIndex] };
      target[field] = !target[field];
      currentList[moduleIndex] = target;
      return { ...prev, [selectedRole]: currentList };
    });
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newId = newRoleName.toLowerCase().replace(/\s+/g, "-");
    const newRole: Role = {
      id: newId,
      name: newRoleName.trim(),
      description: newRoleDesc.trim() || "Custom defined role for department staff.",
      userCount: 0,
      badgeTone: "blue",
    };

    setRoles([...roles, newRole]);
    setPermissionsMap({
      ...permissionsMap,
      [newId]: defaultPermissions["agent"].map((p) => ({ ...p })),
    });
    setSelectedRole(newId);
    setNewRoleName("");
    setNewRoleDesc("");
    setIsAddRoleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Department</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="font-semibold text-primary">Roles & Permissions</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Roles & Permissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure access control, privileges, and feature visibility across organizational roles.
          </p>
        </div>

        <Button
          onClick={() => setIsAddRoleModalOpen(true)}
          className="bg-primary text-primary-foreground gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create New Role
        </Button>
      </div>

      {/* Role Selector Cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {roles.map((r) => {
          const isSelected = selectedRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={cn(
                "flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-foreground truncate">
                  {r.name}
                </span>
                <span className="text-[10px] font-semibold bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                  {r.userCount} users
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {r.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
        <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-muted/20">
          <div>
            <h2 className="font-bold text-sm text-foreground">
              Permission Matrix for:{" "}
              <span className="text-primary font-extrabold">
                {roles.find((r) => r.id === selectedRole)?.name}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Toggle specific capabilities for members assigned to this role.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs self-end sm:self-auto gap-1"
            onClick={() => alert("Permissions successfully saved!")}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Save Changes
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-3.5 text-left min-w-48">System Module</th>
                <th className="p-3.5 text-center w-24">View</th>
                <th className="p-3.5 text-center w-24">Create</th>
                <th className="p-3.5 text-center w-24">Edit</th>
                <th className="p-3.5 text-center w-24">Delete</th>
                <th className="p-3.5 text-center w-24">Admin</th>
              </tr>
            </thead>
            <tbody>
              {activePerms.map((perm, idx) => (
                <tr key={perm.module} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 font-medium text-xs text-foreground">
                    {perm.module}
                  </td>
                  <td className="p-3.5 text-center">
                    <Checkbox
                      checked={perm.view}
                      onCheckedChange={() => togglePerm(idx, "view")}
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <Checkbox
                      checked={perm.create}
                      onCheckedChange={() => togglePerm(idx, "create")}
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <Checkbox
                      checked={perm.edit}
                      onCheckedChange={() => togglePerm(idx, "edit")}
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <Checkbox
                      checked={perm.delete}
                      onCheckedChange={() => togglePerm(idx, "delete")}
                    />
                  </td>
                  <td className="p-3.5 text-center">
                    <Checkbox
                      checked={perm.admin}
                      onCheckedChange={() => togglePerm(idx, "admin")}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Role Modal */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl animate-in">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-bold text-foreground">Create Custom Role</h2>
              <button
                onClick={() => setIsAddRoleModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Role Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Campaign Specialist"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="h-9"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary of responsibilities and authorization limits..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddRoleModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-primary-foreground">
                  Create Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
