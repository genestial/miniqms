import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Update clause applicability for a tenant
 * POST /api/clauses/scope
 * Body: { clauseId: string, applicable: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()
    const { clauseId, applicable } = body

    if (!clauseId || typeof applicable !== 'boolean') {
      return NextResponse.json(
        { error: 'clauseId and applicable (boolean) are required' },
        { status: 400 }
      )
    }

    // Upsert tenant clause scope
    await db(tenantId).tenantClauseScope.upsert({
      where: {
        tenantId_clauseId: {
          tenantId,
          clauseId,
        },
      },
      update: {
        applicable,
      },
      create: {
        clauseId,
        applicable,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update clause scope error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
