import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to appropriate dashboard
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role === "admin") {
      redirect("/admin")
    } else if (profile?.role === "provider") {
      redirect("/provider")
    } else {
      redirect("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold text-gray-900">VAXILY</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Professional Vaccination Management System</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Streamline your vaccination records, book appointments, and manage immunization certificates with our
            comprehensive healthcare platform.
          </p>

          <div className="flex justify-center space-x-4 mb-16">
            <Link href="/auth/sign-up">
              <Button size="lg" className="px-8">
                Book Vaccination
              </Button>
            </Link>
            <Link href="/auth/sign-up?role=provider">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Join as Provider
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-600">For Patients</CardTitle>
                <CardDescription>Manage your vaccination records and book appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li>• Digital vaccination certificates</li>
                  <li>• Easy appointment booking</li>
                  <li>• Vaccination reminders</li>
                  <li>• Secure health records</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-600">For Providers</CardTitle>
                <CardDescription>Streamline your vaccination services</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li>• Patient management dashboard</li>
                  <li>• Appointment scheduling</li>
                  <li>• Digital record keeping</li>
                  <li>• Certificate generation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-600">For Administrators</CardTitle>
                <CardDescription>Comprehensive system oversight</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li>• System-wide analytics</li>
                  <li>• User management</li>
                  <li>• Vaccine inventory</li>
                  <li>• Compliance reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
