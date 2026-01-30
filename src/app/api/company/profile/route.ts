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
    const profile = await db(tenantId).companyProfile.findUnique()

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Company profile API error:', error)
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

    const profile = await db(tenantId).companyProfile.upsert({
      update: {
        companyName: body.companyName,
        address: body.address,
        industry: body.industry,
        employeeCount: body.employeeCount,
        establishedDate: body.establishedDate
          ? new Date(body.establishedDate)
          : null,
        description: body.description,
        website: body.website,
      },
      create: {
        companyName: body.companyName,
        address: body.address,
        industry: body.industry,
        employeeCount: body.employeeCount,
        establishedDate: body.establishedDate
          ? new Date(body.establishedDate)
          : null,
        description: body.description,
        website: body.website,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Create/update company profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
