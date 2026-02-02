'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { HelpCircle, Upload, File } from 'lucide-react'

interface EvidenceFormProps {
  onSubmit: (data: {
    title: string
    type: 'POLICY' | 'PROCEDURE' | 'RECORD' | 'TEMPLATE' | 'OTHER'
    sourceType: 'UPLOAD' | 'LINK' | 'GENERATED'
    file?: File
    externalUrl?: string
    ownerId?: string
  }) => Promise<void>
  onCancel: () => void
  initialData?: {
    title?: string
    type?: 'POLICY' | 'PROCEDURE' | 'RECORD' | 'TEMPLATE' | 'OTHER'
    sourceType?: 'UPLOAD' | 'LINK' | 'GENERATED'
    externalUrl?: string
    ownerId?: string
  }
}

export function EvidenceForm({ onSubmit, onCancel, initialData }: EvidenceFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [type, setType] = useState<'POLICY' | 'PROCEDURE' | 'RECORD' | 'TEMPLATE' | 'OTHER'>(
    initialData?.type || 'POLICY'
  )
  const [sourceType, setSourceType] = useState<'UPLOAD' | 'LINK' | 'GENERATED'>(
    initialData?.sourceType || 'UPLOAD'
  )
  const [file, setFile] = useState<File | null>(null)
  const [externalUrl, setExternalUrl] = useState(initialData?.externalUrl || '')
  const [ownerId, setOwnerId] = useState(initialData?.ownerId || '')
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
      
      // Auto-fill title if empty
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFileError('')

    try {
      // Validate file for UPLOAD source type (only required for new evidence)
      if (sourceType === 'UPLOAD' && !file && !initialData) {
        setFileError('Please select a file to upload')
        setLoading(false)
        return
      }

      // Validate URL for LINK source type
      if (sourceType === 'LINK' && !externalUrl) {
        setFileError('Please provide an external URL')
        setLoading(false)
        return
      }

      await onSubmit({
        title,
        type,
        sourceType,
        file: file || undefined,
        externalUrl: externalUrl || undefined,
        ownerId: ownerId || undefined,
      })
    } catch (error) {
      console.error('Error submitting evidence:', error)
      setFileError('Failed to upload evidence. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title" className="flex items-center gap-2">
            Title *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Give this evidence item a clear, descriptive title.
                  <br />
                  <br />
                  <strong>Example:</strong> "Quality Policy 2024", "Customer Complaint Log", "Internal Audit Report Q1"
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter evidence title..."
          />
        </div>

        <div>
          <Label htmlFor="type" className="flex items-center gap-2">
            Type *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  What kind of evidence is this?
                  <br />
                  <br />
                  <strong>Policy:</strong> High-level document describing your approach (e.g., Quality Policy)
                  <br />
                  <strong>Procedure:</strong> Step-by-step instructions for a process
                  <br />
                  <strong>Record:</strong> Evidence that something happened (e.g., meeting minutes, audit reports)
                  <br />
                  <strong>Other:</strong> Any other type of evidence
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
              <SelectContent>
                <SelectItem value="POLICY">Policy</SelectItem>
                <SelectItem value="PROCEDURE">Procedure</SelectItem>
                <SelectItem value="RECORD">Record</SelectItem>
                <SelectItem value="TEMPLATE">Template</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sourceType" className="flex items-center gap-2">
            Source Type *
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  How will you provide this evidence?
                  <br />
                  <br />
                  <strong>Upload:</strong> Upload a file (PDF, Word, etc.)
                  <br />
                  <strong>External:</strong> Link to an external URL
                  <br />
                  <strong>Template:</strong> Use a pre-filled template
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Select value={sourceType} onValueChange={(v) => setSourceType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPLOAD">Upload File</SelectItem>
              <SelectItem value="LINK">External Link</SelectItem>
              <SelectItem value="GENERATED">Generated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sourceType === 'UPLOAD' && (
          <div>
            <Label htmlFor="file" className="flex items-center gap-2">
              File {!initialData && '*'}
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {initialData 
                      ? 'Upload a new file to replace the existing one (optional). Leave empty to keep current file.'
                      : 'Upload a PDF, Word document, or text file (max 10MB).'}
                    <br />
                    <br />
                    Supported formats: PDF, DOC, DOCX, TXT
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
        )}

        {sourceType === 'LINK' && (
          <div>
            <Label htmlFor="externalUrl" className="flex items-center gap-2">
              External URL *
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Provide a link to the evidence (e.g., Google Drive, SharePoint, website).
                    <br />
                    <br />
                    Make sure the link is accessible to auditors.
                  </p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              id="externalUrl"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        )}

        {sourceType === 'GENERATED' && (
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Generated evidence will be created automatically. No file upload needed.
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="ownerId">Owner (Optional)</Label>
          <Input
            id="ownerId"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            placeholder="Name or email of evidence owner"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Uploading...' : 'Save Evidence'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </TooltipProvider>
  )
}
