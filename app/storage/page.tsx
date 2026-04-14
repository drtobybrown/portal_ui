'use client'

import * as React from 'react'
import { HardDrive, Upload, FolderOpen, File, MoreHorizontal, Database, Cloud, Users, Plus, ArrowUpRight, Download, Trash2, FileText, Image as ImageIcon, Film, Music } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { userStorage, mockFileSystem, userData } from '@/lib/dummy-data'
import { formatPercentage, cn } from '@/lib/utils'

type StorageLocation = 'home' | string

const getFileIcon = (name: string, type: string) => {
    if (type === 'folder') return FolderOpen;
    if (name.endsWith('.png') || name.endsWith('.jpg')) return ImageIcon;
    if (name.endsWith('.mp4')) return Film;
    if (name.endsWith('.mp3')) return Music;
    return FileText;
}

export default function StoragePage() {
    const [activeLocation, setActiveLocation] = React.useState<StorageLocation>('home')

    // Find current storage quota info based on location
    const currentStorage = activeLocation === 'home'
        ? { ...userStorage.home, name: 'Home Storage', type: 'Personal' }
        : userStorage.projects.find(p => p.name === activeLocation) || { ...userStorage.home, name: 'Unknown', type: '-' }

    const files = mockFileSystem[activeLocation as keyof typeof mockFileSystem] || []
    const percentage = formatPercentage(currentStorage.used, currentStorage.quota)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary">Data & Storage</h1>
                    <p className="text-sm text-gray-500">
                        Manage your vospace (vault) and arc storage across personal and project spaces
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Request Quota Increase
                    </Button>
                    <Button variant="primary">
                        <Upload className="mr-2 h-4 w-4" />
                        Transfer Data
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Sidebar / Location Selector */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium uppercase tracking-wider text-gray-500">Locations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            <button
                                onClick={() => setActiveLocation('home')}
                                className={cn(
                                    "flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                                    activeLocation === 'home' ? "bg-primary-light text-primary" : "text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <HardDrive className="h-4 w-4" />
                                    <span>Home (arc)</span>
                                </div>
                                <div className="w-full pl-7 pr-2">
                                    <Progress value={userStorage.home.used} max={userStorage.home.quota} className="h-1 bg-gray-200" />
                                    <div className="flex justify-between text-[10px] mt-1 opacity-60 font-normal">
                                        <span>{userStorage.home.used}{userStorage.home.unit} used</span>
                                        <span>{userStorage.home.quota}{userStorage.home.unit}</span>
                                    </div>
                                </div>
                            </button>

                            <div className="pt-4 pb-2">
                                <span className="text-xs font-medium text-gray-400 uppercase">Team Projects</span>
                            </div>

                            {userStorage.projects.map(project => (
                                <button
                                    key={project.name}
                                    onClick={() => setActiveLocation(project.name)}
                                    className={cn(
                                        "flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        activeLocation === project.name ? "bg-primary-light text-primary" : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3 truncate">
                                            {project.type === 'vault' ? <Database className="h-4 w-4" /> : <Cloud className="h-4 w-4" />}
                                            <span className="truncate">{project.name}</span>
                                        </div>
                                        <Badge variant="secondary" className="scale-75 origin-right">{project.type}</Badge>
                                    </div>
                                    <div className="w-full pl-7 pr-2">
                                        <Progress value={project.used} max={project.quota} className="h-1 bg-gray-200" />
                                        <div className="flex justify-between text-[10px] mt-1 opacity-60">
                                            <span>{project.used}{project.unit} used</span>
                                            <span>{project.quota}{project.unit}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                </div>

                {/* Main Content / File Browser */}
                <div className="space-y-4">
                    {/* Breadcrumbs / Path */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-white p-3 rounded-lg border shadow-sm">
                        <Database className="h-4 w-4" />
                        <span>/</span>
                        <span className="font-medium text-gray-900">
                            {activeLocation === 'home' ? `arc/home/${userData.username}` : activeLocation}
                        </span>
                        <span>/</span>
                    </div>

                    <Card className="min-h-[500px]">
                        <CardHeader className="border-b bg-gray-50/50 py-3">
                            <div className="grid grid-cols-12 gap-4 text-xs font-medium uppercase text-gray-500">
                                <div className="col-span-6">Name</div>
                                <div className="col-span-2">Size</div>
                                <div className="col-span-3">Modified</div>
                                <div className="col-span-1"></div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {files.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <FolderOpen className="h-12 w-12 mb-2 opacity-20" />
                                    <p>This folder is empty</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {files.map((file) => {
                                        const FileIcon = getFileIcon(file.name, file.type);
                                        return (
                                            <div
                                                key={file.name}
                                                className="group grid grid-cols-12 gap-4 px-6 py-3 text-sm transition-colors hover:bg-gray-50 items-center"
                                            >
                                                <div className="col-span-6 flex items-center gap-3 cursor-pointer">
                                                    <FileIcon className={cn("h-5 w-5", file.type === 'folder' ? "text-accent" : "text-gray-400")} />
                                                    <div>
                                                        <span className="font-medium text-secondary block">{file.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-gray-400">{file.owner}</span>
                                                            {file.name.includes('.parquet') && (
                                                                <Badge variant="secondary" className="text-[9px] px-1 h-3.5 bg-gray-50 text-gray-400 border-gray-200 font-normal">
                                                                    Generated by job-002
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-gray-500">{file.size}</div>
                                                <div className="col-span-3 text-gray-500">{file.modified}</div>
                                                <div className="col-span-1 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Download">
                                                        <Download className="h-4 w-4 text-gray-500 hover:text-primary" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete">
                                                        <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
