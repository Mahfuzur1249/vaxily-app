import { Card, CardContent } from "@/components/ui/card"
import { Shield, Calendar, Award, TrendingUp } from "lucide-react"

interface VaccinationRecord {
  id: string
  date_administered: string
  vaccines: {
    name: string
  }
}

interface HealthStatsProps {
  vaccinations: VaccinationRecord[]
}

export function HealthStats({ vaccinations }: HealthStatsProps) {
  const totalVaccinations = vaccinations.length
  const thisYear = new Date().getFullYear()
  const thisYearVaccinations = vaccinations.filter(
    (v) => new Date(v.date_administered).getFullYear() === thisYear,
  ).length

  const uniqueVaccines = new Set(vaccinations.map((v) => v.vaccines.name)).size
  const lastVaccination = vaccinations[0]?.date_administered ? new Date(vaccinations[0].date_administered) : null

  const stats = [
    {
      title: "Total Vaccinations",
      value: totalVaccinations,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "This Year",
      value: thisYearVaccinations,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Vaccine Types",
      value: uniqueVaccines,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Compliance",
      value: totalVaccinations > 0 ? "Up to Date" : "Needs Update",
      icon: TrendingUp,
      color: totalVaccinations > 0 ? "text-green-600" : "text-orange-600",
      bgColor: totalVaccinations > 0 ? "bg-green-100" : "bg-orange-100",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.title === "Compliance" && lastVaccination && (
                  <p className="text-xs text-gray-500 mt-1">Last: {lastVaccination.toLocaleDateString()}</p>
                )}
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
