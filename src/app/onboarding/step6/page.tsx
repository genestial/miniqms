'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function OnboardingStep6() {
  const router = useRouter()
  const [clauses, setClauses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/clauses')
      .then((res) => res.json())
      .then((data) => {
        setClauses(data)
        setLoading(false)
      })
  }, [])

  const handleComplete = () => {
    router.push('/dashboard')
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 6: Clause Applicability (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Review ISO 9001 clauses and mark any as not applicable if they
            don't apply to your organization. You can skip this step and
            configure later.
          </p>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {clauses.map((clause) => (
              <div
                key={clause.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    {clause.code} - {clause.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {clause.plainEnglish}
                  </div>
                </div>
                <Badge variant="success">Applicable</Badge>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/onboarding/step5')}
            >
              Previous
            </Button>
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button type="button" onClick={handleComplete} className="flex-1">
              Complete Onboarding
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
