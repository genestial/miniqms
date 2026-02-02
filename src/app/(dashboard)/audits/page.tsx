'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
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

export default function AuditsPage() {
  const router = useRouter()
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null)

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
      if (editingAudit) {
        // Update existing audit
        const response = await fetch('/api/audits', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAudit.id,
            auditDate: data.auditDate,
            scope: data.scope,
            findingsSummary: data.findingsSummary,
            // Note: File updates would require a separate endpoint
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update audit')
        }
      } else {
        // Create new audit
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
      }

      fetchAudits()
      setShowForm(false)
      setEditingAudit(null)
    } catch (error) {
      console.error('Error saving audit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save audit. Please try again.'
      alert(errorMessage)
    }
  }

  const handleEdit = (audit: Audit, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingAudit(audit)
    setShowForm(true)
  }

  const handleDelete = async (audit: Audit, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete this audit? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/audits?id=${audit.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete audit')
      }

      fetchAudits()
    } catch (error) {
      console.error('Error deleting audit:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete audit. Please try again.'
      alert(errorMessage)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAudit(null)
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
        <h1 className="page-title">Internal Audits</h1>
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
            <CardTitle>{editingAudit ? 'Edit Internal Audit' : 'Record New Internal Audit'}</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditForm
              onSubmit={handleAuditSubmit}
              onCancel={handleCancel}
              initialData={editingAudit ? {
                auditDate: editingAudit.auditDate.split('T')[0],
                scope: editingAudit.scope || undefined,
                findingsSummary: editingAudit.findingsSummary || undefined,
              } : undefined}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid-cards">
        {audits.map((audit) => (
          <Card 
            key={audit.id}
            className="card-item"
            onClick={() => router.push(`/audits/${audit.id}`)}
          >
            <CardHeader className="card-item-header">
              <CardTitle>
                Audit - {new Date(audit.auditDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="card-item-content">
              {audit.scope && (
                <div className="mb-2">
                  <p className="text-muted-small mb-1">Scope:</p>
                  <p className="text-muted line-clamp-2">{audit.scope}</p>
                </div>
              )}
              {audit.findingsSummary && (
                <div className="mb-2">
                  <p className="text-muted-small mb-1">Findings:</p>
                  <p className="text-muted line-clamp-3">{audit.findingsSummary}</p>
                </div>
              )}
              {audit.storageKey && (
                <Badge variant="secondary" className="mt-2">
                  Report Available
                </Badge>
              )}
              <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEdit(audit, e)}
                  className="action-button"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDelete(audit, e)}
                  className="action-button-destructive"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {audits.length === 0 && !showForm && (
        <Card>
          <CardContent className="empty-state">
            No audits yet. Record your first internal audit to get started.
          </CardContent>
        </Card>
      )}

    </div>
  )
}
