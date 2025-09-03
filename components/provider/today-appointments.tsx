import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Phone, Mail, CheckCircle } from "lucide-react"

interface Appointment {
  id: string
  appointment_date: string
  status: string
  location: string
  vaccines: {
    name: string
    manufacturer: string
  }
  profiles: {
    full_name: string
    phone: string | null
    email: string
  }
}

interface TodayAppointmentsProps {
  appointments: Appointment[]
}

export function TodayAppointments({ appointments }: TodayAppointmentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
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
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Appointments
            </CardTitle>
            <CardDescription>Scheduled vaccinations for today</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{appointment.profiles.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.profiles.full_name}</h3>
                      <p className="text-sm text-gray-600">{appointment.vaccines.name}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(appointment.appointment_date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {appointment.profiles.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {appointment.profiles.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {appointment.profiles.email}
                  </div>
                  {appointment.location && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {appointment.location}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {appointment.status === "confirmed" && (
                    <Button size="sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments today</h3>
            <p className="text-gray-600">Your schedule is clear for today</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
