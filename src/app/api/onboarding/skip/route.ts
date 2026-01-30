import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Mark an onboarding step as skipped
 * POST /api/onboarding/skip
 * Body: { step: string, reason?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()
    const { step, reason } = body

    if (!step) {
      return NextResponse.json({ error: 'Step is required' }, { status: 400 })
    }

    // Store skipped step in a problem/improvement record for tracking
    // This will show up in pending tasks
    await db(tenantId).problem.create({
      data: {
        title: `Complete onboarding: ${step}`,
        description: reason || `This onboarding step was skipped and needs to be completed.`,
        type: 'IMPROVEMENT',
        status: 'OPEN',
        priority: 'MEDIUM',
        // Tag it so we can identify onboarding tasks
        tags: ['onboarding', 'setup', step],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Skip onboarding step error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
