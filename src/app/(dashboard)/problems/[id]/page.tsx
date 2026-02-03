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
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="loading-container">
        <div className="loading-text">Problem not found</div>
        <Button onClick={() => router.push('/problems')} className="mt-4">
          Back to Problems
        </Button>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="detail-page-container">
        <Button variant="outline" onClick={() => setEditing(false)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel Edit
        </Button>
        <Card className="detail-card">
          <CardHeader className="detail-card-header">
            <CardTitle className="detail-page-title">Edit Problem/Improvement</CardTitle>
          </CardHeader>
          <CardContent className="detail-card-content">
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
    <div className="detail-page-container">
      <div className="detail-page-header">
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

      <Card className="detail-card">
        <CardHeader className="detail-card-header">
          <div className="flex items-center justify-between">
            <CardTitle className="detail-page-title">
              {problem.source.replace(/_/g, ' ')}
            </CardTitle>
            <Badge variant="outline" className="status-badge">{problem.status.replace(/_/g, ' ')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="detail-card-content detail-section">
          <div className="detail-field">
            <label className="detail-field-label">Description</label>
            <p className="detail-field-value whitespace-pre-wrap">{problem.description}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <label className="detail-field-label">Source</label>
              <p className="detail-field-value">{problem.source.replace(/_/g, ' ')}</p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Date Identified</label>
              <p className="detail-field-value">
                {new Date(problem.dateIdentified).toLocaleDateString()}
              </p>
            </div>
            {problem.dueDate && (
              <div className="detail-field">
                <label className="detail-field-label">Due Date</label>
                <p className="detail-field-value">
                  {new Date(problem.dueDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {problem.responsibleId && (
              <div className="detail-field">
                <label className="detail-field-label">Responsible</label>
                <p className="detail-field-value">{problem.responsibleId}</p>
              </div>
            )}
          </div>

          {problem.rootCause && (
            <div className="detail-field">
              <label className="detail-field-label">Root Cause</label>
              <p className="detail-field-value whitespace-pre-wrap">{problem.rootCause}</p>
            </div>
          )}

          {problem.fixDescription && (
            <div className="detail-field">
              <label className="detail-field-label">Fix Description</label>
              <p className="detail-field-value whitespace-pre-wrap">{problem.fixDescription}</p>
            </div>
          )}

          <div className="detail-grid detail-divider">
            <div className="detail-field">
              <label className="detail-field-label">Created</label>
              <p className="detail-field-value">
                {new Date(problem.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Last Updated</label>
              <p className="detail-field-value">
                {new Date(problem.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
