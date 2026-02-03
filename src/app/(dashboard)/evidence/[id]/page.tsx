'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { EvidenceForm } from '@/components/forms/EvidenceForm'

interface Evidence {
  id: string
  title: string
  type: string
  status: string
  sourceType: string
  storageKey?: string | null
  externalUrl?: string | null
  ownerId?: string | null
  createdAt: string
  updatedAt: string
}

export default function EvidenceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [evidence, setEvidence] = useState<Evidence | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchEvidence()
    }
  }, [id])

  const fetchEvidence = async () => {
    try {
      const response = await fetch(`/api/evidence?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to load evidence')
      }
      const data = await response.json()
      setEvidence(data)
    } catch (error) {
      console.error('Failed to load evidence:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!evidence) return
    if (!confirm(`Are you sure you want to delete "${evidence.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/evidence?id=${evidence.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete evidence')
      }

      router.push('/evidence')
    } catch (error) {
      console.error('Error deleting evidence:', error)
      alert('Failed to delete evidence. Please try again.')
    }
  }

  const handleUpdate = async (data: {
    title: string
    type: 'POLICY' | 'PROCEDURE' | 'RECORD' | 'TEMPLATE' | 'OTHER'
    sourceType: 'UPLOAD' | 'LINK' | 'GENERATED'
    file?: File
    externalUrl?: string
    ownerId?: string
  }) => {
    try {
      const response = await fetch('/api/evidence', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: evidence?.id,
          title: data.title,
          type: data.type,
          sourceType: data.sourceType,
          externalUrl: data.externalUrl,
          ownerId: data.ownerId,
          status: evidence?.status, // Keep existing status
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update evidence')
      }

      await fetchEvidence()
      setEditing(false)
    } catch (error) {
      console.error('Error updating evidence:', error)
      alert('Failed to update evidence. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  if (!evidence) {
    return (
      <div className="loading-container">
        <div className="loading-text">Evidence not found</div>
        <Button onClick={() => router.push('/evidence')} className="mt-4">
          Back to Evidence
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
        <Card className="detail-card">
          <CardHeader className="detail-card-header">
            <CardTitle className="detail-page-title">Edit Evidence</CardTitle>
          </CardHeader>
          <CardContent className="detail-card-content">
            <EvidenceForm
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              initialData={{
                title: evidence.title,
                type: evidence.type as any,
                sourceType: evidence.sourceType as any,
                externalUrl: evidence.externalUrl || undefined,
                ownerId: evidence.ownerId || undefined,
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
        <Button variant="outline" onClick={() => router.push('/evidence')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Evidence
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
          <div className="flex items-center justify-between">
            <CardTitle className="detail-page-title">{evidence.title}</CardTitle>
            <Badge variant="outline" className="status-badge">{evidence.status.replace(/_/g, ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="detail-card-content detail-section">
          <div className="detail-grid">
            <div className="detail-field">
              <label className="detail-field-label">Type</label>
              <p className="mt-1">
                <Badge variant="secondary">{evidence.type}</Badge>
              </p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Source Type</label>
              <p className="mt-1">
                <Badge variant="secondary">{evidence.sourceType.replace(/_/g, ' ')}</Badge>
              </p>
            </div>
            {evidence.ownerId && (
              <div className="detail-field">
                <label className="detail-field-label">Owner</label>
                <p className="detail-field-value">{evidence.ownerId}</p>
              </div>
            )}
          </div>

          {evidence.externalUrl && (
            <div className="detail-field">
              <label className="detail-field-label">External URL</label>
              <p className="mt-1">
                <a
                  href={evidence.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {evidence.externalUrl}
                </a>
              </p>
            </div>
          )}

          {evidence.storageKey && (
            <div className="detail-field">
              <label className="detail-field-label">File</label>
              <p className="detail-field-value text-muted-foreground">
                {evidence.storageKey.split('/').pop()}
              </p>
            </div>
          )}

          <div className="detail-grid detail-divider">
            <div className="detail-field">
              <label className="detail-field-label">Created</label>
              <p className="detail-field-value">
                {new Date(evidence.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Last Updated</label>
              <p className="detail-field-value">
                {new Date(evidence.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
