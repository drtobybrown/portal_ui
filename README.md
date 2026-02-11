# CANFAR Science Portal UI

A modern, high-fidelity redesign of the CANFAR Science Platform portal with a clean, "Stripe-like" aesthetic - minimalist, highly readable, and user-friendly while retaining complex scientific functionality for power users.

![Dashboard Preview](https://img.shields.io/badge/Status-Development-blue)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/drtobybrown/portal_ui.git
cd portal_ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Technology                                    | Purpose                         |
| --------------------------------------------- | ------------------------------- |
| [Next.js 14](https://nextjs.org/)             | React framework with App Router |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first styling           |
| [Lucide React](https://lucide.dev/)           | Icon library                    |
| [TypeScript](https://www.typescriptlang.org/) | Type safety                     |

## Design System

### Color Palette (UVic Brand)

| Color        | Hex       | Usage                          |
| ------------ | --------- | ------------------------------ |
| Primary Blue | `#005493` | Primary buttons, active states |
| Dark Blue    | `#002754` | Sidebar, headings              |
| Gold/Yellow  | `#F5AA1C` | Accents, warnings, highlights  |
| Red          | `#C63527` | Errors, destructive actions    |

### Typography

- **Font:** Inter (via Google Fonts)
- Clean sans-serif to maintain a modern, professional appearance

## Features

### Dashboard (`/`)

- Personalized greeting with system status indicator
- Resource overview with circular CPU/RAM gauges
- Storage usage progress bars
- 24-hour resource usage charts
- Active sessions list with connect/terminate actions
- Quick action buttons for common tasks

### Session Launcher

- **Standard Mode:** Template cards for quick launch (Jupyter, CARTA, Desktop)
- **Advanced Mode:** Full configuration with custom containers, resource allocation

### My Sessions (`/sessions`)

- Grid view of all active sessions
- Filter and search capabilities
- Session management (connect, stop)

### Data & Storage (`/storage`)

- VOSpace file browser
- Storage quota visualization
- File upload interface

### Batch Processing (`/batch`)

- Job queue monitoring
- Job submission interface
- Status tracking with CPU hours

### Metrics (`/metrics`)

- **Platform Resources Tab:** Node CPU/Memory usage, active sessions, network I/O
- **Job Performance Tab:** Success rates, duration trends, queue wait times
- Grafana-style panel layout with time range selector

### Settings (`/settings`)

- Profile management
- Notification preferences
- (More sections coming soon)

## Documentation

- **[Architecture Summary](./ARCHITECTURE_SUMMARY.md)** — Technical architecture, data flow, extension points for developers and AI agents, and security review.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with sidebar + header
│   ├── page.tsx           # Dashboard
│   ├── sessions/          # Sessions management
│   ├── storage/           # Data & storage
│   ├── batch/             # Batch processing
│   ├── metrics/           # Monitoring dashboards
│   └── settings/          # User settings
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Sidebar, Header
│   ├── session-launcher/  # Session launch modal
│   └── ui/                # Reusable UI components
├── lib/
│   ├── dummy-data.ts      # Mock data for development
│   └── utils.ts           # Utility functions
└── tailwind.config.ts     # Tailwind with UVic brand colors
```

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Design Principles

1. **Action-Oriented:** Default views prioritize "Launch Notebook" over "Select Container Image"
2. **Progressive Disclosure:** Advanced options hidden behind toggles
3. **Visual Hierarchy:** Clear distinction between primary and secondary actions
4. **Responsive:** Optimized for desktop and tablet devices

## Current Status

This is a **dummy UI prototype** with mock data. It demonstrates the proposed visual design and interaction patterns for the CANFAR Science Portal redesign.

### What's Implemented

- [x] Global layout (collapsible sidebar, header with search)
- [x] Dashboard with resource gauges and session list
- [x] Session launcher modal (Standard/Advanced modes)
- [x] All navigation pages with dummy content
- [x] Metrics/monitoring dashboards
- [x] Responsive design

### What's Next

- [ ] Connect to real CANFAR APIs
- [ ] Authentication integration
- [ ] Real-time session updates
- [ ] File upload functionality
- [ ] Job submission workflow

## Contributing

This is an internal project for the CANFAR team. Please reach out before making changes.

## License

Internal use only - CANFAR / Canadian Astronomy Data Centre
