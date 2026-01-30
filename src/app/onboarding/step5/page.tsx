'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { QUALITY_POLICY_TEMPLATE } from '@/lib/quality-policy-template'

export default function OnboardingStep5() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    try {
      // Upload file and create evidence
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', 'Quality Policy')
      formData.append('type', 'POLICY')
      formData.append('sourceType', 'UPLOAD')

      const response = await fetch('/api/evidence/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        router.push('/onboarding/step6')
      }
    } catch (error) {
      console.error('Failed to upload policy:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 5: Upload Quality Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="policy">Quality Policy Document *</Label>
              <Input
                id="policy"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload your Quality Policy document (PDF or Word)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/onboarding/step4')}
              >
                Previous
              </Button>
              <Button type="submit" disabled={loading || !file} className="flex-1">
                {loading ? 'Uploading...' : 'Next: Clause Applicability'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
