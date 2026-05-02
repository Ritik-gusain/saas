# Luminescent.io - Complete Project Document

> **AI-Powered Team Collaboration Platform**
> 
> **Last Updated:** April 2026  
> **Status:** Phase 2 In Progress  
> **Confidentiality:** Internal Use Only

---

## 1. Project Overview

### What is Luminescent.io?
A **B2B Team AI Chatbot SaaS** that provides a unified, collaborative AI workspace. Companies pay a flat software subscription fee for 3, 7, or 12 seats and plug in their own API keys to power the intelligence.

### Core Value Proposition
> *"Bring your own API key. Unlock powerful AI agents and collaborative workspaces for your entire team."*

### Business Model
| Aspect | Details |
|--------|---------|
| **Revenue** | Fixed monthly SaaS subscriptions |
| **Cost Structure** | Standard web hosting & database costs (Zero LLM API inference costs) |
| **Target Margin** | ~99% SaaS gross margins |
| **Mechanism** | Bring Your Own Key (BYOK) - Teams provide their own API keys (OpenAI, Anthropic, etc.) to access the UI and Agents |

### Pricing Tiers

| Plan | Monthly Price | Seats | Features |
|------|---------------|-------|----------|
| Free Tier | $0/month | 1 | Local storage, Basic Features |
| Starter Team | $29/month | Up to 3 | Shared Workspace, BYOK |
| Growth Team | $59/month | Up to 7 | Shared Workspace, Advanced Admin, BYOK |
| Pro Team | $99/month | Up to 12 | Shared Workspace, Full Analytics, BYOK |

---

## 2. Technical Architecture

### 3. Multi-Tenant Architecture & BYOK
*   **Team Isolation:** All data (conversations, agents, members) is strictly scoped via `team_id`.
*   **Team Switcher:** A global workspace selector in the dashboard allows seamless movement between personal and collaborative environments.
*   **Secure BYOK (Bring Your Own Key):**
    *   **At-Rest Encryption:** Sensitive API keys (OpenAI, Anthropic, etc.) are encrypted using `AES-256-CBC` before being stored in Firestore.
    *   **Secure Retrieval:** Keys are decrypted only on the server-side (`frontend/app/api/chat`) and are never exposed in their raw form to the client UI.
    *   **Masking:** The frontend only receives masked versions of keys (e.g., `sk-proj...4f2a`) for configuration verification.

### 4. Technical Stack Evolution
- **Frontend:** Next.js (React, App Router)
- **Middleware:** Next.js API Routes (Node.js)
- **AI Backend:** Python FastAPI + Multi-Provider Inference Engine (BYOK)
- **Auth & Database:** Supabase (PostgreSQL + Auth)
- **Payments:** **Razorpay** (Subscriptions + Customer Portal)
- **Email:** Supabase Magic Links

### Architecture Diagram
```
User → Next.js Frontend → Next.js API (Middleware) → FastAPI → User's LLM API (OpenAI/Anthropic)
                ↓                ↓                      
            Supabase Auth    Supabase DB          
            Razorpay Webhooks
```

---

## 3. Data Flows

### 3.1 User Onboarding Flow
1. User visits luminescent.io → clicks "Get Started"
2. Registers via Supabase Auth (email/password or Google OAuth)
3. Redirected to **Razorpay Checkout** to select and pay for plan
4. Razorpay webhook `subscription.activated` or `payment.captured` → Next.js API
5. API creates Team record in Supabase with `plan_tier` (3, 7, or 12) and `razorpay_subscription_id`
6. User redirected to Chat Dashboard; assigned as Team Owner

### 3.2 Member Invitation Flow
1. Team Owner goes to Settings → Team Members → Invite Member
2. Enters email address; submits
3. API checks: `current_members < plan_tier`?
   - If NO: Return 403 with upgrade prompt
   - If YES: Create `pending_invite` in Supabase
4. Supabase sends magic link email
5. Colleague clicks link, registers, auto-joined to Team

### 3.3 AI Chat Message Flow
1. User types message → presses Send
2. Frontend `POST /api/chat` with `{ message, conversationId, teamId }`
3. Middleware verifies Supabase JWT, checks team membership, injects team system prompt and retrieves the stored API key
4. Forwards to FastAPI `POST /generate` with full context and API key
5. FastAPI constructs prompt: `team_system_prompt + conversation_history + user_message`
6. Calls the specified LLM provider API (OpenAI, Anthropic, etc.) using the user's/team's key
7. Streams response: LLM Provider → FastAPI → Next.js → UI
8. On completion: saves conversation to Supabase

### 3.4 Agent Execution Flow
1. User triggers agent (Research, Content, Code, etc.)
2. FastAPI initializes Agent Loop with goal + available tools
3. Agent generates step-by-step plan → streams to UI for review
4. User approves or cancels
5. Agent executes tool calls sequentially (web search, file read, API calls)
6. Results streamed as progress updates
7. Agent reflects on each result; retries/revises if needed
8. Final output formatted → displayed in chat → optionally saved to Project
9. Execution log saved to Supabase `audit_log` table

---

## 4. Core Features

### 4.1 Chat Page (Primary Workspace)

#### Left Sidebar Structure
| Zone | Features |
|------|----------|
| **User Profile (Top)** | Avatar, display name, email, plan badge, online status, Settings link |
| **Chat History** | Chronological list, search, auto-grouped (Today/Yesterday/Last 7/Older), right-click menu (rename/pin/share/export/delete), pinned section, archive |
| **Projects** | Team-shared workspaces with shared threads, pinned outputs, team notes, file attachments, project-level system prompts, activity log, starring, sub-folders |
| **Quick Actions (Bottom)** | New Chat (Cmd/Ctrl+N), Image Generation, Document Upload, Model Switch, Keyboard Shortcuts, Theme Toggle |

#### Main Chat Area
- **Header:** Editable title, Share (to Project/public link), Export (PDF/Markdown/JSON), Model selector, Token usage meter
- **Message Thread:** User messages (right), AI responses (left with model badge), hover actions (copy/regenerate/edit/react/pin/report), syntax-highlighted code blocks, inline images, markdown rendering, streaming indicator
- **Input Area:** Multi-line input, attachments, Image Generation toggle, voice input, system prompt toggle, send (Enter), token counter, prompt templates

#### Right Panel
- **Shared Team History:** Feed of team AI interactions, filters, "borrow" prompts, bookmarks
- **Team System Prompt:** Active company-wide prompt display, quick-edit for Owners
- **Prompt Templates:** Personal + Team snippets, category tags (Marketing/Engineering/Finance/Legal/General)

### 4.2 Settings Structure

#### Personal Settings
| Section | Features |
|---------|----------|
| Profile | Avatar, name, bio, job title, department |
| Account & Security | Password, email, 2FA (TOTP/SMS), sessions, API keys, delete account |
| Notifications | Email (invites/activity/billing), in-app alerts, weekly digest |
| Appearance | Theme (Light/Dark/System), sidebar width, font size, bubble style, locale |
| AI Preferences | Default model, verbosity, language, personal system prompt, code theme |
| Keyboard Shortcuts | View and customize |
| Data & Privacy | GDPR export, delete history, analytics opt-out |
| My Subscription | Current plan, billing date, upgrade/downgrade/cancel |
| Connected Integrations | Google Drive, GitHub, Slack, SharePoint OAuth |

#### Team Admin Settings (Owner Only)
| Section | Features |
|---------|----------|
| Team Members | View (role/join date/last active), invite, resend, remove, transfer ownership |
| Seat Management | Used/available seats, enforcement, upgrade prompts |
| Team System Prompt | Company-wide prompt, version history, preview, activate/pause, project overrides |
| Projects Admin | View all, archive/delete, assign admins, permissions |
| Usage Analytics | Per-member token usage (text vs image), top prompts, trends, CSV export |
| Billing Management | Invoices, receipts, payment methods (**Razorpay Customer Portal**), plan changes |
| API Key Management | Configure company-wide API keys (OpenAI, Anthropic, Gemini, etc.) |
| Security & Access | SSO (Enterprise), IP allowlist, audit log, session management |
| Integrations (Team) | Team OAuth, MCP servers, webhooks, Slack connect |
| Branding | Team name, sidebar logo, welcome message |
| AI Model Config | Enable/disable models, team default, daily token limits per member |
| Prompt Templates | Create/edit shared snippets, categorize, publish |
| Announcements | Team-wide banner messages |
| Danger Zone | Delete team, bulk-wipe history, export before deletion |

---

## 5. AI Agents

### 5.1 Agent Philosophy
Agents don't just answer questions—they **plan, execute, and deliver** autonomously using tools.

### 5.2 Execution Loop
```
OBSERVE (goal + context) → PLAN (step-by-step) → ACT (tool calls) → REFLECT (evaluate) → DELIVER (final output)
```

### 5.3 Built-In Agents

| Agent | Purpose | Tools | Example Task |
|-------|---------|-------|--------------|
| **Research** | Multi-source research | Web Search, Document Reader, URL Fetcher, Summarizer | Find top 5 Notion competitors, summarize pricing, create comparison table |
| **Content Creation** | Long-form content | Web Search, Brand Voice, Image Gen, Document Writer | Write 1500-word SEO article with brand voice, generate cover image, save as Word doc |
| **Code** | Write/test/debug code | Code Interpreter, GitHub Reader, File System, Terminal | Read GitHub issues labeled "bug", implement fix, write unit tests |
| **Data Analysis** | Analyze data & visualize | CSV/Excel Reader, Python Interpreter, Chart Generator, File Writer | Analyze Q1 sales CSV, find top 3 products by region, generate bar chart |
| **Workflow Automation** | Automate business tasks | Gmail, Google Calendar, Sheets, Slack, CRM API | Every Monday 9am: pull CRM updates, summarize, post to #sales Slack |
| **Document Processing** | Extract & compare docs | PDF Reader, Word Reader, OCR, File Writer, Data Extractor | Read 5 vendor contracts, extract payment terms/penalties, create comparison table |

### 5.4 System Prompt Layers

| Layer | Content | Controlled By |
|-------|---------|---------------|
| 1 - Platform Identity | "You are an AI assistant built into Luminescent.io..." | System |
| 2 - Team Context | Brand voice, company info, target audience | Team Owner |
| 3 - Agent Role | Task-specific instructions (e.g., "MUST produce plan BEFORE action") | System |
| 4 - Task Instruction | Specific user request | User |

### 5.5 Tool Permissions

| Tool | Default | Enabler |
|------|---------|---------|
| Web Search | Enabled | All members |
| File Read (uploads) | Enabled | All members |
| File Write (Projects) | Enabled | All members |
| GitHub Integration | Disabled | Team Owner |
| Google Drive | Disabled | Team Owner |
| Gmail Send | Disabled | Team Owner |
| Slack Posting | Disabled | Team Owner |
| Code Execution | Disabled | Team Owner |
| External APIs | Disabled | Team Owner |
| Scheduled Tasks | Disabled | Team Owner |

### 5.6 Safety Guardrails
- No deletion without explicit confirmation
- Execution plan shown before starting (user can cancel)
- All tool calls logged to audit log
- No external data access beyond connected integrations
- No external communications without "Confirm & Send"
- All outputs saved to chat history + optional Project save

### 5.7 Custom Agents & MCP (Phase 3)
- **Custom Agent Builder:** GUI for name, avatar, prompt, tools
- **MCP Server Registry:** Connect third-party APIs via URL + auth
- **Example:** "HubSpot Agent" for CRM deal stages and pipeline reports
- Share with team or restrict to members
- Version control with rollback

---

## 6. Feature Roadmap

### Phase 1: MVP ✅ COMPLETE
- [x] Landing Page & Pricing UI
- [x] Supabase Authentication
- [x] AI Chat Interface (BYOK Model)
- [x] Next.js + FastAPI Architecture

### Phase 2: Team Management 🚧 IN PROGRESS
- [ ] User Profile Section (UI scaffolded)
- [x] Chat History Panel (UI simplified and integrated into main layout)
- [ ] Projects/Group Collab Folders (UI scaffolded)
- [ ] **Razorpay Integration** (Subscriptions, Checkout, Webhooks)
- [ ] Team Database Structure (Supabase) with `razorpay_subscription_id`
- [ ] Email Invitation System
- [ ] Seat Enforcement + Upgrade Prompt
- [ ] Admin Dashboard
- [ ] Billing Management Portal (**Razorpay Customer Portal**)
- [ ] User Preferences Settings

### Phase 3: Collaboration & Agents 📅 PLANNED
- [ ] Team System Prompts
- [ ] Shared Team History Feed
- [ ] Text-to-Image Generation
- [ ] Token Utilization Tracking
- [ ] Usage Analytics Dashboard
- [ ] Research Agent
- [ ] Content Creation Agent
- [ ] Code Agent
- [ ] Data Analysis Agent
- [ ] Workflow Automation Agent
- [ ] Document Processing Agent
- [ ] Google Drive Integration
- [ ] Slack Integration
- [ ] GitHub Integration
- [ ] Custom Agents & MCP Servers
- [ ] Multi-Model Support
- [ ] Department-Specific Prompts
- [ ] Enterprise SSO & Audit Log
- [ ] Advanced Analytics Dashboard

---

## 7. Go-To-Market

### Target Personas (India + Global)
| Persona | Pain Point | Plan |
|---------|-----------|------|
| Startup Founder (3-5) | Individual AI chaos | Starter (₹2,400) |
| Agency/Creative (5-10) | Shared brand voice needed | Growth (₹4,900) |
| Corporate Dept (10-12) | Compliance & analytics | Pro (₹8,200) |

### Channels
- LinkedIn B2B outreach (Ops Managers, Team Leads, CTOs)
- ProductHunt launch (target #1 Product of the Day)
- SEO: "team AI tools", "ChatGPT for teams", "AI team collaboration"
- Cold email (Apollo.io, 50/day to Indian + US/EU SMBs)
- Founder Twitter/X (build in public)
- Referral program (1 free month per successful referral)

### Key Metrics
| Metric | Target |
|--------|--------|
| Churn Rate | < 5% monthly |
| Gross Margin | > 80% |
| Time to Activation | Minimize (signup → first AI message) |
| Seat Utilization | Maximize (active/total seats) |
| NPS | Quarterly survey |

---

## 8. Critical Business Rules

### Seat Enforcement
```javascript
// Pseudocode for invite logic
if (current_members >= plan_tier) {
  return 403 { error: "Seat limit reached", upgrade_prompt: true }
}
```

### API Key Security (BYOK)
- API keys must be securely encrypted at rest in the database
- Keys are only decrypted in memory during the request lifecycle
- UI must never expose the full API key after it is saved
- Team members use the team's configured key without seeing the raw key itself

### Security Requirements
- JWT verification on all routes
- Team membership validation on all team-scoped requests
- Audit logging for all admin actions and agent tool calls
- GDPR compliance for data export/deletion

---

## 9. File Structure

```
luminescent.io/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/               # App router
│   │   ├── components/        # React components
│   │   ├── lib/               # Utils, hooks
│   │   │   ├── razorpay.ts    # Razorpay client config
│   │   └── api/               # API routes
│   │       ├── razorpay/      # Razorpay webhooks & API
│   │       │   ├── webhook.ts # Handle subscription events
│   │       │   ├── checkout.ts # Create subscription
│   │       │   └── portal.ts  # Customer portal
│   └── api/                   # FastAPI Python backend
│       ├── agents/            # Agent implementations
│       ├── tools/             # Tool integrations
│       ├── models/            # Pydantic models
│       └── core/              # Core logic
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── types/                 # Shared TypeScript types
│   └── config/                # Shared config
├── supabase/
│   ├── migrations/            # Database migrations
│   │   ├── 001_teams.sql
│   │   └── 002_add_razorpay.sql # razorpay_subscription_id, razorpay_customer_id
│   └── seed/                  # Seed data
└── docker-compose.yml
```

---

## 10. Environment Variables

```bash
# App
NEXT_PUBLIC_APP_URL=https://luminescent.io
NODE_ENV=production

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Razorpay Plan IDs (Create in Razorpay Dashboard)
RAZORPAY_PLAN_STARTER_ID=plan_xxxxxxxxxxxx
RAZORPAY_PLAN_GROWTH_ID=plan_xxxxxxxxxxxx
RAZORPAY_PLAN_PRO_ID=plan_xxxxxxxxxxxx

# Supported AI Providers (Platform defaults if needed, otherwise rely entirely on user keys)
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=

# FastAPI
FASTAPI_URL=http://localhost:8000
FASTAPI_API_KEY=

# Integrations (Optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
```

---

## 11. Razorpay Integration Details

### 11.1 Razorpay Setup
1. Create Razorpay account (Live mode for production)
2. Create **Plans** in Razorpay Dashboard:
   - Starter: ₹2,400/month
   - Growth: ₹4,900/month
   - Pro: ₹8,200/month
3. Configure Webhook endpoint: `https://luminescent.io/api/razorpay/webhook`
4. Subscribe to events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.pending`
   - `payment.failed`

### 11.2 Database Schema

```sql
-- Teams table with Razorpay fields
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan_tier INTEGER CHECK (plan_tier IN (3, 7, 12)),
    owner_id UUID REFERENCES auth.users(id),
    
    -- Razorpay fields
    razorpay_subscription_id VARCHAR(255) UNIQUE,
    razorpay_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'pending', -- active, cancelled, pending, halted, completed
    
    -- Billing periods
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    
    -- Team settings
    system_prompt TEXT,
    default_model VARCHAR(50) DEFAULT 'gpt-4',
    branding_logo_url TEXT,
    branding_welcome_message TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 11.3 Razorpay API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/razorpay/checkout` | POST | Create subscription link |
| `/api/razorpay/webhook` | POST | Handle Razorpay webhooks |
| `/api/razorpay/portal` | POST | Generate customer portal |
| `/api/razorpay/subscription` | GET | Get subscription status |
| `/api/razorpay/cancel` | POST | Cancel subscription |
| `/api/razorpay/upgrade` | POST | Upgrade/downgrade plan |

---

## 12. API Reference

### 12.1 Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login user | No |
| `/api/auth/logout` | POST | Logout user | Yes |
| `/api/auth/callback` | GET | OAuth callbacks (Google) | No |
| `/api/auth/reset-password` | POST | Request password reset | No |
| `/api/auth/update-password` | POST | Update password | Yes |

### 12.2 Team Management Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|-------------|------|
| `/api/teams` | GET | List user's teams | Yes | Member |
| `/api/teams` | POST | Create new team (via Razorpay webhook) | Yes | Owner |
| `/api/teams/:id` | GET | Get team details | Yes | Member |
| `/api/teams/:id` | PATCH | Update team details | Yes | Owner/Admin |
| `/api/teams/:id/invite` | POST | Invite member | Yes | Owner/Admin |
| `/api/teams/:id/invites/:token/accept` | POST | Accept invite | No | - |
| `/api/teams/:id/members/:userId` | DELETE | Remove member | Yes | Owner/Admin |
| `/api/teams/:id/members/:userId/role` | PATCH | Update member role | Yes | Owner |
| `/api/teams/:id/transfer-ownership` | POST | Transfer ownership | Yes | Owner |

### 12.3 Chat Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|-------------|
| `/api/chat` | POST | Send message (streams response) | Yes |
| `/api/conversations` | GET | List conversations | Yes |
| `/api/conversations/:id` | GET | Get conversation details | Yes |
| `/api/conversations/:id` | PATCH | Update conversation | Yes |
| `/api/conversations/:id` | DELETE | Delete conversation | Yes |
| `/api/conversations/:id/export` | POST | Export conversation | Yes |
| `/api/conversations/:id/share` | POST | Share to project | Yes |
| `/api/conversations/:id/pin` | POST | Pin conversation | Yes |

### 12.4 Project Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|-------------|------|
| `/api/projects` | GET | List projects | Yes | Member |
| `/api/projects` | POST | Create project | Yes | Member |
| `/api/projects/:id` | GET | Get project details | Yes | Member |
| `/api/projects/:id` | PATCH | Update project | Yes | Owner/Admin |
| `/api/projects/:id` | DELETE | Delete/archive project | Yes | Owner/Admin |
| `/api/projects/:id/pin` | POST | Pin item to project | Yes | Member |
| `/api/projects/:id/notes` | GET/POST | Manage team notes | Yes | Member |
| `/api/projects/:id/files` | GET/POST | Manage file attachments | Yes | Member |

### 12.5 Agent Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|-------------|
| `/api/agents/:type/execute` | POST | Execute agent | Yes |
| `/api/agents/:type/plan` | POST | Get execution plan | Yes |
| `/api/agents/executions/:id` | GET | Get execution status | Yes |
| `/api/agents/executions/:id/cancel` | POST | Cancel execution | Yes |
| `/api/agents/executions/:id/stream` | GET | Stream execution updates | Yes |

### 12.6 Razorpay Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|-------------|------|
| `/api/razorpay/checkout` | POST | Create subscription checkout | Yes | Owner |
| `/api/razorpay/webhook` | POST | Handle Razorpay webhooks | No | - |
| `/api/razorpay/portal` | POST | Generate customer portal | Yes | Owner |
| `/api/razorpay/subscription` | GET | Get subscription details | Yes | Owner |
| `/api/razorpay/cancel` | POST | Cancel subscription | Yes | Owner |
| `/api/razorpay/upgrade` | POST | Upgrade/downgrade plan | Yes | Owner |
| `/api/razorpay/invoices` | GET | List invoices | Yes | Owner |

### 12.7 Admin/Analytics Endpoints

| Endpoint | Method | Description | Auth Required | Role |
|----------|--------|-------------|-------------|------|
| `/api/admin/usage` | GET | Get usage analytics | Yes | Owner/Admin |
| `/api/admin/audit-log` | GET | Get audit logs | Yes | Owner |
| `/api/admin/api-keys` | GET/POST | Manage team API keys | Yes | Owner |
| `/api/admin/members/:id/usage` | GET | Get member usage | Yes | Owner/Admin |

---

## 13. Database Schema (Complete)

### 13.1 Core Tables

```sql
-- Users (managed by Supabase Auth, extended here)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    display_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    job_title VARCHAR(255),
    department VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    plan_tier INTEGER CHECK (plan_tier IN (3, 7, 12)),
    owner_id UUID REFERENCES auth.users(id),
    
    -- Razorpay fields
    razorpay_subscription_id VARCHAR(255) UNIQUE,
    razorpay_customer_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'pending', -- active, cancelled, pending, halted, completed
    
    -- Billing periods
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    
    -- Team settings
    system_prompt TEXT,
    default_model VARCHAR(50) DEFAULT 'gpt-4',
    branding_logo_url TEXT,
    branding_welcome_message TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Team Members (junction)
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- owner, admin, member
    joined_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP,
    daily_token_usage INTEGER DEFAULT 0,
    UNIQUE(team_id, user_id)
);

-- Pending Invites
CREATE TABLE public.pending_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
    used_at TIMESTAMP
);

-- Conversations
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    title VARCHAR(255),
    is_shared BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    token_count INTEGER DEFAULT 0,
    model_used VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL for AI
    role VARCHAR(50) NOT NULL, -- user, assistant, system
    content TEXT NOT NULL,
    token_count INTEGER,
    model VARCHAR(50),
    attachments JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color_tag VARCHAR(50),
    access_type VARCHAR(50) DEFAULT 'all', -- all, specific
    created_by UUID REFERENCES auth.users(id),
    system_prompt_override TEXT,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Members (for specific access)
CREATE TABLE public.project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    added_by UUID REFERENCES auth.users(id),
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Project Items (pinned outputs)
CREATE TABLE public.project_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    item_type VARCHAR(50), -- chat, image, file, note
    item_id UUID,
    pinned_by UUID REFERENCES auth.users(id),
    pinned_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Team Notes (within projects)
CREATE TABLE public.team_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Prompt Templates
CREATE TABLE public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100), -- Marketing, Engineering, Finance, Legal, General
    is_personal BOOLEAN DEFAULT false, -- true = personal, false = team shared
    is_favorite BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100), -- team, project, conversation, member, etc.
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Agent Executions
CREATE TABLE public.agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_type VARCHAR(100), -- research, content, code, data, workflow, document
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed, cancelled
    goal TEXT NOT NULL,
    plan JSONB DEFAULT '{}',
    execution_log JSONB DEFAULT '[]',
    result TEXT,
    token_used INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Token Usage Analytics
CREATE TABLE public.token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
    agent_execution_id UUID REFERENCES public.agent_executions(id) ON DELETE SET NULL,
    usage_type VARCHAR(50), -- chat, agent, image
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    bytez_cost DECIMAL(10, 6),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences
CREATE TABLE public.user_preferences (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    theme VARCHAR(50) DEFAULT 'system', -- light, dark, system
    sidebar_width INTEGER DEFAULT 280,
    font_size VARCHAR(20) DEFAULT 'medium',
    chat_bubble_style VARCHAR(50) DEFAULT 'modern',
    locale VARCHAR(10) DEFAULT 'en-US',
    default_model VARCHAR(50) DEFAULT 'gpt-4',
    response_verbosity VARCHAR(20) DEFAULT 'detailed', -- concise, detailed
    response_language VARCHAR(10) DEFAULT 'en',
    personal_system_prompt TEXT,
    code_block_theme VARCHAR(50) DEFAULT 'github-dark',
    email_notifications JSONB DEFAULT '{"invites": true, "activity": true, "billing": true, "digest": false}',
    in_app_alerts JSONB DEFAULT '{"enabled": true}',
    analytics_opt_out BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Connected Integrations
CREATE TABLE public.user_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_type VARCHAR(100), -- google_drive, github, slack, sharepoint
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    scopes JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, integration_type)
);

-- Team Integrations (OAuth apps)
CREATE TABLE public.team_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    integration_type VARCHAR(100),
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- MCP Servers (Phase 3)
CREATE TABLE public.mcp_servers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    name VARCHAR(255),
    url TEXT NOT NULL,
    auth_token TEXT,
    tools JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 13.2 Indexes

```sql
-- Performance indexes
CREATE INDEX idx_conversations_team_user ON public.conversations(team_id, user_id);
CREATE INDEX idx_conversations_updated ON public.conversations(updated_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_audit_logs_team ON public.audit_logs(team_id, created_at DESC);
CREATE INDEX idx_token_usage_team_date ON public.token_usage(team_id, created_at);
CREATE INDEX idx_agent_executions_team ON public.agent_executions(team_id, status);
```

---

## 14. Frontend Component Structure

### 14.1 Page Routes

```
/
├── page.tsx                    # Landing page
├── (dashboard)
│   ├── layout.tsx               # Dashboard layout with sidebar
│   ├── chat/
│   │   ├── page.tsx             # Main chat interface
│   │   └── [conversationId]/
│   │       └── page.tsx         # Specific conversation
│   ├── projects/
│   │   ├── page.tsx             # Projects list
│   │   └── [projectId]/
│   │       ├── page.tsx         # Project detail
│   │       └── settings.tsx     # Project settings
│   ├── history/
│   │   └── page.tsx             # Full chat history
│   ├── agents/
│   │   └── page.tsx             # Agent execution monitor
│   └── settings/
│       ├── page.tsx             # Personal settings
│       └── team/
│           └── page.tsx         # Team admin settings
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── callback/page.tsx
│   └── reset-password/page.tsx
├── invite/
│   └── [token]/page.tsx         # Accept invite page
├── api/                         # API routes
└── layout.tsx                   # Root layout
```

### 14.2 Key Components

```
components/
├── layout/
│   ├── Sidebar.tsx              # Left navigation
│   ├── ChatHeader.tsx           # Chat area header
│   ├── RightPanel.tsx           # Collaboration panel
│   └── SettingsLayout.tsx       # Settings page layout
├── chat/
│   ├── MessageThread.tsx        # Message list
│   ├── MessageInput.tsx         # Input area
│   ├── MessageBubble.tsx        # Individual message
│   ├── CodeBlock.tsx            # Syntax highlighted code
│   ├── ImageDisplay.tsx         # Generated images
│   ├── TypingIndicator.tsx      # AI typing animation
│   └── TokenCounter.tsx         # Token usage display
├── projects/
│   ├── ProjectCard.tsx          # Project list item
│   ├── ProjectFolder.tsx        # Project file browser
│   ├── TeamNotes.tsx            # Collaborative notes
│   └── PinnedItems.tsx          # Pinned outputs grid
├── agents/
│   ├── AgentSelector.tsx        # Agent type picker
│   ├── ExecutionPlan.tsx        # Plan review modal
│   ├── ExecutionMonitor.tsx     # Progress streaming
│   └── ToolCallLog.tsx          # Tool execution log
├── settings/
│   ├── ProfileSettings.tsx
│   ├── SecuritySettings.tsx
│   ├── NotificationSettings.tsx
│   ├── AppearanceSettings.tsx
│   ├── AIPreferences.tsx
│   ├── BillingSettings.tsx      # Razorpay integration
│   └── TeamSettings/            # Admin only
│       ├── MemberManagement.tsx
│       ├── SeatManagement.tsx
│       ├── SystemPromptEditor.tsx
│       ├── UsageAnalytics.tsx
│       └── DangerZone.tsx
├── ui/                          # Shared UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Dropdown.tsx
│   ├── Toast.tsx
│   └── Skeleton.tsx
└── providers/
    ├── SupabaseProvider.tsx
    ├── ThemeProvider.tsx
    └── RazorpayProvider.tsx     # Razorpay checkout context
```

---

## 15. State Management

### 15.1 Global State (Zustand)

```typescript
// stores/teamStore.ts
interface TeamState {
  currentTeam: Team | null;
  teams: Team[];
  members: TeamMember[];
  subscription: RazorpaySubscription | null;
  setCurrentTeam: (team: Team) => void;
  fetchTeams: () => Promise<void>;
  inviteMember: (email: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

// stores/chatStore.ts
interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  tokenUsage: number;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  createConversation: () => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  pinConversation: (id: string) => Promise<void>;
  shareToProject: (conversationId: string, projectId: string) => Promise<void>;
}

// stores/agentStore.ts
interface AgentState {
  activeExecutions: AgentExecution[];
  currentExecution: AgentExecution | null;
  executionLogs: ExecutionLog[];
  startExecution: (agentType: string, goal: string) => Promise<void>;
  approvePlan: (executionId: string) => Promise<void>;
  cancelExecution: (executionId: string) => Promise<void>;
  streamExecution: (executionId: string) => void;
}
```

---

## 16. Security Implementation

### 16.1 Middleware Chain

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // 1. Verify JWT
  const { data: { session }, error } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  // 2. Check team membership for team-scoped routes
  if (req.nextUrl.pathname.startsWith('/api/teams/')) {
    const teamId = req.nextUrl.pathname.split('/')[3];
    const hasAccess = await checkTeamMembership(session.user.id, teamId);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
  
  // 3. Check seat limits for invites
  if (req.nextUrl.pathname.endsWith('/invite') && req.method === 'POST') {
    const teamId = req.nextUrl.pathname.split('/')[3];
    const hasSeats = await checkAvailableSeats(teamId);
    if (!hasSeats) {
      return NextResponse.json(
        { error: 'Seat limit reached', upgrade_required: true }, 
        { status: 403 }
      );
    }
  }
  
  // 4. Inject system prompt for AI routes
  if (req.nextUrl.pathname.startsWith('/api/chat') || 
      req.nextUrl.pathname.startsWith('/api/agents/')) {
    const team = await getTeamFromRequest(req);
    req.headers.set('x-team-system-prompt', team?.system_prompt || '');
  }
  
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 16.2 Row Level Security (RLS) Policies

```sql
-- Teams: Users can only see their own teams
CREATE POLICY "Users can view own teams" ON public.teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

-- Conversations: Members can only see their own or shared conversations
CREATE POLICY "Members can view conversations" ON public.conversations
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    ) AND (
      user_id = auth.uid() OR is_shared = true
    )
  );

-- Projects: Members can view team projects
CREATE POLICY "Members can view projects" ON public.projects
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
    )
  );

-- Audit logs: Only owners can view
CREATE POLICY "Owners can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = audit_logs.team_id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
  );
```

---

## 17. Testing Strategy

### 17.1 Unit Tests

```
/tests
├── unit/
│   ├── components/
│   │   ├── MessageBubble.test.tsx
│   │   ├── TokenCounter.test.tsx
│   │   └── AgentSelector.test.tsx
│   ├── lib/
│   │   ├── razorpay.test.ts
│   │   ├── bytez.test.ts
│   │   └── utils.test.ts
│   └── stores/
│       ├── teamStore.test.ts
│       └── chatStore.test.ts
```

### 17.2 Integration Tests

```typescript
// tests/integration/onboarding.test.ts
describe('User Onboarding Flow', () => {
  it('should register user and create team after Razorpay payment', async () => {
    // 1. Register user
    const user = await registerUser({ email: 'test@example.com', password: 'test123' });
    expect(user).toBeDefined();
    
    // 2. Create Razorpay checkout
    const checkout = await createRazorpayCheckout({ plan: 'growth' });
    expect(checkout.subscription_id).toBeDefined();
    
    // 3. Simulate webhook
    await simulateRazorpayWebhook('subscription.activated', {
      subscription: { id: checkout.subscription_id, notes: { team_id: 'pending' } }
    });
    
    // 4. Verify team created
    const teams = await getUserTeams(user.id);
    expect(teams).toHaveLength(1);
    expect(teams[0].plan_tier).toBe(7);
  });
});
```

### 17.3 E2E Tests (Playwright)

```typescript
// e2e/chat.spec.ts
test('user can send message and receive AI response', async ({ page }) => {
  await page.goto('/chat');
  await page.fill('[data-testid="message-input"]', 'Hello AI');
  await page.click('[data-testid="send-button"]');
  
  await expect(page.locator('[data-testid="ai-response"]')).toBeVisible();
  await expect(page.locator('[data-testid="token-usage"]')).toContainText('tokens used');
});

test('seat enforcement blocks invite when limit reached', async ({ page }) => {
  // Starter plan (3 seats) with 3 members
  await page.goto('/settings/team');
  await page.click('[data-testid="invite-member"]');
  await page.fill('[data-testid="invite-email"]', 'new@example.com');
  await page.click('[data-testid="send-invite"]');
  
  await expect(page.locator('[data-testid="upgrade-prompt"]')).toBeVisible();
});
```

---

## 18. Deployment

### 18.1 Infrastructure

```
Production Stack:
- Vercel (Next.js frontend + API routes)
- Railway/Render (FastAPI Python backend)
- Supabase (PostgreSQL + Auth)
- Razorpay (Payments)
- Cloudflare (CDN + DNS)
```

### 18.2 Environment Setup

```bash
# Production deployment checklist
[ ] Set RAZORPAY_KEY_ID to live keys
[ ] Configure Razorpay webhook URL
[ ] Set NEXT_PUBLIC_APP_URL to custom domain
[ ] Enable Supabase RLS policies
[ ] Configure backup strategy (Supabase daily)
[ ] Set up monitoring (Sentry + LogRocket)
[ ] Configure rate limiting (Upstash Redis)
[ ] Set up alerts for failed payments
```

### 18.3 Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=http://supabase:54321
      - RAZORPAY_KEY_ID=rzp_test_xxxx
  
  api:
    build: ./apps/api
    ports:
      - "8000:8000"
    environment:
      - BYTEZ_API_KEY=test_key
      - SUPABASE_URL=http://supabase:54321
  
  supabase:
    image: supabase/supabase-local:latest
    ports:
      - "54321:54321"
      - "54322:54322"
    volumes:
      - supabase-data:/var/lib/postgresql/data

volumes:
  supabase-data:
```

---

## 19. Monitoring & Analytics

### 19.1 Key Metrics Dashboard

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Signup conversion rate | Mixpanel/PostHog | < 20% |
| Time to first message | Application logs | > 5 minutes |
| Daily active users | Supabase | Drop > 30% |
| Token usage per team | Bytez API | Spike > 500% |
| Failed payment rate | Razorpay webhooks | > 10% |
| Agent execution success | Application logs | < 95% |
| API response time | Vercel | > 2s p95 |

### 19.2 Alerting Setup

```typescript
// lib/monitoring.ts
import { Sentry } from '@sentry/nextjs';

export function trackEvent(event: string, properties?: Record<string, any>) {
  // PostHog
  posthog.capture(event, properties);
  
  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: event,
    data: properties,
  });
}

export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, { extra: context });
  
  // Alert on critical errors
  if (error.message.includes('payment') || error.message.includes('subscription')) {
    sendSlackAlert('#billing-alerts', error.message);
  }
}
```

---

*Document Version: 1.3*  
*Last Updated: April 2026*  
*Payment Provider: Razorpay*  
*Total Sections: 19*