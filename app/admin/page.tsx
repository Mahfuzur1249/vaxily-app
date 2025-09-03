import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { SystemStats } from "@/components/admin/system-stats"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserManagement } from "@/components/admin/user-management"
import { VaccineInventory } from "@/components/admin/vaccine-inventory"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and verify admin role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get system statistics
  const [
    { count: totalUsers },
    { count: totalProviders },
    { count: totalVaccinations },
    { count: pendingBookings },
    { count: openTickets },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "provider"),
    supabase.from("vaccination_records").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("support_tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
  ])

  // Get recent users
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent bookings
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      vaccines (name),
      profiles!bookings_user_id_fkey (full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get vaccines
  const { data: vaccines } = await supabase.from("vaccines").select("*").order("name")

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and management</p>
        </div>

        <div className="space-y-8">
          {/* System Statistics */}
          <SystemStats
            totalUsers={totalUsers || 0}
            totalProviders={totalProviders || 0}
            totalVaccinations={totalVaccinations || 0}
            pendingBookings={pendingBookings || 0}
            openTickets={openTickets || 0}
          />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <RecentActivity recentUsers={recentUsers || []} recentBookings={recentBookings || []} />

            {/* User Management Preview */}
            <UserManagement users={recentUsers || []} />
          </div>

          {/* Vaccine Inventory */}
          <VaccineInventory vaccines={vaccines || []} />
        </div>
      </main>
    </div>
  )
}
