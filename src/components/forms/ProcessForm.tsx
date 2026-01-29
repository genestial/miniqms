'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProcessFormProps {
  onSubmit: (data: {
    name: string
    description?: string
    inputs?: string[]
    outputs?: string[]
  }) => Promise<void>
  onCancel: () => void
  initialData?: {
    name?: string
    description?: string
    inputs?: any
    outputs?: any
  }
}

export function ProcessForm({ onSubmit, onCancel, initialData }: ProcessFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [inputs, setInputs] = useState(
    Array.isArray(initialData?.inputs) 
      ? initialData.inputs.join('\n') 
      : ''
  )
  const [outputs, setOutputs] = useState(
    Array.isArray(initialData?.outputs) 
      ? initialData.outputs.join('\n') 
      : ''
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        name,
        description: description || undefined,
        inputs: inputs ? inputs.split('\n').filter(Boolean) : undefined,
        outputs: outputs ? outputs.split('\n').filter(Boolean) : undefined,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Process' : 'Add Process'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Process Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="inputs">Inputs (one per line)</Label>
            <Textarea
              id="inputs"
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              rows={3}
              placeholder="Input 1&#10;Input 2"
            />
          </div>

          <div>
            <Label htmlFor="outputs">Outputs (one per line)</Label>
            <Textarea
              id="outputs"
              value={outputs}
              onChange={(e) => setOutputs(e.target.value)}
              rows={3}
              placeholder="Output 1&#10;Output 2"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
