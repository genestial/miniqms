import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const clauses = await prisma.isoClause.findMany({
      orderBy: { code: 'asc' },
    })

    return NextResponse.json(clauses)
  } catch (error) {
    console.error('Clauses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
