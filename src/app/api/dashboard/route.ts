import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculateReadinessPercentage, getAllClauseCards } from '@/lib/compliance'
import { getNextBestActions } from '@/lib/actions'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = session.user.tenantId
    const tenantDb = db(tenantId)

    // Get all ISO clauses
    const clauses = await tenantDb.isoClause.findMany({
      orderBy: { code: 'asc' },
    })

    // Get applicable clauses for tenant
    const tenantScopes = await tenantDb.tenantClauseScope.findMany({
      where: { applicable: true },
    })
    const applicableClauseIds = new Set(
      tenantScopes.map((scope) => scope.clauseId)
    )
    const applicableClauses = clauses.filter((clause) =>
      applicableClauseIds.has(clause.id)
    )

    // Calculate readiness
    const percentage = await calculateReadinessPercentage(
      tenantId,
      applicableClauses
    )

    // Get clause cards
    const clauseCards = await getAllClauseCards(tenantId, applicableClauses)

    // Count statuses
    const greenCount = clauseCards.filter((c) => c.status === 'green').length
    const amberCount = clauseCards.filter((c) => c.status === 'amber').length
    const redCount = clauseCards.filter((c) => c.status === 'red').length

    // Get next best actions
    const nextActions = await getNextBestActions(tenantId, applicableClauses, 5)

    // Get attention items
    const overdueProblems = await tenantDb.problem.findMany({
      where: {
        status: { in: ['OPEN', 'IN_PROGRESS'] },
        dueDate: { lt: new Date() },
      },
      take: 10,
    })

    const pendingEvidence = await tenantDb.evidence.findMany({
      where: { status: 'DRAFT' },
      take: 10,
    })

    const attentionItems = [
      ...overdueProblems.map((p) => ({
        id: `overdue-${p.id}`,
        type: 'overdue' as const,
        title: `Corrective Action: ${p.description.substring(0, 50)}...`,
        description: p.description,
        dueDate: p.dueDate || undefined,
        link: `/problems/${p.id}`,
      })),
      ...pendingEvidence.map((e) => ({
        id: `approve-${e.id}`,
        type: 'pending_approval' as const,
        title: `Evidence: ${e.title}`,
        description: `Pending approval for ${e.type.toLowerCase()}`,
        link: `/evidence/${e.id}`,
      })),
    ]

    // Check if dashboard is empty
    const companyProfile = await tenantDb.companyProfile.findUnique()
    const processes = await tenantDb.process.findMany()
    const isEmpty = !companyProfile && processes.length === 0

    return NextResponse.json({
      percentage,
      greenCount,
      amberCount,
      redCount,
      totalClauses: applicableClauses.length,
      clauseCards,
      nextActions,
      attentionItems,
      isEmpty,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
