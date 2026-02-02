'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Objective {
  id: string
  name: string
  description: string | null
  measurement: string | null
  target: string | null
}

export default function ObjectivesPage() {
  const [objectives, setObjectives] = useState<Objective[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/objectives')
      .then((res) => res.json())
      .then((data) => {
        setObjectives(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load objectives:', error)
        setLoading(false)
      })
  }, [])

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
        <h1 className="page-title">Quality Objectives</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Objective
        </Button>
      </div>

      <div className="grid-cards">
        {objectives.map((objective) => (
          <Card key={objective.id}>
            <CardHeader>
              <CardTitle>{objective.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {objective.description && (
                <p className="text-muted mb-2">
                  {objective.description}
                </p>
              )}
              {objective.measurement && (
                <p className="text-muted mb-1">
                  <strong>Measurement:</strong> {objective.measurement}
                </p>
              )}
              {objective.target && (
                <p className="text-muted">
                  <strong>Target:</strong> {objective.target}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {objectives.length === 0 && (
        <Card>
          <CardContent className="empty-state">
            No quality objectives yet. Add your first objective to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
