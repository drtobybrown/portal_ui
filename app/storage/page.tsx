'use client'

import * as React from 'react'
import { HardDrive, Upload, FolderOpen, File, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { userStorage } from '@/lib/dummy-data'
import { formatPercentage } from '@/lib/utils'

const dummyFiles = [
  { name: 'observations/', type: 'folder', size: '-', modified: '2026-01-25' },
  { name: 'analysis/', type: 'folder', size: '-', modified: '2026-01-27' },
  { name: 'vlass_mosaic.fits', type: 'file', size: '4.2 GB', modified: '2026-01-28' },
  { name: 'calibration_data.ms', type: 'file', size: '12.8 GB', modified: '2026-01-26' },
  { name: 'results.tar.gz', type: 'file', size: '856 MB', modified: '2026-01-28' },
]

export default function StoragePage() {
  const homePercentage = formatPercentage(userStorage.home.used, userStorage.home.quota)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-secondary">Data & Storage</h1>
          <p className="text-sm text-gray-500">
            Manage your VOSpace files and storage quotas
          </p>
        </div>
        <Button variant="primary">
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Storage Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Home Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">
                {userStorage.home.used} GB of {userStorage.home.quota} GB used
              </span>
              <span className="font-medium text-secondary">{homePercentage}%</span>
            </div>
            <Progress value={userStorage.home.used} max={userStorage.home.quota} variant="success" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Scratch Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-500">
                {userStorage.scratch.used} GB of {userStorage.scratch.quota} GB used
              </span>
              <span className="font-medium text-secondary">
                {formatPercentage(userStorage.scratch.used, userStorage.scratch.quota)}%
              </span>
            </div>
            <Progress value={userStorage.scratch.used} max={userStorage.scratch.quota} />
          </CardContent>
        </Card>
      </div>

      {/* File Browser */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-gray-400" />
            <CardTitle className="text-base">VOSpace Browser</CardTitle>
          </div>
          <div className="text-sm text-gray-500">
            /home/thbrown
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 border-b bg-gray-50 px-4 py-2 text-xs font-medium uppercase text-gray-500">
              <div className="col-span-6">Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Modified</div>
              <div className="col-span-1"></div>
            </div>
            {dummyFiles.map((file) => (
              <div
                key={file.name}
                className="grid grid-cols-12 gap-4 border-b px-4 py-3 text-sm last:border-0 hover:bg-gray-50"
              >
                <div className="col-span-6 flex items-center gap-2">
                  {file.type === 'folder' ? (
                    <FolderOpen className="h-4 w-4 text-accent" />
                  ) : (
                    <File className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-medium text-secondary">{file.name}</span>
                </div>
                <div className="col-span-2 text-gray-500">{file.size}</div>
                <div className="col-span-3 text-gray-500">{file.modified}</div>
                <div className="col-span-1 flex justify-end">
                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
