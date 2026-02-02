'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
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
  responsibleId: string | null
  createdAt: string
  updatedAt: string
}

export default function ProblemDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProblem()
    }
  }, [id])

  const fetchProblem = async () => {
    try {
      const response = await fetch(`/api/problems?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to load problem')
      }
      const data = await response.json()
      setProblem(data)
    } catch (error) {
      console.error('Failed to load problem:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!problem) return
    if (!confirm(`Are you sure you want to delete this problem? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/problems?id=${problem.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete problem')
      }

      router.push('/problems')
    } catch (error) {
      console.error('Error deleting problem:', error)
      alert('Failed to delete problem. Please try again.')
    }
  }

  const handleUpdate = async (data: {
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: problem?.id,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update problem')
      }

      await fetchProblem()
      setEditing(false)
    } catch (error) {
      console.error('Error updating problem:', error)
      alert('Failed to update problem. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Problem not found</div>
        <Button onClick={() => router.push('/problems')} className="mt-4">
          Back to Problems
        </Button>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Button variant="outline" onClick={() => setEditing(false)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel Edit
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Edit Problem/Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ProblemForm
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              initialData={{
                source: problem.source as any,
                description: problem.description,
                dateIdentified: problem.dateIdentified.split('T')[0],
                rootCause: problem.rootCause || undefined,
                fixDescription: problem.fixDescription || undefined,
                responsibleId: problem.responsibleId || undefined,
                dueDate: problem.dueDate ? problem.dueDate.split('T')[0] : undefined,
                status: problem.status as any,
              }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push('/problems')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Problems
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => setEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">
              {problem.source.replace(/_/g, ' ')}
            </CardTitle>
            <Badge variant="outline">{problem.status.replace(/_/g, ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="mt-1 text-sm whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source</label>
              <p className="mt-1 text-sm">{problem.source.replace(/_/g, ' ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date Identified</label>
              <p className="mt-1 text-sm">
                {new Date(problem.dateIdentified).toLocaleDateString()}
              </p>
            </div>
            {problem.dueDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                <p className="mt-1 text-sm">
                  {new Date(problem.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {problem.responsibleId && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Responsible</label>
                <p className="mt-1 text-sm">{problem.responsibleId}</p>
              </div>
            )}
          </div>

          {problem.rootCause && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Root Cause</label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{problem.rootCause}</p>
            </div>
          )}

          {problem.fixDescription && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fix Description</label>
              <p className="mt-1 text-sm whitespace-pre-wrap">{problem.fixDescription}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="mt-1 text-sm">
                {new Date(problem.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="mt-1 text-sm">
                {new Date(problem.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
