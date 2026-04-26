
> **AI-Powered Team Collaboration Platform**
>
> *"Stop paying for individual ChatGPT seats. Unify your team's AI for half the cost."*


---

Luminescent.io is a hybrid **Freemium (BYOK) + Team AI Chatbot SaaS**. 

- **Individuals (Free/BYOK):** Solo users can use the platform for free by bringing their own API keys (OpenAI, Anthropic, OpenRouter, etc.). Usage is billed directly to their own API accounts.
- **Teams (Subscription+ BYOK):** Companies replace fragmented individual AI subscriptions with a single team-wide plan. Teams get shared workspaces, collaboration features, and usage is covered by the platform's API allowance (via Bytez).

### Pricing Tiers

| Plan         | Seats    | Monthly Price        | API Model        |
|--------------|----------|----------------------|------------------|
| **Solo**     | 1       | **Free**             | BYOK (Required)  |
| Starter Team | Up to 3  | ₹999                 | BYOK (Required)  |
| Growth Team  | Up to 7  | ₹2,499               | BYOK (Required)  |
| Pro Team     | Up to 12 | ₹3,999               | BYOK (Required)  |

> **Business model:** The platform functions as an interface shell. High friction server-based inference costs are eliminated entirely by mandating a Bring Your Own Key (BYOK) model for all tiers. We monetize the team collaboration software (shared workspaces, team instructions) through fixed subscription revenue.

---

## Tech Stack

| Layer            | Technology                                          |
|------------------|-----------------------------------------------------|
| **Frontend**     | Next.js 16 (React 19, App Router), TypeScript, Tailwind CSS |
| **State**        | Zustand stores (team, chat, agent)                  |
| **Auth & DB**    | Firebase (Auth & Firestore)                         |
| **Payments**     | Razorpay (Subscriptions + Webhooks + Customer Portal) |
| **AI Backend**   | Python FastAPI + Bytez API                          |



### Architecture

```
User → Next.js Frontend → Next.js API Routes (Middleware) → FastAPI → Bytez API
              ↓                        ↓                        ↓
         Firebase Auth          Cloud Firestore          Token Tracking
         Razorpay Webhooks
```

---

## Features

### 🔐 Authentication
- Firebase-powered email/password signup & login
- Google OAuth support
- OTP verification via Firebase Auth
- Middleware-based JWT verification on all protected routes
- Secure session management

### 🤖 AI Chat Workspace
- Real-time streaming AI responses (Bytez API)
- Editable conversation titles, pin/archive/export (JSON, Markdown)
- Team-shared system prompts with owner control
- Per-conversation token usage meter
- Model selector (switch AI models per conversation)
- Multi-line input with file attachments, voice input toggle, prompt templates

### 👥 Team Management
- Create teams with seat limits (3, 7, or 12)
- Invite members by email (secure magic links)
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
│   │   ├── (dashboard)/               # Protected routes (chat, projects, analytics)
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
│   │   └── layout-providers.tsx       # Theme, Razorpay providers
│   ├── components/
│   │   ├── LandingPage.tsx            # Full landing page (hero, features, pricing)
│   │   ├── ChatDashboard.tsx          # Main chat workspace
│   │   ├── chat/                      # Message components
│   │   ├── layout/                    # Page layouts
│   │   ├── pricing/                   # Pricing components
│   │   ├── providers/                 # ThemeProvider, RazorpayProvider
│   │   └── ui/                        # Shared UI components
│   ├── stores/
│   │   ├── teamStore.ts               # Team & subscription state
│   │   ├── chatStore.ts               # Conversations & messages
│   │   └── agentStore.ts              # Agent execution state
│   ├── lib/
│   │   ├── firebase.ts                # Firebase client config
│   │   ├── firebase-admin.ts          # Firebase Admin SDK config
│   │   └── razorpay.ts                # Razorpay configuration
│   ├── types/
│   │   └── database.ts                # Firestore schema types
│   ├── hooks/                         # Custom React hooks
│   ├── utils/                         # Utility functions
│   ├── services/                      # API service layer
│   ├── middleware.ts                  # Auth & team validation
│   ├── next.config.mjs
│   └── package.json
├── backend/
│   ├── server.py                      # FastAPI AI server (Bytez integration)
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
- A [Firebase](https://firebase.google.com) project
- A [Razorpay](https://razorpay.com) account (for billing)
- A [Bytez](https://bytez.com) API key (AI inference)

### 1. Clone the repo

```bash
git clone https://github.com/Ritik-gusain/saas.git
cd saas/luminescent
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

### 4. Database Setup (Firebase)

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password, Google)
3. Create a **Cloud Firestore** database
4. Obtain your Firebase config from Project Settings → General → Your apps
5. Generate a new private key for the **Admin SDK** from Project Settings → Service accounts

### 5. Razorpay setup

1. Create a [Razorpay](https://razorpay.com) account (use **Test mode**)
2. Create Plans in the Dashboard (Starter, Growth, Pro)
3. Configure Webhook URL and subscribe to `subscription.activated`, `subscription.charged`, etc.

---

## Environment Variables

Create `frontend/.env.local` with the following:

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase (Admin)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="your-private-key"

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Bytez AI
BYTEZ_API_KEY=your-bytez-api-key
BYTEZ_API_URL=https://api.bytez.com/v1

# FastAPI Backend
FASTAPI_URL=http://localhost:8000
FASTAPI_API_KEY=your-internal-secret
```

---

## Roadmap

### Phase 1 — MVP ✅ Complete
- [x] Landing page with hero, features & pricing
- [x] Firebase authentication (email + OAuth)
- [x] AI chat interface (Bytez integration)
- [x] Next.js + FastAPI architecture

### Phase 2 — Team & Projects ✅ Complete
- [x] User profile and settings
- [x] Chat history panel and management
- [x] Team workspaces and invitation system
- [x] Projects and group collaboration folders
- [x] Razorpay subscription integration
- [x] Admin analytics dashboard

### Phase 3 — Collaboration & Agents 📅 Planned
- [ ] Team system prompts
- [ ] Shared team chat history feed
- [ ] Text-to-image generation
- [ ] Advanced AI Agents (Research, Content, Code, etc.)
- [ ] Third-party integrations (Slack, GitHub, etc.)

---

## Security

- JWT verification via Firebase Auth in Next.js middleware
- Multi-tenant data isolation in Cloud Firestore
- Secure server-side operations via Firebase Admin SDK
- Razorpay webhook signature verification
- Audit logging for administrative actions

---

## Support

📧 Open an issue on [GitHub](https://github.com/Ritik-gusain/saas/issues)

💬 Try the live app: [luminescent-io.vercel.app](https://luminescent-io.vercel.app/)

---

**Made with ❤️ by Ritik**
