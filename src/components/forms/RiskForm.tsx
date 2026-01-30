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
import { HelpCircle } from 'lucide-react'

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

export function RiskForm({ onSubmit, onCancel, initialData, exampleData }: RiskFormProps) {
  // Use example data if provided, otherwise use initial data
  const defaultType = exampleData?.type || initialData?.type || 'RISK'
  const defaultDescription = exampleData?.description || initialData?.description || ''
  const defaultImpact = exampleData?.impact || initialData?.impact || ''
  const defaultLikelihood = exampleData?.likelihood || initialData?.likelihood || ''
  const defaultTreatmentNotes = exampleData?.treatmentNotes || initialData?.treatmentNotes || ''

  const [type, setType] = useState<'RISK' | 'OPPORTUNITY'>(defaultType)
  const [description, setDescription] = useState(defaultDescription)
  const [impact, setImpact] = useState(defaultImpact)
  const [likelihood, setLikelihood] = useState(defaultLikelihood)
  const [treatmentNotes, setTreatmentNotes] = useState(defaultTreatmentNotes)
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
            <Label htmlFor="type" className="flex items-center gap-2">
              Type *
              <span className="text-xs text-muted-foreground font-normal">
                (Risk = something bad that might happen, Opportunity = something good you could pursue)
              </span>
            </Label>
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
            <Label htmlFor="description" className="flex items-center gap-2">
              Description *
              <span className="text-xs text-muted-foreground font-normal">
                (Plain English: What is the risk or opportunity? e.g., "Key employee might leave")
              </span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the risk or opportunity in plain English..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="impact" className="flex items-center gap-2">
                Impact
                <span className="text-xs text-muted-foreground font-normal">
                  (How serious would this be? Low/Medium/High)
                </span>
              </Label>
              <Select value={impact} onValueChange={setImpact}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - Minor impact</SelectItem>
                  <SelectItem value="Medium">Medium - Moderate impact</SelectItem>
                  <SelectItem value="High">High - Significant impact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="likelihood" className="flex items-center gap-2">
                Likelihood
                <span className="text-xs text-muted-foreground font-normal">
                  (How likely is this? Low/Medium/High)
                </span>
              </Label>
              <Select value={likelihood} onValueChange={setLikelihood}>
                <SelectTrigger>
                  <SelectValue placeholder="Select likelihood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low - Unlikely</SelectItem>
                  <SelectItem value="Medium">Medium - Possible</SelectItem>
                  <SelectItem value="High">High - Likely</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="treatmentNotes" className="flex items-center gap-2">
              Treatment/Mitigation Notes
              <span className="text-xs text-muted-foreground font-normal">
                (What will you do about it? e.g., "Train staff, implement backup process")
              </span>
            </Label>
            <Textarea
              id="treatmentNotes"
              value={treatmentNotes}
              onChange={(e) => setTreatmentNotes(e.target.value)}
              rows={3}
              placeholder="Describe how you'll manage this risk or pursue this opportunity..."
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
