'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAudit, setEditingAudit] = useState<Audit | null>(null)
  const [viewingAudit, setViewingAudit] = useState<Audit | null>(null)

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

  const handleEdit = (audit: Audit) => {
    setEditingAudit(audit)
    setShowForm(true)
  }

  const handleDelete = async (audit: Audit) => {
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {audits.map((audit) => (
          <Card 
            key={audit.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setViewingAudit(audit)}
          >
            <CardHeader>
              <CardTitle>
                Audit - {new Date(audit.auditDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {audit.scope && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Scope:</p>
                  <p className="text-sm line-clamp-2">{audit.scope}</p>
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
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(audit)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(audit)}
                  className="flex-1 text-destructive hover:text-destructive"
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
          <CardContent className="pt-6 text-center text-muted-foreground">
            No audits yet. Record your first internal audit to get started.
          </CardContent>
        </Card>
      )}

      <Dialog open={!!viewingAudit} onOpenChange={(open) => !open && setViewingAudit(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit - {viewingAudit && new Date(viewingAudit.auditDate).toLocaleDateString()}</DialogTitle>
            <DialogDescription>
              Internal Audit Details
            </DialogDescription>
          </DialogHeader>
          {viewingAudit && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Audit Date</label>
                <p className="mt-1 text-sm">
                  {new Date(viewingAudit.auditDate).toLocaleDateString()}
                </p>
              </div>
              {viewingAudit.scope && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Scope</label>
                  <p className="mt-1 text-sm">{viewingAudit.scope}</p>
                </div>
              )}
              {viewingAudit.findingsSummary && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Findings Summary</label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{viewingAudit.findingsSummary}</p>
                </div>
              )}
              {viewingAudit.storageKey && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Report</label>
                  <p className="mt-1">
                    <Badge variant="secondary">Report Available</Badge>
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingAudit.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingAudit.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setViewingAudit(null)
                  handleEdit(viewingAudit)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingAudit(null)
                    handleDelete(viewingAudit)
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
