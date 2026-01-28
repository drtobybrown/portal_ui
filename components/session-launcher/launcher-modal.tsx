'use client'

import * as React from 'react'
import {
  X,
  BookOpen,
  Radio,
  Monitor,
  Flame,
  Users,
  Radar,
  Rocket,
  ChevronRight,
  ChevronDown,
  Info,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  Cpu,
  HardDrive,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { sessionTypes, containerImages, quickLaunchTemplates } from '@/lib/dummy-data'

interface SessionLauncherProps {
  open: boolean
  onClose: () => void
}

type TabType = 'quick' | 'custom'
type LaunchState = 'idle' | 'launching' | 'success' | 'error'

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-6 w-6" />,
  Radio: <Radio className="h-6 w-6" />,
  Monitor: <Monitor className="h-6 w-6" />,
  Flame: <Flame className="h-6 w-6" />,
  Users: <Users className="h-6 w-6" />,
  Radar: <Radar className="h-6 w-6" />,
}

// Generate a random session name
function generateSessionName(kind: string): string {
  const suffix = Math.random().toString(36).substring(2, 6)
  return `${kind}-${suffix}`
}

export function SessionLauncher({ open, onClose }: SessionLauncherProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('quick')
  const [launchState, setLaunchState] = React.useState<LaunchState>('idle')
  const [launchedSessionId, setLaunchedSessionId] = React.useState<string | null>(null)
  
  // Quick launch selection
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)
  
  // Custom session form state (matching CANFAR CLI parameters)
  const [formData, setFormData] = React.useState({
    kind: 'notebook',
    image: '',
    name: generateSessionName('notebook'),
    resourceMode: 'flexible' as 'flexible' | 'fixed',
    cpu: 2,
    memory: 8,
    gpu: 0,
    envVars: [] as { key: string; value: string }[],
  })

  // Update session name when kind changes
  React.useEffect(() => {
    if (formData.name.startsWith(formData.kind.split('-')[0]) === false) {
      setFormData(prev => ({ ...prev, name: generateSessionName(prev.kind) }))
    }
  }, [formData.kind])

  // Reset image when kind changes
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, image: '' }))
  }, [formData.kind])

  const handleReset = () => {
    setSelectedTemplate(null)
    setLaunchState('idle')
    setLaunchedSessionId(null)
    setFormData({
      kind: 'notebook',
      image: '',
      name: generateSessionName('notebook'),
      resourceMode: 'flexible',
      cpu: 2,
      memory: 8,
      gpu: 0,
      envVars: [],
    })
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleLaunch = async () => {
    setLaunchState('launching')
    
    // Build the CLI-equivalent command for logging
    let cliCommand = 'canfar create'
    
    if (activeTab === 'quick' && selectedTemplate) {
      const template = quickLaunchTemplates.find(t => t.id === selectedTemplate)
      if (template) {
        cliCommand += ` ${template.kind} ${template.image}`
      }
    } else {
      // Custom session
      if (formData.name) cliCommand += ` --name ${formData.name}`
      if (formData.resourceMode === 'fixed') {
        cliCommand += ` --cpu ${formData.cpu} --memory ${formData.memory}`
      }
      if (formData.gpu > 0) cliCommand += ` --gpu ${formData.gpu}`
      formData.envVars.forEach(env => {
        if (env.key && env.value) cliCommand += ` --env ${env.key}=${env.value}`
      })
      cliCommand += ` ${formData.kind} ${formData.image}`
    }
    
    console.log('CLI equivalent:', cliCommand)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate success
    const sessionId = `sess-${Math.random().toString(36).substring(2, 8)}`
    setLaunchedSessionId(sessionId)
    setLaunchState('success')
  }

  const canLaunch = activeTab === 'quick' 
    ? selectedTemplate !== null
    : formData.kind && formData.image

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={launchState === 'idle' ? handleClose : undefined}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-fade-in rounded-2xl bg-white shadow-2xl">
        {/* Success state */}
        {launchState === 'success' && (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary">Session Launched!</h2>
            <p className="mt-2 text-gray-500">
              Your session is starting up. It will be ready in a few moments.
            </p>
            <p className="mt-1 font-mono text-sm text-gray-400">
              ID: {launchedSessionId}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose}>
                View Sessions
              </Button>
            </div>
          </div>
        )}

        {/* Launching state */}
        {launchState === 'launching' && (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-secondary">Launching Session...</h2>
            <p className="mt-2 text-gray-500">
              Creating your session on the platform
            </p>
          </div>
        )}

        {/* Normal state */}
        {launchState === 'idle' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-secondary">New Session</h2>
                <p className="text-sm text-gray-500">
                  Launch an interactive session on the Science Platform
                </p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b px-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('quick')}
                  className={cn(
                    'relative px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === 'quick'
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  Quick Launch
                  {activeTab === 'quick' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={cn(
                    'relative px-4 py-3 text-sm font-medium transition-colors',
                    activeTab === 'custom'
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  Custom Configuration
                  {activeTab === 'custom' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6">
              {activeTab === 'quick' ? (
                <QuickLaunchMode
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />
              ) : (
                <CustomConfigMode formData={formData} setFormData={setFormData} />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleLaunch}
                  disabled={!canLaunch}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Launch Session
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// Quick launch mode - pre-configured templates
function QuickLaunchMode({
  selectedTemplate,
  onSelectTemplate,
}: {
  selectedTemplate: string | null
  onSelectTemplate: (id: string) => void
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Choose a pre-configured session template for quick launch with default settings.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLaunchTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id)}
            className={cn(
              'group relative rounded-xl border-2 p-4 text-left transition-all',
              selectedTemplate === template.id
                ? 'border-primary bg-primary-light'
                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:bg-gray-50'
            )}
          >
            {template.popular && (
              <Badge
                variant="warning"
                className="absolute -top-2 right-3 bg-accent text-white"
              >
                Popular
              </Badge>
            )}

            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                selectedTemplate === template.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-500 group-hover:text-primary'
              )}
            >
              {iconMap[template.icon]}
            </div>

            <h3 className="mt-3 font-semibold text-secondary">{template.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>

            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {template.kind}
              </Badge>
            </div>

            {selectedTemplate === template.id && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Custom configuration mode - full CLI parameters
function CustomConfigMode({
  formData,
  setFormData,
}: {
  formData: {
    kind: string
    image: string
    name: string
    resourceMode: 'flexible' | 'fixed'
    cpu: number
    memory: number
    gpu: number
    envVars: { key: string; value: string }[]
  }
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>
}) {
  const availableImages = containerImages[formData.kind] || []

  const addEnvVar = () => {
    setFormData(prev => ({
      ...prev,
      envVars: [...prev.envVars, { key: '', value: '' }],
    }))
  }

  const removeEnvVar = (index: number) => {
    setFormData(prev => ({
      ...prev,
      envVars: prev.envVars.filter((_, i) => i !== index),
    }))
  }

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      envVars: prev.envVars.map((env, i) =>
        i === index ? { ...env, [field]: value } : env
      ),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Session Type (KIND) */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          Session Type
          <span className="text-xs font-normal text-gray-400">(required)</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {sessionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setFormData({ ...formData, kind: type.id })}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all',
                formData.kind === type.id
                  ? 'border-primary bg-primary-light'
                  : 'border-gray-100 hover:border-gray-200'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  formData.kind === type.id
                    ? 'text-primary'
                    : 'text-gray-400'
                )}
              >
                {iconMap[type.icon]}
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  formData.kind === type.id ? 'text-primary' : 'text-gray-600'
                )}
              >
                {type.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Container Image (IMAGE) */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          Container Image
          <span className="text-xs font-normal text-gray-400">(required)</span>
        </label>
        {availableImages.length > 0 ? (
          <div className="space-y-2">
            {availableImages.map((img) => (
              <label
                key={img.id}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-all',
                  formData.image === img.id
                    ? 'border-primary bg-primary-light'
                    : 'border-gray-100 hover:border-gray-200'
                )}
              >
                <input
                  type="radio"
                  name="image"
                  value={img.id}
                  checked={formData.image === img.id}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="sr-only"
                />
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 transition-colors',
                    formData.image === img.id
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  )}
                >
                  {formData.image === img.id && (
                    <div className="h-full w-full scale-50 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-secondary">{img.name}</span>
                    <Badge variant="default" className="text-xs">{img.tag}</Badge>
                  </div>
                  {img.description && (
                    <p className="text-xs text-gray-500">{img.description}</p>
                  )}
                </div>
              </label>
            ))}
            {/* Custom image input */}
            <div className="mt-3 border-t pt-3">
              <label className="mb-1.5 block text-xs text-gray-500">
                Or enter a custom image URL:
              </label>
              <input
                type="text"
                value={formData.image.startsWith('images.canfar.net') ? '' : formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="e.g., images.canfar.net/myproject/myimage:tag"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        ) : (
          <input
            type="text"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="Enter container image URL"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        )}
      </div>

      {/* Session Name (--name) */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          Session Name
          <span className="text-xs font-normal text-gray-400">(optional, auto-generated)</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter session name"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Resource Allocation */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          Resource Allocation
        </label>
        <div className="flex gap-3">
          <label
            className={cn(
              'flex flex-1 cursor-pointer flex-col gap-1 rounded-lg border-2 p-4 transition-all',
              formData.resourceMode === 'flexible'
                ? 'border-primary bg-primary-light'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input
              type="radio"
              name="resourceMode"
              value="flexible"
              checked={formData.resourceMode === 'flexible'}
              onChange={() => setFormData({ ...formData, resourceMode: 'flexible' })}
              className="sr-only"
            />
            <div className="flex items-center gap-2">
              <Zap className={cn('h-5 w-5', formData.resourceMode === 'flexible' ? 'text-primary' : 'text-gray-400')} />
              <span className="font-medium text-gray-700">Flexible</span>
            </div>
            <p className="text-xs text-gray-500">
              Adapts to user load. Resources shared efficiently.
            </p>
          </label>

          <label
            className={cn(
              'flex flex-1 cursor-pointer flex-col gap-1 rounded-lg border-2 p-4 transition-all',
              formData.resourceMode === 'fixed'
                ? 'border-primary bg-primary-light'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <input
              type="radio"
              name="resourceMode"
              value="fixed"
              checked={formData.resourceMode === 'fixed'}
              onChange={() => setFormData({ ...formData, resourceMode: 'fixed' })}
              className="sr-only"
            />
            <div className="flex items-center gap-2">
              <Cpu className={cn('h-5 w-5', formData.resourceMode === 'fixed' ? 'text-primary' : 'text-gray-400')} />
              <span className="font-medium text-gray-700">Fixed</span>
            </div>
            <p className="text-xs text-gray-500">
              Guaranteed resources. Specify CPU, Memory, GPU.
            </p>
          </label>
        </div>
      </div>

      {/* Fixed Resource Options (--cpu, --memory, --gpu) */}
      {formData.resourceMode === 'fixed' && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Cpu className="h-4 w-4 text-gray-400" />
              CPU Cores
            </label>
            <input
              type="number"
              min={1}
              max={32}
              value={formData.cpu}
              onChange={(e) =>
                setFormData({ ...formData, cpu: parseInt(e.target.value) || 1 })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <HardDrive className="h-4 w-4 text-gray-400" />
              Memory (GB)
            </label>
            <input
              type="number"
              min={1}
              max={256}
              value={formData.memory}
              onChange={(e) =>
                setFormData({ ...formData, memory: parseInt(e.target.value) || 1 })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Zap className="h-4 w-4 text-gray-400" />
              GPUs
            </label>
            <input
              type="number"
              min={0}
              max={8}
              value={formData.gpu}
              onChange={(e) =>
                setFormData({ ...formData, gpu: parseInt(e.target.value) || 0 })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}

      {/* Environment Variables (--env) */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            Environment Variables
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <Button variant="ghost" size="sm" onClick={addEnvVar}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Variable
          </Button>
        </div>
        {formData.envVars.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
            No environment variables defined
          </p>
        ) : (
          <div className="space-y-2">
            {formData.envVars.map((env, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={env.key}
                  onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                  placeholder="KEY"
                  className="w-1/3 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="text"
                  value={env.value}
                  onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                  placeholder="value"
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={() => removeEnvVar(index)}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CLI Preview */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-500">
          <Info className="h-3.5 w-3.5" />
          CLI Equivalent
        </div>
        <code className="block whitespace-pre-wrap break-all font-mono text-xs text-gray-700">
          canfar create{formData.name ? ` --name ${formData.name}` : ''}
          {formData.resourceMode === 'fixed' ? ` --cpu ${formData.cpu} --memory ${formData.memory}` : ''}
          {formData.gpu > 0 ? ` --gpu ${formData.gpu}` : ''}
          {formData.envVars.filter(e => e.key && e.value).map(e => ` --env ${e.key}=${e.value}`).join('')}
          {` ${formData.kind}`}
          {formData.image ? ` ${formData.image}` : ' <image>'}
        </code>
      </div>
    </div>
  )
}
