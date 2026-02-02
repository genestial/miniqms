'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { ProcessForm } from '@/components/forms/ProcessForm'

interface Process {
  id: string
  name: string
  description: string | null
  ownerId: string | null
  inputs?: any
  outputs?: any
  createdAt: string
  updatedAt: string
}

export default function ProcessesPage() {
  const router = useRouter()
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = () => {
    fetch('/api/processes')
      .then((res) => res.json())
      .then((data) => {
        setProcesses(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load processes:', error)
        setLoading(false)
      })
  }

  const handleProcessSubmit = async (data: {
    name: string
    description?: string
    inputs?: string[]
    outputs?: string[]
  }) => {
    try {
      if (editingProcess) {
        const response = await fetch('/api/processes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingProcess.id,
            ...data,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update process')
        }
      } else {
        const response = await fetch('/api/processes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create process')
        }
      }

      fetchProcesses()
      setShowForm(false)
      setEditingProcess(null)
    } catch (error) {
      console.error('Error saving process:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save process. Please try again.'
      alert(errorMessage)
    }
  }

  const handleEdit = (process: Process, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingProcess(process)
    setShowForm(true)
  }

  const handleDelete = async (process: Process, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Are you sure you want to delete "${process.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/processes?id=${process.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete process')
      }

      fetchProcesses()
    } catch (error) {
      console.error('Error deleting process:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete process. Please try again.'
      alert(errorMessage)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProcess(null)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Process Register</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Process
          </Button>
        )}
      </div>

      {showForm && (
        <ProcessForm
          onSubmit={handleProcessSubmit}
          onCancel={handleCancel}
          initialData={editingProcess ? {
            name: editingProcess.name,
            description: editingProcess.description || undefined,
            inputs: editingProcess.inputs,
            outputs: editingProcess.outputs,
          } : undefined}
        />
      )}

      <div className="grid-cards">
        {processes.map((process) => (
          <Card 
            key={process.id}
            className="card-item"
            onClick={() => router.push(`/processes/${process.id}`)}
          >
            <CardHeader>
              <CardTitle className="card-item-title">{process.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="card-item-description-clamp">
                {process.description || 'No description'}
              </p>
              <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEdit(process, e)}
                  className="action-button"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDelete(process, e)}
                  className="action-button-destructive"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {processes.length === 0 && !showForm && (
        <Card>
          <CardContent className="empty-state">
            No processes yet. Add your first process to get started.
          </CardContent>
        </Card>
      )}

    </div>
  )
}
