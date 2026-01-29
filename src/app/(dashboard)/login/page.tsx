'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In to Mini QMS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Authentication will be implemented with NextAuth.js
          </p>
          <Button className="w-full">Sign In</Button>
        </CardContent>
      </Card>
    </div>
  )
}
