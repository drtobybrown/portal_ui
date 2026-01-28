'use client'

import * as React from 'react'
import { X, BookOpen, Radio, Monitor, Container, Rocket, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { sessionTemplates, projects, containerImages } from '@/lib/dummy-data'

interface SessionLauncherProps {
  open: boolean
  onClose: () => void
}

type TabType = 'standard' | 'advanced'

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="h-6 w-6" />,
  Radio: <Radio className="h-6 w-6" />,
  Monitor: <Monitor className="h-6 w-6" />,
  Container: <Container className="h-6 w-6" />,
}

export function SessionLauncher({ open, onClose }: SessionLauncherProps) {
  const [activeTab, setActiveTab] = React.useState<TabType>('standard')
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)
  
  // Advanced form state
  const [formData, setFormData] = React.useState({
    type: 'notebook',
    project: '',
    containerImage: '',
    sessionName: 'notebook1',
    resourceMode: 'flexible' as 'flexible' | 'fixed',
    cpu: 2,
    ram: 8,
  })

  const handleReset = () => {
    setSelectedTemplate(null)
    setFormData({
      type: 'notebook',
      project: '',
      containerImage: '',
      sessionName: 'notebook1',
      resourceMode: 'flexible',
      cpu: 2,
      ram: 8,
    })
  }

  const handleLaunch = () => {
    // In a real app, this would trigger the session launch
    console.log('Launching session:', activeTab === 'standard' ? selectedTemplate : formData)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl animate-fade-in rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-secondary">New Session</h2>
            <p className="text-sm text-gray-500">
              Choose a template or configure a custom session
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('standard')}
              className={cn(
                'relative px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'standard'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Standard
              {activeTab === 'standard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={cn(
                'relative px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'advanced'
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              Advanced
              {activeTab === 'advanced' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'standard' ? (
            <StandardMode
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          ) : (
            <AdvancedMode formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleLaunch}
              disabled={activeTab === 'standard' && !selectedTemplate}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Launch Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Standard mode - template selection
function StandardMode({
  selectedTemplate,
  onSelectTemplate,
}: {
  selectedTemplate: string | null
  onSelectTemplate: (id: string) => void
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sessionTemplates.map((template) => (
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

          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span>{template.defaultCpu} CPU</span>
            <span>•</span>
            <span>{template.defaultRam} GB RAM</span>
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
  )
}

// Advanced mode - detailed configuration
function AdvancedMode({
  formData,
  setFormData,
}: {
  formData: {
    type: string
    project: string
    containerImage: string
    sessionName: string
    resourceMode: 'flexible' | 'fixed'
    cpu: number
    ram: number
  }
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>
}) {
  return (
    <div className="space-y-5">
      {/* Type */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Session Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="notebook">Notebook (Jupyter)</option>
          <option value="desktop">Desktop</option>
          <option value="carta">CARTA</option>
          <option value="contributed">Contributed</option>
        </select>
      </div>

      {/* Project */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Project
        </label>
        <select
          value={formData.project}
          onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Container Image */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Container Image
        </label>
        <select
          value={formData.containerImage}
          onChange={(e) =>
            setFormData({ ...formData, containerImage: e.target.value })
          }
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select container image</option>
          {containerImages.map((image) => (
            <option key={image.id} value={image.id}>
              {image.name} ({image.version})
            </option>
          ))}
        </select>
      </div>

      {/* Session Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Session Name
        </label>
        <input
          type="text"
          value={formData.sessionName}
          onChange={(e) =>
            setFormData({ ...formData, sessionName: e.target.value })
          }
          placeholder="Enter session name"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Resource Mode */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Resources
        </label>
        <div className="flex gap-3">
          <label
            className={cn(
              'flex flex-1 cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all',
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
              onChange={() =>
                setFormData({ ...formData, resourceMode: 'flexible' })
              }
              className="sr-only"
            />
            <div
              className={cn(
                'h-4 w-4 rounded-full border-2 transition-colors',
                formData.resourceMode === 'flexible'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              )}
            >
              {formData.resourceMode === 'flexible' && (
                <div className="h-full w-full scale-50 rounded-full bg-white" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">Flexible</span>
          </label>

          <label
            className={cn(
              'flex flex-1 cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-3 transition-all',
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
              onChange={() =>
                setFormData({ ...formData, resourceMode: 'fixed' })
              }
              className="sr-only"
            />
            <div
              className={cn(
                'h-4 w-4 rounded-full border-2 transition-colors',
                formData.resourceMode === 'fixed'
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              )}
            >
              {formData.resourceMode === 'fixed' && (
                <div className="h-full w-full scale-50 rounded-full bg-white" />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700">Fixed</span>
          </label>
        </div>
      </div>

      {/* CPU and RAM (only visible in fixed mode) */}
      {formData.resourceMode === 'fixed' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              CPU Cores
            </label>
            <input
              type="number"
              min={1}
              max={16}
              value={formData.cpu}
              onChange={(e) =>
                setFormData({ ...formData, cpu: parseInt(e.target.value) || 1 })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              RAM (GB)
            </label>
            <input
              type="number"
              min={1}
              max={64}
              value={formData.ram}
              onChange={(e) =>
                setFormData({ ...formData, ram: parseInt(e.target.value) || 1 })
              }
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      )}
    </div>
  )
}
