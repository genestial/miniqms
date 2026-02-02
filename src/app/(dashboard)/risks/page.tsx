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
import { RiskForm } from '@/components/forms/RiskForm'

interface Risk {
  id: string
  type: 'RISK' | 'OPPORTUNITY'
  description: string
  status: string
  impact: string | null
  likelihood: string | null
  treatmentNotes: string | null
  createdAt: string
  updatedAt: string
}

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)
  const [viewingRisk, setViewingRisk] = useState<Risk | null>(null)

  useEffect(() => {
    fetchRisks()
  }, [])

  const fetchRisks = () => {
    fetch('/api/risks')
      .then((res) => res.json())
      .then((data) => {
        setRisks(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load risks:', error)
        setLoading(false)
      })
  }

  const handleRiskSubmit = async (data: {
    type: 'RISK' | 'OPPORTUNITY'
    description: string
    impact?: string
    likelihood?: string
    treatmentNotes?: string
    status?: string
  }) => {
    try {
      if (editingRisk) {
        const response = await fetch('/api/risks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingRisk.id,
            ...data,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update risk')
        }
      } else {
        const response = await fetch('/api/risks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create risk')
        }
      }

      fetchRisks()
      setShowForm(false)
      setEditingRisk(null)
    } catch (error) {
      console.error('Error saving risk:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save risk. Please try again.'
      alert(errorMessage)
    }
  }

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk)
    setShowForm(true)
  }

  const handleDelete = async (risk: Risk) => {
    if (!confirm(`Are you sure you want to delete this ${risk.type.toLowerCase()}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/risks?id=${risk.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete risk')
      }

      fetchRisks()
    } catch (error) {
      console.error('Error deleting risk:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete risk. Please try again.'
      alert(errorMessage)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingRisk(null)
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
        <h1 className="text-3xl font-bold">Risks & Opportunities</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Risk/Opportunity
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRisk ? 'Edit Risk/Opportunity' : 'Add New Risk or Opportunity'}</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskForm
              onSubmit={handleRiskSubmit}
              onCancel={handleCancel}
              initialData={editingRisk ? {
                type: editingRisk.type,
                description: editingRisk.description,
                impact: editingRisk.impact || undefined,
                likelihood: editingRisk.likelihood || undefined,
                treatmentNotes: editingRisk.treatmentNotes || undefined,
                status: editingRisk.status,
              } : undefined}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {risks.map((risk) => (
          <Card 
            key={risk.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setViewingRisk(risk)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {risk.type === 'RISK' ? 'Risk' : 'Opportunity'}
                </CardTitle>
                <Badge variant="outline">{risk.status.replace(/_/g, ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{risk.description}</p>
              {(risk.impact || risk.likelihood) && (
                <div className="mt-4 flex gap-2 text-xs">
                  {risk.impact && (
                    <Badge variant="secondary">Impact: {risk.impact}</Badge>
                  )}
                  {risk.likelihood && (
                    <Badge variant="secondary">
                      Likelihood: {risk.likelihood}
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(risk)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(risk)}
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

      {risks.length === 0 && !showForm && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No risks or opportunities yet. Add your first one to get started.
          </CardContent>
        </Card>
      )}

      <Dialog open={!!viewingRisk} onOpenChange={(open) => !open && setViewingRisk(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingRisk?.type === 'RISK' ? 'Risk' : 'Opportunity'}</DialogTitle>
            <DialogDescription>
              Risk/Opportunity Details
            </DialogDescription>
          </DialogHeader>
          {viewingRisk && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm">{viewingRisk.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {viewingRisk.impact && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Impact</label>
                    <p className="mt-1">
                      <Badge variant="secondary">{viewingRisk.impact}</Badge>
                    </p>
                  </div>
                )}
                {viewingRisk.likelihood && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Likelihood</label>
                    <p className="mt-1">
                      <Badge variant="secondary">{viewingRisk.likelihood}</Badge>
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="mt-1">
                    <Badge variant="outline">{viewingRisk.status.replace(/_/g, ' ')}</Badge>
                  </p>
                </div>
              </div>
              {viewingRisk.treatmentNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Treatment Notes</label>
                  <p className="mt-1 text-sm">{viewingRisk.treatmentNotes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingRisk.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingRisk.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setViewingRisk(null)
                  handleEdit(viewingRisk)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingRisk(null)
                    handleDelete(viewingRisk)
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
