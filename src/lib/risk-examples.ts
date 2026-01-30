/**
 * Industry-specific risk examples for onboarding
 */

export interface RiskExample {
  type: 'RISK' | 'OPPORTUNITY'
  description: string
  impact: string
  likelihood: string
  treatmentNotes: string
  industry: string
}

export const RISK_EXAMPLES: Record<string, RiskExample[]> = {
  'Technology/Software': [
    {
      type: 'RISK',
      description: 'Data breach or security incident exposing customer information',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Implement regular security audits, use encryption, train staff on security best practices',
      industry: 'Technology/Software',
    },
    {
      type: 'RISK',
      description: 'Key developer leaves the company, causing project delays',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Document processes, cross-train team members, maintain knowledge base',
      industry: 'Technology/Software',
    },
    {
      type: 'OPPORTUNITY',
      description: 'New technology could improve our service delivery efficiency',
      impact: 'Medium',
      likelihood: 'High',
      treatmentNotes: 'Research new tools, pilot test with small team, evaluate ROI',
      industry: 'Technology/Software',
    },
    {
      type: 'RISK',
      description: 'Software bugs in production affecting customer satisfaction',
      impact: 'Medium',
      likelihood: 'High',
      treatmentNotes: 'Implement automated testing, code reviews, staging environment',
      industry: 'Technology/Software',
    },
  ],
  'Professional Services': [
    {
      type: 'RISK',
      description: 'Client dissatisfaction leading to loss of business',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Regular client check-ins, clear communication, quality assurance processes',
      industry: 'Professional Services',
    },
    {
      type: 'RISK',
      description: 'Key consultant unavailable, impacting project delivery',
      impact: 'High',
      likelihood: 'Low',
      treatmentNotes: 'Maintain backup resources, cross-train team, document project knowledge',
      industry: 'Professional Services',
    },
    {
      type: 'OPPORTUNITY',
      description: 'Expanding service offerings to new market segments',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Market research, develop new service packages, train team on new offerings',
      industry: 'Professional Services',
    },
    {
      type: 'RISK',
      description: 'Missed deadlines due to resource constraints',
      impact: 'Medium',
      likelihood: 'Medium',
      treatmentNotes: 'Better project planning, resource allocation, buffer time in schedules',
      industry: 'Professional Services',
    },
  ],
  'Manufacturing': [
    {
      type: 'RISK',
      description: 'Supply chain disruption affecting production',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Diversify suppliers, maintain inventory buffers, develop alternative suppliers',
      industry: 'Manufacturing',
    },
    {
      type: 'RISK',
      description: 'Product quality issues leading to customer complaints',
      impact: 'High',
      likelihood: 'Low',
      treatmentNotes: 'Quality control checks, regular equipment maintenance, staff training',
      industry: 'Manufacturing',
    },
    {
      type: 'OPPORTUNITY',
      description: 'New manufacturing process could reduce costs',
      impact: 'Medium',
      likelihood: 'High',
      treatmentNotes: 'Research new technologies, pilot test, calculate cost savings',
      industry: 'Manufacturing',
    },
    {
      type: 'RISK',
      description: 'Equipment breakdown causing production delays',
      impact: 'Medium',
      likelihood: 'Medium',
      treatmentNotes: 'Preventive maintenance schedule, backup equipment, maintenance contracts',
      industry: 'Manufacturing',
    },
  ],
  'Healthcare': [
    {
      type: 'RISK',
      description: 'Patient safety incident or medical error',
      impact: 'High',
      likelihood: 'Low',
      treatmentNotes: 'Staff training, checklists, regular audits, incident reporting system',
      industry: 'Healthcare',
    },
    {
      type: 'RISK',
      description: 'Data privacy breach of patient information',
      impact: 'High',
      likelihood: 'Low',
      treatmentNotes: 'HIPAA compliance training, secure systems, access controls, regular audits',
      industry: 'Healthcare',
    },
    {
      type: 'OPPORTUNITY',
      description: 'New treatment method could improve patient outcomes',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Research new methods, staff training, pilot program, measure outcomes',
      industry: 'Healthcare',
    },
  ],
  'General Business': [
    {
      type: 'RISK',
      description: 'Loss of key customer affecting revenue',
      impact: 'High',
      likelihood: 'Medium',
      treatmentNotes: 'Strengthen customer relationships, diversify customer base, improve service quality',
      industry: 'General Business',
    },
    {
      type: 'RISK',
      description: 'Staff turnover affecting operations',
      impact: 'Medium',
      likelihood: 'Medium',
      treatmentNotes: 'Improve workplace culture, competitive compensation, career development opportunities',
      industry: 'General Business',
    },
    {
      type: 'OPPORTUNITY',
      description: 'Market expansion to new geographic areas',
      impact: 'High',
      likelihood: 'Low',
      treatmentNotes: 'Market research, develop expansion plan, secure resources, pilot test',
      industry: 'General Business',
    },
    {
      type: 'RISK',
      description: 'Economic downturn affecting sales',
      impact: 'High',
      likelihood: 'Low',
      treatmentNotes: 'Diversify revenue streams, build cash reserves, flexible cost structure',
      industry: 'General Business',
    },
  ],
}

/**
 * Get risk examples for an industry
 */
export function getRiskExamples(industry: string): RiskExample[] {
  return RISK_EXAMPLES[industry] || RISK_EXAMPLES['General Business']
}

/**
 * Get all available industries
 */
export function getIndustries(): string[] {
  return Object.keys(RISK_EXAMPLES)
}
