'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function OnboardingStep4() {
  const router = useRouter()
  const [reviewDate, setReviewDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [attendees, setAttendees] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const attendeeList = attendees
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean)

      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewDate,
          agendaItems: [],
          decisions: [],
          actions: [],
        }),
      })

      // Create attendees
      for (const name of attendeeList) {
        // In a real implementation, you'd create review attendees
        // For now, we'll just create the review
      }

      router.push('/onboarding/step5')
    } catch (error) {
      console.error('Failed to create review:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 4: Record First Management Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Record your first management review meeting. This demonstrates
              leadership commitment to quality.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h3 className="font-medium text-sm mb-2">What is a Management Review?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                A Management Review is a formal meeting where leadership evaluates your Quality Management System (QMS). 
                It's an opportunity to review performance, discuss issues, make decisions, and ensure your QMS is working effectively.
              </p>
              <h4 className="font-medium text-xs mb-1">How often should it take place?</h4>
              <p className="text-xs text-muted-foreground">
                <strong>Recommended frequency:</strong> At least once per year, but many organizations conduct them quarterly or monthly. 
                For ISO 9001 compliance, annual reviews are the minimum requirement. More frequent reviews (quarterly) help you stay on top of issues and make continuous improvements.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="reviewDate">Review Date *</Label>
              <Input
                id="reviewDate"
                type="date"
                value={reviewDate}
                onChange={(e) => setReviewDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="attendees">
                Attendees (comma-separated, optional)
              </Label>
              <Input
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="John Doe, Jane Smith"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/onboarding/step3')}
              >
                Previous
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Next: Upload Quality Policy'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
