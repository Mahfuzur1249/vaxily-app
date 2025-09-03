import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, User, MessageCircle, Download, Bell } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Book Appointment",
      description: "Schedule your next vaccination",
      icon: Calendar,
      href: "/dashboard/book",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "View Records",
      description: "Access your vaccination history",
      icon: FileText,
      href: "/dashboard/records",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Download Certificate",
      description: "Get your vaccination certificate",
      icon: Download,
      href: "/dashboard/certificates",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Update Profile",
      description: "Manage your personal information",
      icon: User,
      href: "/dashboard/profile",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Contact Support",
      description: "Get help with your account",
      icon: MessageCircle,
      href: "/dashboard/support",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      title: "Notifications",
      description: "Manage your preferences",
      icon: Bell,
      href: "/dashboard/settings",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-gray-600">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
