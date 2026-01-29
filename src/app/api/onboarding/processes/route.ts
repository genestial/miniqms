import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const body = await request.json()

    // Create default processes if they don't exist
    const defaultProcesses = [
      { name: 'Sales', description: 'Sales process and customer acquisition' },
      {
        name: 'Service Delivery',
        description: 'Delivery of services to customers',
      },
      { name: 'Procurement', description: 'Purchasing and supplier management' },
      { name: 'HR', description: 'Human resources and people management' },
      {
        name: 'Management',
        description: 'Management and strategic planning',
      },
    ]

    const existingProcesses = await db(tenantId).process.findMany()
    const existingNames = new Set(existingProcesses.map((p) => p.name))

    for (const process of defaultProcesses) {
      if (!existingNames.has(process.name)) {
        await db(tenantId).process.create({
          data: {
            name: process.name,
            description: process.description,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create default processes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
