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
    <Card>
      <CardHeader>
        <CardTitle>ISO 9001 Readiness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="text-sm text-muted-foreground">
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
