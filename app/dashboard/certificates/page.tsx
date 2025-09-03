import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, Shield, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CertificatesPage() {
  const supabase = createServerClient()

  let user = null
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    user = authUser
  } catch (error) {
    console.error("Auth error:", error)
    redirect("/auth/login")
  }

  if (!user) redirect("/auth/login")

  // Get user's vaccination records with certificates
  const { data: vaccinations } = await supabase
    .from("vaccination_records")
    .select(`
      *,
      vaccines (name, manufacturer, type),
      profiles!vaccination_records_provider_id_fkey (full_name, clinic_name)
    `)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("vaccination_date", { ascending: false })

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Vaccination Certificates</h1>
        <p className="text-gray-600">Download and manage your official vaccination certificates</p>
      </div>

      {vaccinations && vaccinations.length > 0 ? (
        <div className="grid gap-6">
          {vaccinations.map((vaccination) => (
            <Card key={vaccination.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{vaccination.vaccines?.name} Certificate</CardTitle>
                    <CardDescription className="mt-1">
                      {vaccination.vaccines?.manufacturer} • {vaccination.vaccines?.type}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Vaccinated: {new Date(vaccination.vaccination_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    Provider: {vaccination.profiles?.clinic_name || vaccination.profiles?.full_name}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/dashboard/certificates/${vaccination.id}/view`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                  </Link>
                  <Link href={`/api/certificates/${vaccination.id}/download`}>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Available</h3>
            <p className="text-gray-600 mb-6">Complete your vaccinations to receive official certificates</p>
            <Link href="/dashboard/book">
              <Button>Book Vaccination</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
