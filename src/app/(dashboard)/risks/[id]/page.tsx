'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
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

export default function RiskDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [risk, setRisk] = useState<Risk | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchRisk()
    }
  }, [id])

  const fetchRisk = async () => {
    try {
      const response = await fetch(`/api/risks?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to load risk')
      }
      const data = await response.json()
      setRisk(data)
    } catch (error) {
      console.error('Failed to load risk:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!risk) return
    if (!confirm(`Are you sure you want to delete this ${risk.type.toLowerCase()}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/risks?id=${risk.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete risk')
      }

      router.push('/risks')
    } catch (error) {
      console.error('Error deleting risk:', error)
      alert('Failed to delete risk. Please try again.')
    }
  }

  const handleUpdate = async (data: {
    type: 'RISK' | 'OPPORTUNITY'
    description: string
    impact?: string
    likelihood?: string
    treatmentNotes?: string
    status?: string
  }) => {
    try {
      const response = await fetch('/api/risks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: risk?.id,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update risk')
      }

      await fetchRisk()
      setEditing(false)
    } catch (error) {
      console.error('Error updating risk:', error)
      alert('Failed to update risk. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  if (!risk) {
    return (
      <div className="loading-container">
        <div className="loading-text">Risk not found</div>
        <Button onClick={() => router.push('/risks')} className="mt-4">
          Back to Risks
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
            <CardTitle className="detail-page-title">Edit Risk/Opportunity</CardTitle>
          </CardHeader>
          <CardContent className="detail-card-content">
            <RiskForm
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              initialData={{
                type: risk.type,
                description: risk.description,
                impact: risk.impact || undefined,
                likelihood: risk.likelihood || undefined,
                treatmentNotes: risk.treatmentNotes || undefined,
                status: risk.status,
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
        <Button variant="outline" onClick={() => router.push('/risks')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Risks
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
            <CardTitle className="detail-page-title">
              {risk.type === 'RISK' ? 'Risk' : 'Opportunity'}
            </CardTitle>
            <Badge variant="outline" className="status-badge">{risk.status.replace(/_/g, ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="detail-card-content detail-section">
          <div className="detail-field">
            <label className="detail-field-label">Description</label>
            <p className="detail-field-value">{risk.description}</p>
          </div>

          <div className="detail-grid">
            {risk.impact && (
              <div className="detail-field">
                <label className="detail-field-label">Impact</label>
                <p className="mt-1">
                  <Badge variant="secondary">{risk.impact}</Badge>
                </p>
              </div>
            )}
            {risk.likelihood && (
              <div className="detail-field">
                <label className="detail-field-label">Likelihood</label>
                <p className="mt-1">
                  <Badge variant="secondary">{risk.likelihood}</Badge>
                </p>
              </div>
            )}
          </div>

          {risk.treatmentNotes && (
            <div className="detail-field">
              <label className="detail-field-label">Treatment Notes</label>
              <p className="detail-field-value whitespace-pre-wrap">{risk.treatmentNotes}</p>
            </div>
          )}

          <div className="detail-grid detail-divider">
            <div className="detail-field">
              <label className="detail-field-label">Created</label>
              <p className="detail-field-value">
                {new Date(risk.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Last Updated</label>
              <p className="detail-field-value">
                {new Date(risk.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
