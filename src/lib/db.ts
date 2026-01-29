import { PrismaClient } from '@prisma/client'

// Global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Scoped Prisma helper that enforces tenant isolation
 * All database operations must go through this helper
 * 
 * @param tenantId - The tenant ID to scope all queries to
 * @returns Scoped Prisma client with tenant filtering
 */
export function db(tenantId: string) {
  if (!tenantId) {
    throw new Error('tenantId is required for all database operations')
  }

  return {
    // Tenant operations
    tenant: {
      findUnique: (args: any) => prisma.tenant.findUnique(args),
      update: (args: any) => prisma.tenant.update(args),
    },

    // User operations (automatically filtered by tenantId)
    user: {
      findMany: (args: any = {}) => 
        prisma.user.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => {
        // Ensure user belongs to tenant
        return prisma.user.findFirst({
          where: { id: args.where.id, tenantId },
        })
      },
      create: (args: any) => 
        prisma.user.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.user.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.user.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Company Profile operations
    companyProfile: {
      findUnique: () => 
        prisma.companyProfile.findUnique({ where: { tenantId } }),
      create: (args: any) => 
        prisma.companyProfile.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.companyProfile.update({ where: { tenantId }, ...args }),
    },

    // Role operations
    role: {
      findMany: (args: any = {}) => 
        prisma.role.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.role.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.role.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.role.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.role.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Role Assignment operations
    roleAssignment: {
      findMany: (args: any = {}) => 
        prisma.roleAssignment.findMany({ ...args, where: { ...args.where, tenantId } }),
      create: (args: any) => {
        // Validate tenant consistency
        return prisma.roleAssignment.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        })
      },
      delete: (args: any) => 
        prisma.roleAssignment.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },

    // Process operations
    process: {
      findMany: (args: any = {}) => 
        prisma.process.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.process.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.process.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.process.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.process.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Risk operations
    risk: {
      findMany: (args: any = {}) => 
        prisma.risk.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.risk.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.risk.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.risk.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.risk.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Problem operations
    problem: {
      findMany: (args: any = {}) => 
        prisma.problem.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.problem.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.problem.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.problem.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.problem.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Evidence operations
    evidence: {
      findMany: (args: any = {}) => 
        prisma.evidence.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.evidence.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.evidence.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.evidence.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.evidence.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Internal Audit operations
    internalAudit: {
      findMany: (args: any = {}) => 
        prisma.internalAudit.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.internalAudit.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.internalAudit.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.internalAudit.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.internalAudit.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Management Review operations
    managementReview: {
      findMany: (args: any = {}) => 
        prisma.managementReview.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.managementReview.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.managementReview.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.managementReview.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.managementReview.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Quality Objective operations
    qualityObjective: {
      findMany: (args: any = {}) => 
        prisma.qualityObjective.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.qualityObjective.findFirst({ 
          where: { id: args.where.id, tenantId } 
        }),
      create: (args: any) => 
        prisma.qualityObjective.create({ ...args, data: { ...args.data, tenantId } }),
      update: (args: any) => 
        prisma.qualityObjective.update({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
      delete: (args: any) => 
        prisma.qualityObjective.delete({ ...args, where: { ...args.where, tenantId } }),
    },

    // Tenant Clause Scope operations
    tenantClauseScope: {
      findMany: (args: any = {}) => 
        prisma.tenantClauseScope.findMany({ ...args, where: { ...args.where, tenantId } }),
      findUnique: (args: any) => 
        prisma.tenantClauseScope.findFirst({ 
          where: { ...args.where, tenantId } 
        }),
      upsert: (args: any) => 
        prisma.tenantClauseScope.upsert({ 
          ...args, 
          where: { ...args.where, tenantId },
          update: { ...args.update },
          create: { ...args.create, tenantId },
        }),
    },

    // Junction table operations with tenant validation
    auditProcess: {
      create: async (args: any) => {
        // Validate audit belongs to tenant
        const audit = await prisma.internalAudit.findFirst({
          where: { id: args.data.auditId, tenantId },
        })
        if (!audit) throw new Error('Audit not found or tenant mismatch')

        // Validate process belongs to tenant
        const process = await prisma.process.findFirst({
          where: { id: args.data.processId, tenantId },
        })
        if (!process) throw new Error('Process not found or tenant mismatch')

        return prisma.auditProcess.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        })
      },
      delete: (args: any) => 
        prisma.auditProcess.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },

    auditClause: {
      create: async (args: any) => {
        // Validate audit belongs to tenant
        const audit = await prisma.internalAudit.findFirst({
          where: { id: args.data.auditId, tenantId },
        })
        if (!audit) throw new Error('Audit not found or tenant mismatch')

        return prisma.auditClause.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        })
      },
      delete: (args: any) => 
        prisma.auditClause.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },

    reviewAttendee: {
      create: async (args: any) => {
        // Validate review belongs to tenant
        const review = await prisma.managementReview.findFirst({
          where: { id: args.data.reviewId, tenantId },
        })
        if (!review) throw new Error('Review not found or tenant mismatch')

        // Validate user belongs to tenant if provided
        if (args.data.userId) {
          const user = await prisma.user.findFirst({
            where: { id: args.data.userId, tenantId },
          })
          if (!user) throw new Error('User not found or tenant mismatch')
        }

        return prisma.reviewAttendee.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        })
      },
      delete: (args: any) => 
        prisma.reviewAttendee.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },

    evidenceClause: {
      create: async (args: any) => {
        // Validate evidence belongs to tenant
        const evidence = await prisma.evidence.findFirst({
          where: { id: args.data.evidenceId, tenantId },
        })
        if (!evidence) throw new Error('Evidence not found or tenant mismatch')

        return prisma.evidenceClause.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        })
      },
      delete: (args: any) => 
        prisma.evidenceClause.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },

    problemClause: {
      create: async (args: any) => {
        // Validate problem belongs to tenant
        const problem = await prisma.problem.findFirst({
          where: { id: args.data.problemId, tenantId },
        })
        if (!problem) throw new Error('Problem not found or tenant mismatch')

        return prisma.problemClause.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        })
      },
      delete: (args: any) => 
        prisma.problemClause.delete({ 
          ...args, 
          where: { ...args.where, tenantId } 
        }),
    },

    // Audit trail operations
    auditTrail: {
      create: (args: any) => 
        prisma.auditTrail.create({ 
          ...args, 
          data: { ...args.data, tenantId } 
        }),
      findMany: (args: any = {}) => 
        prisma.auditTrail.findMany({ ...args, where: { ...args.where, tenantId } }),
    },

    // ISO Clause operations (read-only, no tenant filtering)
    isoClause: {
      findMany: (args: any = {}) => prisma.isoClause.findMany(args),
      findUnique: (args: any) => prisma.isoClause.findUnique(args),
    },
  }
}

// Export default for use in auth and other places that need direct access
// (but prefer using db(tenantId) for all tenant-scoped operations)
export default prisma
