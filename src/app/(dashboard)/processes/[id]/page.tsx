'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
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

export default function ProcessDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [process, setProcess] = useState<Process | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProcess()
    }
  }, [id])

  const fetchProcess = async () => {
    try {
      const response = await fetch(`/api/processes?id=${id}`)
      if (!response.ok) {
        throw new Error('Failed to load process')
      }
      const data = await response.json()
      setProcess(data)
    } catch (error) {
      console.error('Failed to load process:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!process) return
    if (!confirm(`Are you sure you want to delete "${process.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/processes?id=${process.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete process')
      }

      router.push('/processes')
    } catch (error) {
      console.error('Error deleting process:', error)
      alert('Failed to delete process. Please try again.')
    }
  }

  const handleUpdate = async (data: {
    name: string
    description?: string
    inputs?: string[]
    outputs?: string[]
  }) => {
    try {
      const response = await fetch('/api/processes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: process?.id,
          ...data,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update process')
      }

      await fetchProcess()
      setEditing(false)
    } catch (error) {
      console.error('Error updating process:', error)
      alert('Failed to update process. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  if (!process) {
    return (
      <div className="loading-container">
        <div className="loading-text">Process not found</div>
        <Button onClick={() => router.push('/processes')} className="mt-4">
          Back to Processes
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
        <ProcessForm
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          initialData={{
            name: process.name,
            description: process.description || undefined,
            inputs: process.inputs,
            outputs: process.outputs,
          }}
        />
      </div>
    )
  }

  return (
    <div className="detail-page-container">
      <div className="detail-page-header">
        <Button variant="outline" onClick={() => router.push('/processes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Processes
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
          <CardTitle className="detail-page-title">{process.name}</CardTitle>
        </CardHeader>
        <CardContent className="detail-card-content detail-section">
          <div className="detail-field">
            <label className="detail-field-label">Description</label>
            <p className="detail-field-value">
              {process.description || 'No description'}
            </p>
          </div>

          {process.inputs && Array.isArray(process.inputs) && process.inputs.length > 0 && (
            <div className="detail-field">
              <label className="detail-field-label">Inputs</label>
              <ul className="detail-field-value list-disc list-inside">
                {process.inputs.map((input: string, idx: number) => (
                  <li key={idx}>{input}</li>
                ))}
              </ul>
            </div>
          )}

          {process.outputs && Array.isArray(process.outputs) && process.outputs.length > 0 && (
            <div className="detail-field">
              <label className="detail-field-label">Outputs</label>
              <ul className="detail-field-value list-disc list-inside">
                {process.outputs.map((output: string, idx: number) => (
                  <li key={idx}>{output}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="detail-grid detail-divider">
            <div className="detail-field">
              <label className="detail-field-label">Created</label>
              <p className="detail-field-value">
                {new Date(process.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="detail-field">
              <label className="detail-field-label">Last Updated</label>
              <p className="detail-field-value">
                {new Date(process.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
