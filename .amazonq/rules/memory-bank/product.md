# Product Overview

## Project Purpose
Luminescent.io is a B2B Team AI Chatbot SaaS platform that replaces fragmented individual AI subscriptions with unified team-wide plans. The platform enables companies to consolidate AI access for their entire team under a single subscription, reducing costs by up to 50% compared to individual ChatGPT seats.

**Live Application:** https://chatbot-nine-psi-46.vercel.app/

## Value Proposition
- **Cost Efficiency:** Fixed monthly pricing for 3, 7, or 12 seats (₹2,400-₹8,200/month) vs. individual subscriptions
- **Team Collaboration:** Shared AI workspace with team-wide system prompts, projects, and conversation history
- **Usage Arbitrage:** 80-95% gross margins through fixed subscription revenue vs. token-consumption costs (Bytez API)
- **Centralized Management:** Single billing, team administration, and usage analytics dashboard

## Key Features

### Authentication & Access Control
- Email/password and Google OAuth authentication
- OTP email verification via Supabase Magic Links
- JWT-based session management with middleware protection
- Role-based access control (owner, admin, member)

### AI Chat Workspace
- Real-time streaming AI responses powered by Bytez API (Google Gemma-4-26B model)
- Editable conversation titles with pin/archive/export capabilities (JSON, Markdown)
- Team-shared system prompts with owner-level control
- Per-conversation token usage tracking
- Model selector for switching AI models
- Multi-line input with file attachments, voice input, and prompt templates

### Team Management
- Create teams with seat limits (3, 7, or 12 users)
- Email-based member invitations with magic links
- Seat enforcement with upgrade prompts when limits are reached
- Team ownership transfer capabilities
- Member role management (owner/admin/member permissions)

### Billing & Subscriptions (Razorpay)
- Three pricing tiers: Starter (₹2,400), Growth (₹4,900), Pro (₹8,200)
- Webhook-driven team provisioning on subscription activation
- Customer portal for invoice and payment management
- Plan upgrade/downgrade/cancellation support
- Subscription status tracking

### Projects & Collaboration
- Shared team folders for organizing conversations, notes, and files
- Pin AI outputs and tag with colors
- Project-level system prompt overrides
- Sub-folder support with starring and activity logs

### Admin Dashboard
- Usage analytics per team member (text vs. image tokens)
- Audit log for admin actions and agent tool calls
- Team system prompt management with version history
- Razorpay billing portal integration
- Enterprise features: SSO, IP allowlist (planned)

### AI Agents (Phase 3 - Planned)
- **Research Agent:** Multi-source web research and summarization
- **Content Creation Agent:** Long-form SEO content with image generation
- **Code Agent:** Write, test, and debug code with GitHub integration
- **Data Analysis Agent:** CSV/Excel analysis with chart generation
- **Workflow Automation Agent:** Gmail/Calendar/Slack task automation
- **Document Processing Agent:** PDF/Word extraction and comparison

## Target Users
- **Small to Medium Teams (3-12 members):** Startups, agencies, consulting firms
- **Cost-Conscious Organizations:** Companies seeking AI access without per-seat pricing
- **Collaborative Teams:** Groups requiring shared AI context and team-wide prompts
- **Indian Market Focus:** Pricing optimized for Indian businesses (₹ pricing with $ equivalents)

## Use Cases
- Team-wide customer support response generation
- Collaborative content creation and marketing copy
- Shared research and competitive analysis
- Code review and debugging assistance
- Document processing and data analysis
- Internal knowledge base queries with team context
