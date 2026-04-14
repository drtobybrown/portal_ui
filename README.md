# SRCNet Gateway UI

A modern science portal for the **SKA Regional Centre Network (SRCNet)**, built on the same design principles as the CANFAR Science Portal. It provides data staging from the SKA Science Archive, multi-site compute selection, and distributed file management across SRC sites—with SKAO brand identity (Blueshift Navy, Redshift Magenta) and a clean, user-friendly interface for both novice and expert users.

![Status](https://img.shields.io/badge/Status-Development-blue)

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

Then open [http://localhost:3000](http://localhost:3000) in your browser (or the port shown in the terminal if 3000 is in use).

## Tech Stack

| Technology                                    | Purpose                         |
| --------------------------------------------- | ------------------------------- |
| [Next.js 14](https://nextjs.org/)             | React framework with App Router |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first styling           |
| [Lucide React](https://lucide.dev/)           | Icon library                    |
| [TypeScript](https://www.typescriptlang.org/) | Type safety                     |

## Design System

### Color Palette (SKAO Brand)

| Color             | Hex       | Usage                          |
| ----------------- | --------- | ------------------------------ |
| Blueshift Navy    | `#070068` | Primary buttons, sidebar, brand |
| Redshift Magenta  | `#E70068` | Accents, highlights, CTAs      |
| 100% Black        | `#000000` | Text, dark surfaces            |

Additional accent palettes (Science, Technology, Sites) are defined in `tailwind.config.ts` for charts and thematic elements.

### Typography

- **Font:** Noto Sans (via Google Fonts), with Verdana as fallback per [SKAO brand guidelines](https://www.skao.int/en/skao-brand).

## Features

### Dashboard (`/`)

- Personalized greeting with SRCNet system status
- **SRC Network Status** — Quick view of compute/storage across top SRC sites
- **Data Staging Activity** — Active and recent staging requests from the SKA Science Archive to SRC sites
- Resource overview (CPU/RAM gauges, storage)
- 24-hour resource history charts
- Active sessions list with site and project

### Data Archive (`/archive`)

- **SKA Science Archive** search (ALMA-style interface)
- As-you-type search by target, project code, observation ID, or coordinates
- Filters: telescope (SKA-Mid / SKA-Low), data quality
- Expandable observation rows (coordinates, frequency coverage, data products)
- Bulk select and **stage data to any SRC site** (Canada, Spain, UK, Germany, Australia, South Africa, China, Sweden)

### SRC Sites (`/sites`)

- Overview of all **SKA Regional Centre** sites
- Per-site status, latency, CPU/RAM/storage usage
- Provider and location for each SRC

### File Manager (`/files`)

- **File Browser** — Navigate project and home storage with copy, move, mkdir, upload, delete
- **Terminal** — POSIX-like commands: `ls`, `cd`, `pwd`, `mkdir`, `cp`, `mv`, `rm`
- **CANFAR CLI integration** — `canfar auth login`, `canfar ps`, `canfar stats` (modeled on [opencadc/canfar](https://github.com/opencadc/canfar/tree/main/canfar/cli))
- Site selector to switch context between SRC sites
- Cross-site file transfer panel

### Session Launcher

- **Quick Launch** — Template cards (SKA Data Analysis, CARTA, Desktop, CASA) + **SRC site selector**
- **Custom Configuration** — Full config with **compute site** (Canada, UK, Australia, South Africa, Spain, Germany, China, Sweden), container image, CPU/RAM/GPU, env vars
- CLI equivalent preview (`canfar create --site ...`)

### My Sessions (`/sessions`)

- Grid view of active sessions with **SRC site** and project
- Batch jobs and cluster queue views

### Data & Storage (`/storage`)

- Project and home storage browser
- Storage quota visualization

### Batch Processing (`/batch`)

- Job queue monitoring
- Job submission (with site context)
- Status and logs

### Metrics (`/metrics`)

- Platform and job performance dashboards
- Time range selector

### Settings (`/settings`)

- Profile, notifications, security (SKAO IAM), API access

## Documentation

- **[Architecture Summary](./ARCHITECTURE_SUMMARY.md)** — Technical architecture, data flow, and extension points (if present).

## Project Structure

```
├── app/
│   ├── layout.tsx         # Root layout (Noto Sans, SRCNet metadata)
│   ├── page.tsx           # Dashboard (SRC status, staging activity)
│   ├── archive/           # SKA Science Archive search & staging
│   ├── sites/             # SRC Network status
│   ├── files/             # File Manager (browser + terminal)
│   ├── sessions/          # Sessions & batch jobs
│   ├── storage/           # Data & storage
│   ├── batch/             # Batch processing
│   ├── builder/           # Container image builder
│   ├── metrics/           # Monitoring dashboards
│   └── settings/          # User settings
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Sidebar, Header (SKAO logo)
│   ├── session-launcher/  # Session launch modal (with site selector)
│   └── ui/                # Reusable UI (SKAO logo, badges, etc.)
├── lib/
│   ├── dummy-data.ts      # Mock SRC sites, archive, staging, sessions
│   └── utils.ts           # Utilities
└── tailwind.config.ts     # SKAO brand colors & theme
```

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run validate # Type-check + lint + format check
```

## Design Principles

1. **Usability first** — Works for both novice and expert users.
2. **Progressive disclosure** — Advanced options (custom image, fixed resources, env vars) in Custom mode.
3. **Multi-site by design** — Choose where to stage data and run compute (8 SRC sites).
4. **CLI-aligned** — Session launcher and file manager reflect canfar CLI concepts (auth, create, ps, stats) for consistency.

## Current Status

This is a **UI prototype** with mock data. It demonstrates the SRCNet Gateway experience: SKAO branding, archive search and staging, multi-site compute, and file operations across SRCs.

### Implemented

- [x] SRCNet/SKAO rebrand (colors, typography, logo)
- [x] Dashboard with SRC status and data staging activity
- [x] Data Archive page with search, filters, and stage-to-SRC
- [x] SRC Sites overview (8 sites)
- [x] File Manager (browser + terminal with ls/cd/canfar commands)
- [x] Session launcher with SRC site selection
- [x] Sessions, storage, batch, metrics, settings pages
- [x] Responsive layout

### Next Steps

- [ ] Connect to SKA Science Archive and staging APIs
- [ ] Authentication (SKAO IAM / OAuth)
- [ ] Real canfar CLI or SRCNet backend for sessions and file ops
- [ ] Real-time session and staging status

## References

- [SKAO Brand](https://www.skao.int/en/skao-brand) — Colours, typography, logo usage
- [SKAO](https://www.skao.int/en) — SKA Observatory
- [CANFAR CLI](https://github.com/opencadc/canfar/tree/main/canfar/cli) — Auth, create, ps, stats, etc.
- [ALMA Science Archive](https://almascience.nrao.edu/aq/) — Archive UI reference for data staging

## Contributing

This project extends the CANFAR Science Portal UI for SRCNet. Please coordinate with the maintainers before making large changes.

## License

Internal use — SRCNet / SKA Observatory.
