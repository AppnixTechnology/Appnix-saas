// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import {
//   Bot,
//   Zap,
//   ShoppingBag,
//   Grid3x3,
//   MessageSquare,
//   ArrowLeftRight,
//   ArrowLeft,
//   ChevronRight,
//   Gift,
//   CreditCard,
//   Sparkles,
//   Users,
//   FolderArchive,
//   Building2,
//   ArrowRight,
//   Layers,
// } from "lucide-react";

// interface ProductItem {
//   id: string;
//   name: string;
//   description: string;
//   route: string;
//   icon: React.ElementType;
//   iconBg: string;
//   iconColor: string;
//   badge?: string;
//   ctaText: string;
// }

// const productsList: ProductItem[] = [
//   {
//     id: "bot-builder",
//     name: "Bot Builder",
//     description: "Create chat bots with our Visual Flow Builder.",
//     route: "/chatbots",
//     icon: Bot,
//     iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
//     iconColor: "text-emerald-600 dark:text-emerald-400",
//     ctaText: "Go To Bot Builder",
//   },
//   {
//     id: "automation-builder",
//     name: "Automation Builder",
//     description: "Drag-n-Drop Visual Software Automation Builder.",
//     route: "/automations/workflow",
//     icon: Zap,
//     iconBg: "bg-amber-50 dark:bg-amber-950/50",
//     iconColor: "text-amber-600 dark:text-amber-400",
//     ctaText: "Go To Automation Builder",
//   },
//   {
//     id: "ecommerce",
//     name: "Ecommerce",
//     description: "One Stop Solution for your ecommerce activities.",
//     route: "/channels",
//     icon: ShoppingBag,
//     iconBg: "bg-blue-50 dark:bg-blue-950/50",
//     iconColor: "text-blue-600 dark:text-blue-400",
//     ctaText: "Go To Ecommerce",
//   },
//   {
//     id: "whatsapp-mini-apps",
//     name: "WhatsApp MiniApps",
//     description: "Create Advanced Form With WhatsApp Native Flows.",
//     route: "/whatsapp-mini-apps",
//     icon: Grid3x3,
//     iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
//     iconColor: "text-emerald-600 dark:text-emerald-400",
//     ctaText: "Go To WhatsApp MiniApps",
//   },
//   {
//     id: "chat-widget",
//     name: "Chat Widget",
//     description: "Create Fully Customizable Chat Widget for Your Website.",
//     route: "/chat-widget",
//     icon: MessageSquare,
//     iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
//     iconColor: "text-indigo-600 dark:text-indigo-400",
//     ctaText: "Go To Chat Widget",
//   },
//   {
//     id: "channels",
//     name: "Channels",
//     description: "One stop solution to manage your channels.",
//     route: "/channels",
//     icon: ArrowLeftRight,
//     iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
//     iconColor: "text-cyan-600 dark:text-cyan-400",
//     ctaText: "Go To Channels",
//   },
//   {
//     id: "rewardz",
//     name: "Rewardz",
//     description: "Manage Reward Points On Each Transaction Of Your User.",
//     route: "/workspace/wallet",
//     icon: Gift,
//     iconBg: "bg-pink-50 dark:bg-pink-950/50",
//     iconColor: "text-pink-600 dark:text-pink-400",
//     ctaText: "Go To Rewardz",
//   },
//   {
//     id: "payments",
//     name: "Payments",
//     description: "Manage Payment Gateways and Subscriptions.",
//     route: "/workspace/billing",
//     icon: CreditCard,
//     iconBg: "bg-purple-50 dark:bg-purple-950/50",
//     iconColor: "text-purple-600 dark:text-purple-400",
//     ctaText: "Go To Payments",
//   },
//   {
//     id: "dynamic-experiences",
//     name: "Dynamic Experiences",
//     description: "Create Dynamic Images with Dynamic Experiences.",
//     route: "/automations/templates",
//     icon: Sparkles,
//     iconBg: "bg-orange-50 dark:bg-orange-950/50",
//     iconColor: "text-orange-600 dark:text-orange-400",
//     ctaText: "Go To Dynamic Experiences",
//   },
//   {
//     id: "crm-v2",
//     name: "CRM V2",
//     description: "A New and Advanced Version of CRM With More New Features.",
//     route: "/crm/contacts",
//     icon: Users,
//     iconBg: "bg-blue-50 dark:bg-blue-950/50",
//     iconColor: "text-blue-600 dark:text-blue-400",
//     badge: "V2 NEW",
//     ctaText: "Go To CRM V2",
//   },
//   {
//     id: "media-manager",
//     name: "Media Manager",
//     description: "Manage Your Media Files With Media Manager Bot.",
//     route: "/automations/datastore",
//     icon: FolderArchive,
//     iconBg: "bg-slate-100 dark:bg-slate-800",
//     iconColor: "text-slate-700 dark:text-slate-300",
//     ctaText: "Go To Media Manager",
//   },
//   {
//     id: "departments",
//     name: "Departments",
//     description: "Efficiently organize and manage your organizational departments.",
//     route: "/department/departments",
//     icon: Building2,
//     iconBg: "bg-teal-50 dark:bg-teal-950/50",
//     iconColor: "text-teal-600 dark:text-teal-400",
//     ctaText: "Go To Departments",
//   },
// ];

// export default function ProductsOverviewPage() {
//   return (
//     <div className="space-y-6">
//       {/* Breadcrumb Back Navigation */}
//       <div className="flex items-center text-xs text-muted-foreground gap-1.5">
//         <Link
//           href="/dashboard"
//           className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
//         >
//           <ArrowLeft className="h-3.5 w-3.5" />
//           <span>Dashboard</span>
//         </Link>
//         <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
//         <span className="font-semibold text-foreground">Products</span>
//       </div>

//       {/* Page Title & Intro */}
//       <div>
//         <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
//           <Layers className="h-6 w-6 text-emerald-600" />
//           Products & Feature Suite
//         </h1>
//         <p className="mt-1 text-sm text-muted-foreground">
//           Explore and launch all powerful visual builders, omnichannel bots, and business automation products.
//         </p>
//       </div>

//       {/* Products Responsive Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//         {productsList.map((prod) => {
//           const Icon = prod.icon;
//           return (
//             <div
//               key={prod.id}
//               className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-xs hover:shadow-md transition-all duration-200 border-border/80 group"
//             >
//               <div>
//                 {/* Icon row & badge */}
//                 <div className="flex items-start justify-between mb-4">
//                   <div
//                     className={cn(
//                       "flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
//                       prod.iconBg,
//                       prod.iconColor
//                     )}
//                   >
//                     <Icon className="h-6 w-6" />
//                   </div>

//                   {prod.badge && (
//                     <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5">
//                       {prod.badge}
//                     </Badge>
//                   )}
//                 </div>

//                 {/* Title & Description */}
//                 <h3 className="text-base font-bold text-foreground group-hover:text-emerald-600 transition-colors">
//                   {prod.name}
//                 </h3>
//                 <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed min-h-10">
//                   {prod.description}
//                 </p>
//               </div>

//               {/* Full-width Green CTA Button */}
//               <div className="mt-5 pt-3 border-t border-border/40">
//                 <Button
//                   asChild
//                   className="w-full justify-between bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 shadow-xs transition-colors"
//                 >
//                   <Link href={prod.route} className="flex items-center justify-between w-full">
//                     <span>{prod.ctaText}</span>
//                     <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FaWhatsapp } from "react-icons/fa";
import {
  Bot,
  Zap,
  ShoppingBag,
  MessageSquare,
  ArrowLeftRight,
  ArrowLeft,
  ChevronRight,
  Gift,
  Wallet,
  ImagePlus,
  Users,
  FolderArchive,
  Building2,
  ArrowRight,
  Layers,
} from "lucide-react";

interface ProductItem {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  ctaText: string;
}

const productsList: ProductItem[] = [
  {
    id: "bot-builder",
    name: "Bot Builder",
    description: "Create chat bots with our Visual Flow Builder.",
    route: "/chatbots",
    icon: Bot,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    ctaText: "Go To Bot Builder",
  },
  {
    id: "automation-builder",
    name: "Automation Builder",
    description: "Drag-n-Drop Visual Software Automation Builder.",
    route: "/automations/workflow",
    icon: Zap,
    iconBg: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    ctaText: "Go To Automation Builder",
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    description: "One Stop Solution for your ecommerce activities.",
    route: "/channels",
    icon: ShoppingBag,
    iconBg: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    ctaText: "Go To Ecommerce",
  },
  {
    id: "whatsapp-mini-apps",
    name: "WhatsApp MiniApps",
    description: "Create Advanced Form With WhatsApp Native Flows.",
    route: "/whatsapp-mini-apps",
    icon: FaWhatsapp,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-[#25D366]",
    ctaText: "Go To WhatsApp MiniApps",
  },
  {
    id: "chat-widget",
    name: "Chat Widget",
    description: "Create Fully Customizable Chat Widget for Your Website.",
    route: "/chat-widget",
    icon: MessageSquare,
    iconBg: "bg-indigo-50 dark:bg-indigo-950/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    ctaText: "Go To Chat Widget",
  },
  {
    id: "channels",
    name: "Channels",
    description: "One stop solution to manage your channels.",
    route: "/channels",
    icon: ArrowLeftRight,
    iconBg: "bg-cyan-50 dark:bg-cyan-950/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    ctaText: "Go To Channels",
  },
  {
    id: "rewardz",
    name: "Rewardz",
    description: "Manage Reward Points On Each Transaction Of Your User.",
    route: "/workspace/wallet",
    icon: Gift,
    iconBg: "bg-pink-50 dark:bg-pink-950/50",
    iconColor: "text-pink-600 dark:text-pink-400",
    ctaText: "Go To Rewardz",
  },
  {
    id: "payments",
    name: "Payments",
    description: "Manage Payment Gateways and Subscriptions.",
    route: "/workspace/billing",
    icon: Wallet,
    iconBg: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    ctaText: "Go To Payments",
  },
  {
    id: "dynamic-experiences",
    name: "Dynamic Experiences",
    description: "Create Dynamic Images with Dynamic Experiences.",
    route: "/automations/templates",
    icon: ImagePlus,
    iconBg: "bg-orange-50 dark:bg-orange-950/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    ctaText: "Go To Dynamic Experiences",
  },
  {
    id: "crm-v2",
    name: "CRM V2",
    description: "A New and Advanced Version of CRM With More New Features.",
    route: "/crm/contacts",
    icon: Users,
    iconBg: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "V2 NEW",
    ctaText: "Go To CRM V2",
  },
  {
    id: "media-manager",
    name: "Media Manager",
    description: "Manage Your Media Files With Media Manager Bot.",
    route: "/automations/datastore",
    icon: FolderArchive,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-700 dark:text-slate-300",
    ctaText: "Go To Media Manager",
  },
  {
    id: "departments",
    name: "Departments",
    description:
      "Efficiently organize and manage your organizational departments.",
    route: "/department/departments",
    icon: Building2,
    iconBg: "bg-teal-50 dark:bg-teal-950/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    ctaText: "Go To Departments",
  },
];

export default function ProductsOverviewPage() {
  return (
    <div className="space-y-5 sm:space-y-6 px-3 sm:px-0">
      {/* Breadcrumb Back Navigation */}
      <div className="flex items-center text-xs text-muted-foreground gap-1.5 flex-wrap">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </Link>
        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />
        <span className="font-semibold text-foreground">Products</span>
      </div>

      {/* Page Title & Intro */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 shrink-0" />
          <span>Products &amp; Feature Suite</span>
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Explore and launch all powerful visual builders, omnichannel bots, and
          business automation products.
        </p>
      </div>

      {/* Products Responsive Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {productsList.map((prod) => {
          const Icon = prod.icon;
          return (
            <div
              key={prod.id}
              className="flex flex-col justify-between rounded-xl border bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 border-border/80 group"
            >
              <div>
                {/* Icon row & badge */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105 shrink-0",
                      prod.iconBg,
                      prod.iconColor,
                    )}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  {prod.badge && (
                    <Badge className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 shrink-0">
                      {prod.badge}
                    </Badge>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                  {prod.name}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed sm:min-h-10">
                  {prod.description}
                </p>
              </div>

              {/* Full-width Green CTA Button */}
              {/* <div className="mt-4 sm:mt-5 pt-3 border-t border-border/40">
                <Button
                  asChild
                  className="w-full justify-between bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 shadow-xs transition-colors"
                >
                  <Link href={prod.route} className="flex items-center justify-between w-full">
                    <span className="truncate">{prod.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div> */}

              {/* Full-width Green CTA Button */}
              <div className="mt-4 sm:mt-5 pt-3 border-t border-border/40">
                <Button
                  asChild
                  className="w-full justify-between font-semibold text-xs py-2 shadow-xs transition-colors"
                >
                  <Link
                    href={prod.route}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="truncate">{prod.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
