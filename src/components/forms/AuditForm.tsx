'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { HelpCircle, File } from 'lucide-react'

interface AuditFormProps {
  onSubmit: (data: {
    auditDate: string
    scope: string
    findingsSummary: string
    file?: File
  }) => Promise<void>
  onCancel: () => void
  initialData?: {
    auditDate?: string
    scope?: string | null
    findingsSummary?: string | null
  }
}

export function AuditForm({ onSubmit, onCancel, initialData }: AuditFormProps) {
  const [auditDate, setAuditDate] = useState(
    initialData?.auditDate 
      ? new Date(initialData.auditDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  )
  const [scope, setScope] = useState(initialData?.scope || '')
  const [findingsSummary, setFindingsSummary] = useState(initialData?.findingsSummary || '')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ]
      const maxSize = 10 * 1024 * 1024 // 10MB

      if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|doc|docx|txt)$/i)) {
        setFileError('Please upload a PDF, Word document, or text file')
        return
      }

      if (selectedFile.size > maxSize) {
        setFileError('File size must be less than 10MB')
        return
      }

      setFile(selectedFile)
      setFileError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFileError('')

    try {
      await onSubmit({
        auditDate,
        scope,
        findingsSummary,
        file: file || undefined,
      })
    } catch (error) {
      console.error('Error submitting audit:', error)
      setFileError('Failed to save audit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="auditDate" className="flex items-center gap-2">
            Audit Date *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  The date when the internal audit was conducted.
                  <br />
                  <br />
                  ISO 9001 requires internal audits to be conducted at planned intervals.
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="auditDate"
            type="date"
            value={auditDate}
            onChange={(e) => setAuditDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="scope" className="flex items-center gap-2">
            Scope *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  What areas, processes, or clauses were audited?
                  <br />
                  <br />
                  <strong>Example:</strong> "Quality Management System - Processes 4.1 to 8.5", "Customer Service Process", "Document Control and Records Management"
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            required
            placeholder="Enter audit scope..."
          />
        </div>

        <div>
          <Label htmlFor="findingsSummary" className="flex items-center gap-2">
            Findings Summary *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  A summary of the audit findings, including:
                  <br />
                  • What was found (both positive and areas for improvement)
                  <br />
                  • Non-conformities identified
                  <br />
                  • Opportunities for improvement
                  <br />
                  <br />
                  You can upload a detailed audit report as a file below.
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Textarea
            id="findingsSummary"
            value={findingsSummary}
            onChange={(e) => setFindingsSummary(e.target.value)}
            required
            rows={6}
            placeholder="Enter findings summary..."
          />
        </div>

        <div>
          <Label htmlFor="file" className="flex items-center gap-2">
            Audit Report (Optional)
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Upload a detailed audit report document (PDF, Word, or text file, max 10MB).
                  <br />
                  <br />
                  This can include the full audit checklist, detailed findings, evidence reviewed, and recommendations.
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              className="cursor-pointer"
            />
            {file && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <File className="h-4 w-4" />
                <span>{file.name}</span>
                <span className="text-xs">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            )}
            {initialData && !file && (
              <div className="text-xs text-muted-foreground">
                Current file will be kept
              </div>
            )}
          </div>
          {fileError && (
            <p className="text-sm text-destructive mt-1">{fileError}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Audit'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </TooltipProvider>
  )
}
