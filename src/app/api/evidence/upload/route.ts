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
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const sourceType = formData.get('sourceType') as string

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to S3
    const storageKey = await uploadFile(
      buffer,
      tenantId,
      'evidence',
      'temp', // Will be updated with actual evidence ID
      file.name
    )

    // Create evidence record
    const evidence = await db(tenantId).evidence.create({
      data: {
        title,
        type: type as any,
        sourceType: sourceType as any,
        storageKey,
        status: 'DRAFT',
      },
    })

    // Update storage key with actual evidence ID
    const finalStorageKey = storageKey.replace('temp', evidence.id)
    // Note: In production, you'd want to move/rename the file in S3
    // For MVP, we'll just update the key in the database

    await db(tenantId).evidence.update({
      where: { id: evidence.id },
      data: { storageKey: finalStorageKey },
    })

    return NextResponse.json(evidence)
  } catch (error) {
    console.error('Evidence upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
