/**
 * Standards Engine - ISO 9001 clause metadata and rules
 * This module provides the central mapping between ISO 9001 clauses
 * and system requirements
 */

export interface IsoClause {
  id: string
  code: string
  title: string
  plainEnglish: string
  auditorExpectation: string
  requiredEvidenceTypes: EvidenceRequirement[]
  moduleLinks: string[]
}

export interface EvidenceRequirement {
  type: 'policy' | 'procedure' | 'record' | 'review' | 'action' | 'risk_thinking'
  description: string
  clause?: string
}

/**
 * ISO 9001 clause requirements mapping
 * This will be seeded from the database, but we provide a reference here
 */
export const ISO_9001_CLAUSE_REQUIREMENTS: Record<string, EvidenceRequirement[]> = {
  '4.1': [
    { type: 'procedure', description: 'Understanding the organization and its context' },
  ],
  '4.2': [
    { type: 'procedure', description: 'Understanding the needs and expectations of interested parties' },
  ],
  '4.3': [
    { type: 'procedure', description: 'Determining the scope of the quality management system' },
  ],
  '4.4': [
    { type: 'procedure', description: 'Processes and their interactions' },
  ],
  '5.1': [
    { type: 'procedure', description: 'Leadership and commitment' },
  ],
  '5.2': [
    { type: 'policy', description: 'Quality Policy' },
  ],
  '5.3': [
    { type: 'procedure', description: 'Organizational roles, responsibilities and authorities' },
  ],
  '6.1': [
    { type: 'risk_thinking', description: 'Actions to address risks and opportunities' },
  ],
  '6.2': [
    { type: 'procedure', description: 'Quality objectives and planning to achieve them' },
  ],
  '7.1': [
    { type: 'procedure', description: 'Resources' },
  ],
  '7.2': [
    { type: 'procedure', description: 'Competence' },
  ],
  '7.3': [
    { type: 'procedure', description: 'Awareness' },
  ],
  '7.4': [
    { type: 'procedure', description: 'Communication' },
  ],
  '7.5': [
    { type: 'procedure', description: 'Documented information' },
  ],
  '8.1': [
    { type: 'procedure', description: 'Operational planning and control' },
  ],
  '8.2': [
    { type: 'procedure', description: 'Requirements for products and services' },
  ],
  '8.3': [
    { type: 'procedure', description: 'Design and development of products and services' },
  ],
  '8.4': [
    { type: 'procedure', description: 'Control of externally provided processes, products and services' },
  ],
  '8.5': [
    { type: 'procedure', description: 'Production and service provision' },
  ],
  '8.6': [
    { type: 'record', description: 'Release of products and services' },
  ],
  '8.7': [
    { type: 'procedure', description: 'Control of nonconforming outputs' },
  ],
  '9.1': [
    { type: 'record', description: 'Monitoring, measurement, analysis and evaluation' },
  ],
  '9.2': [
    { type: 'review', description: 'Internal audit' },
  ],
  '9.3': [
    { type: 'review', description: 'Management review' },
  ],
  '10.1': [
    { type: 'action', description: 'General - Improvement' },
  ],
  '10.2': [
    { type: 'action', description: 'Nonconformity and corrective action' },
  ],
  '10.3': [
    { type: 'action', description: 'Continual improvement' },
  ],
}

/**
 * Get evidence requirements for a clause
 */
export function getEvidenceRequirements(clauseCode: string): EvidenceRequirement[] {
  return ISO_9001_CLAUSE_REQUIREMENTS[clauseCode] || []
}

/**
 * Check if clause requires specific evidence type
 */
export function requiresEvidenceType(
  clauseCode: string,
  evidenceType: EvidenceRequirement['type']
): boolean {
  const requirements = getEvidenceRequirements(clauseCode)
  return requirements.some(req => req.type === evidenceType)
}

/**
 * Get plain English explanation for clause
 */
export function getClausePlainEnglish(clauseCode: string): string {
  // This will be loaded from database, but provide fallback
  const fallbacks: Record<string, string> = {
    '4.1': 'Understand your organization and the environment it operates in',
    '5.2': 'Have a clear Quality Policy that everyone knows',
    '6.1': 'Identify and manage risks and opportunities',
    '9.2': 'Conduct internal audits to check your system',
    '9.3': 'Management reviews the system regularly',
  }
  return fallbacks[clauseCode] || `Clause ${clauseCode} requirements`
}
