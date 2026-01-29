'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Clock } from 'lucide-react'

interface AttentionItem {
  id: string
  type: 'overdue' | 'pending_approval'
  title: string
  description: string
  dueDate?: Date
  link: string
}

interface AttentionNeededProps {
  items: AttentionItem[]
}

export function AttentionNeeded({ items }: AttentionNeededProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attention Needed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No items requiring immediate attention.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attention Needed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <Badge
                    variant={item.type === 'overdue' ? 'destructive' : 'warning'}
                  >
                    {item.type === 'overdue' ? 'Overdue' : 'Pending Approval'}
                  </Badge>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                {item.dueDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Due: {formatDate(item.dueDate)}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={item.link}>View</a>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
