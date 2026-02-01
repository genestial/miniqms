import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({ 
      hasSession: !!session,
      user: session?.user,
      tenantId: session?.user?.tenantId,
      message: session?.user?.tenantId 
        ? 'Session is valid' 
        : 'No session or missing tenantId'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      hasSession: false
    }, { status: 500 })
  }
}
