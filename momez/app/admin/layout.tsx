import AdminSidebar from '@/components/admin/AdminSidebar'
import PageTransition from '@/components/PageTransition'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-10 relative">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
