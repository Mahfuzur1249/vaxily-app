import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  appointment_date: string
  status: string
  location: string
  payment_status: string
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

interface UpcomingAppointmentsProps {
  bookings: Booking[]
}

export function UpcomingAppointments({ bookings }: UpcomingAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled vaccination appointments</CardDescription>
          </div>
          <Link href="/dashboard/book">
            <Button size="sm">Book New</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{booking.vaccines.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                    <Badge className={getPaymentStatusColor(booking.payment_status)}>{booking.payment_status}</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(booking.appointment_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(booking.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  {booking.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.location}
                    </div>
                  )}
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />${booking.vaccines.price}
                  </div>
                </div>

                {booking.profiles && (
                  <p className="text-sm text-gray-500 mt-2">
                    Provider: {booking.profiles.provider_clinic_name || booking.profiles.full_name}
                  </p>
                )}

                <div className="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  {booking.payment_status === "pending" && <Button size="sm">Pay Now</Button>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
            <p className="text-gray-600 mb-4">Book your next vaccination appointment</p>
            <Link href="/dashboard/book">
              <Button>Book Appointment</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
