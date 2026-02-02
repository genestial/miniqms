'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface ReadinessSummaryProps {
  percentage: number
  greenCount: number
  amberCount: number
  redCount: number
  totalClauses: number
}

export function ReadinessSummary({
  percentage,
  greenCount,
  amberCount,
  redCount,
  totalClauses,
}: ReadinessSummaryProps) {
  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header">
        <CardTitle className="dashboard-card-title">ISO 9001 Readiness</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-card-content space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">
              {greenCount} of {totalClauses} clauses ready
            </span>
          </div>
          <Progress value={percentage} />
        </div>

        <div className="flex gap-4">
          <div className="badge-with-count">
            <Badge variant="success">Green</Badge>
            <span className="badge-count">{greenCount}</span>
          </div>
          <div className="badge-with-count">
            <Badge variant="warning">Amber</Badge>
            <span className="badge-count">{amberCount}</span>
          </div>
          <div className="badge-with-count">
            <Badge variant="destructive">Red</Badge>
            <span className="badge-count">{redCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
