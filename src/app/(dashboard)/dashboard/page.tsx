'use client'

import { useEffect, useState } from 'react'
import { ReadinessSummary } from '@/components/dashboard/ReadinessSummary'
import { ClauseCards } from '@/components/dashboard/ClauseCards'
import { NextBestActions } from '@/components/dashboard/NextBestActions'
import { AttentionNeeded } from '@/components/dashboard/AttentionNeeded'
import { EmptyDashboardState } from '@/components/dashboard/EmptyDashboardState'
import type { ClauseCard } from '@/lib/compliance'
import type { NextBestAction } from '@/lib/actions'

interface DashboardData {
  percentage: number
  greenCount: number
  amberCount: number
  redCount: number
  totalClauses: number
  clauseCards: ClauseCard[]
  nextActions: NextBestAction[]
  attentionItems: Array<{
    id: string
    type: 'overdue' | 'pending_approval'
    title: string
    description: string
    dueDate?: string
    link: string
  }>
  isEmpty: boolean
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load dashboard:', error)
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

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-destructive">
          Failed to load dashboard data
        </div>
      </div>
    )
  }

  if (data.isEmpty) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <EmptyDashboardState
          onResumeOnboarding={() => {
            window.location.href = '/onboarding'
          }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <ReadinessSummary
        percentage={data.percentage}
        greenCount={data.greenCount}
        amberCount={data.amberCount}
        redCount={data.redCount}
        totalClauses={data.totalClauses}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ClauseCards cards={data.clauseCards} />
        </div>
        <div className="space-y-6">
          <NextBestActions actions={data.nextActions} />
          <AttentionNeeded
            items={data.attentionItems.map((item) => ({
              ...item,
              dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
