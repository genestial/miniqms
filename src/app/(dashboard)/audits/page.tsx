'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { AuditForm } from '@/components/forms/AuditForm'

interface Audit {
  id: string
  auditDate: string
  scope: string | null
  findingsSummary: string | null
  storageKey?: string | null
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchAudits()
  }, [])

  const fetchAudits = () => {
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
  }

  const handleAuditSubmit = async (data: {
    auditDate: string
    scope: string
    findingsSummary: string
    file?: File
  }) => {
    try {
      if (data.file) {
        // Upload file with audit data
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('auditDate', data.auditDate)
        formData.append('scope', data.scope)
        formData.append('findingsSummary', data.findingsSummary)

        const uploadResponse = await fetch('/api/audits/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to upload audit')
        }
      } else {
        // Create audit without file
        const response = await fetch('/api/audits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auditDate: data.auditDate,
            scope: data.scope,
            findingsSummary: data.findingsSummary,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create audit')
        }
      }

      // Refresh the list
      fetchAudits()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating audit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create audit. Please try again.'
      alert(errorMessage)
    }
  }

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
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Audit
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Record New Internal Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditForm
              onSubmit={handleAuditSubmit}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

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
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Scope:</p>
                  <p className="text-sm">{audit.scope}</p>
                </div>
              )}
              {audit.findingsSummary && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Findings:</p>
                  <p className="text-sm line-clamp-3">{audit.findingsSummary}</p>
                </div>
              )}
              {audit.storageKey && (
                <Badge variant="secondary" className="mt-2">
                  Report Available
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {audits.length === 0 && !showForm && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No audits yet. Record your first internal audit to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
