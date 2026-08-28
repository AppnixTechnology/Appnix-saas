// "use client";

// import { useMemo } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableRow,
//   TableHead,
//   TableCell,
// } from "@/components/ui/table";
// import { useAuth } from "@/lib/auth/auth-context";
// import { useTranslation } from "@/lib/i18n";
// import { cn } from "@/lib/utils";
// import {
//   MessageSquare,
//   Send,
//   Bot,
//   Zap,
//   Users,
//   TrendingUp,
//   ArrowUpRight,
//   Calendar,
//   CreditCard,
//   UserPlus,
//   LayoutGrid,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const contactsChartData = [
//   { date: "18 Feb", contacts: 0 },
//   { date: "25 Feb", contacts: 1 },
//   { date: "04 Mar", contacts: 1 },
//   { date: "11 Mar", contacts: 1 },
//   { date: "18 Mar", contacts: 4 },
// ];

// const recentCampaigns = [
//   {
//     id: 1,
//     name: "Spring Outreach 2026",
//     channel: "WhatsApp",
//     status: "Active",
//     reach: "1,240",
//   },
//   {
//     id: 2,
//     name: "Product Launch V2",
//     channel: "Email",
//     status: "Scheduled",
//     reach: "5,000",
//   },
// ];

// const recentActivity = [
//   {
//     id: 1,
//     type: "message",
//     title: "New message from John Doe",
//     time: "2 min ago",
//     status: "unread",
//   },
//   {
//     id: 2,
//     type: "campaign",
//     title: "Campaign 'Summer Sale' sent",
//     time: "15 min ago",
//     status: "sent",
//   },
//   {
//     id: 3,
//     type: "bot",
//     title: "Bot 'Support Bot' resolved ticket #1234",
//     time: "1 hour ago",
//     status: "completed",
//   },
//   {
//     id: 4,
//     type: "automation",
//     title: "Automation 'Welcome Series' triggered",
//     time: "3 hours ago",
//     status: "running",
//   },
//   {
//     id: 5,
//     type: "contact",
//     title: "New contact added: Jane Smith",
//     time: "5 hours ago",
//     status: "added",
//   },
// ];

// const subscription = {
//   plan: "Professional",
//   totalDays: 90,
//   remainingDays: 77,
// };

// export default function DashboardPage() {
//   const { user } = useAuth();
//   const { t } = useTranslation();

//   const stats = useMemo(
//     () => [
//       {
//         name: t.dashboard.totalConversations,
//         value: "2,847",
//         change: "+12.5%",
//         icon: MessageSquare,
//         color: "bg-blue-500",
//         trend: "up",
//       },
//       {
//         name: t.dashboard.activeCampaigns,
//         value: "24",
//         change: "+3",
//         icon: Send,
//         color: "bg-purple-500",
//         trend: "up",
//       },
//       {
//         name: t.dashboard.botInteractions,
//         value: "15,632",
//         change: "+8.2%",
//         icon: Bot,
//         color: "bg-green-500",
//         trend: "up",
//       },
//       {
//         name: t.dashboard.automationsRunning,
//         value: "12",
//         change: "0",
//         icon: Zap,
//         color: "bg-orange-500",
//         trend: "neutral",
//       },
//     ],
//     [t]
//   );

//   const quickActions = useMemo(
//     () => [
//       {
//         name: t.dashboard.startCampaign,
//         description: "Create and track marketing campaigns and reports.",
//         buttonText: t.dashboard.startCampaign,
//         href: "/dashboard/campaigns/new",
//         icon: Send,
//         color: "bg-purple-500",
//       },
//       {
//         name: t.dashboard.createBot,
//         description: "Create, edit and manage automation bots.",
//         buttonText: t.dashboard.createBot,
//         href: "/dashboard/bots/new",
//         icon: Bot,
//         color: "bg-green-500",
//       },
//       {
//         name: "New Automation",
//         description: "Set up workflows that run automatically.",
//         buttonText: "Set Up Automation",
//         href: "/dashboard/automations/new",
//         icon: Zap,
//         color: "bg-orange-500",
//       },
//       {
//         name: "Import Contacts",
//         description: "Manage your customer contacts and segments.",
//         buttonText: "Import Now",
//         href: "/dashboard/contacts/import",
//         icon: Users,
//         color: "bg-blue-500",
//       },
//     ],
//     [t]
//   );

//   return (
//     <div className="space-y-6">
//       {/* Welcome Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-foreground">
//             {t.auth.welcomeBack}, {user?.name?.split(" ")[0] || "User"}!
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             {t.dashboard.subtitle}
//           </p>
//         </div>
//         <div className="flex flex-wrap items-center gap-2">
//           <Button
//             asChild
//             className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
//           >
//             <Link href="/products">
//               <LayoutGrid className="h-4 w-4" />
//               {t.sidebar.products}
//             </Link>
//           </Button>
// <Button asChild>
//             <Link href="/dashboard/campaigns/new">{t.dashboard.startCampaign}</Link>
//           </Button>
//           <Button asChild variant="outline">
//             <Link href="/crm/live-chat">{t.dashboard.liveChat}</Link>
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid */}
//    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.name}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-muted-foreground">
//                 {stat.name}
//               </CardTitle>
//               <div
//                 className={cn(
//                   "h-10 w-10 rounded-lg flex items-center justify-center",
//                   stat.color,
//                 )}
//               >
//                 <stat.icon className="h-5 w-5 text-white" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p
//                 className={cn(
//                   "text-xs",
//                   stat.trend === "up"
//                     ? "text-green-600"
//                     : "text-muted-foreground",
//                 )}
//               >
//                 {stat.trend === "up" ? (
//                   <>
//                     <TrendingUp className="h-3 w-3 inline mr-1" />
//                     {stat.change} vs last month
//                   </>
//                 ) : (
//                   "No change vs last month"
//                 )}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Two-column layout */}
//       <div className="grid gap-6 lg:grid-cols-3">
//         {/* LEFT COLUMN */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Contacts Overview */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between flex-wrap gap-2">
//                 <CardTitle className="flex items-center gap-2">
//                   <UserPlus className="h-5 w-5 text-primary" />
//                   {t.dashboard.contacts}
//                 </CardTitle>
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-md px-3 py-1.5">
//                   <Calendar className="h-4 w-4" />
//                   18-Feb-2026 to 18-Mar-2026
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="inline-block rounded-lg border bg-accent/30 px-4 py-3">
//                 <p className="text-xs text-muted-foreground uppercase tracking-wide">
//                   {t.dashboard.contacts}
//                 </p>
//                 <p className="text-2xl font-bold">4</p>
//               </div>

//               <div className="h-64 w-full rounded-lg border bg-accent/10 p-2">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={contactsChartData}>
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                     <XAxis dataKey="date" fontSize={12} />
//                     <YAxis allowDecimals={false} fontSize={12} />
//                     <Tooltip />
//                     <Line
//                       type="monotone"
//                       dataKey="contacts"
//                       stroke="hsl(var(--primary))"
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       name="Number of New Contacts"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Campaigns */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>{t.dashboard.activeCampaigns}</CardTitle>
//                 <Button asChild variant="ghost" size="sm">
//                   <Link href="/dashboard/campaigns">View All</Link>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//                <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
//               <Table className="min-w-[560px] sm:min-w-0">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Campaign Name</TableHead>
//                     <TableHead>Channel</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="text-right">Reach</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {recentCampaigns.map((c) => (
//                     <TableRow key={c.id}>
//                       <TableCell className="font-medium">{c.name}</TableCell>
//                       <TableCell>{c.channel}</TableCell>
//                       <TableCell>
//                         <Badge
//                           variant="secondary"
//                           className={cn(
//                             c.status === "Active" &&
//                               "bg-green-100 text-green-700",
//                             c.status === "Scheduled" &&
//                               "bg-muted text-muted-foreground",
//                           )}
//                         >
//                           {c.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="text-right">{c.reach}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Recent Activity */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>{t.dashboard.recentActivity}</CardTitle>
//                 <Button asChild variant="ghost" size="sm">
//                   <Link href="/dashboard/activity">View All</Link>
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentActivity.map((activity) => (
//                   <div
//                     key={activity.id}
//                     className={cn(
//                       "flex flex-wrap sm:flex-nowrap items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-colors",
//                       activity.status === "unread"
//                         ? "bg-accent/50"
//                         : "hover:bg-accent/30",
//                     )}
//                   >
//                     <div
//                       className={cn(
//                         "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
//                         activity.type === "message" &&
//                           "bg-blue-100 text-blue-600",
//                         activity.type === "campaign" &&
//                           "bg-purple-100 text-purple-600",
//                         activity.type === "bot" &&
//                           "bg-green-100 text-green-600",
//                         activity.type === "automation" &&
//                           "bg-orange-100 text-orange-600",
//                         activity.type === "contact" &&
//                           "bg-pink-100 text-pink-600",
//                       )}
//                     >
//                       {activity.type === "message" && (
//                         <MessageSquare className="h-5 w-5" />
//                       )}
//                       {activity.type === "campaign" && (
//                         <Send className="h-5 w-5" />
//                       )}
//                       {activity.type === "bot" && <Bot className="h-5 w-5" />}
//                       {activity.type === "automation" && (
//                         <Zap className="h-5 w-5" />
//                       )}
//                       {activity.type === "contact" && (
//                         <Users className="h-5 w-5" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-foreground">
//                         {activity.title}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {activity.time}
//                       </p>
//                     </div>
//                     <div
//                       className={cn(
//                         "px-2 py-1 rounded-full text-xs font-medium ml-auto sm:ml-0 shrink-0",
//                         activity.status === "unread" &&
//                           "bg-blue-100 text-blue-700",
//                         activity.status === "sent" &&
//                           "bg-purple-100 text-purple-700",
//                         activity.status === "completed" &&
//                           "bg-green-100 text-green-700",
//                         activity.status === "running" &&
//                           "bg-orange-100 text-orange-700",
//                         activity.status === "added" &&
//                           "bg-pink-100 text-pink-700",
//                       )}
//                     >
//                       {activity.status}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="space-y-6">
//           {/* Current Subscription */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <CreditCard className="h-5 w-5 text-primary" />
//                 Current Subscription
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-2xl font-bold">{subscription.totalDays}</p>
//                   <p className="text-xs text-muted-foreground">Total Days</p>
//                 </div>
//                 <Badge className="bg-green-700 hover:bg-green-700">
//                   {subscription.remainingDays} Days Remaining
//                 </Badge>
//               </div>
//               <div className="h-2 bg-muted rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-green-700 rounded-full"
//                   style={{
//                     width: `${(subscription.remainingDays / subscription.totalDays) * 100}%`,
//                   }}
//                 />
//               </div>
//               <p className="text-xs text-muted-foreground text-right">
//                 {subscription.totalDays - subscription.remainingDays} Days Used
//               </p>
//             </CardContent>
//           </Card>

//           {/* Quick Actions */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Zap className="h-5 w-5 text-primary" />
//                 {t.dashboard.quickActions}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {quickActions.map((action) => (
//                 <div
//                   key={action.name}
//                   className="rounded-lg border p-4 space-y-3"
//                 >
//                   <div className="flex items-center gap-2">
//                     <action.icon className="h-4 w-4 text-foreground" />
//                     <span className="font-medium text-foreground">
//                       {action.name}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     {action.description}
//                   </p>
//                   <Button
//                     asChild
//                     className={cn(
//                       "w-full justify-between text-white",
//                       action.color,
//                       "hover:opacity-90",
//                     )}
//                   >
//                     <Link href={action.href}>
//                       {action.buttonText}
//                       <ArrowUpRight className="h-4 w-4" />
//                     </Link>
//                   </Button>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Workspace Overview */}
//           <Card>
//             <CardHeader>
//               <CardTitle>{t.dashboard.title}</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Plan</p>
//                   <p className="font-medium text-foreground">Professional</p>
//                 </div>
//                 <Button variant="outline" size="sm" asChild>
//                   <Link href="/dashboard/billing">Upgrade</Link>
//                 </Button>
//               </div>
//               <div className="space-y-3">
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-muted-foreground">
//                       Conversations this month
//                     </span>
//                     <span className="font-medium">1,247 / 10,000</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-primary rounded-full"
//                       style={{ width: "12.47%" }}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-muted-foreground">Team members</span>
//                     <span className="font-medium">5 / 10</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-green-500 rounded-full"
//                       style={{ width: "50%" }}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-muted-foreground">Bots active</span>
//                     <span className="font-medium">3 / 5</span>
//                   </div>
//                   <div className="h-2 bg-muted rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-purple-500 rounded-full"
//                       style={{ width: "60%" }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }




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
  Activity,
  BarChart3,
  ChevronRight,
  CircleCheck,
  Headphones,
  Sparkles,
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
        iconClass: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300",
        accentClass: "bg-sky-500",
        trend: "up",
      },
      {
        name: t.dashboard.activeCampaigns,
        value: "24",
        change: "+3",
        icon: Send,
        iconClass: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
        accentClass: "bg-violet-500",
        trend: "up",
      },
      {
        name: t.dashboard.botInteractions,
        value: "15,632",
        change: "+8.2%",
        icon: Bot,
        iconClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300",
        accentClass: "bg-emerald-500",
        trend: "up",
      },
      {
        name: t.dashboard.automationsRunning,
        value: "12",
        change: "0",
        icon: Zap,
        iconClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300",
        accentClass: "bg-amber-500",
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
        iconClass: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300",
        buttonClass: "bg-violet-600 hover:bg-violet-700",
      },
      {
        name: t.dashboard.createBot,
        description: "Create, edit and manage automation bots.",
        buttonText: t.dashboard.createBot,
        href: "/dashboard/bots/new",
        icon: Bot,
        iconClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300",
        buttonClass: "bg-emerald-600 hover:bg-emerald-700",
      },
      {
        name: "New Automation",
        description: "Set up workflows that run automatically.",
        buttonText: "Set Up Automation",
        href: "/dashboard/automations/new",
        icon: Zap,
        iconClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300",
        buttonClass: "bg-amber-600 hover:bg-amber-700",
      },
      {
        name: "Import Contacts",
        description: "Manage your customer contacts and segments.",
        buttonText: "Import Now",
        href: "/dashboard/contacts/import",
        icon: Users,
        iconClass: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300",
        buttonClass: "bg-sky-600 hover:bg-sky-700",
      },
    ],
    [t]
  );

  return (
    <div className="space-y-5 sm:space-y-7 px-3 sm:px-0 pb-4">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 px-4 py-5 shadow-sm sm:px-6 sm:py-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              Workspace overview
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl break-words">
            {t.auth.welcomeBack}, {user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              {t.dashboard.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-end items-center gap-2">
          <Button
            asChild
            className="col-span-2 sm:col-span-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-md shadow-emerald-600/15 w-full sm:w-auto"
          >
            <Link href="/products">
              <LayoutGrid className="h-4 w-4" />
              {t.sidebar.products}
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto gap-1.5 shadow-sm">
            <Link href="/dashboard/campaigns/new">
              <Send className="h-4 w-4" />
              {t.dashboard.startCampaign}
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto gap-1.5 bg-background/70">
            <Link href="/crm/live-chat">
              <Headphones className="h-4 w-4" />
              {t.dashboard.liveChat}
            </Link>
          </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        {stats.map((stat) => (
          <Card key={stat.name} className="group relative min-w-0 overflow-hidden border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className={cn("absolute inset-x-0 top-0 h-0.5", stat.accentClass)} />
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2 px-4 sm:px-5 pt-4 sm:pt-5">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground leading-tight min-w-0 break-words">
                {stat.name}
              </CardTitle>
              <div
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  stat.iconClass,
                )}
              >
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-5 pb-4 sm:pb-5 min-w-0">
              <div className="text-2xl sm:text-[1.75rem] font-bold tracking-tight truncate">
                {stat.value}
              </div>
              <p
                className={cn(
                  "text-xs",
                  stat.trend === "up"
                    ? "text-green-600"
                    : "text-muted-foreground",
                )}
              >
                {stat.trend === "up" ? (
                  <span className="flex items-center flex-wrap gap-1">
                    <TrendingUp className="h-3 w-3 shrink-0" />
                  <span>{stat.change} from last month</span>
                  </span>
                ) : (
                  "No change vs last month"
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 w-full min-w-0">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          {/* Contacts Overview */}
          <Card className="min-w-0 border-border/70 shadow-sm">
            <CardHeader className="px-4 sm:px-6 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserPlus className="h-4 w-4 shrink-0" />
                  </span>
                  {t.dashboard.contacts}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground border rounded-lg bg-muted/40 px-2.5 sm:px-3 py-1.5 whitespace-nowrap">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>18-Feb-2026 to 18-Mar-2026</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="inline-block rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">
                  {t.dashboard.contacts}
                </p>
                <p className="mt-0.5 text-2xl font-bold tracking-tight">4</p>
              </div>

              <div className="h-56 sm:h-64 w-full max-w-full min-w-0 rounded-xl border border-border/70 bg-gradient-to-b from-primary/[0.04] to-transparent p-2 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={contactsChartData}
                    margin={{ top: 5, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      fontSize={10}
                      tickMargin={6}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      allowDecimals={false}
                      fontSize={10}
                      width={24}
                      tickMargin={2}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="contacts"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Number of New Contacts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Campaigns */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="px-4 sm:px-6 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300">
                    <Send className="h-4 w-4" />
                  </span>
                  {t.dashboard.activeCampaigns}
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                  <Link href="/dashboard/campaigns">View all <ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <Table className="min-w-[560px] sm:min-w-0">
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
                        <TableCell className="font-medium">
                          {c.name}
                        </TableCell>
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
                        <TableCell className="text-right">
                          {c.reach}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="px-4 sm:px-6 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
                    <Activity className="h-4 w-4" />
                  </span>
                  {t.dashboard.recentActivity}
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
                  <Link href="/dashboard/activity">View all <ChevronRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-transparent transition-colors",
                      activity.status === "unread"
                        ? "bg-primary/5 border-primary/10"
                        : "hover:bg-muted/50 hover:border-border/70",
                    )}
                  >
                    <div
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center shrink-0",
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
                        <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {activity.type === "campaign" && (
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {activity.type === "bot" && (
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {activity.type === "automation" && (
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      {activity.type === "contact" && (
                        <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                        <p className="font-medium text-foreground text-sm sm:text-base break-words">
                          {activity.title}
                        </p>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium shrink-0",
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
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 sm:space-y-6">
          {/* Current Subscription */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="px-4 sm:px-6 pb-3">
              <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
                  <CreditCard className="h-4 w-4 shrink-0" />
                </span>
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-3xl font-bold tracking-tight">
                    {subscription.totalDays}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </div>
                <Badge className="bg-emerald-600 hover:bg-emerald-600 shadow-sm">
                  {subscription.remainingDays} Days Remaining
                </Badge>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{
                    width: `${(subscription.remainingDays / subscription.totalDays) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {subscription.totalDays - subscription.remainingDays} Days
                Used
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="px-4 sm:px-6 pb-3">
              <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300">
                  <Zap className="h-4 w-4 shrink-0" />
                </span>
                {t.dashboard.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              {quickActions.map((action) => (
                <div
                  key={action.name}
                  className="group rounded-xl border border-border/70 bg-muted/[0.18] p-3 sm:p-4 space-y-3 transition-all hover:border-primary/25 hover:bg-primary/[0.03]"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", action.iconClass)}>
                      <action.icon className="h-4 w-4" />
                    </span>
                    <span className="font-semibold text-foreground text-sm sm:text-base">
                      {action.name}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  <Button
                    asChild
                    className={cn(
                      "w-full justify-between text-white shadow-sm",
                      action.buttonClass,
                    )}
                  >
                    <Link href={action.href}>
                      <span className="truncate">{action.buttonText}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Workspace Overview */}
          <Card className="border-border/70 shadow-sm">
            <CardHeader className="px-4 sm:px-6 pb-3">
              <CardTitle className="flex items-center gap-2.5 text-base sm:text-lg font-semibold tracking-tight">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300">
                  <BarChart3 className="h-4 w-4" />
                </span>
                {t.dashboard.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium text-foreground">Professional</p>
                </div>
                <Button variant="outline" size="sm" asChild className="gap-1">
                  <Link href="/dashboard/billing">Upgrade <ChevronRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 gap-2">
                    <span className="text-muted-foreground">
                      Conversations this month
                    </span>
                    <span className="font-medium shrink-0">
                      1,247 / 10,000
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: "12.47%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 gap-2">
                    <span className="text-muted-foreground">
                      Team members
                    </span>
                    <span className="font-medium shrink-0">5 / 10</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: "50%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-1 gap-2">
                    <span className="text-muted-foreground">
                      Bots active
                    </span>
                    <span className="font-medium shrink-0">3 / 5</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
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
