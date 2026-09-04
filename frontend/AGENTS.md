<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Agent Rules

## 1. Primary Objective

This repository contains an application whose code, UI, APIs, business logic, integrations, and user workflows must remain properly documented.

Whenever you modify the application, you must maintain `README.md` as the **living documentation of the actual application**.

The README must describe what the application **currently does and how it actually works**, not simply what the project is intended to do.

The README must never become outdated because of an agent code change.

---

# 2. Mandatory README Review

For every task that modifies application code, the agent MUST:

1. Read the existing `README.md` before making significant changes.
2. Inspect the relevant existing implementation.
3. Understand the current feature and user flow.
4. Implement the requested changes.
5. Test or validate the implementation when possible.
6. Review the final implementation.
7. Update `README.md` to reflect the actual final implementation.
8. Verify that the README does not describe functionality that is not implemented.
9. Only then consider the task complete.

README maintenance is part of the implementation task.

---

# 3. README Is the Source of Truth for Application Behavior

The README should provide a high-level but useful technical and functional description of the application.

It should allow a new developer or AI agent to understand:

* What the application does
* What features currently exist
* Which features are fully working
* Which features are partially implemented
* Which features are planned or unavailable
* How users navigate through the application
* What UI screens exist
* What each screen does
* How screens connect to each other
* What actions users can perform
* What happens after each action
* What APIs are involved
* What backend functionality is involved
* What database entities are involved
* What external services are involved
* What validations exist
* What permissions are required
* What loading/error/success states exist
* What configuration is required
* What environment variables are required

Do not invent information.

Only document functionality that can be verified from the implementation, configuration, tests, or other reliable project files.

---

# 4. Application Feature Documentation

For every major feature, document the complete working behavior.

Use a structure similar to:

## Feature Name

### Purpose

Explain what the feature does and why it exists.

### Access

Explain where the user accesses the feature.

Example:

`Dashboard → Campaigns → Create Campaign`

### User Flow

Document the complete user journey.

Example:

`Open Campaigns`
→ `Click Create Campaign`
→ `Enter Campaign Name`
→ `Select Audience`
→ `Select Channel`
→ `Select Template`
→ `Configure Variables`
→ `Preview`
→ `Save Draft`
→ `Send Test`
→ `Review`
→ `Confirm`
→ `Launch`

### UI Screens

Document all important screens, pages, dialogs, drawers, modals, and forms.

For each screen document:

* Screen name
* Route/path when applicable
* Purpose
* Main UI sections
* Input fields
* Buttons/actions
* Tables/cards/lists
* Filters/search
* Validation
* Loading state
* Empty state
* Error state
* Success state
* Navigation to other screens

### Feature Behavior

Explain what actually happens when the user performs each important action.

Example:

`Click Save Draft`

→ frontend validates the form
→ API request is sent
→ backend validates the data
→ campaign is stored with `DRAFT` status
→ UI displays success
→ user remains in the campaign workflow

### API

Document relevant API endpoints.

For each important endpoint include:

* HTTP method
* Endpoint
* Purpose
* Required parameters
* Request body when important
* Response behavior
* Authentication requirements
* Important error cases

### Database

Document relevant database entities.

Include:

* Table/model name
* Important fields
* Relationships
* Important status values
* How the feature reads/writes data

### Integrations

Document external integrations.

Examples:

* Meta
* WhatsApp
* Payment provider
* Email provider
* Storage provider
* Authentication provider

Explain how the application uses each integration.

### Validation and Business Rules

Document important rules.

Examples:

* Required fields
* Permission requirements
* Status transitions
* Duplicate prevention
* Template requirements
* Audience restrictions
* Scheduling restrictions

### Status and State

Document important states and transitions.

Example:

`DRAFT → READY → TEST_SENT → SCHEDULED → RUNNING → COMPLETED`

Also document failure states when applicable.

---

# 5. UI Screen Inventory

Maintain a section in the README containing the application's important screens.

Example:

## Application Screens

| Screen           | Route               | Purpose                   | Status  |
| ---------------- | ------------------- | ------------------------- | ------- |
| Dashboard        | `/dashboard`        | Application overview      | Working |
| Campaigns        | `/campaigns`        | Manage campaigns          | Working |
| Create Campaign  | `/campaigns/create` | Create campaign           | Working |
| Campaign Details | `/campaigns/:id`    | View campaign             | Working |
| Settings         | `/settings`         | Application configuration | Working |

The exact routes and statuses must come from the actual implementation.

Do not invent routes.

If a screen exists in code but is incomplete, document it as:

`Partial`

If a screen is only a placeholder:

`Placeholder`

If it is not implemented:

`Not Implemented`

---

# 6. Feature Status

Maintain a clear understanding of implementation status.

Use statuses such as:

* `Working`
* `Partially Working`
* `Placeholder`
* `Not Implemented`
* `Deprecated`

Only mark something as `Working` when the implementation can actually be verified.

Do not assume that a UI existing means the feature is fully functional.

For example, a button that exists but has no working backend should not be documented as a working feature.

---

# 7. Complete User Workflows

For important application features, document workflows from the user's starting point to the final result.

Do not document only individual screens.

Document the complete flow.

Example:

## Campaign Creation Workflow

1. User opens Campaigns.
2. User clicks Create Campaign.
3. User enters campaign information.
4. User selects an audience.
5. Application retrieves the current audience count.
6. User selects a communication channel.
7. Application loads available templates.
8. User selects a template.
9. Application detects dynamic variables.
10. User maps template variables.
11. Application renders the preview.
12. Campaign is saved as Draft.
13. User sends a test message.
14. Application records the test result.
15. User reviews campaign details.
16. User confirms launch.
17. Backend validates the campaign again.
18. Campaign is launched.
19. Campaign status changes according to the actual implementation.

The workflow must match the real code.

---

# 8. UI and UX Documentation

When a UI feature changes, update the README documentation to explain the new UI behavior.

Document important:

* Forms
* Modals
* Wizards
* Tabs
* Tables
* Cards
* Dropdowns
* Search
* Filters
* Pagination
* Confirmation dialogs
* Toasts/notifications
* Loading indicators
* Empty states
* Error states
* Success states
* Disabled states
* Responsive behavior when relevant

Do not document visual styling details unless they are important to the application's behavior.

---

# 9. User Actions and System Responses

For important UI actions, document:

**User Action → Frontend Behavior → API → Backend Behavior → Database/External Service → UI Result**

Example:

`User clicks Send Test`

→ validate form
→ call test-message API
→ backend validates campaign
→ backend sends test through provider
→ provider returns message ID
→ backend records test result
→ UI displays success/failure

This is especially important for complex workflows.

---

# 10. API and Backend Documentation

Whenever an API is added or changed, update the README.

Document:

* Endpoint
* Method
* Authentication
* Request
* Response
* Validation
* Error handling
* Side effects
* Related frontend screens

Do not expose secrets, tokens, passwords, private keys, or sensitive credentials in the README.

---

# 11. Configuration Documentation

Whenever configuration changes, update the README.

Document:

* Environment variables
* Required services
* API configuration
* Database configuration
* Authentication configuration
* External integrations
* Development setup
* Production requirements

Never write actual secret values into the README.

Use placeholders such as:

`META_ACCESS_TOKEN=<your-token>`

---

# 12. Database Documentation

When database behavior changes, update the relevant README section.

Document:

* New tables/models
* Changed fields
* Important relationships
* Status values
* Important indexes when relevant
* Data lifecycle
* Important business rules

Do not document implementation details that are not useful for understanding the application.

---

# 13. Integration Documentation

For external services, document:

* Service name
* Why it is used
* Which application feature uses it
* Required configuration
* Authentication requirements
* Important API operations
* Failure behavior
* Fallback behavior if applicable

Example:

## Meta / WhatsApp Integration

Document:

`Application → Backend → Meta API → WhatsApp`

and explain the actual implemented template retrieval, test-message, and campaign-send workflow.

---

# 14. Keep Documentation Synchronized

When changing an existing feature:

**DO NOT**

add a second README section describing the new version while leaving the old section unchanged.

Instead:

1. Find the existing documentation.
2. Update it.
3. Remove obsolete behavior.
4. Add the new behavior.
5. Verify that the complete section describes the current implementation.

The README should contain one authoritative description of each feature.

---

# 15. Never Invent Functionality

This is extremely important.

The agent MUST NOT write documentation based only on:

* User expectations
* UI mockups
* Design screenshots
* Comments
* TODOs
* Planned features
* Product requirements

unless that functionality is actually implemented.

For example, if the UI contains:

`Launch Campaign`

but the backend launch functionality is not implemented, document:

`Launch Campaign — UI present, backend functionality not implemented.`

Do not document it as a working launch feature.

---

# 16. Detect Partial Implementations

When a task reveals that a feature is only partially implemented, document the actual state.

Example:

### Campaign Templates

Status: `Partially Working`

Current behavior:

* Template list UI exists.
* Templates can be selected.
* Meta API integration is implemented.
* Dynamic variable mapping is not yet implemented.
* Test message functionality is pending.

This gives future AI agents an accurate understanding of the project.

---

# 17. Update Documentation After Refactoring

If a refactor changes:

* Architecture
* Folder structure
* API boundaries
* Component responsibilities
* State management
* Data flow
* Service responsibilities

update the README when those changes are relevant to understanding the application.

Do not document every internal code movement.

Document architectural changes that materially affect how the application works.

---

# 18. README Structure

Maintain the README using a sensible structure similar to:

# Project Name

## Overview

## Features

## Application Screens

## User Workflows

## Feature Documentation

### Feature 1

### Feature 2

### Feature 3

## Architecture

## Frontend

## Backend

## API

## Database

## External Integrations

## Authentication & Authorization

## Configuration

## Environment Variables

## Development Setup

## Build & Deployment

## Troubleshooting

## Known Limitations

## Feature Status

The exact structure may be adapted to the application.

Do not create empty sections just to satisfy this list.

---

# 19. AI Agent Handoff Documentation

The README should be useful to another AI agent joining the project later.

A new agent should be able to read the README and understand:

* What the application is
* What has already been implemented
* Which features work
* Which features do not work
* Where users start each workflow
* Which screens exist
* How major workflows operate
* Which APIs are involved
* Which integrations are involved
* Which database models are involved
* What remains incomplete
* What limitations currently exist

This prevents future agents from unnecessarily rebuilding existing functionality.

---

# 20. Before Starting a Major Task

Before modifying a major feature, inspect:

1. `AGENTS.md`
2. `README.md`
3. Relevant frontend files
4. Relevant backend/API files
5. Relevant database/model files
6. Relevant configuration
7. Existing tests when available

Understand the existing implementation before changing it.

Do not replace existing functionality without first understanding how it works.

---

# 21. After Completing a Task

Before declaring the task complete:

* [ ] Requested functionality implemented
* [ ] Existing functionality checked
* [ ] Relevant tests/build/type checks run when possible
* [ ] Error handling checked
* [ ] Loading states checked
* [ ] Empty states checked
* [ ] Important UI states checked
* [ ] API behavior checked
* [ ] Database behavior checked when applicable
* [ ] `README.md` reviewed
* [ ] Feature documentation updated when required
* [ ] User workflow updated when required
* [ ] UI screen documentation updated when required
* [ ] API documentation updated when required
* [ ] Integration documentation updated when required
* [ ] Feature status updated when required
* [ ] Known limitations updated when required

The task is not complete until the documentation accurately reflects the final implementation.

---

# 22. Final Response

At the end of every coding task, provide a concise completion summary.

Always include:

**Implementation:** What was changed.

**Validation:** What was tested or verified.

**README Status:** `Updated` or `Not Updated`.

If README was updated, state what was documented.

If README was not updated, explain why no documentation change was necessary.

Example:

> **Implementation:** Added campaign template selection and dynamic variable mapping.
>
> **Validation:** TypeScript build and relevant tests passed.
>
> **README Status:** Updated — documented the campaign creation workflow, template configuration, UI screens, API flow, and campaign status transitions.

