import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding ISO 9001 clauses...')

  const clauses = [
    {
      code: '4.1',
      title: 'Understanding the organization and its context',
      plainEnglish: 'Understand your organization and the environment it operates in',
      auditorExpectation: 'Organization has identified internal and external factors relevant to its purpose',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['company'],
    },
    {
      code: '4.2',
      title: 'Understanding the needs and expectations of interested parties',
      plainEnglish: 'Identify who cares about your quality and what they need',
      auditorExpectation: 'Organization has identified interested parties and their requirements',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['company'],
    },
    {
      code: '4.3',
      title: 'Determining the scope of the quality management system',
      plainEnglish: 'Define what parts of your business the QMS covers',
      auditorExpectation: 'Scope statement is documented and justified',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['company'],
    },
    {
      code: '4.4',
      title: 'Processes and their interactions',
      plainEnglish: 'Map out your key business processes and how they connect',
      auditorExpectation: 'Processes are identified, defined, and their interactions understood',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['processes'],
    },
    {
      code: '5.1',
      title: 'Leadership and commitment',
      plainEnglish: 'Top management shows they care about quality',
      auditorExpectation: 'Top management demonstrates leadership and commitment',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['company'],
    },
    {
      code: '5.2',
      title: 'Quality Policy',
      plainEnglish: 'Have a clear Quality Policy that everyone knows',
      auditorExpectation: 'Quality policy is established, communicated, and maintained',
      requiredEvidenceTypes: ['policy'],
      moduleLinks: ['evidence'],
    },
    {
      code: '5.3',
      title: 'Organizational roles, responsibilities and authorities',
      plainEnglish: 'Everyone knows their role in quality management',
      auditorExpectation: 'Roles and responsibilities are assigned and communicated',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['company'],
    },
    {
      code: '6.1',
      title: 'Actions to address risks and opportunities',
      plainEnglish: 'Identify and manage risks and opportunities',
      auditorExpectation: 'Risks and opportunities are identified and actions planned',
      requiredEvidenceTypes: ['risk_thinking'],
      moduleLinks: ['risks'],
    },
    {
      code: '6.2',
      title: 'Quality objectives and planning to achieve them',
      plainEnglish: 'Set quality goals and plan how to achieve them',
      auditorExpectation: 'Quality objectives are established and plans made to achieve them',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['objectives'],
    },
    {
      code: '7.1',
      title: 'Resources',
      plainEnglish: 'Make sure you have what you need to deliver quality',
      auditorExpectation: 'Resources needed for the QMS are determined and provided',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: [],
    },
    {
      code: '7.2',
      title: 'Competence',
      plainEnglish: 'People have the skills they need',
      auditorExpectation: 'Competence requirements are determined and met',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: [],
    },
    {
      code: '7.3',
      title: 'Awareness',
      plainEnglish: 'Everyone understands the quality policy and objectives',
      auditorExpectation: 'Personnel are aware of the quality policy and objectives',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: [],
    },
    {
      code: '7.4',
      title: 'Communication',
      plainEnglish: 'Quality information is shared effectively',
      auditorExpectation: 'Internal and external communications are planned and implemented',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: [],
    },
    {
      code: '7.5',
      title: 'Documented information',
      plainEnglish: 'Keep the right documents and records',
      auditorExpectation: 'Documented information is controlled and maintained',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['evidence'],
    },
    {
      code: '8.1',
      title: 'Operational planning and control',
      plainEnglish: 'Plan and control your operations',
      auditorExpectation: 'Operations are planned and controlled',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['processes'],
    },
    {
      code: '8.2',
      title: 'Requirements for products and services',
      plainEnglish: 'Understand what customers want',
      auditorExpectation: 'Customer requirements are determined and reviewed',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['processes'],
    },
    {
      code: '8.3',
      title: 'Design and development of products and services',
      plainEnglish: 'Design products and services properly',
      auditorExpectation: 'Design and development processes are planned and controlled',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['processes'],
    },
    {
      code: '8.4',
      title: 'Control of externally provided processes, products and services',
      plainEnglish: 'Manage suppliers and external providers',
      auditorExpectation: 'External providers are evaluated and controlled',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['processes'],
    },
    {
      code: '8.5',
      title: 'Production and service provision',
      plainEnglish: 'Deliver products and services consistently',
      auditorExpectation: 'Production and service provision is controlled',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['processes'],
    },
    {
      code: '8.6',
      title: 'Release of products and services',
      plainEnglish: 'Check products before releasing them',
      auditorExpectation: 'Products and services are verified before release',
      requiredEvidenceTypes: ['record'],
      moduleLinks: ['processes'],
    },
    {
      code: '8.7',
      title: 'Control of nonconforming outputs',
      plainEnglish: 'Handle problems when things go wrong',
      auditorExpectation: 'Nonconforming outputs are identified and controlled',
      requiredEvidenceTypes: ['procedure'],
      moduleLinks: ['problems'],
    },
    {
      code: '9.1',
      title: 'Monitoring, measurement, analysis and evaluation',
      plainEnglish: 'Measure how well you are doing',
      auditorExpectation: 'Performance is monitored and measured',
      requiredEvidenceTypes: ['record'],
      moduleLinks: ['objectives'],
    },
    {
      code: '9.2',
      title: 'Internal audit',
      plainEnglish: 'Conduct internal audits to check your system',
      auditorExpectation: 'Internal audits are conducted at planned intervals',
      requiredEvidenceTypes: ['review'],
      moduleLinks: ['audits'],
    },
    {
      code: '9.3',
      title: 'Management review',
      plainEnglish: 'Management reviews the system regularly',
      auditorExpectation: 'Management reviews are conducted at planned intervals',
      requiredEvidenceTypes: ['review'],
      moduleLinks: ['reviews'],
    },
    {
      code: '10.1',
      title: 'General - Improvement',
      plainEnglish: 'Continuously improve your system',
      auditorExpectation: 'Opportunities for improvement are identified and acted upon',
      requiredEvidenceTypes: ['action'],
      moduleLinks: ['problems'],
    },
    {
      code: '10.2',
      title: 'Nonconformity and corrective action',
      plainEnglish: 'Fix problems and prevent them from happening again',
      auditorExpectation: 'Nonconformities are addressed with corrective actions',
      requiredEvidenceTypes: ['action'],
      moduleLinks: ['problems'],
    },
    {
      code: '10.3',
      title: 'Continual improvement',
      plainEnglish: 'Keep getting better',
      auditorExpectation: 'Continual improvement is demonstrated',
      requiredEvidenceTypes: ['action'],
      moduleLinks: ['problems'],
    },
  ]

  for (const clause of clauses) {
    await prisma.isoClause.upsert({
      where: { code: clause.code },
      update: clause,
      create: clause,
    })
  }

  console.log(`Seeded ${clauses.length} ISO 9001 clauses`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
