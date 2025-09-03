import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VaccinationHistory } from "@/components/dashboard/vaccination-history"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { HealthStats } from "@/components/dashboard/health-stats"

export default async function UserDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Redirect non-users to their appropriate dashboards
  if (profile.role === "admin") {
    redirect("/admin")
  } else if (profile.role === "provider") {
    redirect("/provider")
  }

  // Get vaccination records
  const { data: vaccinations } = await supabase
    .from("vaccination_records")
    .select(`
      *,
      vaccines (name, manufacturer),
      profiles!vaccination_records_provider_id_fkey (full_name, provider_clinic_name)
    `)
    .eq("user_id", user.id)
    .order("date_administered", { ascending: false })

  // Get upcoming bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      *,
      vaccines (name, manufacturer, price),
      profiles!bookings_provider_id_fkey (full_name, provider_clinic_name)
    `)
    .eq("user_id", user.id)
    .gte("appointment_date", new Date().toISOString())
    .order("appointment_date", { ascending: true })

  // Get notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={profile} notifications={notifications || []} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {profile.full_name}</h1>
          <p className="text-gray-600">Manage your vaccination records and appointments</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <HealthStats vaccinations={vaccinations || []} />
            <VaccinationHistory vaccinations={vaccinations || []} />
            <UpcomingAppointments bookings={bookings || []} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
