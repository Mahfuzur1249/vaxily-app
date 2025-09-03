import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, Shield, Calendar, MessageCircle, TrendingUp } from "lucide-react"

interface SystemStatsProps {
  totalUsers: number
  totalProviders: number
  totalVaccinations: number
  pendingBookings: number
  openTickets: number
}

export function SystemStats({
  totalUsers,
  totalProviders,
  totalVaccinations,
  pendingBookings,
  openTickets,
}: SystemStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
    },
    {
      title: "Active Providers",
      value: totalProviders,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+5%",
    },
    {
      title: "Vaccinations Given",
      value: totalVaccinations,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+23%",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "-8%",
    },
    {
      title: "Open Tickets",
      value: openTickets,
      icon: MessageCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      change: "+3%",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "Stable",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span
                className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : stat.change.startsWith("-") ? "text-red-600" : "text-gray-600"}`}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
