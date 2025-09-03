import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PaymentForm } from "@/components/payment/payment-form"

interface PaymentPageProps {
  params: Promise<{ bookingId: string }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { bookingId } = await params
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

  // Get booking details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      vaccines (name, manufacturer, price),
      profiles!bookings_provider_id_fkey (full_name, provider_clinic_name)
    `)
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .single()

  if (!booking) {
    redirect("/dashboard")
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Secure payment for your vaccination appointment</p>
        </div>

        <PaymentForm booking={booking} />
      </main>
    </div>
  )
}
