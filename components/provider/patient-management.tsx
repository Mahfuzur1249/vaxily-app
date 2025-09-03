import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Phone, Mail, FileText } from "lucide-react"

interface Patient {
  user_id: string
  date_administered: string
  profiles: {
    full_name: string
    email: string
    phone: string | null
  }
}

interface PatientManagementProps {
  patients: Patient[]
}

export function PatientManagement({ patients }: PatientManagementProps) {
  // Remove duplicates based on user_id
  const uniquePatients = patients.filter(
    (patient, index, self) => index === self.findIndex((p) => p.user_id === patient.user_id),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Patients
            </CardTitle>
            <CardDescription>Patients you've recently treated</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All Patients
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {uniquePatients.length > 0 ? (
          <div className="space-y-4">
            {uniquePatients.slice(0, 5).map((patient) => (
              <div key={patient.user_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{patient.profiles.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900">{patient.profiles.full_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {patient.profiles.email}
                      </div>
                      {patient.profiles.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {patient.profiles.phone}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Last visit: {new Date(patient.date_administered).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    Records
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
            <p className="text-gray-600">Start administering vaccinations to see your patients here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
