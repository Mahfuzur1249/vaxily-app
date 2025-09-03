import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Plus, Edit, Trash2 } from "lucide-react"

interface Vaccine {
  id: string
  name: string
  manufacturer: string
  description: string
  price: number
  doses_required: number
  is_active: boolean
  age_group: string
}

interface VaccineInventoryProps {
  vaccines: Vaccine[]
}

export function VaccineInventory({ vaccines }: VaccineInventoryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Vaccine Inventory
            </CardTitle>
            <CardDescription>Manage available vaccines and pricing</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Vaccine
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vaccines.map((vaccine) => (
            <div key={vaccine.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{vaccine.name}</h3>
                  <Badge variant={vaccine.is_active ? "default" : "secondary"}>
                    {vaccine.is_active ? "Active" : "Inactive"}
                  </Badge>
                  {vaccine.doses_required > 1 && <Badge variant="outline">{vaccine.doses_required} doses</Badge>}
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Manufacturer:</span> {vaccine.manufacturer}
                  </div>
                  <div>
                    <span className="font-medium">Age Group:</span> {vaccine.age_group || "All ages"}
                  </div>
                  <div>
                    <span className="font-medium">Price:</span> ${vaccine.price}
                  </div>
                </div>
                {vaccine.description && <p className="text-sm text-gray-600 mt-2">{vaccine.description}</p>}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
