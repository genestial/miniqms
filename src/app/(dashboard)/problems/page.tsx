'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { ProblemForm } from '@/components/forms/ProblemForm'

interface Problem {
  id: string
  source: string
  description: string
  status: string
  dueDate: string | null
  dateIdentified: string
  rootCause: string | null
  fixDescription: string | null
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProblems()
  }, [])

  const fetchProblems = () => {
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
  }

  const handleProblemSubmit = async (data: {
    source: 'AUDIT' | 'CUSTOMER_ISSUE' | 'INTERNAL_ISSUE' | 'OTHER'
    description: string
    dateIdentified: string
    rootCause?: string
    fixDescription?: string
    responsibleId?: string
    dueDate?: string
    status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  }) => {
    try {
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API error response:', errorData)
        throw new Error(errorData.message || 'Failed to create problem')
      }

      // Refresh the list
      fetchProblems()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating problem:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create problem. Please try again.'
      alert(errorMessage)
    }
  }

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
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Log Problem
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Log New Problem or Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ProblemForm
              onSubmit={handleProblemSubmit}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <Card key={problem.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {problem.source.replace(/_/g, ' ')}
                </CardTitle>
                <Badge variant="outline">{problem.status.replace(/_/g, ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {problem.description}
              </p>
              {problem.rootCause && (
                <p className="text-xs text-muted-foreground mt-2">
                  <strong>Root Cause:</strong> {problem.rootCause}
                </p>
              )}
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

      {problems.length === 0 && !showForm && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No problems or improvements yet. Log your first one to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
