'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface Process {
  id: string
  name: string
  description: string | null
  ownerId: string | null
}

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/processes')
      .then((res) => res.json())
      .then((data) => {
        setProcesses(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load processes:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Process Register</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Process
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {processes.map((process) => (
          <Card key={process.id}>
            <CardHeader>
              <CardTitle>{process.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {process.description || 'No description'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {processes.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No processes yet. Add your first process to get started.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
