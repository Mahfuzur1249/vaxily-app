import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, Shield, Calendar, MapPin, User, Hash } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface CertificateViewPageProps {
  params: { id: string }
}

export default async function CertificateViewPage({ params }: CertificateViewPageProps) {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // Get vaccination record with details
  const { data: vaccination } = await supabase
    .from("vaccination_records")
    .select(`
      *,
      vaccines (name, manufacturer, type, description),
      profiles!vaccination_records_provider_id_fkey (full_name, clinic_name, license_number)
    `)
    .eq("id", params.id)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .single()

  if (!vaccination) notFound()

  // Get user profile
  const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const certificateId = `CERT-${vaccination.id.slice(0, 8).toUpperCase()}`

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Link href="/dashboard/certificates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Certificates
          </Button>
        </Link>
      </div>

      {/* Certificate Preview */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VACCINATION CERTIFICATE</h1>
                <p className="text-sm text-gray-600">Official Digital Certificate</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Verified & Authentic
            </Badge>
          </div>

          {/* Certificate Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Patient Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{userProfile?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">
                      {userProfile?.date_of_birth
                        ? new Date(userProfile.date_of_birth).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Hash className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Certificate ID</p>
                    <p className="font-medium font-mono">{certificateId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vaccination Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Vaccination Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Vaccine</p>
                  <p className="font-medium">{vaccination.vaccines?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Manufacturer</p>
                  <p className="font-medium">{vaccination.vaccines?.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Batch Number</p>
                  <p className="font-medium font-mono">{vaccination.batch_number}</p>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Vaccination Date</p>
                    <p className="font-medium">{new Date(vaccination.vaccination_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Information */}
          <div className="border-t pt-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Provider</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Clinic/Provider</p>
                  <p className="font-medium">{vaccination.profiles?.clinic_name || vaccination.profiles?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-3 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">License Number</p>
                  <p className="font-medium font-mono">{vaccination.profiles?.license_number || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t pt-6">
            <p>This certificate is digitally verified and tamper-proof.</p>
            <p>Generated on {new Date().toLocaleDateString()} via VAXILY Health Platform</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="mt-6 flex justify-center">
        <Link href={`/api/certificates/${vaccination.id}/download`}>
          <Button size="lg">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Certificate
          </Button>
        </Link>
      </div>
    </div>
  )
}
