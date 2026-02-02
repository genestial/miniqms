'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
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

export default function EvidencePage() {
  const router = useRouter()
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvidence, setEditingEvidence] = useState<Evidence | null>(null)

  useEffect(() => {
    fetchEvidence()
  }, [])

  const fetchEvidence = () => {
    fetch('/api/evidence')
      .then((res) => res.json())
      .then((data) => {
        setEvidence(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load evidence:', error)
        setLoading(false)
      })
  }

  const handleEvidenceSubmit = async (data: {
    title: string
    type: 'POLICY' | 'PROCEDURE' | 'RECORD' | 'TEMPLATE' | 'OTHER'
    sourceType: 'UPLOAD' | 'LINK' | 'GENERATED'
    file?: File
    externalUrl?: string
    ownerId?: string
  }) => {
    try {
      if (editingEvidence) {
        // Update existing evidence
        const response = await fetch('/api/evidence', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingEvidence.id,
            title: data.title,
            type: data.type,
            sourceType: data.sourceType,
            externalUrl: data.externalUrl,
            ownerId: data.ownerId,
            status: editingEvidence.status, // Keep existing status
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update evidence')
        }
      } else {
        // Create new evidence
        if (data.sourceType === 'UPLOAD' && data.file) {
          // Upload file first
          const formData = new FormData()
          formData.append('file', data.file)
          formData.append('title', data.title)
          formData.append('type', data.type)
          formData.append('sourceType', data.sourceType)
          if (data.ownerId) {
            formData.append('ownerId', data.ownerId)
          }

          const uploadResponse = await fetch('/api/evidence/upload', {
            method: 'POST',
            body: formData,
          })

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to upload evidence')
          }
        } else if (data.sourceType === 'LINK' && data.externalUrl) {
          // Create evidence with external URL
          const response = await fetch('/api/evidence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: data.title,
              type: data.type,
              sourceType: data.sourceType,
              externalUrl: data.externalUrl,
              ownerId: data.ownerId,
              status: 'DRAFT',
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to create evidence')
          }
        } else if (data.sourceType === 'GENERATED') {
          // Create evidence record for generated content
          const response = await fetch('/api/evidence', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: data.title,
              type: data.type,
              sourceType: data.sourceType,
              ownerId: data.ownerId,
              status: 'DRAFT',
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to create evidence')
          }
        } else {
          throw new Error('Invalid source type or missing file/URL')
        }
      }

      // Refresh the list
      fetchEvidence()
      setShowForm(false)
      setEditingEvidence(null)
    } catch (error) {
      console.error('Error saving evidence:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save evidence. Please try again.'
      alert(errorMessage)
    }
  }

  const handleEdit = (item: Evidence, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingEvidence(item)
    setShowForm(true)
  }

  const handleDelete = async (item: Evidence, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete "${item.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/evidence?id=${item.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete evidence')
      }

      fetchEvidence()
    } catch (error) {
      console.error('Error deleting evidence:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete evidence. Please try again.'
      alert(errorMessage)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEvidence(null)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Evidence Register</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Evidence
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEvidence ? 'Edit Evidence' : 'Add New Evidence'}</CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceForm
              onSubmit={handleEvidenceSubmit}
              onCancel={handleCancel}
              initialData={editingEvidence ? {
                title: editingEvidence.title,
                type: editingEvidence.type as any,
                sourceType: editingEvidence.sourceType as any,
                externalUrl: editingEvidence.externalUrl || undefined,
                ownerId: editingEvidence.ownerId || undefined,
              } : undefined}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid-cards">
        {evidence.map((item) => (
          <Card 
            key={item.id} 
            className="card-item"
            onClick={() => router.push(`/evidence/${item.id}`)}
          >
            <CardHeader className="card-item-header">
              <div className="flex items-center justify-between">
                <CardTitle>{item.title}</CardTitle>
                <Badge variant="outline" className="status-badge">{item.status.replace(/_/g, ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent className="card-item-content">
              <div className="space-y-2">
                <Badge variant="secondary">{item.type}</Badge>
                <Badge variant="secondary">{item.sourceType.replace(/_/g, ' ')}</Badge>
                {item.externalUrl && (
                  <div className="text-xs">
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View External Link →
                    </a>
                  </div>
                )}
                <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEdit(item, e)}
                    className="action-button"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDelete(item, e)}
                    className="action-button-destructive"
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {evidence.length === 0 && !showForm && (
        <Card>
          <CardContent className="empty-state">
            No evidence yet. Add your first evidence item to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
