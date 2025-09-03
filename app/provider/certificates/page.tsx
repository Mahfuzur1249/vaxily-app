import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, User, Calendar, FileText, Download } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ProviderCertificatesPage() {
  const supabase = createServerClient()

  let user
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (error) {
    console.error("Error getting user:", error)
    redirect("/auth/login")
  }

  if (!user) redirect("/auth/login")

  // Verify provider role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "provider") redirect("/dashboard")

  // Get vaccination records administered by this provider
  const { data: vaccinations } = await supabase
    .from("vaccination_records")
    .select(`
      *,
      vaccines (name, manufacturer, type),
      profiles!vaccination_records_user_id_fkey (full_name, email)
    `)
    .eq("provider_id", user.id)
    .eq("status", "completed")
    .order("vaccination_date", { ascending: false })

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Management</h1>
        <p className="text-gray-600">Manage vaccination certificates for your patients</p>
      </div>

      {vaccinations && vaccinations.length > 0 ? (
        <div className="grid gap-6">
          {vaccinations.map((vaccination) => (
            <Card key={vaccination.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-gray-900">{vaccination.profiles?.full_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {vaccination.vaccines?.name} • {vaccination.vaccines?.manufacturer}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Shield className="w-3 h-3 mr-1" />
                    Certificate Issued
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    Patient: {vaccination.profiles?.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date: {new Date(vaccination.vaccination_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Batch: {vaccination.batch_number}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href={`/provider/certificates/${vaccination.id}/view`}>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600">Complete patient vaccinations to generate certificates</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
