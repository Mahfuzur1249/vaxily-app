import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProviderHeader } from "@/components/provider/provider-header"
import { ProviderStats } from "@/components/provider/provider-stats"
import { TodayAppointments } from "@/components/provider/today-appointments"
import { PatientManagement } from "@/components/provider/patient-management"
import { RevenueOverview } from "@/components/provider/revenue-overview"

export default async function ProviderDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and verify provider role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "provider") {
    if (profile?.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/dashboard")
    }
  }

  // Get today's date for filtering
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  // Get provider statistics
  const [
    { count: totalPatients },
    { count: todayAppointments },
    { count: completedVaccinations },
    { count: pendingBookings },
  ] = await Promise.all([
    supabase.from("vaccination_records").select("user_id", { count: "exact", head: true }).eq("provider_id", user.id),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("provider_id", user.id)
      .gte("appointment_date", today)
      .lt("appointment_date", tomorrow),
    supabase.from("vaccination_records").select("*", { count: "exact", head: true }).eq("provider_id", user.id),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("provider_id", user.id)
      .eq("status", "pending"),
  ])

  // Get today's appointments
  const { data: appointments } = await supabase
    .from("bookings")
    .select(`
      *,
      vaccines (name, manufacturer),
      profiles!bookings_user_id_fkey (full_name, phone, email)
    `)
    .eq("provider_id", user.id)
    .gte("appointment_date", today)
    .lt("appointment_date", tomorrow)
    .order("appointment_date", { ascending: true })

  // Get recent patients (unique users from vaccination records)
  const { data: recentPatients } = await supabase
    .from("vaccination_records")
    .select(`
      user_id,
      date_administered,
      profiles!vaccination_records_user_id_fkey (full_name, email, phone)
    `)
    .eq("provider_id", user.id)
    .order("date_administered", { ascending: false })
    .limit(10)

  // Get revenue data (sum of completed bookings)
  const { data: revenueData } = await supabase
    .from("bookings")
    .select("payment_amount")
    .eq("provider_id", user.id)
    .eq("payment_status", "paid")

  const totalRevenue = revenueData?.reduce((sum, booking) => sum + (booking.payment_amount || 0), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderHeader user={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Dr. {profile.full_name}</h1>
          <p className="text-gray-600">{profile.provider_clinic_name || "Healthcare Provider Dashboard"}</p>
        </div>

        <div className="space-y-8">
          {/* Provider Statistics */}
          <ProviderStats
            totalPatients={totalPatients || 0}
            todayAppointments={todayAppointments || 0}
            completedVaccinations={completedVaccinations || 0}
            pendingBookings={pendingBookings || 0}
            totalRevenue={totalRevenue}
          />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <TodayAppointments appointments={appointments || []} />
              <PatientManagement patients={recentPatients || []} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <RevenueOverview totalRevenue={totalRevenue} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
