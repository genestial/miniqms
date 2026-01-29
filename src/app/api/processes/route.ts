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
    const processes = await db(tenantId).process.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(processes)
  } catch (error) {
    console.error('Processes API error:', error)
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

    const process = await db(tenantId).process.create({
      data: {
        name: body.name,
        description: body.description,
        ownerId: body.ownerId,
        inputs: body.inputs,
        outputs: body.outputs,
      },
    })

    return NextResponse.json(process)
  } catch (error) {
    console.error('Create process error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
