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
    const problems = await db(tenantId).problem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(problems)
  } catch (error) {
    console.error('Problems API error:', error)
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

    const problem = await db(tenantId).problem.create({
      data: {
        source: body.source,
        description: body.description,
        dateIdentified: new Date(body.dateIdentified),
        rootCause: body.rootCause,
        fixDescription: body.fixDescription,
        responsibleId: body.responsibleId,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        status: body.status || 'OPEN',
      },
    })

    return NextResponse.json(problem)
  } catch (error) {
    console.error('Create problem error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
