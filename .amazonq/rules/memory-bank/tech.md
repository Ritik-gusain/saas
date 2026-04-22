# Technology Stack

## Programming Languages

### Frontend
- **TypeScript 5.9.3** - Primary language for type-safe React/Next.js development
- **JavaScript** - Configuration files and legacy utilities
- **CSS** - Tailwind CSS utility classes

### Backend
- **Python ≥3.10** - FastAPI server and AI inference

## Core Frameworks & Libraries

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.3 | React framework with App Router |
| **React** | 19.2.5 | UI library |
| **React DOM** | 19.2.5 | React rendering |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 4.2.2 | Utility-first CSS framework |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | Latest | Python web framework |
| **Uvicorn** | Latest | ASGI server |
| **Bytez SDK** | Latest | AI inference API client |
| **HTTPX** | Latest | HTTP client for async requests |

## Key Dependencies

### Frontend Production Dependencies
```json
{
  "@anthropic-ai/sdk": "^0.30.0",      // Anthropic Claude API integration
  "firebase": "^12.12.0",               // Firebase client SDK
  "firebase-admin": "^13.8.0",          // Firebase Admin SDK (server-side)
  "gsap": "^3.15.0",                    // Animation library
  "lucide-react": "^1.8.0",             // Icon library
  "next": "^16.2.3",                    // Next.js framework
  "react": "^19.2.5",                   // React library
  "react-dom": "^19.2.5",               // React DOM rendering
  "vercel": "^51.4.0"                   // Vercel deployment CLI
}
```

### Frontend Development Dependencies
```json
{
  "@tailwindcss/postcss": "^4.2.2",           // Tailwind PostCSS plugin
  "@testing-library/dom": "^10.4.1",          // DOM testing utilities
  "@testing-library/jest-dom": "^6.9.1",      // Jest DOM matchers
  "@testing-library/react": "^16.3.2",        // React testing utilities
  "@types/jest": "^30.0.0",                   // Jest type definitions
  "@types/node": "^25.6.0",                   // Node.js type definitions
  "@types/react": "^19.2.14",                 // React type definitions
  "autoprefixer": "^10.5.0",                  // CSS vendor prefixing
  "jest": "^30.3.0",                          // Testing framework
  "jest-environment-jsdom": "^30.3.0",        // Jest browser environment
  "postcss": "^8.5.10",                       // CSS transformation
  "tailwindcss": "^4.2.2",                    // Tailwind CSS
  "ts-node": "^10.9.2",                       // TypeScript execution
  "typescript": "^5.9.3"                      // TypeScript compiler
}
```

### Backend Dependencies
```python
fastapi          # Web framework
uvicorn          # ASGI server
httpx            # Async HTTP client
python-dotenv    # Environment variable management
bytez            # AI inference SDK
```

## External Services & APIs

### Authentication & Database
- **Supabase** - PostgreSQL database + authentication + RLS
  - Project URL: `NEXT_PUBLIC_SUPABASE_URL`
  - Anon Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Service Role Key: `SUPABASE_SERVICE_ROLE_KEY`

### Payments
- **Razorpay** - Subscription billing and payment processing
  - Key ID: `RAZORPAY_KEY_ID`
  - Key Secret: `RAZORPAY_KEY_SECRET`
  - Webhook Secret: `RAZORPAY_WEBHOOK_SECRET`
  - Plan IDs: `RAZORPAY_PLAN_STARTER_ID`, `RAZORPAY_PLAN_GROWTH_ID`, `RAZORPAY_PLAN_PRO_ID`

### AI Inference
- **Bytez API** - AI model inference (Google Gemma-4-26B)
  - API Key: `BYTEZ_API_KEY`
  - API URL: `BYTEZ_API_URL` (https://api.bytez.com/v1)

### OAuth Providers
- **Google OAuth** - Social authentication
  - Client ID: `GOOGLE_CLIENT_ID`
  - Client Secret: `GOOGLE_CLIENT_SECRET`

### Integrations (Optional/Planned)
- **GitHub** - Code agent integration
  - Client ID: `GITHUB_CLIENT_ID`
  - Client Secret: `GITHUB_CLIENT_SECRET`
- **Slack** - Workflow automation
  - Client ID: `SLACK_CLIENT_ID`
  - Client Secret: `SLACK_CLIENT_SECRET`

## Build Tools & Configuration

### Next.js Configuration (`next.config.mjs`)
- App Router enabled
- TypeScript strict mode
- Environment variable validation
- API route configuration

### TypeScript Configuration (`tsconfig.json`)
- Target: ES2020+
- Module: ESNext
- Strict mode enabled
- Path aliases configured
- JSX: preserve (for React)

### Tailwind CSS Configuration
- Version 4.2.2 with PostCSS plugin
- Custom color palette
- Responsive breakpoints
- Dark mode support

### PostCSS Configuration (`postcss.config.js`)
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {}
  }
}
```

### Jest Configuration (`jest.config.ts`)
- Test environment: jsdom
- TypeScript support via ts-jest
- Coverage reporting
- Module path mapping

## Development Commands

### Frontend
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npm run test     # Run Jest tests
npm run deploy   # Deploy to Vercel
```

### Backend
```bash
uvicorn server:app --reload --port 8000  # Start FastAPI dev server
python server.py                          # Alternative start method
```

## Environment Requirements

### Node.js
- **Minimum Version:** 18.x
- **Recommended:** 20.x LTS
- Specified in `package.json` engines field

### Python
- **Minimum Version:** 3.10
- **Recommended:** 3.11+
- Required for FastAPI and Bytez SDK

### Package Managers
- **npm** - Frontend dependency management (lockfile: package-lock.json)
- **pip** - Backend dependency management

## Database Technology

### Supabase PostgreSQL
- **Version:** Latest (managed by Supabase)
- **Features Used:**
  - Row Level Security (RLS)
  - Triggers and functions
  - Foreign key constraints
  - Indexes for performance
  - JSONB columns for flexible data

### Schema Management
- SQL schema file: `backend/supabase/schema.sql`
- Manual migration via Supabase SQL Editor
- RLS policies defined per table

## Deployment Platforms

### Frontend Hosting
- **Vercel** - Serverless Next.js deployment
  - Automatic builds from Git
  - Edge Functions for API routes
  - Environment variable management
  - Custom domain support

### Backend Hosting Options
- **Railway** - Python container hosting
- **Render** - Web service deployment
- **Fly.io** - Global edge deployment
- Any platform supporting Python/FastAPI

### Database Hosting
- **Supabase Cloud** - Managed PostgreSQL
  - Free tier available
  - Automatic backups
  - Connection pooling
  - Built-in Auth service

## State Management

### Zustand Stores
- **teamStore.ts** - Team, member, subscription state
- **chatStore.ts** - Conversations, messages, export/share
- **agentStore.ts** - Agent execution, planning, streaming

### Why Zustand?
- Lightweight (no boilerplate)
- TypeScript-first
- No context provider wrapping
- DevTools support

## Animation & UI

### GSAP (GreenSock Animation Platform)
- **Version:** 3.15.0
- **Skills Available:**
  - gsap-core: Core animation engine
  - gsap-react: React integration
  - gsap-scrolltrigger: Scroll-based animations
  - gsap-timeline: Complex animation sequences
  - gsap-plugins: Additional effects
  - gsap-utils: Helper functions

### Icon Library
- **lucide-react 1.8.0** - Modern icon set with React components

## Testing Stack

### Unit & Integration Testing
- **Jest 30.3.0** - Test runner and assertion library
- **@testing-library/react 16.3.2** - React component testing
- **@testing-library/jest-dom 6.9.1** - Custom DOM matchers
- **jest-environment-jsdom 30.3.0** - Browser-like test environment

### Test Organization
- Test files in `__tests__/` directory
- Mirrors source structure (api/, components/, utils/)

## Security & Authentication

### JWT Management
- HTTP-only cookies for token storage
- Middleware-based verification on all protected routes
- Supabase Auth SDK for token generation/validation

### API Security
- CORS middleware in FastAPI
- Razorpay webhook signature verification
- Row Level Security in database
- Environment variable protection

## Version Control & CI/CD

### Git Configuration
- `.gitignore` - Excludes node_modules, .env.local, build artifacts
- GitHub repository: https://github.com/Ritik-gusain/chatbot

### Deployment Automation
- Vercel: Automatic deployment on Git push
- Environment variables configured per environment
- Preview deployments for pull requests
