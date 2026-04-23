

> **AI-Powered Team Collaboration Platform**
>
> *"Stop paying for individual ChatGPT seats. Unify your team's AI for half the cost."*


---

Luminescent.io is a hybrid **Freemium (BYOK) + Team AI Chatbot SaaS**. 

- **Individuals (Free/BYOK):** Solo users can use the platform for free by bringing their own API keys (OpenAI, Anthropic, OpenRouter, etc.). Usage is billed directly to their own API accounts.
- **Teams (Subscription):** Companies replace fragmented individual AI subscriptions with a single team-wide plan. Teams get shared workspaces, collaboration features, and usage is covered by the platform's API allowance (via Bytez).

### Pricing Tiers

| Plan         | Seats    | Monthly Price | Per-User Cost |
|--------------|----------|----------------------|--------------|
| **Solo (BYOK)** | 1     | **Free**      | BYOK cost           |
| Starter Team | Up to 3  | ₹999          | ₹1,300/user + BYOK  |
| Growth Team  | Up to 7  | ₹2,999        | ₹1,271/user + BYOK  |
| Pro Team     | Up to 12 | ₹3,900        | ₹1,241/user + BYOK  |

> **Business model:** Frictionless onboarding for individuals via BYOK, while monetizing team collaboration and shared workspaces through fixed subscription revenue.

---

## Tech Stack

| Layer            | Technology                                          |
|------------------|-----------------------------------------------------|
| **Frontend**     | Next.js 16 (React 19, App Router), TypeScript, Tailwind CSS |
| **State**        | Zustand stores (team, chat, agent)                  |
| **Auth & DB**    | Supabase (PostgreSQL + Auth + RLS)                  |
| **Payments**     | Razorpay (Subscriptions + Webhooks + Customer Portal) |
| **AI Backend**   | Python FastAPI + Bytez API inference engine         |
| **Email**        | Supabase Magic Links                                |
| **Deployment**   | Vercel (frontend) + FastAPI server (separate host)  |

### Architecture

```
User → Next.js Frontend → Next.js API Routes (Middleware) → FastAPI → Bytez API
              ↓                        ↓                        ↓
         Supabase Auth            Supabase DB            Token Tracking
         Razorpay Webhooks
```

---

## Features

### 🔐 Authentication
- Email/password signup & login
- Google OAuth support
- OTP email verification
- Middleware-based JWT verification on all protected routes
- Session management via Supabase

### 🤖 AI Chat Workspace
- Real-time streaming AI responses (Bytez API)
- Editable conversation titles, pin/archive/export (JSON, Markdown)
- Team-shared system prompts with owner control
- Per-conversation token usage meter
- Model selector (switch AI models per conversation)
- Multi-line input with file attachments, voice input toggle, prompt templates

### 👥 Team Management
- Create teams with seat limits (3, 7, or 12)
- Invite members by email (magic link)
- Role-based access: `owner`, `admin`, `member`
- Seat enforcement — blocks invite when plan limit is reached, prompts upgrade
- Transfer team ownership

### 💳 Razorpay Billing
- Subscription checkout flow
- Webhook-driven team provisioning (`subscription.activated`)
- Customer portal for invoice & payment management
- Plan upgrade/downgrade/cancel support

### 📁 Projects (Team Workspaces)
- Shared team folders for conversations, notes, and files
- Pin AI outputs, tag with color, set project-level system prompt overrides
- Sub-folder support, starring, activity log

### 🤖 AI Agents (Phase 3)
| Agent               | Purpose                             |
|---------------------|-------------------------------------|
| Research            | Multi-source web research & summary |
| Content Creation    | Long-form SEO content + image gen   |
| Code                | Write, test, debug with GitHub      |
| Data Analysis       | Analyze CSV/Excel, generate charts  |
| Workflow Automation | Automate Gmail/Calendar/Slack tasks |
| Document Processing | Extract & compare PDF/Word docs     |

### 📊 Admin Settings (Owner/Admin)
- Usage analytics per member (tokens: text vs. image)
- Audit log for all admin actions and agent tool calls
- Team system prompt management with version history
- Razorpay billing portal integration
- SSO, IP allowlist (Enterprise)

---

## Project Structure

```
luminescent/
├── frontend/                          # Next.js application
│   ├── app/
│   │   ├── (auth)/                    # Login / Register pages
│   │   ├── (dashboard)/               # Protected routes
│   │   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   │   └── chat/page.tsx          # Main chat interface
│   │   ├── api/
│   │   │   ├── auth/                  # register, login, logout, callback
│   │   │   ├── chat/route.ts          # AI chat endpoint → FastAPI proxy
│   │   │   ├── conversations/         # CRUD + pin/archive/share/export
│   │   │   ├── teams/                 # Team CRUD + invite/accept
│   │   │   ├── projects/              # Project CRUD + notes/files/pin
│   │   │   ├── agents/                # Agent plan/execute/stream/cancel
│   │   │   ├── razorpay/              # checkout, webhook, portal, cancel
│   │   │   ├── admin/                 # usage analytics, audit log
│   │   │   └── users/route.ts         # Profile get/update
│   │   ├── auth/callback/             # OAuth callback
│   │   ├── invite/[token]/            # Team invitation acceptance
│   │   ├── layout.tsx                 # Root layout
│   │   └── layout-providers.tsx       # Supabase, Theme, Razorpay providers
│   ├── components/
│   │   ├── LandingPage.tsx            # Full landing page (hero, features, pricing)
│   │   ├── ChatDashboard.tsx          # Main chat workspace
│   │   ├── chat/                      # MessageBubble, MessageThread, MessageInput, TokenCounter
│   │   ├── layout/                    # LandingLayout
│   │   ├── pricing/                   # PricingPlans
│   │   ├── providers/                 # SupabaseProvider, ThemeProvider, RazorpayProvider
│   │   └── ui/                        # Shared UI components
│   ├── stores/
│   │   ├── teamStore.ts               # Team, member, subscription state
│   │   ├── chatStore.ts               # Conversations, messages, export/share
│   │   └── agentStore.ts              # Agent execution, planning, streaming
│   ├── lib/
│   │   └── razorpay.ts                # Razorpay config, signature verification, types
│   ├── types/
│   │   └── database.ts                # Complete Supabase schema TypeScript types
│   ├── hooks/                         # Custom React hooks
│   ├── utils/                         # Utility functions
│   ├── services/                      # API service layer
│   ├── middleware.ts                  # Auth & team membership validation
│   ├── next.config.mjs
│   └── package.json
├── backend/
│   ├── server.py                      # FastAPI AI server (Bytez integration)
│   ├── supabase/
│   │   └── schema.sql                 # Full PostgreSQL schema with RLS policies
│   └── keys/                          # API keys (gitignored)
├── docs/
│   ├── LUMINESCENT_PROJECT_DOCUMENT.md  # Complete technical specification
│   └── SAAS_BUSINESS_PLAN.md            # Business model & GTM strategy
├── SETUP_COMPLETE.md                  # Implementation status & next steps
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- A [Supabase](https://supabase.com) project (free tier OK)
- A [Razorpay](https://razorpay.com) account (for billing)
- A [Bytez](https://bytez.com) API key (AI inference)

### 1. Clone the repo

```bash
git clone https://github.com/Ritik-gusain/chatbot
cd chatbot/luminescent
```

### 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)
npm run dev
# → http://localhost:3000
```

### 3. Backend setup

```bash
cd backend
pip install fastapi uvicorn httpx python-dotenv
uvicorn server:app --reload --port 8000
# → http://localhost:8000
```

### 4. Database setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **anon key** from Settings → API
3. Open the **SQL Editor** and run `backend/supabase/schema.sql`
4. Enable Auth providers:
   - Authentication → Providers → Email ✅ (default)
   - (Optional) Google OAuth — add credentials, set redirect URL to `http://localhost:3000/auth/callback`

### 5. Razorpay setup

1. Create a [Razorpay](https://razorpay.com) account (use **Test mode** for development)
2. Create 3 Plans in the Razorpay Dashboard:
   - **Starter:** ₹3,900/month
   - **Growth:** ₹8,900/month
   - **Pro:** ₹14,900/month
3. Configure Webhook URL: `https://your-domain.com/api/razorpay/webhook`
4. Subscribe to events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed`

---

## Environment Variables

Create `frontend/.env.local` with the following:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Razorpay Plan IDs (from Razorpay Dashboard)
RAZORPAY_PLAN_STARTER_ID=plan_xxxxxxxxxxxx
RAZORPAY_PLAN_GROWTH_ID=plan_xxxxxxxxxxxx
RAZORPAY_PLAN_PRO_ID=plan_xxxxxxxxxxxx

# Bytez AI
BYTEZ_API_KEY=your-bytez-api-key
BYTEZ_API_URL=https://api.bytez.com/v1

# FastAPI Backend
FASTAPI_URL=http://localhost:8000
FASTAPI_API_KEY=your-internal-secret

# Integrations (Optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
```

---

## API Reference

### Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/auth/logout` | POST | Yes | Logout user |
| `/api/auth/callback` | GET | No | OAuth callback (Google) |

### Chat

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message (streams from Bytez via FastAPI) |
| `/api/conversations` | GET | List conversations |
| `/api/conversations/:id` | GET / PATCH / DELETE | Conversation CRUD |
| `/api/conversations/:id/pin` | POST | Pin/unpin |
| `/api/conversations/:id/share` | POST | Share to project |
| `/api/conversations/:id/export` | POST | Export (JSON / Markdown) |

### Teams

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/teams` | GET / POST | Member / Owner | List / create team |
| `/api/teams/:id/invite` | POST | Owner/Admin | Invite member |
| `/api/teams/invite/accept` | POST | — | Accept invite token |
| `/api/teams/:id/members/:userId` | DELETE / PATCH | Owner/Admin | Remove / update role |

### Billing (Razorpay)

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/razorpay/checkout` | POST | Owner | Create subscription checkout |
| `/api/razorpay/webhook` | POST | — | Razorpay event handler |
| `/api/razorpay/portal` | POST | Owner | Customer portal link |
| `/api/razorpay/subscription` | GET | Owner | Subscription status |
| `/api/razorpay/cancel` | POST | Owner | Cancel subscription |

### Agents

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents/:type/plan` | POST | Generate execution plan |
| `/api/agents/executions/:id` | GET | Get execution status |
| `/api/agents/executions/:id/stream` | GET | Stream execution updates |
| `/api/agents/executions/:id/cancel` | POST | Cancel execution |

---

## Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

Set all environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

### FastAPI Backend

Deploy `backend/server.py` to any Python host (Railway, Render, Fly.io, etc.) and set `FASTAPI_URL` in Vercel to point to it.

---

## Roadmap

### Phase 1 — MVP ✅ Complete
- [x] Landing page with hero, features & pricing
- [x] Supabase authentication (email + OAuth)
- [x] AI chat interface (Bytez)
- [x] Next.js + FastAPI architecture

### Phase 2 — Team Management 🚧 In Progress
- [ ] User profile section
- [ ] Chat history panel
- [ ] Projects / group collaboration folders
- [ ] **Razorpay** subscription checkout & webhooks
- [ ] Team database structure (`razorpay_subscription_id`)
- [ ] Email invitation system
- [ ] Seat enforcement + upgrade prompts
- [ ] Admin dashboard
- [ ] Billing management portal
- [ ] User preference settings

### Phase 3 — Collaboration & Agents 📅 Planned
- [ ] Team system prompts (company-wide AI persona)
- [ ] Shared team chat history feed
- [ ] Text-to-image generation
- [ ] Token usage analytics dashboard
- [ ] Research, Content, Code, Data, Workflow, Document agents
- [ ] Google Drive / Slack / GitHub integrations
- [ ] Custom agents & MCP server registry
- [ ] Multi-model support
- [ ] Enterprise SSO & audit log

---

## Security

- JWT verification on all API routes via Next.js middleware
- Team membership validated on every team-scoped request
- Row Level Security (RLS) enforced in Supabase for all tables
- Razorpay webhook signature verification
- Audit logging for all admin actions and agent tool calls
- GDPR-compliant data export & deletion

---

## Support

📧 Open an issue on [GitHub](https://github.com/Ritik-gusain/chatbot/issues)

💬 Try the live app: [chatbot-nine-psi-46.vercel.app](https://chatbot-nine-psi-46.vercel.app/)

📄 Full technical spec: [`docs/LUMINESCENT_PROJECT_DOCUMENT.md`](./docs/LUMINESCENT_PROJECT_DOCUMENT.md)

---

**Made with ❤️ by Ritik**
