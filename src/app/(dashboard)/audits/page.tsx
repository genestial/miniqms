'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Audit {
  id: string
  auditDate: string
  scope: string | null
  findingsSummary: string | null
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/audits')
      .then((res) => res.json())
      .then((data) => {
        setAudits(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load audits:', error)
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Internal Audits</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Audit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {audits.map((audit) => (
          <Card key={audit.id}>
            <CardHeader>
              <CardTitle>
                Audit - {new Date(audit.auditDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {audit.scope && (
                <p className="text-sm text-muted-foreground mb-2">
                  Scope: {audit.scope}
                </p>
              )}
              {audit.findingsSummary && (
                <p className="text-sm">{audit.findingsSummary}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {audits.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No audits yet. Record your first internal audit to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
