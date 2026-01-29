'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

interface Problem {
  id: string
  source: string
  description: string
  status: string
  dueDate: string | null
  dateIdentified: string
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/problems')
      .then((res) => res.json())
      .then((data) => {
        setProblems(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load problems:', error)
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
        <h1 className="text-3xl font-bold">Problems & Improvements</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Log Problem
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <Card key={problem.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {problem.source.replace('_', ' ')}
                </CardTitle>
                <Badge variant="outline">{problem.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {problem.description}
              </p>
              <div className="mt-4 text-xs text-muted-foreground">
                Identified: {new Date(problem.dateIdentified).toLocaleDateString()}
                {problem.dueDate && (
                  <div>Due: {new Date(problem.dueDate).toLocaleDateString()}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {problems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No problems or improvements yet. Log your first one to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
