'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
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

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
  const [viewingProblem, setViewingProblem] = useState<Problem | null>(null)

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
      if (editingProblem) {
        const response = await fetch('/api/problems', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProblem.id,
            ...data,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update problem')
        }
      } else {
        const response = await fetch('/api/problems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create problem')
        }
      }

      fetchProblems()
      setShowForm(false)
      setEditingProblem(null)
    } catch (error) {
      console.error('Error saving problem:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save problem. Please try again.'
      alert(errorMessage)
    }
  }

  const handleEdit = (problem: Problem) => {
    setEditingProblem(problem)
    setShowForm(true)
  }

  const handleDelete = async (problem: Problem) => {
    if (!confirm(`Are you sure you want to delete this problem? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/problems?id=${problem.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete problem')
      }

      fetchProblems()
    } catch (error) {
      console.error('Error deleting problem:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete problem. Please try again.'
      alert(errorMessage)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProblem(null)
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
            <CardTitle>{editingProblem ? 'Edit Problem/Improvement' : 'Log New Problem or Improvement'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ProblemForm
              onSubmit={handleProblemSubmit}
              onCancel={handleCancel}
              initialData={editingProblem ? {
                source: editingProblem.source as any,
                description: editingProblem.description,
                dateIdentified: editingProblem.dateIdentified.split('T')[0],
                rootCause: editingProblem.rootCause || undefined,
                fixDescription: editingProblem.fixDescription || undefined,
                responsibleId: editingProblem.responsibleId || undefined,
                dueDate: editingProblem.dueDate ? editingProblem.dueDate.split('T')[0] : undefined,
                status: editingProblem.status as any,
              } : undefined}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <Card 
            key={problem.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setViewingProblem(problem)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {problem.source.replace(/_/g, ' ')}
                </CardTitle>
                <Badge variant="outline">{problem.status.replace(/_/g, ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {problem.description}
              </p>
              {problem.rootCause && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                  <strong>Root Cause:</strong> {problem.rootCause}
                </p>
              )}
              <div className="mt-4 text-xs text-muted-foreground">
                Identified: {new Date(problem.dateIdentified).toLocaleDateString()}
                {problem.dueDate && (
                  <div>Due: {new Date(problem.dueDate).toLocaleDateString()}</div>
                )}
              </div>
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(problem)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(problem)}
                  className="flex-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
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

      <Dialog open={!!viewingProblem} onOpenChange={(open) => !open && setViewingProblem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingProblem?.source.replace(/_/g, ' ')}</DialogTitle>
            <DialogDescription>
              Problem/Improvement Details
            </DialogDescription>
          </DialogHeader>
          {viewingProblem && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm">{viewingProblem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Source</label>
                  <p className="mt-1 text-sm">{viewingProblem.source.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="mt-1">
                    <Badge variant="outline">{viewingProblem.status.replace(/_/g, ' ')}</Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date Identified</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingProblem.dateIdentified).toLocaleDateString()}
                  </p>
                </div>
                {viewingProblem.dueDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                    <p className="mt-1 text-sm">
                      {new Date(viewingProblem.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {viewingProblem.rootCause && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Root Cause</label>
                  <p className="mt-1 text-sm">{viewingProblem.rootCause}</p>
                </div>
              )}
              {viewingProblem.fixDescription && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fix Description</label>
                  <p className="mt-1 text-sm">{viewingProblem.fixDescription}</p>
                </div>
              )}
              {viewingProblem.responsibleId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Responsible</label>
                  <p className="mt-1 text-sm">{viewingProblem.responsibleId}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingProblem.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingProblem.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setViewingProblem(null)
                  handleEdit(viewingProblem)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingProblem(null)
                    handleDelete(viewingProblem)
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
