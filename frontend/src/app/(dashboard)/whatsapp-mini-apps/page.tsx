"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Lock,
  RefreshCw,
  Plus,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  MessageCircle,
} from "lucide-react";

// ---------- Types & data ----------
type FlowStatus = "DRAFT" | "PENDING" | "PUBLISH";

interface Flow {
  id: string;
  name: string;
  status: FlowStatus;
  channel: string;
  category: string;
}

const FLOWS: Flow[] = [
  {
    id: "1432432311703148",
    name: "testing calendar booking",
    status: "DRAFT",
    channel: "01 Automations",
    category: "Appointment Booking",
  },
  {
    id: "1023034210890264",
    name: "test meet",
    status: "PENDING",
    channel: "01 Automations",
    category: "Appointment Booking",
  },
  {
    id: "2751767651840230",
    name: "testing purpose flow",
    status: "PUBLISH",
    channel: "01 Automations",
    category: "Lead Generation",
  },
  {
    id: "1430880388746054",
    name: "example flow",
    status: "PUBLISH",
    channel: "01 Automations",
    category: "Lead Generation",
  },
  {
    id: "937299775331284",
    name: "inquiry data",
    status: "DRAFT",
    channel: "01 Automations",
    category: "Lead Generation",
  },
];

const TOTAL_RESULTS = 32;
const TOTAL_PAGES = 3;

function StatusBadge({ status }: { status: FlowStatus }) {
  const styles: Record<FlowStatus, string> = {
    DRAFT: "bg-blue-100 text-blue-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    PUBLISH: "bg-green-100 text-green-700",
  };

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 font-semibold tracking-wide", styles[status])}
    >
      {status === "PUBLISH" && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}
      {status}
    </Badge>
  );
}

function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy flow ID"
    >
      <span className="font-mono">{id}</span>
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );
}

export default function FlowsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredFlows = useMemo(() => {
    if (!query.trim()) return FLOWS;
    return FLOWS.filter((flow) =>
      flow.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Flows
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your WhatsApp mini-app conversation flows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Lock className="h-4 w-4" />
            Unlock
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Create New Flow
          </Button>
        </div>
      </div>

      {/* Card */}
      <Card>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search flow with name ..."
              className="pl-9"
            />
          </div>

          {/* Table (desktop / tablet) */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STATUS</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>CHANNEL</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead className="text-right">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlows.map((flow) => (
                  <TableRow key={flow.id}>
                    <TableCell>
                      <StatusBadge status={flow.status} />
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-primary">{flow.name}</p>
                      <CopyId id={flow.id} />
                    </TableCell>
                    <TableCell className="text-primary">{flow.channel}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {flow.category}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      —
                    </TableCell>
                  </TableRow>
                ))}

                {filteredFlows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-10"
                    >
                      No flows match “{query}”.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card list (mobile) */}
          <div className="sm:hidden divide-y">
            {filteredFlows.map((flow) => (
              <div key={flow.id} className="py-4 space-y-2">
                <StatusBadge status={flow.status} />
                <p className="font-semibold text-primary">{flow.name}</p>
                <CopyId id={flow.id} />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-primary">{flow.channel}</span>
                  <span className="text-muted-foreground">{flow.category}</span>
                </div>
              </div>
            ))}

            {filteredFlows.length === 0 && (
              <p className="text-center text-muted-foreground py-10">
                No flows match “{query}”.
              </p>
            )}
          </div>

          {/* Footer / pagination */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
            <p className="text-sm text-yellow-700">
              Showing {filteredFlows.length} of {TOTAL_RESULTS} results
            </p>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  size="icon"
                  variant={page === n ? "default" : "outline"}
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
                disabled={page === TOTAL_PAGES}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          aria-label="Quick actions"
        >
          <Zap className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          aria-label="Chat support"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}