import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const clauses = await prisma.isoClause.findMany()
    
    // Sort clauses numerically by code (e.g., 4.1, 4.2, 10.1, 10.2)
    // instead of alphabetically (10.1, 10.2, 4.1, 4.2)
    clauses.sort((a, b) => {
      const aParts = a.code.split('.').map(Number)
      const bParts = b.code.split('.').map(Number)
      
      // Compare major version first
      if (aParts[0] !== bParts[0]) {
        return aParts[0] - bParts[0]
      }
      
      // Then compare minor version
      if (aParts[1] !== undefined && bParts[1] !== undefined) {
        return aParts[1] - bParts[1]
      }
      
      // If one has minor and other doesn't, the one without comes first
      return aParts.length - bParts.length
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
