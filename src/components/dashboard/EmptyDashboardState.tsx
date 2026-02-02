'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ArrowRight } from 'lucide-react'

interface EmptyDashboardStateProps {
  onResumeOnboarding: () => void
}

export function EmptyDashboardState({
  onResumeOnboarding,
}: EmptyDashboardStateProps) {
  return (
    <Card className="dashboard-card border-dashed">
      <CardHeader className="dashboard-card-header text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <CardTitle className="dashboard-card-title">Welcome to Mini QMS</CardTitle>
      </CardHeader>
      <CardContent className="dashboard-card-content text-center space-y-4">
        <p className="text-muted">
          Get started by completing the onboarding process. This will help you
          set up your Quality Management System and become ISO 9001 compliant.
        </p>
        <Button onClick={onResumeOnboarding} size="lg">
          Start Onboarding
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
