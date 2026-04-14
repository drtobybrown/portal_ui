# CANFAR Science Portal UI — Architecture Summary

**Audience:** Development team, AI agents extending this codebase  
**Last updated:** 2026-01

---

## 1. Overview

This is a **static prototype UI** for the CANFAR Science Platform. It uses Next.js 14 (App Router), Tailwind CSS, and TypeScript. All data is currently **mock/dummy** — no backend APIs, authentication, or persistent storage.

### Key Characteristics

- **Client-first:** All pages are statically generated; no API routes
- **Dummy data:** `lib/dummy-data.ts` provides all mock data
- **Design system:** UVic brand colors, Inter font, Stripe-like aesthetic

---

## 2. Project Structure

```
science_portal_ui/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout (font, metadata, LayoutProvider)
│   ├── page.tsx             # Dashboard (/)
│   ├── globals.css          # Tailwind + custom animations
│   ├── batch/page.tsx       # Batch processing placeholder
│   ├── metrics/page.tsx     # Grafana-style monitoring
│   ├── sessions/page.tsx    # Session management
│   ├── settings/page.tsx    # User settings placeholder
│   └── storage/page.tsx     # Data/storage placeholder
├── components/
│   ├── dashboard/           # Dashboard-specific
│   │   ├── greeting-card.tsx
│   │   ├── resource-gauge.tsx
│   │   ├── resource-history.tsx
│   │   ├── active-sessions.tsx
│   │   └── quick-actions.tsx
│   ├── layout/
│   │   ├── sidebar.tsx      # Main nav (dark blue)
│   │   ├── header.tsx      # Search, notifications, user
│   │   └── layout-provider.tsx  # Client context for sidebar/mobile state
│   ├── session-launcher/
│   │   └── launcher-modal.tsx   # Session creation wizard (Quick + Custom)
│   └── ui/                 # Reusable primitives
│       ├── button.tsx, badge.tsx, card.tsx, progress.tsx
│       ├── chart.tsx       # LineChart, BarChart, GrafanaPanel
│       ├── canfar-logo.tsx # SVG logo component
│       └── error-boundary.tsx
├── lib/
│   ├── dummy-data.ts       # All mock data (sessions, metrics, templates)
│   └── utils.ts            # cn(), formatBytes(), getGreeting(), formatPercentage()
├── public/                 # Static assets
├── tailwind.config.ts      # UVic colors, semantic aliases
└── next.config.js          # Security headers, reactStrictMode
```

---

## 3. Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  lib/dummy-data.ts (single source of mock data)                  │
│  - userData, platformLoad, userStorage, activeSessions           │
│  - sessionTypes, containerImages, quickLaunchTemplates           │
│  - cpuUsageHistory, ramUsageHistory, platformMetrics, etc.      │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Pages (app/*/page.tsx)                                         │
│  - Import dummy data directly                                   │
│  - Compose dashboard/layout/session-launcher components          │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│  Components                                                     │
│  - Receive data via props or import dummy-data                  │
│  - LayoutProvider: React context for sidebar/mobile state       │
│  - Session launcher: local form state, no persistence           │
└─────────────────────────────────────────────────────────────────┘
```

**No server-side data fetching.** When integrating real APIs:

1. Add API routes under `app/api/` or call external services from Server Components
2. Replace `lib/dummy-data.ts` imports with `fetch()` or data-fetching hooks
3. Add authentication (e.g. NextAuth) and protect routes

---

## 4. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Static time-series data** | Avoids hydration errors from `Math.random()` / `Date()` differing between server and client |
| **LayoutProvider as client component** | Sidebar collapse and mobile menu state require `useState`; root layout stays a Server Component |
| **Session launcher as modal** | Keeps user on dashboard; aligns with "action-oriented" UX |
| **CLI-aligned session params** | Session launcher mirrors `canfar create` (kind, image, --cpu, --memory, --gpu, --env) for consistency |
| **No batch launch in UI** | Per product decision; batch is CLI-only |
| **UVic brand colors** | Strict adherence via Tailwind semantic aliases (primary, secondary, accent, destructive) |

---

## 5. Extension Points for AI Agents

### Adding a New Page

1. Create `app/<route>/page.tsx`
2. Add nav item in `components/layout/sidebar.tsx` (`navigationItems`)
3. Use existing UI components from `components/ui/`

### Adding Real API Integration

1. Create `app/api/<resource>/route.ts` for Next.js API routes, or use Server Components with `fetch`
2. Add data-fetching in page or a custom hook; keep `lib/dummy-data.ts` as fallback for dev
3. Use `NEXT_PUBLIC_*` only for non-sensitive client config; keep secrets server-side

### Adding New Dashboard Widgets

1. Create component in `components/dashboard/`
2. Export from `components/dashboard/index.ts`
3. Add to `app/page.tsx` and extend `lib/dummy-data.ts` if new data is needed

### Session Launcher Customization

- **Quick templates:** Edit `quickLaunchTemplates` in `lib/dummy-data.ts`
- **Session kinds:** Edit `sessionTypes` and `containerImages`
- **Validation:** Adjust `validateForm()` and `RESOURCE_LIMITS` in `launcher-modal.tsx`
- **CLI preview:** `buildCliCommand()` in `launcher-modal.tsx` — keep in sync with CANFAR CLI

### Chart Data

- All chart data lives in `lib/dummy-data.ts` (e.g. `cpuUsageHistory`, `platformMetrics`)
- Use **static arrays** to avoid hydration mismatches
- For live data, fetch in a client component with `useEffect` and render charts only after mount

---

## 6. Security Review

### Summary

The application is a **front-end prototype** with no backend, no authentication, and no sensitive data handling. The security posture is appropriate for a dummy UI. The following was reviewed.

### ✅ Implemented Safeguards

| Control | Status |
|---------|--------|
| **Security headers** | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` in `next.config.js` |
| **Powered-by header** | Disabled (`poweredByHeader: false`) |
| **Environment files** | `.env*` in `.gitignore` — no secrets in repo |
| **No API routes** | No server endpoints that could expose data |
| **No `dangerouslySetInnerHTML`** | No raw HTML injection; React escapes by default |
| **No `eval()`** | No dynamic code execution |
| **Input validation** | Session launcher validates image format, env var keys, resource limits |

### ⚠️ Data Exposure Assessment

| Item | Risk | Notes |
|------|------|-------|
| **Dummy user data** | Low | `userData` (name, email) is placeholder only. Replace with real auth before production. |
| **Console logging** | Low | `console.info` for CLI equivalent in dev only; remove or gate behind `NODE_ENV` in production. |
| **Error boundary** | Low | Shows error message in dev; production shows generic message. |
| **Settings placeholders** | N/A | "Password", "API keys" are UI labels only; no real data. |

### 🔒 Recommendations for Production

When connecting to real CANFAR APIs:

1. **Authentication:** Use OAuth/OIDC or NextAuth; never store tokens in `localStorage` without encryption.
2. **API keys:** Keep server-side; use `NEXT_PUBLIC_*` only for non-sensitive config (e.g. public API base URL).
3. **CSP:** Add Content-Security-Policy header for defense in depth.
4. **HTTPS:** Enforce HTTPS in production (handled by hosting).
5. **PII:** Ensure user data from real APIs is not logged or exposed in error messages.
6. **Session IDs:** Do not expose internal session IDs in URLs or client logs.

### Data Classification

- **Public:** UI layout, design system, static assets
- **Example/dummy:** All data in `lib/dummy-data.ts` — safe for demo
- **Future sensitive:** User credentials, API tokens, session secrets — must be server-side only when implemented

---

## 7. Tech Stack Reference

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge |
| Linting | ESLint (next/core-web-vitals, next/typescript) |
| Formatting | Prettier |
| Node | >= 18.17.0 |

---

## 8. Scripts

```bash
npm run dev        # Development server (localhost:3000)
npm run build      # Production build
npm run start      # Production server
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
npm run type-check # TypeScript check
npm run format     # Prettier format
npm run format:check # Prettier check
npm run validate   # type-check + lint + format:check
```

---

## 9. Related Documentation

- [README.md](./README.md) — Quick start, features, design system
- [CANFAR CLI Reference](https://www.opencadc.org/canfar/latest/cli/cli-help/) — Session creation parameters
