'use client'

import * as React from 'react'
import {
  Terminal,
  Folder,
  File,
  ChevronRight,
  Copy,
  Scissors,
  FolderPlus,
  Trash2,
  Upload,
  Download,
  ArrowRight,
  Globe,
  Home,
  CornerDownLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { mockFileSystem, srcSites } from '@/lib/dummy-data'

interface CommandHistoryEntry {
  command: string
  output: string
  timestamp: string
  site: string
}

export default function FilesPage() {
  const [currentPath, setCurrentPath] = React.useState<string[]>(['home'])
  const [selectedSite, setSelectedSite] = React.useState('src-canada')
  const [commandInput, setCommandInput] = React.useState('')
  const [commandHistory, setCommandHistory] = React.useState<CommandHistoryEntry[]>([
    {
      command: 'ls /home/thbrown',
      output:
        'notebooks/     pipelines/     spectral_analysis.ipynb     ska_mid_preview.fits',
      timestamp: '10:32:15',
      site: 'src-canada',
    },
  ])
  const [activeTab, setActiveTab] = React.useState<'browser' | 'terminal'>('browser')
  const [selectedFiles, setSelectedFiles] = React.useState<Set<string>>(new Set())

  const terminalRef = React.useRef<HTMLDivElement>(null)

  const currentDir = currentPath[currentPath.length - 1] ?? 'home'
  const files = mockFileSystem[currentDir] ?? []
  const selectedSiteObj = srcSites.find(s => s.id === selectedSite)

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [commandHistory])

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return

    const parts = cmd.trim().split(/\s+/)
    const command = parts[0]
    let output = ''
    const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    switch (command) {
      case 'ls':
        output = files
          .map(f => (f.type === 'folder' ? `${f.name}/` : f.name))
          .join('     ')
        if (!output) output = '(empty directory)'
        break
      case 'pwd':
        output = `/${currentPath.join('/')}`
        break
      case 'cd': {
        const target = parts[1]
        if (target === '..' && currentPath.length > 1) {
          setCurrentPath(prev => prev.slice(0, -1))
          output = `Changed to /${currentPath.slice(0, -1).join('/')}`
        } else if (target === '~' || target === undefined) {
          setCurrentPath(['home'])
          output = 'Changed to /home'
        } else {
          const folder = files.find(f => f.name === target && f.type === 'folder')
          if (folder) {
            setCurrentPath(prev => [...prev, target])
            output = `Changed to /${[...currentPath, target].join('/')}`
          } else {
            output = `cd: no such directory: ${target}`
          }
        }
        break
      }
      case 'mkdir':
        output = parts[1]
          ? `Created directory: ${parts[1]}`
          : 'mkdir: missing operand'
        break
      case 'cp':
        output =
          parts.length >= 3
            ? `Copying ${parts[1]} to ${parts[2]}...`
            : 'cp: missing operand'
        break
      case 'mv':
        output =
          parts.length >= 3
            ? `Moving ${parts[1]} to ${parts[2]}...`
            : 'mv: missing operand'
        break
      case 'rm':
        output = parts[1]
          ? `Removed: ${parts[1]}`
          : 'rm: missing operand'
        break
      case 'canfar':
        if (parts[1] === 'auth' && parts[2] === 'login') {
          output = 'Authenticated successfully via SKAO IAM'
        } else if (parts[1] === 'ps') {
          output =
            'ID          TYPE      STATUS    NAME              SITE\nsess-001    jupyter   running   ska-analysis-1    SRC Canada\nsess-002    carta     running   carta-imaging     SRC UK'
        } else if (parts[1] === 'stats') {
          output = `SRC Site: ${selectedSiteObj?.name || 'Unknown'}\nCPU: ${selectedSiteObj?.cpuAvailable || 0}/${selectedSiteObj?.cpuTotal || 0} available\nRAM: ${((selectedSiteObj?.ramAvailable || 0) / 1000).toFixed(1)}/${((selectedSiteObj?.ramTotal || 0) / 1000).toFixed(1)} TB available`
        } else {
          output =
            'Usage: canfar <command> [options]\n\nCommands:\n  auth login    Authenticate with SKAO IAM\n  create        Create a new session\n  ps            List running sessions\n  delete        Delete a session\n  stats         Show site statistics\n  image list    List available images\n  config show   Show configuration'
        }
        break
      case 'help':
        output =
          'Available commands:\n  ls            List files\n  cd <dir>      Change directory\n  pwd           Print working directory\n  mkdir <name>  Create directory\n  cp <src> <dest>  Copy file\n  mv <src> <dest>  Move file\n  rm <file>     Remove file\n  canfar        CANFAR CLI commands\n  clear         Clear terminal\n  help          Show this help'
        break
      case 'clear':
        setCommandHistory([])
        setCommandInput('')
        return
      default:
        output = `${command}: command not found. Type 'help' for available commands.`
    }

    setCommandHistory(prev => [
      ...prev,
      { command: cmd, output, timestamp: currentTime, site: selectedSiteObj?.name || 'Unknown' },
    ])
    setCommandInput('')
  }

  const toggleFileSelection = (name: string) => {
    setSelectedFiles(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and manage files across SRC sites with POSIX-like commands
          </p>
        </div>

        {/* Site Selector */}
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-gray-400" />
          <select
            value={selectedSite}
            onChange={e => setSelectedSite(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Select SRC site"
          >
            {srcSites.map(site => (
              <option key={site.id} value={site.id}>
                {site.flag} {site.name} — {site.location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'browser'}
          onClick={() => setActiveTab('browser')}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
            activeTab === 'browser'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Folder className="mr-2 inline h-4 w-4" />
          File Browser
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'terminal'}
          onClick={() => setActiveTab('terminal')}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all',
            activeTab === 'terminal'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <Terminal className="mr-2 inline h-4 w-4" />
          Terminal
        </button>
      </div>

      {/* File Browser */}
      {activeTab === 'browser' && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Breadcrumb */}
                <button
                  onClick={() => setCurrentPath(['home'])}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </button>
                {currentPath.map((segment, i) => (
                  <React.Fragment key={i}>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <button
                      onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
                      className={cn(
                        'rounded px-1.5 py-0.5 text-sm transition-colors',
                        i === currentPath.length - 1
                          ? 'font-medium text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                    >
                      {segment}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" disabled={selectedFiles.size === 0}>
                  <Copy className="mr-1 h-3.5 w-3.5" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm" disabled={selectedFiles.size === 0}>
                  <Scissors className="mr-1 h-3.5 w-3.5" />
                  Move
                </Button>
                <Button variant="ghost" size="sm">
                  <FolderPlus className="mr-1 h-3.5 w-3.5" />
                  New Folder
                </Button>
                <Button variant="ghost" size="sm">
                  <Upload className="mr-1 h-3.5 w-3.5" />
                  Upload
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={selectedFiles.size === 0}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y bg-gray-50/50 text-left">
                  <th className="w-10 px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedFiles.size === files.length && files.length > 0}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedFiles(new Set(files.map(f => f.name)))
                        } else {
                          setSelectedFiles(new Set())
                        }
                      }}
                      className="rounded border-gray-300"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-4 py-2 font-medium text-gray-500">Name</th>
                  <th className="px-4 py-2 font-medium text-gray-500">Size</th>
                  <th className="px-4 py-2 font-medium text-gray-500">Modified</th>
                  <th className="px-4 py-2 font-medium text-gray-500">Owner</th>
                  {files.some(f => f.site) && (
                    <th className="px-4 py-2 font-medium text-gray-500">Site</th>
                  )}
                  <th className="px-4 py-2 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Parent directory link */}
                {currentPath.length > 1 && (
                  <tr
                    className="border-b cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => setCurrentPath(prev => prev.slice(0, -1))}
                  >
                    <td className="px-4 py-2.5" />
                    <td className="px-4 py-2.5 flex items-center gap-2 text-gray-400">
                      <Folder className="h-4 w-4" />
                      ..
                    </td>
                    <td className="px-4 py-2.5 text-gray-400">-</td>
                    <td className="px-4 py-2.5 text-gray-400">-</td>
                    <td className="px-4 py-2.5 text-gray-400">-</td>
                    {files.some(f => f.site) && <td className="px-4 py-2.5" />}
                    <td className="px-4 py-2.5" />
                  </tr>
                )}
                {files.map(file => (
                  <tr
                    key={file.name}
                    className={cn(
                      'border-b transition-colors hover:bg-gray-50/50',
                      selectedFiles.has(file.name) && 'bg-primary/5',
                      file.type === 'folder' && 'cursor-pointer'
                    )}
                    onClick={() => {
                      if (file.type === 'folder') {
                        setCurrentPath(prev => [...prev, file.name])
                      }
                    }}
                  >
                    <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedFiles.has(file.name)}
                        onChange={() => toggleFileSelection(file.name)}
                        className="rounded border-gray-300"
                        aria-label={`Select ${file.name}`}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        {file.type === 'folder' ? (
                          <Folder className="h-4 w-4 text-primary/60" />
                        ) : (
                          <File className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={cn('font-medium', file.type === 'folder' ? 'text-primary' : 'text-gray-900')}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">{file.size}</td>
                    <td className="px-4 py-2.5 text-gray-600">{file.modified}</td>
                    <td className="px-4 py-2.5 text-gray-600">{file.owner}</td>
                    {files.some(f => f.site) && (
                      <td className="px-4 py-2.5">
                        {file.site && (
                          <Badge variant="default" className="text-xs">
                            {file.site}
                          </Badge>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}>
                      {file.type === 'file' && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {files.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      <Folder className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="font-medium text-gray-500">Empty directory</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Terminal */}
      {activeTab === 'terminal' && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-gray-900 pb-2 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <CardTitle className="text-sm font-medium text-gray-300">
                  {selectedSiteObj?.name || 'Terminal'} — {selectedSiteObj?.location || ''}
                </CardTitle>
              </div>
              <Badge variant="default" className="bg-gray-700 text-gray-300 text-xs">
                {selectedSiteObj?.flag} Connected
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="bg-gray-950 p-0">
            <div
              ref={terminalRef}
              className="h-96 overflow-y-auto p-4 font-mono text-sm"
              role="log"
              aria-label="Terminal output"
            >
              <p className="text-green-400 mb-2">
                Welcome to SRCNet File Manager — {selectedSiteObj?.name}
              </p>
              <p className="text-gray-500 mb-4">
                Type &apos;help&apos; for available commands. canfar CLI commands are also available.
              </p>

              {commandHistory.map((entry, i) => (
                <div key={i} className="mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">thbrown@{selectedSiteObj?.id || 'src'}:~$</span>
                    <span className="text-white">{entry.command}</span>
                  </div>
                  <pre className="mt-0.5 whitespace-pre-wrap text-gray-300">{entry.output}</pre>
                </div>
              ))}

              {/* Input line */}
              <div className="flex items-center gap-2">
                <span className="text-green-400 whitespace-nowrap">
                  thbrown@{selectedSiteObj?.id || 'src'}:~$
                </span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={e => setCommandInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') executeCommand(commandInput)
                  }}
                  className="flex-1 bg-transparent text-white outline-none caret-green-400"
                  autoFocus
                  aria-label="Terminal input"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Quick command bar */}
            <div className="flex items-center gap-2 border-t border-gray-800 bg-gray-900 px-4 py-2">
              <span className="text-xs text-gray-500">Quick:</span>
              {['ls', 'pwd', 'canfar ps', 'canfar stats', 'help'].map(cmd => (
                <button
                  key={cmd}
                  onClick={() => executeCommand(cmd)}
                  className="rounded bg-gray-800 px-2 py-1 text-xs font-mono text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  {cmd}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                <CornerDownLeft className="h-3 w-3" /> Enter to run
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-site transfer card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRight className="h-5 w-5 text-primary" />
            Cross-Site File Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-500">
            Transfer files between SRC sites. Select source and destination, then specify the files to transfer.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">From</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {srcSites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.flag} {site.name}
                  </option>
                ))}
              </select>
            </div>
            <ArrowRight className="mt-5 h-5 w-5 text-gray-300" />
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">To</label>
              <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                {srcSites.map(site => (
                  <option key={site.id} value={site.id}>
                    {site.flag} {site.name}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="primary" className="mt-5 gap-2">
              <ArrowRight className="h-4 w-4" />
              Transfer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
