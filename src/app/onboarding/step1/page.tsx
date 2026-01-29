'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function OnboardingStep1() {
  const router = useRouter()
  const [scopeStatement, setScopeStatement] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding/scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scopeStatement }),
      })
      if (response.ok) {
        router.push('/onboarding/step2')
      }
    } catch (error) {
      console.error('Failed to save scope:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Scope Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="scope">
                Enter your company's scope statement for the Quality Management
                System
              </Label>
              <Textarea
                id="scope"
                value={scopeStatement}
                onChange={(e) => setScopeStatement(e.target.value)}
                required
                rows={6}
                placeholder="Example: Design, development, and delivery of software solutions for small and medium enterprises..."
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Next: Default Processes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
