import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react"

interface RevenueOverviewProps {
  totalRevenue: number
}

export function RevenueOverview({ totalRevenue }: RevenueOverviewProps) {
  const thisMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="space-y-6">
      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Revenue Overview
          </CardTitle>
          <CardDescription>Your earnings summary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">${(totalRevenue * 0.3).toFixed(2)}</p>
                <p className="text-xs text-gray-600">This Month</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">${(totalRevenue * 0.1).toFixed(2)}</p>
                <p className="text-xs text-gray-600">This Week</p>
              </div>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <DollarSign className="w-4 h-4 mr-2" />
              Payment History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
