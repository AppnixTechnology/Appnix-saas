"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/lib/auth/auth-context";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  Users,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  CreditCard,
  UserPlus,
  LayoutGrid,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const contactsChartData = [
  { date: "18 Feb", contacts: 0 },
  { date: "25 Feb", contacts: 1 },
  { date: "04 Mar", contacts: 1 },
  { date: "11 Mar", contacts: 1 },
  { date: "18 Mar", contacts: 4 },
];

const recentCampaigns = [
  {
    id: 1,
    name: "Spring Outreach 2026",
    channel: "WhatsApp",
    status: "Active",
    reach: "1,240",
  },
  {
    id: 2,
    name: "Product Launch V2",
    channel: "Email",
    status: "Scheduled",
    reach: "5,000",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "message",
    title: "New message from John Doe",
    time: "2 min ago",
    status: "unread",
  },
  {
    id: 2,
    type: "campaign",
    title: "Campaign 'Summer Sale' sent",
    time: "15 min ago",
    status: "sent",
  },
  {
    id: 3,
    type: "bot",
    title: "Bot 'Support Bot' resolved ticket #1234",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    type: "automation",
    title: "Automation 'Welcome Series' triggered",
    time: "3 hours ago",
    status: "running",
  },
  {
    id: 5,
    type: "contact",
    title: "New contact added: Jane Smith",
    time: "5 hours ago",
    status: "added",
  },
];

const subscription = {
  plan: "Professional",
  totalDays: 90,
  remainingDays: 77,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = useMemo(
    () => [
      {
        name: t.dashboard.totalConversations,
        value: "2,847",
        change: "+12.5%",
        icon: MessageSquare,
        color: "bg-blue-500",
        trend: "up",
      },
      {
        name: t.dashboard.activeCampaigns,
        value: "24",
        change: "+3",
        icon: Send,
        color: "bg-purple-500",
        trend: "up",
      },
      {
        name: t.dashboard.botInteractions,
        value: "15,632",
        change: "+8.2%",
        icon: Bot,
        color: "bg-green-500",
        trend: "up",
      },
      {
        name: t.dashboard.automationsRunning,
        value: "12",
        change: "0",
        icon: Zap,
        color: "bg-orange-500",
        trend: "neutral",
      },
    ],
    [t]
  );

  const quickActions = useMemo(
    () => [
      {
        name: t.dashboard.startCampaign,
        description: "Create and track marketing campaigns and reports.",
        buttonText: t.dashboard.startCampaign,
        href: "/dashboard/campaigns/new",
        icon: Send,
        color: "bg-purple-500",
      },
      {
        name: t.dashboard.createBot,
        description: "Create, edit and manage automation bots.",
        buttonText: t.dashboard.createBot,
        href: "/dashboard/bots/new",
        icon: Bot,
        color: "bg-green-500",
      },
      {
        name: "New Automation",
        description: "Set up workflows that run automatically.",
        buttonText: "Set Up Automation",
        href: "/dashboard/automations/new",
        icon: Zap,
        color: "bg-orange-500",
      },
      {
        name: "Import Contacts",
        description: "Manage your customer contacts and segments.",
        buttonText: "Import Now",
        href: "/dashboard/contacts/import",
        icon: Users,
        color: "bg-blue-500",
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.auth.welcomeBack}, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
          >
            <Link href="/products">
              <LayoutGrid className="h-4 w-4" />
              {t.sidebar.products}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/campaigns/new">{t.dashboard.startCampaign}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/inbox">{t.dashboard.liveChat}</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  stat.color,
                )}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={cn(
                  "text-xs",
                  stat.trend === "up"
                    ? "text-green-600"
                    : "text-muted-foreground",
                )}
              >
                {stat.trend === "up" ? (
                  <>
                    <TrendingUp className="h-3 w-3 inline mr-1" />
                    {stat.change} vs last month
                  </>
                ) : (
                  "No change vs last month"
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contacts Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  {t.dashboard.contacts}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-md px-3 py-1.5">
                  <Calendar className="h-4 w-4" />
                  18-Feb-2026 to 18-Mar-2026
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="inline-block rounded-lg border bg-accent/30 px-4 py-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t.dashboard.contacts}
                </p>
                <p className="text-2xl font-bold">4</p>
              </div>

              <div className="h-64 w-full rounded-lg border bg-accent/10 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={contactsChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="contacts"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Number of New Contacts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.dashboard.activeCampaigns}</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/campaigns">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Reach</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCampaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.channel}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            c.status === "Active" &&
                              "bg-green-100 text-green-700",
                            c.status === "Scheduled" &&
                              "bg-muted text-muted-foreground",
                          )}
                        >
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{c.reach}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t.dashboard.recentActivity}</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/activity">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg transition-colors",
                      activity.status === "unread"
                        ? "bg-accent/50"
                        : "hover:bg-accent/30",
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                        activity.type === "message" &&
                          "bg-blue-100 text-blue-600",
                        activity.type === "campaign" &&
                          "bg-purple-100 text-purple-600",
                        activity.type === "bot" &&
                          "bg-green-100 text-green-600",
                        activity.type === "automation" &&
                          "bg-orange-100 text-orange-600",
                        activity.type === "contact" &&
                          "bg-pink-100 text-pink-600",
                      )}
                    >
                      {activity.type === "message" && (
                        <MessageSquare className="h-5 w-5" />
                      )}
                      {activity.type === "campaign" && (
                        <Send className="h-5 w-5" />
                      )}
                      {activity.type === "bot" && <Bot className="h-5 w-5" />}
                      {activity.type === "automation" && (
                        <Zap className="h-5 w-5" />
                      )}
                      {activity.type === "contact" && (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        activity.status === "unread" &&
                          "bg-blue-100 text-blue-700",
                        activity.status === "sent" &&
                          "bg-purple-100 text-purple-700",
                        activity.status === "completed" &&
                          "bg-green-100 text-green-700",
                        activity.status === "running" &&
                          "bg-orange-100 text-orange-700",
                        activity.status === "added" &&
                          "bg-pink-100 text-pink-700",
                      )}
                    >
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{subscription.totalDays}</p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
                <Badge className="bg-green-700 hover:bg-green-700">
                  {subscription.remainingDays} Days Remaining
                </Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-700 rounded-full"
                  style={{
                    width: `${(subscription.remainingDays / subscription.totalDays) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {subscription.totalDays - subscription.remainingDays} Days Used
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t.dashboard.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action) => (
                <div
                  key={action.name}
                  className="rounded-lg border p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <action.icon className="h-4 w-4 text-foreground" />
                    <span className="font-medium text-foreground">
                      {action.name}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  <Button
                    asChild
                    className={cn(
                      "w-full justify-between text-white",
                      action.color,
                      "hover:opacity-90",
                    )}
                  >
                    <Link href={action.href}>
                      {action.buttonText}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Workspace Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium text-foreground">Professional</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/billing">Upgrade</Link>
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Conversations this month
                    </span>
                    <span className="font-medium">1,247 / 10,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "12.47%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Team members</span>
                    <span className="font-medium">5 / 10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "50%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Bots active</span>
                    <span className="font-medium">3 / 5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
