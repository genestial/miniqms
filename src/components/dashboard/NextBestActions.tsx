'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NextBestAction } from '@/lib/actions'
import { ArrowRight, Clock } from 'lucide-react'

interface NextBestActionsProps {
  actions: NextBestAction[]
}

export function NextBestActions({ actions }: NextBestActionsProps) {
  if (actions.length === 0) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="dashboard-title">What To Do Next</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted">
            Great job! No immediate actions needed.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="dashboard-title">What To Do Next</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="dashboard-action-item"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{action.clauseCode}</Badge>
                  <span className="text-sm font-medium">{action.clauseTitle}</span>
                </div>
                <p className="text-muted">
                  {action.description}
                </p>
                <div className="flex items-center gap-2 text-muted-small">
                  <Clock className="h-3 w-3" />
                  <span>{action.estimatedTime}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={action.ctaLink}>
                  Take Action
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
