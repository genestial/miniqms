import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { uploadFile } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const formData = await request.formData()
    const file = formData.get('file') as File
    const auditDate = formData.get('auditDate') as string
    const scope = formData.get('scope') as string
    const findingsSummary = formData.get('findingsSummary') as string

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create audit record first to get ID
    const audit = await db(tenantId).internalAudit.create({
      data: {
        auditDate: new Date(auditDate),
        scope,
        findingsSummary,
      },
    })

    // Upload to storage
    const storageKey = await uploadFile(
      buffer,
      tenantId,
      'audits',
      audit.id,
      file.name
    )

    // Update audit with storage key
    const updatedAudit = await db(tenantId).internalAudit.update({
      where: { id: audit.id },
      data: { storageKey },
    })

    return NextResponse.json(updatedAudit)
  } catch (error) {
    console.error('Audit upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
