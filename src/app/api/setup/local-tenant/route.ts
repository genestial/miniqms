import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

/**
 * Setup endpoint to create a local tenant and admin user
 * This is for local development only
 */
export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const body = await request.json()
    const { tenantName, userEmail, userName, password } = body

    if (!tenantName || !userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields: tenantName, userEmail, userName' },
        { status: 400 }
      )
    }

    // Create tenant
    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
        scopeStatement: `Local development tenant for ${tenantName}`,
      },
    })

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userEmail,
        name: userName,
        tenantId: tenant.id,
        role: 'ADMIN',
        // Note: For MVP, password is optional
        // In production, you'd hash the password here
      },
    })

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tenantId: user.tenantId,
      },
      message: 'Local tenant and user created successfully. Please log in with the email you provided.',
    })
  } catch (error) {
    console.error('Setup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    // Check if tenant/user already exists
    if (errorMessage.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Tenant or user with this email already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create tenant and user', message: errorMessage },
      { status: 500 }
    )
  }
}
