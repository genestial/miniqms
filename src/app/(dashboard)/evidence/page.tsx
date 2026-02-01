'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { EvidenceForm } from '@/components/forms/EvidenceForm'

interface Evidence {
  id: string
  title: string
  type: string
  status: string
  sourceType: string
  storageKey?: string | null
  externalUrl?: string | null
}

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchEvidence()
  }, [])

  const fetchEvidence = () => {
    fetch('/api/evidence')
      .then((res) => res.json())
      .then((data) => {
        setEvidence(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load evidence:', error)
        setLoading(false)
      })
  }

  const handleEvidenceSubmit = async (data: {
    title: string
    type: 'POLICY' | 'PROCEDURE' | 'RECORD' | 'TEMPLATE' | 'OTHER'
    sourceType: 'UPLOAD' | 'LINK' | 'GENERATED'
    file?: File
    externalUrl?: string
    ownerId?: string
  }) => {
    try {
      if (data.sourceType === 'UPLOAD' && data.file) {
        // Upload file first
        const formData = new FormData()
        formData.append('file', data.file)
        formData.append('title', data.title)
        formData.append('type', data.type)
        formData.append('sourceType', data.sourceType)
        if (data.ownerId) {
          formData.append('ownerId', data.ownerId)
        }

        const uploadResponse = await fetch('/api/evidence/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to upload evidence')
        }
      } else if (data.sourceType === 'LINK' && data.externalUrl) {
        // Create evidence with external URL
        const response = await fetch('/api/evidence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            type: data.type,
            sourceType: data.sourceType,
            externalUrl: data.externalUrl,
            ownerId: data.ownerId,
            status: 'DRAFT',
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create evidence')
        }
      } else if (data.sourceType === 'GENERATED') {
        // Create evidence record for generated content
        const response = await fetch('/api/evidence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            type: data.type,
            sourceType: data.sourceType,
            ownerId: data.ownerId,
            status: 'DRAFT',
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create evidence')
        }
      } else {
        throw new Error('Invalid source type or missing file/URL')
      }

      // Refresh the list
      fetchEvidence()
      setShowForm(false)
    } catch (error) {
      console.error('Error creating evidence:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create evidence. Please try again.'
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
        <h1 className="text-3xl font-bold">Evidence Register</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Evidence
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Evidence</CardTitle>
          </CardHeader>
          <CardContent>
            <EvidenceForm
              onSubmit={handleEvidenceSubmit}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {evidence.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <Badge variant="outline">{item.status.replace(/_/g, ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">{item.type}</Badge>
                <Badge variant="secondary">{item.sourceType.replace(/_/g, ' ')}</Badge>
                {item.externalUrl && (
                  <div className="text-xs">
                    <a
                      href={item.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View External Link →
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {evidence.length === 0 && !showForm && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No evidence yet. Add your first evidence item to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
