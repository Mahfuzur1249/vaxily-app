import { Badge } from "@/components/ui/badge"
import { Shield, Clock, X } from "lucide-react"

interface CertificateStatusProps {
  status: "available" | "pending" | "unavailable"
  vaccinationDate?: string
}

export function CertificateStatus({ status, vaccinationDate }: CertificateStatusProps) {
  if (status === "available") {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        <Shield className="w-3 h-3 mr-1" />
        Certificate Available
      </Badge>
    )
  }

  if (status === "pending") {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Processing Certificate
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
      <X className="w-3 h-3 mr-1" />
      No Certificate
    </Badge>
  )
}
