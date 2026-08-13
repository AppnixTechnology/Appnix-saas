"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  Users,
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    name: "Total Conversations",
    value: "2,847",
    change: "+12.5%",
    icon: MessageSquare,
    color: "bg-blue-500",
    trend: "up",
  },
  {
    name: "Active Campaigns",
    value: "24",
    change: "+3",
    icon: Send,
    color: "bg-purple-500",
    trend: "up",
  },
  {
    name: "Bot Interactions",
    value: "15,632",
    change: "+8.2%",
    icon: Bot,
    color: "bg-green-500",
    trend: "up",
  },
  {
    name: "Automations Running",
    value: "12",
    change: "0",
    icon: Zap,
    color: "bg-orange-500",
    trend: "neutral",
  },
];

const recentActivity = [
  { id: 1, type: "message", title: "New message from John Doe", time: "2 min ago", status: "unread" },
  { id: 2, type: "campaign", title: "Campaign 'Summer Sale' sent", time: "15 min ago", status: "sent" },
  { id: 3, type: "bot", title: "Bot 'Support Bot' resolved ticket #1234", time: "1 hour ago", status: "completed" },
  { id: 4, type: "automation", title: "Automation 'Welcome Series' triggered", time: "3 hours ago", status: "running" },
  { id: 5, type: "contact", title: "New contact added: Jane Smith", time: "5 hours ago", status: "added" },
];

const quickActions = [
  { name: "New Campaign", href: "/dashboard/campaigns/new", icon: Send, color: "bg-purple-500" },
  { name: "Create Bot", href: "/dashboard/bots/new", icon: Bot, color: "bg-green-500" },
  { name: "New Automation", href: "/dashboard/automations/new", icon: Zap, color: "bg-orange-500" },
  { name: "Import Contacts", href: "/dashboard/contacts/import", icon: Users, color: "bg-blue-500" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href="/dashboard/campaigns/new">Create Campaign</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard/inbox">Open Inbox</a>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", stat.color)}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={cn("text-xs", stat.trend === "up" ? "text-green-600" : "text-muted-foreground")}>
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <a href="/dashboard/activity">View All</a>
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
                    activity.status === "unread" ? "bg-accent/50" : "hover:bg-accent/30"
                  )}
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                      activity.type === "message" && "bg-blue-100 text-blue-600",
                      activity.type === "campaign" && "bg-purple-100 text-purple-600",
                      activity.type === "bot" && "bg-green-100 text-green-600",
                      activity.type === "automation" && "bg-orange-100 text-orange-600",
                      activity.type === "contact" && "bg-pink-100 text-pink-600"
                    )}
                  >
                    {activity.type === "message" && <MessageSquare className="h-5 w-5" />}
                    {activity.type === "campaign" && <Send className="h-5 w-5" />}
                    {activity.type === "bot" && <Bot className="h-5 w-5" />}
                    {activity.type === "automation" && <Zap className="h-5 w-5" />}
                    {activity.type === "contact" && <Users className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    activity.status === "unread" && "bg-blue-100 text-blue-700",
                    activity.status === "sent" && "bg-purple-100 text-purple-700",
                    activity.status === "completed" && "bg-green-100 text-green-700",
                    activity.status === "running" && "bg-orange-100 text-orange-700",
                    activity.status === "added" && "bg-pink-100 text-pink-700"
                  )}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.name}
                    asChild
                    variant="outline"
                    className="h-20 flex-col gap-2 justify-center"
                  >
                    <a href={action.href}>
                      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", action.color)}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium text-foreground">Professional</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard/billing">Upgrade</a>
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Conversations this month</span>
                    <span className="font-medium">1,247 / 10,000</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "12.47%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Team members</span>
                    <span className="font-medium">5 / 10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Bots active</span>
                    <span className="font-medium">3 / 5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "60%" }} />
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