'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Review {
  id: string
  reviewDate: string
  agendaItems: any
  decisions: any
  actions: any
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => res.json())
      .then((data) => {
        setReviews(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load reviews:', error)
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
        <h1 className="text-3xl font-bold">Management Reviews</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Review
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <CardTitle>
                Review - {new Date(review.reviewDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {review.agendaItems && Array.isArray(review.agendaItems) && (
                <p className="text-sm text-muted-foreground mb-2">
                  {review.agendaItems.length} agenda items
                </p>
              )}
              {review.decisions && Array.isArray(review.decisions) && (
                <p className="text-sm text-muted-foreground mb-2">
                  {review.decisions.length} decisions
                </p>
              )}
              {review.actions && Array.isArray(review.actions) && (
                <p className="text-sm text-muted-foreground">
                  {review.actions.length} actions
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No management reviews yet. Record your first review to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
