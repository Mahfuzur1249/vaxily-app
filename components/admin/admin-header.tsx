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
import { Settings, LogOut, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminHeaderProps {
  user: {
    full_name: string
    email: string
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
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
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-gray-900">VAXILY Admin</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/admin" className="text-gray-700 hover:text-red-600 font-medium">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-gray-700 hover:text-red-600 font-medium">
              Users
            </Link>
            <Link href="/admin/providers" className="text-gray-700 hover:text-red-600 font-medium">
              Providers
            </Link>
            <Link href="/admin/vaccines" className="text-gray-700 hover:text-red-600 font-medium">
              Vaccines
            </Link>
            <Link href="/admin/bookings" className="text-gray-700 hover:text-red-600 font-medium">
              Bookings
            </Link>
            <Link href="/admin/support" className="text-gray-700 hover:text-red-600 font-medium">
              Support
            </Link>
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-red-100 text-red-600">{user.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{user.full_name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
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
