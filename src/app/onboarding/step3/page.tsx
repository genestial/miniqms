'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RiskForm } from '@/components/forms/RiskForm'

export default function OnboardingStep3() {
  const router = useRouter()
  const [risks, setRisks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)

  const handleRiskSubmit = async (data: any) => {
    try {
      await fetch('/api/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const response = await fetch('/api/risks')
      const updated = await response.json()
      setRisks(updated)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create risk:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Add Initial Risks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add 3-5 risks or opportunities to get started. You can add more
            later.
          </p>

          {risks.length > 0 && (
            <div className="space-y-2">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className="p-3 border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">
                      {risk.type === 'RISK' ? 'Risk' : 'Opportunity'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {risk.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showForm && (
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              {risks.length === 0 ? 'Add First Risk/Opportunity' : 'Add Another'}
            </Button>
          )}

          {showForm && (
            <RiskForm
              onSubmit={handleRiskSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => router.push('/onboarding/step2')}
            >
              Previous
            </Button>
            <Button
              onClick={() => router.push('/onboarding/step4')}
              className="flex-1"
              disabled={risks.length < 3}
            >
              {risks.length < 3
                ? `Add ${3 - risks.length} more to continue`
                : 'Next: Record First Management Review'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
