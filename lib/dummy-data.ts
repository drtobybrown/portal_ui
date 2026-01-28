// User data
export const userData = {
  name: "Dr. thbrown",
  email: "thbrown@uvic.ca",
  avatar: null, // Will use initials
}

// Platform resource data (from screenshot)
export const platformLoad = {
  cpus: {
    available: 2038.4,
    total: 3006.0,
    used: 967.6,
  },
  ram: {
    available: 4728.02,
    total: 12159.44,
    used: 7431.42,
  },
  lastUpdate: "2026-01-28 20:09 UTC",
}

// User storage data (from screenshot)
export const userStorage = {
  home: {
    used: 72.7,
    quota: 291.0,
    unit: "GB",
  },
  scratch: {
    used: 145.3,
    quota: 500.0,
    unit: "GB",
  },
  lastUpdate: "2026-01-22 06:09:10 UTC",
}

// Active sessions
export const activeSessions = [
  {
    id: "sess-001",
    name: "notebook1",
    type: "Jupyter",
    status: "running" as const,
    startedAt: "2h ago",
    cpu: 2,
    ram: 8,
    project: "VLASS",
  },
  {
    id: "sess-002",
    name: "carta-analysis",
    type: "CARTA",
    status: "running" as const,
    startedAt: "45m ago",
    cpu: 4,
    ram: 16,
    project: "ALMA",
  },
  {
    id: "sess-003",
    name: "data-viz",
    type: "Desktop",
    status: "running" as const,
    startedAt: "3h ago",
    cpu: 2,
    ram: 4,
    project: "HST",
  },
]

// Session types matching CANFAR CLI: desktop, notebook, carta, firefly, contributed
export const sessionTypes = [
  {
    id: "notebook",
    name: "Notebook",
    description: "Jupyter Notebook environment",
    icon: "BookOpen",
    popular: true,
  },
  {
    id: "carta",
    name: "CARTA",
    description: "Cube Analysis and Rendering Tool for Astronomy",
    icon: "Radio",
    popular: true,
  },
  {
    id: "desktop",
    name: "Desktop",
    description: "Full Linux desktop environment with GUI",
    icon: "Monitor",
    popular: false,
  },
  {
    id: "firefly",
    name: "Firefly",
    description: "IPAC Firefly visualization tool",
    icon: "Flame",
    popular: false,
  },
  {
    id: "contributed",
    name: "Contributed",
    description: "Community-contributed session types",
    icon: "Users",
    popular: false,
  },
]

// Container images organized by session type (matching CANFAR image registry)
export const containerImages: Record<string, { id: string; name: string; tag: string; description?: string }[]> = {
  notebook: [
    { id: "images.canfar.net/skaha/astroml:latest", name: "AstroML", tag: "latest", description: "Machine learning for astronomy" },
    { id: "images.canfar.net/skaha/jupyter-scipy:latest", name: "Jupyter SciPy", tag: "latest", description: "Scientific Python stack" },
    { id: "images.canfar.net/skaha/casa-notebook:6.5", name: "CASA Notebook", tag: "6.5", description: "CASA with Jupyter integration" },
    { id: "images.canfar.net/skaha/astropy:latest", name: "Astropy", tag: "latest", description: "Core astronomy packages" },
  ],
  carta: [
    { id: "images.canfar.net/skaha/carta:4.1", name: "CARTA", tag: "4.1", description: "Official CARTA release" },
    { id: "images.canfar.net/skaha/carta:3.0", name: "CARTA", tag: "3.0", description: "Legacy version" },
  ],
  desktop: [
    { id: "images.canfar.net/skaha/desktop:ubuntu22", name: "Ubuntu Desktop", tag: "ubuntu22", description: "Ubuntu 22.04 with XFCE" },
    { id: "images.canfar.net/skaha/desktop:astro", name: "Astro Desktop", tag: "astro", description: "Desktop with astronomy tools" },
  ],
  firefly: [
    { id: "images.canfar.net/skaha/firefly:latest", name: "Firefly", tag: "latest", description: "IPAC Firefly viewer" },
  ],
  contributed: [
    { id: "images.canfar.net/contrib/custom-analysis:latest", name: "Custom Analysis", tag: "latest", description: "User contributed" },
  ],
}

// Quick launch templates (pre-configured combinations)
export const quickLaunchTemplates = [
  {
    id: "astroml",
    name: "Data Analysis",
    description: "Python/Jupyter with astronomy ML packages",
    kind: "notebook",
    image: "images.canfar.net/skaha/astroml:latest",
    icon: "BookOpen",
    popular: true,
  },
  {
    id: "carta",
    name: "Radio Imaging",
    description: "CARTA visualization for radio data",
    kind: "carta",
    image: "images.canfar.net/skaha/carta:4.1",
    icon: "Radio",
    popular: true,
  },
  {
    id: "desktop",
    name: "Full Desktop",
    description: "Linux desktop with GUI applications",
    kind: "desktop",
    image: "images.canfar.net/skaha/desktop:ubuntu22",
    icon: "Monitor",
    popular: false,
  },
  {
    id: "casa",
    name: "CASA Analysis",
    description: "Radio interferometry data processing",
    kind: "notebook",
    image: "images.canfar.net/skaha/casa-notebook:6.5",
    icon: "Radar",
    popular: false,
  },
]

// System status
export const systemStatus = {
  overall: "nominal" as const,
  services: [
    { name: "Kubernetes Cluster", status: "healthy" },
    { name: "VOSpace Storage", status: "healthy" },
    { name: "User Authentication", status: "healthy" },
    { name: "Batch Processing", status: "healthy" },
  ],
}

// Recent batch jobs
export const recentJobs = [
  {
    id: "job-001",
    name: "VLASS Mosaic Generation",
    status: "completed" as const,
    startedAt: "2026-01-27 14:30",
    completedAt: "2026-01-27 18:45",
    cpuHours: 16.5,
  },
  {
    id: "job-002",
    name: "Spectral Line Analysis",
    status: "running" as const,
    startedAt: "2026-01-28 09:00",
    completedAt: null,
    cpuHours: 4.2,
  },
  {
    id: "job-003",
    name: "Image Calibration Pipeline",
    status: "queued" as const,
    startedAt: null,
    completedAt: null,
    cpuHours: 0,
  },
]

// Navigation items
export const navigationItems = [
  { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { name: "My Sessions", href: "/sessions", icon: "Monitor" },
  { name: "Data & Storage", href: "/storage", icon: "HardDrive" },
  { name: "Batch Processing", href: "/batch", icon: "Cpu" },
  { name: "Metrics", href: "/metrics", icon: "BarChart3" },
  { name: "Settings", href: "/settings", icon: "Settings" },
]

// Generate time series data for the last 24 hours
function generateTimeSeriesData(
  hours: number,
  baseValue: number,
  variance: number,
  trend: 'up' | 'down' | 'stable' = 'stable'
) {
  const data = []
  const now = new Date()
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const trendFactor = trend === 'up' ? (hours - i) / hours * 0.3 : trend === 'down' ? i / hours * 0.3 : 0
    const value = baseValue + (Math.random() - 0.5) * variance + baseValue * trendFactor
    data.push({
      label: time.getHours().toString().padStart(2, '0') + ':00',
      value: Math.max(0, value),
      timestamp: time.toISOString(),
    })
  }
  return data
}

// Resource usage over time (last 24 hours)
export const cpuUsageHistory = generateTimeSeriesData(24, 35, 15, 'stable')
export const ramUsageHistory = generateTimeSeriesData(24, 62, 10, 'up')
export const storageUsageHistory = generateTimeSeriesData(24, 25, 2, 'up')

// Platform metrics for Grafana-style dashboard
export const platformMetrics = {
  // CPU metrics per node
  nodesCpuUsage: [
    { label: 'node-01', value: 78.5 },
    { label: 'node-02', value: 45.2 },
    { label: 'node-03', value: 92.1 },
    { label: 'node-04', value: 23.8 },
    { label: 'node-05', value: 67.3 },
    { label: 'node-06', value: 55.9 },
  ],
  
  // Memory metrics per node
  nodesMemoryUsage: [
    { label: 'node-01', value: 85.2 },
    { label: 'node-02', value: 52.8 },
    { label: 'node-03', value: 94.5 },
    { label: 'node-04', value: 31.2 },
    { label: 'node-05', value: 72.1 },
    { label: 'node-06', value: 48.6 },
  ],

  // Job queue metrics
  jobQueueHistory: generateTimeSeriesData(24, 15, 8, 'stable'),
  
  // Active sessions over time
  activeSessionsHistory: generateTimeSeriesData(24, 45, 12, 'up'),
  
  // Network I/O
  networkInHistory: generateTimeSeriesData(24, 250, 100, 'stable'), // MB/s
  networkOutHistory: generateTimeSeriesData(24, 180, 80, 'stable'), // MB/s
  
  // Storage I/O
  storageReadHistory: generateTimeSeriesData(24, 450, 150, 'stable'), // MB/s
  storageWriteHistory: generateTimeSeriesData(24, 280, 100, 'stable'), // MB/s
}

// Job performance metrics
export const jobPerformanceMetrics = {
  // CPU hours by project (last 7 days)
  cpuHoursByProject: [
    { label: 'VLASS', value: 1250.5 },
    { label: 'ALMA', value: 890.2 },
    { label: 'HST', value: 456.8 },
    { label: 'JWST', value: 234.1 },
    { label: 'Personal', value: 178.9 },
  ],
  
  // Job success rate over time
  jobSuccessRate: generateTimeSeriesData(24, 94, 5, 'stable'),
  
  // Average job duration (minutes)
  avgJobDuration: generateTimeSeriesData(24, 45, 20, 'stable'),
  
  // Jobs completed per hour
  jobsCompletedHistory: generateTimeSeriesData(24, 8, 4, 'stable'),
  
  // Queue wait time (minutes)
  queueWaitTime: generateTimeSeriesData(24, 12, 8, 'down'),
}
