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

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 })
    }

    const audit = await db(tenantId).internalAudit.update({
      where: { id },
      data: {
        auditDate: updateData.auditDate ? new Date(updateData.auditDate) : undefined,
        scope: updateData.scope,
        findingsSummary: updateData.findingsSummary,
        storageKey: updateData.storageKey,
      },
    })

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Update audit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Audit ID is required' }, { status: 400 })
    }

    await db(tenantId).internalAudit.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete audit error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
