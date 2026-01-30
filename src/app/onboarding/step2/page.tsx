'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProcessForm } from '@/components/forms/ProcessForm'

export default function OnboardingStep2() {
  const router = useRouter()
  const [processes, setProcesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch('/api/processes')
      .then((res) => res.json())
      .then((data) => {
        setProcesses(data)
        setLoading(false)
      })
  }, [])

  const handleCreateDefaults = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/onboarding/processes', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Send empty body explicitly
      })
      
      if (!response.ok) {
        throw new Error('Failed to create default processes')
      }
      
      // Refresh processes list
      const processesResponse = await fetch('/api/processes')
      const data = await processesResponse.json()
      setProcesses(data)
    } catch (error) {
      console.error('Failed to create default processes:', error)
      alert('Failed to create default processes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessSubmit = async (data: any) => {
    try {
      await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const response = await fetch('/api/processes')
      const updated = await response.json()
      setProcesses(updated)
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create process:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Default Processes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We'll create default processes for you. You can edit or add more
            later.
          </p>

          {processes.length === 0 ? (
            <Button onClick={handleCreateDefaults} className="w-full">
              Create Default Processes
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{process.name}</div>
                      {process.description && (
                        <div className="text-sm text-muted-foreground">
                          {process.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!showForm && (
                <Button
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="w-full"
                >
                  Add Another Process
                </Button>
              )}

              {showForm && (
                <ProcessForm
                  onSubmit={handleProcessSubmit}
                  onCancel={() => setShowForm(false)}
                />
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/onboarding/step1')}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => router.push('/onboarding/step3')}
                  className="flex-1"
                >
                  Next: Add Initial Risks
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
