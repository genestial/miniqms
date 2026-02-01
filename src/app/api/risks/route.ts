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
    const risks = await db(tenantId).risk.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(risks)
  } catch (error) {
    console.error('Risks API error:', error)
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

    console.log('Creating risk with data:', { tenantId, body })

    const risk = await db(tenantId).risk.create({
      data: {
        type: body.type,
        description: body.description,
        processId: body.processId || null,
        impact: body.impact || null,
        likelihood: body.likelihood || null,
        ownerId: body.ownerId || null,
        treatmentNotes: body.treatmentNotes || null,
        status: body.status || 'OPEN',
      },
    })

    return NextResponse.json(risk)
  } catch (error) {
    console.error('Create risk error:', error)
    // Return the actual error message for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorDetails = error instanceof Error ? error.stack : String(error)
    console.error('Error details:', errorDetails)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    )
  }
}
