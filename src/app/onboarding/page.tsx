'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to first step
    router.push('/onboarding/step1')
  }, [router])

  return (
    <div className="container mx-auto p-6">
      <div className="text-center">Redirecting to onboarding...</div>
    </div>
  )
}
