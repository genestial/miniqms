'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProcess, setEditingProcess] = useState<Process | null>(null)
  const [viewingProcess, setViewingProcess] = useState<Process | null>(null)

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

  const handleEdit = (process: Process) => {
    setEditingProcess(process)
    setShowForm(true)
  }

  const handleDelete = async (process: Process) => {
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
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Process Register</h1>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {processes.map((process) => (
          <Card 
            key={process.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setViewingProcess(process)}
          >
            <CardHeader>
              <CardTitle>{process.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {process.description || 'No description'}
              </p>
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(process)}
                  className="flex-1"
                >
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(process)}
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

      {processes.length === 0 && !showForm && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No processes yet. Add your first process to get started.
          </CardContent>
        </Card>
      )}

      <Dialog open={!!viewingProcess} onOpenChange={(open) => !open && setViewingProcess(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingProcess?.name}</DialogTitle>
            <DialogDescription>
              Process Details
            </DialogDescription>
          </DialogHeader>
          {viewingProcess && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm">
                  {viewingProcess.description || 'No description'}
                </p>
              </div>
              {viewingProcess.inputs && Array.isArray(viewingProcess.inputs) && viewingProcess.inputs.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Inputs</label>
                  <ul className="mt-1 text-sm list-disc list-inside">
                    {viewingProcess.inputs.map((input: string, idx: number) => (
                      <li key={idx}>{input}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewingProcess.outputs && Array.isArray(viewingProcess.outputs) && viewingProcess.outputs.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Outputs</label>
                  <ul className="mt-1 text-sm list-disc list-inside">
                    {viewingProcess.outputs.map((output: string, idx: number) => (
                      <li key={idx}>{output}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingProcess.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="mt-1 text-sm">
                    {new Date(viewingProcess.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => {
                  setViewingProcess(null)
                  handleEdit(viewingProcess)
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingProcess(null)
                    handleDelete(viewingProcess)
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
