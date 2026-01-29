'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface CompanyProfile {
  id: string
  companyName: string
  address: string | null
  industry: string | null
  employeeCount: number | null
  description: string | null
}

interface Role {
  id: string
  name: string
  responsibilitiesText: string
}

export default function CompanyPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/company/profile').then((res) => res.json()),
      fetch('/api/company/roles').then((res) => res.json()),
    ])
      .then(([profileData, rolesData]) => {
        setProfile(profileData)
        setRoles(rolesData)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load company data:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Company Profile & Organisation Context</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Company Profile</CardTitle>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-2">
                <div>
                  <strong>Company Name:</strong> {profile.companyName}
                </div>
                {profile.address && (
                  <div>
                    <strong>Address:</strong> {profile.address}
                  </div>
                )}
                {profile.industry && (
                  <div>
                    <strong>Industry:</strong> {profile.industry}
                  </div>
                )}
                {profile.employeeCount && (
                  <div>
                    <strong>Employees:</strong> {profile.employeeCount}
                  </div>
                )}
                {profile.description && (
                  <div>
                    <strong>Description:</strong> {profile.description}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No company profile yet. Add one to get started.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Roles & Responsibilities</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {roles.length > 0 ? (
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {role.responsibilitiesText}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No roles defined yet. Add roles to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
