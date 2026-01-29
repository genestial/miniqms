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
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quality Objectives</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Objective
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {objectives.map((objective) => (
          <Card key={objective.id}>
            <CardHeader>
              <CardTitle>{objective.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {objective.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {objective.description}
                </p>
              )}
              {objective.measurement && (
                <p className="text-sm mb-1">
                  <strong>Measurement:</strong> {objective.measurement}
                </p>
              )}
              {objective.target && (
                <p className="text-sm">
                  <strong>Target:</strong> {objective.target}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {objectives.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No quality objectives yet. Add your first objective to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
