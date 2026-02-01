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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { HelpCircle } from 'lucide-react'

interface ProblemFormProps {
  onSubmit: (data: {
    source: 'AUDIT' | 'CUSTOMER_ISSUE' | 'INTERNAL_ISSUE' | 'OTHER'
    description: string
    dateIdentified: string
    rootCause?: string
    fixDescription?: string
    responsibleId?: string
    dueDate?: string
    status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  }) => Promise<void>
  onCancel: () => void
  initialData?: {
    source?: 'AUDIT' | 'CUSTOMER_ISSUE' | 'INTERNAL_ISSUE' | 'OTHER'
    description?: string
    dateIdentified?: string
    rootCause?: string
    fixDescription?: string
    responsibleId?: string
    dueDate?: string
    status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'
  }
}

export function ProblemForm({ onSubmit, onCancel, initialData }: ProblemFormProps) {
  const [source, setSource] = useState<'AUDIT' | 'CUSTOMER_ISSUE' | 'INTERNAL_ISSUE' | 'OTHER'>(
    initialData?.source || 'INTERNAL_ISSUE'
  )
  const [description, setDescription] = useState(initialData?.description || '')
  const [dateIdentified, setDateIdentified] = useState(
    initialData?.dateIdentified || new Date().toISOString().split('T')[0]
  )
  const [rootCause, setRootCause] = useState(initialData?.rootCause || '')
  const [fixDescription, setFixDescription] = useState(initialData?.fixDescription || '')
  const [responsibleId, setResponsibleId] = useState(initialData?.responsibleId || '')
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '')
  const [status, setStatus] = useState<'OPEN' | 'IN_PROGRESS' | 'CLOSED'>(
    initialData?.status || 'OPEN'
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        source,
        description,
        dateIdentified,
        rootCause: rootCause || undefined,
        fixDescription: fixDescription || undefined,
        responsibleId: responsibleId || undefined,
        dueDate: dueDate || undefined,
        status,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="source" className="flex items-center gap-2">
            Source *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Where did this problem come from?
                  <br />
                  <br />
                  <strong>Audit:</strong> Found during an internal or external audit
                  <br />
                  <strong>Customer Issue:</strong> Reported by a customer
                  <br />
                  <strong>Internal Issue:</strong> Discovered internally by your team
                  <br />
                  <strong>Other:</strong> Any other source
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Select value={source} onValueChange={(v) => setSource(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AUDIT">Audit</SelectItem>
              <SelectItem value="CUSTOMER_ISSUE">Customer Issue</SelectItem>
              <SelectItem value="INTERNAL_ISSUE">Internal Issue</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description" className="flex items-center gap-2">
            Description *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Describe the problem in plain English. What went wrong or what needs improvement?
                  <br />
                  <br />
                  <strong>Example:</strong> "Customer complaints about delayed deliveries increased by 20% this quarter"
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe the problem in plain English..."
          />
        </div>

        <div>
          <Label htmlFor="dateIdentified">Date Identified *</Label>
          <Input
            id="dateIdentified"
            type="date"
            value={dateIdentified}
            onChange={(e) => setDateIdentified(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="rootCause" className="flex items-center gap-2">
            Root Cause
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  What is the underlying cause of this problem? Why did it happen?
                  <br />
                  <br />
                  <strong>Example:</strong> "Lack of training on new process, unclear responsibilities"
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Textarea
            id="rootCause"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            rows={3}
            placeholder="What is the root cause of this problem?"
          />
        </div>

        <div>
          <Label htmlFor="fixDescription" className="flex items-center gap-2">
            Fix / Improvement Plan
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  What actions will you take to fix this problem or make the improvement?
                  <br />
                  <br />
                  <strong>Example:</strong> "Provide training to all staff, update process documentation, assign clear ownership"
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Textarea
            id="fixDescription"
            value={fixDescription}
            onChange={(e) => setFixDescription(e.target.value)}
            rows={3}
            placeholder="Describe the fix or improvement plan..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="responsibleId">Responsible Person</Label>
            <Input
              id="responsibleId"
              value={responsibleId}
              onChange={(e) => setResponsibleId(e.target.value)}
              placeholder="Name or email of responsible person"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
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
    </TooltipProvider>
  )
}
