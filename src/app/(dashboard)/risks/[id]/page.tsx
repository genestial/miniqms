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
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!risk) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Risk not found</div>
        <Button onClick={() => router.push('/risks')} className="mt-4">
          Back to Risks
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
            <CardTitle>Edit Risk/Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">
              {risk.type === 'RISK' ? 'Risk' : 'Opportunity'}
            </CardTitle>
            <Badge variant="outline">{risk.status.replace(/_/g, ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="mt-1 text-sm">{risk.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {risk.impact && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Impact</label>
                <p className="mt-1">
                  <Badge variant="secondary">{risk.impact}</Badge>
                </p>
              </div>
            )}
            {risk.likelihood && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Likelihood</label>
                <p className="mt-1">
                  <Badge variant="secondary">{risk.likelihood}</Badge>
                </p>
              </div>
            )}
          </div>

          {risk.treatmentNotes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Treatment Notes</label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{risk.treatmentNotes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1 text-sm">
                {new Date(risk.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1 text-sm">
                {new Date(risk.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
