import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, FileText } from "lucide-react"
import Link from "next/link"

interface VaccinationRecord {
  id: string
  date_administered: string
  lot_number: string
  dose_number: number
  certificate_issued: boolean
  vaccines: {
    name: string
    manufacturer: string
  }
  profiles: {
    full_name: string
    provider_clinic_name: string
  } | null
}

interface VaccinationHistoryProps {
  vaccinations: VaccinationRecord[]
}

export function VaccinationHistory({ vaccinations }: VaccinationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vaccination History</CardTitle>
            <CardDescription>Your complete immunization record</CardDescription>
          </div>
          <Link href="/dashboard/records">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {vaccinations.length > 0 ? (
          <div className="space-y-4">
            {vaccinations.slice(0, 3).map((vaccination) => (
              <div key={vaccination.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{vaccination.vaccines.name}</h3>
                    <Badge variant="secondary">Dose {vaccination.dose_number}</Badge>
                    {vaccination.certificate_issued && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <FileText className="w-3 h-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(vaccination.date_administered).toLocaleDateString()}
                    </div>
                    {vaccination.profiles && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {vaccination.profiles.provider_clinic_name || vaccination.profiles.full_name}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {vaccination.vaccines.manufacturer} • Lot: {vaccination.lot_number}
                  </p>
                </div>
                {vaccination.certificate_issued && (
                  <Button variant="outline" size="sm">
                    Download Certificate
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccination records</h3>
            <p className="text-gray-600 mb-4">Start by booking your first vaccination appointment</p>
            <Link href="/dashboard/book">
              <Button>Book Appointment</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
