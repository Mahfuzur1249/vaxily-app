"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard } from "lucide-react"

interface Vaccine {
  id: string
  name: string
  manufacturer: string
  description: string
  price: number
}

interface Provider {
  id: string
  full_name: string
  provider_clinic_name: string | null
  provider_address: string | null
}

interface BookingFormProps {
  vaccines: Vaccine[]
  providers: Provider[]
  userId: string
}

export function BookingForm({ vaccines, providers, userId }: BookingFormProps) {
  const [formData, setFormData] = useState({
    vaccineId: "",
    providerId: "",
    appointmentDate: "",
    appointmentTime: "",
    location: "",
    specialInstructions: "",
  })
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "vaccineId") {
      const vaccine = vaccines.find((v) => v.id === value)
      setSelectedVaccine(vaccine || null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!selectedVaccine) {
      setError("Please select a vaccine")
      setIsLoading(false)
      return
    }

    try {
      // Create booking with pending payment status
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`)

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          user_id: userId,
          vaccine_id: formData.vaccineId,
          provider_id: formData.providerId || null,
          appointment_date: appointmentDateTime.toISOString(),
          location: formData.location,
          special_instructions: formData.specialInstructions,
          payment_amount: selectedVaccine.price,
          status: "pending",
          payment_status: "pending",
        })
        .select()
        .single()

      if (bookingError) throw bookingError

      // Redirect to payment page
      router.push(`/dashboard/payment/${booking.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Fill in your vaccination appointment information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vaccine Selection */}
            <div className="grid gap-2">
              <Label htmlFor="vaccine">Vaccine Type</Label>
              <Select value={formData.vaccineId} onValueChange={(value) => handleInputChange("vaccineId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vaccine" />
                </SelectTrigger>
                <SelectContent>
                  {vaccines.map((vaccine) => (
                    <SelectItem key={vaccine.id} value={vaccine.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{vaccine.name}</span>
                        <span className="ml-2 text-green-600 font-medium">${vaccine.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedVaccine && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{selectedVaccine.name}</strong> by {selectedVaccine.manufacturer}
                  </p>
                  <p className="text-sm text-blue-600">{selectedVaccine.description}</p>
                  <p className="text-sm font-medium text-green-600 mt-1">Price: ${selectedVaccine.price}</p>
                </div>
              )}
            </div>

            {/* Provider Selection */}
            <div className="grid gap-2">
              <Label htmlFor="provider">Healthcare Provider (Optional)</Label>
              <Select value={formData.providerId} onValueChange={(value) => handleInputChange("providerId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider or leave blank" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      <div>
                        <div className="font-medium">{provider.full_name}</div>
                        {provider.provider_clinic_name && (
                          <div className="text-sm text-gray-600">{provider.provider_clinic_name}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) => handleInputChange("appointmentTime", e.target.value)}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Clinic address or preferred location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>

            {/* Special Instructions */}
            <div className="grid gap-2">
              <Label htmlFor="instructions">Special Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Any special requirements or notes"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Payment Summary */}
            {selectedVaccine && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Payment Summary</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Vaccination Fee:</span>
                  <span className="font-medium">${selectedVaccine.price}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 mt-2">
                  <span className="font-medium text-gray-900">Total:</span>
                  <span className="font-bold text-green-600">${selectedVaccine.price}</span>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !selectedVaccine}>
              {isLoading ? "Processing..." : "Proceed to Payment"}
              <CreditCard className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
