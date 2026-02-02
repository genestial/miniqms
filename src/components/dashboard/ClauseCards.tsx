'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ClauseCard } from '@/lib/compliance'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface ClauseCardsProps {
  cards: ClauseCard[]
}

export function ClauseCards({ cards }: ClauseCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCard = (clauseCode: string) => {
    const newExpanded = new Set(expandedCards)
    if (newExpanded.has(clauseCode)) {
      newExpanded.delete(clauseCode)
    } else {
      newExpanded.add(clauseCode)
    }
    setExpandedCards(newExpanded)
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'green':
        return 'success'
      case 'amber':
        return 'warning'
      case 'red':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="dashboard-section-title">Clause Readiness</h2>
      <div className="grid-cards">
        {cards.map((card) => (
          <Card key={card.clauseCode} className="dashboard-clause-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {card.clauseCode} - {card.clauseTitle}
                </CardTitle>
                <Badge variant={getStatusVariant(card.status)}>
                  {card.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted">
                {card.plainEnglishWhy}
              </p>

              {card.missingItems.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Missing Items:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted">
                    {card.missingItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {expandedCards.has(card.clauseCode) && (
                <div className="space-y-2 pt-2 border-t">
                  {card.fixLinks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Quick Actions:</p>
                      <div className="flex flex-wrap gap-2">
                        {card.fixLinks.map((link, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={link.href}>{link.label}</a>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCard(card.clauseCode)}
                className="w-full"
              >
                {expandedCards.has(card.clauseCode) ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show More
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
