import { DashboardContent } from '@/app/components/dashboard-content'
import { getSession } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // Server-side authentication check
  const session = await getSession()
  
  if (!session || !session.user) {
    redirect('/auth/login')
  }

  return <DashboardContent />
}
