import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './db'
import { verifyPassword } from './auth-helpers'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        // MVP: Simple email-based authentication
        // For production, implement proper password hashing with bcrypt
        // For now, find user by email (password validation would go here)
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { tenant: true },
          })

          if (!user) {
            return null
          }

          // Note: For MVP, if user doesn't have passwordHash set, allow access
          // In production, all users should have passwordHash
          // TODO: Add passwordHash field to User model when implementing full auth
          if (credentials.password) {
            // If password is provided, verify it (when passwordHash is implemented)
            // const isValid = await verifyPassword(credentials.password, user.passwordHash)
            // if (!isValid) return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            tenantId: user.tenantId,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tenantId = user.tenantId
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.tenantId = token.tenantId as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}
