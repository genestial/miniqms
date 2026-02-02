'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { AuditForm } from '@/components/forms/AuditForm'

interface Audit {
  id: string
  auditDate: string
  scope: string | null
  findingsSummary: string | null
  storageKey?: string | null
  createdAt: string
  updatedAt: string
}

export default function AuditDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [audit, setAudit] = useState<Audit | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchAudit()
    }
  }, [id])

  const fetchAudit = async () => {
    try {
      const response = await fetch(`/api/audits?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to load audit')
      }
      const data = await response.json()
      setAudit(data)
    } catch (error) {
      console.error('Failed to load audit:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!audit) return
    if (!confirm(`Are you sure you want to delete this audit? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/audits?id=${audit.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete audit')
      }

      router.push('/audits')
    } catch (error) {
      console.error('Error deleting audit:', error)
      alert('Failed to delete audit. Please try again.')
    }
  }

  const handleUpdate = async (data: {
    auditDate: string
    scope: string
    findingsSummary: string
    file?: File
  }) => {
    try {
      const response = await fetch('/api/audits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: audit?.id,
          auditDate: data.auditDate,
          scope: data.scope,
          findingsSummary: data.findingsSummary,
          // Note: File updates would require a separate endpoint
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update audit')
      }

      await fetchAudit()
      setEditing(false)
    } catch (error) {
      console.error('Error updating audit:', error)
      alert('Failed to update audit. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Audit not found</div>
        <Button onClick={() => router.push('/audits')} className="mt-4">
          Back to Audits
        </Button>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="outline" onClick={() => setEditing(false)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel Edit
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Edit Internal Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditForm
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              initialData={{
                auditDate: audit.auditDate.split('T')[0],
                scope: audit.scope || undefined,
                findingsSummary: audit.findingsSummary || undefined,
              }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/audits')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Audits
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">
            Audit - {new Date(audit.auditDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Audit Date</label>
            <p className="mt-1 text-sm">
              {new Date(audit.auditDate).toLocaleDateString()}
            </p>
          </div>

          {audit.scope && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Scope</label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{audit.scope}</p>
            </div>
          )}

          {audit.findingsSummary && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Findings Summary</label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{audit.findingsSummary}</p>
            </div>
          )}

          {audit.storageKey && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Report</label>
              <p className="mt-1">
                <Badge variant="secondary">Report Available</Badge>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1 text-sm">
                {new Date(audit.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1 text-sm">
                {new Date(audit.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
