'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RiskFormProps {
  onSubmit: (data: {
    type: 'RISK' | 'OPPORTUNITY'
    description: string
    impact?: string
    likelihood?: string
    treatmentNotes?: string
    status?: string
  }) => Promise<void>
  onCancel: () => void
  initialData?: {
    type?: 'RISK' | 'OPPORTUNITY'
    description?: string
    impact?: string
    likelihood?: string
    treatmentNotes?: string
    status?: string
  }
}

export function RiskForm({ onSubmit, onCancel, initialData }: RiskFormProps) {
  const [type, setType] = useState<'RISK' | 'OPPORTUNITY'>(
    initialData?.type || 'RISK'
  )
  const [description, setDescription] = useState(initialData?.description || '')
  const [impact, setImpact] = useState(initialData?.impact || '')
  const [likelihood, setLikelihood] = useState(initialData?.likelihood || '')
  const [treatmentNotes, setTreatmentNotes] = useState(
    initialData?.treatmentNotes || ''
  )
  const [status, setStatus] = useState(initialData?.status || 'OPEN')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        type,
        description,
        impact: impact || undefined,
        likelihood: likelihood || undefined,
        treatmentNotes: treatmentNotes || undefined,
        status,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Risk/Opportunity' : 'Add Risk/Opportunity'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RISK">Risk</SelectItem>
                <SelectItem value="OPPORTUNITY">Opportunity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="impact">Impact</Label>
              <Select value={impact} onValueChange={setImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="likelihood">Likelihood</Label>
              <Select value={likelihood} onValueChange={setLikelihood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select likelihood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="treatmentNotes">Treatment/Mitigation Notes</Label>
            <Textarea
              id="treatmentNotes"
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="MANAGED">Managed</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
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
