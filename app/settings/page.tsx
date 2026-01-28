'use client'

import * as React from 'react'
import { User, Bell, Shield, Palette, Key } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { userData } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

const settingsSections = [
  {
    id: 'profile',
    name: 'Profile',
    description: 'Manage your account information',
    icon: User,
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure email and alert preferences',
    icon: Bell,
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Password and authentication settings',
    icon: Shield,
  },
  {
    id: 'appearance',
    name: 'Appearance',
    description: 'Customize the interface',
    icon: Palette,
  },
  {
    id: 'api',
    name: 'API Access',
    description: 'Manage API keys and tokens',
    icon: Key,
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('profile')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-secondary">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsSections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    activeSection === section.id
                      ? 'bg-primary-light text-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {section.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
                    {userData.name.split(' ').pop()?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-secondary">{userData.name}</p>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>

                <div className="grid gap-4 pt-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue={userData.name}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={userData.email}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Institution
                    </label>
                    <input
                      type="text"
                      defaultValue="University of Victoria"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button variant="primary">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Job completion alerts', description: 'Get notified when batch jobs finish' },
                  { label: 'Session expiry warnings', description: 'Alert before sessions time out' },
                  { label: 'Storage quota alerts', description: 'Notify when approaching quota limits' },
                  { label: 'System announcements', description: 'Important platform updates' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-secondary">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeSection !== 'profile' && activeSection !== 'notifications' && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-4">
                  {React.createElement(
                    settingsSections.find((s) => s.id === activeSection)?.icon || User,
                    { className: 'h-8 w-8 text-gray-400' }
                  )}
                </div>
                <h3 className="mt-4 font-semibold text-secondary">
                  {settingsSections.find((s) => s.id === activeSection)?.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This section is coming soon
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
