import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, vaccines(price)")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // In a real implementation, you would create a Stripe PaymentIntent here
    // For demo purposes, we'll return a mock client secret
    const mockClientSecret = `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      clientSecret: mockClientSecret,
      amount: booking.payment_amount * 100, // Convert to cents
    })
  } catch (error) {
    console.error("Payment intent creation failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
