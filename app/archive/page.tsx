'use client'

import * as React from 'react'
import {
  Search,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Database,
  Globe,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { archiveObservations, srcSites } from '@/lib/dummy-data'

type QualityFilter = 'all' | 'validated' | 'processing'
type TelescopeFilter = 'all' | 'SKA-Mid' | 'SKA-Low'

interface StagingRequest {
  obsId: string
  products: string[]
  targetSite: string
}

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [qualityFilter, setQualityFilter] = React.useState<QualityFilter>('all')
  const [telescopeFilter, setTelescopeFilter] = React.useState<TelescopeFilter>('all')
  const [showFilters, setShowFilters] = React.useState(false)
  const [selectedObs, setSelectedObs] = React.useState<Set<string>>(new Set())
  const [stagingModal, setStagingModal] = React.useState<StagingRequest | null>(null)
  const [stagingInProgress, setStagingInProgress] = React.useState(false)
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null)

  const filteredResults = React.useMemo(() => {
    return archiveObservations.filter(obs => {
      const matchesSearch =
        !searchQuery ||
        obs.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.projectCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obs.ra.includes(searchQuery) ||
        obs.dec.includes(searchQuery)

      const matchesQuality = qualityFilter === 'all' || obs.quality === qualityFilter
      const matchesTelescope = telescopeFilter === 'all' || obs.telescope === telescopeFilter

      return matchesSearch && matchesQuality && matchesTelescope
    })
  }, [searchQuery, qualityFilter, telescopeFilter])

  const toggleObsSelection = (id: string) => {
    setSelectedObs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleStageData = async () => {
    if (!stagingModal) return
    setStagingInProgress(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStagingInProgress(false)
    setStagingModal(null)
    setSelectedObs(new Set())
  }

  const qualityBadge = (quality: string) => {
    switch (quality) {
      case 'validated':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle2 className="h-3 w-3" /> Validated
          </Badge>
        )
      case 'processing':
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" /> Processing
          </Badge>
        )
      default:
        return <Badge variant="default">{quality}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SKA Science Archive</h1>
        <p className="mt-1 text-sm text-gray-500">
          Search observations, browse data products, and stage data to any SRC site
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by target name, project code, observation ID, or coordinates..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Search archive"
              />
            </div>
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Telescope
                </label>
                <select
                  value={telescopeFilter}
                  onChange={e => setTelescopeFilter(e.target.value as TelescopeFilter)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Telescopes</option>
                  <option value="SKA-Mid">SKA-Mid</option>
                  <option value="SKA-Low">SKA-Low</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Data Quality
                </label>
                <select
                  value={qualityFilter}
                  onChange={e => setQualityFilter(e.target.value as QualityFilter)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Quality Levels</option>
                  <option value="validated">Validated</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTelescopeFilter('all')
                    setQualityFilter('all')
                    setSearchQuery('')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedObs.size > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-4 py-3">
          <span className="text-sm font-medium text-primary">
            {selectedObs.size} observation{selectedObs.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedObs(new Set())}>
              Clear
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="gap-2"
              onClick={() =>
                setStagingModal({
                  obsId: 'bulk',
                  products: ['all'],
                  targetSite: '',
                })
              }
            >
              <Download className="h-4 w-4" />
              Stage Selected to SRC
            </Button>
          </div>
        </div>
      )}

      {/* Results */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-5 w-5 text-primary" />
              Results ({filteredResults.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="grid">
              <thead>
                <tr className="border-b bg-gray-50/50 text-left">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedObs.size === filteredResults.length && filteredResults.length > 0}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedObs(new Set(filteredResults.map(o => o.id)))
                        } else {
                          setSelectedObs(new Set())
                        }
                      }}
                      className="rounded border-gray-300"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">Target</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Observation ID</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Telescope</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Band / Freq</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Integration</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Size</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Quality</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map(obs => (
                  <React.Fragment key={obs.id}>
                    <tr
                      className={cn(
                        'border-b transition-colors hover:bg-gray-50/50 cursor-pointer',
                        selectedObs.has(obs.id) && 'bg-primary/5',
                        expandedRow === obs.id && 'bg-gray-50'
                      )}
                      onClick={() => setExpandedRow(expandedRow === obs.id ? null : obs.id)}
                    >
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedObs.has(obs.id)}
                          onChange={() => toggleObsSelection(obs.id)}
                          className="rounded border-gray-300"
                          aria-label={`Select ${obs.target}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{obs.target}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{obs.id}</td>
                      <td className="px-4 py-3">
                        <Badge variant={obs.telescope === 'SKA-Mid' ? 'default' : 'secondary'}>
                          {obs.telescope}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{obs.band}</td>
                      <td className="px-4 py-3 text-gray-600">{obs.integration}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{obs.dataSize}</td>
                      <td className="px-4 py-3">{qualityBadge(obs.quality)}</td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          disabled={obs.quality !== 'validated'}
                          onClick={() =>
                            setStagingModal({
                              obsId: obs.id,
                              products: obs.dataProducts,
                              targetSite: '',
                            })
                          }
                        >
                          <Download className="h-3.5 w-3.5" />
                          Stage
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedRow === obs.id && (
                      <tr className="border-b bg-gray-50/80">
                        <td colSpan={9} className="px-8 py-4">
                          <div className="grid gap-6 sm:grid-cols-3">
                            <div>
                              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                                Coordinates
                              </h4>
                              <p className="font-mono text-sm text-gray-700">
                                RA: {obs.ra} &nbsp; Dec: {obs.dec}
                              </p>
                              <p className="mt-1 text-sm text-gray-600">
                                Project: {obs.projectCode}
                              </p>
                              <p className="text-sm text-gray-600">Observed: {obs.obsDate}</p>
                            </div>
                            <div>
                              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                                Frequency Coverage
                              </h4>
                              <p className="text-sm text-gray-700">{obs.frequency}</p>
                              <p className="mt-1 text-sm text-gray-600">
                                Pipeline: {obs.pipeline}
                              </p>
                            </div>
                            <div>
                              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                                Data Products
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {obs.dataProducts.map(product => (
                                  <Badge key={product} variant="default" className="text-xs">
                                    {product}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredResults.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                      <Database className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="font-medium text-gray-500">No observations found</p>
                      <p className="mt-1 text-sm">Try adjusting your search query or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Staging Modal */}
      {stagingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !stagingInProgress && setStagingModal(null)} />
          <div className="relative z-10 w-full max-w-lg animate-fade-in rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Stage Data to SRC</h3>
              <button
                onClick={() => !stagingInProgress && setStagingModal(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {stagingInProgress ? (
              <div className="py-8 text-center">
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                <p className="mt-3 text-sm text-gray-500">Submitting staging request...</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-3">
                      {stagingModal.obsId === 'bulk'
                        ? `Stage ${selectedObs.size} selected observations`
                        : `Stage observation ${stagingModal.obsId}`}
                    </p>
                  </div>

                  {/* Data Products to stage */}
                  {stagingModal.obsId !== 'bulk' && (
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                        Data Products
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {stagingModal.products.map(p => (
                          <Badge key={p} variant="default" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Destination SRC site */}
                  <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
                      Destination SRC Site
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {srcSites
                        .filter(s => s.status === 'online')
                        .map(site => (
                          <button
                            key={site.id}
                            onClick={() =>
                              setStagingModal(prev =>
                                prev ? { ...prev, targetSite: site.id } : null
                              )
                            }
                            className={cn(
                              'flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all',
                              stagingModal.targetSite === site.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-100 hover:border-gray-200'
                            )}
                          >
                            <span className="text-lg">{site.flag}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{site.name}</p>
                              <p className="text-xs text-gray-500">{site.location}</p>
                            </div>
                            <Globe className="h-4 w-4 text-gray-300" />
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setStagingModal(null)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!stagingModal.targetSite}
                    className="gap-2"
                    onClick={handleStageData}
                  >
                    <ArrowRight className="h-4 w-4" />
                    Start Staging
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
