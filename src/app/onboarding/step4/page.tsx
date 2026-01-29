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
        <CardContent>
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
