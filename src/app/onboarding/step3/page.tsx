'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RiskForm } from '@/components/forms/RiskForm'
import { getRiskExamples, getIndustries, type RiskExample } from '@/lib/risk-examples'

export default function OnboardingStep3() {
  const router = useRouter()
  const [risks, setRisks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<string>('General Business')
  const [showExamples, setShowExamples] = useState(false)
  const [examples, setExamples] = useState<RiskExample[]>([])
  const [selectedExample, setSelectedExample] = useState<RiskExample | null>(null)
  
  useEffect(() => {
    // Try to get industry from company profile
    fetch('/api/company/profile')
      .then((res) => res.json())
      .then((profile) => {
        if (profile?.industry) {
          const industries = getIndustries()
          // Try to match industry, or use General Business
          const matched = industries.find((ind) => 
            ind.toLowerCase().includes(profile.industry.toLowerCase()) ||
            profile.industry.toLowerCase().includes(ind.toLowerCase().split('/')[0])
          )
          if (matched) {
            setSelectedIndustry(matched)
          }
        }
        setExamples(getRiskExamples(selectedIndustry))
      })
      .catch(() => {
        setExamples(getRiskExamples(selectedIndustry))
      })
  }, [selectedIndustry])

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

  const handleUseExample = (example: RiskExample) => {
    setSelectedExample(example)
    setShowForm(true)
    setShowExamples(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 3: Add Initial Risks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Add 3-5 risks or opportunities to get started. You can add more
              later.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>What is a risk?</strong> Something that could go wrong and affect your business quality or goals.
              <br />
              <strong>What is an opportunity?</strong> Something positive you could pursue to improve your business.
            </p>
          </div>

          {!showForm && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">Need help? See examples by industry:</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExamples(!showExamples)}
                >
                  {showExamples ? 'Hide Examples' : 'Show Examples'}
                </Button>
              </div>
              
              {showExamples && (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs mb-2 block">Select your industry:</Label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      {getIndustries().map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium">Example risks for {selectedIndustry}:</p>
                    {examples.slice(0, 3).map((example, idx) => (
                      <div
                        key={idx}
                        className="p-3 border rounded-md bg-background cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleUseExample(example)}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <Badge variant={example.type === 'RISK' ? 'destructive' : 'default'}>
                            {example.type === 'RISK' ? 'Risk' : 'Opportunity'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Impact: {example.impact} | Likelihood: {example.likelihood}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{example.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Treatment: {example.treatmentNotes}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          Click to use this example
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
                  onSubmit={async (data) => {
                    await handleRiskSubmit(data)
                    setSelectedExample(null) // Clear after submission
                  }}
                  onCancel={() => {
                    setShowForm(false)
                    setSelectedExample(null)
                  }}
                  exampleData={selectedExample || undefined}
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
