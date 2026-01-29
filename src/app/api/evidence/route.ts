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
    const evidence = await db(tenantId).evidence.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(evidence)
  } catch (error) {
    console.error('Evidence API error:', error)
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

    const evidence = await db(tenantId).evidence.create({
      data: {
        title: body.title,
        type: body.type,
        ownerId: body.ownerId,
        status: body.status || 'DRAFT',
        sourceType: body.sourceType,
        storageKey: body.storageKey,
        externalUrl: body.externalUrl,
        templateId: body.templateId,
      },
    })

    return NextResponse.json(evidence)
  } catch (error) {
    console.error('Create evidence error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
