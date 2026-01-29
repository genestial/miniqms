'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

interface Evidence {
  id: string
  title: string
  type: string
  status: string
  sourceType: string
}

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        <h1 className="text-3xl font-bold">Evidence Register</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Evidence
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {evidence.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <Badge variant="outline">{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">{item.type}</Badge>
                <Badge variant="secondary">{item.sourceType}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {evidence.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No evidence yet. Add your first evidence item to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
