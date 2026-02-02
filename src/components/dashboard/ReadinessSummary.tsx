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
      <CardHeader>
        <CardTitle className="dashboard-title">ISO 9001 Readiness</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-content">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="dashboard-stat-large">{percentage}%</span>
            <span className="dashboard-stat-label">
              {greenCount} of {totalClauses} clauses ready
            </span>
          </div>
          <Progress value={percentage} />
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="success">Green</Badge>
            <span className="text-sm">{greenCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">Amber</Badge>
            <span className="text-sm">{amberCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">Red</Badge>
            <span className="text-sm">{redCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
