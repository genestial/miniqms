'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

interface Risk {
  id: string
  type: 'RISK' | 'OPPORTUNITY'
  description: string
  status: string
  impact: string | null
  likelihood: string | null
}

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
        <h1 className="text-3xl font-bold">Risks & Opportunities</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Risk/Opportunity
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {risks.map((risk) => (
          <Card key={risk.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {risk.type === 'RISK' ? 'Risk' : 'Opportunity'}
                </CardTitle>
                <Badge variant="outline">{risk.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{risk.description}</p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {risks.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No risks or opportunities yet. Add your first one to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
