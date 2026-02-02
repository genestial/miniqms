'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  const router = useRouter()
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null)

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

  const handleEdit = (risk: Risk, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingRisk(risk)
    setShowForm(true)
  }

  const handleDelete = async (risk: Risk, e: React.MouseEvent) => {
    e.stopPropagation()
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
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Risks & Opportunities</h1>
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

      <div className="grid-cards">
        {risks.map((risk) => (
          <Card 
            key={risk.id}
            className="card-item"
            onClick={() => router.push(`/risks/${risk.id}`)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {risk.type === 'RISK' ? 'Risk' : 'Opportunity'}
                </CardTitle>
                <Badge variant="outline" className="status-badge">{risk.status.replace(/_/g, ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="card-item-description-clamp">{risk.description}</p>
              {(risk.impact || risk.likelihood) && (
                <div className="badge-group-inline">
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
              <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEdit(risk, e)}
                  className="action-button"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDelete(risk, e)}
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

      {risks.length === 0 && !showForm && (
        <Card>
          <CardContent className="empty-state">
            No risks or opportunities yet. Add your first one to get started.
          </CardContent>
        </Card>
      )}

    </div>
  )
}
