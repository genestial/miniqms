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
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  if (!audit) {
    return (
      <div className="loading-container">
        <div className="loading-text">Audit not found</div>
        <Button onClick={() => router.push('/audits')} className="mt-4">
          Back to Audits
        </Button>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="detail-page-container">
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
    <div className="detail-page-container">
      <div className="detail-page-header">
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

      <Card className="detail-card">
        <CardHeader className="detail-card-header">
          <CardTitle className="detail-page-title">
            Audit - {new Date(audit.auditDate).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="detail-card-content detail-section">
          <div className="detail-field">
            <label className="detail-field-label">Audit Date</label>
            <p className="detail-field-value">
              {new Date(audit.auditDate).toLocaleDateString()}
            </p>
          </div>

          {audit.scope && (
            <div className="detail-field">
              <label className="detail-field-label">Scope</label>
              <p className="detail-field-value whitespace-pre-wrap">{audit.scope}</p>
            </div>
          )}

          {audit.findingsSummary && (
            <div className="detail-field">
              <label className="detail-field-label">Findings Summary</label>
              <p className="detail-field-value whitespace-pre-wrap">{audit.findingsSummary}</p>
            </div>
          )}

          {audit.storageKey && (
            <div className="detail-field">
              <label className="detail-field-label">Report</label>
              <p className="mt-1">
                <Badge variant="secondary">Report Available</Badge>
              </p>
            </div>
          )}

          <div className="detail-grid detail-divider">
            <div className="detail-field">
              <label className="detail-field-label">Created</label>
              <p className="detail-field-value">
                {new Date(audit.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Last Updated</label>
              <p className="detail-field-value">
                {new Date(audit.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
