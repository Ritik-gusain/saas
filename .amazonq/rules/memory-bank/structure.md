# Project Structure

## Directory Organization

```
luminescent/
├── frontend/              # Next.js 16 application (React 19, App Router)
├── backend/               # Python FastAPI AI inference server
├── docs/                  # Technical documentation and business plans
├── skills/                # AI agent skill definitions (GSAP, Supabase)
└── .amazonq/              # Amazon Q rules and memory bank
```

## Frontend Structure (`frontend/`)

### Core Application (`app/`)
```
app/
├── (auth)/                # Authentication routes (login, register)
├── (dashboard)/           # Protected dashboard routes
│   ├── layout.tsx         # Dashboard layout with sidebar
│   ├── chat/page.tsx      # Main chat interface
│   └── analytics/page.tsx # Usage analytics dashboard
├── api/                   # Next.js API routes
│   ├── auth/              # register, login, logout, callback
│   ├── chat/route.ts      # AI chat proxy to FastAPI
│   ├── conversations/     # Conversation CRUD + pin/archive/export
│   ├── teams/             # Team management + invite/accept
│   ├── projects/          # Project CRUD + notes/files
│   ├── agents/            # Agent execution endpoints
│   ├── razorpay/          # Billing webhooks and checkout
│   ├── admin/             # Usage analytics and audit logs
│   └── users/route.ts     # User profile management
├── auth/callback/         # OAuth callback handler
├── invite/[token]/        # Team invitation acceptance
├── layout.tsx             # Root layout with providers
├── layout-providers.tsx   # Supabase, Theme, Razorpay providers
├── page.tsx               # Landing page
└── globals.css            # Global styles (Tailwind)
```

### Components (`components/`)
```
components/
├── chat/                  # Chat-specific components
│   ├── MessageBubble      # Individual message display
│   ├── MessageThread      # Conversation thread
│   ├── MessageInput       # Multi-line input with attachments
│   └── TokenCounter       # Token usage meter
├── layout/                # Layout components
│   └── LandingLayout      # Landing page structure
├── pricing/               # Pricing components
│   └── PricingPlans       # Pricing tier cards
├── providers/             # React context providers
│   ├── SupabaseProvider   # Supabase client context
│   ├── ThemeProvider      # Dark/light theme
│   └── RazorpayProvider   # Razorpay SDK wrapper
├── ui/                    # Reusable UI components
├── AdminPanel.tsx         # Admin dashboard
├── AuthGuard.tsx          # Route protection wrapper
├── ChatDashboard.tsx      # Main chat workspace
├── LandingPage.tsx        # Landing page hero + features
├── Logo.tsx               # Brand logo component
└── PricingPlans.tsx       # Pricing section
```

### State Management (`stores/`)
```
stores/
├── teamStore.ts           # Team, member, subscription state (Zustand)
├── chatStore.ts           # Conversations, messages, export/share (Zustand)
└── agentStore.ts          # Agent execution, planning, streaming (Zustand)
```

### Services & Utilities
```
services/
├── auth.ts                # Authentication service layer
└── billing.ts             # Razorpay billing service

lib/
├── api-client.ts          # HTTP client wrapper
├── firebase-admin.ts      # Firebase Admin SDK (server-side)
├── firebase.ts            # Firebase client SDK
├── models.js              # AI model configurations
└── razorpay.ts            # Razorpay config, signature verification

types/
├── database.ts            # Supabase schema TypeScript types
└── index.ts               # Shared type definitions

utils/
└── helpers.ts             # Utility functions

hooks/
└── useUser.ts             # User authentication hook
```

### Configuration Files
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration (v4.2.2)
- `postcss.config.js` - PostCSS configuration
- `jest.config.ts` - Jest testing configuration
- `package.json` - Dependencies and scripts
- `.env.local` - Environment variables (gitignored)
- `.env.example` - Environment variable template

## Backend Structure (`backend/`)

```
backend/
├── server.py              # FastAPI application with Bytez API integration
├── supabase/
│   └── schema.sql         # PostgreSQL schema with RLS policies
└── keys/                  # API keys (gitignored)
    ├── bytez_api_key.txt
    └── supabase_anon_key.txt
```

### FastAPI Server (`server.py`)
- Single endpoint: `POST /api/chat`
- Bytez SDK integration (Google Gemma-4-26B model)
- CORS middleware for cross-origin requests
- Static file serving for fallback routes

## Database Schema (Supabase PostgreSQL)

### Core Tables
- `users` - User profiles and authentication
- `teams` - Team metadata and seat limits
- `team_members` - Team membership with roles
- `team_invitations` - Pending email invitations
- `conversations` - Chat conversation metadata
- `messages` - Individual chat messages
- `projects` - Team project folders
- `system_prompts` - Team-wide AI prompts
- `subscriptions` - Razorpay subscription tracking
- `usage_logs` - Token usage per user/conversation
- `audit_logs` - Admin action tracking

### Row Level Security (RLS)
All tables enforce RLS policies to ensure:
- Users can only access their own data
- Team members can only access team-scoped resources
- Admins/owners have elevated permissions within their teams

## Architecture Patterns

### Request Flow
```
User → Next.js Frontend → Next.js API Routes (Middleware) → FastAPI → Bytez API
              ↓                        ↓                        ↓
         Supabase Auth            Supabase DB            Token Tracking
         Razorpay Webhooks
```

### Authentication Flow
1. User logs in via Supabase Auth (email/password or OAuth)
2. JWT token stored in HTTP-only cookie
3. Middleware validates JWT on every protected route
4. Team membership verified for team-scoped requests

### Billing Flow
1. User selects plan on frontend
2. Razorpay checkout initiated via API
3. Webhook receives `subscription.activated` event
4. Team provisioned with seat limits in database
5. Subscription ID stored for future management

### AI Chat Flow
1. User sends message from ChatDashboard
2. Next.js API route `/api/chat` receives request
3. Request proxied to FastAPI backend
4. FastAPI calls Bytez API with system prompt + messages
5. Streaming response returned to frontend
6. Token usage logged to database

## Key Relationships

- **User → Teams:** Many-to-many via `team_members` (with roles)
- **Team → Conversations:** One-to-many (team owns conversations)
- **Conversation → Messages:** One-to-many (ordered by timestamp)
- **Team → Projects:** One-to-many (shared folders)
- **Team → Subscription:** One-to-one (Razorpay subscription)
- **User → Usage Logs:** One-to-many (token tracking per user)

## Deployment Architecture

- **Frontend:** Vercel (Next.js App Router with Edge Functions)
- **Backend:** Separate Python host (Railway, Render, Fly.io)
- **Database:** Supabase (managed PostgreSQL + Auth)
- **Payments:** Razorpay (webhooks + customer portal)
- **AI Inference:** Bytez API (external service)

## Development Workflow

1. **Local Development:**
   - Frontend: `npm run dev` (port 3000)
   - Backend: `uvicorn server:app --reload` (port 8000)
   - Database: Supabase cloud instance

2. **Testing:**
   - Jest for unit/integration tests
   - Test files in `__tests__/` directory

3. **Deployment:**
   - Frontend: `vercel --prod`
   - Backend: Platform-specific deployment
   - Environment variables configured in hosting dashboards
