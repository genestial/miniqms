import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Mini QMS</h1>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm hover:underline">
                Dashboard
              </a>
              <a href="/processes" className="text-sm hover:underline">
                Processes
              </a>
              <a href="/risks" className="text-sm hover:underline">
                Risks
              </a>
              <a href="/problems" className="text-sm hover:underline">
                Problems
              </a>
              <a href="/evidence" className="text-sm hover:underline">
                Evidence
              </a>
              <a href="/audits" className="text-sm hover:underline">
                Audits
              </a>
              <a href="/reviews" className="text-sm hover:underline">
                Reviews
              </a>
              <a href="/objectives" className="text-sm hover:underline">
                Objectives
              </a>
              <a href="/company" className="text-sm hover:underline">
                Company
              </a>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
