import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, Shield, Clock, DollarSign } from "lucide-react"

interface ProviderStatsProps {
  totalPatients: number
  todayAppointments: number
  completedVaccinations: number
  pendingBookings: number
  totalRevenue: number
}

export function ProviderStats({
  totalPatients,
  todayAppointments,
  completedVaccinations,
  pendingBookings,
  totalRevenue,
}: ProviderStatsProps) {
  const stats = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Today's Appointments",
      value: todayAppointments,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Vaccinations Given",
      value: completedVaccinations,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
