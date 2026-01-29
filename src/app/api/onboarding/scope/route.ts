import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()

    await db(tenantId).tenant.update({
      where: { id: tenantId },
      data: { scopeStatement: body.scopeStatement },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update scope error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
