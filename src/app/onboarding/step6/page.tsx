'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function OnboardingStep6() {
  const router = useRouter()
  const [clauses, setClauses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [nonApplicableClauses, setNonApplicableClauses] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/clauses')
      .then((res) => res.json())
      .then((data) => {
        setClauses(data)
        setLoading(false)
      })
  }, [])

  const handleToggleApplicability = (clauseId: string) => {
    setNonApplicableClauses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(clauseId)) {
        newSet.delete(clauseId)
      } else {
        newSet.add(clauseId)
      }
      return newSet
    })
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Save non-applicable clauses to tenant clause scope
      for (const clauseId of nonApplicableClauses) {
        await fetch('/api/clauses/scope', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clauseId,
            applicable: false,
          }),
        })
      }
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to save clause applicability:', error)
      router.push('/dashboard') // Still redirect even if save fails
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    try {
      await fetch('/api/onboarding/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'Clause Applicability',
          reason: 'Clause applicability review was skipped. You can configure this later in Settings.',
        }),
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to skip step:', error)
      router.push('/dashboard') // Still redirect even if API call fails
    }
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
            {clauses.map((clause) => {
              const isNonApplicable = nonApplicableClauses.has(clause.id)
              return (
                <div
                  key={clause.id}
                  className={`p-3 border rounded-lg flex justify-between items-start gap-4 ${
                    isNonApplicable ? 'bg-muted/50 opacity-75' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {clause.code} - {clause.title}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {clause.plainEnglish}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`clause-${clause.id}`}
                        checked={isNonApplicable}
                        onCheckedChange={() => handleToggleApplicability(clause.id)}
                      />
                      <Label
                        htmlFor={`clause-${clause.id}`}
                        className="text-xs cursor-pointer"
                      >
                        Mark as not applicable
                      </Label>
                    </div>
                  </div>
                  <Badge variant={isNonApplicable ? 'secondary' : 'default'}>
                    {isNonApplicable ? 'Not Applicable' : 'Applicable'}
                  </Badge>
                </div>
              )
            })}
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
