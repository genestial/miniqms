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
    const objectives = await db(tenantId).qualityObjective.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(objectives)
  } catch (error) {
    console.error('Objectives API error:', error)
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

    const objective = await db(tenantId).qualityObjective.create({
      data: {
        name: body.name,
        description: body.description,
        measurement: body.measurement,
        target: body.target,
        ownerId: body.ownerId,
        statusNotes: body.statusNotes,
      },
    })

    return NextResponse.json(objective)
  } catch (error) {
    console.error('Create objective error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
