'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { QUALITY_POLICY_TEMPLATE } from '@/lib/quality-policy-template'
import { generateQualityPolicyDocx } from '@/lib/generate-quality-policy-docx'

export default function OnboardingStep5() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const [useTemplate, setUseTemplate] = useState(false)
  const [templateText, setTemplateText] = useState(QUALITY_POLICY_TEMPLATE)

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
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 5: Upload Quality Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload your Quality Policy document. This is a key requirement for ISO 9001 compliance.
            </p>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <h3 className="font-medium text-sm mb-2">What is a Quality Policy?</h3>
              <p className="text-xs text-muted-foreground mb-3">
                A Quality Policy is a formal statement from top management that outlines your organization's commitment to quality. 
                It should reflect your company's values, customer focus, and commitment to continuous improvement. 
                The policy should be clear, relevant to your business, and communicated to all employees.
              </p>
              <h4 className="font-medium text-xs mb-1">Key elements of a Quality Policy:</h4>
              <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mb-3">
                <li>Commitment to meeting customer requirements</li>
                <li>Commitment to continuous improvement</li>
                <li>Framework for setting quality objectives</li>
                <li>Signed by top management</li>
                <li>Reviewed regularly (typically annually)</li>
              </ul>
              {!showTemplate && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplate(true)}
                  className="mt-2"
                >
                  Don't have a Quality Policy? Use our template
                </Button>
              )}
            </div>
          </div>

          {showTemplate && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-base">Quality Policy Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use this template as a starting point. Customize it to reflect your organization's specific needs, 
                  products/services, and values. You can download it, edit it, and then upload it.
                </p>
                <div>
                  <Label>Template (edit as needed):</Label>
                  <Textarea
                    value={templateText}
                    onChange={(e) => setTemplateText(e.target.value)}
                    rows={20}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      try {
                        const blob = await generateQualityPolicyDocx(templateText)
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'quality-policy-template.docx'
                        a.click()
                        URL.revokeObjectURL(url)
                      } catch (error) {
                        console.error('Failed to generate Word document:', error)
                        alert('Failed to generate Word document. Please try again.')
                      }
                    }}
                  >
                    Download as Word Document
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setUseTemplate(true)
                      setShowTemplate(false)
                    }}
                  >
                    Use This Template (I'll upload it after editing)
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplate(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {useTemplate && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                ✓ Template selected. Please download, customize, and upload your Quality Policy document below.
              </p>
            </div>
          )}

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
