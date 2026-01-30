import { db } from './db'
import { getEvidenceRequirements } from './standards'
import type { IsoClause } from './standards'

export interface NextBestAction {
  id: string
  priority: number
  clauseCode: string
  clauseTitle: string
  description: string
  ctaLink: string
  estimatedTime: string
}

/**
 * Calculate next best actions for a tenant
 */
export async function getNextBestActions(
  tenantId: string,
  clauses: IsoClause[],
  limit: number = 5
): Promise<NextBestAction[]> {
  const actions: NextBestAction[] = []
  const tenantDb = db(tenantId)

  // 0. Check for skipped onboarding steps (check description for onboarding keywords)
  const allOpenProblems = await tenantDb.problem.findMany({
    where: {
      status: 'OPEN',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  
  const skippedOnboarding = allOpenProblems.filter((p) => 
    p.description && (
      p.description.toLowerCase().includes('complete onboarding') ||
      p.description.toLowerCase().includes('onboarding step')
    )
  ).slice(0, 3)
  
  for (const skipped of skippedOnboarding) {
    // Extract step name from description
    const stepMatch = skipped.description.match(/onboarding:?\s*(.+?)(?:\.|$)/i)
    const stepName = stepMatch ? stepMatch[1] : 'onboarding step'
    
    actions.push({
      id: `onboarding-skipped-${skipped.id}`,
      priority: 75, // Lower than required steps but still important
      clauseCode: '4.1',
      clauseTitle: 'Understanding the organization',
      description: skipped.description,
      ctaLink: '/onboarding',
      estimatedTime: '15 min',
    })
  }

  // 1. Check missing evidence requirements
  for (const clause of clauses) {
    const requirements = getEvidenceRequirements(clause.code)
    for (const req of requirements) {
      const hasRequirement = await checkRequirement(tenantDb, clause.code, req)
      if (!hasRequirement) {
        actions.push({
          id: `missing-${clause.code}-${req.type}`,
          priority: calculatePriority('missing_evidence', clause.code),
          clauseCode: clause.code,
          clauseTitle: clause.title,
          description: `Missing ${req.description} for ${clause.code}`,
          ctaLink: getActionLink(req.type, clause.code),
          estimatedTime: getEstimatedTime(req.type),
        })
      }
    }
  }

  // 2. Check overdue corrective actions
  const overdueProblems = await tenantDb.problem.findMany({
    where: {
      status: { in: ['OPEN', 'IN_PROGRESS'] },
      dueDate: { lt: new Date() },
    },
  })

  for (const problem of overdueProblems) {
    actions.push({
      id: `overdue-${problem.id}`,
      priority: calculatePriority('overdue', '10.2'),
      clauseCode: '10.2',
      clauseTitle: 'Nonconformity and corrective action',
      description: `Overdue corrective action: ${problem.description.substring(0, 50)}...`,
      ctaLink: `/problems/${problem.id}`,
      estimatedTime: '15 min',
    })
  }

  // 3. Check pending evidence approvals
  const pendingEvidence = await tenantDb.evidence.findMany({
    where: {
      status: 'DRAFT',
    },
  })

  for (const evidence of pendingEvidence) {
    actions.push({
      id: `approve-${evidence.id}`,
      priority: calculatePriority('pending_approval', '7.5'),
      clauseCode: '7.5',
      clauseTitle: 'Documented information',
      description: `Approve evidence: ${evidence.title}`,
      ctaLink: `/evidence/${evidence.id}`,
      estimatedTime: '5 min',
    })
  }

  // 4. Check incomplete onboarding
  const companyProfile = await tenantDb.companyProfile.findUnique()
  const processes = await tenantDb.process.findMany()
  const risks = await tenantDb.risk.findMany()
  const reviews = await tenantDb.managementReview.findMany()
  const qualityPolicy = await tenantDb.evidence.findMany({
    where: {
      type: 'POLICY',
      status: 'APPROVED',
    },
  })

  if (!companyProfile) {
    actions.push({
      id: 'onboarding-company',
      priority: 100,
      clauseCode: '4.1',
      clauseTitle: 'Understanding the organization',
      description: 'Complete company profile',
      ctaLink: '/onboarding?step=1',
      estimatedTime: '10 min',
    })
  }

  if (processes.length === 0) {
    actions.push({
      id: 'onboarding-processes',
      priority: 95,
      clauseCode: '4.4',
      clauseTitle: 'Processes and their interactions',
      description: 'Add your business processes',
      ctaLink: '/onboarding?step=2',
      estimatedTime: '15 min',
    })
  }

  if (risks.length < 3) {
    actions.push({
      id: 'onboarding-risks',
      priority: 90,
      clauseCode: '6.1',
      clauseTitle: 'Actions to address risks and opportunities',
      description: 'Add 3-5 risks or opportunities',
      ctaLink: '/onboarding?step=3',
      estimatedTime: '20 min',
    })
  }

  if (reviews.length === 0) {
    actions.push({
      id: 'onboarding-review',
      priority: 85,
      clauseCode: '9.3',
      clauseTitle: 'Management review',
      description: 'Record your first management review',
      ctaLink: '/onboarding?step=4',
      estimatedTime: '10 min',
    })
  }

  if (qualityPolicy.length === 0) {
    actions.push({
      id: 'onboarding-policy',
      priority: 80,
      clauseCode: '5.2',
      clauseTitle: 'Quality Policy',
      description: 'Upload and approve Quality Policy',
      ctaLink: '/onboarding?step=5',
      estimatedTime: '15 min',
    })
  }

  // 5. Check unassigned roles/responsibilities
  const roles = await tenantDb.role.findMany()
  const roleAssignments = await tenantDb.roleAssignment.findMany()
  
  if (roles.length > 0 && roleAssignments.length === 0) {
    actions.push({
      id: 'assign-roles',
      priority: 70,
      clauseCode: '5.3',
      clauseTitle: 'Organizational roles, responsibilities and authorities',
      description: 'Assign users to roles',
      ctaLink: '/company/roles',
      estimatedTime: '10 min',
    })
  }

  // Sort by priority and return top N
  return actions
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
}

/**
 * Check if requirement is met (helper)
 */
async function checkRequirement(
  tenantDb: any,
  clauseCode: string,
  requirement: { type: string; description: string }
): Promise<boolean> {
  switch (requirement.type) {
    case 'policy':
      const policies = await tenantDb.evidence.findMany({
        where: { type: 'POLICY', status: 'APPROVED' },
      })
      return policies.length > 0

    case 'procedure':
      const procedures = await tenantDb.evidence.findMany({
        where: { type: 'PROCEDURE', status: 'APPROVED' },
      })
      return procedures.length > 0

    case 'record':
      const records = await tenantDb.evidence.findMany({
        where: { type: 'RECORD', status: 'APPROVED' },
      })
      return records.length > 0

    case 'risk_thinking':
      const risks = await tenantDb.risk.findMany()
      return risks.length > 0

    case 'review':
      if (clauseCode === '9.2') {
        const audits = await tenantDb.internalAudit.findMany()
        return audits.length > 0
      } else if (clauseCode === '9.3') {
        const reviews = await tenantDb.managementReview.findMany()
        return reviews.length > 0
      }
      return false

    case 'action':
      const problems = await tenantDb.problem.findMany()
      return problems.length > 0

    default:
      return false
  }
}

/**
 * Calculate priority score
 */
function calculatePriority(type: string, clauseCode: string): number {
  let basePriority = 50

  // Type multipliers
  const typeMultipliers: Record<string, number> = {
    missing_evidence: 10,
    overdue: 20,
    pending_approval: 15,
    onboarding: 5,
  }

  basePriority += typeMultipliers[type] || 0

  // Clause importance (higher clauses are more critical)
  const clauseNum = parseFloat(clauseCode)
  if (!isNaN(clauseNum)) {
    basePriority += Math.floor(clauseNum)
  }

  return basePriority
}

/**
 * Get action link
 */
function getActionLink(reqType: string, clauseCode: string): string {
  switch (reqType) {
    case 'policy':
    case 'procedure':
    case 'record':
      return `/evidence/new?type=${reqType.toUpperCase()}&clause=${clauseCode}`
    case 'risk_thinking':
      return '/risks/new'
    case 'review':
      if (clauseCode === '9.2') return '/audits/new'
      if (clauseCode === '9.3') return '/reviews/new'
      return '/dashboard'
    case 'action':
      return '/problems/new'
    default:
      return '/dashboard'
  }
}

/**
 * Get estimated time
 */
function getEstimatedTime(reqType: string): string {
  const times: Record<string, string> = {
    policy: '20 min',
    procedure: '30 min',
    record: '10 min',
    risk_thinking: '15 min',
    review: '20 min',
    action: '15 min',
  }
  return times[reqType] || '15 min'
}
