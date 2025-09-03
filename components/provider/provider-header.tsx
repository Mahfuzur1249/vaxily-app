"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Stethoscope, User, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ProviderHeaderProps {
  user: {
    full_name: string
    email: string
    provider_clinic_name: string | null
  }
}

export function ProviderHeader({ user }: ProviderHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/provider" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Stethoscope className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-gray-900">VAXILY Provider</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/provider" className="text-gray-700 hover:text-green-600 font-medium">
              Dashboard
            </Link>
            <Link href="/provider/appointments" className="text-gray-700 hover:text-green-600 font-medium">
              Appointments
            </Link>
            <Link href="/provider/patients" className="text-gray-700 hover:text-green-600 font-medium">
              Patients
            </Link>
            <Link href="/provider/vaccinations" className="text-gray-700 hover:text-green-600 font-medium">
              Vaccinations
            </Link>
            <Link href="/provider/certificates" className="text-gray-700 hover:text-green-600 font-medium">
              Certificates
            </Link>
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-100 text-green-600">{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user.full_name}</div>
                  <div className="text-xs text-gray-500">{user.provider_clinic_name}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Provider Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/provider/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/provider/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
