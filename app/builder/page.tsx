'use client'

import * as React from 'react'
import { Terminal, Hammer, Save, Play, History, Clock, ChevronRight, FileCode } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function BuilderPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-secondary">Container Builder</h1>
                    <p className="text-sm text-gray-500">
                        Build and push CANFAR-compatible Docker/Singularity images directly from your browser.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">
                        <History className="mr-2 h-4 w-4" />
                        Full Build Logs
                    </Button>
                    <Button variant="primary">
                        <Play className="mr-2 h-4 w-4" />
                        Start Build
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden border-none shadow-lg ring-1 ring-gray-200">
                        <CardHeader className="bg-gray-50/50 border-b py-3 px-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileCode className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-semibold text-secondary">Dockerfile Editor</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100 font-medium">
                                        Base: science-platform-base:2.1
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="relative">
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 text-[10px] font-mono text-gray-600 select-none">
                                    {Array.from({ length: 15 }).map((_, i) => (
                                        <div key={i} className="h-6 leading-6">{i + 1}</div>
                                    ))}
                                </div>
                                <textarea
                                    className="w-full h-[400px] pl-16 pr-4 py-4 text-xs font-mono bg-gray-900 text-green-400 outline-none focus:ring-0 resize-none leading-6"
                                    spellCheck={false}
                                    defaultValue={"FROM canfar/science-platform-base:latest\n\n# Install custom astronomical packages\nRUN pip install spectral-cube aplpy\n\n# Add your scripts\nCOPY analyze.py /home/user/analyze.py\n\n# Set permissions\nRUN chown -R 1000:1000 /home/user\n\nUSER 1000\nWORKDIR /home/user\n\nCMD [\"python\", \"/home/user/analyze.py\"]"}
                                />
                            </div>
                        </CardContent>
                        <div className="bg-gray-50 border-t p-3 flex justify-between items-center">
                            <span className="text-xs text-gray-500">File: <span className="font-mono">Dockerfile.analysis</span></span>
                            <Button variant="secondary" size="sm" className="h-8">
                                <Save className="mr-2 h-3.5 w-3.5" />
                                Save Template
                            </Button>
                        </div>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card className="bg-blue-50/30 border-blue-100">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Hammer className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-900">Build Optimization</h4>
                                    <p className="text-xs text-blue-700 mt-1">Multi-stage builds are enabled by default for smaller image sizes.</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-amber-50/30 border-amber-100">
                            <CardContent className="p-4 flex items-start gap-4">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Terminal className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-900">Push to Registry</h4>
                                    <p className="text-xs text-amber-700 mt-1">Images are automatically tagged and pushed to images.canfar.net.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sidebar Section */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b bg-gray-50/30">
                            <CardTitle className="text-sm font-semibold text-secondary">Build History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 divide-y">
                            {[
                                { name: 'vlass-analysis:v1.0.2', time: '2 days ago', status: 'success' },
                                { name: 'test-image:debug-3', time: '1 week ago', status: 'failed' },
                                { name: 'spectral-fit:v2', time: '2 weeks ago', status: 'success' },
                                { name: 'casa-custom:latest', time: '1 month ago', status: 'success' },
                            ].map((build, i) => (
                                <div key={i} className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 cursor-pointer group">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full", build.status === 'success' ? 'bg-green-500' : 'bg-red-500')} />
                                            <span className="text-xs font-mono font-medium text-gray-700">{build.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            {build.time}
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-3 border-t">
                            <Button variant="ghost" size="sm" className="w-full text-xs text-gray-500">View All Builds</Button>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b bg-gray-50/30">
                            <CardTitle className="text-sm font-semibold text-secondary">Registry Quota</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Storage Used</span>
                                    <span className="font-medium text-secondary">15.4 GB / 50 GB</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '31%' }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Total Images</span>
                                    <span className="font-medium text-secondary">12 / 100</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: '12%' }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}
