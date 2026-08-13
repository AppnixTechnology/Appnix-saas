import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MessageSquare,
  Send,
  Bot,
  Zap,
  Users,
  BarChart3,
  Shield,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  Smartphone,
  Mail,
  Zap as ZapIcon,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Unified Inbox",
    description: "Manage all conversations from WhatsApp, Instagram, Facebook, and RCS in one place. Never miss a message.",
    color: "bg-blue-500",
  },
  {
    icon: Send,
    title: "Campaign & Broadcast Manager",
    description: "Create and send targeted campaigns across multiple channels. Schedule, automate, and track performance.",
    color: "bg-purple-500",
  },
  {
    icon: Bot,
    title: "No-Code Bot Builder",
    description: "Build intelligent chatbots with drag-and-drop interface. Automate responses, qualify leads, and provide 24/7 support.",
    color: "bg-green-500",
  },
  {
    icon: Zap,
    title: "Automation Builder",
    description: "Create complex workflows with visual automation builder. Trigger actions based on events, conditions, and delays.",
    color: "bg-orange-500",
  },
  {
    icon: Users,
    title: "CRM & Contact Management",
    description: "Organize contacts with tags, segments, and custom fields. Track interactions and build detailed customer profiles.",
    color: "bg-pink-500",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into conversations, campaigns, and team performance. Export reports and make data-driven decisions.",
    color: "bg-indigo-500",
  },
];

const channels = [
  { icon: MessageSquare, name: "WhatsApp Business API", description: "Official Business API with templates, sessions, and webhooks", color: "text-green-600 bg-green-50" },
  { icon: Smartphone, name: "RCS Business Messaging", description: "Rich Communication Services with carousel, cards, and suggested replies", color: "text-blue-600 bg-blue-50" },
  { icon: MessageSquare, name: "Instagram Direct", description: "Manage Instagram DMs, comments, and story replies from unified inbox", color: "text-pink-600 bg-pink-50" },
  { icon: Send, name: "Facebook Messenger", description: "Connect Facebook Pages and manage Messenger conversations at scale", color: "text-blue-700 bg-blue-50" },
];

const stats = [
  { value: "10K+", label: "Businesses Connected" },
  { value: "1B+", label: "Messages Processed" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "24/7", label: "Support Available" },
];

const testimonials = [
  {
    content: "Appnix transformed how we communicate with customers. The unified inbox alone saved our team 20+ hours per week.",
    author: "Sarah Chen",
    role: "CEO, TechStart Inc.",
    avatar: "SC",
  },
  {
    content: "The white-label solution allowed us to launch our own branded messaging platform in weeks, not months.",
    author: "Marcus Johnson",
    role: "Founder, AgencyPro",
    avatar: "MJ",
  },
  {
    content: "Best WhatsApp Business API integration we've used. Reliable, scalable, and the support team is exceptional.",
    author: "Priya Sharma",
    role: "CTO, E-commerce Plus",
    avatar: "PS",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MessageSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Appnix</span>
          </div>

          <nav className="hidden md:flex md:items-center md:gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#channels" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Channels
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Testimonials
            </Link>
            <Link href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/signin" className="hidden sm:block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Sign In
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex items-center justify-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Now with RCS & Instagram Direct Support
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Unified Business Messaging
              <br />
              <span className="text-primary">& Marketing Platform</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Connect with customers on WhatsApp, RCS, Instagram, and Facebook from a single platform.
              Build bots, automate workflows, run campaigns, and scale your business communication.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required · 14-day free trial · Cancel anytime
            </p>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section id="channels" className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              All Channels in One Platform
            </h2>
            <p className="text-muted-foreground">
              Official APIs for every major messaging channel. No unofficial workarounds.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <Card key={channel.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: channel.color.replace('text-', 'bg-').replace('-600', '-100').replace('-50', '-100') }}>
                    <channel.icon className="h-6 w-6" style={{ color: channel.color.replace('bg-', 'text-').replace('-50', '-600') }} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{channel.name}</h3>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything You Need to Scale Communication
            </h2>
            <p className="text-muted-foreground">
              Powerful features built for modern business messaging needs.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: feature.color.replace('500', '100') }}>
                    <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* White Label Section */}
      <section className="py-20 sm:py-28 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              <span>White-Label Ready</span>
            </div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Launch Your Own Branded Messaging Platform
            </h2>
            <p className="mb-10 text-lg opacity-90">
              Full white-label solution with custom domain, branding, and dedicated infrastructure.
              Resell Appnix under your own brand and build recurring revenue.
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: Globe, title: "Custom Domain", desc: "yourbrand.com/app" },
                { icon: Shield, title: "Custom Branding", desc: "Logo, colors, emails" },
                { icon: Users, title: "Multi-Tenant", desc: "Isolated workspaces" },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10 mx-auto">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1 font-semibold">{item.title}</h3>
                  <p className="text-sm opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Button asChild variant="secondary" size="lg" className="gap-2">
                <Link href="/whitelabel">
                  Learn More About White-Label
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trusted by Growing Businesses
            </h2>
            <p className="text-muted-foreground">
              See what our customers have to say about Appnix.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-muted-foreground">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="py-16 px-8 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Ready to Transform Your Business Communication?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Join 10,000+ businesses using Appnix to connect with customers across all channels.
                Start your free 14-day trial today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  <Link href="/demo">Schedule a Demo</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight text-foreground">Appnix</span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Unified Business Messaging & Marketing Platform. WhatsApp Business API, RCS, Instagram, Facebook Marketing - White-Label SaaS.
              </p>
              <div className="mt-6 flex gap-4">
                <a href="https://twitter.com/appnixtech" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                </a>
                <a href="https://linkedin.com/company/appnix" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://github.com/AppnixTechnology" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#channels" className="hover:text-foreground transition-colors">Channels</a></li>
                <li><a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/docs" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="/api" className="hover:text-foreground transition-colors">API Reference</a></li>
                <li><a href="/changelog" className="hover:text-foreground transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="/blog" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="/careers" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="/press" className="hover:text-foreground transition-colors">Press</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="/whitelabel" className="hover:text-foreground transition-colors">White-Label</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Resources</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="/help" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="/community" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="/webinars" className="hover:text-foreground transition-colors">Webinars</a></li>
                <li><a href="/templates" className="hover:text-foreground transition-colors">Templates</a></li>
                <li><a href="/integrations" className="hover:text-foreground transition-colors">Integrations</a></li>
                <li><a href="/status" className="hover:text-foreground transition-colors">System Status</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
                <li><a href="/security" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="/gdpr" className="hover:text-foreground transition-colors">GDPR</a></li>
                <li><a href="/dpa" className="hover:text-foreground transition-colors">Data Processing</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Appnix Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for businesses worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}