import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { bookingId, paymentIntentId } = await request.json()
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update booking with payment confirmation
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: "paid",
        payment_id: paymentIntentId,
        status: "confirmed",
      })
      .eq("id", bookingId)
      .eq("user_id", user.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
    }

    // Create success notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: "Payment Confirmed",
      message: "Your vaccination appointment payment has been processed successfully.",
      type: "success",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment confirmation failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
