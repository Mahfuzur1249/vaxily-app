import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BookingForm } from "@/components/booking/booking-form"

export default async function BookAppointmentPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "user") {
    redirect("/dashboard")
  }

  // Get available vaccines
  const { data: vaccines } = await supabase.from("vaccines").select("*").eq("is_active", true).order("name")

  // Get available providers
  const { data: providers } = await supabase
    .from("profiles")
    .select("id, full_name, provider_clinic_name, provider_address")
    .eq("role", "provider")
    .order("full_name")

  // Get notifications for header
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Vaccination Appointment</h1>
          <p className="text-gray-600">Schedule your vaccination with a certified provider</p>
        </div>

        <BookingForm vaccines={vaccines || []} providers={providers || []} userId={user.id} />
      </main>
    </div>
  )
}
