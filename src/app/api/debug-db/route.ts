import { NextResponse } from 'next/server'

export async function GET() {
  // Show the database URL being used (hide password for security)
  const url = process.env.DATABASE_URL || 'NOT SET'
  const maskedUrl = url.replace(/:([^:@]+)@/, ':****@') // Hide password
  
  return NextResponse.json({ 
    databaseUrl: maskedUrl,
    isLocal: url.includes('localhost') || url.includes('127.0.0.1'),
    isProduction: url.includes('prisma.io') || url.includes('vercel') || url.includes('accelerate'),
    message: 'Check what database URL is being used'
  })
}
