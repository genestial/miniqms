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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Return single evidence
      const evidence = await db(tenantId).evidence.findUnique({
        where: { id },
      })
      if (!evidence) {
        return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
      }
      return NextResponse.json(evidence)
    }

    // Return all evidence
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
      return NextResponse.json({ error: 'Evidence ID is required' }, { status: 400 })
    }

    const evidence = await db(tenantId).evidence.update({
      where: { id },
      data: {
        title: updateData.title,
        type: updateData.type,
        ownerId: updateData.ownerId,
        status: updateData.status,
        sourceType: updateData.sourceType,
        externalUrl: updateData.externalUrl,
        templateId: updateData.templateId,
      },
    })

    return NextResponse.json(evidence)
  } catch (error) {
    console.error('Update evidence error:', error)
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
      return NextResponse.json({ error: 'Evidence ID is required' }, { status: 400 })
    }

    // Get evidence to check for storage key before deletion
    const evidence = await db(tenantId).evidence.findUnique({
      where: { id },
    })

    if (!evidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
    }

    // Delete the evidence record (cascade will handle related records)
    await db(tenantId).evidence.delete({
      where: { id },
    })

    // Note: File deletion from storage should be handled separately if needed
    // For now, we'll just delete the database record

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete evidence error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
