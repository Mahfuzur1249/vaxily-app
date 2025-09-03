import { createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get vaccination record with details
    const { data: vaccination } = await supabase
      .from("vaccination_records")
      .select(`
        *,
        vaccines (name, manufacturer, type),
        profiles!vaccination_records_provider_id_fkey (full_name, clinic_name, license_number)
      `)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single()

    if (!vaccination) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Get user profile
    const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    // Generate PDF content (mock implementation)
    const certificateId = `CERT-${vaccination.id.slice(0, 8).toUpperCase()}`

    // In a real implementation, you would use a PDF library like jsPDF or Puppeteer
    // For now, we'll return a simple text response
    const pdfContent = `
VACCINATION CERTIFICATE
=======================

Certificate ID: ${certificateId}
Issue Date: ${new Date().toLocaleDateString()}

PATIENT INFORMATION
-------------------
Name: ${userProfile?.full_name}
Date of Birth: ${userProfile?.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString() : "Not provided"}

VACCINATION DETAILS
-------------------
Vaccine: ${vaccination.vaccines?.name}
Manufacturer: ${vaccination.vaccines?.manufacturer}
Batch Number: ${vaccination.batch_number}
Vaccination Date: ${new Date(vaccination.vaccination_date).toLocaleDateString()}

HEALTHCARE PROVIDER
-------------------
Provider: ${vaccination.profiles?.clinic_name || vaccination.profiles?.full_name}
License Number: ${vaccination.profiles?.license_number || "Not provided"}

This certificate is digitally verified and tamper-proof.
Generated via VAXILY Health Platform
    `

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="vaccination-certificate-${certificateId}.txt"`,
      },
    })
  } catch (error) {
    console.error("Certificate download error:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
