import { db } from './db'
import { getEvidenceRequirements, requiresEvidenceType } from './standards'
import type { IsoClause } from './standards'

export type ClauseStatus = 'green' | 'amber' | 'red'

export interface ClauseCard {
  clauseCode: string
  clauseTitle: string
  status: ClauseStatus
  plainEnglishWhy: string
  missingItems: string[]
  fixLinks: Array<{ label: string; href: string }>
}

/**
 * Calculate compliance status for a clause
 */
export async function calculateClauseStatus(
  tenantId: string,
  clause: IsoClause
): Promise<ClauseCard> {
  const requirements = getEvidenceRequirements(clause.code)
  const missingItems: string[] = []
  const fixLinks: Array<{ label: string; href: string }> = []

  // Check each requirement
  for (const req of requirements) {
    const hasRequirement = await checkRequirement(tenantId, clause.code, req)
    if (!hasRequirement) {
      missingItems.push(req.description)
      fixLinks.push(...getFixLinks(clause.code, req))
    }
  }

  // Determine status
  let status: ClauseStatus = 'green'
  if (missingItems.length > 0) {
    status = missingItems.length === requirements.length ? 'red' : 'amber'
  }

  // Generate plain English explanation
  const plainEnglishWhy = generatePlainEnglishWhy(status, missingItems, clause)

  return {
    clauseCode: clause.code,
    clauseTitle: clause.title,
    status,
    plainEnglishWhy,
    missingItems,
    fixLinks,
  }
}

/**
 * Check if a requirement is met
 */
async function checkRequirement(
  tenantId: string,
  clauseCode: string,
  requirement: { type: string; description: string }
): Promise<boolean> {
  const tenantDb = db(tenantId)

  switch (requirement.type) {
    case 'policy':
      // Check for approved policy evidence linked to clause
      const policies = await tenantDb.evidence.findMany({
        where: {
          type: 'POLICY',
          status: 'APPROVED',
        },
      })
      // Check if any policy is linked to this clause
      // This would require checking evidence_clauses junction table
      return policies.length > 0

    case 'procedure':
      // Check for approved procedure evidence
      const procedures = await tenantDb.evidence.findMany({
        where: {
          type: 'PROCEDURE',
          status: 'APPROVED',
        },
      })
      return procedures.length > 0

    case 'record':
      // Check for records
      const records = await tenantDb.evidence.findMany({
        where: {
          type: 'RECORD',
          status: 'APPROVED',
        },
      })
      return records.length > 0

    case 'risk_thinking':
      // Check for risks/opportunities
      const risks = await tenantDb.risk.findMany()
      return risks.length > 0

    case 'review':
      if (clauseCode === '9.2') {
        // Internal audit required
        const audits = await tenantDb.internalAudit.findMany()
        return audits.length > 0
      } else if (clauseCode === '9.3') {
        // Management review required
        const reviews = await tenantDb.managementReview.findMany()
        return reviews.length > 0
      }
      return false

    case 'action':
      // Check for problems/improvements
      const problems = await tenantDb.problem.findMany()
      return problems.length > 0

    default:
      return false
  }
}

/**
 * Generate fix links for a requirement
 */
function getFixLinks(
  clauseCode: string,
  requirement: { type: string; description: string }
): Array<{ label: string; href: string }> {
  const links: Array<{ label: string; href: string }> = []

  switch (requirement.type) {
    case 'policy':
    case 'procedure':
    case 'record':
      links.push({ label: 'Add Evidence', href: `/evidence/new?type=${requirement.type}&clause=${clauseCode}` })
      break

    case 'risk_thinking':
      links.push({ label: 'Add Risk', href: '/risks/new' })
      break

    case 'review':
      if (clauseCode === '9.2') {
        links.push({ label: 'Record Audit', href: '/audits/new' })
      } else if (clauseCode === '9.3') {
        links.push({ label: 'Record Review', href: '/reviews/new' })
      }
      break

    case 'action':
      links.push({ label: 'Log Problem', href: '/problems/new' })
      break
  }

  return links
}

/**
 * Generate plain English explanation
 */
function generatePlainEnglishWhy(
  status: ClauseStatus,
  missingItems: string[],
  clause: IsoClause
): string {
  if (status === 'green') {
    return `All requirements for ${clause.code} are met. ${clause.plainEnglish}`
  }

  if (status === 'red') {
    return `Missing all required items for ${clause.code}. You need: ${missingItems.join(', ')}. ${clause.plainEnglish}`
  }

  return `Partially compliant. Missing: ${missingItems.join(', ')}. ${clause.plainEnglish}`
}

/**
 * Calculate overall readiness percentage
 */
export async function calculateReadinessPercentage(
  tenantId: string,
  clauses: IsoClause[]
): Promise<number> {
  if (clauses.length === 0) return 0

  let compliantCount = 0
  for (const clause of clauses) {
    const card = await calculateClauseStatus(tenantId, clause)
    if (card.status === 'green') {
      compliantCount++
    }
  }

  return Math.round((compliantCount / clauses.length) * 100)
}

/**
 * Get all clause cards for dashboard
 */
export async function getAllClauseCards(
  tenantId: string,
  clauses: IsoClause[]
): Promise<ClauseCard[]> {
  const cards: ClauseCard[] = []
  for (const clause of clauses) {
    const card = await calculateClauseStatus(tenantId, clause)
    cards.push(card)
  }
  return cards
}
