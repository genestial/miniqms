import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const audits = await db(tenantId).internalAudit.findMany({
      orderBy: { auditDate: 'desc' },
    })

    return NextResponse.json(audits)
  } catch (error) {
    console.error('Audits API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()

    const audit = await db(tenantId).internalAudit.create({
      data: {
        auditDate: new Date(body.auditDate),
        scope: body.scope,
        storageKey: body.storageKey,
        findingsSummary: body.findingsSummary,
      },
    })

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Create audit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
