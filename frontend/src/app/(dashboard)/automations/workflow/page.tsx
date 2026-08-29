"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Plus,
  ArrowLeft,
  Lock,
  FolderPlus,
  Folder,
  Eye,
  History,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Webhook,
  ImageIcon,
  Zap,
  MessageSquare,
} from "lucide-react";

// ---------- Types & data ----------
interface AppIcon {
  icon: React.ElementType;
  bg: string;
  color: string;
}

interface WorkflowRow {
  id: string;
  active: boolean;
  apps: AppIcon[];
  title: string;
  tags: string;
  folder: string;
  createdOn: string;
}

const FOLDERS = [
  { id: "all", name: "All", count: null },
  { id: "nourin", name: "Nourin", count: null },
];

const WORKFLOWS: WorkflowRow[] = [
  {
    id: "1",
    active: true,
    apps: [{ icon: Sparkles, bg: "bg-white border", color: "text-indigo-500" }],
    title: "test",
    tags: "--Double Click to Edit--",
    folder: "All",
    createdOn: "23 Feb, 2026",
  },
  {
    id: "2",
    active: true,
    apps: [{ icon: Sparkles, bg: "bg-white border", color: "text-indigo-500" }],
    title: "Untitled",
    tags: "--Double Click to Edit--",
    folder: "All",
    createdOn: "23 Feb, 2026",
  },
  {
    id: "3",
    active: false,
    apps: [
      { icon: Sparkles, bg: "bg-white border", color: "text-indigo-500" },
      { icon: Webhook, bg: "bg-blue-500", color: "text-white" },
      { icon: Zap, bg: "bg-green-600", color: "text-white" },
    ],
    title: "webhook test",
    tags: "--Double Click to Edit--",
    folder: "All",
    createdOn: "18 Feb, 2026",
  },
  {
    id: "4",
    active: true,
    apps: [
      { icon: Sparkles, bg: "bg-white border", color: "text-indigo-500" },
      { icon: ImageIcon, bg: "bg-pink-500", color: "text-white" },
    ],
    title: "image dynamic",
    tags: "--Double Click to Edit--",
    folder: "All",
    createdOn: "18 Feb, 2026",
  },
];

const TOTAL_RESULTS = 32;
const TOTAL_PAGES = 3;

import { CreateWorkflowModal } from "@/components/automations/CreateWorkflowModal";
import { UnlockWorkflowModal } from "@/components/automations/UnlockWorkflowModal";

// ---------- Page ----------
export default function WorkflowPage() {
  const [activeFolder, setActiveFolder] = useState("all");
  const [folders, setFolders] = useState(FOLDERS);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(WORKFLOWS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  const toggleRow = (id: string) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
    );

  const handleWorkflowCreated = (newWf: any) => {
    const newRow: WorkflowRow = {
      id: newWf.id,
      active: true,
      apps: [
        {
          icon: Sparkles,
          bg: "bg-emerald-500/10 border",
          color: "text-emerald-600",
        },
      ],
      title: newWf.title,
      tags: newWf.tags || "General",
      folder: newWf.folder || "All",
      createdOn: "Just now",
    };
    setRows([newRow, ...rows]);
  };

  const handleWorkflowUnlocked = (unlockedWf: any) => {
    const newRow: WorkflowRow = {
      id: unlockedWf.id,
      active: true,
      apps: [
        {
          icon: Sparkles,
          bg: "bg-amber-500/10 border",
          color: "text-amber-600",
        },
        { icon: Zap, bg: "bg-emerald-600", color: "text-white" },
      ],
      title: unlockedWf.title,
      tags:
        typeof unlockedWf.tags === "string"
          ? unlockedWf.tags
          : unlockedWf.tags?.join(", ") || "Premium, Unlocked",
      folder: unlockedWf.folder || "All",
      createdOn: "Just now",
    };
    setRows([newRow, ...rows]);
  };

  const handleFolderCreated = (name: string) => {
    const newId = `folder_${Date.now()}`;
    setFolders((prev) => [...prev, { id: newId, name, count: null }]);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center text-xs text-muted-foreground gap-1.5">
        <Link
          href="/automations"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Automations</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="text-foreground font-medium">Workflow</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-extrabold tracking-wide text-foreground">
          WORKFLOW
        </h1>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Create Workflow
          </Button>
          <Button variant="outline" onClick={() => setIsUnlockModalOpen(true)}>
            <Lock className="h-4 w-4 mr-1" />
            Unlock Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        {/* Folders sidebar */}
        <div className="h-fit rounded-lg border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Folders</h2>
            <button
              type="button"
              aria-label="Add folder"
              className="text-muted-foreground hover:text-foreground"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1">
            {FOLDERS.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setActiveFolder(folder.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeFolder === folder.id
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent",
                )}
              >
                <Folder className="h-4 w-4" />
                {folder.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24 text-xs font-bold tracking-wide">
                    STATUS
                  </TableHead>
                  <TableHead className="text-xs font-bold tracking-wide">
                    APPS
                  </TableHead>
                  <TableHead className="text-xs font-bold tracking-wide">
                    TITLE
                  </TableHead>
                  <TableHead className="text-xs font-bold tracking-wide">
                    TAGS
                  </TableHead>
                  <TableHead className="text-xs font-bold tracking-wide">
                    FOLDER
                  </TableHead>
                  <TableHead className="text-xs font-bold tracking-wide">
                    CREATED ON
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold tracking-wide">
                    ACTION
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Switch
                        checked={row.active}
                        onCheckedChange={() => toggleRow(row.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {row.apps.map((app, i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-full",
                              app.bg,
                              i !== 0 && "-ml-2 ring-2 ring-background",
                            )}
                          >
                            <app.icon
                              className={cn("h-3.5 w-3.5", app.color)}
                            />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary">
                        {row.title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm italic text-muted-foreground">
                        {row.tags}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {row.folder}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-foreground">
                      {row.createdOn}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1 text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <History className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer / pagination */}
          <div className="flex flex-col gap-3 border-t bg-secondary/30 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Showing {rows.length} of {TOTAL_RESULTS} results
            </p>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground disabled:opacity-40 hover:bg-accent"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold",
                    page === n
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                disabled={page === TOTAL_PAGES}
                onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground disabled:opacity-40 hover:bg-accent"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating actions */}
      <div className="fixed bottom-7 right-7 flex flex-col gap-3">
        <Button
          size="icon"
          className="h-11 w-11 rounded-full bg-green-600 shadow-lg hover:bg-green-700"
          aria-label="Quick actions"
        >
          <Zap className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-11 w-11 rounded-full shadow-lg"
          aria-label="Chat"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleWorkflowCreated}
        folders={folders}
        onFolderCreated={handleFolderCreated}
      />

      {/* Unlock Workflow Modal */}
      <UnlockWorkflowModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onWorkflowUnlocked={handleWorkflowUnlocked}
      />
    </div>
  );
}
