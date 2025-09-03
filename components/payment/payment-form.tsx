"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, CreditCard, Lock } from "lucide-react"

interface Booking {
  id: string
  appointment_date: string
  location: string
  payment_amount: number
  special_instructions: string
  vaccines: {
    name: string
    manufacturer: string
    price: number
  }
  profiles: {
    full_name: string
    provider_clinic_name: string
  } | null
}

interface PaymentFormProps {
  booking: Booking
}

export function PaymentForm({ booking }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    handleInputChange("cardNumber", formatted)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    handleInputChange("expiryDate", formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate payment processing (in real app, use Stripe API)
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock payment ID
      const paymentId = `pi_${Math.random().toString(36).substr(2, 9)}`

      // Update booking with payment confirmation
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          payment_status: "paid",
          payment_id: paymentId,
          status: "confirmed",
        })
        .eq("id", booking.id)

      if (updateError) throw updateError

      // Create notification
      await supabase.from("notifications").insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        title: "Payment Confirmed",
        message: `Your payment for ${booking.vaccines.name} vaccination has been processed successfully.`,
        type: "success",
      })

      // Redirect to success page
      router.push(`/dashboard/payment/success/${booking.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Review your appointment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{booking.vaccines.name}</h3>
              <p className="text-sm text-gray-600">{booking.vaccines.manufacturer}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span>{new Date(booking.appointment_date).toLocaleString()}</span>
              </div>
              {booking.location && (
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{booking.location}</span>
                </div>
              )}
              {booking.profiles && (
                <div className="text-sm">
                  <span className="font-medium">Provider: </span>
                  {booking.profiles.provider_clinic_name || booking.profiles.full_name}
                </div>
              )}
            </div>

            {booking.special_instructions && (
              <>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Special Instructions</h4>
                  <p className="text-sm text-gray-600">{booking.special_instructions}</p>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vaccination Fee:</span>
                <span>${booking.payment_amount}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span className="text-green-600">${booking.payment_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Information
            </CardTitle>
            <CardDescription>Enter your payment details securely</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  required
                  value={paymentData.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  value={paymentData.cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    required
                    maxLength={5}
                    value={paymentData.expiryDate}
                    onChange={handleExpiryChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    required
                    maxLength={4}
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Lock className="w-4 h-4 mr-2" />
                Your payment information is encrypted and secure
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing Payment..." : `Pay $${booking.payment_amount}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
