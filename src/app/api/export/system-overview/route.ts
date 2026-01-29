import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateSystemOverviewPDF } from '@/lib/pdf-export'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const tenantDb = db(tenantId)

    // Gather all data for system overview
    const [companyProfile, tenant, roles, processes, policies, objectives] =
      await Promise.all([
        tenantDb.companyProfile.findUnique({}),
        tenantDb.tenant.findUnique({ where: { id: tenantId } }),
        tenantDb.role.findMany(),
        tenantDb.process.findMany(),
        tenantDb.evidence.findMany({
          where: { type: 'POLICY', status: 'APPROVED' },
        }),
        tenantDb.qualityObjective.findMany(),
      ])

    const systemOverviewData = {
      companyProfile: companyProfile || {
        companyName: 'Not set',
      },
      scopeStatement: tenant?.scopeStatement,
      roles: roles.map((r) => ({
        name: r.name,
        responsibilitiesText: r.responsibilitiesText,
      })),
      processes: processes.map((p) => ({
        name: p.name,
        description: p.description || undefined,
        ownerId: p.ownerId || undefined,
      })),
      policies: policies.map((p) => ({
        title: p.title,
        type: p.type,
      })),
      objectives: objectives.map((o) => ({
        name: o.name,
        description: o.description || undefined,
        target: o.target || undefined,
      })),
    }

    // Generate PDF
    const pdfBuffer = await generateSystemOverviewPDF(systemOverviewData)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="system-overview.pdf"',
      },
    })
  } catch (error) {
    console.error('System overview export error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
