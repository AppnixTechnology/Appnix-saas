# Appnix Frontend

A modern, production-ready Next.js 16 (React 19) frontend for the **Appnix Unified Business Messaging & Marketing Platform** — a white-label SaaS solution for WhatsApp Business API, RCS, Instagram, and Facebook marketing.

---

## Overview

**Appnix** is a unified business messaging platform that enables businesses to manage customer communications across WhatsApp, RCS, Instagram, and Facebook from a single dashboard. This frontend provides the complete user interface including a public marketing landing page, authenticated dashboard application, and super-admin management console.

**Current Status**: Actively developed. Core dashboard, authentication, landing page, and campaign wizard are implemented. Super admin console has UI with partial backend integration.

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router, Turbopack) | 16.3.0 |
| **Runtime** | React | 19.2.8 |
| **Language** | TypeScript (strict) | 5.x |
| **Styling** | Tailwind CSS, CSS Variables | 4.x |
| **UI Primitives** | Radix UI + shadcn/ui (base-nova) | Latest |
| **Server State** | TanStack Query | 5.101.4 |
| **Client State** | Zustand | 5.0.14 |
| **Forms** | React Hook Form + Zod | 7.85.0 / 3.25.76 |
| **Auth** | Custom JWT + Google OAuth | — |
| **Charts** | Recharts | 3.10.1 |
| **Icons** | Lucide React | 1.31.0 |
| **Date/Time** | date-fns | 4.4.0 |
| **Linting** | ESLint 9 (flat config) + Husky | 9.x |

---

## Project Structure

```
frontend/
├── public/                    # Static assets (logo, favicon, fonts)
├── src/
│   ├── app/                   # Next.js App Router pages & layouts
│   │   ├── (auth)/            # Auth pages (signin, signup, forgot-password, reset-password, verify-otp)
│   │   ├── (dashboard)/       # Protected dashboard pages (40+ routes)
│   │   ├── (marketing)/       # Public landing page at `/`
│   │   ├── (super-admin)/     # Super admin console at `/super-admin/*`
│   │   ├── api/               # API routes: /api/proxy/[...path], /api/leads
│   │   ├── layout.tsx         # Root layout: providers, fonts, metadata, toaster
│   │   └── globals.css        # Global styles, CSS variables, Tailwind v4
│   ├── components/
│   │   ├── ui/                # 18 shadcn/ui base components
│   │   ├── landing/           # 20+ landing page sections
│   │   ├── layout/            # Dashboard layout: AppSidebar, AppNavbar
│   │   ├── campaigns/         # CampaignWizard, TestMessageModal, LaunchConfirmModal, 7 step components
│   │   ├── channels/          # ChannelManager
│   │   ├── forms/             # Form utilities
│   │   └── providers.tsx      # QueryProvider, ThemeProvider, AuthProvider
│   ├── super-admin/           # Super admin console
│   │   ├── components/        # UI: Sidebar, Header, modals (AddClient, AddStaff, Flag, Plan)
│   │   ├── layouts/           # SuperAdminLayout
│   │   ├── services/          # API service layer
│   │   ├── mock/              # Mock data for development
│   │   └── types/             # TypeScript types
│   ├── hooks/                 # Custom hooks (useCampaignWizard, useToast, use-theme)
│   ├── lib/
│   │   ├── api/               # Axios instance with interceptors
│   │   ├── auth/              # AuthContext, login/logout, token management
│   │   ├── config/            # App configuration constants
│   │   ├── query/             # TanStack Query client & provider
│   │   ├── theme/             # next-themes provider
│   │   └── utils.ts           # cn() utility, helpers
│   └── types/                 # Global TypeScript types
├── components.json            # shadcn/ui config (base-nova, neutral, CSS variables)
├── tsconfig.json              # Path aliases (@/*, @/components/*, etc.)
├── package.json
├── postcss.config.mjs
├── .husky/                    # Pre-commit: lint-staged + ESLint
└── .gitignore
```

---

## Route Groups & Layouts

| Group | Layout File | Description | Auth Required |
|-------|-------------|-------------|---------------|
| `(marketing)` | `src/app/layout.tsx` | Public landing page at `/` | No |
| `(auth)` | `src/app/layout.tsx` | Sign in, sign up, forgot/reset password, verify OTP | No |
| `(dashboard)` | `src/app/(dashboard)/layout.tsx` | Sidebar + Navbar shell for 40+ app routes | Yes (JWT) |
| `(super-admin)` | `src/app/(super-admin)/super-admin/layout.tsx` | SuperAdminLayout for 9 admin routes | Yes (Admin JWT) |

### Dashboard Routes (`/dashboard/*`) — 40 Routes

| Route | Screen Name | Purpose | Status |
|-------|-------------|---------|--------|
| `/` | Dashboard Overview | KPIs, recent activity, quick actions | Working |
| `/crm` | CRM Dashboard | Pipeline, leads, deals overview | Working |
| `/crm/contacts` | Contact Management | List, search, filter, import contacts | Working |
| `/crm/live-chat` | Live Chat Inbox | Real-time conversation view | Partial (UI only) |
| `/crm/bulk-campaign` | Bulk Campaigns | List/create bulk broadcasts | Working |
| `/crm/campaigns` | Campaign List | View, filter, duplicate, delete campaigns | Working |
| `/crm/campaigns/create` | Campaign Wizard | 7-step campaign creation | Working |
| `/campaigns/new` | New Campaign Entry | Redirects to wizard | Working |
| `/automations` | Automation Builder | Visual workflow editor | Partial (UI only) |
| `/automations/workflow` | Workflow Editor | Node-based flow builder | Placeholder |
| `/automations/templates` | Template Library | Pre-built automation templates | Partial |
| `/automations/analytics` | Automation Analytics | Execution metrics | Placeholder |
| `/automations/datastore` | Data Store | Key-value storage for workflows | Placeholder |
| `/automations/app-authentications` | App Auth Connections | OAuth connections for integrations | Partial |
| `/channels` | Channel Overview | Connection status for all channels | Working |
| `/channels/whatsapp` | WhatsApp Setup | Business account, templates, webhooks | Working |
| `/channels/instagram` | Instagram Setup | Professional account, messaging | Partial |
| `/channels/facebook` | Facebook Setup | Page connection, Messenger | Partial |
| `/channels/rcs` | RCS Setup | Agent registration, branding | Partial |
| `/chatbots` | Chatbot Builder | Flow builder, NLP training | Placeholder |
| `/chat-widget` | Chat Widget Config | Embed code, appearance, routing | Working |
| `/whatsapp-mini-apps` | WhatsApp Mini Apps | Mini app management | Placeholder |
| `/voice-ai-agent` | Voice AI Agent | Voice bot configuration | Placeholder |
| `/products` | Product Catalog | Product CRUD, categories | Partial |
| `/department` | Department Overview | Team structure | Working |
| `/department/roles` | Roles & Permissions | RBAC management | Partial |
| `/department/departments` | Departments | CRUD departments | Working |
| `/department/analytics` | Department Analytics | Team performance | Placeholder |
| `/workspace` | Workspace Settings | General workspace config | Working |
| `/workspace/billing` | Billing & Subscriptions | Plan, invoices, payment methods | Working |
| `/workspace/wallet` | Wallet & Credits | Credit balance, top-up history | Partial |
| `/workspace/account-settings` | Account Settings | Profile, preferences | Working |
| `/workspace/support` | Support Center | Tickets, knowledge base | Partial |
| `/settings` | General Settings | App-wide configuration | Working |
| `/settings/profile` | User Profile | Avatar, name, contact info | Working |
| `/settings/security` | Security | 2FA, sessions, API keys | Partial |
| `/settings/notifications` | Notification Preferences | Email, push, in-app | Working |
| `/settings/integrations` | Third-party Integrations | Webhooks, Zapier, etc. | Partial |
| `/settings/appearance` | Theme & Appearance | Light/dark/system, density | Working |
| `/settings/account-data` | Account Data | Export, delete account | Working |
| `/settings/activity-logs` | Activity Logs | Audit trail for user | Working |

### Super Admin Routes (`/super-admin/*`) — 9 Routes

| Route | Screen Name | Purpose | Status |
|-------|-------------|---------|--------|
| `/` | Super Admin Dashboard | Platform metrics, health | Working |
| `/clients` | Client Management | Onboard, suspend, configure clients | Working |
| `/team` | Staff Management | Add/remove staff, assign roles | Working |
| `/billing` | Platform Billing | Revenue, invoices, payouts | Partial |
| `/feature-flags` | Feature Flags | Toggle features per client/globally | Working |
| `/system-health` | System Monitoring | API latency, error rates, uptime | Partial |
| `/support` | Support Tickets | View/respond to client tickets | Partial |
| `/settings` | Platform Settings | Global configuration | Working |
| `/audit-logs` | Audit Trail | Platform-wide action logs | Working |

---

## Application Screens Inventory

| Screen | Route | Purpose | Status |
|--------|-------|---------|--------|
| Landing Page | `/` | Marketing site with 20 sections | Working |
| Sign In | `/signin` | Email/password + Google OAuth | Working |
| Sign Up | `/signup` | Account registration + email verification | Working |
| Forgot Password | `/forgot-password` | Request reset email | Working |
| Reset Password | `/reset-password` | Set new password via token | Working |
| Verify OTP | `/verify-otp` | Email/phone OTP verification | Working |
| Dashboard Overview | `/dashboard` | KPIs, charts, recent activity | Working |
| Campaign Wizard | `/crm/campaigns/create` | 7-step campaign creation | Working |
| Campaign List | `/crm/campaigns` | Manage campaigns | Working |
| Contact Management | `/crm/contacts` | CRM contacts CRUD | Working |
| Live Chat | `/crm/live-chat` | Real-time messaging | Partial |
| Channel Management | `/channels` | Connect WhatsApp/IG/FB/RCS | Working |
| WhatsApp Setup | `/channels/whatsapp` | BA account, templates, webhooks | Working |
| Chat Widget Config | `/chat-widget` | Embeddable widget | Working |
| Workspace Billing | `/workspace/billing` | Subscription management | Working |
| User Profile | `/settings/profile` | Profile management | Working |
| Security Settings | `/settings/security` | 2FA, sessions | Partial |
| Super Admin Dashboard | `/super-admin` | Platform overview | Working |
| Client Management | `/super-admin/clients` | Client CRUD, status | Working |
| Feature Flags | `/super-admin/feature-flags` | Toggle features | Working |
| Audit Logs | `/super-admin/audit-logs` | Platform action logs | Working |

**Status Legend**: `Working` = fully functional with backend; `Partial` = UI exists, backend incomplete; `Placeholder` = route exists, minimal UI.

---

## Key Features

### 1. Landing Page (`/`)

**Purpose**: Convert visitors to demo requests via a comprehensive single-page marketing site.

**Access**: Public, no authentication.

**User Flow**:
```
Visit `/` → Scroll through 20 sections → Click any CTA → Lead Form Modal opens → 
Submit form → Form validates → POST to /api/leads → Toast confirmation → 
Redirect to demo scheduling (external)
```

**UI Screens** (20 components in order):
1. **Navbar** — Sticky, responsive, logo, nav links, demo CTA, mobile hamburger
2. **Hero** — Headline, subhead, dual CTAs, live product screenshot, animated status cards
3. **TrustMetrics** — 4 statistic counters (clients, messages, uptime, countries)
4. **ChannelDemo** — Interactive tabs for WhatsApp/RCS/Instagram/Facebook with mock conversations
5. **FeatureGrid** — 8 feature cards with icons, descriptions, micro-previews
6. **HowItWorks** — 3-step flow: Connect → Build → Scale
7. **CRMShowcase** — Screenshot carousel of CRM features
8. **AutomationShowcase** — Visual workflow builder preview
9. **CampaignShowcase** — Broadcast campaign preview
10. **WhiteLabel** — Agency/reseller benefits, white-label dashboard screenshot
11. **WhyAppnix** — Comparison table vs competitors
12. **Testimonials** — Auto-rotating carousel with customer quotes
13. **PricingPreview** — 3 tier cards (Starter/Pro/Enterprise) with feature lists, CTA per tier
14. **FAQ** — 8 accordion items with search
15. **FinalCTA** — Full-width banner with dual CTAs
16. **Footer** — 5-column links, social, newsletter signup
17. **FloatingLeadTrigger** — Bottom-right pulse button (desktop only)
18. **StickyMobileCTA** — Bottom bar on mobile with CTA
19. **ExitIntentModal** — Triggers on mouse leave (desktop), special offer
20. **LeadFormModal** — Reusable form: name, email, company, interest (select), source (hidden), message

**Feature Behavior**:
- All CTAs open `LeadFormModal` with context-specific `interest` and `source` props
- `ExitIntentModal` fires once per session via `sessionStorage` flag
- `FloatingLeadTrigger` hidden on mobile (< 768px)
- `StickyMobileCTA` hidden on desktop (≥ 768px)
- `ScrollToTop` appears after 300px scroll

**API**: `POST /api/leads` — accepts `{ name, email, company, interest, source, message }`, returns `{ success: true }` or validation errors.

**Validation**: Zod schema on client; server-side validation in API route.

**State**: Modal open/close via `useState` in `LandingPage`; form state via React Hook Form.

---

### 2. Authentication System

**Purpose**: Secure user authentication with JWT tokens, HttpOnly cookies, and Google OAuth.

**Access**: `/signin`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-otp`

**User Flows**:

**Sign In (Email/Password)**:
```
Open /signin → Enter email/password → Check "Remember me" (optional) → Click Sign In →
Client validates via Zod → POST /api/proxy/auth/login → Backend validates → 
Set HttpOnly access/refresh cookies → AuthContext updates user → Redirect to /dashboard
```

**Sign In (Google OAuth)**:
```
Click "Sign in with Google" → Redirect to Google OAuth → Callback to /auth/callback →
Exchange code for tokens → Set cookies → Redirect to /dashboard
```

**Sign Up**:
```
Open /signup → Enter details → Submit → POST /api/proxy/auth/register → 
Backend creates user, sends verification email → Show "Check email" screen →
User clicks link → Verify token → Redirect to /signin
```

**Forgot Password**:
```
Open /forgot-password → Enter email → Submit → POST /api/proxy/auth/forgot-password →
Backend sends reset email → Show confirmation → User clicks link → /reset-password?token=... →
Enter new password → POST /api/proxy/auth/reset-password → Redirect to /signin
```

**UI Screens**:
- **SignInPage** (`/signin`) — Email/password form, Google button, remember me, forgot password link, signup link
- **SignupPage** (`/signup`) — Name, email, password, confirm, terms checkbox, Google button
- **ForgotPasswordPage** (`/forgot-password`) — Email field, submit, back to signin
- **ResetPasswordPage** (`/reset-password`) — Token from URL, password, confirm, submit
- **VerifyOTPPage** (`/verify-otp`) — 6-digit input, resend timer, verify button

**AuthContext** (`src/lib/auth/auth-context.tsx`):
- Provides: `user`, `isAuthenticated`, `isLoading`, `login(email, password, rememberMe)`, `logout()`, `refreshUser()`
- Tokens stored in HttpOnly cookies (access: 15min, refresh: 7d or 30d with rememberMe)
- Auto-refresh on 401 via axios interceptor
- Persists user in memory; refetches on mount

**Validation**:
- Email: valid format
- Password: min 8 chars
- Remember me: extends refresh token to 30 days

**Error States**: Toast notifications for invalid credentials, network errors, expired tokens.

---

### 3. Dashboard Application Layout

**Purpose**: Responsive shell for all authenticated app pages.

**Access**: All `/dashboard/*` routes (protected by auth check in layout).

**Layout Structure** (`src/app/(dashboard)/layout.tsx`):
```
<DashboardShell>
  <AppNavbar>        // Top bar: logo, search, notifications, user menu, mobile menu button
  <div class="flex-1">
    <AppSidebar>     // Left: collapsible nav, workspace switcher, bottom: user avatar
    <main>           // Right: page content with padding
```

**Responsive Behavior**:
- Desktop (≥ 1024px): Sidebar always visible, toggle collapses to icons-only
- Tablet (768-1023px): Sidebar overlay, closes on link click
- Mobile (< 768px): Sidebar drawer, navbar hamburger opens drawer

**AppNavbar** (`src/components/layout/app-navbar.tsx`):
- Logo + workspace name + switcher dropdown
- Global search (cmd+k)
- Notification bell with dropdown
- User avatar menu: profile, settings, security, appearance, logout
- Mobile menu button (hamburger)

**AppSidebar** (`src/components/layout/app-sidebar.tsx`):
- Collapsible sections: Dashboard, CRM, Campaigns, Automations, Channels, Chatbots, Products, Department, Workspace, Settings
- Each section: icon, label, badge (optional), nested links
- Active route highlighting
- Bottom: user avatar, name, email, workspace switcher

**State**: `sidebarOpen` boolean in layout; persists via localStorage.

---

### 4. Campaign Wizard (`/crm/campaigns/create`)

**Purpose**: Guided 7-step creation of multi-channel broadcast campaigns.

**Access**: Dashboard → Campaigns → Create Campaign (or `/crm/campaigns/create` direct)

**User Flow**:
```
Step 1: Details
  → Enter campaign name, description, tags
  → Click Next → Validate required fields

Step 2: Audience
  → Select segment (All contacts, List, Segment, Manual)
  → Preview audience count (API call)
  → Click Next

Step 3: Channel
  → Select: WhatsApp, Instagram, Facebook, RCS, SMS, Email
  → Show connected accounts for channel
  → Click Next

Step 4: Template
  → Load templates from Meta/API for selected channel
  → Select template → Preview with sample data
  → Click Next

Step 5: Variables
  → Auto-detect {{variables}} in template
  → Map each to contact field or static value
  → Click Next

Step 6: Preview
  → Render full message for 3 sample contacts
  → Test send to own number (opens TestMessageModal)
  → Click Next

Step 7: Review
  → Summary: name, audience count, channel, template, variables, schedule
  → Save Draft / Schedule / Launch
  → If Launch → LaunchConfirmModal → Confirm → POST /api/proxy/campaigns → Success toast
```

**UI Components** (`src/components/campaigns/`):
- `CampaignWizard.tsx` — Orchestrates steps, manages form state (Zustand), validation per step
- `steps/CampaignStepDetails.tsx` — Name, description, tags
- `steps/CampaignStepAudience.tsx` — Segment selector, count preview
- `steps/CampaignStepChannel.tsx` — Channel cards, account selector
- `steps/CampaignStepTemplate.tsx` — Template list, preview
- `steps/CampaignStepConfigure.tsx` — Variable mapping table
- `steps/CampaignStepPreview.tsx` — Rendered messages, test send button
- `steps/CampaignStepReview.tsx` — Read-only summary, action buttons
- `TestMessageModal.tsx` — Send test to phone/email, shows delivery status
- `LaunchConfirmModal.tsx` — Final confirmation with warnings

**State Management**: Zustand store `useCampaignWizard` — persists draft in localStorage, restores on revisit.

**API Endpoints Used**:
- `GET /api/proxy/audiences/count` — audience preview
- `GET /api/proxy/templates?channel=` — template list
- `POST /api/proxy/campaigns/test` — send test message
- `POST /api/proxy/campaigns` — create campaign (draft/scheduled/launched)

**Validation**: Per-step Zod schemas; cannot proceed until valid.

**Status Transitions**:
```
DRAFT → (Schedule) → SCHEDULED → (Time) → RUNNING → COMPLETED
DRAFT → (Launch) → RUNNING → COMPLETED
DRAFT → (Delete) → DELETED
```

---

### 5. Channel Management (`/channels`)

**Purpose**: Connect and configure messaging channels (WhatsApp, Instagram, Facebook, RCS).

**Access**: Dashboard → Channels

**User Flow**:
```
Open /channels → See 4 channel cards with connection status
→ Click "Connect" on WhatsApp → Redirect to Meta Business Manager OAuth
→ Callback → Store credentials → Show template sync status
→ Click "Manage Templates" → View/sync templates
→ Configure webhook URL for inbound messages
```

**UI Components**:
- `ChannelManager.tsx` — Grid of channel cards, each with status badge, connect/manage buttons
- WhatsApp: Business Account selection, phone number verification, template namespace
- Instagram: Professional account connection, ice-breakers
- Facebook: Page selection, Messenger settings
- RCS: Agent registration, branding verification

**API**:
- `GET /api/proxy/channels` — list connected channels
- `POST /api/proxy/channels/whatsapp/connect` — initiate OAuth
- `GET /api/proxy/channels/whatsapp/templates` — sync templates
- `POST /api/proxy/channels/whatsapp/webhook` — configure webhook

**Status**: WhatsApp fully working; Instagram/Facebook/RCS partial (UI complete, backend integration pending).

---

### 6. Super Admin Console

**Purpose**: Platform-wide management for Appnix operators.

**Access**: `/super-admin/*` (requires admin role JWT)

**Features**:

| Feature | Screen | Status | Description |
|---------|--------|--------|-------------|
| Client Management | `/super-admin/clients` | Working | List, create, suspend, configure clients; view usage |
| Staff Management | `/super-admin/team` | Working | Add staff, assign roles (Admin/Support/Viewer), invite email |
| Feature Flags | `/super-admin/feature-flags` | Working | Global/client-specific toggles; modal for create/edit |
| System Health | `/super-admin/system-health` | Partial | API latency charts, error rates; backend metrics pending |
| Audit Logs | `/super-admin/audit-logs` | Working | Filterable log table: action, actor, target, timestamp |
| Platform Billing | `/super-admin/billing` | Partial | Revenue overview; invoices/payouts UI only |
| Support Tickets | `/super-admin/support` | Partial | Ticket list; reply UI only |
| Platform Settings | `/super-admin/settings` | Working | Global config: limits, defaults, maintenance mode |

**Components** (`src/super-admin/components/`):
- `SuperAdminSidebar` — Navigation, user menu
- `SuperAdminHeader` — Search, notifications, profile
- `AddClientModal` — Name, domain, plan, limits, admin email
- `AddStaffModal` — Name, email, role, client scope
- `FlagModal` — Flag key, description, default value, client overrides
- `PlanModal` — Plan name, price, limits, features

**Mock Data**: `src/super-admin/mock/index.ts` provides development data.

---

### 7. Chat Widget (`/chat-widget`)

**Purpose**: Configure embeddable website chat widget.

**Access**: Dashboard → Chat Widget

**Features**:
- Widget appearance: colors, position, avatar, welcome message
- Channel routing: WhatsApp, Instagram, Facebook, Web chat
- Business hours: timezone, schedule, away message
- Embed code generator: copy-paste script tag
- Preview mode: live widget in iframe

**Status**: Working — generates valid embed code, preview functional.

---

### 8. Workspace Billing (`/workspace/billing`)

**Purpose**: Manage subscription, payment methods, invoices.

**Access**: Dashboard → Workspace → Billing

**Features**:
- Current plan display with limits
- Upgrade/downgrade flow (redirects to Stripe portal)
- Payment methods: add/remove cards
- Invoice history: list, download PDF
- Usage meters: messages, contacts, automations

**Status**: Working — Stripe integration via backend proxy.

---

## Authentication & Authorization

### Auth Flow
```
1. User submits credentials → /api/proxy/auth/login
2. Backend validates → Issues access_token (15min) + refresh_token (7d/30d)
3. Cookies set: HttpOnly, Secure, SameSite=Lax, Path=/
4. AuthContext fetches /api/proxy/auth/me → populates user
5. Subsequent requests: axios interceptor attaches access_token
6. On 401: interceptor calls /api/proxy/auth/refresh → retries original
7. On refresh failure: logout, redirect to /signin
```

### Roles
| Role | Dashboard Access | Super Admin Access |
|------|------------------|-------------------|
| User | Own workspace only | No |
| Admin | Own workspace + settings | No |
| Super Admin | All workspaces | Full console |

### Protected Routes
- Middleware (planned) will check cookie on navigation
- Currently: client-side check in `AuthProvider` redirects unauthenticated to `/signin`

---

## API Layer

**Base**: `NEXT_PUBLIC_API_URL` (defaults to `/api/proxy` in dev)

**Axios Instance** (`src/lib/api/axios.ts`):
- Base URL from config
- Interceptors: auth header, 401 refresh, error normalization
- Timeout: 30s

**Key Endpoints** (proxied via `/api/proxy/[...path]`):

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/auth/login` | Email/password sign in | No |
| POST | `/auth/register` | Sign up | No |
| POST | `/auth/refresh` | Refresh access token | Refresh cookie |
| POST | `/auth/logout` | Revoke tokens | Access token |
| GET | `/auth/me` | Current user | Access token |
| POST | `/auth/forgot-password` | Request reset email | No |
| POST | `/auth/reset-password` | Reset with token | No |
| GET | `/campaigns` | List campaigns | Access token |
| POST | `/campaigns` | Create campaign | Access token |
| GET | `/campaigns/:id` | Get campaign | Access token |
| POST | `/campaigns/:id/test` | Send test message | Access token |
| GET | `/channels` | List connected channels | Access token |
| POST | `/channels/whatsapp/connect` | Initiate WhatsApp OAuth | Access token |
| GET | `/templates?channel=` | List templates | Access token |
| GET | `/audiences/count` | Preview audience size | Access token |
| GET | `/workspace/billing` | Subscription info | Access token |
| POST | `/leads` | Landing page lead capture | No |

---

## State Management

| Scope | Tool | Location |
|-------|------|----------|
| Server data | TanStack Query v5 | `src/lib/query/` + per-feature hooks |
| Client UI state | Zustand | `src/hooks/` + feature stores |
| Form state | React Hook Form | Per-component |
| Theme | next-themes | `src/lib/theme/provider.tsx` |
| Auth | React Context | `src/lib/auth/auth-context.tsx` |

**Query Keys Convention**: `['feature', 'subfeature', params]` — e.g., `['campaigns', 'list', { status: 'draft' }]`

**Optimistic Updates**: Used for campaign status changes, contact mutations.

---

## Theming

**Provider**: `ThemeProvider` from `next-themes` in `providers.tsx`
- `attribute="class"` — uses `data-theme` on `<html>`
- `defaultTheme="system"` — respects OS preference
- `enableSystem` — watches `prefers-color-scheme`
- `disableTransitionOnChange` — no flash on toggle

**CSS Variables** (`src/app/globals.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... full shadcn/ui color palette */
}
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark variants */
}
```

**Usage**: `useTheme()` hook → `setTheme('light' | 'dark' | 'system')`

**Persistence**: localStorage `theme` + cookie for SSR hydration.

---

## Configuration

### Environment Variables (`.env.local`)

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical URL for metadata, OG images | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base | `http://localhost:4000` |
| `NEXT_PUBLIC_WS_URL` | No | WebSocket server for real-time | — |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID | — |
| `AUTH_SECRET` | Yes | JWT signing secret (backend) | — |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Error tracking | — |
| `NEXT_PUBLIC_POSTHOG_KEY` | No | Analytics | — |

**Note**: Never commit actual secrets. Use `.env.local` (gitignored).

---

## Development Setup

```bash
# Prerequisites
Node.js 20+
npm 10+

# Install
cd frontend
npm install

# Development
npm run dev          # Turbopack dev server at localhost:3000

# Quality Checks
npm run type-check   # tsc --noEmit
npm run lint         # ESLint
npm run validate     # type-check + lint + build

# Production
npm run build        # .next/ output
npm run start        # Production server
```

### Husky Hooks
- `pre-commit`: `lint-staged` → ESLint on staged `.ts/.tsx` files
- `pre-push`: (configured) runs `validate`

---

## Build & Deployment

### Vercel (Recommended)
1. Import repository
2. Set Root Directory: `frontend`
3. Add Environment Variables
4. Deploy

### Docker
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

**Note**: Requires `output: 'standalone'` in `next.config.js` (add if missing).

### Environment Builds
```bash
# Preview
NEXT_PUBLIC_SITE_URL=https://preview.appnix.com npm run build

# Production
NEXT_PUBLIC_SITE_URL=https://appnix.com npm run build
```

---

## Code Quality

### TypeScript
- Strict mode enabled
- Path aliases configured
- `npm run type-check` in CI

### Linting
- ESLint 9 flat config
- Rules: `next/core-web-vitals`, `typescript-eslint`, `react-hooks`
- `npm run lint` — fixes auto-fixable issues

### Pre-commit
- `lint-staged` runs ESLint on staged files
- Blocks commit on errors

---

## Common Patterns

### Server Component with Data
```tsx
// app/(dashboard)/page.tsx
import { getDashboardData } from "@/lib/api/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData(); // async, runs on server
  return <DashboardView data={data} />;
}
```

### Client Component with Query
```tsx
// components/dashboard/Stats.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/axios";

export function Stats() {
  const { data, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => api.get("/stats").then(r => r.data),
  });
  if (isLoading) return <Skeleton />;
  return <StatCards stats={data} />;
}
```

### Form with Validation
```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export function Form() {
  const form = useForm({ resolver: zodResolver(schema) });
  const onSubmit = (data) => api.post("/endpoint", data);
  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

---

## External Integrations

| Service | Purpose | Status | Configuration |
|---------|---------|--------|---------------|
| **Meta (WhatsApp/IG/FB)** | Messaging APIs, templates, webhooks | Working (WhatsApp) | App ID/Secret, Business Account, Webhook URL |
| **Google OAuth** | Social login | Working | Client ID/Secret, Authorized redirect URIs |
| **Stripe** | Billing, subscriptions | Working | Secret key, Webhook secret, Price IDs |
| **Sentry** | Error tracking | Configured (env only) | DSN |
| **PostHog** | Product analytics | Configured (env only) | API Key |

**Meta Integration Flow**:
```
User connects WhatsApp → OAuth to Meta → Backend stores access_token →
Sync templates via Graph API → Webhook receives inbound messages →
Campaign send → Backend calls Meta Send Template API → Delivery receipts via webhook
```

---

## Known Limitations

1. **Real-time Features**: Live chat, notifications use polling (not WebSockets) — `NEXT_PUBLIC_WS_URL` not yet implemented
2. **Automation Builder**: UI complete, execution engine backend pending
3. **Instagram/Facebook/RCS**: Channel UI exists, API integration partial
4. **Chatbot Builder**: Placeholder only — no NLP, no flow execution
5. **Voice AI Agent**: Placeholder only
6. **WhatsApp Mini Apps**: Placeholder only
7. **Super Admin Billing/Support/System Health**: UI done, backend metrics pending
8. **Role-Based Access Control**: UI in `/department/roles`, enforcement middleware pending
9. **Multi-workspace**: Workspace switcher in sidebar, but data isolation not fully implemented
10. **Mobile App**: Responsive web only; no native app

---

## Feature Status Summary

| Feature Area | Status | Notes |
|--------------|--------|-------|
| Landing Page | Working | All 20 sections functional |
| Authentication | Working | JWT + Google OAuth, remember me |
| Dashboard Layout | Working | Responsive, collapsible sidebar |
| Campaign Wizard | Working | 7 steps, draft persistence, test send |
| Campaign List | Working | CRUD, filters, duplicate |
| Contact Management | Working | List, search, import CSV |
| Live Chat | Partial | UI only, no real-time backend |
| Channel Management | Partial | WhatsApp working; IG/FB/RCS partial |
| Chat Widget | Working | Embed code, preview |
| Automation Builder | Partial | UI only, no execution |
| Chatbot Builder | Placeholder | Route exists, minimal UI |
| Products | Partial | CRUD UI, no backend |
| Department/Team | Working | CRUD, roles UI only |
| Workspace Settings | Working | Profile, billing, notifications |
| Security (2FA) | Partial | UI only |
| Super Admin Console | Partial | Clients/Flags/Audit working; Billing/Support/Health partial |
| Billing (Stripe) | Working | Portal redirect, invoices |
| Theming | Working | System/light/dark, persisted |

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Hydration mismatch | Theme provider not wrapping app, or `suppressHydrationWarning` missing | Verify `Providers` in `layout.tsx`, `suppressHydrationWarning` on `<html>` |
| Styles not applying | `globals.css` not imported, Tailwind v4 config issue | Check `import "./globals.css"` in root layout |
| Path aliases failing | TS server cache, `tsconfig.json` paths | Restart TS server (`Cmd+Shift+P` → "TypeScript: Restart TS Server") |
| Auth redirect loop | Cookie domain mismatch, API URL wrong | Verify `NEXT_PUBLIC_API_URL`, cookie `SameSite`/`Secure` settings |
| Build fails on types | Unresolved imports, missing types | Run `npm run type-check` locally first |
| shadcn components not found | `components.json` aliases mismatch | Verify `aliases` in `components.json` match `tsconfig.json` paths |
| Modal not closing | Portal not rendering, z-index | Check `Toaster` in providers, dialog portal target |

---

## Contributing

1. Follow existing code style (TypeScript strict, functional components, hooks)
2. Run `npm run validate` before pushing
3. Update `README.md` for new features/routes/components (see AGENTS.md rules)
4. Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
5. No direct commits to `main` — use PRs

---

## License

Proprietary — Appnix Technologies Pvt. Ltd.